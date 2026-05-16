import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const contentBlocks = sqliteTable('content_blocks', {
  key: text('key').notNull(),
  lang: text('lang', { enum: ['en', 'zh'] }).notNull(),
  value: text('value').notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
}, (table) => ({
  pk: primaryKey({ columns: [table.key, table.lang] }),
}));

export type ContentBlock = typeof contentBlocks.$inferSelect;
export type NewContentBlock = typeof contentBlocks.$inferInsert;
