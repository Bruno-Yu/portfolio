import { Hono } from 'hono';
import { z } from 'zod';
import { authMiddleware, requireAdmin } from '../middleware/auth.js';
import {
  listUsers,
  createUser,
  deleteUser,
  hashPassword,
} from '../services/auth.js';
import type { D1Database } from '@cloudflare/workers-types';

const router = new Hono<{ Bindings: { DB: D1Database } }>();

router.use('/*', authMiddleware);

const createUserSchema = z.object({
  username: z.string().min(1).max(50),
  password: z.string().min(6).max(100),
  role: z.enum(['admin', 'user']).default('admin'),
});

router.get('/users', async (c) => {
  const authCheck = requireAdmin(c);
  if (!authCheck.valid) {
    return c.json({
      success: false,
      error: authCheck.error,
    }, authCheck.error?.code === 'FORBIDDEN' ? 403 : 401);
  }

  const users = await listUsers(c.env);

  return c.json({
    success: true,
    data: {
      users: users.map(u => ({
        ...u,
        createdAt: u.createdAt ? u.createdAt.toISOString() : null,
        lastLoginAt: u.lastLoginAt ? u.lastLoginAt.toISOString() : null,
      })),
    },
  });
});

router.post('/users', async (c) => {
  const authCheck = requireAdmin(c);
  if (!authCheck.valid) {
    return c.json({
      success: false,
      error: authCheck.error,
    }, authCheck.error?.code === 'FORBIDDEN' ? 403 : 401);
  }

  const body = await c.req.json();
  const { username, password, role } = createUserSchema.parse(body);

  try {
    const user = await createUser(c.env, username, password, role);

    return c.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          createdAt: new Date(user.createdAt!.getTime()).toISOString(),
        },
      },
    }, 201);
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return c.json({
        success: false,
        error: {
          code: 'USERNAME_EXISTS',
          message: 'Username already exists',
        },
      }, 409);
    }
    throw error;
  }
});

router.delete('/users/:id', async (c) => {
  const authCheck = requireAdmin(c);
  if (!authCheck.valid) {
    return c.json({
      success: false,
      error: authCheck.error,
    }, authCheck.error?.code === 'FORBIDDEN' ? 403 : 401);
  }

  const id = parseInt(c.req.param('id'));

  if (isNaN(id)) {
    return c.json({
      success: false,
      error: {
        code: 'INVALID_ID',
        message: 'Invalid user ID',
      },
    }, 400);
  }

  if (id === 0) {
    return c.json({
      success: false,
      error: {
        code: 'CANNOT_DELETE',
        message: 'Cannot delete environment variable admin',
      },
    }, 400);
  }

  const deleted = await deleteUser(c.env, id);

  if (!deleted) {
    return c.json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'User not found',
      },
    }, 404);
  }

  return c.json({
    success: true,
    message: 'User deleted successfully',
  });
});

export const adminRoutes = router;
