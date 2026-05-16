## Context

The portfolio currently has three backstage admin pages (Works, Skills, Users) built with Flowbite React + Tailwind CSS, while the public-facing site uses a bespoke warm cream design system (`design-tokens.css`, `design-shell.css`). The admin pages cannot share design tokens with the public site, creating maintenance friction. No admin feature exists for editing bilingual text content in the hero, about, or experience sections — all of which live in the hardcoded `frontend/src/content/portfolio.ts` file. Analytics data is absent from the admin view. The backend (Cloudflare Workers + Hono + D1) already has auth, works/skills CRUD, and image upload; this change extends it with three new domains: content blocks, experiences, and analytics.

## Goals / Non-Goals

**Goals:**

- Replace Flowbite/Tailwind admin UI with the warm cream design system, making admin and public site share the same CSS custom properties
- Provide a content editor that lets an admin update bilingual text without touching source code; frontend gracefully falls back to `portfolio.ts` static values when DB has no override
- Surface real Cloudflare Analytics visitor counts (total requests + unique visitors, 30-day window) in the Overview dashboard
- Create a structured work-experience table in D1 that replaces the hardcoded `experience` array in `portfolio.ts`
- Provide a settings page to store site metadata (title, tagline, email, location) as content blocks

**Non-Goals:**

- Real-time analytics or custom event tracking beyond what CF Analytics provides
- Role-based access control beyond the existing admin/non-admin binary
- Rich-text (WYSIWYG) editing — plain textarea with newline-separated paragraphs is sufficient
- Messages inbox (DB table created for future use, no admin UI in this change)
- Image upload for content editor (only text fields)
- Audit log / operation history

## Decisions

### Admin CSS: Shared Design Tokens, Dedicated Admin Layout File

**Decision**: Create `frontend/src/styles/design-admin.css` that imports no new tokens but uses the same `--bg`, `--ink`, `--accent-y` etc. already defined in `design-tokens.css`. The admin sidebar uses two hardcoded theme-lock variables (`--admin-side-bg: #0a0805`, `--admin-side-text: rgba(245,240,226,0.70)`) that never flip with the light/dark toggle.

**Why not keep Flowbite**: Flowbite injects Tailwind utilities that conflict with BEM class conventions used in `design-shell.css`. Maintaining two parallel styling systems doubles the cognitive load and prevents token-driven theming in admin pages.

**Alternative considered**: Tailwind CSS variables layer — rejected because the public site does not use Tailwind at all; adopting it for admin only deepens the inconsistency.

### Content Storage: Key-Value `content_blocks` + Structured `experiences`

**Decision**: Use two separate tables.
- `content_blocks (key TEXT, lang TEXT, value TEXT, PRIMARY KEY(key, lang))` for flat bilingual text (hero greeting, about paragraphs, settings metadata).
- `experiences (id, sort_order, from_year, to_year, role_en, role_zh, org_en, org_zh, location, tags, bullets_en, bullets_zh, note_en, note_zh)` for structured repeated entries.

**Why not a single JSON blob**: A single `site_content` JSON column cannot be partially updated safely with concurrent writes. Key-value rows allow targeted upserts without full-document rewrites.

**Why not extend `self_content`**: `self_content` has a fixed schema; adding more columns for every new content field would require migrations for each text tweak. The key-value store is open-ended.

**Why separate `experiences` table**: Experience entries are ordered lists of structured records (role, org, years, location, tags, bullets) that benefit from individual row CRUD, sort order management, and future querying. Storing them as JSON inside `content_blocks` would make sort-order updates and per-entry deletes unnecessarily complex.

Tags and bullets are stored as JSON-serialized string arrays in text columns. This keeps the migration SQLite-simple while letting the frontend render the exact tag chips and bullet list edited in backstage.

### Frontend Content Fallback: Hook-Based API-First with Static Fallback

**Decision**: Introduce `usePageContent(keys)` and `useExperiences()` hooks. On mount, each hook calls the API. If the API returns a value for a key, that value is used. If the key is absent (empty DB), the hook returns the corresponding value from `portfolio.ts`. The fetch result is cached in module-level memory for the lifetime of the page session (no localStorage — avoid stale content across deployments).

**Why not replace `portfolio.ts` entirely**: The static file is the authoritative default and the source of truth during development and on fresh deploys. Removing it would mean the site displays nothing until an admin has entered content via the editor.

**Why not use React Query**: The project does not currently have React Query. Adding it for two hooks would introduce an unnecessary dependency. Simple `useEffect` + `useState` with a module-level Map cache is sufficient.

### Cloudflare Analytics Proxy: Backend Route, Not Direct Client Call

**Decision**: Analytics calls go through a new backend route `GET /api/admin/analytics?days=30` (admin-only). The Workers route reads `CF_ANALYTICS_API_TOKEN` and `CF_ZONE_ID` from the environment and forwards a GraphQL query to `https://api.cloudflare.com/client/v4/graphql`. The frontend receives a normalized `{ totalRequests, uniqueVisitors, daily[] }` response.

**Why not call CF Analytics from the frontend**: The API token must remain secret. Exposing it in a frontend bundle violates the CF security model.

**Why Workers (not a separate service)**: Workers already host all other API routes; adding one more route avoids a new deployment target.

**CF Analytics GraphQL query pattern**:
```graphql
{ viewer { zones(filter: { zoneTag: $zoneId }) {
  httpRequests1dGroups(limit: 30, filter: { date_geq: $startDate }) {
    dimensions { date }
    sum { requests }
    uniq { uniques }
  }
}}}
```

### AdminShell: Outlet-based Layout, Not HOC

**Decision**: `AdminShell.tsx` renders the always-dark sidebar, the topbar, and an `<Outlet />` for child routes. React Router's nested route configuration wraps all `/backstage/*` routes under `AdminShell`. Auth guard (redirect to `/login` if no JWT) lives in `AdminShell`.

**Why not HOC or context**: Nested routes with `<Outlet />` is the idiomatic React Router v6 pattern and requires no prop drilling for layout content.

## Risks / Trade-offs

- **CF Analytics API availability**: If the CF Analytics API is unavailable or the token is misconfigured, `/api/admin/analytics` will return an error. The Overview page should display an empty state rather than crash. → Mitigation: wrap the GraphQL fetch in try/catch; return `{ error: true }` which the frontend renders as "Analytics unavailable".

- **content_blocks key sprawl**: With an open-ended key-value table, typos in key names silently create orphan rows. → Mitigation: define all valid keys as a TypeScript const enum in `contentBlocks.ts` (both frontend and backend share the list via a shared types file or documentation).

- **Flowbite removal may break existing admin pages temporarily**: Works, Skills, Users pages rely on Flowbite Modal, Table, and Button components. Removing Flowbite before `.dt-wrap`, `.modal`, and `.field` CSS is complete will break those pages. → Mitigation: implement `design-admin.css` and replace all Flowbite components in the same PR; never remove Flowbite before replacements are live.

- **experiences sort_order management**: Without drag-and-drop, sort order must be edited numerically. → Accepted trade-off for v1; drag-and-drop can be added later.

## Migration Plan

1. Apply DB migration `0003_content_experiences_messages.sql` via `wrangler d1 migrations apply bruno-portfolio-db --remote`
2. Seed initial experience entries from `portfolio.ts` via a one-time admin API call (or direct D1 insert) so the editor shows existing data on first load
3. Deploy updated Workers bundle (new routes) before deploying frontend (public GET endpoints must exist before the frontend hooks try to call them)
4. Deploy frontend — hooks will get empty results initially and fall back to `portfolio.ts` until an admin saves content
5. Set Wrangler secrets: `wrangler secret put CF_ANALYTICS_API_TOKEN` and `wrangler secret put CF_ZONE_ID`

**Rollback**: Remove new routes from `index.ts` and redeploy Workers; frontend hooks fall back to `portfolio.ts` seamlessly since API returns 404 for unknown routes.

## Open Questions

- Which CF Analytics zone tag maps to `portfolio.jackhellowin.win`? → Confirm zone ID from Cloudflare dashboard before setting `CF_ZONE_ID` secret.
- Should the settings page also expose social link editing (currently in `social_media` table)? → Not in scope for this change; social links are already editable via the existing API.
