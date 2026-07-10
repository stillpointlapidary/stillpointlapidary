-- Add Stone of the Day redesign fields to stones (5-stone pilot)
-- These are additive and do not remove or alter any existing column.
-- sotd_essence / sotd_energy_label / sotd_question / sotd_worth_noticing are
-- new display content. sotd_review_status / sotd_review_source / sotd_reviewed_at
-- are pilot bookkeeping fields, not rendered publicly.
ALTER TABLE public.stones
  ADD COLUMN IF NOT EXISTS sotd_essence          text,
  ADD COLUMN IF NOT EXISTS sotd_energy_label      text,
  ADD COLUMN IF NOT EXISTS sotd_question          text,
  ADD COLUMN IF NOT EXISTS sotd_worth_noticing    text,
  ADD COLUMN IF NOT EXISTS sotd_review_status     text,
  ADD COLUMN IF NOT EXISTS sotd_review_source     text,
  ADD COLUMN IF NOT EXISTS sotd_reviewed_at        timestamptz;
