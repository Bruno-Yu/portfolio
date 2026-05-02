## ADDED Requirements

### Requirement: Admin works form provides a file input for image upload

The works create and edit forms in the Admin BackStage SHALL include a file input element
(`<input type="file" accept="image/*">`) that allows the admin to select an image from the
local filesystem.

Selecting a file SHALL immediately trigger an upload to `POST /api/upload` using the stored
JWT access token in the Authorization header. The file input SHALL be visually labelled so its
purpose is unambiguous.

#### Scenario: Admin selects an image file in the create form

- **WHEN** an admin opens the works create form and selects an image file via the file input
- **THEN** the form sends `POST /api/upload` with `multipart/form-data` containing the selected file and the `Authorization: Bearer <token>` header, then displays a loading indicator while the upload is in progress

#### Scenario: Admin selects an image file in the edit form

- **WHEN** an admin opens an existing work's edit form and selects a new image file
- **THEN** the same upload flow executes as in the create form and the returned URL replaces the previous value in the imgUrl field

### Requirement: Successful upload populates imgUrl and shows a preview

After a successful `POST /api/upload` response, the form SHALL automatically populate the
`imgUrl` input field with the returned URL and render an `<img>` preview of the uploaded image
directly in the form, so the admin can confirm the upload before saving the work.

#### Scenario: Upload succeeds and URL is injected

- **WHEN** the upload API returns `{ "success": true, "url": "<r2-url>" }`
- **THEN** the `imgUrl` text field is set to `<r2-url>` and an `<img src="<r2-url>">` preview is rendered below the file input, with no further action required from the admin

### Requirement: Upload error is surfaced to the admin

If the `POST /api/upload` request fails (non-2xx HTTP status or network error), the form SHALL
display a human-readable error message adjacent to the file input and SHALL NOT modify the
existing `imgUrl` value, so the admin's previously saved URL is preserved.

#### Scenario: Upload returns a 413 error

- **WHEN** the admin selects a file larger than 5 MB and the API returns HTTP 413
- **THEN** the form shows the message "File too large (max 5 MB)" near the file input and the imgUrl field retains its previous value

#### Scenario: Upload returns a 400 error

- **WHEN** the admin selects a non-image file and the API returns HTTP 400
- **THEN** the form shows the message "Invalid file type" near the file input and the imgUrl field retains its previous value

#### Scenario: Network error during upload

- **WHEN** the upload request fails due to a network error
- **THEN** the form shows a generic error message "Upload failed, please retry" and the imgUrl field retains its previous value

### Requirement: Admin can delete an uploaded image from the works form

The works create and edit forms SHALL include a delete button (or icon) adjacent to the image
preview. Clicking it SHALL call `DELETE /api/upload/:key` using the JWT in the Authorization
header and, on success, clear the `imgUrl` field and hide the image preview.

The delete button SHALL only be visible when `imgUrl` currently holds an R2-hosted URL (i.e.,
a URL whose origin matches the configured R2 public domain). It SHALL NOT appear for legacy
Imgur URLs, because those objects are not stored in this project's R2 bucket.

#### Scenario: Admin deletes an R2 image via the form

- **WHEN** the `imgUrl` field contains an R2 URL and the admin clicks the delete button
- **THEN** the form sends `DELETE /api/upload/<key>` with the JWT, and on HTTP 200 response the `imgUrl` field is cleared and the image preview is removed

#### Scenario: Delete button is hidden for non-R2 URLs

- **WHEN** the `imgUrl` field contains a legacy Imgur URL (not matching the R2 public domain)
- **THEN** no delete button is shown; the admin can only manually clear or replace the URL

#### Scenario: Delete API error is surfaced to the admin

- **WHEN** the `DELETE /api/upload/:key` request returns a non-2xx status or network error
- **THEN** the form displays an error message near the image preview and does NOT clear the `imgUrl` field

### Requirement: Manual URL input is preserved alongside upload UI

The `imgUrl` and `imgLink` text input fields SHALL remain editable after a file upload. Admins
SHALL be able to manually type or paste a URL (including legacy Imgur URLs) into either field
at any time, overriding the value injected by the upload. This ensures backward compatibility
with existing works that store Imgur URLs in D1.

#### Scenario: Admin manually overwrites upload URL

- **WHEN** an upload has populated `imgUrl` with an R2 URL and the admin then manually types a different URL into the `imgUrl` text field
- **THEN** the field holds the manually typed value and that value is submitted when the form is saved
