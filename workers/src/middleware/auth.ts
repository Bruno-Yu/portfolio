import { verifyToken, type TokenPayload } from '../services/auth.js';
import type { Context } from 'hono';

export interface AuthContext {
  user?: TokenPayload;
}

export async function authMiddleware(c: Context, next: () => Promise<void>) {
  if (c.req.method === 'OPTIONS') {
    await next();
    return;
  }

  const authHeader = c.req.header('Authorization');

  if (!authHeader) {
    c.set('user', undefined);
    await next();
    return;
  }

  const token = authHeader.replace('Bearer ', '');

  if (!token) {
    c.set('user', undefined);
    await next();
    return;
  }

  const payload = await verifyToken(token);

  if (payload && payload.type === 'access') {
    c.set('user', payload);
  } else {
    c.set('user', undefined);
  }

  await next();
}

export function requireAdmin(c: Context): { valid: boolean; error?: { code: string; message: string } } {
  const user = c.get('user');

  if (!user) {
    return {
      valid: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      },
    };
  }

  if (user.role === 'admin' || user.sub === '0' || user.id === 0) {
    return { valid: true };
  }

  return {
    valid: false,
    error: {
      code: 'FORBIDDEN',
      message: 'Admin privileges required',
    },
  };
}
