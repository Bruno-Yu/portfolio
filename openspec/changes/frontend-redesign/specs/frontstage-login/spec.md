## ADDED Requirements

### Requirement: Login page uses two-column layout

The login page at `/login` SHALL render a two-column layout (`login-shell`): left column shows brand identity (logo and `stamp.webp` image), right column shows the `login-card` form. On viewports < 900 px the layout SHALL collapse to a single column (form only).

#### Scenario: Desktop login page renders two-column layout

- **WHEN** the user navigates to `/login` on a viewport ≥ 900 px
- **THEN** the left brand column and right form column are both visible side by side

#### Scenario: Mobile login page renders single column

- **WHEN** the user navigates to `/login` on a viewport < 900 px
- **THEN** only the login form is visible; the brand column is hidden

### Requirement: Login form uses existing API auth logic

The login form SHALL call `authApi.login()` with the user's credentials. On success it SHALL store the JWT and redirect to the Admin dashboard. On failure it SHALL display a bilingual error message without clearing the username field.

#### Scenario: Successful login redirects to admin

- **WHEN** the user submits valid credentials
- **THEN** the JWT is stored, the user is redirected to `/contents` (or the admin dashboard route), and no error is shown

#### Scenario: Failed login shows error message

- **WHEN** the user submits invalid credentials and the API returns an error
- **THEN** an error message is displayed in the current language (English or Chinese), and the username field retains its value
