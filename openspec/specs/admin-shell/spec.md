# admin-shell Specification

## Purpose

TBD - created by archiving change 'backstage-dashboard-v2'. Update Purpose after archive.

## Requirements

### Requirement: Shared admin layout with always-dark sidebar

The system SHALL render all backstage pages (`/backstage/*`) inside `AdminShell.tsx`, which provides an always-dark sidebar (background `#0a0805`, cream text) and a topbar. The sidebar's dark background SHALL NOT change when the user toggles light/dark theme.

#### Scenario: Sidebar remains dark in light mode

- **WHEN** the global theme is set to light
- **THEN** the admin sidebar background SHALL remain `#0a0805` and sidebar text SHALL remain cream-colored

#### Scenario: Sidebar remains dark in dark mode

- **WHEN** the global theme is set to dark
- **THEN** the admin sidebar background SHALL remain `#0a0805` (indistinguishable from dark mode but still hardcoded, not driven by `--bg` token)


<!-- @trace
source: backstage-dashboard-v2
updated: 2026-05-10
code:
  - frontend/src/components/Layout/BackStage/AdminPageHead.tsx
  - workers/src/drizzle/schema/messages.ts
  - workers/wrangler.toml
  - frontend/src/views/BackStage/Messages/index.tsx
  - frontend/src/components/Layout/BackStage/AdminShell.tsx
  - frontend/src/styles/design-shell.css
  - frontend/src/views/BackStage/Users/index.tsx
  - frontend/src/views/FrontStage/Home/sections/ContactSection.tsx
  - workers/src/routes/messages.ts
  - frontend/src/layout/Layout.tsx
  - frontend/src/views/FrontStage/Home/index.tsx
  - frontend/public/_routes.json
  - frontend/src/Hooks/useExperiences.ts
  - workers/src/drizzle/schema/experiences.ts
  - frontend/src/styles/design-admin.css
  - frontend/src/views/FrontStage/Home/sections/HeroSection.tsx
  - frontend/src/config.ts
  - frontend/src/views/BackStage/Works/index.tsx
  - frontend/src/App.tsx
  - frontend/src/content/apiFallback.ts
  - workers/src/routes/auth.ts
  - frontend/public/images/avatar.webp
  - frontend/src/views/BackStage/Content/index.tsx
  - frontend/src/content/portfolio.ts
  - workers/src/drizzle/schema/contentBlocks.ts
  - workers/src/routes/contentBlocks.ts
  - frontend/src/views/BackStage/Overview/index.tsx
  - workers/migrations/0003_content_experiences_messages.sql
  - workers/src/drizzle/schema/index.ts
  - frontend/src/views/FrontStage/Works/index.tsx
  - frontend/src/api/request.ts
  - workers/src/routes/experiences.ts
  - frontend/tailwind.config.js
  - frontend/src/views/FrontStage/Login/index.tsx
  - frontend/src/views/BackStage/Skills/index.tsx
  - frontend/src/Hooks/usePageContent.ts
  - frontend/src/views/FrontStage/Home/sections/ContactGlobe.tsx
  - frontend/vite.config.ts
  - frontend/src/views/BackStage/Settings/index.tsx
  - frontend/src/views/FrontStage/Home/sections/AboutSection.tsx
  - workers/src/index.ts
  - workers/src/routes/analytics.ts
  - frontend/src/views/FrontStage/Home/sections/ExperienceSection.tsx
  - workers/src/routes/upload.ts
  - frontend/src/components/Layout/FrontStage/Rail.tsx
  - frontend/package.json
  - frontend/src/styles/design-tokens.css
  - workers/migrations/0004_experience_rich_content.sql
-->

---
### Requirement: Admin sidebar navigation

The sidebar SHALL display navigation groups and items matching the design spec: brand section ("BackStage" without a V2 suffix), navigation group DASHBOARD (Overview), navigation group MANAGE (Content, Works with badge count, Skills, Users, Messages), navigation group SYSTEM (Settings), and a user info footer with a circular user avatar and Logout button.

#### Scenario: Active nav item highlighted

- **WHEN** the current route is `/backstage/overview`
- **THEN** the Overview nav item SHALL display a yellow (`--accent-y`) left border and the item text SHALL use the accent color

#### Scenario: Works badge shows published count

- **WHEN** the sidebar renders
- **THEN** the Works nav item SHALL display a numeric badge showing the count of published works fetched from `GET /api/works`

#### Scenario: Logout clears auth and redirects

- **WHEN** the user clicks the Logout button in the sidebar footer
- **THEN** the system SHALL remove the JWT from localStorage, call `POST /api/auth/logout`, and redirect to `/login`


<!-- @trace
source: backstage-dashboard-v2
updated: 2026-05-10
code:
  - frontend/src/components/Layout/BackStage/AdminPageHead.tsx
  - workers/src/drizzle/schema/messages.ts
  - workers/wrangler.toml
  - frontend/src/views/BackStage/Messages/index.tsx
  - frontend/src/components/Layout/BackStage/AdminShell.tsx
  - frontend/src/styles/design-shell.css
  - frontend/src/views/BackStage/Users/index.tsx
  - frontend/src/views/FrontStage/Home/sections/ContactSection.tsx
  - workers/src/routes/messages.ts
  - frontend/src/layout/Layout.tsx
  - frontend/src/views/FrontStage/Home/index.tsx
  - frontend/public/_routes.json
  - frontend/src/Hooks/useExperiences.ts
  - workers/src/drizzle/schema/experiences.ts
  - frontend/src/styles/design-admin.css
  - frontend/src/views/FrontStage/Home/sections/HeroSection.tsx
  - frontend/src/config.ts
  - frontend/src/views/BackStage/Works/index.tsx
  - frontend/src/App.tsx
  - frontend/src/content/apiFallback.ts
  - workers/src/routes/auth.ts
  - frontend/public/images/avatar.webp
  - frontend/src/views/BackStage/Content/index.tsx
  - frontend/src/content/portfolio.ts
  - workers/src/drizzle/schema/contentBlocks.ts
  - workers/src/routes/contentBlocks.ts
  - frontend/src/views/BackStage/Overview/index.tsx
  - workers/migrations/0003_content_experiences_messages.sql
  - workers/src/drizzle/schema/index.ts
  - frontend/src/views/FrontStage/Works/index.tsx
  - frontend/src/api/request.ts
  - workers/src/routes/experiences.ts
  - frontend/tailwind.config.js
  - frontend/src/views/FrontStage/Login/index.tsx
  - frontend/src/views/BackStage/Skills/index.tsx
  - frontend/src/Hooks/usePageContent.ts
  - frontend/src/views/FrontStage/Home/sections/ContactGlobe.tsx
  - frontend/vite.config.ts
  - frontend/src/views/BackStage/Settings/index.tsx
  - frontend/src/views/FrontStage/Home/sections/AboutSection.tsx
  - workers/src/index.ts
  - workers/src/routes/analytics.ts
  - frontend/src/views/FrontStage/Home/sections/ExperienceSection.tsx
  - workers/src/routes/upload.ts
  - frontend/src/components/Layout/FrontStage/Rail.tsx
  - frontend/package.json
  - frontend/src/styles/design-tokens.css
  - workers/migrations/0004_experience_rich_content.sql
-->

---
### Requirement: Admin topbar with breadcrumbs and actions

The topbar SHALL display breadcrumbs in the format `BACKSTAGE / <CURRENT PAGE>`, a search input (UI only, no backend search in v1), a language toggle (EN/中), a theme toggle, and a "View site" link that opens the public portfolio in a new tab.

#### Scenario: Breadcrumb updates on navigation

- **WHEN** the user navigates to `/backstage/content`
- **THEN** the topbar breadcrumb SHALL read `BACKSTAGE / CONTENT`


<!-- @trace
source: backstage-dashboard-v2
updated: 2026-05-10
code:
  - frontend/src/components/Layout/BackStage/AdminPageHead.tsx
  - workers/src/drizzle/schema/messages.ts
  - workers/wrangler.toml
  - frontend/src/views/BackStage/Messages/index.tsx
  - frontend/src/components/Layout/BackStage/AdminShell.tsx
  - frontend/src/styles/design-shell.css
  - frontend/src/views/BackStage/Users/index.tsx
  - frontend/src/views/FrontStage/Home/sections/ContactSection.tsx
  - workers/src/routes/messages.ts
  - frontend/src/layout/Layout.tsx
  - frontend/src/views/FrontStage/Home/index.tsx
  - frontend/public/_routes.json
  - frontend/src/Hooks/useExperiences.ts
  - workers/src/drizzle/schema/experiences.ts
  - frontend/src/styles/design-admin.css
  - frontend/src/views/FrontStage/Home/sections/HeroSection.tsx
  - frontend/src/config.ts
  - frontend/src/views/BackStage/Works/index.tsx
  - frontend/src/App.tsx
  - frontend/src/content/apiFallback.ts
  - workers/src/routes/auth.ts
  - frontend/public/images/avatar.webp
  - frontend/src/views/BackStage/Content/index.tsx
  - frontend/src/content/portfolio.ts
  - workers/src/drizzle/schema/contentBlocks.ts
  - workers/src/routes/contentBlocks.ts
  - frontend/src/views/BackStage/Overview/index.tsx
  - workers/migrations/0003_content_experiences_messages.sql
  - workers/src/drizzle/schema/index.ts
  - frontend/src/views/FrontStage/Works/index.tsx
  - frontend/src/api/request.ts
  - workers/src/routes/experiences.ts
  - frontend/tailwind.config.js
  - frontend/src/views/FrontStage/Login/index.tsx
  - frontend/src/views/BackStage/Skills/index.tsx
  - frontend/src/Hooks/usePageContent.ts
  - frontend/src/views/FrontStage/Home/sections/ContactGlobe.tsx
  - frontend/vite.config.ts
  - frontend/src/views/BackStage/Settings/index.tsx
  - frontend/src/views/FrontStage/Home/sections/AboutSection.tsx
  - workers/src/index.ts
  - workers/src/routes/analytics.ts
  - frontend/src/views/FrontStage/Home/sections/ExperienceSection.tsx
  - workers/src/routes/upload.ts
  - frontend/src/components/Layout/FrontStage/Rail.tsx
  - frontend/package.json
  - frontend/src/styles/design-tokens.css
  - workers/migrations/0004_experience_rich_content.sql
-->

---
### Requirement: Auth guard for all backstage routes

`AdminShell` SHALL check for a valid JWT on mount. If no token is present in localStorage or the token is expired, the system SHALL redirect to `/login` before rendering any child route.

#### Scenario: Unauthenticated access redirected

- **WHEN** an unauthenticated user navigates to `/backstage/overview`
- **THEN** the system SHALL redirect to `/login` without rendering the admin shell

#### Scenario: Authenticated user proceeds normally

- **WHEN** a user with a valid JWT navigates to `/backstage/overview`
- **THEN** the AdminShell SHALL render with the Overview page content in the main area

<!-- @trace
source: backstage-dashboard-v2
updated: 2026-05-10
code:
  - frontend/src/components/Layout/BackStage/AdminPageHead.tsx
  - workers/src/drizzle/schema/messages.ts
  - workers/wrangler.toml
  - frontend/src/views/BackStage/Messages/index.tsx
  - frontend/src/components/Layout/BackStage/AdminShell.tsx
  - frontend/src/styles/design-shell.css
  - frontend/src/views/BackStage/Users/index.tsx
  - frontend/src/views/FrontStage/Home/sections/ContactSection.tsx
  - workers/src/routes/messages.ts
  - frontend/src/layout/Layout.tsx
  - frontend/src/views/FrontStage/Home/index.tsx
  - frontend/public/_routes.json
  - frontend/src/Hooks/useExperiences.ts
  - workers/src/drizzle/schema/experiences.ts
  - frontend/src/styles/design-admin.css
  - frontend/src/views/FrontStage/Home/sections/HeroSection.tsx
  - frontend/src/config.ts
  - frontend/src/views/BackStage/Works/index.tsx
  - frontend/src/App.tsx
  - frontend/src/content/apiFallback.ts
  - workers/src/routes/auth.ts
  - frontend/public/images/avatar.webp
  - frontend/src/views/BackStage/Content/index.tsx
  - frontend/src/content/portfolio.ts
  - workers/src/drizzle/schema/contentBlocks.ts
  - workers/src/routes/contentBlocks.ts
  - frontend/src/views/BackStage/Overview/index.tsx
  - workers/migrations/0003_content_experiences_messages.sql
  - workers/src/drizzle/schema/index.ts
  - frontend/src/views/FrontStage/Works/index.tsx
  - frontend/src/api/request.ts
  - workers/src/routes/experiences.ts
  - frontend/tailwind.config.js
  - frontend/src/views/FrontStage/Login/index.tsx
  - frontend/src/views/BackStage/Skills/index.tsx
  - frontend/src/Hooks/usePageContent.ts
  - frontend/src/views/FrontStage/Home/sections/ContactGlobe.tsx
  - frontend/vite.config.ts
  - frontend/src/views/BackStage/Settings/index.tsx
  - frontend/src/views/FrontStage/Home/sections/AboutSection.tsx
  - workers/src/index.ts
  - workers/src/routes/analytics.ts
  - frontend/src/views/FrontStage/Home/sections/ExperienceSection.tsx
  - workers/src/routes/upload.ts
  - frontend/src/components/Layout/FrontStage/Rail.tsx
  - frontend/package.json
  - frontend/src/styles/design-tokens.css
  - workers/migrations/0004_experience_rich_content.sql
-->