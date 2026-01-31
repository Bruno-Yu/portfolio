import { Hono } from 'hono';
import { getDb } from '../drizzle/client.ts';
import { works } from '../drizzle/schema/index.ts';
import { eq, desc, sql } from 'drizzle-orm';
import { z } from 'zod';
import type { D1Database } from '@cloudflare/workers-types';
import { requireAdmin, authMiddleware } from '../middleware/auth.js';
import type { TokenPayload } from '../services/auth.js';

const createWorkSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  imgUrl: z.string().url().optional().nullable(),
  imgLink: z.string().url().optional().nullable(),
  content: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  gitHubUrl: z.string().url().optional().nullable(),
  gitPageUrl: z.string().url().optional().nullable(),
});

const updateWorkSchema = createWorkSchema.partial();

const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

type Bindings = {
  DB: D1Database;
};

const router = new Hono<{
  Bindings: Bindings;
  Variables: {
    user?: TokenPayload;
  };
}>();

// Apply auth middleware to all routes in this router to set c.set('user', payload)
router.use('/*', authMiddleware);

router.get('/', async (c) => {
  const db = getDb(c.env);
  const { page, limit } = paginationSchema.parse(c.req.query());
  const offset = (page - 1) * limit;

  const [data, totalResult] = await Promise.all([
    db.select()
      .from(works)
      .orderBy(desc(works.createdAt))
      .limit(limit)
      .offset(offset)
      .all(),
    db.select({ count: sql<number>`count(*)` }).from(works),
  ]);

  const total = Number(totalResult[0]?.count ?? 0);
  const totalPages = Math.ceil(total / limit);
  
  return c.json({
    success: true,
    data: data.map((work) => ({
      ...work,
      tags: parseTags(work.tags),
    })),
    meta: {
      pagination: { page, limit, total, totalPages },
    },
  });
});

// Parse JSON string to array for tags/details fields
function parseTags(tags: string | null | undefined): string[] {
  if (!tags) return [];
  try {
    const parsed = JSON.parse(tags);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

router.get('/:id', async (c) => {
  const db = getDb(c.env);
  const id = parseInt(c.req.param('id'));

  if (isNaN(id)) {
    return c.json({ success: false, error: { code: 'INVALID_ID', message: 'Invalid work ID' } }, 400);
  }

  const work = await db.select().from(works).where(eq(works.id, id)).get();

  if (!work) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Work not found' } }, 404);
  }

  return c.json({
    success: true,
    data: { ...work, tags: work.tags || '[]' },
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
  const validated = createWorkSchema.parse(body);

  const work = await db.insert(works).values({
    title: validated.title,
    description: validated.description,
    imgUrl: validated.imgUrl ?? null,
    imgLink: validated.imgLink ?? null,
    content: validated.content ?? null,
    tags: validated.tags ? JSON.stringify(validated.tags) : null,
    gitHubUrl: validated.gitHubUrl ?? null,
    gitPageUrl: validated.gitPageUrl ?? null,
  }).returning().get();

  return c.json({ success: true, data: work }, 201);
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
    return c.json({ success: false, error: { code: 'INVALID_ID', message: 'Invalid work ID' } }, 400);
  }

  const body = await c.req.json();
  const validated = updateWorkSchema.parse(body);

  const existing = await db.select().from(works).where(eq(works.id, id)).get();
  if (!existing) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Work not found' } }, 404);
  }

  const work = await db.update(works)
    .set({
      ...(validated.title && { title: validated.title }),
      ...(validated.description && { description: validated.description }),
      ...(validated.imgUrl !== undefined && { imgUrl: validated.imgUrl }),
      ...(validated.imgLink !== undefined && { imgLink: validated.imgLink }),
      ...(validated.content !== undefined && { content: validated.content }),
      ...(validated.tags && { tags: JSON.stringify(validated.tags) }),
      ...(validated.gitHubUrl !== undefined && { gitHubUrl: validated.gitHubUrl }),
      ...(validated.gitPageUrl !== undefined && { gitPageUrl: validated.gitPageUrl }),
      updatedAt: new Date(),
    })
    .where(eq(works.id, id))
    .returning()
    .get();

  return c.json({ success: true, data: work });
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
    return c.json({ success: false, error: { code: 'INVALID_ID', message: 'Invalid work ID' } }, 400);
  }

  const existing = await db.select().from(works).where(eq(works.id, id)).get();
  if (!existing) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Work not found' } }, 404);
  }

  await db.delete(works).where(eq(works.id, id)).run();

  return c.json({ success: true, message: 'Work deleted successfully' });
});

export const worksRoutes = router;
