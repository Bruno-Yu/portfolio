-- Initial schema migration
-- Generated: 2026-01-21

CREATE TABLE IF NOT EXISTS works (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  img_url TEXT,
  img_link TEXT,
  content TEXT,
  tags TEXT,
  github_url TEXT,
  git_page_url TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE IF NOT EXISTS skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  icon TEXT NOT NULL,
  details TEXT NOT NULL,
  "order" INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS social_media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  link TEXT NOT NULL,
  "order" INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS self_content (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  brief_intro TEXT,
  about TEXT,
  hash_tags TEXT
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_works_created_at ON works(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_skills_order ON skills("order");
CREATE INDEX IF NOT EXISTS idx_social_media_order ON social_media("order");
