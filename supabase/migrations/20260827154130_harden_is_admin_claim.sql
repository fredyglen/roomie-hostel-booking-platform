-- =====================================================================
-- PRIVILEGE ESCALATION FIX -- is_admin_claim()
--
-- The live function trusted three sources for the admin role:
--     app_metadata.role   -- server-controlled, correct
--     user_metadata.role  -- USER-CONTROLLED
--     top-level role      -- always 'authenticated'/'anon', never an admin value
--
-- user_metadata is writable by the account holder:
--     supabase.auth.updateUser({ data: { role: 'supreme_admin' } })
-- After that call the next JWT makes is_admin_claim() return true, which
-- grants read/update/delete on every property, read on every profile, and
-- read on every booking. Signup already writes a role into user_metadata
-- (handle_new_user reads raw_user_meta_data->>'role'), so 80 of 82 accounts
-- have the key populated and the mechanism is already in normal use.
--
-- Checked before writing this: 1 account is admin via app_metadata,
-- 0 accounts depend on user_metadata for admin. Dropping that branch
-- therefore locks out nobody.
--
-- Also supersedes two BROKEN definitions still sitting in this directory:
--   202510240010_admin_claim_based_policies.sql
--   202510240012_fix_is_admin_claim_role_path.sql
-- Both build the result with coalesce() over the three checks. coalesce
-- returns the first NON-NULL value, and the top-level `role` claim is always
-- present ('authenticated'), so the first check yields false, coalesce stops
-- there, and app_metadata is never consulted. Applying either file denies
-- every admin. Do not run them; this migration is the correct definition.
-- =====================================================================

begin;

create or replace function public.is_admin_claim()
returns boolean
language sql
stable
set search_path = public, pg_temp
as $fn$
  select coalesce(
    (current_setting('request.jwt.claims', true)::jsonb #>> '{app_metadata,role}')
      in ('supreme_admin','campus_admin'),
    false
  );
$fn$;

comment on function public.is_admin_claim() is
  'True when the caller JWT carries app_metadata.role in (supreme_admin, campus_admin). '
  'Reads no tables, so it is safe inside RLS policies. Deliberately ignores '
  'user_metadata.role, which the account holder can set on themselves.';

commit;

-- ---------------------------------------------------------------------
-- Operational notes
-- ---------------------------------------------------------------------
-- 1. Admins must sign out and back in to pick up a fresh JWT after this runs.
-- 2. To grant admin, write app_metadata (service_role only, never the client):
--      supabase.auth.admin.updateUserById(userId, {
--        app_metadata: { role: 'supreme_admin' }
--      })
-- 3. public.profiles.role currently holds one account with role 'admin',
--    which is not in (supreme_admin, campus_admin) and so is not treated as
--    an admin by either is_admin() or is_admin_claim(). Worth reconciling.
