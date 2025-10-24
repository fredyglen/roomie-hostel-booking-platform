-- Ensure property_verifications.verification_type is nullable and has a sane default
-- Idempotent and safe to run multiple times
begin;

-- 1) Make column nullable (if it exists and is NOT NULL somewhere)
alter table if exists public.property_verifications
  alter column verification_type drop not null;

-- 2) Set default to 'standard' for future inserts
alter table if exists public.property_verifications
  alter column verification_type set default 'standard';

-- 3) Backfill any existing nulls to avoid future surprises
update public.property_verifications
  set verification_type = 'standard'
  where verification_type is null;

commit;

