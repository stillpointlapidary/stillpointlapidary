-- Add Stone of the Day "Today's Takeaway" field (5-stone pilot layout refinement)
-- Additive only. Does not touch sotd_worth_noticing (kept in the table, just no
-- longer selected/rendered by SOTD) or any other existing column.
ALTER TABLE public.stones
  ADD COLUMN IF NOT EXISTS sotd_takeaway text;
