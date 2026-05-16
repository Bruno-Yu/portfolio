# settings-page Specification

## Purpose

TBD - created by archiving change 'backstage-dashboard-v2'. Update Purpose after archive.

## Requirements

### Requirement: Settings page displays and saves site metadata

The Settings page (`/backstage/settings`) SHALL display an editable form for site metadata fields: site title, tagline, email, and location. On load, the form SHALL populate from `GET /api/content-blocks` using keys `settings.title`, `settings.tagline`, `settings.email`, `settings.location` for both `en` and `zh` languages. A "Save changes" button SHALL call `POST /api/content-blocks` with the current field values.

#### Scenario: Settings load from DB

- **WHEN** the Settings page mounts and `GET /api/content-blocks` includes `{ "settings.title.en": "Bruno Yu Portfolio" }`
- **THEN** the site title field SHALL display `"Bruno Yu Portfolio"`

#### Scenario: Settings load fallback from portfolio.ts

- **WHEN** `GET /api/content-blocks` returns no `settings.*` keys
- **THEN** the site title field SHALL display the value from `portfolio.ts` `meta.nick` / relevant field

#### Scenario: Save settings

- **WHEN** the user modifies the email field and clicks "Save changes"
- **THEN** the system SHALL call `POST /api/content-blocks` with `[{ key: "settings.email", lang: "en", value: <new value> }]` and display a success indicator


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
### Requirement: Settings page displays account information panel

The Settings page SHALL display a read-only account information panel showing the current user's plan label ("BackStage Pro"), 2FA status (hardcoded "Enabled"), number of active sessions, and last password change. A "Change password" button SHALL open a password change modal.

#### Scenario: Account panel visible to admin

- **WHEN** an authenticated admin views the Settings page
- **THEN** the account panel SHALL display the current username from the JWT payload and the static account details

##### Example: Logged-in admin email

- **GIVEN** the JWT username is `jackhellowin@gmail.com`
- **WHEN** the admin opens `/backstage/settings`
- **THEN** the account panel SHALL show `jackhellowin@gmail.com`, plan `BackStage Pro`, and the change-password action


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
### Requirement: Change-password modal validates and submits

The change-password modal SHALL require "Current password", "New password", and "Confirm new password" fields. On submit, the system SHALL call `POST /api/auth/change-password` with `{ currentPassword, newPassword }`. If passwords do not match, the system SHALL display an inline error before making any API call.

#### Scenario: Passwords must match

- **WHEN** new password is `"abc123"` and confirm password is `"abc456"`
- **THEN** the system SHALL display `"Passwords do not match"` inline and SHALL NOT call the API

#### Scenario: Successful password change

- **WHEN** all fields are valid and `POST /api/auth/change-password` returns `{ success: true }`
- **THEN** the modal SHALL close and a success toast SHALL display `"Password updated"`

#### Scenario: Wrong current password rejected

- **WHEN** `POST /api/auth/change-password` returns `401`
- **THEN** the modal SHALL display `"Current password is incorrect"` without closing


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
### Requirement: Change-password backend endpoint

The system SHALL expose `POST /api/auth/change-password` (authenticated, any role). The request body SHALL contain `{ currentPassword: string, newPassword: string }`. The system SHALL verify `currentPassword` against the stored hash, then update the password hash. `newPassword` SHALL be at least 8 characters.

#### Scenario: Successful password update

- **WHEN** a valid JWT user calls `POST /api/auth/change-password` with correct `currentPassword` and a `newPassword` ≥ 8 characters
- **THEN** the system SHALL update the password hash and return `{ success: true }`

#### Scenario: Short new password rejected

- **WHEN** `newPassword` is 7 characters or fewer
- **THEN** the system SHALL return `400` with `{ error: { code: "VALIDATION_ERROR", message: "Password must be at least 8 characters" } }`

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