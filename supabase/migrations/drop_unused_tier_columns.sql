-- Migration: drop unused tier columns from public.stones
--
-- internal_tier   — photo-planning priority field; workflow discontinued.
--                   One row contained a corrupted value ('Tier 1'); all others were null.
--                   All application references removed before this migration.
--
-- public_tier         — never referenced in any application file.
-- public_tier_label   — never referenced in any application file.
--
-- collection_tier is NOT touched. It is the sole active collection classifier.
--
-- Run this in the Supabase SQL editor after deploying the updated application files.

alter table public.stones drop column if exists internal_tier;
alter table public.stones drop column if exists public_tier;
alter table public.stones drop column if exists public_tier_label;
