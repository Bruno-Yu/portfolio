import { Hono } from 'hono';
import { z } from 'zod';
import { getDb } from '../drizzle/client.ts';
import { contentBlocks } from '../drizzle/schema/contentBlocks.ts';
import { authMiddleware, requireAdmin } from '../middleware/auth.js';
import type { D1Database } from '@cloudflare/workers-types';
import type { TokenPayload } from '../services/auth.js';

type Bindings = { DB: D1Database };

const router = new Hono<{
  Bindings: Bindings;
  Variables: { user?: TokenPayload };
}>();

router.use('/*', authMiddleware);

// GET / — public, returns flat map { "key.lang": value }
router.get('/', async (c) => {
  const db = getDb(c.env);
  const rows = await db.select().from(contentBlocks).all();

  const map: Record<string, string> = {};
  for (const row of rows) {
    map[`${row.key}.${row.lang}`] = row.value;
  }

  return c.json({ success: true, data: map });
});

const blockSchema = z.object({
  key: z.string().min(1),
  lang: z.enum(['en', 'zh']),
  value: z.string(),
});

const bulkSchema = z.object({
  blocks: z.array(blockSchema).min(1),
});

// POST / — admin only, bulk upsert
router.post('/', async (c) => {
  const authCheck = requireAdmin(c);
  if (!authCheck.valid) {
    return c.json(
      { success: false, error: authCheck.error },
      authCheck.error?.code === 'FORBIDDEN' ? 403 : 401,
    );
  }

  const body = await c.req.json();
  const { blocks } = bulkSchema.parse(body);

  const db = getDb(c.env);
  const now = Math.floor(Date.now() / 1000);

  // Upsert each block using D1 batch
  // bulkSchema validates blocks.length >= 1, so first is always defined
  const stmts = blocks.map((b) =>
    db
      .insert(contentBlocks)
      .values({ key: b.key, lang: b.lang, value: b.value, updatedAt: new Date(now * 1000) })
      .onConflictDoUpdate({
        target: [contentBlocks.key, contentBlocks.lang],
        set: { value: b.value, updatedAt: new Date(now * 1000) },
      })
  );
  const [first, ...rest] = stmts;
  await db.batch([first!, ...rest]);

  return c.json({ success: true, count: blocks.length });
});

export const contentBlocksRoutes = router;
