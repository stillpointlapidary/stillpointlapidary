-- ─────────────────────────────────────────────────────────────────────────────
-- SOTD Calendar Month Reader — Still Point Lapidary
-- Deploy: paste into Supabase SQL editor and run.
--
-- Purpose:
--   Returns one normalized row per populated date in a requested calendar month,
--   merging stone_of_day_history (resolved dates, source of truth) with active
--   rows from stone_of_day_schedule (future editorial dates).
--
-- Rules:
--   • History always owns the stone_id for any date present in both tables.
--   • Schedule event metadata fills nulls in history rows but never overrides.
--   • Ordinary unresolved future dates are absent — nothing is resolved or written.
--   • This function is read-only. It never calls get_stone_of_day or writes rows.
--
-- Supported year range: 2020–2040
--   History exists from site launch onward; the editorial schedule currently
--   runs through 2029. 2040 provides comfortable headroom for future seasons.
--
-- Duplicate schedule protection:
--   stone_of_day_schedule has feature_date UNIQUE in the repository schema.
--   The live table has been confirmed to have the same constraint (182 rows,
--   no duplicates found). DISTINCT ON is used defensively regardless.
--   If multiple active rows exist for one date, the row with the lowest
--   event_priority is chosen (NULL priority sorts last). stone_id is the
--   stable tiebreaker.
--
-- Security:
--   SECURITY DEFINER lets the function read through RLS on both SOTD tables
--   without granting anon/authenticated any direct SELECT access.
--   search_path is pinned to public to prevent search-path hijacking.
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.get_sotd_calendar_month(
  p_year  integer,
  p_month integer
)
returns table (
  feature_date   date,
  stone_id       text,
  source         text,
  selection_type text,
  event_name     text,
  event_category text,
  event_priority integer,
  event_location text,
  editorial_note text,
  source_url     text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_first date;
  v_next  date;   -- exclusive upper bound: first day of following month
begin

  -- ── Input validation ───────────────────────────────────────────────────────
  if p_month < 1 or p_month > 12 then
    raise exception
      'get_sotd_calendar_month: p_month must be 1–12, got %', p_month;
  end if;

  if p_year < 2020 or p_year > 2040 then
    raise exception
      'get_sotd_calendar_month: p_year must be 2020–2040, got %', p_year;
  end if;

  -- ── Date range (server-side, no browser timezone involved) ─────────────────
  v_first := make_date(p_year, p_month, 1);
  v_next  := v_first + interval '1 month';

  -- ── Main query ─────────────────────────────────────────────────────────────
  return query
  with

  -- Deduplicate active schedule rows by date.
  -- Lowest event_priority wins (higher editorial urgency); stone_id breaks ties.
  sched as (
    select distinct on (sc.feature_date)
      sc.feature_date,
      sc.stone_id,
      sc.selection_type,
      sc.event_name,
      sc.event_category,
      sc.event_priority,
      sc.event_location,
      sc.editorial_note,
      sc.source_url
    from   public.stone_of_day_schedule sc
    where  sc.feature_date >= v_first
      and  sc.feature_date <  v_next
      and  sc.is_active    = true
    order  by sc.feature_date,
              sc.event_priority asc nulls last,
              sc.stone_id
  ),

  -- History rows for the month.
  hist as (
    select
      h.feature_date,
      h.stone_id,
      h.selection_type,
      h.event_name,
      h.event_category,
      h.event_location,
      h.editorial_note,
      h.source_url
    from public.stone_of_day_history h
    where h.feature_date >= v_first
      and h.feature_date <  v_next
  )

  -- Dates resolved via history (history stone wins; schedule fills null metadata).
  select
    h.feature_date,
    h.stone_id,
    'history'::text                                     as source,
    coalesce(h.selection_type, sc.selection_type)       as selection_type,
    coalesce(h.event_name,     sc.event_name)           as event_name,
    coalesce(h.event_category, sc.event_category)       as event_category,
    sc.event_priority,            -- history table has no priority column
    coalesce(h.event_location, sc.event_location)       as event_location,
    coalesce(h.editorial_note, sc.editorial_note)       as editorial_note,
    coalesce(h.source_url,     sc.source_url)           as source_url
  from      hist h
  left join sched sc using (feature_date)

  union all

  -- Future editorial dates in schedule only (no history row exists yet).
  select
    sc.feature_date,
    sc.stone_id,
    'schedule'::text   as source,
    sc.selection_type,
    sc.event_name,
    sc.event_category,
    sc.event_priority,
    sc.event_location,
    sc.editorial_note,
    sc.source_url
  from sched sc
  where not exists (
    select 1 from hist h where h.feature_date = sc.feature_date
  )

  order by feature_date;

end;
$$;

-- Only authenticated users may call the calendar reader (calendar is admin-only in the UI).
-- Revoke the previously granted anon permission.
revoke execute on function public.get_sotd_calendar_month(integer, integer)
  from anon;
grant execute on function public.get_sotd_calendar_month(integer, integer)
  to authenticated;
