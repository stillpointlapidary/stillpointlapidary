-- ─────────────────────────────────────────────────────────────────────────────
-- Stone of the Day Resolver — Still Point Lapidary
-- Deploy: paste into Supabase SQL editor and run.
--
-- Resolution order:
--   1. stone_of_day_history (today already decided)   → return immediately
--   2. stone_of_day_schedule (special / curated date) → copy to history, return
--   3. Deterministic grab-bag with 5-pass fallback    → insert to history, return
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
  v_tier          int;
  v_pass          int;
  v_use_soft      boolean;
  v_cooldown_days int;
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

  -- ── 4. Schedule check — curated / special date ────────────────────────────
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
    -- ── 5. Atomic copy to history — copy all schedule metadata ───────────
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

  -- ── 6. Deterministic grab-bag ─────────────────────────────────────────────
  -- Seeds derived solely from the Chicago date string — no Math.random()
  v_seed  := (hashtext(v_date::text)          & 2147483647)::bigint;
  v_seed2 := (hashtext(v_date::text || ':p2') & 2147483647)::bigint;

  -- Tier selection: Essentials 25% | Shelf Builders 32% | Collector Favorites 30% | Rare Finds 13%
  if    (v_seed % 100) <  25 then v_tier := 1;
  elsif (v_seed % 100) <  57 then v_tier := 2;
  elsif (v_seed % 100) <  87 then v_tier := 3;
  else                             v_tier := 4;
  end if;

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

  -- Soft tier override: rotate away from a 4th+ consecutive same tier
  if array_length(v_last3_tiers, 1) = 3
     and v_last3_tiers[1] = v_tier
     and v_last3_tiers[2] = v_tier
     and v_last3_tiers[3] = v_tier
  then
    v_tier := case v_tier when 4 then 1 else v_tier + 1 end;
  end if;

  -- ── 5-pass fallback sequence ──────────────────────────────────────────────
  -- Pass 0: 90-day cooldown + all soft filters
  -- Pass 1: 90-day cooldown, soft filters relaxed
  -- Pass 2: 60-day cooldown, no soft filters
  -- Pass 3: 30-day cooldown, no soft filters
  -- Pass 4:  7-day cooldown, no soft filters
  -- (Emergency Clear Quartz handled after the loop)
  v_stone_id := null;

  for v_pass in 0..4 loop
    v_use_soft      := (v_pass = 0);
    v_cooldown_days := case v_pass
      when 0 then 90
      when 1 then 90
      when 2 then 60
      when 3 then 30
      else        7
    end;

    select id into v_stone_id
    from (
      select s.id,
             row_number() over (order by s.id) as rn,
             count(*)     over ()               as cnt
      from   public.stones s
      where
        -- Hard: SOTD-ready
        s.sotd_enabled    = true
        -- Hard: required card content
        and s.card_summary    is not null
        and s.card_best_for   is not null
        and s.primary_chakra  is not null
        -- [IMAGE] and s.sotd_photo_approved = true
        -- Hard: tier match (determined by seed above)
        and s.collection_tier = v_tier
        -- Hard: cooldown (covers yesterday automatically)
        and not exists (
          select 1
          from   public.stone_of_day_history h
          where  h.stone_id     = s.id
            and  h.feature_date >= v_date - v_cooldown_days
            and  h.feature_date <  v_date
        )
        -- Hard: protect stones scheduled for a special date within 14 days
        and not exists (
          select 1
          from   public.stone_of_day_schedule sc
          where  sc.stone_id     = s.id
            and  sc.feature_date >  v_date
            and  sc.feature_date <= v_date + 14
            and  sc.is_active    = true
        )
        -- Soft: avoid same family on consecutive ordinary days
        and (not v_use_soft
             or v_yesterday_family = ''
             or coalesce(s.family, '') <> v_yesterday_family)
        -- Soft: avoid same dominant color more than twice in a row
        and (not v_use_soft
             or array_length(v_last2_colors, 1) < 2
             or v_last2_colors[1] is distinct from v_last2_colors[2]
             or s.color_categories[1] is distinct from v_last2_colors[1])
        -- Soft: avoid same primary chakra more than twice in a row
        and (not v_use_soft
             or array_length(v_last2_chakras, 1) < 2
             or v_last2_chakras[1] is distinct from v_last2_chakras[2]
             or s.primary_chakra is distinct from v_last2_chakras[1])
        -- Soft: avoid quartz-family stones on consecutive ordinary days
        and (not v_use_soft
             or not v_yesterday_is_qtz
             or lower(coalesce(s.family, '')) not like '%quartz%')
    ) sub
    -- cnt > 0 guard prevents evaluation when no candidates exist
    where cnt > 0 and rn = (v_seed2 % cnt)::int + 1;

    exit when v_stone_id is not null;
  end loop;

  -- Emergency fallback: Clear Quartz (C-0105)
  if v_stone_id is null then
    v_stone_id := 'C-0105';
    v_sel_type := 'emergency';
  else
    v_sel_type := 'random';
  end if;

  -- ── 7. Atomic insert into history ─────────────────────────────────────────
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

  -- ── 8. Return the committed history row ───────────────────────────────────
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
