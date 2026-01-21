# Design: Admin Authentication System

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐  │
│  │ Login Page  │───▶│ Auth Store  │───▶│ Protected Routes    │  │
│  └─────────────┘    └─────────────┘    └─────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │ HTTP + JWT
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Cloudflare Workers                          │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    API Routes                           │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌────────────────┐  │    │
│  │  │ /api/*      │  │ /api/admin/*│  │ Auth Middleware│  │    │
│  │  │ (GET open)  │  │ (all auth)  │  │                │  │    │
│  │  └─────────────┘  └─────────────┘  └────────────────┘  │    │
│  └─────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    Services                             │    │
│  │  ┌───────────┐  ┌───────────┐  ┌────────────────────┐  │    │
│  │  │ Auth      │  │ User      │  │ JWT                │  │    │
│  │  │ Service   │  │ Service   │  │ Service            │  │    │
│  │  └───────────┘  └───────────┘  └────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    D1 Database                          │    │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────────────────────┐ │    │
│  │  │ users   │  │ works   │  │ skills, social_media... │ │    │
│  │  └─────────┘  └─────────┘  └─────────────────────────┘ │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## Database Schema

### users table
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| username | TEXT | Unique username |
| password_hash | TEXT | Bcrypt hashed password |
| role | TEXT | 'admin' or 'user' |
| created_at | TIMESTAMP | Creation time |
| last_login_at | TIMESTAMP | Last login time |

### refresh_tokens table
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| user_id | INTEGER | Foreign key to users |
| token_hash | TEXT | Hashed refresh token |
| expires_at | TIMESTAMP | Expiration time |
| created_at | TIMESTAMP | Creation time |
| revoked_at | TIMESTAMP | Revocation time |

## JWT Token Structure

### Access Token (15 min expiry)
```json
{
  "sub": user_id,
  "role": "admin",
  "type": "access",
  "exp": timestamp,
  "iat": timestamp
}
```

### Refresh Token (7 day expiry, stored in DB)
```json
{
  "sub": user_id,
  "type": "refresh",
  "exp": timestamp,
  "iat": timestamp
}
```

## Environment Variable Super Admin

### Configuration
| Variable | Description | Example |
|----------|-------------|---------|
| `ADMIN_USERNAME` | Super admin username | `admin` |
| `ADMIN_PASSWORD` | Super admin password (hashed or plain) | `securepassword123` |

### How It Works
1. **At Login**: System first checks if credentials match env vars
2. **If Match**: Issues JWT token without storing refresh token in DB
3. **If No Match**: Falls back to database lookup
4. **Privilege Level**: Env-based admin has same permissions as DB admin
5. **Token Expiry**: Still applies (15 min access + 7 day refresh)

### Password Verification Logic
```
┌────────────────────────────────────────────────────────────┐
│                    Login Request                           │
│  username: "admin", password: "xxx"                        │
└────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────┐
│  Check ADMIN_USERNAME environment variable                 │
│  if (username === ADMIN_USERNAME)                          │
└────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              │                               │
          Match?                          No Match?
              │                               │
              ▼                               ▼
┌────────────────────────┐    ┌───────────────────────────────┐
│ Verify ADMIN_PASSWORD │    │ Look up user in database      │
│ (compare bcrypt hash   │    │ Verify password against       │
│  or plain text)        │    │ stored hash                  │
└────────────────────────┘    └───────────────────────────────┘
              │                               │
              │                               │
          Match?                          Match?
              │                               │
              ▼                               ▼
┌────────────────────────┐    ┌───────────────────────────────┐
│ Issue JWT token        │    │ Issue JWT token +             │
│ (no refresh token      │    │ Store refresh token in DB     │
│ stored in DB)          │    │                               │
└────────────────────────┘    └───────────────────────────────┘
```

## API Endpoints

### Public (no auth required)
- `POST /api/auth/login` - Login with username/password
- `POST /api/auth/refresh` - Refresh access token

### Protected (auth required, admin role)
- `POST /api/auth/logout` - Logout and invalidate tokens
- `GET /api/admin/users` - List all admin users
- `POST /api/admin/users` - Create new admin user
- `DELETE /api/admin/users/:id` - Delete admin user

### Middleware Protection
All POST/PUT/DELETE endpoints on existing routes require Authorization header:
```
Authorization: Bearer <access_token>
```

## Security Considerations

1. **Password Hashing**: Use bcrypt with cost factor 10
2. **Token Storage**: Access token in memory, refresh token in HTTP-only cookie
3. **Token Invalidation**: Store revoked tokens in DB (token blacklist)
4. **HTTPS Only**: Enforce in production
5. **Environment Variables**: Never expose to client
6. **Super Admin**: Password can be bcrypt hash (recommended) or plain text

## Trade-offs

| Decision | Chosen | Rationale |
|----------|--------|-----------|
| JWT vs Session | JWT | Serverless-friendly, scales horizontally |
| Access token expiry | 15 min | Balance security and UX |
| Refresh token expiry | 7 days | Reasonable session length |
| Password hashing | bcrypt | Industry standard, GPU-resistant |
| Env admin password | bcrypt hash or plain | Flexibility for setup |

## Open Questions

- [ ] Should we implement 2FA for admin accounts?
- [ ] Do we need email verification for new admin creation?
- [ ] Should we log all admin actions for audit?
- [ ] Should env-based admin have a separate role level above "admin"?
