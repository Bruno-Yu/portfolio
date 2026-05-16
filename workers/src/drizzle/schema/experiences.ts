import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const experiences = sqliteTable('experiences', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  sortOrder: integer('sort_order').default(0),
  fromYear: text('from_year').notNull(),
  toYear: text('to_year'),
  roleEn: text('role_en'),
  roleZh: text('role_zh'),
  orgEn: text('org_en'),
  orgZh: text('org_zh'),
  location: text('location'),
  tags: text('tags'),
  bulletsEn: text('bullets_en'),
  bulletsZh: text('bullets_zh'),
  noteEn: text('note_en'),
  noteZh: text('note_zh'),
});

export type Experience = typeof experiences.$inferSelect;
export type NewExperience = typeof experiences.$inferInsert;
