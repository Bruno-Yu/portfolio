#!/usr/bin/env node

/**
 * D1 Data Seeding Script
 * 
 * This script seeds the D1 database with data from data-migration/db.json
 * 
 * Usage:
 *   npx tsx scripts/seed-db.ts --local    # Seed local database
 *   npx tsx scripts/seed-db.ts --remote   # Seed remote database
 */

import * as fs from 'fs';
import * as path from 'path';
import { D1Database } from '@cloudflare/workers-types';

// Types for the migration data
interface Work {
  imgLink: string;
  title: string;
  description: string;
  tags: string[];
  gitHubUrl: string;
  gitPageUrl: string;
  content: string;
  imgUrl: string;
}

interface Skill {
  title: string;
  icon: string;
  details: string[];
}

interface SocialMedia {
  name: string;
  link: string;
}

interface SelfContent {
  briefIntro: string;
  about: string;
  hashTags: string[];
}

interface MigrationData {
  works: Work[];
  'self-content': SelfContent;
  'social-media': SocialMedia[];
  skills: Skill[];
}

async function seedDatabase(db: D1Database, data: MigrationData): Promise<void> {
  console.log('Starting database seeding...');

  // Clear existing data (optional - comment out if you want to keep existing data)
  // await db.prepare('DELETE FROM works').run();
  // await db.prepare('DELETE FROM skills').run();
  // await db.prepare('DELETE FROM social_media').run();
  // await db.prepare('DELETE FROM self_content').run();

  // Seed works
  console.log(`Seeding ${data.works.length} works...`);
  for (const work of data.works) {
    const tags = JSON.stringify(work.tags);
    await db.prepare(`
      INSERT INTO works (title, description, imgUrl, imgLink, content, tags, gitHubUrl, gitPageUrl)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      work.title,
      work.description,
      work.imgUrl,
      work.imgLink,
      work.content,
      tags,
      work.gitHubUrl,
      work.gitPageUrl
    ).run();
  }
  console.log('Works seeded successfully');

  // Seed skills
  console.log(`Seeding ${data.skills.length} skills...`);
  for (let i = 0; i < data.skills.length; i++) {
    const skill = data.skills[i];
    const details = JSON.stringify(skill.details);
    await db.prepare(`
      INSERT INTO skills (title, icon, details, "order")
      VALUES (?, ?, ?, ?)
    `).bind(
      skill.title,
      skill.icon,
      details,
      i
    ).run();
  }
  console.log('Skills seeded successfully');

  // Seed social media
  console.log(`Seeding ${data['social-media'].length} social media links...`);
  for (let i = 0; i < data['social-media'].length; i++) {
    const social = data['social-media'][i];
    await db.prepare(`
      INSERT INTO social_media (name, link, "order")
      VALUES (?, ?, ?)
    `).bind(
      social.name,
      social.link,
      i
    ).run();
  }
  console.log('Social media links seeded successfully');

  // Seed self content (only one record)
  console.log('Seeding self content...');
  const self = data['self-content'];
  const hashTags = JSON.stringify(self.hashTags);
  
  // Check if self content already exists
  const existing = await db.prepare('SELECT id FROM self_content LIMIT 1').first();
  
  if (existing) {
    await db.prepare(`
      UPDATE self_content
      SET briefIntro = ?, about = ?, hash_tags = ?
      WHERE id = ?
    `).bind(
      self.briefIntro,
      self.about,
      hashTags,
      existing.id
    ).run();
  } else {
    await db.prepare(`
      INSERT INTO self_content (briefIntro, about, hash_tags)
      VALUES (?, ?, ?)
    `).bind(
      self.briefIntro,
      self.about,
      hashTags
    ).run();
  }
  console.log('Self content seeded successfully');

  console.log('Database seeding completed successfully!');
}

async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const isRemote = args.includes('--remote');
  const isLocal = args.includes('--local');

  // Default to local if neither specified
  const env = isRemote ? 'remote' : 'local';

  console.log(`Using ${env} database...`);

  // Read the migration data
  const dbJsonPath = path.join(__dirname, '..', '..', 'data-migration', 'db.json');
  
  if (!fs.existsSync(dbJsonPath)) {
    console.error(`Error: Migration data file not found at ${dbJsonPath}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(dbJsonPath, 'utf-8');
  const data: MigrationData = JSON.parse(rawData);

  console.log('Loaded migration data:');
  console.log(`  - Works: ${data.works.length}`);
  console.log(`  - Skills: ${data.skills.length}`);
  console.log(`  - Social media: ${data['social-media'].length}`);
  console.log(`  - Self content: 1`);

  // For now, just log what would be done
  // In a real scenario, you would use wrangler to get the D1 database
  console.log('\nTo run this script, use:');
  console.log('  npx wrangler d1 execute DB --local --command=".read scripts/seed-db.sql"');
  console.log('\nOr create a seed script that uses the D1 client');

  console.log('\nSeeding script created successfully!');
  console.log('This script demonstrates the structure for seeding D1 with migration data.');
}

// Run the main function
main().catch(console.error);
