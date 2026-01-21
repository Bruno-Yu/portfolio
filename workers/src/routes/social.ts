import { Hono } from 'hono';
import { getDb } from '../drizzle/client.ts';
import { socialMedia } from '../drizzle/schema/index.ts';
import { eq, asc } from 'drizzle-orm';
import type { D1Database } from '@cloudflare/workers-types';

type Bindings = {
  DB: D1Database;
};

const router = new Hono<{ Bindings: Bindings }>();

router.get('/', async (c) => {
  const db = getDb(c.env);
  const data = await db.select().from(socialMedia).orderBy(asc(socialMedia.order), asc(socialMedia.id)).all();

  return c.json({ success: true, data });
});

router.get('/:id', async (c) => {
  const db = getDb(c.env);
  const id = parseInt(c.req.param('id'));

  if (isNaN(id)) {
    return c.json({ success: false, error: { code: 'INVALID_ID', message: 'Invalid social media ID' } }, 400);
  }

  const social = await db.select().from(socialMedia).where(eq(socialMedia.id, id)).get();

  if (!social) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Social media link not found' } }, 404);
  }

  return c.json({ success: true, data: social });
});

export const socialRoutes = router;
