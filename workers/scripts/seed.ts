/**
 * Database Seed Script
 * Populates the D1 database with initial portfolio data
 * Run: pnpm run seed
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { D1Database } from '@cloudflare/workers-types';

// Load legacy data from migration folder
const dbJsonPath = resolve(__dirname, '../data-migration/db.json');
const data = JSON.parse(readFileSync(dbJsonPath, 'utf-8'));

interface SeedContext {
  DB: D1Database;
}

export async function seed({ DB }: SeedContext) {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await DB.prepare('DELETE FROM works').run();
  await DB.prepare('DELETE FROM skills').run();
  await DB.prepare('DELETE FROM social_media').run();
  await DB.prepare('DELETE FROM self_content').run();

  // Seed works
  console.log(`📝 Seeding ${data.works.length} works...`);
  for (const work of data.works) {
    await DB.prepare(`
      INSERT INTO works (title, description, img_url, img_link, content, tags, github_url, git_page_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      work.title,
      work.description,
      work.imgUrl || null,
      work.imgLink || null,
      work.content || null,
      JSON.stringify(work.tags),
      work.gitHubUrl || null,
      work.gitPageUrl || null
    ).run();
  }

  // Seed skills
  console.log(`🎯 Seeding ${data.skills.length} skills...`);
  for (const skill of data.skills) {
    await DB.prepare(`
      INSERT INTO skills (title, icon, details, "order")
      VALUES (?, ?, ?, ?)
    `).bind(
      skill.title,
      skill.icon,
      JSON.stringify(skill.details),
      data.skills.indexOf(skill)
    ).run();
  }

  // Seed social media
  console.log(`🔗 Seeding ${data['social-media'].length} social media links...`);
  for (const social of data['social-media']) {
    await DB.prepare(`
      INSERT INTO social_media (name, link, "order")
      VALUES (?, ?, ?)
    `).bind(
      social.name,
      social.link,
      data['social-media'].indexOf(social)
    ).run();
  }

  // Seed self content
  console.log('👤 Seeding self content...');
  await DB.prepare(`
    INSERT INTO self_content (brief_intro, about, hash_tags)
    VALUES (?, ?, ?)
  `).bind(
    data['self-content'].briefIntro,
    data['self-content'].about,
    JSON.stringify(data['self-content'].hashTags)
  ).run();

  console.log('✅ Database seed completed!');
}

// Export for use in wrangler or other scripts
export { data };
