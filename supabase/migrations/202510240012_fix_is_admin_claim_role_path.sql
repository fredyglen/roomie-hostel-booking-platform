-- Fix is_admin_claim() to read role from JWT app_metadata/user_metadata
-- This prevents RLS recursion while correctly honoring admin roles
-- Safe/idempotent: create or replace only

create or replace function public.is_admin_claim()
returns boolean
language sql
stable
as $$
  with claims as (
    select current_setting('request.jwt.claims', true)::jsonb as c
  )
  select coalesce(
    -- 1) Some deployments may set a top-level "role" claim (rare)
    (select (c->>'role') in ('supreme_admin','campus_admin') from claims),
    -- 2) Preferred: app_metadata.role (write-controlled by server/admins)
    (select (c->'app_metadata'->>'role') in ('supreme_admin','campus_admin') from claims),
    -- 3) Fallback: user_metadata.role (user-editable; use only if app_metadata not present)
    (select (c->'user_metadata'->>'role') in ('supreme_admin','campus_admin') from claims),
    false
  );
$$;

-- No policy changes needed here; policies already reference public.is_admin_claim()
-- IMPORTANT: After updating this function, admins must sign out/in to receive a fresh JWT.

