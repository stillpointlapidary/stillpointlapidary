-- ROLLBACK SNAPSHOT — exact live import_stone_atomic definition captured via
-- Supabase Management API (pg_get_functiondef) on 2026-07-06, immediately
-- before applying the create-or-update path fix (Red Jasper C-0099 Gate 4
-- blocker: "enc_stone_content row already exists ... Use the update path"
-- with no update path implemented). This is the byte-for-byte deployed
-- version at that moment, not just the prior git-tracked copy. To roll back,
-- run this file's CREATE OR REPLACE FUNCTION statement (unchanged below)
-- followed by the same GRANT EXECUTE statement from import_stone_atomic.sql
-- (identical in both versions).
--
-- Rolling back restores insert-only behavior: any stone_id with an existing
-- enc_stone_content row will again raise "row already exists. Use the update
-- path" and fail Gate 4 import.

CREATE OR REPLACE FUNCTION public.import_stone_atomic(packet jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_stone_id           text;
  v_slug               text;
  v_sc                 jsonb;
  v_published          boolean;
  v_production_status  text;
  fact                 jsonb;
  loc                  jsonb;
  reach                jsonb;
  theme                jsonb;
  note                 jsonb;
  care_row             jsonb;
  rs                   jsonb;
BEGIN
  v_stone_id  := packet -> 'meta' ->> 'stone_id';
  v_slug      := packet -> 'meta' ->> 'stone_slug';
  v_sc        := packet -> 'enc_stone_content';
  -- Default true: default Gate 4 publishes in the same pass. false only for
  -- an explicit unpublished hold; a missing field is not treated as a hold.
  v_published := COALESCE((v_sc ->> 'published')::boolean, true);
  v_production_status := CASE WHEN v_published THEN 'Full Entry Live' ELSE 'Supabase Entered' END;

  IF v_stone_id IS NULL THEN
    RAISE EXCEPTION 'packet.meta.stone_id is null';
  END IF;

  -- Verify the stone exists in the roster
  IF NOT EXISTS (SELECT 1 FROM stones WHERE id = v_stone_id) THEN
    RAISE EXCEPTION 'stone_id % not found in stones table', v_stone_id;
  END IF;

  -- enc_stone_content — reject if row already exists (use update path for corrections)
  IF EXISTS (SELECT 1 FROM enc_stone_content WHERE stone_id = v_stone_id) THEN
    RAISE EXCEPTION 'enc_stone_content row already exists for stone_id %. Use the update path.', v_stone_id;
  END IF;

  INSERT INTO enc_stone_content (
    stone_id, slug, collection_label, signature_line,
    pill_1, pill_2, pill_3,
    best_for, use_when, affirmation, image_alt,
    overview_p1, overview_p2,
    formation, collector_context_p1, collector_context_p2,
    collector_context_p3, collector_context_p4, collector_context_p5,
    chakra_primary, chakra_secondary, element, zodiac,
    material_type, energetic_role, energetic_role_icon, color_energy,
    nav_prev_slug, nav_prev_name, nav_next_slug, nav_next_name,
    published
  ) VALUES (
    v_stone_id,
    v_sc ->> 'slug',
    v_sc ->> 'collection_label',
    v_sc ->> 'signature_line',
    v_sc ->> 'pill_1', v_sc ->> 'pill_2', v_sc ->> 'pill_3',
    v_sc ->> 'best_for', v_sc ->> 'use_when', v_sc ->> 'affirmation',
    v_sc ->> 'image_alt',
    v_sc ->> 'overview_p1', v_sc ->> 'overview_p2',
    v_sc ->> 'formation',
    v_sc ->> 'collector_context_p1', v_sc ->> 'collector_context_p2',
    v_sc ->> 'collector_context_p3', v_sc ->> 'collector_context_p4', v_sc ->> 'collector_context_p5',
    v_sc ->> 'chakra_primary', v_sc ->> 'chakra_secondary',
    v_sc ->> 'element', v_sc ->> 'zodiac',
    v_sc ->> 'material_type', v_sc ->> 'energetic_role', v_sc ->> 'energetic_role_icon',
    v_sc ->> 'color_energy',
    v_sc ->> 'nav_prev_slug', v_sc ->> 'nav_prev_name',
    v_sc ->> 'nav_next_slug', v_sc ->> 'nav_next_name',
    v_published
  );

  -- Gate 4 step 8: move the roster status in lockstep with published, in the
  -- same transaction, so the two fields can never disagree.
  UPDATE stones
  SET enc_production_status = v_production_status
  WHERE id = v_stone_id;

  -- enc_mineral_facts (exactly 8 rows)
  FOR fact IN SELECT * FROM jsonb_array_elements(packet -> 'enc_mineral_facts') LOOP
    INSERT INTO enc_mineral_facts (stone_id, label, value, display_order)
    VALUES (v_stone_id, fact ->> 'label', fact ->> 'value', (fact ->> 'display_order')::int);
  END LOOP;

  -- enc_localities
  FOR loc IN SELECT * FROM jsonb_array_elements(packet -> 'enc_localities') LOOP
    INSERT INTO enc_localities (stone_id, locality, display_order)
    VALUES (v_stone_id, loc ->> 'locality', (loc ->> 'display_order')::int);
  END LOOP;

  -- enc_reach_for (approved row count from packet; see ENCYCLOPEDIA-CONTENT-FIELDS.md)
  FOR reach IN SELECT * FROM jsonb_array_elements(packet -> 'enc_reach_for') LOOP
    INSERT INTO enc_reach_for (stone_id, label, description, display_order)
    VALUES (v_stone_id, reach ->> 'label', reach ->> 'description', (reach ->> 'display_order')::int);
  END LOOP;

  -- enc_themes
  FOR theme IN SELECT * FROM jsonb_array_elements(packet -> 'enc_themes') LOOP
    INSERT INTO enc_themes (stone_id, tier, title, description, icon_slug, display_order)
    VALUES (
      v_stone_id,
      theme ->> 'tier',
      theme ->> 'title',
      theme ->> 'description',
      theme ->> 'icon_slug',
      (theme ->> 'display_order')::int
    );
  END LOOP;

  -- enc_collector_notes (3 or 4 rows)
  FOR note IN SELECT * FROM jsonb_array_elements(packet -> 'enc_collector_notes') LOOP
    INSERT INTO enc_collector_notes (stone_id, title, body, icon_slug, display_order)
    VALUES (
      v_stone_id,
      note ->> 'title',
      note ->> 'body',
      note ->> 'icon_slug',
      (note ->> 'display_order')::int
    );
  END LOOP;

  -- enc_care (exactly 4 rows)
  FOR care_row IN SELECT * FROM jsonb_array_elements(packet -> 'enc_care') LOOP
    INSERT INTO enc_care (stone_id, category, body, display_order)
    VALUES (
      v_stone_id,
      care_row ->> 'category',
      care_row ->> 'body',
      (care_row ->> 'display_order')::int
    );
  END LOOP;

  -- enc_related_stones (exactly 4 rows, "group" is a reserved word — quoted)
  FOR rs IN SELECT * FROM jsonb_array_elements(packet -> 'enc_related_stones') LOOP
    INSERT INTO enc_related_stones (stone_id, "group", related_slug, related_name, reason, display_order)
    VALUES (
      v_stone_id,
      rs ->> 'group',
      rs ->> 'related_slug',
      rs ->> 'related_name',
      rs ->> 'reason',
      (rs ->> 'display_order')::int
    );
  END LOOP;

  RETURN jsonb_build_object(
    'success', true,
    'stone_id', v_stone_id,
    'stone_name', packet -> 'meta' ->> 'stone_name',
    'published', v_published,
    'production_status', v_production_status
  );

EXCEPTION WHEN OTHERS THEN
  -- The entire transaction rolls back. Re-raise so the caller sees the error.
  RAISE;
END;
$function$
