-- Phase B Migration: Add coordinates and nearby search RPC
-- Safe, idempotent migration using conditional checks

begin;

-- 1) Add latitude/longitude columns with validation
alter table if exists public.properties
  add column if not exists latitude double precision,
  add column if not exists longitude double precision;

-- 1a) Add constraints ensuring valid ranges
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'properties_latitude_range_chk'
  ) THEN
    ALTER TABLE public.properties
      ADD CONSTRAINT properties_latitude_range_chk
      CHECK (latitude IS NULL OR (latitude >= -90 AND latitude <= 90));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'properties_longitude_range_chk'
  ) THEN
    ALTER TABLE public.properties
      ADD CONSTRAINT properties_longitude_range_chk
      CHECK (longitude IS NULL OR (longitude >= -180 AND longitude <= 180));
  END IF;
END
$$;

-- 1b) Helpful composite index for coordinate filtering
create index if not exists idx_properties_coordinates on public.properties (latitude, longitude);

-- 2) Haversine distance function (kilometers)
create or replace function public.haversine_distance_km(
  lat1 double precision,
  lon1 double precision,
  lat2 double precision,
  lon2 double precision
) returns double precision
language plpgsql
immutable
strict
as $$
begin
  -- Return NULL if any input is NULL
  if lat1 is null or lon1 is null or lat2 is null or lon2 is null then
    return null;
  end if;

  -- Convert degrees to radians
  return 2 * 6371 * asin(
    sqrt(
      pow(sin(radians((lat2 - lat1) / 2)), 2) +
      cos(radians(lat1)) * cos(radians(lat2)) * pow(sin(radians((lon2 - lon1) / 2)), 2)
    )
  );
end;
$$;

comment on function public.haversine_distance_km(double precision,double precision,double precision,double precision)
  is 'Returns distance in kilometers using Haversine formula';

-- 3) RPC: properties_nearby
-- Returns properties with non-null coordinates ordered by distance ascending
-- Supports optional radius_km, limit, and offset
create or replace function public.properties_nearby(
  user_lat double precision,
  user_lon double precision,
  radius_km double precision default null,
  limit_count integer default 20,
  offset_count integer default 0
) returns table (
  id uuid,
  title text,
  description text,
  address text,
  city text,
  state text,
  zip text,
  price numeric,
  rent numeric,
  type text,
  property_category text,
  bedrooms integer,
  bathrooms integer,
  max_occupants integer,
  images text[],
  amenities text[],
  is_available boolean,
  verification_status text,
  owner_id uuid,
  created_at timestamptz,
  updated_at timestamptz,
  latitude double precision,
  longitude double precision,
  distance_km double precision
) as $$
begin
  return query
  select 
    p.id,
    p.title,
    p.description,
    p.address,
    p.city,
    p.state,
    p.zip,
    p.price,
    p.rent,
    p.type,
    p.property_category,
    p.bedrooms,
    p.bathrooms,
    p.max_occupants,
    p.images,
    p.amenities,
    p.is_available,
    p.verification_status,
    p.owner_id,
    p.created_at,
    p.updated_at,
    p.latitude,
    p.longitude,
    public.haversine_distance_km(user_lat, user_lon, p.latitude, p.longitude) as distance_km
  from public.properties p
  where p.latitude is not null and p.longitude is not null
    and p.is_available = true
    and (p.verification_status = 'verified' or p.verification_status is null)
    and (
      radius_km is null
      or public.haversine_distance_km(user_lat, user_lon, p.latitude, p.longitude) <= radius_km
    )
  order by distance_km asc nulls last, p.created_at desc
  limit limit_count offset offset_count;
end;
$$ language plpgsql stable;

comment on function public.properties_nearby(double precision,double precision,double precision,integer,integer)
  is 'Returns available, verified properties near a coordinate with distance_km in ascending order';

commit;
