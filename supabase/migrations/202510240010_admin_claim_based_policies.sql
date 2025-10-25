-- Replace recursive admin checks with claim-based checks to avoid RLS recursion
-- Idempotent: drop-and-recreate policies referencing admin role

-- 1) Create claim-based admin checker (no table reads, so no RLS recursion)
create or replace function public.is_admin_claim()
returns boolean
language sql
stable
as $$
  select coalesce(
    (current_setting('request.jwt.claims', true)::jsonb ->> 'role') in ('supreme_admin','campus_admin'),
    false
  );
$$;

-- 2) property_verifications policies (admin read/update)
alter table if exists public.property_verifications enable row level security;

drop policy if exists "Admins can read all property verifications" on public.property_verifications;
create policy "Admins can read all property verifications"
  on public.property_verifications
  for select
  using ( public.is_admin_claim() );

drop policy if exists "Admins can update all property verifications" on public.property_verifications;
create policy "Admins can update all property verifications"
  on public.property_verifications
  for update
  using ( public.is_admin_claim() )
  with check ( public.is_admin_claim() );

-- 3) bookings_enhanced (analytics)
alter table if exists public.bookings_enhanced enable row level security;

drop policy if exists "Admins can read all bookings_enhanced" on public.bookings_enhanced;
create policy "Admins can read all bookings_enhanced"
  on public.bookings_enhanced
  for select
  using ( public.is_admin_claim() );

-- 4) profiles policies (admin read-all)
alter table if exists public.profiles enable row level security;

drop policy if exists "Admins can read all profiles" on public.profiles;
create policy "Admins can read all profiles"
  on public.profiles
  for select
  using ( public.is_admin_claim() );

-- 5) properties policies (admin manage)
alter table if exists public.properties enable row level security;

drop policy if exists "Admins can update all properties" on public.properties;
create policy "Admins can update all properties"
  on public.properties
  for update
  using ( public.is_admin_claim() );

-- Delete

drop policy if exists "Admins can delete all properties" on public.properties;
create policy "Admins can delete all properties"
  on public.properties
  for delete
  using ( public.is_admin_claim() );

-- Select

drop policy if exists "Admins can read all properties" on public.properties;
create policy "Admins can read all properties"
  on public.properties
  for select
  using ( public.is_admin_claim() );

-- NOTE: We intentionally do not drop the older is_admin() function to avoid breaking
-- any external SQL. Policies now use is_admin_claim(), which is recursion-safe.

