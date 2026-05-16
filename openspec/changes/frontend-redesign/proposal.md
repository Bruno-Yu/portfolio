## Why

The previous FrontStage is a generic layout (top Navbar + full-width pages) with no design identity.
The portfolio needs a distinctive visual system — warm cream + black ink + yellow accent — implemented as
a custom BEM CSS design system, with a persistent Rail sidebar, single-page scroll Home, and a reworked
Works / Login page.

Admin (BackStage) design is not yet finalized; it will be addressed in a follow-up once the new design
is confirmed in production.

## What Changes

### Already implemented (on `feat/design` branch)

- **CSS design system**: 4 CSS files under `frontend/src/styles/` (design-tokens, design-shell, design-pages, design-admin) replacing Tailwind-only styling for FrontStage
- **Rail sidebar**: `frontend/src/components/Layout/FrontStage/Rail.tsx` — persistent 280 px left nav with lang/theme toggle and scroll-spy
- **FrontStage layout**: `frontend/src/components/Layout/FrontStage/index.tsx` updated to shell grid (Rail + main column)
- **Home — 7 sections** (`frontend/src/views/FrontStage/Home/sections/`): Hero, About, Experience, Works, Skills, Services, Contact
- **Works page** (`frontend/src/views/FrontStage/Works/index.tsx`): new card + modal design using BEM classes
- **Login page** (`frontend/src/views/FrontStage/Login/index.tsx`): two-column layout with stamp image
- **UI state**: Redux `ui-slice.ts` for `lang` (en/zh) and `theme` (light/dark), persisted to localStorage
- **Static content**: `frontend/src/content/portfolio.ts` for About facts, Experience timeline, Services, Contact meta
- **Image assets**: `frontend/public/images/` (avatar.webp, stamp.webp, contact_me.webp, logo.webp, cure_*.svg)

### Pending (required before merge to main)

- **Admin BackStage redesign**: no design mockup yet; must be done before merge so the full UI is consistent
- **BackStage works form — image field**: after R2 feature lands on `main`, the works form must adopt the R2 upload/delete API (not the legacy Imgur URL input) as part of the new Admin design
- **Portfolio copy review**: Rewrite Chinese-first portfolio copy from an employer / HR perspective while preserving the current visual rhythm. The site remains a portfolio, not a full resume, but every visible sentence should withstand resume-style screening. Copy must clarify Bruno's positioning as a front-end engineer with full-stack collaboration ability, remove overly forced or casual phrasing, and keep text length close enough to the current layout so Hero, About, Works cards, Services, and Contact do not visually collapse or overflow.
- **Scroll-spy wiring**: IntersectionObserver → Rail active state needs full end-to-end testing on mobile widths

## Non-Goals

- No changes to the BackStage layout until the Admin design mockup is ready
- No changes to the API or D1 schema
- No Cloudflare Images or paid CDN services

## Capabilities

### New Capabilities

- `frontstage-design-system`: BEM CSS design system with warm cream + black ink + yellow accent tokens, dark mode, responsive layout
- `frontstage-rail-nav`: Persistent Rail sidebar with lang/theme toggle, social links, scroll-spy active state
- `frontstage-home-sections`: Single-page scroll Home with 7 distinct sections (Hero through Contact)
- `frontstage-works-page`: Redesigned Works page with card grid, modal detail view, and pagination

### Modified Capabilities

- `frontstage-login`: Login page redesigned to two-column layout

## Impact

- Affected specs: `frontstage-design-system`, `frontstage-rail-nav`, `frontstage-home-sections`, `frontstage-works-page`, `frontstage-login`
- Affected code:
  - `frontend/src/styles/design-*.css` — new
  - `frontend/src/components/Layout/FrontStage/Rail.tsx` — new
  - `frontend/src/components/Layout/FrontStage/index.tsx` — modified
  - `frontend/src/views/FrontStage/Home/sections/*.tsx` — new (7 files)
  - `frontend/src/views/FrontStage/Home/index.tsx` — modified
  - `frontend/src/views/FrontStage/Works/index.tsx` — modified
  - `frontend/src/views/FrontStage/Login/index.tsx` — modified
  - `frontend/src/store/ui-slice.ts` — new
  - `frontend/src/content/portfolio.ts` — new
  - `frontend/index.html` — Google Fonts added; SEO / OG / title copy modified
  - `frontend/src/index.css` — design CSS imports added
  - `data-migration/db.json` — modified portfolio work descriptions and self-content seed copy
  - `workers/scripts/seed.sql` — modified seed copy to match migration data
  - `workers/migrations/0001_seed.sql` — modified existing seed migration copy only if this migration is still used as the canonical seed source
  - `frontend/README.md` — modified public project summary so years, role, and positioning match the site
