import { Hono } from 'hono';
import { authMiddleware, requireAdmin } from '../middleware/auth.js';
import type { D1Database, R2Bucket } from '@cloudflare/workers-types';

type Bindings = {
  DB: D1Database;
  IMAGES_BUCKET: R2Bucket;
};

const R2_PUBLIC_BASE = 'https://images.jackhellowin.win';

/** Map common MIME types to file extensions. */
function extFromMime(mimeType: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
    'image/bmp': 'bmp',
    'image/tiff': 'tiff',
    'image/avif': 'avif',
  };
  return map[mimeType] ?? mimeType.split('/')[1] ?? 'bin';
}

/** Extract extension from a filename (lowercase, without the dot). */
function extFromFilename(filename: string): string | null {
  const parts = filename.split('.');
  if (parts.length < 2) return null;
  return parts[parts.length - 1].toLowerCase();
}

const router = new Hono<{ Bindings: Bindings }>();

// Apply auth middleware to all upload routes
router.use('/*', authMiddleware);

/**
 * POST /api/upload
 * Accepts multipart/form-data with a `file` field containing an image.
 * Stores the file in R2 and returns its public URL.
 * Requires valid admin JWT.
 */
router.post('/', async (c) => {
  // Task 3.2 — require admin JWT
  const authCheck = requireAdmin(c);
  if (!authCheck.valid) {
    return c.json(
      { success: false, error: authCheck.error },
      authCheck.error?.code === 'FORBIDDEN' ? 403 : 401,
    );
  }

  // Task 3.2 — parse multipart form data
  let formData: FormData;
  try {
    formData = await c.req.raw.formData();
  } catch {
    return c.json({ success: false, error: 'Invalid multipart form data' }, 400);
  }

  const file = formData.get('file');

  // Task 3.2 — reject when file field is absent
  if (!file || !(file instanceof File)) {
    return c.json({ success: false, error: 'No file provided' }, 400);
  }

  // Task 3.3 — reject non-image MIME types
  if (!file.type.startsWith('image/')) {
    return c.json({ success: false, error: 'Invalid file type' }, 400);
  }

  // Task 3.4 — reject files larger than 5 MiB
  if (file.size > 5_242_880) {
    return c.json({ success: false, error: 'File too large' }, 413);
  }

  // Task 3.5 — generate storage key: <timestamp>-<uuid>.<ext>
  const ext =
    extFromFilename(file.name) ?? extFromMime(file.type);
  const key = `${Date.now()}-${crypto.randomUUID()}.${ext}`;

  // Task 3.6 — store file in R2 with correct content-type metadata
  const buffer = await file.arrayBuffer();
  await c.env.IMAGES_BUCKET.put(key, buffer, {
    httpMetadata: { contentType: file.type },
  });

  // Task 3.7 — return public URL
  const url = `${R2_PUBLIC_BASE}/${key}`;
  return c.json({ success: true, url });
});

/**
 * DELETE /api/upload/:key
 * Removes the specified object from R2 (idempotent — 200 even if key does not exist).
 * Requires valid admin JWT.
 */
router.delete('/:key', async (c) => {
  // Task 3.10 — require admin JWT
  const authCheck = requireAdmin(c);
  if (!authCheck.valid) {
    return c.json(
      { success: false, error: authCheck.error },
      authCheck.error?.code === 'FORBIDDEN' ? 403 : 401,
    );
  }

  const key = c.req.param('key');

  // Task 3.9 — delete from R2 (idempotent: delete is a no-op if key does not exist)
  await c.env.IMAGES_BUCKET.delete(key);

  return c.json({ success: true });
});

export { router as uploadRoutes };
