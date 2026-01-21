import { drizzle } from 'drizzle-orm/d1';
import type { D1Database } from '@cloudflare/workers-types';

export function getDb(env: { DB: D1Database }) {
  return drizzle(env.DB);
}

// Table names for reference
export const TABLE_NAMES = {
  works: 'works',
  skills: 'skills',
  socialMedia: 'social_media',
  selfContent: 'self_content',
} as const;
