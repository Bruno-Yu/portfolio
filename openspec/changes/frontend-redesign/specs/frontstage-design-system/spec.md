## ADDED Requirements

### Requirement: CSS design tokens define the visual system

The design system SHALL define all colors, fonts, and spacing as CSS custom properties in `design-tokens.css` so that every FrontStage component references variables rather than hard-coded values.

Light theme defaults SHALL be set on `:root`; dark theme overrides SHALL be set under `[data-theme="dark"]`.

#### Scenario: Light theme renders cream background

- **WHEN** `data-theme` attribute is absent or set to `"light"` on `<html>`
- **THEN** `--bg` resolves to the warm cream value (`#f4efe4`) and `--ink` resolves to the dark ink value (`#14120e`)

#### Scenario: Dark theme renders dark background

- **WHEN** `data-theme="dark"` is set on `<html>`
- **THEN** `--bg` resolves to a dark background value and `--ink` resolves to a light foreground value

### Requirement: Theme toggle persists across page reloads

The system SHALL store the current theme (`"light"` or `"dark"`) in `localStorage` under the key `"theme"` and SHALL restore it on page load before the first paint to prevent flash of incorrect theme.

#### Scenario: Returning visitor sees their previously chosen theme

- **WHEN** a user sets theme to dark, closes the browser, and reopens the portfolio
- **THEN** the page renders in dark theme without a flash of light theme

### Requirement: Language toggle persists across page reloads

The system SHALL store the current language (`"en"` or `"zh"`) in `localStorage` under the key `"lang"` and SHALL restore it on page load.

#### Scenario: Returning visitor sees their previously chosen language

- **WHEN** a user switches to English, closes the browser, and reopens the portfolio
- **THEN** all UI text renders in English

### Requirement: FrontStage BEM classes do not conflict with Admin Tailwind classes

The BEM class namespace used by FrontStage components (e.g., `.hero`, `.work-card`, `.rail`) SHALL NOT overlap with Tailwind utility class names used by BackStage components.

#### Scenario: Both FrontStage and BackStage CSS are loaded simultaneously

- **WHEN** the application bundle includes both `design-shell.css` and Tailwind's generated stylesheet
- **THEN** no style rule from either system unintentionally overrides the other
