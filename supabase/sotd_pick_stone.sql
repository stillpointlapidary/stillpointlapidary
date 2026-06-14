-- ─────────────────────────────────────────────────────────────────────────────
-- SOTD Stone Picker — shared internal selection helper
-- Still Point Lapidary
-- Deploy: paste into Supabase SQL editor and run.
--
-- Purpose:
--   Shared 5-pass selection loop used by both get_stone_of_day (daily resolver)
--   and generate_sotd_preview (bulk planning).  A single implementation ensures
--   quality rules never drift between the two paths.
--
-- NOT exposed to any client role.  Called only by other SECURITY DEFINER
-- functions within search_path = public.
--
-- Parameters:
--   p_date            Date being selected for.
--   p_seed            Drives tier selection (p_seed % 100 bucketing).
--   p_seed2           Drives row-within-tier pick (row_number % count).
--   p_ctx_family      Family of the immediately preceding resolved entry.
--   p_ctx_is_qtz      Whether that entry is quartz-family.
--   p_ctx_colors      Dominant colors of the preceding 2 entries, most recent first.
--   p_ctx_chakras     Primary chakras of the preceding 2 entries, most recent first.
--   p_ctx_tiers       Collection tiers of the preceding 3 entries, most recent first.
--   p_photo_ids       null = no photo filter; else restrict candidates to these IDs.
--   p_extra_context   [{stone_id,date}] — preview-only entries (not yet in DB).
--                     Filtered internally for cooldown (looking back) and editorial
--                     protection (looking forward within 14 days).
--   p_exclude_id      Hard-exclude this stone_id from all passes (reroll exclusion).
--
-- Returns:
--   stone_id text — the selected stone, or null if all 5 passes are exhausted.
--   Caller is responsible for the emergency fallback (Clear Quartz C-0105).
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public._sotd_pick_stone(
  p_date           date,
  p_seed           bigint,
  p_seed2          bigint,
  p_ctx_family     text,
  p_ctx_is_qtz     boolean,
  p_ctx_colors     text[],
  p_ctx_chakras    text[],
  p_ctx_tiers      integer[],
  p_photo_ids      text[],
  p_extra_context  jsonb,      -- [{stone_id,date}] preview-generated rows
  p_exclude_id     text        -- hard-exclude for reroll; null = no exclusion
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tier          int;
  v_pass          int;
  v_use_soft      boolean;
  v_cooldown_days int;
  v_stone_id      text;
begin

  -- ── Tier selection (25% T1 / 32% T2 / 30% T3 / 13% T4) ──────────────────
  if    (p_seed % 100) <  25 then v_tier := 1;
  elsif (p_seed % 100) <  57 then v_tier := 2;
  elsif (p_seed % 100) <  87 then v_tier := 3;
  else                             v_tier := 4;
  end if;

  -- ── Tier rotation: avoid a 4th+ consecutive same tier ────────────────────
  if array_length(p_ctx_tiers, 1) = 3
     and p_ctx_tiers[1] = v_tier
     and p_ctx_tiers[2] = v_tier
     and p_ctx_tiers[3] = v_tier
  then
    v_tier := case v_tier when 4 then 1 else v_tier + 1 end;
  end if;

  -- ── 5-pass fallback ───────────────────────────────────────────────────────
  -- Pass 0: 90-day cooldown + all soft filters
  -- Pass 1: 90-day cooldown, soft filters relaxed
  -- Pass 2: 60-day cooldown, no soft filters
  -- Pass 3: 30-day cooldown, no soft filters
  -- Pass 4:  7-day cooldown, no soft filters
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
        -- Hard: SOTD-ready flag
        s.sotd_enabled    = true
        -- Hard: required card content
        and s.card_summary    is not null
        and s.card_best_for   is not null
        and s.primary_chakra  is not null
        -- Hard: tier match
        and s.collection_tier = v_tier
        -- Hard: photo filter (null = no restriction)
        and (p_photo_ids is null or s.id = any(p_photo_ids))
        -- Hard: reroll exclusion
        and (p_exclude_id is null or s.id <> p_exclude_id)
        -- Hard: cooldown from DB history
        and not exists (
          select 1
          from   public.stone_of_day_history h
          where  h.stone_id     = s.id
            and  h.feature_date >= p_date - v_cooldown_days
            and  h.feature_date <  p_date
        )
        -- Hard: cooldown from preview-generated rows (not yet in DB)
        and not exists (
          select 1
          from   jsonb_array_elements(p_extra_context) ec
          where  (ec ->> 'stone_id') = s.id
            and  (ec ->> 'date')::date >= p_date - v_cooldown_days
            and  (ec ->> 'date')::date <  p_date
        )
        -- Hard: protect stones in DB schedule within 14 days forward
        and not exists (
          select 1
          from   public.stone_of_day_schedule sc
          where  sc.stone_id     = s.id
            and  sc.feature_date >  p_date
            and  sc.feature_date <= p_date + 14
            and  sc.is_active    = true
        )
        -- Hard: protect stones in preview future rows within 14 days forward
        and not exists (
          select 1
          from   jsonb_array_elements(p_extra_context) ec
          where  (ec ->> 'stone_id') = s.id
            and  (ec ->> 'date')::date >  p_date
            and  (ec ->> 'date')::date <= p_date + 14
        )
        -- Soft: avoid same family on consecutive entries
        and (not v_use_soft
             or coalesce(p_ctx_family, '') = ''
             or coalesce(s.family, '')     <> p_ctx_family)
        -- Soft: avoid same dominant color more than twice running
        and (not v_use_soft
             or array_length(p_ctx_colors, 1) < 2
             or p_ctx_colors[1] is distinct from p_ctx_colors[2]
             or s.color_categories[1] is distinct from p_ctx_colors[1])
        -- Soft: avoid same primary chakra more than twice running
        and (not v_use_soft
             or array_length(p_ctx_chakras, 1) < 2
             or p_ctx_chakras[1] is distinct from p_ctx_chakras[2]
             or s.primary_chakra is distinct from p_ctx_chakras[1])
        -- Soft: avoid quartz-family on consecutive entries
        and (not v_use_soft
             or not coalesce(p_ctx_is_qtz, false)
             or lower(coalesce(s.family, '')) not like '%quartz%')
    ) sub
    -- cnt > 0 guard prevents modulo-by-zero when no candidates exist
    where cnt > 0 and rn = (p_seed2 % cnt)::int + 1;

    exit when v_stone_id is not null;
  end loop;

  -- Caller handles null → emergency fallback
  return v_stone_id;
end;
$$;

-- ── Access control ─────────────────────────────────────────────────────────
-- Internal only.  Strip the default PUBLIC execute privilege granted at
-- function creation time.  Other SECURITY DEFINER functions call this
-- directly and do not require a client grant.
revoke execute on function public._sotd_pick_stone(
  date, bigint, bigint, text, boolean, text[], text[], integer[],
  text[], jsonb, text
) from public;
