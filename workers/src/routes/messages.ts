import { Hono } from 'hono';
import { getDb } from '../drizzle/client.ts';
import { messages } from '../drizzle/schema/messages.ts';
import { eq, desc } from 'drizzle-orm';
import { authMiddleware, requireAdmin } from '../middleware/auth.js';
import type { D1Database } from '@cloudflare/workers-types';
import type { TokenPayload } from '../services/auth.js';

type Bindings = { DB: D1Database };

const router = new Hono<{
  Bindings: Bindings;
  Variables: { user?: TokenPayload };
}>();

router.use('/*', authMiddleware);

// GET / — admin only, list messages
router.get('/', async (c) => {
  const authCheck = requireAdmin(c);
  if (!authCheck.valid) {
    return c.json(
      { success: false, error: authCheck.error },
      authCheck.error?.code === 'FORBIDDEN' ? 403 : 401,
    );
  }

  // Support ?count=true for just returning the count
  if (c.req.query('count') === 'true') {
    const db = getDb(c.env);
    const rows = await db.select({ id: messages.id }).from(messages).all();
    return c.json({ success: true, data: { count: rows.length } });
  }

  const db = getDb(c.env);
  const rows = await db
    .select()
    .from(messages)
    .orderBy(desc(messages.createdAt))
    .all();

  return c.json({ success: true, data: rows });
});

// DELETE /:id — admin only
router.delete('/:id', async (c) => {
  const authCheck = requireAdmin(c);
  if (!authCheck.valid) {
    return c.json(
      { success: false, error: authCheck.error },
      authCheck.error?.code === 'FORBIDDEN' ? 403 : 401,
    );
  }

  const id = parseInt(c.req.param('id'));
  if (isNaN(id)) return c.json({ success: false, error: { code: 'BAD_REQUEST' } }, 400);

  const db = getDb(c.env);
  await db.delete(messages).where(eq(messages.id, id));
  return c.json({ success: true });
});

// PATCH /:id/read — admin only
router.patch('/:id/read', async (c) => {
  const authCheck = requireAdmin(c);
  if (!authCheck.valid) {
    return c.json(
      { success: false, error: authCheck.error },
      authCheck.error?.code === 'FORBIDDEN' ? 403 : 401,
    );
  }

  const id = parseInt(c.req.param('id'));
  if (isNaN(id)) return c.json({ success: false, error: { code: 'BAD_REQUEST' } }, 400);

  const db = getDb(c.env);
  const [row] = await db
    .update(messages)
    .set({ isRead: 1 })
    .where(eq(messages.id, id))
    .returning();

  if (!row) return c.json({ success: false, error: { code: 'NOT_FOUND' } }, 404);
  return c.json({ success: true, data: row });
});

export const messagesRoutes = router;
