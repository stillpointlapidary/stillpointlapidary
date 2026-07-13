-- Add dedicated Quick View Overview field to stones (Quick View stabilization)
-- Additive only. Available for all 333 roster stones, independent of full-entry
-- publication state. Not a replacement for enc_stone_content.overview_p1/overview_p2,
-- and not a Production Master field. Does not populate any row.
ALTER TABLE public.stones
  ADD COLUMN IF NOT EXISTS quick_view_overview text;

COMMENT ON COLUMN public.stones.quick_view_overview IS
  'Compact metaphysical summary (~40-65 words) rendered only by the Quick View drawer. Approval source: Encyclopedia/Research/Cohorts/quick-view-stabilization/quick-view-overview-copy.md. Not the full-entry Overview (enc_stone_content.overview_p1/overview_p2) and not a Production Master field.';
