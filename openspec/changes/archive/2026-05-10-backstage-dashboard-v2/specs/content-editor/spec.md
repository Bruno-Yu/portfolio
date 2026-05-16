## ADDED Requirements

### Requirement: Content Editor page renders three editable sections

The system SHALL render a backstage page at `/backstage/content` with three labeled sections: "01 — Hero / Homepage" (greeting, headline, sub-headline fields), "02 — About" (multi-paragraph textarea), and "03 — Work Experience" (repeating entry rows). A language toggle (EN/中) in the page header SHALL switch all field values between languages without losing unsaved changes in either language.

#### Scenario: Page loads with DB values when available

- **WHEN** the Content Editor page mounts and `GET /api/content-blocks` returns values for `hero.greeting.en` and `hero.greeting.zh`
- **THEN** the greeting fields SHALL display the API values, not the static values from `portfolio.ts`

#### Scenario: Page loads with static fallback when DB is empty

- **WHEN** the Content Editor page mounts and `GET /api/content-blocks` returns `{}`
- **THEN** all fields SHALL display the corresponding values from `portfolio.ts` as placeholder/default content

#### Scenario: Language toggle switches field language in-place

- **WHEN** the user edits the greeting field in EN, then clicks the ZH toggle
- **THEN** the greeting field SHALL display the ZH value (either from DB or static fallback), and the EN edit SHALL be preserved in component state

##### Example: Preserve unsaved English edit

- **GIVEN** the EN greeting field contains unsaved text `"Hello from admin"`
- **WHEN** the user switches to ZH and then back to EN
- **THEN** the EN field SHALL still display `"Hello from admin"`

### Requirement: Work Experience entries support add, edit, and delete

The system SHALL render each experience entry as a row with from/to year inputs, role input (language-aware), org input (language-aware), location input, tags input, and a bullets textarea (language-aware). Tags SHALL be editable as a comma-separated list and saved as an array. Bullets SHALL be edited entirely from backstage content and saved as language-specific arrays. An "Add experience" button SHALL append a blank entry row. Each row SHALL have a delete button that removes it from state immediately (before save).

#### Scenario: Add new experience entry

- **WHEN** the user clicks "Add experience"
- **THEN** a new blank row SHALL appear at the bottom of the experience list

#### Scenario: Delete experience entry

- **WHEN** the user clicks the delete button on an experience row
- **THEN** that row SHALL be removed from the editor state immediately without triggering an API call

##### Example: Remove seeded experience before save

- **GIVEN** the editor shows two experience rows with ids `1` and `2`
- **WHEN** the user deletes row `2`
- **THEN** only row `1` remains visible until Save decides whether to call `DELETE /api/experiences/2`

### Requirement: Sticky save bar persists and shows save status

The Content Editor page SHALL display a sticky bar at the bottom of the viewport containing a save status indicator, a "Reset" outline button, and a filled "Save" button. The admin sidebar SHALL remain full-height (`100vh`) and visually cover the save bar in the sidebar area. After a successful save, the status indicator SHALL display "Saved ✓" in green for 3 seconds before returning to its neutral state.

#### Scenario: Save button triggers bulk upsert

- **WHEN** the user clicks Save
- **THEN** the system SHALL call `POST /api/content-blocks` with all modified content block values AND call `POST /api/experiences` / `PUT /api/experiences/:id` / `DELETE /api/experiences/:id` as needed for each experience row change

#### Scenario: Save status shows success confirmation

- **WHEN** all API calls complete successfully
- **THEN** the save bar SHALL display "Saved ✓" for 3 seconds then return to neutral

#### Scenario: Reset restores last-saved values

- **WHEN** the user clicks "Reset"
- **THEN** all fields SHALL revert to the values fetched from the API on last load (or the static fallback if no API values existed)

### Requirement: Frontend sections fall back to static content when no API override exists

`usePageContent(keys: string[])` SHALL fetch `GET /api/content-blocks` on mount, store the result in a module-level cache, and return a resolver function `get(key, lang)` that returns the API value if it exists, or the corresponding `portfolio.ts` value otherwise. `useExperiences()` SHALL call `GET /api/experiences` and return the array; if the array is empty, it SHALL return the `experience` array from `portfolio.ts`.

#### Scenario: Frontend uses API value over static value

- **WHEN** `GET /api/content-blocks` returns `{ "hero.greeting.en": "Hello there." }` and `portfolio.ts` has `home.hello.en = "Hi, I'm Bruno."`
- **THEN** `get("hero.greeting", "en")` SHALL return `"Hello there."`, not `"Hi, I'm Bruno."`

#### Scenario: Frontend falls back when key absent

- **WHEN** `GET /api/content-blocks` returns `{}` (empty)
- **THEN** `get("hero.greeting", "en")` SHALL return the value from `portfolio.ts` `home.hello.en`

#### Scenario: API fetch error does not crash frontend

- **WHEN** `GET /api/content-blocks` returns a network error
- **THEN** all content hooks SHALL silently fall back to `portfolio.ts` static values and the public site SHALL render normally
