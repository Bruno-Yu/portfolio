## ADDED Requirements

### Requirement: Shared admin layout with always-dark sidebar

The system SHALL render all backstage pages (`/backstage/*`) inside `AdminShell.tsx`, which provides an always-dark sidebar (background `#0a0805`, cream text) and a topbar. The sidebar's dark background SHALL NOT change when the user toggles light/dark theme.

#### Scenario: Sidebar remains dark in light mode

- **WHEN** the global theme is set to light
- **THEN** the admin sidebar background SHALL remain `#0a0805` and sidebar text SHALL remain cream-colored

#### Scenario: Sidebar remains dark in dark mode

- **WHEN** the global theme is set to dark
- **THEN** the admin sidebar background SHALL remain `#0a0805` (indistinguishable from dark mode but still hardcoded, not driven by `--bg` token)

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

### Requirement: Admin topbar with breadcrumbs and actions

The topbar SHALL display breadcrumbs in the format `BACKSTAGE / <CURRENT PAGE>`, a search input (UI only, no backend search in v1), a language toggle (EN/中), a theme toggle, and a "View site" link that opens the public portfolio in a new tab.

#### Scenario: Breadcrumb updates on navigation

- **WHEN** the user navigates to `/backstage/content`
- **THEN** the topbar breadcrumb SHALL read `BACKSTAGE / CONTENT`

### Requirement: Auth guard for all backstage routes

`AdminShell` SHALL check for a valid JWT on mount. If no token is present in localStorage or the token is expired, the system SHALL redirect to `/login` before rendering any child route.

#### Scenario: Unauthenticated access redirected

- **WHEN** an unauthenticated user navigates to `/backstage/overview`
- **THEN** the system SHALL redirect to `/login` without rendering the admin shell

#### Scenario: Authenticated user proceeds normally

- **WHEN** a user with a valid JWT navigates to `/backstage/overview`
- **THEN** the AdminShell SHALL render with the Overview page content in the main area
