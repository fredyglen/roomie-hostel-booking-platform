-- Add missing columns used by the frontend and standardize occupancy naming
-- Idempotent and safe for production
begin;

-- Core descriptive fields
alter table if exists public.properties
  add column if not exists description text,
  add column if not exists city text,
  add column if not exists state text,
  add column if not exists zip text,
  add column if not exists property_type text,
  add column if not exists property_category text,
  add column if not exists cover_image_url text,
  add column if not exists gender_type text default 'mixed';

-- Pricing fields (align with BE CONSCIOUS definitions)
-- 'currency' column already introduced in earlier migration; ensure it exists
alter table if exists public.properties
  add column if not exists currency text default 'GHS';

-- Capacity and occupancy (normalize to max_occupants)
alter table if exists public.properties
  add column if not exists max_occupants integer,
  add column if not exists current_occupancy integer default 0,
  add column if not exists bedrooms integer default 1,
  add column if not exists bathrooms integer default 1,
  add column if not exists beds_available integer,
  add column if not exists beds_per_room integer,
  add column if not exists total_rooms integer;

-- Media and amenities
alter table if exists public.properties
  add column if not exists amenities text[],
  add column if not exists images text[];

-- Optional relationship to agent (nullable)
alter table if exists public.properties
  add column if not exists agent_id uuid references public.profiles(id) on delete set null;

-- Backfill: copy from max_occupancy -> max_occupants if the former exists
-- and max_occupants is currently null
DO $$
BEGIN
  IF exists (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='properties' AND column_name='max_occupancy'
  ) THEN
    EXECUTE 'update public.properties set max_occupants = coalesce(max_occupants, max_occupancy)';
  END IF;
END $$;

commit;

