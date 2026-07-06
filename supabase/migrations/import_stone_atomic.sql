-- Atomic stone import function for the Cohort 4 pipeline.
-- Called via Supabase RPC: supabase.rpc('import_stone_atomic', { packet: ... })
-- All statements execute in a single transaction (the one the function call
-- itself runs in). If any statement fails, the entire stone rolls back at
-- the database level — no partial writes.
--
-- Publication: default Gate 4 behavior is to import AND publish in the same
-- controlled pass (ENCYCLOPEDIA-PRODUCTION-WORKFLOW.md §2, §11; CLAUDE.md §6
-- Gate 4). published is taken from packet.enc_stone_content.published, which
-- pipeline/generate-packet.js sets to true by default and to false only when
-- --hold was passed for an explicit Christie/Dustin-requested unpublished
-- hold. If the packet omits the field, this function defaults to true rather
-- than silently holding a stone back.
--
-- Gate 4 step 8 (CLAUDE.md §6) also requires stones.enc_production_status to
-- move to 'Full Entry Live' in the same pass. This function sets it together
-- with enc_stone_content.published, driven by the same v_published flag:
-- 'Full Entry Live' when publishing, 'Supabase Entered' (an imported,
-- unpublished state — ENCYCLOPEDIA-CONTENT-FIELDS.md §17) for an explicit
-- unpublished hold. Both fields must never disagree about publish state.
--
-- Create-or-update path (2026-07-06): ENCYCLOPEDIA-DATABASE-REFERENCE.md §12
-- requires the atomic importer to "create or update the parent row and all
-- child rows together." A first-time stone_id (no existing enc_stone_content
-- row) inserts, as before. A previously-imported or previously-live stone_id
-- (existing row — a correction or a Gate-6-driven reimport) now updates the
-- parent row in place and fully resynchronizes every child table instead of
-- raising "row already exists. Use the update path." Child tables are
-- resynchronized by deleting this stone_id's rows and reinserting from the
-- packet — a no-op delete on a first-time import, and on an update it
-- guarantees no stale/orphaned child row from a prior import survives
-- (§12, §15 "no orphaned child rows"). Everything below still executes
-- inside the one transaction the function call runs in, so a failure at any
-- point (parent or any child table) rolls back the parent write and every
-- child table together — the stone is either fully updated/inserted or left
-- exactly as it was.

CREATE OR REPLACE FUNCTION import_stone_atomic(packet jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_stone_id           text;
  v_slug               text;
  v_sc                 jsonb;
  v_published          boolean;
  v_production_status  text;
  v_is_update          boolean;
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

  v_is_update := EXISTS (SELECT 1 FROM enc_stone_content WHERE stone_id = v_stone_id);

  IF v_is_update THEN
    UPDATE enc_stone_content SET
      slug                 = v_sc ->> 'slug',
      collection_label     = v_sc ->> 'collection_label',
      signature_line       = v_sc ->> 'signature_line',
      pill_1               = v_sc ->> 'pill_1',
      pill_2               = v_sc ->> 'pill_2',
      pill_3               = v_sc ->> 'pill_3',
      best_for             = v_sc ->> 'best_for',
      use_when             = v_sc ->> 'use_when',
      affirmation          = v_sc ->> 'affirmation',
      image_alt            = v_sc ->> 'image_alt',
      overview_p1          = v_sc ->> 'overview_p1',
      overview_p2          = v_sc ->> 'overview_p2',
      formation            = v_sc ->> 'formation',
      collector_context_p1 = v_sc ->> 'collector_context_p1',
      collector_context_p2 = v_sc ->> 'collector_context_p2',
      collector_context_p3 = v_sc ->> 'collector_context_p3',
      collector_context_p4 = v_sc ->> 'collector_context_p4',
      collector_context_p5 = v_sc ->> 'collector_context_p5',
      chakra_primary       = v_sc ->> 'chakra_primary',
      chakra_secondary     = v_sc ->> 'chakra_secondary',
      element              = v_sc ->> 'element',
      zodiac               = v_sc ->> 'zodiac',
      material_type        = v_sc ->> 'material_type',
      energetic_role       = v_sc ->> 'energetic_role',
      energetic_role_icon  = v_sc ->> 'energetic_role_icon',
      color_energy         = v_sc ->> 'color_energy',
      nav_prev_slug        = v_sc ->> 'nav_prev_slug',
      nav_prev_name        = v_sc ->> 'nav_prev_name',
      nav_next_slug        = v_sc ->> 'nav_next_slug',
      nav_next_name        = v_sc ->> 'nav_next_name',
      published            = v_published,
      updated_at           = now()
    WHERE stone_id = v_stone_id;
  ELSE
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
  END IF;

  -- Gate 4 step 8: move the roster status in lockstep with published, in the
  -- same transaction, so the two fields can never disagree.
  UPDATE stones
  SET enc_production_status = v_production_status
  WHERE id = v_stone_id;

  -- Child tables: full delete-then-reinsert sync from the packet, for both
  -- the first-time-insert and update paths. The delete is a no-op when
  -- nothing exists yet (first-time import) and, on an update, guarantees no
  -- stale or orphaned child row survives from a prior import.

  -- enc_mineral_facts (exactly 8 rows)
  DELETE FROM enc_mineral_facts WHERE stone_id = v_stone_id;
  FOR fact IN SELECT * FROM jsonb_array_elements(packet -> 'enc_mineral_facts') LOOP
    INSERT INTO enc_mineral_facts (stone_id, label, value, display_order)
    VALUES (v_stone_id, fact ->> 'label', fact ->> 'value', (fact ->> 'display_order')::int);
  END LOOP;

  -- enc_localities
  DELETE FROM enc_localities WHERE stone_id = v_stone_id;
  FOR loc IN SELECT * FROM jsonb_array_elements(packet -> 'enc_localities') LOOP
    INSERT INTO enc_localities (stone_id, locality, display_order)
    VALUES (v_stone_id, loc ->> 'locality', (loc ->> 'display_order')::int);
  END LOOP;

  -- enc_reach_for (approved row count from packet; see ENCYCLOPEDIA-CONTENT-FIELDS.md)
  DELETE FROM enc_reach_for WHERE stone_id = v_stone_id;
  FOR reach IN SELECT * FROM jsonb_array_elements(packet -> 'enc_reach_for') LOOP
    INSERT INTO enc_reach_for (stone_id, label, description, display_order)
    VALUES (v_stone_id, reach ->> 'label', reach ->> 'description', (reach ->> 'display_order')::int);
  END LOOP;

  -- enc_themes
  DELETE FROM enc_themes WHERE stone_id = v_stone_id;
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
  DELETE FROM enc_collector_notes WHERE stone_id = v_stone_id;
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
  DELETE FROM enc_care WHERE stone_id = v_stone_id;
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
  DELETE FROM enc_related_stones WHERE stone_id = v_stone_id;
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
    'operation', CASE WHEN v_is_update THEN 'update' ELSE 'insert' END,
    'stone_id', v_stone_id,
    'stone_name', packet -> 'meta' ->> 'stone_name',
    'published', v_published,
    'production_status', v_production_status
  );

EXCEPTION WHEN OTHERS THEN
  -- The entire transaction rolls back. Re-raise so the caller sees the error.
  RAISE;
END;
$$;

-- Grant execute to the authenticated role so the Supabase client can call it.
-- Adjust role if using anon or a custom role.
GRANT EXECUTE ON FUNCTION import_stone_atomic(jsonb) TO authenticated;
