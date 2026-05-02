## ADDED Requirements

### Requirement: Works page displays all works with pagination

The `/works` route SHALL render all works in a grid of BEM-styled cards fetched from the API, with pagination controls that fetch the next page when clicked.

#### Scenario: Works page loads first page

- **WHEN** the user navigates to `/works`
- **THEN** the first page of works is displayed as cards, and pagination controls appear if `totalPages > 1`

### Requirement: Works page cards show cover image with fallback

Each work card on the `/works` page SHALL display the cover image from `imgUrl` (with `imgLink` as fallback). If neither field is populated, the card SHALL display the work's `type` or `kind` as a text placeholder.

#### Scenario: Work has imgUrl

- **WHEN** a work object has a non-empty `imgUrl` field
- **THEN** the card renders `<img src="{imgUrl}">` as the cover

#### Scenario: Work has no image fields

- **WHEN** both `imgUrl` and `imgLink` are absent or empty
- **THEN** the card renders the work's `type`/`kind` string as an uppercase text placeholder

### Requirement: Works page modal shows full work details on card click

Clicking a work card on the `/works` page SHALL open a modal with the same fields as the Home Works section: image, `content`/`description`, tags, GitHub (`gitHubUrl`), and demo (`gitPageUrl`) links.

#### Scenario: User clicks a work card on the /works page

- **WHEN** the user clicks a work card
- **THEN** a modal overlay opens with full work details; body scroll is locked while the modal is open; clicking the overlay or the ✕ button closes the modal
