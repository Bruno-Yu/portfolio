import { Hono } from 'hono';
import { getDb } from '../drizzle/client.ts';
import { selfContent } from '../drizzle/schema/index.ts';
import { eq } from 'drizzle-orm';
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

const updateSelfContentSchema = z.object({
  briefIntro: z.string().optional().nullable(),
  about: z.string().optional().nullable(),
  hashTags: z.array(z.string()).optional(),
});

router.get('/', async (c) => {
  const db = getDb(c.env);
  const content = await db.select().from(selfContent).orderBy(selfContent.id).limit(1).get();

  if (!content) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Self content not found' } }, 404);
  }

  return c.json({
    success: true,
    data: { ...content, hashTags: parseTags(content.hashTags) },
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
  const validated = updateSelfContentSchema.parse(body);

  const existing = await db.select().from(selfContent).limit(1).get();
  
  if (existing) {
    const updated = await db.update(selfContent)
      .set({
        ...(validated.briefIntro !== undefined && { briefIntro: validated.briefIntro }),
        ...(validated.about !== undefined && { about: validated.about }),
        ...(validated.hashTags && { hashTags: JSON.stringify(validated.hashTags) }),
      })
      .where(eq(selfContent.id, existing.id))
      .returning()
      .get();
      
    return c.json({ success: true, data: updated });
  }

  const content = await db.insert(selfContent).values({
    briefIntro: validated.briefIntro ?? null,
    about: validated.about ?? null,
    hashTags: validated.hashTags ? JSON.stringify(validated.hashTags) : null,
  }).returning().get();

  return c.json({ success: true, data: content }, 201);
});

router.put('/', async (c) => {
  const authCheck = requireAdmin(c);
  if (!authCheck.valid) {
    return c.json({
      success: false,
      error: authCheck.error,
    }, authCheck.error?.code === 'FORBIDDEN' ? 403 : 401);
  }

  const db = getDb(c.env);
  const body = await c.req.json();
  const validated = updateSelfContentSchema.parse(body);

  const existing = await db.select().from(selfContent).orderBy(selfContent.id).limit(1).get();
  
  if (!existing) {
    const content = await db.insert(selfContent).values({
      briefIntro: validated.briefIntro ?? null,
      about: validated.about ?? null,
      hashTags: validated.hashTags ? JSON.stringify(validated.hashTags) : null,
    }).returning().get();
    
    return c.json({ success: true, data: content }, 201);
  }

  const content = await db.update(selfContent)
    .set({
      ...(validated.briefIntro !== undefined && { briefIntro: validated.briefIntro }),
      ...(validated.about !== undefined && { about: validated.about }),
      ...(validated.hashTags && { hashTags: JSON.stringify(validated.hashTags) }),
    })
    .where(eq(selfContent.id, existing.id))
    .returning()
    .get();

  return c.json({ success: true, data: content });
});

export const selfRoutes = router;
