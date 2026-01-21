# Admin Authentication System

## Summary
Implement JWT-based authentication system with admin user management to protect后台 operations. Includes environment variable-based "super admin" credentials for emergency access.

## Problem Statement
Currently all API endpoints are publicly accessible. We need:
- Authentication for admin operations (POST/PUT/DELETE)
- User management for multiple admin accounts
- Secure login flow on frontend
- Emergency access via environment variables (bypasses database, never expires)

## Goals
- [ ] Admin login/logout endpoints with JWT tokens
- [ ] User management CRUD (create/list/delete admins)
- [ ] Auth middleware to protect write operations
- [ ] Frontend login page integration
- [ ] Token refresh mechanism
- [ ] Environment variable super admin for emergency access

## Non-Goals
- Role-based access control (RBAC) beyond admin/user
- Social login integration
- Password reset flow

## Dependencies
- bcrypt for password hashing
- jose for JWT (Cloudflare Workers compatible)

## Risks
- JWT secret must be stored securely
- Passwords must be hashed before storage
- Environment variables must not be exposed to client

## Timeline
Estimated: 2-3 days

