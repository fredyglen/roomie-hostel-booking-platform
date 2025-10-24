-- Core base tables required by later migrations: profiles and properties
-- Ensures foreign keys in 20241217 and 20241220 apply cleanly
-- Safe to run multiple times (IF NOT EXISTS), minimal columns to satisfy downstream refs

-- Enable required extensions
create extension if not exists pgcrypto;

-- 1) User Profiles (public.profiles)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'student',
  first_name text,
  last_name text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Minimal RLS policies (users can manage their own profile)
drop policy if exists "Users can read their own profiles" on public.profiles;
create policy "Users can read their own profiles"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 2) Properties (public.properties) - includes legacy `rent` to support updates in 20241220
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  address text,
  status text not null default 'Available',
  rent numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.properties enable row level security;

-- Basic policy examples (owners can manage their own properties)
drop policy if exists "Owners can read their properties" on public.properties;
create policy "Owners can read their properties"
  on public.properties for select
  using (auth.uid() = owner_id);

drop policy if exists "Owners can insert properties" on public.properties;
create policy "Owners can insert properties"
  on public.properties for insert
  with check (auth.uid() = owner_id);

drop policy if exists "Owners can update their properties" on public.properties;
create policy "Owners can update their properties"
  on public.properties for update
  using (auth.uid() = owner_id);

-- Helpful indexes
create index if not exists idx_properties_owner on public.properties(owner_id);

