# admin-image-upload-ui Specification

## Purpose

TBD - created by archiving change 'image-storage-r2'. Update Purpose after archive.

## Requirements

### Requirement: Admin works form provides preview-first image upload

The works create and edit forms in the Admin BackStage SHALL include a preview-first image
editor. When a work already has an image URL, the editor SHALL render the image preview and
actions to replace or remove it. When the user chooses replace (or when no image exists), the
preview area SHALL turn into an upload target backed by `<input type="file" accept="image/*">`.

Selecting a file SHALL immediately trigger an upload to `POST /api/upload` using the stored
JWT access token in the Authorization header. The upload target SHALL be visually labelled so
its purpose is unambiguous.

#### Scenario: Admin selects an image file in the create form

- **WHEN** an admin opens the works create form and selects an image file via the upload target
- **THEN** the form sends `POST /api/upload` with `multipart/form-data` containing the selected file and the `Authorization: Bearer <token>` header, then displays a loading indicator while the upload is in progress

#### Scenario: Admin selects an image file in the edit form

- **WHEN** an admin opens an existing work's edit form, clicks replace, and selects a new image file
- **THEN** the same upload flow executes as in the create form and the returned URL replaces the previous internal image values

##### Example: replace existing work image

- **GIVEN** work `id=3` currently has `imgUrl="https://images.jackhellowin.win/works/old.webp"`
- **WHEN** the admin clicks Replace and selects `new-cover.webp`
- **THEN** the form uploads `new-cover.webp`, sets internal `imgUrl` and `imgLink` to the returned `https://images.jackhellowin.win/works/<new-key>.webp`, and renders that new preview


<!-- @trace
source: image-storage-r2
updated: 2026-05-10
code:
  - .opencode/skills/spectra-discuss/SKILL.md
  - frontend/src/views/FrontStage/Login/index.tsx
  - .github/prompts/spectra-ask.prompt.md
  - .opencode/skills/spectra-debug/SKILL.md
  - workers/src/routes/analytics.ts
  - .opencode/commands/spectra-discuss.md
  - frontend/src/views/BackStage/Messages/index.tsx
  - frontend/src/config.ts
  - .opencode/skills/spectra-propose/SKILL.md
  - workers/src/drizzle/schema/messages.ts
  - .github/prompts/spectra-apply.prompt.md
  - .github/prompts/spectra-debug.prompt.md
  - frontend/src/components/Layout/FrontStage/index.tsx
  - frontend/src/views/BackStage/Skills/index.tsx
  - data-migration/db.json
  - frontend/public/_routes.json
  - frontend/src/content/portfolio.ts
  - .github/skills/spectra-commit/SKILL.md
  - frontend/.claude/launch.json
  - .github/skills/spectra-ingest/SKILL.md
  - frontend/package.json
  - .github/skills/spectra-audit/SKILL.md
  - frontend/README.md
  - .opencode/commands/spectra-propose.md
  - .opencode/skills/spectra-archive/SKILL.md
  - workers/src/routes/auth.ts
  - frontend/src/views/FrontStage/Works/index.tsx
  - workers/migrations/0004_experience_rich_content.sql
  - frontend/tailwind.config.js
  - .github/skills/spectra-discuss/SKILL.md
  - .opencode/skills/spectra-audit/SKILL.md
  - .opencode/commands/spectra-ingest.md
  - AGENTS.md
  - frontend/src/views/FrontStage/Home/sections/HeroSection.tsx
  - frontend/src/layout/Layout.tsx
  - workers/src/drizzle/schema/experiences.ts
  - .opencode/commands/spectra-commit.md
  - frontend/src/views/FrontStage/Home/sections/AboutSection.tsx
  - frontend/src/views/FrontStage/Home/sections/ServicesSection.tsx
  - workers/src/routes/experiences.ts
  - frontend/src/index.css
  - workers/wrangler.toml
  - frontend/public/images/avatar.webp
  - frontend/src/styles/design-admin.css
  - frontend/src/views/FrontStage/Home/sections/ContactGlobe.tsx
  - workers/src/routes/messages.ts
  - frontend/public/images/cure_1.svg
  - frontend/src/views/BackStage/Overview/index.tsx
  - .opencode/commands/spectra-apply.md
  - workers/migrations/0003_content_experiences_messages.sql
  - CLAUDE.md
  - frontend/src/components/Layout/FrontStage/Rail.tsx
  - .opencode/commands/spectra-archive.md
  - frontend/src/styles/design-pages.css
  - frontend/src/components/Layout/BackStage/AdminShell.tsx
  - workers/src/routes/upload.ts
  - .github/prompts/spectra-discuss.prompt.md
  - frontend/src/views/BackStage/Works/index.tsx
  - frontend/src/styles/design-shell.css
  - .github/skills/spectra-propose/SKILL.md
  - .opencode/command/openspec-archive.md
  - .opencode/commands/spectra-debug.md
  - GEMINI.md
  - frontend/index.html
  - .opencode/skills/spectra-apply/SKILL.md
  - .opencode/commands/spectra-ask.md
  - .github/skills/spectra-debug/SKILL.md
  - .opencode/skills/spectra-commit/SKILL.md
  - frontend/public/images/contact_me.webp
  - frontend/src/store/ui-slice.ts
  - frontend/public/images/stamp.webp
  - frontend/src/views/FrontStage/Home/sections/SkillsSection.tsx
  - .github/skills/spectra-ask/SKILL.md
  - frontend/src/views/FrontStage/Home/sections/ExperienceSection.tsx
  - workers/src/index.ts
  - .opencode/skills/spectra-ingest/SKILL.md
  - frontend/vite.config.ts
  - frontend/src/api/request.ts
  - .spectra.yaml
  - .github/prompts/spectra-propose.prompt.md
  - frontend/src/views/FrontStage/Home/index.tsx
  - frontend/src/styles/design-tokens.css
  - frontend/src/views/BackStage/Users/index.tsx
  - .github/skills/spectra-apply/SKILL.md
  - workers/src/routes/contentBlocks.ts
  - frontend/src/Hooks/usePageContent.ts
  - frontend/src/views/BackStage/Settings/index.tsx
  - frontend/src/Hooks/useExperiences.ts
  - frontend/src/views/FrontStage/Home/sections/WorksSection.tsx
  - frontend/src/App.tsx
  - .github/prompts/spectra-commit.prompt.md
  - .github/prompts/spectra-audit.prompt.md
  - frontend/public/images/logo.webp
  - frontend/src/components/Layout/BackStage/AdminPageHead.tsx
  - frontend/src/views/FrontStage/Home/sections/ContactSection.tsx
  - .cursorrules
  - frontend/src/store/index.ts
  - workers/scripts/seed.sql
  - frontend/src/content/apiFallback.ts
  - .github/skills/spectra-archive/SKILL.md
  - frontend/public/images/cure_2.svg
  - .opencode/commands/spectra-audit.md
  - workers/src/drizzle/schema/contentBlocks.ts
  - .github/prompts/spectra-archive.prompt.md
  - frontend/src/views/BackStage/Content/index.tsx
  - workers/src/drizzle/schema/index.ts
  - .github/prompts/spectra-ingest.prompt.md
  - .opencode/command/openspec-apply.md
  - .opencode/command/openspec-proposal.md
  - .opencode/skills/spectra-ask/SKILL.md
-->

---
### Requirement: Successful upload populates imgUrl and shows a preview

After a successful `POST /api/upload` response, the form SHALL automatically populate the
internal `imgUrl` and `imgLink` values with the returned custom-domain R2 URL and render an
`<img>` preview of the uploaded image directly in the form, so the admin can confirm the
upload before saving the work.

#### Scenario: Upload succeeds and URL is injected

- **WHEN** the upload API returns `{ "success": true, "data": { "url": "<r2-url>", "key": "<key>" } }`
- **THEN** the form's internal `imgUrl` and `imgLink` values are set to `<r2-url>` and an `<img src="<r2-url>">` preview is rendered, with no further action required from the admin


<!-- @trace
source: image-storage-r2
updated: 2026-05-10
code:
  - .opencode/skills/spectra-discuss/SKILL.md
  - frontend/src/views/FrontStage/Login/index.tsx
  - .github/prompts/spectra-ask.prompt.md
  - .opencode/skills/spectra-debug/SKILL.md
  - workers/src/routes/analytics.ts
  - .opencode/commands/spectra-discuss.md
  - frontend/src/views/BackStage/Messages/index.tsx
  - frontend/src/config.ts
  - .opencode/skills/spectra-propose/SKILL.md
  - workers/src/drizzle/schema/messages.ts
  - .github/prompts/spectra-apply.prompt.md
  - .github/prompts/spectra-debug.prompt.md
  - frontend/src/components/Layout/FrontStage/index.tsx
  - frontend/src/views/BackStage/Skills/index.tsx
  - data-migration/db.json
  - frontend/public/_routes.json
  - frontend/src/content/portfolio.ts
  - .github/skills/spectra-commit/SKILL.md
  - frontend/.claude/launch.json
  - .github/skills/spectra-ingest/SKILL.md
  - frontend/package.json
  - .github/skills/spectra-audit/SKILL.md
  - frontend/README.md
  - .opencode/commands/spectra-propose.md
  - .opencode/skills/spectra-archive/SKILL.md
  - workers/src/routes/auth.ts
  - frontend/src/views/FrontStage/Works/index.tsx
  - workers/migrations/0004_experience_rich_content.sql
  - frontend/tailwind.config.js
  - .github/skills/spectra-discuss/SKILL.md
  - .opencode/skills/spectra-audit/SKILL.md
  - .opencode/commands/spectra-ingest.md
  - AGENTS.md
  - frontend/src/views/FrontStage/Home/sections/HeroSection.tsx
  - frontend/src/layout/Layout.tsx
  - workers/src/drizzle/schema/experiences.ts
  - .opencode/commands/spectra-commit.md
  - frontend/src/views/FrontStage/Home/sections/AboutSection.tsx
  - frontend/src/views/FrontStage/Home/sections/ServicesSection.tsx
  - workers/src/routes/experiences.ts
  - frontend/src/index.css
  - workers/wrangler.toml
  - frontend/public/images/avatar.webp
  - frontend/src/styles/design-admin.css
  - frontend/src/views/FrontStage/Home/sections/ContactGlobe.tsx
  - workers/src/routes/messages.ts
  - frontend/public/images/cure_1.svg
  - frontend/src/views/BackStage/Overview/index.tsx
  - .opencode/commands/spectra-apply.md
  - workers/migrations/0003_content_experiences_messages.sql
  - CLAUDE.md
  - frontend/src/components/Layout/FrontStage/Rail.tsx
  - .opencode/commands/spectra-archive.md
  - frontend/src/styles/design-pages.css
  - frontend/src/components/Layout/BackStage/AdminShell.tsx
  - workers/src/routes/upload.ts
  - .github/prompts/spectra-discuss.prompt.md
  - frontend/src/views/BackStage/Works/index.tsx
  - frontend/src/styles/design-shell.css
  - .github/skills/spectra-propose/SKILL.md
  - .opencode/command/openspec-archive.md
  - .opencode/commands/spectra-debug.md
  - GEMINI.md
  - frontend/index.html
  - .opencode/skills/spectra-apply/SKILL.md
  - .opencode/commands/spectra-ask.md
  - .github/skills/spectra-debug/SKILL.md
  - .opencode/skills/spectra-commit/SKILL.md
  - frontend/public/images/contact_me.webp
  - frontend/src/store/ui-slice.ts
  - frontend/public/images/stamp.webp
  - frontend/src/views/FrontStage/Home/sections/SkillsSection.tsx
  - .github/skills/spectra-ask/SKILL.md
  - frontend/src/views/FrontStage/Home/sections/ExperienceSection.tsx
  - workers/src/index.ts
  - .opencode/skills/spectra-ingest/SKILL.md
  - frontend/vite.config.ts
  - frontend/src/api/request.ts
  - .spectra.yaml
  - .github/prompts/spectra-propose.prompt.md
  - frontend/src/views/FrontStage/Home/index.tsx
  - frontend/src/styles/design-tokens.css
  - frontend/src/views/BackStage/Users/index.tsx
  - .github/skills/spectra-apply/SKILL.md
  - workers/src/routes/contentBlocks.ts
  - frontend/src/Hooks/usePageContent.ts
  - frontend/src/views/BackStage/Settings/index.tsx
  - frontend/src/Hooks/useExperiences.ts
  - frontend/src/views/FrontStage/Home/sections/WorksSection.tsx
  - frontend/src/App.tsx
  - .github/prompts/spectra-commit.prompt.md
  - .github/prompts/spectra-audit.prompt.md
  - frontend/public/images/logo.webp
  - frontend/src/components/Layout/BackStage/AdminPageHead.tsx
  - frontend/src/views/FrontStage/Home/sections/ContactSection.tsx
  - .cursorrules
  - frontend/src/store/index.ts
  - workers/scripts/seed.sql
  - frontend/src/content/apiFallback.ts
  - .github/skills/spectra-archive/SKILL.md
  - frontend/public/images/cure_2.svg
  - .opencode/commands/spectra-audit.md
  - workers/src/drizzle/schema/contentBlocks.ts
  - .github/prompts/spectra-archive.prompt.md
  - frontend/src/views/BackStage/Content/index.tsx
  - workers/src/drizzle/schema/index.ts
  - .github/prompts/spectra-ingest.prompt.md
  - .opencode/command/openspec-apply.md
  - .opencode/command/openspec-proposal.md
  - .opencode/skills/spectra-ask/SKILL.md
-->

---
### Requirement: Upload error is surfaced to the admin

If the `POST /api/upload` request fails (non-2xx HTTP status or network error), the form SHALL
display a human-readable error message adjacent to the upload target and SHALL NOT modify the
existing internal `imgUrl` / `imgLink` values, so the admin's previously saved URL is preserved.

#### Scenario: Upload returns a 413 error

- **WHEN** the admin selects a file larger than 5 MB and the API returns HTTP 413
- **THEN** the form shows the message "File too large (max 5 MB)" near the upload target and the existing image values retain their previous values

#### Scenario: Upload returns a 400 error

- **WHEN** the admin selects a non-image file and the API returns HTTP 400
- **THEN** the form shows the message "Invalid file type" near the upload target and the existing image values retain their previous values

#### Scenario: Network error during upload

- **WHEN** the upload request fails due to a network error
- **THEN** the form shows a generic error message "Upload failed, please retry" and the existing image values retain their previous values


<!-- @trace
source: image-storage-r2
updated: 2026-05-10
code:
  - .opencode/skills/spectra-discuss/SKILL.md
  - frontend/src/views/FrontStage/Login/index.tsx
  - .github/prompts/spectra-ask.prompt.md
  - .opencode/skills/spectra-debug/SKILL.md
  - workers/src/routes/analytics.ts
  - .opencode/commands/spectra-discuss.md
  - frontend/src/views/BackStage/Messages/index.tsx
  - frontend/src/config.ts
  - .opencode/skills/spectra-propose/SKILL.md
  - workers/src/drizzle/schema/messages.ts
  - .github/prompts/spectra-apply.prompt.md
  - .github/prompts/spectra-debug.prompt.md
  - frontend/src/components/Layout/FrontStage/index.tsx
  - frontend/src/views/BackStage/Skills/index.tsx
  - data-migration/db.json
  - frontend/public/_routes.json
  - frontend/src/content/portfolio.ts
  - .github/skills/spectra-commit/SKILL.md
  - frontend/.claude/launch.json
  - .github/skills/spectra-ingest/SKILL.md
  - frontend/package.json
  - .github/skills/spectra-audit/SKILL.md
  - frontend/README.md
  - .opencode/commands/spectra-propose.md
  - .opencode/skills/spectra-archive/SKILL.md
  - workers/src/routes/auth.ts
  - frontend/src/views/FrontStage/Works/index.tsx
  - workers/migrations/0004_experience_rich_content.sql
  - frontend/tailwind.config.js
  - .github/skills/spectra-discuss/SKILL.md
  - .opencode/skills/spectra-audit/SKILL.md
  - .opencode/commands/spectra-ingest.md
  - AGENTS.md
  - frontend/src/views/FrontStage/Home/sections/HeroSection.tsx
  - frontend/src/layout/Layout.tsx
  - workers/src/drizzle/schema/experiences.ts
  - .opencode/commands/spectra-commit.md
  - frontend/src/views/FrontStage/Home/sections/AboutSection.tsx
  - frontend/src/views/FrontStage/Home/sections/ServicesSection.tsx
  - workers/src/routes/experiences.ts
  - frontend/src/index.css
  - workers/wrangler.toml
  - frontend/public/images/avatar.webp
  - frontend/src/styles/design-admin.css
  - frontend/src/views/FrontStage/Home/sections/ContactGlobe.tsx
  - workers/src/routes/messages.ts
  - frontend/public/images/cure_1.svg
  - frontend/src/views/BackStage/Overview/index.tsx
  - .opencode/commands/spectra-apply.md
  - workers/migrations/0003_content_experiences_messages.sql
  - CLAUDE.md
  - frontend/src/components/Layout/FrontStage/Rail.tsx
  - .opencode/commands/spectra-archive.md
  - frontend/src/styles/design-pages.css
  - frontend/src/components/Layout/BackStage/AdminShell.tsx
  - workers/src/routes/upload.ts
  - .github/prompts/spectra-discuss.prompt.md
  - frontend/src/views/BackStage/Works/index.tsx
  - frontend/src/styles/design-shell.css
  - .github/skills/spectra-propose/SKILL.md
  - .opencode/command/openspec-archive.md
  - .opencode/commands/spectra-debug.md
  - GEMINI.md
  - frontend/index.html
  - .opencode/skills/spectra-apply/SKILL.md
  - .opencode/commands/spectra-ask.md
  - .github/skills/spectra-debug/SKILL.md
  - .opencode/skills/spectra-commit/SKILL.md
  - frontend/public/images/contact_me.webp
  - frontend/src/store/ui-slice.ts
  - frontend/public/images/stamp.webp
  - frontend/src/views/FrontStage/Home/sections/SkillsSection.tsx
  - .github/skills/spectra-ask/SKILL.md
  - frontend/src/views/FrontStage/Home/sections/ExperienceSection.tsx
  - workers/src/index.ts
  - .opencode/skills/spectra-ingest/SKILL.md
  - frontend/vite.config.ts
  - frontend/src/api/request.ts
  - .spectra.yaml
  - .github/prompts/spectra-propose.prompt.md
  - frontend/src/views/FrontStage/Home/index.tsx
  - frontend/src/styles/design-tokens.css
  - frontend/src/views/BackStage/Users/index.tsx
  - .github/skills/spectra-apply/SKILL.md
  - workers/src/routes/contentBlocks.ts
  - frontend/src/Hooks/usePageContent.ts
  - frontend/src/views/BackStage/Settings/index.tsx
  - frontend/src/Hooks/useExperiences.ts
  - frontend/src/views/FrontStage/Home/sections/WorksSection.tsx
  - frontend/src/App.tsx
  - .github/prompts/spectra-commit.prompt.md
  - .github/prompts/spectra-audit.prompt.md
  - frontend/public/images/logo.webp
  - frontend/src/components/Layout/BackStage/AdminPageHead.tsx
  - frontend/src/views/FrontStage/Home/sections/ContactSection.tsx
  - .cursorrules
  - frontend/src/store/index.ts
  - workers/scripts/seed.sql
  - frontend/src/content/apiFallback.ts
  - .github/skills/spectra-archive/SKILL.md
  - frontend/public/images/cure_2.svg
  - .opencode/commands/spectra-audit.md
  - workers/src/drizzle/schema/contentBlocks.ts
  - .github/prompts/spectra-archive.prompt.md
  - frontend/src/views/BackStage/Content/index.tsx
  - workers/src/drizzle/schema/index.ts
  - .github/prompts/spectra-ingest.prompt.md
  - .opencode/command/openspec-apply.md
  - .opencode/command/openspec-proposal.md
  - .opencode/skills/spectra-ask/SKILL.md
-->

---
### Requirement: Admin can delete an uploaded image from the works form

The works create and edit forms SHALL include a delete button (or icon) adjacent to the image
preview. Clicking it SHALL call `DELETE /api/upload/:key` using the JWT in the Authorization
header and, on success, clear the internal `imgUrl` / `imgLink` values and hide the image preview.

The delete button SHALL only be visible when `imgUrl` currently holds an R2-hosted URL (i.e.,
a URL whose origin matches the configured R2 public domain). It SHALL NOT appear for legacy
Imgur URLs, because those objects are not stored in this project's R2 bucket.

#### Scenario: Admin deletes an R2 image via the form

- **WHEN** the `imgUrl` field contains an R2 URL and the admin clicks the delete button
- **THEN** the form sends `DELETE /api/upload/<key>` with the JWT, and on HTTP 200 response the internal image values are cleared and the image preview is removed

#### Scenario: Delete button is hidden for non-R2 URLs

- **WHEN** the `imgUrl` field contains a legacy Imgur URL (not matching the R2 public domain)
- **THEN** no R2 delete request is made; the admin can remove the preview locally or replace it with a newly uploaded R2 image

#### Scenario: Delete API error is surfaced to the admin

- **WHEN** the `DELETE /api/upload/:key` request returns a non-2xx status or network error
- **THEN** the form displays an error message near the image preview and does NOT clear the internal image values


<!-- @trace
source: image-storage-r2
updated: 2026-05-10
code:
  - .opencode/skills/spectra-discuss/SKILL.md
  - frontend/src/views/FrontStage/Login/index.tsx
  - .github/prompts/spectra-ask.prompt.md
  - .opencode/skills/spectra-debug/SKILL.md
  - workers/src/routes/analytics.ts
  - .opencode/commands/spectra-discuss.md
  - frontend/src/views/BackStage/Messages/index.tsx
  - frontend/src/config.ts
  - .opencode/skills/spectra-propose/SKILL.md
  - workers/src/drizzle/schema/messages.ts
  - .github/prompts/spectra-apply.prompt.md
  - .github/prompts/spectra-debug.prompt.md
  - frontend/src/components/Layout/FrontStage/index.tsx
  - frontend/src/views/BackStage/Skills/index.tsx
  - data-migration/db.json
  - frontend/public/_routes.json
  - frontend/src/content/portfolio.ts
  - .github/skills/spectra-commit/SKILL.md
  - frontend/.claude/launch.json
  - .github/skills/spectra-ingest/SKILL.md
  - frontend/package.json
  - .github/skills/spectra-audit/SKILL.md
  - frontend/README.md
  - .opencode/commands/spectra-propose.md
  - .opencode/skills/spectra-archive/SKILL.md
  - workers/src/routes/auth.ts
  - frontend/src/views/FrontStage/Works/index.tsx
  - workers/migrations/0004_experience_rich_content.sql
  - frontend/tailwind.config.js
  - .github/skills/spectra-discuss/SKILL.md
  - .opencode/skills/spectra-audit/SKILL.md
  - .opencode/commands/spectra-ingest.md
  - AGENTS.md
  - frontend/src/views/FrontStage/Home/sections/HeroSection.tsx
  - frontend/src/layout/Layout.tsx
  - workers/src/drizzle/schema/experiences.ts
  - .opencode/commands/spectra-commit.md
  - frontend/src/views/FrontStage/Home/sections/AboutSection.tsx
  - frontend/src/views/FrontStage/Home/sections/ServicesSection.tsx
  - workers/src/routes/experiences.ts
  - frontend/src/index.css
  - workers/wrangler.toml
  - frontend/public/images/avatar.webp
  - frontend/src/styles/design-admin.css
  - frontend/src/views/FrontStage/Home/sections/ContactGlobe.tsx
  - workers/src/routes/messages.ts
  - frontend/public/images/cure_1.svg
  - frontend/src/views/BackStage/Overview/index.tsx
  - .opencode/commands/spectra-apply.md
  - workers/migrations/0003_content_experiences_messages.sql
  - CLAUDE.md
  - frontend/src/components/Layout/FrontStage/Rail.tsx
  - .opencode/commands/spectra-archive.md
  - frontend/src/styles/design-pages.css
  - frontend/src/components/Layout/BackStage/AdminShell.tsx
  - workers/src/routes/upload.ts
  - .github/prompts/spectra-discuss.prompt.md
  - frontend/src/views/BackStage/Works/index.tsx
  - frontend/src/styles/design-shell.css
  - .github/skills/spectra-propose/SKILL.md
  - .opencode/command/openspec-archive.md
  - .opencode/commands/spectra-debug.md
  - GEMINI.md
  - frontend/index.html
  - .opencode/skills/spectra-apply/SKILL.md
  - .opencode/commands/spectra-ask.md
  - .github/skills/spectra-debug/SKILL.md
  - .opencode/skills/spectra-commit/SKILL.md
  - frontend/public/images/contact_me.webp
  - frontend/src/store/ui-slice.ts
  - frontend/public/images/stamp.webp
  - frontend/src/views/FrontStage/Home/sections/SkillsSection.tsx
  - .github/skills/spectra-ask/SKILL.md
  - frontend/src/views/FrontStage/Home/sections/ExperienceSection.tsx
  - workers/src/index.ts
  - .opencode/skills/spectra-ingest/SKILL.md
  - frontend/vite.config.ts
  - frontend/src/api/request.ts
  - .spectra.yaml
  - .github/prompts/spectra-propose.prompt.md
  - frontend/src/views/FrontStage/Home/index.tsx
  - frontend/src/styles/design-tokens.css
  - frontend/src/views/BackStage/Users/index.tsx
  - .github/skills/spectra-apply/SKILL.md
  - workers/src/routes/contentBlocks.ts
  - frontend/src/Hooks/usePageContent.ts
  - frontend/src/views/BackStage/Settings/index.tsx
  - frontend/src/Hooks/useExperiences.ts
  - frontend/src/views/FrontStage/Home/sections/WorksSection.tsx
  - frontend/src/App.tsx
  - .github/prompts/spectra-commit.prompt.md
  - .github/prompts/spectra-audit.prompt.md
  - frontend/public/images/logo.webp
  - frontend/src/components/Layout/BackStage/AdminPageHead.tsx
  - frontend/src/views/FrontStage/Home/sections/ContactSection.tsx
  - .cursorrules
  - frontend/src/store/index.ts
  - workers/scripts/seed.sql
  - frontend/src/content/apiFallback.ts
  - .github/skills/spectra-archive/SKILL.md
  - frontend/public/images/cure_2.svg
  - .opencode/commands/spectra-audit.md
  - workers/src/drizzle/schema/contentBlocks.ts
  - .github/prompts/spectra-archive.prompt.md
  - frontend/src/views/BackStage/Content/index.tsx
  - workers/src/drizzle/schema/index.ts
  - .github/prompts/spectra-ingest.prompt.md
  - .opencode/command/openspec-apply.md
  - .opencode/command/openspec-proposal.md
  - .opencode/skills/spectra-ask/SKILL.md
-->

---
### Requirement: Manual image URL fields are hidden from the works form

The `imgUrl` and `imgLink` text input fields SHALL NOT be shown in the works create/edit modal.
The form SHALL manage these fields internally from the preview-first image editor, so newly
edited works use controlled R2 URLs instead of arbitrary local asset or Imgur URLs.

Existing legacy URLs in D1 SHALL still be read and rendered as previews, preserving backward
compatibility for old data until the image is removed or replaced.

#### Scenario: Existing legacy URL remains previewable

- **WHEN** an existing work has an Imgur URL in `imgUrl`
- **THEN** the edit form SHALL show the image preview if the URL loads, allow remove or replace, and SHALL NOT expose a raw URL input

<!-- @trace
source: image-storage-r2
updated: 2026-05-10
code:
  - .opencode/skills/spectra-discuss/SKILL.md
  - frontend/src/views/FrontStage/Login/index.tsx
  - .github/prompts/spectra-ask.prompt.md
  - .opencode/skills/spectra-debug/SKILL.md
  - workers/src/routes/analytics.ts
  - .opencode/commands/spectra-discuss.md
  - frontend/src/views/BackStage/Messages/index.tsx
  - frontend/src/config.ts
  - .opencode/skills/spectra-propose/SKILL.md
  - workers/src/drizzle/schema/messages.ts
  - .github/prompts/spectra-apply.prompt.md
  - .github/prompts/spectra-debug.prompt.md
  - frontend/src/components/Layout/FrontStage/index.tsx
  - frontend/src/views/BackStage/Skills/index.tsx
  - data-migration/db.json
  - frontend/public/_routes.json
  - frontend/src/content/portfolio.ts
  - .github/skills/spectra-commit/SKILL.md
  - frontend/.claude/launch.json
  - .github/skills/spectra-ingest/SKILL.md
  - frontend/package.json
  - .github/skills/spectra-audit/SKILL.md
  - frontend/README.md
  - .opencode/commands/spectra-propose.md
  - .opencode/skills/spectra-archive/SKILL.md
  - workers/src/routes/auth.ts
  - frontend/src/views/FrontStage/Works/index.tsx
  - workers/migrations/0004_experience_rich_content.sql
  - frontend/tailwind.config.js
  - .github/skills/spectra-discuss/SKILL.md
  - .opencode/skills/spectra-audit/SKILL.md
  - .opencode/commands/spectra-ingest.md
  - AGENTS.md
  - frontend/src/views/FrontStage/Home/sections/HeroSection.tsx
  - frontend/src/layout/Layout.tsx
  - workers/src/drizzle/schema/experiences.ts
  - .opencode/commands/spectra-commit.md
  - frontend/src/views/FrontStage/Home/sections/AboutSection.tsx
  - frontend/src/views/FrontStage/Home/sections/ServicesSection.tsx
  - workers/src/routes/experiences.ts
  - frontend/src/index.css
  - workers/wrangler.toml
  - frontend/public/images/avatar.webp
  - frontend/src/styles/design-admin.css
  - frontend/src/views/FrontStage/Home/sections/ContactGlobe.tsx
  - workers/src/routes/messages.ts
  - frontend/public/images/cure_1.svg
  - frontend/src/views/BackStage/Overview/index.tsx
  - .opencode/commands/spectra-apply.md
  - workers/migrations/0003_content_experiences_messages.sql
  - CLAUDE.md
  - frontend/src/components/Layout/FrontStage/Rail.tsx
  - .opencode/commands/spectra-archive.md
  - frontend/src/styles/design-pages.css
  - frontend/src/components/Layout/BackStage/AdminShell.tsx
  - workers/src/routes/upload.ts
  - .github/prompts/spectra-discuss.prompt.md
  - frontend/src/views/BackStage/Works/index.tsx
  - frontend/src/styles/design-shell.css
  - .github/skills/spectra-propose/SKILL.md
  - .opencode/command/openspec-archive.md
  - .opencode/commands/spectra-debug.md
  - GEMINI.md
  - frontend/index.html
  - .opencode/skills/spectra-apply/SKILL.md
  - .opencode/commands/spectra-ask.md
  - .github/skills/spectra-debug/SKILL.md
  - .opencode/skills/spectra-commit/SKILL.md
  - frontend/public/images/contact_me.webp
  - frontend/src/store/ui-slice.ts
  - frontend/public/images/stamp.webp
  - frontend/src/views/FrontStage/Home/sections/SkillsSection.tsx
  - .github/skills/spectra-ask/SKILL.md
  - frontend/src/views/FrontStage/Home/sections/ExperienceSection.tsx
  - workers/src/index.ts
  - .opencode/skills/spectra-ingest/SKILL.md
  - frontend/vite.config.ts
  - frontend/src/api/request.ts
  - .spectra.yaml
  - .github/prompts/spectra-propose.prompt.md
  - frontend/src/views/FrontStage/Home/index.tsx
  - frontend/src/styles/design-tokens.css
  - frontend/src/views/BackStage/Users/index.tsx
  - .github/skills/spectra-apply/SKILL.md
  - workers/src/routes/contentBlocks.ts
  - frontend/src/Hooks/usePageContent.ts
  - frontend/src/views/BackStage/Settings/index.tsx
  - frontend/src/Hooks/useExperiences.ts
  - frontend/src/views/FrontStage/Home/sections/WorksSection.tsx
  - frontend/src/App.tsx
  - .github/prompts/spectra-commit.prompt.md
  - .github/prompts/spectra-audit.prompt.md
  - frontend/public/images/logo.webp
  - frontend/src/components/Layout/BackStage/AdminPageHead.tsx
  - frontend/src/views/FrontStage/Home/sections/ContactSection.tsx
  - .cursorrules
  - frontend/src/store/index.ts
  - workers/scripts/seed.sql
  - frontend/src/content/apiFallback.ts
  - .github/skills/spectra-archive/SKILL.md
  - frontend/public/images/cure_2.svg
  - .opencode/commands/spectra-audit.md
  - workers/src/drizzle/schema/contentBlocks.ts
  - .github/prompts/spectra-archive.prompt.md
  - frontend/src/views/BackStage/Content/index.tsx
  - workers/src/drizzle/schema/index.ts
  - .github/prompts/spectra-ingest.prompt.md
  - .opencode/command/openspec-apply.md
  - .opencode/command/openspec-proposal.md
  - .opencode/skills/spectra-ask/SKILL.md
-->