## Why

The portfolio's admin backstage currently has three isolated pages (Works, Skills, Users) built with Flowbite/Tailwind that are visually inconsistent with the portfolio's warm cream design system. Critical admin features — content editing, analytics overview, and site settings — are missing entirely. Editors cannot update the frontend's bilingual hero/about/experience text without touching source code.

## What Changes

- **New DB tables**: `content_blocks` (bilingual key-value store), `experiences` (structured work history), `messages` (contact inquiry inbox)
- **New API routes**: `/api/content-blocks` (public GET, admin POST), `/api/experiences` (public GET, admin CRUD), `/api/admin/analytics` (admin-only, proxies CF Analytics GraphQL), `/api/messages` (admin CRUD)
- **New admin CSS design system**: `design-admin.css` — warm cream + always-dark sidebar, replaces Flowbite across all admin pages
- **New AdminShell layout**: persistent sidebar + topbar component shared by all backstage routes
- **New Content Editor page** (`/backstage/content`): bilingual text editor for hero, about paragraphs, and structured work experience timeline including location, tags, and language-specific bullets; saves to DB; frontend falls back to static `portfolio.ts` when DB has no override
- **New Overview Dashboard** (`/backstage/overview`): 4 stat cards with real visit/unique-visitor counts from Cloudflare Analytics GraphQL API + 30-day sparkline chart
- **New Settings page** (`/backstage/settings`): site metadata form (title, tagline, email, location) stored in `content_blocks`
- **Redesigned Works / Skills / Users pages**: functionally unchanged, visual layer replaced with `design-admin.css` components (`.dt-wrap`, `.modal`, `.field`, `.icon-btn`)
- **Frontend content hooks**: `usePageContent` + `useExperiences` hooks fetch from API and fall back to static values; HeroSection, AboutSection, ExperienceSection updated accordingly

## Capabilities

### New Capabilities

- `admin-shell`: Shared AdminShell layout with always-dark sidebar, topbar breadcrumbs, and warm cream content area; establishes routing structure for all backstage pages
- `content-blocks-api`: Backend API and DB schema for bilingual content blocks (`content_blocks` table) and work experience entries (`experiences` table); includes public GET and admin CRUD endpoints
- `content-editor`: Frontend backstage page for editing bilingual hero, about, and experience content including tags/bullets; saves to content-blocks-api; frontend components fall back to static `portfolio.ts` when no override exists
- `analytics-dashboard`: Overview page showing real visitor stats sourced from Cloudflare Analytics GraphQL API (`httpRequests1dGroups`); includes 30-day sparkline SVG chart
- `settings-page`: Backstage settings page for editing site metadata (title, tagline, email, location) via `content_blocks` table; change-password form via new `/api/auth/change-password` endpoint
- `admin-ui-system`: Warm cream admin design system (`design-admin.css`) replacing Flowbite/Tailwind across all backstage pages; covers data tables, modals, forms, stat cards, and nav components

### Modified Capabilities

(none)

## Impact

- **New DB migration**: `workers/migrations/0003_content_experiences_messages.sql`
- **New Drizzle schemas**: `workers/src/drizzle/schema/contentBlocks.ts`, `workers/src/drizzle/schema/experiences.ts`, `workers/src/drizzle/schema/messages.ts`
- **New API routes**: `workers/src/routes/contentBlocks.ts`, `workers/src/routes/experiences.ts`, `workers/src/routes/analytics.ts`, `workers/src/routes/messages.ts`
- **Modified**: `workers/src/index.ts` (mount 4 new routes), `workers/src/drizzle/schema/index.ts` (export new schemas)
- **New CSS**: `frontend/src/styles/design-admin.css`
- **Modified**: `frontend/src/main.tsx` (import design-admin.css, remove Flowbite import)
- **New components**: `frontend/src/components/Layout/BackStage/AdminShell.tsx`, `frontend/src/components/Layout/BackStage/AdminPageHead.tsx`
- **New hooks**: `frontend/src/hooks/usePageContent.ts`, `frontend/src/hooks/useExperiences.ts`
- **New pages**: `frontend/src/views/BackStage/Overview/index.tsx`, `frontend/src/views/BackStage/Content/index.tsx`, `frontend/src/views/BackStage/Settings/index.tsx`
- **Redesigned pages**: `frontend/src/views/BackStage/Works/index.tsx`, `frontend/src/views/BackStage/Skills/index.tsx`, `frontend/src/views/BackStage/Users/index.tsx`
- **Modified frontend sections**: `frontend/src/views/FrontStage/Home/sections/HeroSection.tsx`, `AboutSection.tsx`, `ExperienceSection.tsx`
- **Modified router**: `frontend/src/router/index.tsx` (add new routes under AdminShell layout)
- **New Wrangler secrets**: `CF_ANALYTICS_API_TOKEN`, `CF_ZONE_ID` (for Cloudflare Analytics proxy)
