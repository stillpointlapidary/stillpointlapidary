-- ─────────────────────────────────────────────────────────────────────────────
-- Stone of the Day Resolver — Still Point Lapidary
-- Deploy: paste into Supabase SQL editor and run.
--
-- Resolution order:
--   1. stone_of_day_history (today already decided)   → return immediately
--   2. stone_of_day_schedule (special / curated date) → copy to history, return
--   3. Shared _sotd_pick_stone helper with 5-pass fallback → insert to history, return
--
-- The selection logic (5-pass loop, tier weighting, soft filters) lives in
-- _sotd_pick_stone().  Deploy sotd_pick_stone.sql before this file.
--
-- Exact table schemas used:
--
--   public.stone_of_day_schedule
--     feature_date   date PRIMARY KEY
--     stone_id       text
--     event_name     text
--     event_category text
--     event_priority integer
--     selection_type text
--     event_location text
--     editorial_note text
--     source_url     text
--     is_active      boolean
--     created_at     timestamptz
--     updated_at     timestamptz
--
--   public.stone_of_day_history
--     feature_date   date PRIMARY KEY
--     stone_id       text
--     selection_type text
--     event_name     text
--     event_category text
--     event_location text
--     editorial_note text
--     source_url     text
--     resolved_at    timestamptz   (default set by database)
--
-- Schema notes:
--   • stones.sotd_enabled = true is the SOTD-readiness / active flag.
--   • No photo-approval column exists on stones yet; image filtering is not
--     enforced server-side. Add a boolean column (e.g. sotd_photo_approved)
--     and uncomment the [IMAGE] line below when ready.
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.get_stone_of_day()
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_date          date;
  v_stone_id      text;
  v_sel_type      text;
  v_event_name    text;
  v_event_cat     text;
  v_event_loc     text;
  v_editorial     text;
  v_source_url    text;
  v_seed          bigint;
  v_seed2         bigint;
  v_result        json;

  -- Soft-filter context populated from recent history
  v_yesterday_family text;
  v_yesterday_is_qtz boolean;
  v_last2_colors     text[];
  v_last2_chakras    text[];
  v_last3_tiers      int[];
begin

  -- ── 1. Today in America/Chicago ───────────────────────────────────────────
  v_date := (now() at time zone 'America/Chicago')::date;

  -- ── 2. History check — return immediately if today is already decided ─────
  select h.stone_id,
         h.selection_type,
         h.event_name,
         h.event_category,
         h.event_location,
         h.editorial_note,
         h.source_url
  into   v_stone_id, v_sel_type, v_event_name,
         v_event_cat, v_event_loc, v_editorial, v_source_url
  from   public.stone_of_day_history h
  where  h.feature_date = v_date;

  if found then
    select row_to_json(s) into v_result from (
      select id, name, card_quality_pill, card_summary, card_use_when,
             card_best_for, primary_chakra, card_pair_with, card_note,
             color_hex, collection_tier
      from   public.stones
      where  id = v_stone_id
    ) s;
    return json_build_object(
      'selection_type', v_sel_type,
      'date',           v_date,
      'event_name',     v_event_name,
      'event_category', v_event_cat,
      'event_location', v_event_loc,
      'editorial_note', v_editorial,
      'source_url',     v_source_url,
      'stone',          v_result
    );
  end if;

  -- ── 3. Schedule check — curated / special date ────────────────────────────
  select sched.stone_id,
         sched.selection_type,
         sched.event_name,
         sched.event_category,
         sched.event_location,
         sched.editorial_note,
         sched.source_url
  into   v_stone_id, v_sel_type, v_event_name,
         v_event_cat, v_event_loc, v_editorial, v_source_url
  from   public.stone_of_day_schedule sched
  where  sched.feature_date = v_date
    and  sched.is_active    = true;

  if found then
    -- ── Atomic copy to history — copy all schedule metadata ───────────
    insert into public.stone_of_day_history (
      feature_date, stone_id, selection_type,
      event_name,   event_category, event_location,
      editorial_note, source_url
    )
    values (
      v_date, v_stone_id, v_sel_type,
      v_event_name, v_event_cat, v_event_loc,
      v_editorial, v_source_url
    )
    on conflict (feature_date) do nothing;

    -- Re-read winner — handles a concurrent request that beat us to the insert
    select h.stone_id,
           h.selection_type,
           h.event_name,
           h.event_category,
           h.event_location,
           h.editorial_note,
           h.source_url
    into   v_stone_id, v_sel_type, v_event_name,
           v_event_cat, v_event_loc, v_editorial, v_source_url
    from   public.stone_of_day_history h
    where  h.feature_date = v_date;

    select row_to_json(s) into v_result from (
      select id, name, card_quality_pill, card_summary, card_use_when,
             card_best_for, primary_chakra, card_pair_with, card_note,
             color_hex, collection_tier
      from   public.stones
      where  id = v_stone_id
    ) s;
    return json_build_object(
      'selection_type', v_sel_type,
      'date',           v_date,
      'event_name',     v_event_name,
      'event_category', v_event_cat,
      'event_location', v_event_loc,
      'editorial_note', v_editorial,
      'source_url',     v_source_url,
      'stone',          v_result
    );
  end if;

  -- ── 4. Deterministic grab-bag via shared helper ───────────────────────────
  -- Seeds derived solely from the Chicago date string — no Math.random()
  v_seed  := (hashtext(v_date::text)          & 2147483647)::bigint;
  v_seed2 := (hashtext(v_date::text || ':p2') & 2147483647)::bigint;

  -- Soft-filter context from recent history
  select s.family,
         lower(coalesce(s.family, '')) like '%quartz%'
  into   v_yesterday_family, v_yesterday_is_qtz
  from   public.stone_of_day_history h
  join   public.stones s on s.id = h.stone_id
  where  h.feature_date = v_date - 1;

  select array_agg(s.color_categories[1] order by h.feature_date desc),
         array_agg(s.primary_chakra       order by h.feature_date desc)
  into   v_last2_colors, v_last2_chakras
  from   public.stone_of_day_history h
  join   public.stones s on s.id = h.stone_id
  where  h.feature_date >= v_date - 2
    and  h.feature_date <  v_date;

  select array_agg(s.collection_tier order by h.feature_date desc)
  into   v_last3_tiers
  from   public.stone_of_day_history h
  join   public.stones s on s.id = h.stone_id
  where  h.feature_date >= v_date - 3
    and  h.feature_date <  v_date;

  v_yesterday_family := coalesce(v_yesterday_family, '');
  v_yesterday_is_qtz := coalesce(v_yesterday_is_qtz, false);
  v_last2_colors     := coalesce(v_last2_colors,  array[]::text[]);
  v_last2_chakras    := coalesce(v_last2_chakras, array[]::text[]);
  v_last3_tiers      := coalesce(v_last3_tiers,   array[]::int[]);

  -- Delegate selection to the shared helper.
  -- Daily resolver passes no preview context and no reroll exclusion.
  v_stone_id := public._sotd_pick_stone(
    v_date,
    v_seed,
    v_seed2,
    v_yesterday_family,
    v_yesterday_is_qtz,
    v_last2_colors,
    v_last2_chakras,
    v_last3_tiers,
    null,     -- p_photo_ids: no server-side photo filter in daily resolution
    '[]',     -- p_extra_context: no unsaved preview rows
    null      -- p_exclude_id: no reroll exclusion
  );

  -- ── 5. Emergency fallback: Clear Quartz (C-0105) ─────────────────────────
  if v_stone_id is null then
    v_stone_id := 'C-0105';
    v_sel_type := 'emergency';
  else
    v_sel_type := 'random';
  end if;

  -- ── 6. Atomic insert into history ─────────────────────────────────────────
  insert into public.stone_of_day_history (
    feature_date, stone_id, selection_type,
    event_name, event_category, event_location,
    editorial_note, source_url
  )
  values (
    v_date, v_stone_id, v_sel_type,
    null, null, null,
    null, null
  )
  on conflict (feature_date) do nothing;

  -- Re-read winner (handles concurrent race to this line)
  select h.stone_id,
         h.selection_type
  into   v_stone_id, v_sel_type
  from   public.stone_of_day_history h
  where  h.feature_date = v_date;

  -- ── 7. Return the committed history row ───────────────────────────────────
  select row_to_json(s) into v_result from (
    select id, name, card_quality_pill, card_summary, card_use_when,
           card_best_for, primary_chakra, card_pair_with, card_note,
           color_hex, collection_tier
    from   public.stones
    where  id = v_stone_id
  ) s;
  return json_build_object(
    'selection_type', v_sel_type,
    'date',           v_date,
    'event_name',     null,
    'event_category', null,
    'event_location', null,
    'editorial_note', null,
    'source_url',     null,
    'stone',          v_result
  );
end;
$$;

-- Allow anonymous and authenticated visitors to invoke the resolver
grant execute on function public.get_stone_of_day() to anon, authenticated;
