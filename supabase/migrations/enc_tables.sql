-- Encyclopedia tables migration
-- Creates 8 enc_ prefixed tables for dynamic encyclopedia template
-- All FK references stones.id (type text)
-- Do not modify existing tables

-- enc_stone_content: one row per stone, flat editorial fields
CREATE TABLE IF NOT EXISTS enc_stone_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stone_id text NOT NULL REFERENCES stones(id),
  slug text NOT NULL,
  collection_label text,
  signature_line text,
  best_for text,
  use_when text,
  affirmation text,
  image_alt text,
  overview_p1 text,
  overview_p2 text,
  formation text,
  collector_context_p1 text,
  collector_context_p2 text,
  collector_context_p3 text,
  nav_prev_slug text,
  nav_prev_name text,
  nav_next_slug text,
  nav_next_name text,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (stone_id)
);

-- enc_themes: one row per theme per stone
CREATE TABLE IF NOT EXISTS enc_themes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stone_id text NOT NULL REFERENCES stones(id),
  tier text NOT NULL,      -- primary / secondary / occasional
  title text NOT NULL,
  description text,        -- null for occasional associations
  display_order integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- enc_collector_notes: one row per note per stone
CREATE TABLE IF NOT EXISTS enc_collector_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stone_id text NOT NULL REFERENCES stones(id),
  title text NOT NULL,
  body text NOT NULL,
  icon_slug text,
  display_order integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- enc_mineral_facts: one row per fact row per stone, always 8 rows per stone
CREATE TABLE IF NOT EXISTS enc_mineral_facts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stone_id text NOT NULL REFERENCES stones(id),
  label text NOT NULL,
  value text NOT NULL,
  display_order integer NOT NULL,  -- 1-8
  created_at timestamptz NOT NULL DEFAULT now()
);

-- enc_localities: one row per locality per stone
CREATE TABLE IF NOT EXISTS enc_localities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stone_id text NOT NULL REFERENCES stones(id),
  locality text NOT NULL,
  display_order integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- enc_related_stones: one row per related stone per stone, always 4 rows
CREATE TABLE IF NOT EXISTS enc_related_stones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stone_id text NOT NULL REFERENCES stones(id),
  "group" text NOT NULL,        -- similar / pairs
  related_slug text NOT NULL,
  related_name text NOT NULL,
  reason text NOT NULL,
  display_order integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- enc_care: one row per care category per stone, always 4 rows
CREATE TABLE IF NOT EXISTS enc_care (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stone_id text NOT NULL REFERENCES stones(id),
  category text NOT NULL,   -- Cleaning / Water / Light & Heat / Storage
  body text NOT NULL,
  display_order integer NOT NULL,  -- 1-4
  created_at timestamptz NOT NULL DEFAULT now()
);

-- enc_reach_for: one row per use case per stone, always 5 rows
CREATE TABLE IF NOT EXISTS enc_reach_for (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stone_id text NOT NULL REFERENCES stones(id),
  label text NOT NULL,
  description text NOT NULL,
  display_order integer NOT NULL,  -- 1-5
  created_at timestamptz NOT NULL DEFAULT now()
);
