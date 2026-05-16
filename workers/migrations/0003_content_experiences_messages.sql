-- Migration 0003: content_blocks, experiences, messages
-- Implements "Content Storage: Key-Value content_blocks + Structured experiences" design decision
-- Generated: 2026-05-08

-- Bilingual key-value store for frontend text content
CREATE TABLE IF NOT EXISTS content_blocks (
  key TEXT NOT NULL,
  lang TEXT NOT NULL CHECK (lang IN ('en', 'zh')),
  value TEXT NOT NULL,
  updated_at INTEGER DEFAULT (strftime('%s', 'now')),
  PRIMARY KEY (key, lang)
);

-- Structured work experience entries
CREATE TABLE IF NOT EXISTS experiences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sort_order INTEGER DEFAULT 0,
  from_year TEXT NOT NULL,
  to_year TEXT,
  role_en TEXT,
  role_zh TEXT,
  org_en TEXT,
  org_zh TEXT,
  note_en TEXT,
  note_zh TEXT
);

-- Contact inquiry inbox (for future Messages UI)
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sender_name TEXT,
  sender_email TEXT NOT NULL,
  subject TEXT,
  body TEXT NOT NULL,
  is_read INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_content_blocks_key ON content_blocks(key);
CREATE INDEX IF NOT EXISTS idx_experiences_sort ON experiences(sort_order, id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read);
