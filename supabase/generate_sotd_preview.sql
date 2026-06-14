-- ─────────────────────────────────────────────────────────────────────────────
-- SOTD Preview Generator — Still Point Lapidary
-- Deploy: paste into Supabase SQL editor and run.
-- Prerequisite: sotd_pick_stone.sql must be deployed first.
--
-- Purpose:
--   Generates a forward-looking preview of stone-of-the-day assignments for a
--   date range.  Does NOT write to any table.  Returns a row per calendar date
--   describing either an existing committed entry or a newly generated candidate.
--
-- Behaviour per date in [p_start, p_end]:
--   1. DB history row exists             → row_status = 'existing_history'   (read-only)
--   2. Active schedule row exists        → row_status = 'existing_schedule'
--                                          or 'existing_editorial' if event_name set
--   3. Date present in p_locked_rows     → row_status = 'generated'  (passed through)
--   4. Otherwise                         → row_status = 'generated'  (newly selected)
--
-- Existing rows (1 and 2) are never overwritten.  They participate in the
-- sequence-quality context so surrounding generated dates respect them.
--
-- Locked rows (p_locked_rows) are emitted unchanged and also participate in the
-- sequence context, so the generator respects them when selecting nearby dates.
--
-- Context rows (p_context_rows) are unsaved preview rows from the caller (used
-- only when rerolling a single date in a bulk preview).  They are never emitted
-- but are included in the sequence context and cooldown tracking.
--
-- Parameters:
--   p_start            First date of the range (inclusive).
--   p_end              Last date of the range (inclusive).
--   p_include_no_photo When true: photo filter is lifted (all SOTD-enabled stones
--                      are candidates regardless of photo presence).
--   p_photo_stone_ids  Array of stone IDs that have encyclopedia photos.
--                      Always pass Object.keys(ENCYCLOPEDIA_PHOTOS) from the client.
--                      Used for has_photo output even when p_include_no_photo = true.
--   p_locked_rows      [{date,stone_id}] — Locked preview entries within range.
--                      Emitted as-is; included in sequence context.
--   p_context_rows     [{date,stone_id}] — Other preview entries (not emitted).
--                      Used as context for single-date reroll calls.
--   p_exclude_stone_id Hard-exclude this stone from generation (reroll exclusion).
--   p_nonce            Integer nonce; increment for different results on re-calls.
--                      Nonce 0 = initial generation.
--
-- Returns one row per date in [p_start, p_end], ordered by feature_date.
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.generate_sotd_preview(
  p_start            date,
  p_end              date,
  p_include_no_photo boolean  default false,
  p_photo_stone_ids  text[]   default null,
  p_locked_rows      jsonb    default '[]',
  p_context_rows     jsonb    default '[]',
  p_exclude_stone_id text     default null,
  p_nonce            integer  default 0
)
returns table (
  feature_date   date,
  stone_id       text,
  tier           integer,
  primary_chakra text,
  has_photo      boolean,
  row_status     text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_date         date;
  v_stone_id     text;
  v_seed         bigint;
  v_seed2        bigint;
  v_row_status   text;

  -- Stone attributes for the currently processed date
  v_cur_fam      text;
  v_cur_qtz      boolean;
  v_cur_color    text;
  v_cur_chakra   text;
  v_cur_tier     integer;

  -- Soft-filter context: last 3 processed entries, most-recent-first.
  -- Parallel arrays; element [1] is the most recent.
  v_prev_dates   date[]    := array[]::date[];
  v_prev_fams    text[]    := array[]::text[];
  v_prev_qtzes   boolean[] := array[]::boolean[];
  v_prev_colors  text[]    := array[]::text[];
  v_prev_chakras text[]    := array[]::text[];
  v_prev_tiers   integer[] := array[]::integer[];

  -- Context arrays passed to _sotd_pick_stone
  v_ctx_family   text;
  v_ctx_is_qtz   boolean;
  v_ctx_colors   text[];
  v_ctx_chakras  text[];
  v_ctx_tiers    integer[];

  -- Preview-only accumulator [{date,stone_id}] for cooldown + protection in helper.
  -- Contains all unsaved entries: locked_rows + context_rows + generated rows.
  v_preview_acc  jsonb := '[]'::jsonb;

  -- Locked-row lookup map (date text → stone_id text) for O(1) iteration lookup
  v_locked_map   jsonb := '{}'::jsonb;

  -- Photo filter applied to _sotd_pick_stone (null when p_include_no_photo = true)
  v_photo_ids    text[];

  -- Schedule lookup
  v_sched_stone  text;
  v_sched_event  text;

  r record;
begin

  -- ── Input validation ───────────────────────────────────────────────────────
  if p_start > p_end then
    raise exception 'generate_sotd_preview: p_start must be <= p_end';
  end if;
  if extract(year from p_start)::int < 2020 or extract(year from p_end)::int > 2040 then
    raise exception
      'generate_sotd_preview: dates must be in range 2020–2040, got % – %',
      p_start, p_end;
  end if;

  -- ── Effective photo filter ─────────────────────────────────────────────────
  -- v_photo_ids is the filter passed to _sotd_pick_stone.
  -- has_photo in the output always uses p_photo_stone_ids directly so the caller
  -- can see which stones have photos even when the filter is lifted.
  v_photo_ids := case when p_include_no_photo then null else p_photo_stone_ids end;

  -- ── Build locked-row lookup map ───────────────────────────────────────────
  select coalesce(jsonb_object_agg(lr ->> 'date', lr ->> 'stone_id'), '{}')
  into   v_locked_map
  from   jsonb_array_elements(p_locked_rows) lr;

  -- ── Initialise preview accumulator with locked + context rows ─────────────
  -- These unsaved entries must influence cooldown and editorial protection for
  -- all dates generated in this call.
  select coalesce(jsonb_agg(entry), '[]')
  into   v_preview_acc
  from (
    select jsonb_build_object('date', lr ->> 'date', 'stone_id', lr ->> 'stone_id') as entry
    from   jsonb_array_elements(p_locked_rows) lr
    union all
    select jsonb_build_object('date', cr ->> 'date', 'stone_id', cr ->> 'stone_id')
    from   jsonb_array_elements(p_context_rows) cr
  ) t;

  -- ── Prime soft-filter context from entries immediately before p_start ──────
  -- Merge DB history with any context/locked rows that fall before p_start
  -- (relevant for single-date reroll where context_rows may include preceding
  -- preview dates that are in the future and therefore absent from DB history).
  for r in (
    with pre_src as (
      -- DB history for the 3 days before p_start
      select h.feature_date as dt, h.stone_id as sid, 1 as prio
      from   public.stone_of_day_history h
      where  h.feature_date >= p_start - 3
        and  h.feature_date <  p_start
      union all
      -- Unsaved context rows before p_start (single-date reroll scenario)
      select (cr ->> 'date')::date, cr ->> 'stone_id', 0
      from   jsonb_array_elements(p_context_rows) cr
      where  (cr ->> 'date')::date >= p_start - 3
        and  (cr ->> 'date')::date <  p_start
      union all
      -- Locked rows before p_start (defensive; shouldn't normally occur)
      select (lr ->> 'date')::date, lr ->> 'stone_id', 0
      from   jsonb_array_elements(p_locked_rows) lr
      where  (lr ->> 'date')::date >= p_start - 3
        and  (lr ->> 'date')::date <  p_start
    ),
    deduped as (
      -- For each date, prefer unsaved (prio 0) over DB history (prio 1)
      select distinct on (dt) dt, sid
      from   pre_src
      order  by dt, prio asc
    )
    select  d.dt,
            s.family,
            lower(coalesce(s.family, '')) like '%quartz%' as is_qtz,
            s.color_categories[1]                         as dominant_color,
            s.primary_chakra,
            s.collection_tier
    from    deduped d
    join    public.stones s on s.id = d.sid
    order   by d.dt desc   -- most recent first so array_append gives [recent, older, oldest]
    limit   3
  ) loop
    v_prev_dates   := array_append(v_prev_dates,  r.dt);
    v_prev_fams    := array_append(v_prev_fams,   r.family);
    v_prev_qtzes   := array_append(v_prev_qtzes,  r.is_qtz);
    v_prev_colors  := array_append(v_prev_colors, r.dominant_color);
    v_prev_chakras := array_append(v_prev_chakras,r.primary_chakra);
    v_prev_tiers   := array_append(v_prev_tiers,  r.collection_tier);
  end loop;

  -- ── Iterate every calendar date in [p_start, p_end] ───────────────────────
  v_date := p_start;
  loop
    exit when v_date > p_end;

    -- Reset per-date working vars
    v_stone_id    := null;
    v_row_status  := null;
    v_sched_stone := null;
    v_sched_event := null;
    v_cur_fam     := null;
    v_cur_qtz     := false;
    v_cur_color   := null;
    v_cur_chakra  := null;
    v_cur_tier    := null;

    -- ── A. History check ──────────────────────────────────────────────────
    select h.stone_id into v_stone_id
    from   public.stone_of_day_history h
    where  h.feature_date = v_date;

    if found then
      v_row_status := 'existing_history';
    end if;

    -- ── B. Active schedule check (only when no history row) ───────────────
    if v_stone_id is null then
      select sc.stone_id, sc.event_name
      into   v_sched_stone, v_sched_event
      from   public.stone_of_day_schedule sc
      where  sc.feature_date = v_date
        and  sc.is_active    = true
      order  by sc.event_priority asc nulls last, sc.stone_id
      limit  1;

      if found then
        v_stone_id   := v_sched_stone;
        v_row_status := case
          when v_sched_event is not null and v_sched_event <> ''
          then 'existing_editorial'
          else 'existing_schedule'
        end;
      end if;
    end if;

    -- ── C. Locked-row pass-through (only when no DB entry) ────────────────
    if v_stone_id is null then
      v_stone_id := v_locked_map ->> v_date::text;
      if v_stone_id is not null then
        v_row_status := 'generated';
        -- Already in v_preview_acc from initialisation; no need to add again.
      end if;
    end if;

    -- ── D. Generate ───────────────────────────────────────────────────────
    if v_stone_id is null then
      -- Build context arrays from the 3 most-recent preceding entries.
      -- Family/quartz check: only apply when the immediately preceding entry
      -- is exactly v_date - 1 (matching the daily resolver's behaviour).
      if array_length(v_prev_dates, 1) > 0 and v_prev_dates[1] = v_date - 1 then
        v_ctx_family := coalesce(v_prev_fams[1],  '');
        v_ctx_is_qtz := coalesce(v_prev_qtzes[1], false);
      else
        v_ctx_family := '';
        v_ctx_is_qtz := false;
      end if;
      v_ctx_colors  := v_prev_colors[1:2];
      v_ctx_chakras := v_prev_chakras[1:2];
      v_ctx_tiers   := v_prev_tiers[1:3];

      -- Nonce-seeded determinism.  Nonce 0 = initial generation.
      -- Incrementing the nonce on reroll guarantees a different seed path even
      -- if the context arrays are identical.
      v_seed  := (hashtext(v_date::text || ':gen:'  || p_nonce::text) & 2147483647)::bigint;
      v_seed2 := (hashtext(v_date::text || ':gen2:' || p_nonce::text) & 2147483647)::bigint;

      v_stone_id := public._sotd_pick_stone(
        v_date,
        v_seed,
        v_seed2,
        v_ctx_family,
        v_ctx_is_qtz,
        v_ctx_colors,
        v_ctx_chakras,
        v_ctx_tiers,
        v_photo_ids,
        v_preview_acc,      -- covers both cooldown (past) and protection (future ≤14d)
        p_exclude_stone_id
      );

      -- Emergency fallback: Clear Quartz
      if v_stone_id is null then
        v_stone_id := 'C-0105';
      end if;

      v_row_status := 'generated';

      -- Append to preview accumulator so future dates in this call see it
      -- for cooldown and editorial-protection purposes.
      v_preview_acc := v_preview_acc
        || jsonb_build_array(
             jsonb_build_object('date', v_date::text, 'stone_id', v_stone_id)
           );
    end if;

    -- ── E. Resolve stone attributes for output and context update ─────────
    select s.family,
           lower(coalesce(s.family, '')) like '%quartz%',
           s.color_categories[1],
           s.primary_chakra,
           s.collection_tier
    into   v_cur_fam, v_cur_qtz, v_cur_color, v_cur_chakra, v_cur_tier
    from   public.stones s
    where  s.id = v_stone_id;

    -- ── F. Emit row ───────────────────────────────────────────────────────
    feature_date   := v_date;
    stone_id       := v_stone_id;
    tier           := v_cur_tier;
    primary_chakra := v_cur_chakra;
    -- has_photo always reflects actual photo availability regardless of filter
    has_photo      := (p_photo_stone_ids is not null
                       and v_stone_id = any(p_photo_stone_ids));
    row_status     := v_row_status;
    return next;

    -- ── G. Advance soft-filter context arrays (prepend, keep newest 3) ────
    v_prev_dates   := (array_prepend(v_date,    v_prev_dates  ))[1:3];
    v_prev_fams    := (array_prepend(v_cur_fam,  v_prev_fams  ))[1:3];
    v_prev_qtzes   := (array_prepend(v_cur_qtz,  v_prev_qtzes ))[1:3];
    v_prev_colors  := (array_prepend(v_cur_color, v_prev_colors))[1:3];
    v_prev_chakras := (array_prepend(v_cur_chakra,v_prev_chakras))[1:3];
    v_prev_tiers   := (array_prepend(v_cur_tier,  v_prev_tiers ))[1:3];

    v_date := v_date + 1;
  end loop;

end;
$$;

-- ── Access control ─────────────────────────────────────────────────────────
grant execute on function public.generate_sotd_preview(
  date, date, boolean, text[], jsonb, jsonb, text, integer
) to authenticated;
