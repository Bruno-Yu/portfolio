import { Hono } from 'hono';
import { getDb } from '../drizzle/client.ts';
import { selfContent } from '../drizzle/schema/index.ts';
import { eq } from 'drizzle-orm';
import type { D1Database } from '@cloudflare/workers-types';

type Bindings = {
  DB: D1Database;
};

const router = new Hono<{ Bindings: Bindings }>();

router.get('/', async (c) => {
  const db = getDb(c.env);
  const content = await db.select().from(selfContent).orderBy(selfContent.id).limit(1).get();

  if (!content) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Self content not found' } }, 404);
  }

  return c.json({
    success: true,
    data: { ...content, hashTags: content.hashTags || '[]' },
  });
});

export const selfRoutes = router;
