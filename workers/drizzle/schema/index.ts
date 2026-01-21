import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Works table - portfolio projects
export const works = sqliteTable('works', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  imgUrl: text('img_url'),
  imgLink: text('img_link'),
  content: text('content'),
  tags: text('tags'), // JSON array stored as string
  gitHubUrl: text('github_url'),
  gitPageUrl: text('git_page_url'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// Skills table - technical skills
export const skills = sqliteTable('skills', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  icon: text('icon').notNull(),
  details: text('details').notNull(), // JSON array stored as string
  order: integer('order').default(0),
});

// Social media table
export const socialMedia = sqliteTable('social_media', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  link: text('link').notNull(),
  order: integer('order').default(0),
});

// Self content table (single row for self introduction)
export const selfContent = sqliteTable('self_content', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  briefIntro: text('brief_intro'),
  about: text('about'),
  hashTags: text('hash_tags'), // JSON array stored as string
});

// Type definitions for responses
export type Work = typeof works.$inferSelect;
export type NewWork = typeof works.$inferInsert;
export type Skill = typeof skills.$inferSelect;
export type NewSkill = typeof skills.$inferInsert;
export type Social = typeof socialMedia.$inferSelect;
export type NewSocial = typeof socialMedia.$inferInsert;
export type SelfContent = typeof selfContent.$inferSelect;
