import { Hono } from 'hono';
import { authMiddleware, requireAdmin } from '../middleware/auth.js';
import type { D1Database, R2Bucket } from '@cloudflare/workers-types';
import type { TokenPayload } from '../services/auth.js';

type Bindings = { DB: D1Database; IMAGES_BUCKET: R2Bucket };

const router = new Hono<{
  Bindings: Bindings;
  Variables: { user?: TokenPayload };
}>();

router.use('/*', authMiddleware);

// POST / — upload image to R2
router.post('/', async (c) => {
  const authCheck = requireAdmin(c);
  if (!authCheck.valid) {
    return c.json(
      { success: false, error: authCheck.error },
      authCheck.error?.code === 'FORBIDDEN' ? 403 : 401,
    );
  }

  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return c.json({ success: false, error: { code: 'BAD_REQUEST', message: 'No file provided' } }, 400);
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return c.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'Invalid file type. Allowed: jpg, png, webp, gif' } },
        400,
      );
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return c.json(
        { success: false, error: { code: 'PAYLOAD_TOO_LARGE', message: 'File too large (max 5 MB)' } },
        413,
      );
    }

    const ext = file.name.split('.').pop() ?? 'jpg';
    const key = `works/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const buffer = await file.arrayBuffer();
    await c.env.IMAGES_BUCKET.put(key, buffer, {
      httpMetadata: { contentType: file.type },
    });

    const url = `https://images.jackhellowin.win/${key}`;

    return c.json({ success: true, data: { url, key } });
  } catch (err) {
    console.error('Upload error:', err);
    return c.json({ success: false, error: { code: 'UPLOAD_FAILED', message: 'Failed to upload file' } }, 500);
  }
});

// DELETE /:key — delete image from R2
router.delete('/:key{.+}', async (c) => {
  const authCheck = requireAdmin(c);
  if (!authCheck.valid) {
    return c.json(
      { success: false, error: authCheck.error },
      authCheck.error?.code === 'FORBIDDEN' ? 403 : 401,
    );
  }

  const key = c.req.param('key');
  await c.env.IMAGES_BUCKET.delete(key);
  return c.json({ success: true });
});

export const uploadRoutes = router;
