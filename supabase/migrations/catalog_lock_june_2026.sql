-- ============================================================
-- Still Point Lapidary — Final Catalog Lock Migration
-- Date: 2026-06-19
-- Target: 333 stones | T1:30  T2:132  T3:123  T4:48
--
-- Tier 1 changes were already applied in Supabase before this
-- migration. They are NOT repeated here.
-- C-0083 Grape Chalcedony was already deleted. Not repeated.
--
-- Run in Supabase SQL Editor.
-- The entire migration is wrapped in a transaction. Any failing
-- assertion rolls back all changes automatically.
-- ============================================================

BEGIN;

-- ============================================================
-- SAFETY: Verify the stones table exists before touching anything
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'stones'
  ) THEN
    RAISE EXCEPTION 'Table public.stones not found. Aborting migration.';
  END IF;
END $$;

-- ============================================================
-- SAFETY: Report whether a slug column exists on stones
-- The migration does not use slug; this notice is informational.
-- If slug IS present, populate it manually after this migration.
-- ============================================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'stones'
      AND column_name  = 'slug'
  ) THEN
    RAISE NOTICE 'slug column exists on stones. The INSERT statements do not populate it — set slug values for C-0402, C-0403, C-0404 separately if required.';
  ELSE
    RAISE NOTICE 'slug is not a column on stones — correct, no action needed.';
  END IF;
END $$;

-- ============================================================
-- STEP 0: Clean up stone_of_day_history for deleted stones
--
-- stone_of_day_schedule has ON DELETE CASCADE and will be
-- handled automatically when the stones rows are deleted.
--
-- stone_of_day_history has no FK to stones (confirmed from
-- repository schema). Any history rows for C-0093 or C-0270
-- must be removed explicitly to prevent orphaned records.
-- ============================================================

DELETE FROM public.stone_of_day_history
WHERE stone_id IN ('C-0093', 'C-0270');

-- ============================================================
-- STEP 1: Delete removed stones
--
-- stone_of_day_schedule rows cascade automatically.
-- stone_of_day_history orphans were removed in STEP 0.
-- ============================================================

DELETE FROM public.stones WHERE id = 'C-0093'; -- Lion Skin Jasper
DELETE FROM public.stones WHERE id = 'C-0270'; -- Agni Manitite

-- ============================================================
-- STEP 2: Insert three new stones — idempotent
--
-- Only columns confirmed present in the stones schema are used
-- (derived from supabase/migrate_stones.js field mapping).
-- slug is NOT a stones table column and is intentionally omitted.
-- display_order is not in the original migration schema and is omitted.
-- is_custom is included explicitly because migrate_stones.js always
-- sets it to false; it is likely NOT NULL.
-- All card/chakra/energetic data will be added during encyclopedia
-- production. sotd_enabled will default to false or null; these
-- stones will not be served as Stone of the Day until that field
-- is set during production onboarding.
-- ============================================================

INSERT INTO public.stones
  (id, name, collection_tier, alternate_names, family, species, material_type, is_custom)
VALUES
  ('C-0402', 'Aegirine',      3, NULL,                             'Silicates', 'Aegirine',           'Mineral',   false),
  ('C-0403', 'Tiffany Stone', 3, 'Bertrandite; Opalized Fluorite', 'Composite', 'Mixed mineral rock', 'Composite', false),
  ('C-0404', 'Goshenite',     4, 'Colorless Beryl',                'Beryl',     'Beryl',              'Mineral',   false)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- STEP 3: Tier 2 → Tier 3 demotions (12 stones)
-- ============================================================

UPDATE public.stones
SET collection_tier = 3
WHERE id IN (
  'C-9002', -- Chocolate Calcite
  'C-0295', -- Clear Fluorite
  'C-0124', -- Crackle Quartz
  'C-0073', -- Druzy Agate
  'C-0125', -- Milky Quartz
  'C-0179', -- Pink Aventurine
  'C-0033', -- Pink Fluorite
  'C-0180', -- Red Aventurine
  'C-0365', -- Super Seven
  'C-0086', -- White Chalcedony
  'C-0176', -- White Dolomite
  'C-0036'  -- Yellow Fluorite
);

-- ============================================================
-- STEP 4: Tier 3 → Tier 2 promotions (21 stones)
-- ============================================================

UPDATE public.stones
SET collection_tier = 2
WHERE id IN (
  'C-0120', -- Ametrine
  'C-0006', -- Azurite
  'C-0150', -- Black Amethyst
  'C-0008', -- Bumblebee Jasper
  'C-0249', -- Charoite
  'C-0037', -- Copper
  'C-0074', -- Fire Agate
  'C-0122', -- Golden Healer Quartz
  'C-0076', -- Grape Agate
  'C-0050', -- Infinite
  'C-0059', -- K2 Jasper
  'C-0253', -- Larimar
  'C-0024', -- Morganite
  'C-0397', -- Phoenix Stone
  'C-0192', -- Pietersite
  'C-0055', -- Pink Tourmaline
  'C-0066', -- Ruby in Kyanite
  'C-0039', -- Sapphire
  'C-0265', -- Seraphinite
  'C-0401', -- Unicorn Stone
  'C-0204'  -- Jet
);

-- ============================================================
-- STEP 5: Identity corrections (research-independent)
--
-- These two corrections are factually established and do not
-- require specimen or provenance research.
-- All other Section 9 identity corrections belong in encyclopedia
-- copy and will be applied during MD production per the
-- research-required list in CATALOG-LOCK-2026-06-19.md.
-- ============================================================

-- Opalite: man-made glass, not a mineral species.
-- The roster listed material_type as 'Mineral' — corrected here.
UPDATE public.stones
SET material_type = 'Synthetic'
WHERE id = 'C-0262'; -- Opalite

-- Dalmatian Jasper: aplite/rhyolite-type volcanic rock, not a single mineral.
UPDATE public.stones
SET material_type = 'Rock'
WHERE id = 'C-0088'; -- Dalmatian Jasper

-- Dalmatian Jasper: add approved alternate name 'Dalmatian Stone'.
-- Safe append: skips update if the name is already present.
UPDATE public.stones
SET alternate_names = CASE
  WHEN alternate_names IS NULL OR alternate_names = ''
    THEN 'Dalmatian Stone'
  WHEN alternate_names NOT LIKE '%Dalmatian Stone%'
    THEN alternate_names || '; Dalmatian Stone'
  ELSE alternate_names
END
WHERE id = 'C-0088'; -- Dalmatian Jasper

-- ============================================================
-- STEP 6: Verification — all assertions must pass or the
-- transaction rolls back and nothing is committed.
-- ============================================================

-- 6a: Deleted stones must be gone
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.stones WHERE id IN ('C-0093', 'C-0270')
  ) THEN
    RAISE EXCEPTION 'Deleted stone IDs (C-0093, C-0270) still present in stones. Rolling back.';
  END IF;
  RAISE NOTICE 'Deleted stones absent ✓';
END $$;

-- 6b: All three new stones must be present
DO $$
DECLARE v_found integer;
BEGIN
  SELECT COUNT(*) INTO v_found
  FROM public.stones
  WHERE id IN ('C-0402', 'C-0403', 'C-0404');
  IF v_found <> 3 THEN
    RAISE EXCEPTION 'Expected 3 new stones; found %. C-0402/03/04 not all present. Rolling back.', v_found;
  END IF;
  RAISE NOTICE 'New stones C-0402, C-0403, C-0404 present ✓';
END $$;

-- 6c: Total stone count must be exactly 333
DO $$
DECLARE v_total integer;
BEGIN
  SELECT COUNT(*) INTO v_total FROM public.stones;
  IF v_total <> 333 THEN
    RAISE EXCEPTION 'Total count is %. Expected 333. Rolling back.', v_total;
  END IF;
  RAISE NOTICE 'Total stone count: % ✓', v_total;
END $$;

-- 6d: Tier counts must match locked values
DO $$
DECLARE
  v_t1 integer; v_t2 integer; v_t3 integer; v_t4 integer;
BEGIN
  SELECT COUNT(*) INTO v_t1 FROM public.stones WHERE collection_tier = 1;
  SELECT COUNT(*) INTO v_t2 FROM public.stones WHERE collection_tier = 2;
  SELECT COUNT(*) INTO v_t3 FROM public.stones WHERE collection_tier = 3;
  SELECT COUNT(*) INTO v_t4 FROM public.stones WHERE collection_tier = 4;
  IF v_t1 <> 30 OR v_t2 <> 132 OR v_t3 <> 123 OR v_t4 <> 48 THEN
    RAISE EXCEPTION
      'Tier counts do not match locked values. Got T1=% T2=% T3=% T4=%. Expected T1=30 T2=132 T3=123 T4=48. Rolling back.',
      v_t1, v_t2, v_t3, v_t4;
  END IF;
  RAISE NOTICE 'Tier counts: T1=% T2=% T3=% T4=% ✓', v_t1, v_t2, v_t3, v_t4;
END $$;

-- 6e: No duplicate stone IDs
DO $$
DECLARE v_dup_count integer;
BEGIN
  SELECT COUNT(*) INTO v_dup_count
  FROM (
    SELECT id FROM public.stones GROUP BY id HAVING COUNT(*) > 1
  ) d;
  IF v_dup_count > 0 THEN
    RAISE EXCEPTION '% duplicate ID group(s) found. Rolling back.', v_dup_count;
  END IF;
  RAISE NOTICE 'No duplicate IDs ✓';
END $$;

-- 6f: Duplicate name check — informational only, not a blocker.
-- Some stones share names across languages or commercial groupings.
-- Surfaces them as NOTICE so Christie can review; does not roll back.
DO $$
DECLARE dup_names text;
BEGIN
  SELECT string_agg(name || ' (' || cnt || 'x)', ', ')
  INTO   dup_names
  FROM (
    SELECT name, COUNT(*) AS cnt
    FROM   public.stones
    GROUP  BY name
    HAVING COUNT(*) > 1
  ) d;
  IF dup_names IS NOT NULL THEN
    RAISE NOTICE 'Duplicate names (review, not blocking): %', dup_names;
  ELSE
    RAISE NOTICE 'No duplicate names ✓';
  END IF;
END $$;

-- 6g: Confirm no stone_of_day_history orphans remain for deleted IDs
DO $$
DECLARE v_orphan_count integer;
BEGIN
  SELECT COUNT(*) INTO v_orphan_count
  FROM public.stone_of_day_history
  WHERE stone_id IN ('C-0093', 'C-0270');
  IF v_orphan_count > 0 THEN
    RAISE EXCEPTION '% orphaned history row(s) still present for deleted stones. Rolling back.', v_orphan_count;
  END IF;
  RAISE NOTICE 'No orphaned history rows for deleted stones ✓';
END $$;

COMMIT;

-- ============================================================
-- POST-COMMIT SUMMARY QUERIES
-- Run these after the transaction succeeds to confirm final state.
-- ============================================================

SELECT collection_tier, COUNT(*) AS count
FROM   public.stones
GROUP  BY collection_tier
ORDER  BY collection_tier;

SELECT COUNT(*) AS total_stones FROM public.stones;
