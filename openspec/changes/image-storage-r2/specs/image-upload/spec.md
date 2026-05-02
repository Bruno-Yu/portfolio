## ADDED Requirements

### Requirement: Admin can upload an image to Cloudflare R2

The Worker SHALL expose a `POST /api/upload` endpoint that accepts a multipart/form-data
request containing one image file, stores it in the `IMAGES_BUCKET` R2 binding, and returns
a publicly accessible URL.

Only authenticated admin users SHALL be permitted to call this endpoint. Unauthenticated or
unauthorised requests SHALL be rejected with HTTP 401.

#### Scenario: Successful image upload

- **WHEN** an admin sends `POST /api/upload` with a valid JWT and a multipart body containing a JPEG, PNG, WebP, or GIF file ≤ 5 MB
- **THEN** the Worker stores the file in R2 under key `<timestamp>-<uuid>.<ext>`, responds HTTP 200 with `{ "success": true, "url": "<public-url>/<key>" }`, and the file is reachable at that URL

##### Example: key format

- **GIVEN** upload time is Unix ms `1735000000000`, generated UUID is `550e8400-e29b-41d4-a716-446655440000`, and the file is a JPEG
- **WHEN** the Worker generates the storage key
- **THEN** the key is `1735000000000-550e8400-e29b-41d4-a716-446655440000.jpg`

#### Scenario: Request without valid JWT is rejected

- **WHEN** a client calls `POST /api/upload` with no `Authorization` header or an invalid / expired JWT
- **THEN** the Worker responds HTTP 401 and does NOT write anything to R2

#### Scenario: Non-image MIME type is rejected

- **WHEN** an admin uploads a file whose `Content-Type` does not start with `image/`
- **THEN** the Worker responds HTTP 400 with `{ "success": false, "error": "Invalid file type" }` and does NOT write to R2

#### Scenario: File exceeding 5 MB is rejected

- **WHEN** an admin uploads a file larger than 5,242,880 bytes (5 MiB)
- **THEN** the Worker responds HTTP 413 with `{ "success": false, "error": "File too large" }` and does NOT write to R2

#### Scenario: Missing file field is rejected

- **WHEN** an admin sends a multipart request that contains no field named `file`
- **THEN** the Worker responds HTTP 400 with `{ "success": false, "error": "No file provided" }` and does NOT write to R2

### Requirement: Uploaded images are publicly accessible via CDN

The R2 bucket SHALL be configured with Public Access enabled so that every stored object is
reachable at `https://images.jackhellowin.win/<key>` (or the fallback `pub-xxx.r2.dev` URL
during the DNS propagation window) without authentication.

#### Scenario: Public read of an uploaded image

- **WHEN** any client (authenticated or not) performs `GET https://images.jackhellowin.win/<key>`
- **THEN** the CDN returns the image with the correct `Content-Type` header and HTTP 200, without requiring any authentication token

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

### Requirement: R2 object metadata preserves content type

The Worker SHALL pass the original `Content-Type` of the uploaded file as the
`httpMetadata.contentType` option when calling `env.IMAGES_BUCKET.put()`, so that browsers
receive the correct MIME type when fetching the image from R2.

#### Scenario: Content-Type is propagated to R2

- **WHEN** an admin uploads a PNG file (Content-Type: image/png)
- **THEN** the R2 object is stored with `httpMetadata.contentType = "image/png"` and a GET to the public URL returns `Content-Type: image/png`
