import { Hono } from 'hono';
import { getDb } from '../drizzle/client.ts';
import { skills } from '../drizzle/schema/index.ts';
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

const createSkillSchema = z.object({
  title: z.string().min(1).max(100),
  icon: z.string().min(1),
  details: z.array(z.string()).default([]),
  order: z.number().int().optional().default(0),
});

const updateSkillSchema = createSkillSchema.partial();

router.get('/', async (c) => {
  const db = getDb(c.env);
  const data = await db.select().from(skills).orderBy(asc(skills.order), asc(skills.id)).all();

  return c.json({
    success: true,
    data: data.map((skill) => ({
      ...skill,
      details: skill.details || '[]',
    })),
  });
});

router.get('/:id', async (c) => {
  const db = getDb(c.env);
  const id = parseInt(c.req.param('id'));

  if (isNaN(id)) {
    return c.json({ success: false, error: { code: 'INVALID_ID', message: 'Invalid skill ID' } }, 400);
  }

  const skill = await db.select().from(skills).where(eq(skills.id, id)).get();

  if (!skill) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Skill not found' } }, 404);
  }

  return c.json({
    success: true,
    data: { ...skill, details: skill.details || '[]' },
  });
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
  const validated = createSkillSchema.parse(body);

  const skill = await db.insert(skills).values({
    title: validated.title,
    icon: validated.icon,
    details: JSON.stringify(validated.details),
    order: validated.order,
  }).returning().get();

  return c.json({ success: true, data: skill }, 201);
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
    return c.json({ success: false, error: { code: 'INVALID_ID', message: 'Invalid skill ID' } }, 400);
  }

  const body = await c.req.json();
  const validated = updateSkillSchema.parse(body);

  const existing = await db.select().from(skills).where(eq(skills.id, id)).get();
  if (!existing) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Skill not found' } }, 404);
  }

  const skill = await db.update(skills)
    .set({
      ...(validated.title && { title: validated.title }),
      ...(validated.icon !== undefined && { icon: validated.icon }),
      ...(validated.details && { details: JSON.stringify(validated.details) }),
      ...(validated.order !== undefined && { order: validated.order }),
    })
    .where(eq(skills.id, id))
    .returning()
    .get();

  return c.json({ success: true, data: skill });
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
    return c.json({ success: false, error: { code: 'INVALID_ID', message: 'Invalid skill ID' } }, 400);
  }

  const existing = await db.select().from(skills).where(eq(skills.id, id)).get();
  if (!existing) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Skill not found' } }, 404);
  }

  await db.delete(skills).where(eq(skills.id, id)).run();

  return c.json({ success: true, message: 'Skill deleted successfully' });
});

export const skillsRoutes = router;
