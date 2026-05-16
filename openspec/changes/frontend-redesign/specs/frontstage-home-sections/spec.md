## ADDED Requirements

### Requirement: Home page is a single-page scroll with 7 sections

The `/` route SHALL render a single scrollable page composed of 7 section components in order: Hero → About → Experience → Works → Skills → Services → Contact. There SHALL be no tab navigation or separate routes for individual sections.

#### Scenario: User navigates to home route

- **WHEN** the user navigates to `/`
- **THEN** all 7 sections are rendered in a single scrollable page and no section requires a route change to view

### Requirement: Hero section displays portrait with decorative frame and stamp

The Hero section SHALL render a large headline with a highlighted accent phrase, a float-right portrait image inside a bordered frame, and a circular stamp overlay at the lower-left of the portrait.

#### Scenario: Hero renders portrait and stamp

- **WHEN** the Hero section is visible
- **THEN** `avatar.webp` is shown inside a `3:4 aspect-ratio` bordered portrait box, `stamp.webp` is positioned at the lower-left with `mix-blend-mode: multiply` (light) / `normal` (dark), and the headline accent phrase is highlighted with the yellow accent color

### Requirement: Hero bottom nav cards link to sibling sections

The Hero section SHALL render 3 quick-navigation cards at the bottom (About me / Selected work / Get in touch) that smooth-scroll to the corresponding sections on click.

#### Scenario: Clicking "Selected work" nav card

- **WHEN** the user clicks the "Selected work" quick-nav card
- **THEN** the page smooth-scrolls to the `#works` section

### Requirement: Works section shows up to 6 works from the API

The Works section SHALL fetch works from the API, display the first 6 items as cards, and provide a "View all" button that navigates to `/works`.

#### Scenario: API returns works with imgUrl

- **WHEN** the API responds with works where `imgUrl` is populated
- **THEN** each work card displays the `imgUrl` image as its cover; if `imgUrl` is absent, `imgLink` is used as fallback

### Requirement: Works section modal shows full work details on card click

Clicking a work card in the Works section SHALL open an inline modal displaying the work's `content` (or `description`), tags, GitHub link (`gitHubUrl`), and demo link (`gitPageUrl`).

#### Scenario: User clicks a work card

- **WHEN** the user clicks on a work card
- **THEN** a modal overlay appears with the work's full content, image, tags, and action links; body scroll is locked while the modal is open

### Requirement: Skills section renders skill tags from the API

The Skills section SHALL fetch skills from the API and render each skill as a tag element grouped by category.

#### Scenario: Skills load successfully

- **WHEN** the API returns a skills list
- **THEN** each skill is displayed as a tag and grouped under its category heading

### Requirement: Contact section displays static contact metadata

The Contact section SHALL render static contact information (email, social links) from `portfolio.ts` content, without an API call.

#### Scenario: Contact section renders

- **WHEN** the Contact section is visible
- **THEN** all configured contact links (email, GitHub, LinkedIn, Blog, etc.) are rendered as clickable elements
