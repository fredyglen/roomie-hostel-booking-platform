-- Admin RLS policies for property_verifications, bookings_enhanced, profiles
-- Idempotent: drop-then-create (no IF NOT EXISTS)

-- Optional helper to centralize admin role check
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role in ('supreme_admin','campus_admin')
  );
$$;

-- property_verifications
alter table if exists public.property_verifications enable row level security;

drop policy if exists "Admins can read all property verifications" on public.property_verifications;
create policy "Admins can read all property verifications"
  on public.property_verifications
  for select
  using ( public.is_admin() );

drop policy if exists "Admins can update all property verifications" on public.property_verifications;
create policy "Admins can update all property verifications"
  on public.property_verifications
  for update
  using ( public.is_admin() )
  with check ( public.is_admin() );

-- bookings_enhanced (analytics)
alter table if exists public.bookings_enhanced enable row level security;

drop policy if exists "Admins can read all bookings_enhanced" on public.bookings_enhanced;
create policy "Admins can read all bookings_enhanced"
  on public.bookings_enhanced
  for select
  using ( public.is_admin() );

-- profiles (role checks and joins)
alter table if exists public.profiles enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles
  for select
  using ( id = auth.uid() );

drop policy if exists "Admins can read all profiles" on public.profiles;
create policy "Admins can read all profiles"
  on public.profiles
  for select
  using ( public.is_admin() );

