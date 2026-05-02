## ADDED Requirements

### Requirement: Rail sidebar is always visible on desktop

The Rail sidebar SHALL be rendered as a fixed 280 px left column on viewports ≥ 900 px wide, containing: logo/name, primary navigation links, social links, and lang/theme toggles.

#### Scenario: Desktop user sees Rail at all times

- **WHEN** the viewport width is ≥ 900 px and the user scrolls the main content
- **THEN** the Rail remains fixed on the left and does not scroll with the page content

### Requirement: Rail collapses to a top bar on mobile

On viewports < 900 px the Rail SHALL render as a horizontal top bar instead of a left column, so that the main content area uses the full viewport width.

#### Scenario: Mobile viewport shows top bar

- **WHEN** the viewport width is < 900 px
- **THEN** the Rail is rendered as a top bar and the main content occupies the full width below it

### Requirement: Lang toggle switches all UI text

Clicking the lang toggle in the Rail SHALL switch the application language between `"en"` and `"zh"`. All rendered text in FrontStage sections SHALL update without a page reload.

#### Scenario: Switching from Chinese to English

- **WHEN** the user clicks the lang toggle while language is `"zh"`
- **THEN** `lang` state changes to `"en"`, all section headings and body text switch to English, and `localStorage["lang"]` is set to `"en"`

### Requirement: Theme toggle switches color scheme

Clicking the theme toggle in the Rail SHALL switch the application theme between `"light"` and `"dark"`. The `data-theme` attribute on `<html>` SHALL update immediately.

#### Scenario: Switching to dark theme

- **WHEN** the user clicks the theme toggle while theme is `"light"`
- **THEN** `data-theme="dark"` is set on `<html>`, colors update to dark palette, and `localStorage["theme"]` is set to `"dark"`

### Requirement: Scroll-spy highlights the active section in Rail nav

The Rail primary navigation SHALL highlight the nav item corresponding to the currently visible Home section using an IntersectionObserver. The active state SHALL update as the user scrolls.

#### Scenario: User scrolls to Works section

- **WHEN** the Works section (`#works`) enters the viewport and the IntersectionObserver fires
- **THEN** the "Works" nav item in the Rail receives the active style and the "Home" nav item loses it
