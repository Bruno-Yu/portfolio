import { Hono } from 'hono';
import { z } from 'zod';
import {
  findUserByUsername,
  verifyPassword,
  generateAccessToken,
  generateRefreshToken,
  storeRefreshToken,
  revokeRefreshToken,
  validateEnvAdmin,
  updateLastLogin,
  hashToken,
} from '../services/auth.js';
import { authMiddleware } from '../middleware/auth.js';
import type { D1Database } from '@cloudflare/workers-types';

const router = new Hono<{ Bindings: { DB: D1Database } }>();

// Login schema
const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

// Refresh schema
const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

// Login endpoint
router.post('/login', async (c) => {
  const body = await c.req.json();
  const { username, password } = loginSchema.parse(body);

  // First, check environment variable admin
  if (validateEnvAdmin(c.env, username, password)) {
    const accessToken = await generateAccessToken({
      id: 0,
      username,
      role: 'admin',
    });

    const refreshToken = await generateRefreshToken(0);

    c.header('Set-Cookie', `refresh_token=${refreshToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800`);

    return c.json({
      success: true,
      data: {
        user: {
          id: 0,
          username,
          role: 'admin',
        },
        accessToken,
        refreshToken,
        isEnvAdmin: true,
      },
    });
  }

  // Check database for user
  const user = await findUserByUsername(c.env, username);

  if (!user) {
    return c.json({
      success: false,
      error: {
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid username or password',
      },
    }, 401);
  }

  const isValid = await verifyPassword(password, user.passwordHash);

  if (!isValid) {
    return c.json({
      success: false,
      error: {
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid username or password',
      },
    }, 401);
  }

  // Generate tokens
  const accessToken = await generateAccessToken({
    id: user.id,
    username: user.username,
    role: user.role,
  });

  const refreshToken = await generateRefreshToken(user.id);

  // Store refresh token in database
  const tokenHash = hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await storeRefreshToken(c.env, user.id, tokenHash, expiresAt);

  // Update last login
  await updateLastLogin(c.env, user.id);

  c.header('Set-Cookie', `refresh_token=${refreshToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800`);

  return c.json({
    success: true,
    data: {
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      accessToken,
      refreshToken,
    },
  });
});

// Refresh token endpoint
router.post('/refresh', async (c) => {
  const body = await c.req.json();
  const { refreshToken } = refreshSchema.parse(body);

  const payload = await verifyToken(refreshToken);

  if (!payload || payload.type !== 'refresh') {
    return c.json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired refresh token',
      },
    }, 401);
  }

  // Check if refresh token is valid in database (skip for env admin)
  if (payload.sub !== 0) {
    const tokenHash = hashToken(refreshToken);
    const isValid = await isRefreshTokenValid(c.env, tokenHash);

    if (!isValid) {
      return c.json({
        success: false,
        error: {
          code: 'TOKEN_REVOKED',
          message: 'Refresh token has been revoked',
        },
      }, 401);
    }
  }

  // Generate new access token
  const accessToken = await generateAccessToken({
    id: payload.sub,
    username: payload.username,
    role: payload.role,
  });

  return c.json({
    success: true,
    data: {
      accessToken,
    },
  });
});

// Logout endpoint
router.post('/logout', authMiddleware, async (c) => {
  const cookie = c.req.header('Cookie');
  const refreshToken = cookie?.match(/refresh_token=([^;]+)/)?.[1];

  if (refreshToken) {
    const tokenHash = hashToken(refreshToken);
    await revokeRefreshToken(c.env, tokenHash);
  }

  c.header('Set-Cookie', 'refresh_token=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0');

  return c.json({
    success: true,
    message: 'Logged out successfully',
  });
});

// Get current user info
router.get('/me', authMiddleware, async (c) => {
  const user = c.get('user');

  if (!user) {
    return c.json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Not authenticated',
      },
    }, 401);
  }

  return c.json({
    success: true,
    data: {
      user: {
        id: user.sub,
        username: user.username,
        role: user.role,
      },
    },
  });
});

// Import the missing function
async function isRefreshTokenValid(env: { DB: D1Database }, tokenHash: string): Promise<boolean> {
  const { drizzle } = await import('drizzle-orm/d1');
  const { refreshTokens } = await import('../drizzle/schema/index.js');
  const { eq, and, gt, isNull } = await import('drizzle-orm');
  const db = drizzle(env.DB);
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

export const authRoutes = router;
