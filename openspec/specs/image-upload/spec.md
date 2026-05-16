# image-upload Specification

## Purpose

TBD - created by archiving change 'image-storage-r2'. Update Purpose after archive.

## Requirements

### Requirement: Admin can upload an image to Cloudflare R2

The Worker SHALL expose a `POST /api/upload` endpoint that accepts a multipart/form-data
request containing one image file, stores it in the `IMAGES_BUCKET` R2 binding, and returns
a publicly accessible URL.

Only authenticated admin users SHALL be permitted to call this endpoint. Unauthenticated or
unauthorised requests SHALL be rejected with HTTP 401.

#### Scenario: Successful image upload

- **WHEN** an admin sends `POST /api/upload` with a valid JWT and a multipart body containing a JPEG, PNG, WebP, or GIF file ≤ 5 MB
- **THEN** the Worker stores the file in R2 under key `works/<timestamp>-<random-slug>.<ext>`, responds HTTP 200 with `{ "success": true, "data": { "url": "https://images.jackhellowin.win/<key>", "key": "<key>" } }`, and the file is reachable at that URL

##### Example: key format

- **GIVEN** upload time is Unix ms `1735000000000`, generated random slug is `k9z8x7w6v5`, and the file is a JPEG
- **WHEN** the Worker generates the storage key
- **THEN** the key is `works/1735000000000-k9z8x7w6v5.jpg`

#### Scenario: Request without valid JWT is rejected

- **WHEN** a client calls `POST /api/upload` with no `Authorization` header or an invalid / expired JWT
- **THEN** the Worker responds HTTP 401 and does NOT write anything to R2

#### Scenario: Non-image MIME type is rejected

- **WHEN** an admin uploads a file whose `Content-Type` does not start with `image/`
- **THEN** the Worker responds HTTP 400 with `{ "success": false, "error": { "code": "BAD_REQUEST", "message": "Invalid file type. Allowed: jpg, png, webp, gif" } }` and does NOT write to R2

#### Scenario: File exceeding 5 MB is rejected

- **WHEN** an admin uploads a file larger than 5,242,880 bytes (5 MiB)
- **THEN** the Worker responds HTTP 413 with `{ "success": false, "error": { "code": "PAYLOAD_TOO_LARGE", "message": "File too large (max 5 MB)" } }` and does NOT write to R2

#### Scenario: Missing file field is rejected

- **WHEN** an admin sends a multipart request that contains no field named `file`
- **THEN** the Worker responds HTTP 400 with `{ "success": false, "error": { "code": "BAD_REQUEST", "message": "No file provided" } }` and does NOT write to R2


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
### Requirement: Uploaded images are publicly accessible via CDN

The R2 bucket SHALL be configured with Public Access enabled so that every stored object is
reachable at `https://images.jackhellowin.win/<key>` (or the fallback `pub-xxx.r2.dev` URL
during the DNS propagation window) without authentication.

#### Scenario: Public read of an uploaded image

- **WHEN** any client (authenticated or not) performs `GET https://images.jackhellowin.win/<key>`
- **THEN** the CDN returns the image with the correct `Content-Type` header and HTTP 200, without requiring any authentication token


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
### Requirement: Admin can delete an image from Cloudflare R2

The Worker SHALL expose a `DELETE /api/upload/:key` endpoint that removes the specified object
from the `IMAGES_BUCKET` R2 binding.

Only authenticated admin users SHALL be permitted to call this endpoint. Unauthenticated or
unauthorised requests SHALL be rejected with HTTP 401.

The endpoint SHALL respond HTTP 200 with `{ "success": true }` whether or not the key existed
in R2 (idempotent delete). The Admin client is responsible for clearing the `imgUrl` field in
the works form after a successful delete.

#### Scenario: Admin deletes an existing image

- **WHEN** an admin sends `DELETE /api/upload/<key>` with a valid JWT and the object exists in R2
- **THEN** the Worker calls `env.IMAGES_BUCKET.delete(key)`, responds HTTP 200 `{ "success": true }`, and the object is no longer reachable at its public URL

#### Scenario: Admin deletes a non-existent key (idempotent)

- **WHEN** an admin sends `DELETE /api/upload/<key>` with a valid JWT and the object does NOT exist in R2
- **THEN** the Worker responds HTTP 200 `{ "success": true }` without error

#### Scenario: Delete request without valid JWT is rejected

- **WHEN** a client sends `DELETE /api/upload/<key>` with no `Authorization` header or an invalid JWT
- **THEN** the Worker responds HTTP 401 and does NOT call `env.IMAGES_BUCKET.delete()`


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
### Requirement: R2 object metadata preserves content type

The Worker SHALL pass the original `Content-Type` of the uploaded file as the
`httpMetadata.contentType` option when calling `env.IMAGES_BUCKET.put()`, so that browsers
receive the correct MIME type when fetching the image from R2.

#### Scenario: Content-Type is propagated to R2

- **WHEN** an admin uploads a PNG file (Content-Type: image/png)
- **THEN** the R2 object is stored with `httpMetadata.contentType = "image/png"` and a GET to the public URL returns `Content-Type: image/png`

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