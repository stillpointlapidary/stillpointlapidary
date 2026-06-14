-- ─────────────────────────────────────────────────────────────────────────────
-- SOTD Preview Approval — Still Point Lapidary
-- Deploy: paste into Supabase SQL editor and run.
--
-- Purpose:
--   Transactional, all-or-nothing insert of an approved preview schedule.
--   Called after Christie reviews and approves the generate_sotd_preview output.
--
-- Rules:
--   • Accepts only generated date/stone pairs (the caller must exclude
--     existing_history / existing_schedule / existing_editorial rows).
--   • Checks every date against stone_of_day_history and the active schedule
--     before writing anything.
--   • If ANY date conflicts (e.g. a row appeared since the preview was generated),
--     the entire batch is rejected and no rows are written.
--   • On success, inserts all rows atomically with:
--       selection_type = 'random'
--       is_active      = true
--       event_*        = null   (no editorial metadata on random rows)
--
-- Input:
--   p_rows  jsonb  — [{date: 'YYYY-MM-DD', stone_id: 'C-XXXX'}, ...]
--
-- Output:
--   jsonb — {inserted: int, conflicts: [{date, reason}, ...]}
--   On conflict: inserted = 0, conflicts = non-empty array.
--   On success:  inserted = N, conflicts = [].
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.approve_sotd_preview(
  p_rows jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_conflicts jsonb := '[]'::jsonb;
  v_count     int   := 0;
  v_date      date;
  v_sid       text;
  r           record;
begin

  -- ── Conflict scan (no writes yet) ─────────────────────────────────────────
  for r in (
    select (row_obj ->> 'date')::date as feature_date,
            row_obj ->> 'stone_id'    as stone_id
    from   jsonb_array_elements(p_rows) row_obj
    order  by 1
  ) loop
    v_date := r.feature_date;
    v_sid  := r.stone_id;

    if exists (
      select 1 from public.stone_of_day_history h
      where  h.feature_date = v_date
    ) then
      v_conflicts := v_conflicts
        || jsonb_build_array(jsonb_build_object(
             'date',   v_date::text,
             'reason', 'Date already in history'
           ));

    elsif exists (
      select 1 from public.stone_of_day_schedule sc
      where  sc.feature_date = v_date
        and  sc.is_active    = true
    ) then
      v_conflicts := v_conflicts
        || jsonb_build_array(jsonb_build_object(
             'date',   v_date::text,
             'reason', 'Date already scheduled'
           ));
    end if;
  end loop;

  -- ── Reject entire batch if any conflict found ──────────────────────────────
  if jsonb_array_length(v_conflicts) > 0 then
    return jsonb_build_object('inserted', 0, 'conflicts', v_conflicts);
  end if;

  -- ── Atomic bulk insert ─────────────────────────────────────────────────────
  insert into public.stone_of_day_schedule (
    stone_id,
    feature_date,
    is_active,
    selection_type,
    event_name,
    event_category,
    event_location,
    editorial_note,
    source_url,
    created_at
  )
  select
    row_obj ->> 'stone_id',
    (row_obj ->> 'date')::date,
    true,
    'random',
    null, null, null, null, null,
    now()
  from jsonb_array_elements(p_rows) row_obj;

  get diagnostics v_count = row_count;

  return jsonb_build_object('inserted', v_count, 'conflicts', '[]'::jsonb);

end;
$$;

-- ── Access control ─────────────────────────────────────────────────────────
grant execute on function public.approve_sotd_preview(jsonb) to authenticated;
