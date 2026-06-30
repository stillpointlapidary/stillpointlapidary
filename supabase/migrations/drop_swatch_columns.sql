-- Drop deprecated swatch color columns from the stones table.
-- Replaced by color_hex and color_categories, which are the sole source
-- for all color-dot rendering (listing page, stone.html Related Stones).
-- Approved by Christie 2026-06-30.

ALTER TABLE stones
  DROP COLUMN IF EXISTS swatch_color_start,
  DROP COLUMN IF EXISTS swatch_color_end;
