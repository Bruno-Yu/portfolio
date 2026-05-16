# frontstage-globe-accent Specification

## Purpose

TBD - created by archiving change 'frontstage-opendesign-libs'. Update Purpose after archive.

## Requirements

### Requirement: Contact globe accent

The FrontStage SHALL render a globe accent near contact-oriented Home content without changing existing navigation, API calls, or contact links.

#### Scenario: Globe appears in contact area

- **WHEN** the Home page renders the Contact section
- **THEN** the page displays a globe accent that is visually secondary to the contact headline and links

##### Example: Desktop Contact section

- **GIVEN** the viewport is 1440px wide
- **WHEN** the user scrolls to Contact
- **THEN** the globe appears beside the contact content while the headline and link actions remain visually dominant

#### Scenario: Contact links remain primary

- **WHEN** a user views or tabs through the Contact section
- **THEN** the email, GitHub, LinkedIn, Blog, and CakeResume links remain reachable and unchanged

##### Example: Keyboard tab order

- **GIVEN** focus is entering the Contact section
- **WHEN** the user presses Tab through the available links
- **THEN** focus reaches the same email, GitHub, LinkedIn, Blog, and CakeResume links without the globe receiving focus


<!-- @trace
source: frontstage-opendesign-libs
updated: 2026-05-10
code:
  - frontend/src/views/FrontStage/Home/index.tsx
  - workers/migrations/0003_content_experiences_messages.sql
  - frontend/package.json
  - frontend/src/config.ts
  - frontend/src/content/portfolio.ts
  - frontend/src/styles/design-admin.css
  - frontend/src/views/FrontStage/Home/sections/ContactGlobe.tsx
  - workers/src/routes/auth.ts
  - workers/src/index.ts
  - frontend/tailwind.config.js
  - frontend/src/api/request.ts
  - frontend/src/views/FrontStage/Home/sections/ExperienceSection.tsx
  - workers/src/routes/messages.ts
  - frontend/src/views/BackStage/Messages/index.tsx
  - workers/src/routes/contentBlocks.ts
  - frontend/src/views/BackStage/Works/index.tsx
  - frontend/src/styles/design-tokens.css
  - frontend/src/components/Layout/BackStage/AdminPageHead.tsx
  - workers/src/drizzle/schema/messages.ts
  - frontend/src/styles/design-shell.css
  - workers/src/routes/analytics.ts
  - frontend/src/views/FrontStage/Login/index.tsx
  - workers/src/drizzle/schema/experiences.ts
  - workers/wrangler.toml
  - frontend/src/views/BackStage/Settings/index.tsx
  - workers/src/drizzle/schema/contentBlocks.ts
  - frontend/src/views/BackStage/Content/index.tsx
  - frontend/src/App.tsx
  - workers/src/drizzle/schema/index.ts
  - frontend/src/views/FrontStage/Home/sections/HeroSection.tsx
  - frontend/src/views/BackStage/Skills/index.tsx
  - workers/src/routes/upload.ts
  - frontend/src/views/BackStage/Users/index.tsx
  - frontend/public/_routes.json
  - frontend/public/images/avatar.webp
  - frontend/src/layout/Layout.tsx
  - frontend/src/views/FrontStage/Home/sections/AboutSection.tsx
  - frontend/src/components/Layout/FrontStage/Rail.tsx
  - frontend/src/components/Layout/BackStage/AdminShell.tsx
  - frontend/src/views/FrontStage/Home/sections/ContactSection.tsx
  - frontend/src/views/BackStage/Overview/index.tsx
  - workers/migrations/0004_experience_rich_content.sql
  - frontend/src/content/apiFallback.ts
  - frontend/src/Hooks/useExperiences.ts
  - frontend/src/Hooks/usePageContent.ts
  - frontend/src/views/FrontStage/Works/index.tsx
  - frontend/vite.config.ts
  - workers/src/routes/experiences.ts
-->

---
### Requirement: Theme-aware globe styling

The globe accent SHALL use the existing FrontStage theme tokens and SHALL remain legible in light and dark themes.

#### Scenario: Light theme globe

- **WHEN** the document uses the light theme
- **THEN** the globe uses ink, paper, and yellow accent colors that match the FrontStage visual system

##### Example: Light palette

- **GIVEN** the root theme is light
- **WHEN** the globe initializes
- **THEN** its land, marker, and glow colors use the existing ink, paper, and yellow accent family

#### Scenario: Dark theme globe

- **WHEN** the document uses the dark theme
- **THEN** the globe updates to dark-compatible colors without reducing nearby text contrast

##### Example: Dark palette

- **GIVEN** the root theme is dark
- **WHEN** the globe initializes
- **THEN** nearby Contact text remains readable and the globe does not use the light paper background as its dominant fill


<!-- @trace
source: frontstage-opendesign-libs
updated: 2026-05-10
code:
  - frontend/src/views/FrontStage/Home/index.tsx
  - workers/migrations/0003_content_experiences_messages.sql
  - frontend/package.json
  - frontend/src/config.ts
  - frontend/src/content/portfolio.ts
  - frontend/src/styles/design-admin.css
  - frontend/src/views/FrontStage/Home/sections/ContactGlobe.tsx
  - workers/src/routes/auth.ts
  - workers/src/index.ts
  - frontend/tailwind.config.js
  - frontend/src/api/request.ts
  - frontend/src/views/FrontStage/Home/sections/ExperienceSection.tsx
  - workers/src/routes/messages.ts
  - frontend/src/views/BackStage/Messages/index.tsx
  - workers/src/routes/contentBlocks.ts
  - frontend/src/views/BackStage/Works/index.tsx
  - frontend/src/styles/design-tokens.css
  - frontend/src/components/Layout/BackStage/AdminPageHead.tsx
  - workers/src/drizzle/schema/messages.ts
  - frontend/src/styles/design-shell.css
  - workers/src/routes/analytics.ts
  - frontend/src/views/FrontStage/Login/index.tsx
  - workers/src/drizzle/schema/experiences.ts
  - workers/wrangler.toml
  - frontend/src/views/BackStage/Settings/index.tsx
  - workers/src/drizzle/schema/contentBlocks.ts
  - frontend/src/views/BackStage/Content/index.tsx
  - frontend/src/App.tsx
  - workers/src/drizzle/schema/index.ts
  - frontend/src/views/FrontStage/Home/sections/HeroSection.tsx
  - frontend/src/views/BackStage/Skills/index.tsx
  - workers/src/routes/upload.ts
  - frontend/src/views/BackStage/Users/index.tsx
  - frontend/public/_routes.json
  - frontend/public/images/avatar.webp
  - frontend/src/layout/Layout.tsx
  - frontend/src/views/FrontStage/Home/sections/AboutSection.tsx
  - frontend/src/components/Layout/FrontStage/Rail.tsx
  - frontend/src/components/Layout/BackStage/AdminShell.tsx
  - frontend/src/views/FrontStage/Home/sections/ContactSection.tsx
  - frontend/src/views/BackStage/Overview/index.tsx
  - workers/migrations/0004_experience_rich_content.sql
  - frontend/src/content/apiFallback.ts
  - frontend/src/Hooks/useExperiences.ts
  - frontend/src/Hooks/usePageContent.ts
  - frontend/src/views/FrontStage/Works/index.tsx
  - frontend/vite.config.ts
  - workers/src/routes/experiences.ts
-->

---
### Requirement: Motion and viewport resilience

The globe accent MUST avoid breaking the page on reduced-motion settings, unsupported canvas contexts, or narrow viewports.

#### Scenario: Reduced motion

- **WHEN** the user prefers reduced motion
- **THEN** globe rotation is disabled or reduced enough that the Contact section remains calm

##### Example: prefers-reduced-motion

- **GIVEN** `prefers-reduced-motion: reduce` is active
- **WHEN** the Contact section renders
- **THEN** the globe remains present but rotation is stopped or slowed enough to avoid continuous motion

#### Scenario: Canvas unavailable

- **WHEN** the globe canvas cannot initialize
- **THEN** the Contact section still renders a stable non-interactive fallback without throwing a runtime error

##### Example: Canvas context failure

- **GIVEN** the browser cannot create a 2D canvas context
- **WHEN** the globe component mounts
- **THEN** the component fails closed and the Contact headline, body copy, and links still render

#### Scenario: Narrow viewport

- **WHEN** the viewport is mobile width
- **THEN** the Contact section layout remains readable with no overlap between the globe, CTA, and link list

##### Example: 390px mobile viewport

- **GIVEN** the viewport width is 390px
- **WHEN** the user scrolls to Contact
- **THEN** the globe stacks or scales below the main contact copy and does not cover the CTA or link list

<!-- @trace
source: frontstage-opendesign-libs
updated: 2026-05-10
code:
  - frontend/src/views/FrontStage/Home/index.tsx
  - workers/migrations/0003_content_experiences_messages.sql
  - frontend/package.json
  - frontend/src/config.ts
  - frontend/src/content/portfolio.ts
  - frontend/src/styles/design-admin.css
  - frontend/src/views/FrontStage/Home/sections/ContactGlobe.tsx
  - workers/src/routes/auth.ts
  - workers/src/index.ts
  - frontend/tailwind.config.js
  - frontend/src/api/request.ts
  - frontend/src/views/FrontStage/Home/sections/ExperienceSection.tsx
  - workers/src/routes/messages.ts
  - frontend/src/views/BackStage/Messages/index.tsx
  - workers/src/routes/contentBlocks.ts
  - frontend/src/views/BackStage/Works/index.tsx
  - frontend/src/styles/design-tokens.css
  - frontend/src/components/Layout/BackStage/AdminPageHead.tsx
  - workers/src/drizzle/schema/messages.ts
  - frontend/src/styles/design-shell.css
  - workers/src/routes/analytics.ts
  - frontend/src/views/FrontStage/Login/index.tsx
  - workers/src/drizzle/schema/experiences.ts
  - workers/wrangler.toml
  - frontend/src/views/BackStage/Settings/index.tsx
  - workers/src/drizzle/schema/contentBlocks.ts
  - frontend/src/views/BackStage/Content/index.tsx
  - frontend/src/App.tsx
  - workers/src/drizzle/schema/index.ts
  - frontend/src/views/FrontStage/Home/sections/HeroSection.tsx
  - frontend/src/views/BackStage/Skills/index.tsx
  - workers/src/routes/upload.ts
  - frontend/src/views/BackStage/Users/index.tsx
  - frontend/public/_routes.json
  - frontend/public/images/avatar.webp
  - frontend/src/layout/Layout.tsx
  - frontend/src/views/FrontStage/Home/sections/AboutSection.tsx
  - frontend/src/components/Layout/FrontStage/Rail.tsx
  - frontend/src/components/Layout/BackStage/AdminShell.tsx
  - frontend/src/views/FrontStage/Home/sections/ContactSection.tsx
  - frontend/src/views/BackStage/Overview/index.tsx
  - workers/migrations/0004_experience_rich_content.sql
  - frontend/src/content/apiFallback.ts
  - frontend/src/Hooks/useExperiences.ts
  - frontend/src/Hooks/usePageContent.ts
  - frontend/src/views/FrontStage/Works/index.tsx
  - frontend/vite.config.ts
  - workers/src/routes/experiences.ts
-->