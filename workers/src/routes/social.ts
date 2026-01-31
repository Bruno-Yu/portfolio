import { Hono } from 'hono';
import { getDb } from '../drizzle/client.ts';
import { socialMedia } from '../drizzle/schema/index.ts';
import { eq, asc } from 'drizzle-orm';
import { z } from 'zod';
import type { D1Database } from '@cloudflare/workers-types';
import { requireAdmin, authMiddleware } from '../middleware/auth.js';
import type { TokenPayload } from '../services/auth.js';

type Bindings = {
  DB: D1Database;
};

const router = new Hono<{
  Bindings: Bindings;
  Variables: {
    user?: TokenPayload;
  };
}>();

router.use('/*', authMiddleware);

const createSocialSchema = z.object({
  name: z.string().min(1).max(50),
  link: z.string().url(),
  order: z.number().int().optional().default(0),
});

const updateSocialSchema = createSocialSchema.partial();

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

router.post('/', async (c) => {
  const authCheck = requireAdmin(c);
  if (!authCheck.valid) {
    return c.json({
      success: false,
      error: authCheck.error,
    }, authCheck.error?.code === 'FORBIDDEN' ? 403 : 401);
  }

  const db = getDb(c.env);
  const body = await c.req.json();
  const validated = createSocialSchema.parse(body);

  const social = await db.insert(socialMedia).values({
    name: validated.name,
    link: validated.link,
    order: validated.order,
  }).returning().get();

  return c.json({ success: true, data: social }, 201);
});

router.put('/:id', async (c) => {
  const authCheck = requireAdmin(c);
  if (!authCheck.valid) {
    return c.json({
      success: false,
      error: authCheck.error,
    }, authCheck.error?.code === 'FORBIDDEN' ? 403 : 401);
  }

  const db = getDb(c.env);
  const id = parseInt(c.req.param('id'));

  if (isNaN(id)) {
    return c.json({ success: false, error: { code: 'INVALID_ID', message: 'Invalid social media ID' } }, 400);
  }

  const body = await c.req.json();
  const validated = updateSocialSchema.parse(body);

  const existing = await db.select().from(socialMedia).where(eq(socialMedia.id, id)).get();
  if (!existing) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Social media link not found' } }, 404);
  }

  const social = await db.update(socialMedia)
    .set({
      ...(validated.name && { name: validated.name }),
      ...(validated.link !== undefined && { link: validated.link }),
      ...(validated.order !== undefined && { order: validated.order }),
    })
    .where(eq(socialMedia.id, id))
    .returning()
    .get();

  return c.json({ success: true, data: social });
});

router.delete('/:id', async (c) => {
  const authCheck = requireAdmin(c);
  if (!authCheck.valid) {
    return c.json({
      success: false,
      error: authCheck.error,
    }, authCheck.error?.code === 'FORBIDDEN' ? 403 : 401);
  }

  const db = getDb(c.env);
  const id = parseInt(c.req.param('id'));

  if (isNaN(id)) {
    return c.json({ success: false, error: { code: 'INVALID_ID', message: 'Invalid social media ID' } }, 400);
  }

  const existing = await db.select().from(socialMedia).where(eq(socialMedia.id, id)).get();
  if (!existing) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Social media link not found' } }, 404);
  }

  await db.delete(socialMedia).where(eq(socialMedia.id, id)).run();

  return c.json({ success: true, message: 'Social media link deleted successfully' });
});

export const socialRoutes = router;
