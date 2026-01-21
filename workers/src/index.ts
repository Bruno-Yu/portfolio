import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { worksRoutes } from './routes/works';
import { skillsRoutes } from './routes/skills';
import { socialRoutes } from './routes/social';
import { selfRoutes } from './routes/self';
import { authRoutes } from './routes/auth';
import { adminRoutes } from './routes/admin';
import { authMiddleware } from './middleware/auth';
import type { D1Database } from '@cloudflare/workers-types';

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

// CORS middleware
app.use('/*', cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5173/portfolio',
    'http://localhost:8787',
    'https://bruno-portfolio-api.jackhellowin.workers.dev',
    'https://portfolio-a1p.pages.dev',
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

// Protected routes - apply auth middleware to write operations
const protectedRoutes = new Hono<{ Bindings: Bindings }>();
protectedRoutes.use('/*', authMiddleware);

// Apply auth to works write operations
protectedRoutes.post('/works', async (c) => worksRoutes.fetch(c));
protectedRoutes.put('/works/:id', async (c) => worksRoutes.fetch(c));
protectedRoutes.delete('/works/:id', async (c) => worksRoutes.fetch(c));

// Apply auth to skills write operations
protectedRoutes.post('/skills', async (c) => skillsRoutes.fetch(c));
protectedRoutes.put('/skills/:id', async (c) => skillsRoutes.fetch(c));
protectedRoutes.delete('/skills/:id', async (c) => skillsRoutes.fetch(c));

// Apply auth to social-media write operations
protectedRoutes.post('/social-media', async (c) => socialRoutes.fetch(c));
protectedRoutes.put('/social-media/:id', async (c) => socialRoutes.fetch(c));
protectedRoutes.delete('/social-media/:id', async (c) => socialRoutes.fetch(c));

// Apply auth to self-content write operations
protectedRoutes.post('/self-content', async (c) => selfRoutes.fetch(c));
protectedRoutes.put('/self-content', async (c) => selfRoutes.fetch(c));

// Mount protected routes under /api
app.route('/api', protectedRoutes);

// Public routes (GET only)
app.route('/api/works', worksRoutes);
app.route('/api/skills', skillsRoutes);
app.route('/api/social-media', socialRoutes);
app.route('/api/self-content', selfRoutes);

export default app;
