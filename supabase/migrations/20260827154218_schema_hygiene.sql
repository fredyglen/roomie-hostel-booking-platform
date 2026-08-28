-- =====================================================================
-- Schema hygiene: duplicate FK, duplicate indexes, function search_path,
-- and an RPC that should never have been reachable from the API.
-- All items verified against the live schema on 2026-08-27.
-- =====================================================================

begin;

-- ---------------------------------------------------------------------
-- 1) Duplicate foreign key on properties.owner_id
-- ---------------------------------------------------------------------
-- Two FKs sat on the same column:
--   fk_properties_owner        -> public.profiles(id)  ON DELETE CASCADE
--   properties_owner_id_fkey   -> auth.users(id)       ON DELETE CASCADE
-- PostgREST cannot pick a relationship for an embed such as
--   /properties?select=*,profiles(*)
-- and answers HTTP 300 "more than one relationship was found".
--
-- Dropping the auth.users one keeps the profiles embed working and does not
-- weaken deletes: profiles_id_fkey already cascades auth.users -> profiles,
-- and fk_properties_owner cascades profiles -> properties.
-- (This is the same one-liner as the unapplied
--  database/migrations/drop_duplicate_fk_properties_owner_id_fkey.sql)
alter table public.properties drop constraint if exists properties_owner_id_fkey;

-- ---------------------------------------------------------------------
-- 2) Byte-identical duplicate indexes
-- ---------------------------------------------------------------------
-- Each pair indexes the same column the same way; both are maintained on
-- every write. The survivor in each pair is the constraint-backed or
-- earliest-created index.
drop index if exists public.idx_bookings_enhanced_reference;        -- dup of bookings_enhanced_booking_reference_key
drop index if exists public.idx_property_verifications_property_id; -- dup of idx_property_verifications_property
drop index if exists public.idx_transactions_customer_id;           -- dup of idx_transactions_customer

-- ---------------------------------------------------------------------
-- 3) Pin search_path on every public function
-- ---------------------------------------------------------------------
-- advisor: function_search_path_mutable (16 warnings). A mutable search_path
-- lets a caller shadow the objects a SECURITY DEFINER function resolves.
-- Applied as a loop so functions added later by hand are caught too.
do $$
declare
  f record;
begin
  for f in
    select p.oid::regprocedure as sig
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.prokind = 'f'
      and not exists (
        select 1
        from unnest(coalesce(p.proconfig, '{}'::text[])) cfg
        where cfg like 'search_path=%'
      )
  loop
    execute format('alter function %s set search_path = public, pg_temp', f.sig);
  end loop;
end
$$;

-- ---------------------------------------------------------------------
-- 4) handle_new_user() must not be callable over the API
-- ---------------------------------------------------------------------
-- advisors: anon_security_definer_function_executable,
--           authenticated_security_definer_function_executable
-- It is SECURITY DEFINER, it writes public.profiles, and it was reachable at
-- POST /rest/v1/rpc/handle_new_user. It only ever needs to run as the
-- on-signup trigger, which executes as the table owner regardless of grants.
-- NOTE: this line was insufficient on its own -- the grant lives on PUBLIC.
-- See 20260827154312 for the revoke that actually closed it.
revoke execute on function public.handle_new_user() from anon, authenticated;

commit;
