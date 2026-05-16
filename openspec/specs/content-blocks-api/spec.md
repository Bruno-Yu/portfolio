# content-blocks-api Specification

## Purpose

TBD - created by archiving change 'backstage-dashboard-v2'. Update Purpose after archive.

## Requirements

### Requirement: content_blocks table stores bilingual text by key

The system SHALL maintain a `content_blocks` table in D1 with schema `(key TEXT, lang TEXT, value TEXT, updated_at INTEGER, PRIMARY KEY(key, lang))`. Keys SHALL follow dot-notation namespacing (e.g., `hero.greeting`, `about.paragraphs`, `settings.title`). `lang` SHALL be either `"en"` or `"zh"`.

#### Scenario: Upsert new content block

- **WHEN** `POST /api/content-blocks` is called with `[{ key: "hero.greeting", lang: "en", value: "Hi, I'm Bruno." }]`
- **THEN** the system SHALL insert or replace the row with `key="hero.greeting"` and `lang="en"`, and return `{ success: true, count: 1 }`

#### Scenario: Partial key retrieval

- **WHEN** `GET /api/content-blocks` is called
- **THEN** the system SHALL return all rows as a flat map `{ "hero.greeting.en": "Hi, I'm Bruno.", "hero.greeting.zh": "你好..." }`

##### Example: GET response shape

| DB rows | GET response |
|---|---|
| `(hero.greeting, en, "Hi")`, `(hero.greeting, zh, "你好")` | `{ "hero.greeting.en": "Hi", "hero.greeting.zh": "你好" }` |
| (empty table) | `{}` |


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
### Requirement: content-blocks GET endpoint is public

`GET /api/content-blocks` SHALL be accessible without authentication. This allows the frontend to fetch content on page load before any user session exists.

#### Scenario: Public read succeeds without token

- **WHEN** an unauthenticated request is sent to `GET /api/content-blocks`
- **THEN** the system SHALL return `200` with the content map (or `{}` if empty)


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
### Requirement: content-blocks POST endpoint is admin-only

`POST /api/content-blocks` SHALL require a valid admin JWT. The request body SHALL be an array of `{ key: string, lang: "en" | "zh", value: string }` objects. The system SHALL upsert all provided rows atomically.

#### Scenario: Unauthorized write rejected

- **WHEN** `POST /api/content-blocks` is called without a JWT
- **THEN** the system SHALL return `401 Unauthorized`

#### Scenario: Bulk upsert

- **WHEN** `POST /api/content-blocks` is called with 5 content block objects
- **THEN** all 5 SHALL be upserted in a single D1 transaction and the response SHALL include `{ success: true, count: 5 }`


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
### Requirement: experiences table stores structured bilingual work history

The system SHALL maintain an `experiences` table with columns: `id`, `sort_order INTEGER`, `from_year TEXT`, `to_year TEXT`, `role_en TEXT`, `role_zh TEXT`, `org_en TEXT`, `org_zh TEXT`, `location TEXT`, `tags TEXT`, `bullets_en TEXT`, `bullets_zh TEXT`, `note_en TEXT`, `note_zh TEXT`. `tags`, `bullets_en`, and `bullets_zh` SHALL store JSON-serialized string arrays.

#### Scenario: GET experiences returns ordered list

- **WHEN** `GET /api/experiences` is called
- **THEN** the system SHALL return all experience rows ordered by `sort_order ASC, id ASC` as a JSON array, with `tags`, `bulletsEn`, and `bulletsZh` parsed back to arrays

#### Scenario: CREATE experience

- **WHEN** `POST /api/experiences` is called with admin JWT and a valid experience object
- **THEN** the system SHALL insert the row and return `{ success: true, data: <new row> }` with status `201`

#### Scenario: UPDATE experience

- **WHEN** `PUT /api/experiences/:id` is called with admin JWT
- **THEN** the system SHALL update only the provided fields and return `{ success: true, data: <updated row> }`

#### Scenario: DELETE experience

- **WHEN** `DELETE /api/experiences/:id` is called with admin JWT
- **THEN** the system SHALL delete the row and return `{ success: true }`

#### Scenario: GET experiences is public

- **WHEN** an unauthenticated request is sent to `GET /api/experiences`
- **THEN** the system SHALL return `200` with the experiences array


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
### Requirement: messages table stores contact inquiries

The system SHALL maintain a `messages` table with columns: `id`, `sender_name TEXT`, `sender_email TEXT NOT NULL`, `subject TEXT`, `body TEXT NOT NULL`, `is_read INTEGER DEFAULT 0`, `created_at INTEGER`. No public POST endpoint is required in this change (messages UI is out of scope); the table is created for future use.

#### Scenario: Table exists after migration

- **WHEN** migration `0003` is applied
- **THEN** `SELECT * FROM messages` SHALL return an empty result set without error

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