-- Stone of the Day schedule for Still Point Lapidary.
-- Run this in the Supabase SQL editor.
--
-- Note: this project uses public stone IDs like C-0119, so stone_id is text
-- to match stones.id.

create table if not exists public.stone_of_day_schedule (
  id uuid primary key default gen_random_uuid(),
  stone_id text not null references public.stones(id) on delete cascade,
  feature_date date not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists stone_of_day_schedule_active_date_idx
  on public.stone_of_day_schedule (feature_date)
  where is_active = true;

alter table public.stone_of_day_schedule enable row level security;

drop policy if exists "Stone of day schedule is publicly readable"
  on public.stone_of_day_schedule;

create policy "Stone of day schedule is publicly readable"
  on public.stone_of_day_schedule
  for select
  using (is_active = true);

-- Admin write access for the admin-only SOTD Calendar UI (encyclopedia.js:
-- _sotdCalSaveSchedule, _sotdCalDeleteSchedule, and the approve_sotd_preview
-- RPC all rely on this policy for insert/update/delete).
-- Email list must match ADMIN_EMAILS in app.js exactly.
drop policy if exists "Admins can manage schedule"
  on public.stone_of_day_schedule;

create policy "Admins can manage schedule"
  on public.stone_of_day_schedule
  for all
  to authenticated
  using (
    lower(auth.jwt() ->> 'email') = any (array[
      'kikiholz31@duck.com',
      'christieholzwarth@gmail.com',
      'dustin@stillpointdfw.com'
    ])
  )
  with check (
    lower(auth.jwt() ->> 'email') = any (array[
      'kikiholz31@duck.com',
      'christieholzwarth@gmail.com',
      'dustin@stillpointdfw.com'
    ])
  );

-- Optional convenience function for simple database-side schedule generation.
-- This prioritizes collection Tier 1, then the rest.
-- For image-aware scheduling, use generate_stone_of_day_seed.js instead.
create or replace function public.generate_stone_of_day_schedule(
  start_date date default current_date,
  day_count integer default 90
) returns integer
language plpgsql
security definer
as $$
declare
  inserted_count integer;
begin
  with dates as (
    select (start_date + offs)::date as feature_date, offs
    from generate_series(0, greatest(day_count - 1, 0)) as offs
  ),
  ranked_stones as (
    select
      id as stone_id,
      row_number() over (
        order by
          case when coalesce(collection_tier, 99) in (0, 1) then 0 else 1 end,
          coalesce(collection_tier, 99),
          name,
          id
      ) - 1 as rn,
      count(*) over () as total_count
    from public.stones
  )
  insert into public.stone_of_day_schedule (stone_id, feature_date)
  select rs.stone_id, d.feature_date
  from dates d
  join ranked_stones rs on rs.rn = mod(d.offs, rs.total_count)
  on conflict (feature_date) do nothing;

  get diagnostics inserted_count = row_count;
  return inserted_count;
end;
$$;

-- Example:
-- select public.generate_stone_of_day_schedule(current_date, 90);
