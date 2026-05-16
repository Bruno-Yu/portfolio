## ADDED Requirements

### Requirement: design-admin.css uses shared design tokens without Flowbite

The system SHALL provide `frontend/src/styles/design-admin.css` that defines admin-specific layout classes using the same CSS custom properties (`--bg`, `--ink`, `--accent-y`, `--font-mono`, etc.) as `design-tokens.css`. Flowbite React SHALL be removed as a dependency from the frontend package. No Tailwind utility classes SHALL be present in admin page components after this change.

#### Scenario: Admin pages render without Flowbite

- **WHEN** `flowbite-react` is removed from `frontend/package.json` and the app is built
- **THEN** all backstage pages SHALL render without missing component errors and the TypeScript build SHALL succeed

#### Scenario: Theme toggle affects admin content area

- **WHEN** the user toggles dark mode while on a backstage page
- **THEN** the admin content area background (`--bg`) and text (`--ink`) SHALL transition to dark values, while the sidebar background SHALL remain `#0a0805`

### Requirement: Data table component uses .dt-wrap / .dt classes

All admin pages that display tabular data (Works, Skills, Users) SHALL use the `.dt-wrap` container with a `.dt` table inside it. Table rows SHALL highlight on hover using `--bg-sunk`. Column headers SHALL use 10px monospace uppercase text. Action buttons SHALL use `.icon-btn` (30×30px with 1.5px border).

#### Scenario: Works table renders with design-admin.css

- **WHEN** the Works backstage page renders
- **THEN** the table SHALL display bordered rows with thumbnail, title, status pill, and `.icon-btn` action buttons matching the design mockup

#### Scenario: Status pill indicates published vs draft

- **WHEN** a work has `status: "published"`
- **THEN** the table row's status cell SHALL render a `.status-pill.is-pub` element with a yellow background dot
- **WHEN** a work has `status: "draft"`
- **THEN** the table row SHALL render `.status-pill.is-draft` with a gray dot

### Requirement: Modal component uses .modal-overlay / .modal classes

All admin modals (create/edit/delete dialogs in Works, Skills, Users, Content, Settings) SHALL use `.modal-overlay` (fixed full-screen backdrop) containing `.modal` (max-width 640px, sharp corners). Pressing `Escape` SHALL close the modal. Clicking the overlay SHALL close the modal.

Modal body content SHALL scroll within the modal when fields exceed the available viewport height, so form fields and footer actions remain reachable and do not overflow outside the dialog.

#### Scenario: Modal closes on Escape

- **WHEN** a modal is open and the user presses `Escape`
- **THEN** the modal SHALL unmount and the overlay SHALL disappear

#### Scenario: Modal closes on overlay click

- **WHEN** a modal is open and the user clicks outside the modal container (on the overlay)
- **THEN** the modal SHALL close

##### Example: Works edit modal overlay

- **GIVEN** the Works edit modal is open
- **WHEN** the user clicks the dimmed overlay outside `.modal`
- **THEN** the edit modal unmounts and the Works table is visible again

#### Scenario: Long modal remains usable

- **WHEN** the Works edit modal contains more fields than fit in the viewport
- **THEN** the modal body SHALL scroll internally and all fields SHALL remain inside the dialog boundary

##### Example: Works image editor at small viewport height

- **GIVEN** the viewport height is 720px and the Works edit modal includes title, description, content, tags, and image preview controls
- **WHEN** the user scrolls inside the modal body
- **THEN** the lower fields and footer actions remain reachable without any field crossing outside the modal border

### Requirement: Form fields use .field / .field__label classes

All admin form inputs and textareas SHALL be wrapped in `.field` containers. Labels SHALL use `.field__label` (10px monospace uppercase, `--ink-3` color). Inputs and textareas SHALL have a 1.5px `--ink` border and `--bg-elev` background. On focus, the background SHALL transition to `--accent-y-soft`.

#### Scenario: Input focus state applies accent background

- **WHEN** the user clicks on a form input in any admin modal
- **THEN** the input background SHALL transition to `--accent-y-soft` and the border SHALL remain `--ink`

### Requirement: Admin router wraps all backstage routes under AdminShell

`frontend/src/router/index.tsx` SHALL define a nested route group where `AdminShell` is the parent layout for all `/backstage/*` paths. The router SHALL include routes for: `overview`, `content`, `works`, `skills`, `users`, `messages`, `settings`.

#### Scenario: Direct navigation renders correct page inside shell

- **WHEN** the user navigates to `/backstage/content`
- **THEN** the AdminShell sidebar and topbar SHALL be visible AND the Content Editor page SHALL render in the main content area
