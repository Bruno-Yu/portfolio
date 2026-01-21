# Tasks: Admin Authentication System

## Phase 1: Database & Backend Infrastructure

### 1.1 Create Database Migration
- [ ] Create `workers/migrations/0002_users.sql` with `users` and `refresh_tokens` tables
- [ ] Create TypeScript schema in `workers/src/drizzle/schema/users.ts`
- [ ] Apply migration to local D1: `pnpm run db:migrate:local`

**Validation**: Verify tables exist with `wrangler d1 execute --local`

### 1.2 Install Dependencies
- [ ] Add `bcryptjs` for password hashing
- [ ] Add JWT library (`jose` - lightweight, Cloudflare Workers compatible)
- [ ] Add type definitions

**Validation**: `pnpm install` succeeds

### 1.3 Create Auth Services
- [ ] Create `workers/src/services/auth.ts` with:
  - `hashPassword(password)` function
  - `verifyPassword(password, hash)` function
  - `generateAccessToken(user)` function
  - `generateRefreshToken(user)` function
  - `verifyToken(token)` function
  - `validateEnvAdmin(username, password)` function (checks env vars)
  - `findUserByUsername(username)` function
  - `createUser(username, password, role)` function
  - `listUsers()` function
  - `deleteUser(id)` function
  - `updateLastLogin(id)` function
  - `storeRefreshToken(userId, tokenHash, expiresAt)` function
  - `revokeRefreshToken(tokenHash)` function

**Validation**: Run `pnpm build` and verify no type errors

### 1.4 Create Auth Middleware
- [ ] Create `workers/src/middleware/auth.ts` with:
  - `authMiddleware()` function
  - Extract and validate Authorization header
  - Verify JWT token
  - Attach user info to context
- [ ] Export `requireAdmin()` helper

**Validation**: Test middleware rejects requests without token

### 1.5 Create Auth Routes
- [ ] Create `workers/src/routes/auth.ts` with:
  - `POST /auth/login` - Login endpoint (checks env vars first, then DB)
  - `POST /auth/refresh` - Token refresh endpoint
  - `POST /auth/logout` - Logout endpoint
- [ ] Register routes in `workers/src/index.ts`

**Validation**: Test login returns tokens, refresh works, logout invalidates

### 1.6 Create Admin Routes
- [ ] Create `workers/src/routes/admin.ts` with:
  - `GET /admin/users` - List users
  - `POST /admin/users` - Create user
  - `DELETE /admin/users/:id` - Delete user
- [ ] Protect routes with `requireAdmin` middleware
- [ ] Register routes in `workers/src/index.ts`

**Validation**: Test non-admin cannot access, admin can CRUD users

### 1.7 Protect Existing Routes
- [ ] Update `workers/src/routes/works.ts` - add auth middleware to POST/PUT/DELETE
- [ ] Update `workers/src/routes/skills.ts` - add auth middleware to POST/PUT/DELETE
- [ ] Update `workers/src/routes/social.ts` - add auth middleware to POST/PUT/DELETE
- [ ] Update `workers/src/routes/self.ts` - add auth middleware to POST/PUT

**Validation**: Verify unauthenticated write requests return 401

## Phase 2: Environment Configuration

### 2.1 Set Environment Variables
- [ ] Add to `.env.example`:
  ```env
  # Environment Variable Super Admin (for emergency access)
  # Set these for a "break-glass" admin account that bypasses database
  ADMIN_USERNAME=your_admin_username
  # Use bcrypt hash for production (generate with: npx bcrypt hash your_password 10)
  # Or use plain text for development convenience
  ADMIN_PASSWORD=your_password_or_bcrypt_hash
  ```
- [ ] Update `.env.local` with your credentials

**Validation**: Environment variables are loaded correctly

### 2.2 Wrangler Secrets (Production)
- [ ] Set secrets for production deployment:
  ```bash
  npx wrangler secret put ADMIN_USERNAME
  npx wrangler secret put ADMIN_PASSWORD
  ```
- [ ] Or configure in Cloudflare Dashboard → Workers → Settings → Variables

**Validation**: Production environment has env vars set

## Phase 3: Frontend Implementation

### 3.1 Create Auth API Client
- [ ] Create `frontend/src/api/auth.ts` with:
  - `login(username, password)` function
  - `logout()` function
  - `refresh()` function
  - `getUsers()` function (for admin panel)

**Validation**: API calls work with backend

### 3.2 Create Auth Store/Context
- [ ] Create `frontend/src/stores/auth.ts` or `frontend/src/contexts/AuthContext.tsx` with:
  - `user` state
  - `isAuthenticated` computed
  - `login()` action
  - `logout()` action
  - `token` getter
- [ ] Persist auth state to localStorage

**Validation**: Login state persists on page refresh

### 3.3 Update Login Page
- [ ] Find/create Login page component
- [ ] Add username/password form
- [ ] Connect form to auth store
- [ ] Handle errors gracefully
- [ ] Redirect to intended page after login

**Validation**: Can log in, see user info, log out

### 3.4 Protect Admin Routes
- [ ] Create `RequireAuth` wrapper component
- [ ] Wrap `/admin` routes with `RequireAuth`
- [ ] Redirect unauthenticated users to login

**Validation**: Cannot access admin without login

### 3.5 Create Admin User Management UI
- [ ] Create `frontend/src/views/BackStage/Users/index.tsx`
- [ ] List all admin users
- [ ] Add form to create new admin user
- [ ] Add delete button for users (with confirmation)

**Validation**: Can list, add, and delete admin users

## Phase 4: Initial Admin Setup

### 4.1 Create Seed Script for Initial Admin
- [ ] Add admin user creation to seed migration
- [ ] Or create a setup script to create first DB admin

**Validation**: Can create initial admin user after fresh database

## Phase 5: Testing & Polish

### 5.1 Integration Testing
- [ ] Test full login flow with DB credentials
- [ ] Test login with env admin credentials
- [ ] Test token refresh on access token expiry
- [ ] Test logout invalidates token
- [ ] Test protected endpoints without auth
- [ ] Test admin user management

### 5.2 Security Review
- [ ] Verify password hashing is applied
- [ ] Verify tokens are properly validated
- [ ] Verify refresh tokens are stored securely
- [ ] Verify env admin bypass works correctly

### 5.3 Error Handling
- [ ] Verify error messages are user-friendly
- [ ] Verify sensitive info is not leaked

---

## Dependencies & Parallelization

**Can do in parallel:**
- 1.1 (Migration) → 1.3 (Services) → 1.4 (Middleware)
- 1.2 (Dependencies) can start anytime
- 2.1 (Env vars) can be done anytime
- 3.1 (Auth API) → 3.2 (Auth Store) → 3.3 (Login Page)

**Sequential:**
- 1.3 must complete before 1.5
- 1.5 must complete before 1.7
- 2.1 must complete before 1.5 (env admin logic in auth service)
- 3.2 must complete before 3.3

---

## Environment Variable Admin Usage

### Emergency Login Flow
```
1. Token expires
2. User cannot refresh (e.g., refresh token also expired)
3. User goes to /login
4. Enters env admin credentials (ADMIN_USERNAME / ADMIN_PASSWORD)
5. System validates against env vars (not DB)
6. New JWT issued - access restored
```

### Setting Password
```bash
# Development (plain text)
ADMIN_PASSWORD=mypassword

# Production (bcrypt hash - recommended)
# Generate hash:
npx bcrypt hash your_password 10
# Result: $2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

ADMIN_PASSWORD=$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
