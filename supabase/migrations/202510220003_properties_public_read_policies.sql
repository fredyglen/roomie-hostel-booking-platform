-- Public read policy for properties so students can see verified, available listings
-- Ensure required columns exist first (idempotent)

-- Add status/visibility columns used by UI filters and policies
alter table if exists public.properties
  add column if not exists is_available boolean default false,
  add column if not exists verification_status text default 'pending' check (verification_status in ('pending','verified','rejected','suspended')),
  add column if not exists deleted_at timestamptz;

-- Enable RLS (safe if already enabled)
alter table if exists public.properties enable row level security;

-- Allow public (anon/authenticated) to read only verified & available properties
-- Policies are OR'ed; admin policies exist separately in admin_properties_policies migration

drop policy if exists "Public can read verified available properties" on public.properties;
create policy "Public can read verified available properties"
  on public.properties
  for select
  using (
    coalesce(is_available, false) = true
    and coalesce(verification_status, 'pending') = 'verified'
    and deleted_at is null
  );

-- Helpful index to support common filters
create index if not exists idx_properties_availability on public.properties(is_available, verification_status);
