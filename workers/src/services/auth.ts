import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import bcrypt from 'bcryptjs';
import { drizzle } from 'drizzle-orm/d1';
import { users, refreshTokens, type User } from '../drizzle/schema/index.js';
import { eq, and, gt, isNull } from 'drizzle-orm';
import type { D1Database } from '@cloudflare/workers-types';
import { randomBytes } from 'crypto';

// Configuration
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
);
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

export interface TokenPayload extends JWTPayload {
  sub: number;
  username: string;
  role: string;
  type: 'access' | 'refresh';
}

// Helper to get DB from context
function getDb(env: { DB: D1Database }) {
  return drizzle(env.DB);
}

// Password utilities
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// JWT utilities
export async function generateAccessToken(user: Pick<User, 'id' | 'username' | 'role'>): Promise<string> {
  return new SignJWT({
    sub: user.id,
    username: user.username,
    role: user.role,
    type: 'access',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

export async function generateRefreshToken(userId: number): Promise<string> {
  return new SignJWT({
    sub: userId,
    type: 'refresh',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as TokenPayload;
  } catch {
    return null;
  }
}

// Environment variable admin validation
export function validateEnvAdmin(env: { ADMIN_USERNAME?: string; ADMIN_PASSWORD?: string }, username: string, password: string): boolean {
  const envUsername = env.ADMIN_USERNAME;
  const envPassword = env.ADMIN_PASSWORD;

  if (!envUsername || !envPassword) {
    return false;
  }

  if (username !== envUsername) {
    return false;
  }

  // Check if password is bcrypt hash or plain text
  if (envPassword.startsWith('$2')) {
    return bcrypt.compareSync(password, envPassword);
  }

  return password === envPassword;
}

// Database operations with DB parameter
export async function findUserByUsername(env: { DB: D1Database }, username: string): Promise<User | null> {
  const db = getDb(env);
  const result = await db.select().from(users).where(eq(users.username, username)).get();
  return result || null;
}

export async function getUserById(env: { DB: D1Database }, id: number): Promise<User | null> {
  const db = getDb(env);
  const result = await db.select().from(users).where(eq(users.id, id)).get();
  return result || null;
}

export async function createUser(env: { DB: D1Database }, username: string, password: string, role: string = 'admin'): Promise<User> {
  const db = getDb(env);
  const passwordHash = await hashPassword(password);
  const result = await db.insert(users).values({
    username,
    passwordHash,
    role,
  }).returning().get();
  return result;
}

export async function listUsers(env: { DB: D1Database }): Promise<Pick<User, 'id' | 'username' | 'role' | 'createdAt' | 'lastLoginAt'>[]> {
  const db = getDb(env);
  return db.select({
    id: users.id,
    username: users.username,
    role: users.role,
    createdAt: users.createdAt,
    lastLoginAt: users.lastLoginAt,
  })
    .from(users)
    .orderBy(users.createdAt)
    .all();
}

export async function deleteUser(env: { DB: D1Database }, id: number): Promise<boolean> {
  const db = getDb(env);
  const result = await db.delete(users).where(eq(users.id, id)).run();
  return result.success;
}

export async function updateLastLogin(env: { DB: D1Database }, id: number): Promise<void> {
  const db = getDb(env);
  await db.update(users)
    .set({ lastLoginAt: new Date() })
    .where(eq(users.id, id))
    .run();
}

// Refresh token operations
export async function storeRefreshToken(
  env: { DB: D1Database },
  userId: number,
  tokenHash: string,
  expiresAt: Date
): Promise<void> {
  const db = getDb(env);
  await db.insert(refreshTokens).values({
    userId,
    tokenHash,
    expiresAt,
  }).run();
}

export async function revokeRefreshToken(env: { DB: D1Database }, tokenHash: string): Promise<void> {
  const db = getDb(env);
  await db.update(refreshTokens)
    .set({ revokedAt: new Date() })
    .where(eq(refreshTokens.tokenHash, tokenHash))
    .run();
}

export async function isRefreshTokenValid(env: { DB: D1Database }, tokenHash: string): Promise<boolean> {
  const db = getDb(env);
  const token = await db.select()
    .from(refreshTokens)
    .where(and(
      eq(refreshTokens.tokenHash, tokenHash),
      isNull(refreshTokens.revokedAt),
      gt(refreshTokens.expiresAt, new Date())
    ))
    .get();
  return !!token;
}

export async function revokeAllUserTokens(env: { DB: D1Database }, userId: number): Promise<void> {
  const db = getDb(env);
  await db.update(refreshTokens)
    .set({ revokedAt: new Date() })
    .where(eq(refreshTokens.userId, userId))
    .run();
}

// Simple token hashing for storage (not for password)
export function hashToken(token: string): string {
  return randomBytes(32).toString('hex');
}
