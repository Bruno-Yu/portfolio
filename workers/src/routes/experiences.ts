import { Hono } from 'hono';
import { z } from 'zod';
import { getDb } from '../drizzle/client.ts';
import { experiences } from '../drizzle/schema/experiences.ts';
import { eq, asc } from 'drizzle-orm';
import { authMiddleware, requireAdmin } from '../middleware/auth.js';
import type { D1Database } from '@cloudflare/workers-types';
import type { TokenPayload } from '../services/auth.js';

type Bindings = { DB: D1Database };

const router = new Hono<{
  Bindings: Bindings;
  Variables: { user?: TokenPayload };
}>();

router.use('/*', authMiddleware);

// GET / — public
router.get('/', async (c) => {
  const db = getDb(c.env);
  const rows = await db
    .select()
    .from(experiences)
    .orderBy(asc(experiences.sortOrder), asc(experiences.id))
    .all();
  return c.json({
    success: true,
    data: rows.map((row) => ({
      ...row,
      tags: parseStringArray(row.tags),
      bulletsEn: parseStringArray(row.bulletsEn, row.noteEn),
      bulletsZh: parseStringArray(row.bulletsZh, row.noteZh),
    })),
  });
});

const expSchema = z.object({
  fromYear: z.string().min(1),
  toYear: z.string().optional().nullable(),
  roleEn: z.string().optional().nullable(),
  roleZh: z.string().optional().nullable(),
  orgEn: z.string().optional().nullable(),
  orgZh: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().default([]),
  bulletsEn: z.array(z.string()).optional().default([]),
  bulletsZh: z.array(z.string()).optional().default([]),
  noteEn: z.string().optional().nullable(),
  noteZh: z.string().optional().nullable(),
  sortOrder: z.number().optional(),
});

function parseStringArray(value: string | null | undefined, legacyText?: string | null): string[] {
  if (value) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.filter((item): item is string => typeof item === 'string');
    } catch {
      return value.split('\n').map((item) => item.trim()).filter(Boolean);
    }
  }

  if (!legacyText) return [];
  return legacyText.split('\n').map((item) => item.trim()).filter(Boolean);
}

function stringifyArray(value: string[] | undefined): string {
  return JSON.stringify(value?.map((item) => item.trim()).filter(Boolean) ?? []);
}

// POST / — admin only
router.post('/', async (c) => {
  const authCheck = requireAdmin(c);
  if (!authCheck.valid) {
    return c.json(
      { success: false, error: authCheck.error },
      authCheck.error?.code === 'FORBIDDEN' ? 403 : 401,
    );
  }

  const body = await c.req.json();
  const data = expSchema.parse(body);
  const db = getDb(c.env);

  const [row] = await db
    .insert(experiences)
    .values({
      fromYear: data.fromYear,
      toYear: data.toYear ?? null,
      roleEn: data.roleEn ?? null,
      roleZh: data.roleZh ?? null,
      orgEn: data.orgEn ?? null,
      orgZh: data.orgZh ?? null,
      location: data.location ?? null,
      tags: stringifyArray(data.tags),
      bulletsEn: stringifyArray(data.bulletsEn),
      bulletsZh: stringifyArray(data.bulletsZh),
      noteEn: data.noteEn ?? data.bulletsEn.join('\n') ?? null,
      noteZh: data.noteZh ?? data.bulletsZh.join('\n') ?? null,
      sortOrder: data.sortOrder ?? 0,
    })
    .returning();

  return c.json({ success: true, data: row }, 201);
});

// PUT /:id — admin only
router.put('/:id', async (c) => {
  const authCheck = requireAdmin(c);
  if (!authCheck.valid) {
    return c.json(
      { success: false, error: authCheck.error },
      authCheck.error?.code === 'FORBIDDEN' ? 403 : 401,
    );
  }

  const id = parseInt(c.req.param('id'));
  if (isNaN(id)) return c.json({ success: false, error: { code: 'BAD_REQUEST' } }, 400);

  const body = await c.req.json();
  const data = expSchema.partial().parse(body);
  const db = getDb(c.env);

  const [row] = await db
    .update(experiences)
    .set({
      ...(data.fromYear !== undefined && { fromYear: data.fromYear }),
      ...(data.toYear !== undefined && { toYear: data.toYear ?? null }),
      ...(data.roleEn !== undefined && { roleEn: data.roleEn ?? null }),
      ...(data.roleZh !== undefined && { roleZh: data.roleZh ?? null }),
      ...(data.orgEn !== undefined && { orgEn: data.orgEn ?? null }),
      ...(data.orgZh !== undefined && { orgZh: data.orgZh ?? null }),
      ...(data.location !== undefined && { location: data.location ?? null }),
      ...(data.tags !== undefined && { tags: stringifyArray(data.tags) }),
      ...(data.bulletsEn !== undefined && { bulletsEn: stringifyArray(data.bulletsEn) }),
      ...(data.bulletsZh !== undefined && { bulletsZh: stringifyArray(data.bulletsZh) }),
      ...(data.noteEn !== undefined && { noteEn: data.noteEn ?? null }),
      ...(data.noteZh !== undefined && { noteZh: data.noteZh ?? null }),
      ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
    })
    .where(eq(experiences.id, id))
    .returning();

  if (!row) return c.json({ success: false, error: { code: 'NOT_FOUND' } }, 404);
  return c.json({ success: true, data: row });
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
  await db.delete(experiences).where(eq(experiences.id, id));
  return c.json({ success: true });
});

export const experiencesRoutes = router;
