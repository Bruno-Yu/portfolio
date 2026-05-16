## ADDED Requirements

### Requirement: content_blocks table stores bilingual text by key

The system SHALL maintain a `content_blocks` table in D1 with schema `(key TEXT, lang TEXT, value TEXT, updated_at INTEGER, PRIMARY KEY(key, lang))`. Keys SHALL follow dot-notation namespacing (e.g., `hero.greeting`, `about.paragraphs`, `settings.title`). `lang` SHALL be either `"en"` or `"zh"`.

#### Scenario: Upsert new content block

- **WHEN** `POST /api/content-blocks` is called with `[{ key: "hero.greeting", lang: "en", value: "Hi, I'm Bruno." }]`
- **THEN** the system SHALL insert or replace the row with `key="hero.greeting"` and `lang="en"`, and return `{ success: true, count: 1 }`

#### Scenario: Partial key retrieval

- **WHEN** `GET /api/content-blocks` is called
- **THEN** the system SHALL return all rows as a flat map `{ "hero.greeting.en": "Hi, I'm Bruno.", "hero.greeting.zh": "你好..." }`

##### Example: GET response shape

| DB rows | GET response |
|---|---|
| `(hero.greeting, en, "Hi")`, `(hero.greeting, zh, "你好")` | `{ "hero.greeting.en": "Hi", "hero.greeting.zh": "你好" }` |
| (empty table) | `{}` |

### Requirement: content-blocks GET endpoint is public

`GET /api/content-blocks` SHALL be accessible without authentication. This allows the frontend to fetch content on page load before any user session exists.

#### Scenario: Public read succeeds without token

- **WHEN** an unauthenticated request is sent to `GET /api/content-blocks`
- **THEN** the system SHALL return `200` with the content map (or `{}` if empty)

### Requirement: content-blocks POST endpoint is admin-only

`POST /api/content-blocks` SHALL require a valid admin JWT. The request body SHALL be an array of `{ key: string, lang: "en" | "zh", value: string }` objects. The system SHALL upsert all provided rows atomically.

#### Scenario: Unauthorized write rejected

- **WHEN** `POST /api/content-blocks` is called without a JWT
- **THEN** the system SHALL return `401 Unauthorized`

#### Scenario: Bulk upsert

- **WHEN** `POST /api/content-blocks` is called with 5 content block objects
- **THEN** all 5 SHALL be upserted in a single D1 transaction and the response SHALL include `{ success: true, count: 5 }`

### Requirement: experiences table stores structured bilingual work history

The system SHALL maintain an `experiences` table with columns: `id`, `sort_order INTEGER`, `from_year TEXT`, `to_year TEXT`, `role_en TEXT`, `role_zh TEXT`, `org_en TEXT`, `org_zh TEXT`, `location TEXT`, `tags TEXT`, `bullets_en TEXT`, `bullets_zh TEXT`, `note_en TEXT`, `note_zh TEXT`. `tags`, `bullets_en`, and `bullets_zh` SHALL store JSON-serialized string arrays.

#### Scenario: GET experiences returns ordered list

- **WHEN** `GET /api/experiences` is called
- **THEN** the system SHALL return all experience rows ordered by `sort_order ASC, id ASC` as a JSON array, with `tags`, `bulletsEn`, and `bulletsZh` parsed back to arrays

#### Scenario: CREATE experience

- **WHEN** `POST /api/experiences` is called with admin JWT and a valid experience object
- **THEN** the system SHALL insert the row and return `{ success: true, data: <new row> }` with status `201`

#### Scenario: UPDATE experience

- **WHEN** `PUT /api/experiences/:id` is called with admin JWT
- **THEN** the system SHALL update only the provided fields and return `{ success: true, data: <updated row> }`

#### Scenario: DELETE experience

- **WHEN** `DELETE /api/experiences/:id` is called with admin JWT
- **THEN** the system SHALL delete the row and return `{ success: true }`

#### Scenario: GET experiences is public

- **WHEN** an unauthenticated request is sent to `GET /api/experiences`
- **THEN** the system SHALL return `200` with the experiences array

### Requirement: messages table stores contact inquiries

The system SHALL maintain a `messages` table with columns: `id`, `sender_name TEXT`, `sender_email TEXT NOT NULL`, `subject TEXT`, `body TEXT NOT NULL`, `is_read INTEGER DEFAULT 0`, `created_at INTEGER`. No public POST endpoint is required in this change (messages UI is out of scope); the table is created for future use.

#### Scenario: Table exists after migration

- **WHEN** migration `0003` is applied
- **THEN** `SELECT * FROM messages` SHALL return an empty result set without error
