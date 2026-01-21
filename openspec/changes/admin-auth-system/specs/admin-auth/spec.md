# Admin Authentication Requirements

## ADDED Requirements

### Authentication Flow

#### Scenario: User logs in with valid credentials
Given the user provides valid `username` and `password`
When the user submits a login request to `POST /api/auth/login`
Then the system validates the credentials
And returns a 200 response with `access_token` and `refresh_token`
And sets the refresh token in an HTTP-only cookie

#### Scenario: User logs in with invalid credentials
Given the user provides invalid `username` or `password`
When the user submits a login request to `POST /api/auth/login`
Then the system returns a 401 response with error code `INVALID_CREDENTIALS`

#### Scenario: User logs in with environment variable admin credentials
Given `ADMIN_USERNAME` and `ADMIN_PASSWORD` are set in environment
And the user provides credentials matching these values
When the user submits a login request to `POST /api/auth/login`
Then the system validates against environment variables first
And returns a 200 response with `access_token` and `refresh_token`
And no refresh token is stored in the database (env admin bypass)

#### Scenario: User refreshes access token
Given the user has a valid refresh token
When the user submits a refresh request to `POST /api/auth/refresh`
Then the system validates the refresh token
And returns a 200 response with new `access_token`

#### Scenario: User logs out
Given the user has a valid access token
When the user submits a logout request to `POST /api/auth/logout`
Then the system invalidates the refresh token (if stored in DB)
And returns a 200 response

### Admin User Management

#### Scenario: Admin lists all admin users
Given the requester has a valid admin access token
When the requester submits a GET request to `/api/admin/users`
Then the system returns a list of all admin users from database
And excludes password hashes from the response
And does not include environment variable admin in the list

#### Scenario: Admin creates new admin user
Given the requester has a valid admin access token
And the request body contains `username` and `password`
When the requester submits a POST request to `/api/admin/users`
Then the system creates a new admin user in the database
And returns a 201 response with the created user
And the password is stored as a bcrypt hash

#### Scenario: Admin deletes an admin user
Given the requester has a valid admin access token
When the requester submits a DELETE request to `/api/admin/users/:id`
Then the system deletes the specified user from database
And returns a 200 response
And prevents deletion of the last remaining admin in database

#### Scenario: Cannot delete environment variable admin
Given the requester has a valid admin access token
When the requester tries to delete the environment variable admin
Then the system returns an error (env admin cannot be deleted via API)

### API Protection

#### Scenario: Protected endpoint rejects unauthenticated request
Given a POST request to `/api/works` without Authorization header
When the request is processed
Then the system response with error returns a 401 code `UNAUTHORIZED`

#### Scenario: Protected endpoint rejects invalid token
Given a POST request to `/api/works` with invalid Authorization header
When the request is processed
Then the system returns a 401 response with error code `INVALID_TOKEN`

#### Scenario: Protected endpoint accepts valid token
Given a POST request to `/api/works` with valid Authorization header
When the request is processed
Then the request is passed to the route handler

#### Scenario: Protected endpoint accepts env-admin token
Given a POST request to `/api/works` with a token issued to env admin
When the request is processed
Then the request is passed to the route handler
And the env admin has full permissions like DB admin

### Token Validation

#### Scenario: Access token is expired
Given a request with an expired access token
When the token is validated
Then the system returns a 401 response with error code `TOKEN_EXPIRED`

#### Scenario: Refresh token is revoked
Given a request with a revoked refresh token
When the token is validated
Then the system returns a 401 response with error code `TOKEN_REVOKED`

#### Scenario: Env-admin token is expired
Given a request with an expired token issued to env admin
When the token is validated
Then the system returns a 401 response with error code `TOKEN_EXPIRED`
But the user can re-login using env credentials immediately

### Environment Configuration

#### Scenario: Environment variables are not set
Given `ADMIN_USERNAME` is not set in environment
When a login request is made with that username
Then the system skips environment variable check
And falls back to database lookup

#### Scenario: Admin password is bcrypt hash
Given `ADMIN_PASSWORD` is a bcrypt hash (starts with `$2`)
When validating login credentials
Then the system compares input against the hash using bcrypt
And issues tokens if hash matches

#### Scenario: Admin password is plain text
Given `ADMIN_PASSWORD` is a plain text password
When validating login credentials
Then the system compares input directly against plain text
And issues tokens if password matches

## MODIFIED Requirements

### works.ts - POST/PUT/DELETE endpoints
#### Scenario: Write operations require authentication
Given a request to POST/PUT/DELETE `/api/works/*`
When the request does not include a valid Authorization header
Then return 401 UNAUTHORIZED
When the request includes a valid Authorization header
Then proceed with the existing business logic

### skills.ts - POST/PUT/DELETE endpoints
#### Scenario: Write operations require authentication
Given a request to POST/PUT/DELETE `/api/skills/*`
When the request does not include a valid Authorization header
Then return 401 UNAUTHORIZED
When the request includes a valid Authorization header
Then proceed with the existing business logic

### social.ts - POST/PUT/DELETE endpoints
#### Scenario: Write operations require authentication
Given a request to POST/PUT/DELETE `/api/social-media/*`
When the request does not include a valid Authorization header
Then return 401 UNAUTHORIZED
When the request includes a valid Authorization header
Then proceed with the existing business logic

### self.ts - POST/PUT endpoints
#### Scenario: Write operations require authentication
Given a request to POST/PUT `/api/self-content/*`
When the request does not include a valid Authorization header
Then return 401 UNAUTHORIZED
When the request includes a valid Authorization header
Then proceed with the existing business logic
