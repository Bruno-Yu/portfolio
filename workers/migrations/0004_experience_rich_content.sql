-- Migration 0004: richer work experience content
-- Adds frontstage-controlled location, tags, and bullet-list fields.

ALTER TABLE experiences ADD COLUMN location TEXT;
ALTER TABLE experiences ADD COLUMN tags TEXT;
ALTER TABLE experiences ADD COLUMN bullets_en TEXT;
ALTER TABLE experiences ADD COLUMN bullets_zh TEXT;
