-- Photo ID Beta: one lightweight row per identification session.
-- Holds session counters (enforced server-side), cost accounting for the monthly
-- budget guard, a salted IP hash for rate limiting, and the analytics fields.
-- Never stores images. qa_history / pending_question are cleared when a session ends.
-- RLS enabled with no policies: only the service role (the photo-id edge function) can read/write.

create table if not exists public.photo_id_sessions (
  id                    uuid primary key default gen_random_uuid(),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  ip_hash               text,
  initial_photo_count   int  not null default 0,
  photo_retry_used      boolean not null default false,
  question_count        int  not null default 0,
  call_count            int  not null default 0,
  est_cost_usd          numeric(10,4) not null default 0,
  status                text not null default 'in_progress',   -- in_progress | final | unresolved
  pending_action        text,                                    -- request_photo | ask_question | null
  pending_question      jsonb,
  qa_history            jsonb,
  identified_material   text,
  encyclopedia_match    boolean,
  confidence            text
);

create index if not exists photo_id_sessions_created_idx on public.photo_id_sessions (created_at);
create index if not exists photo_id_sessions_ip_idx on public.photo_id_sessions (ip_hash, created_at);

alter table public.photo_id_sessions enable row level security;
