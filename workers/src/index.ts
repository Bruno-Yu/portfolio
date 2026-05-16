import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { worksRoutes } from './routes/works';
import { skillsRoutes } from './routes/skills';
import { socialRoutes } from './routes/social';
import { selfRoutes } from './routes/self';
import { authRoutes } from './routes/auth';
import { adminRoutes } from './routes/admin';
import { analyticsRoutes } from './routes/analytics';
import { contentBlocksRoutes } from './routes/contentBlocks';
import { experiencesRoutes } from './routes/experiences';
import { messagesRoutes } from './routes/messages';
import { authMiddleware } from './middleware/auth';
import type { D1Database, R2Bucket } from '@cloudflare/workers-types';
import { uploadRoutes } from './routes/upload';

type Bindings = {
  DB: D1Database;
  IMAGES_BUCKET: R2Bucket;
  CF_ANALYTICS_API_TOKEN?: string;
  CF_ZONE_ID?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// CORS middleware
app.use('/*', cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5173/portfolio',
    'http://localhost:8787',
    'https://portfolio-a1p.pages.dev',
    'https://portfolio.jackhellowin.win',
  ],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Error handling middleware
app.onError((err, c) => {
  console.error('Error:', err.message);
  return c.json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: err.message || 'Internal server error',
    },
  }, 500);
});

// 404 handler
app.notFound((c) => {
  return c.json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Resource not found',
    },
  }, 404);
});

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth routes (public)
app.route('/api/auth', authRoutes);

// Admin routes (protected)
app.route('/api/admin', adminRoutes);
app.route('/api/admin/analytics', analyticsRoutes);

// Upload routes (admin-protected image storage)
app.route('/api/upload', uploadRoutes);

// Public routes
app.route('/api/works', worksRoutes);
app.route('/api/skills', skillsRoutes);
app.route('/api/social-media', socialRoutes);
app.route('/api/self-content', selfRoutes);
app.route('/api/content-blocks', contentBlocksRoutes);
app.route('/api/experiences', experiencesRoutes);
app.route('/api/messages', messagesRoutes);

export default app;
