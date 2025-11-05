# Geolocation and Proximity Deployment Guide

This document describes how to deploy Phase B (schema-backed proximity) for the Explore page.

## 1) Database Migration

- Apply migration: supabase/migrations/202511020001_properties_add_coordinates_and_nearby_function.sql
- Adds latitude/longitude columns with range checks
- Adds Haversine distance function and properties_nearby RPC

Rollback:
- Columns and functions are created idempotently; leave in place or drop functions:
  drop function if exists public.properties_nearby(double precision,double precision,double precision,integer,integer);
  drop function if exists public.haversine_distance_km(double precision,double precision,double precision,double precision);

## 2) Edge Function: geocode-property

- Path: supabase/functions/geocode-property/index.ts
- Providers: Mapbox > Google > Nominatim (fallback)
- Env vars (Supabase Project Settings > Functions):
  - SUPABASE_URL
  - SUPABASE_SERVICE_ROLE_KEY
  - MAPBOX_TOKEN (optional)
  - GOOGLE_MAPS_API_KEY (optional)

Deploy:
- supabase functions deploy geocode-property

Test locally:
- supabase functions serve geocode-property

Example request:
- POST /functions/v1/geocode-property
  { "address": "UPSA Hostel Road", "city": "Accra", "state": "Greater Accra" }

## 3) Backfill Script

- Path: scripts/backfill-property-coordinates.ts
- Requires env:
  - SUPABASE_URL
  - SUPABASE_SERVICE_ROLE_KEY

Run:
- npx ts-node scripts/backfill-property-coordinates.ts --limit=300 --dry-run=true
- npx ts-node scripts/backfill-property-coordinates.ts --limit=300 --dry-run=false

## 4) Frontend Hook (Phase B consumption)

- Path: src/hooks/property/useNearbyProperties.ts
- Consumes public.properties_nearby RPC
- Returns { properties, distancesById, isLoading, ... }

## 5) Integrate on Explore Page (after backfill)

- Replace temporary heuristic in Explore.tsx:
  - Remove userRegion heuristic
  - Use useNearbyProperties({ latitude, longitude, radiusKm: 25, limit: 24 })
  - Pass distance to PremiumPropertyCard via distanceToCampus formatted like "2.5 km away"

## 6) Monitoring and Rollback

- If RPC errors occur, fall back to useDynamicProperties + rankByProximity client-side
- Keep Edge Function logs monitored in Supabase dashboard
- Backfill can be re-run safely; it only updates missing coordinates

## 7) Security & Policies

- RLS unchanged (reads are public). Only service role updates coordinates via Edge Function
- Consider adding audit trigger on properties for coordinate changes if needed


