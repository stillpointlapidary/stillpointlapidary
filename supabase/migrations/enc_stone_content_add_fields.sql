-- Add missing editorial fields to enc_stone_content
-- These fields are required by the dynamic encyclopedia template
ALTER TABLE enc_stone_content
  ADD COLUMN IF NOT EXISTS pill_1            text,
  ADD COLUMN IF NOT EXISTS pill_2            text,
  ADD COLUMN IF NOT EXISTS pill_3            text,
  ADD COLUMN IF NOT EXISTS element           text,
  ADD COLUMN IF NOT EXISTS planet            text,
  ADD COLUMN IF NOT EXISTS zodiac            text,
  ADD COLUMN IF NOT EXISTS energetic_role    text,
  ADD COLUMN IF NOT EXISTS energetic_role_icon text,
  ADD COLUMN IF NOT EXISTS chakra_primary    text,
  ADD COLUMN IF NOT EXISTS chakra_secondary  text,
  ADD COLUMN IF NOT EXISTS color_energy      text;
