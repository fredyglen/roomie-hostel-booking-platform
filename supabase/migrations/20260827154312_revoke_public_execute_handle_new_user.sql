-- =====================================================================
-- Follow-up to 20260827154218.
--
-- That migration revoked EXECUTE on handle_new_user() from anon and
-- authenticated, but the grant actually lived on PUBLIC -- pg_proc.proacl
-- read "=X/postgres", the default PostgreSQL grants to PUBLIC for every new
-- function. Revoking from the two named roles was therefore a no-op and
-- POST /rest/v1/rpc/handle_new_user stayed reachable by anonymous callers.
--
-- Revoking from PUBLIC does not affect the on_auth_user_created trigger on
-- auth.users: PostgreSQL checks EXECUTE on a trigger function when the
-- trigger is CREATED, not on each fire. supabase_auth_admin (the role that
-- inserts into auth.users) is granted explicitly regardless, so the signup
-- path cannot be affected either way.
--
-- Verified after applying:
--   anon                -> false
--   authenticated       -> false
--   supabase_auth_admin -> true
--   proacl -> postgres=X/postgres | service_role=X/postgres | supabase_auth_admin=X/postgres
-- =====================================================================

revoke execute on function public.handle_new_user() from public;
revoke execute on function public.handle_new_user() from anon, authenticated;
grant  execute on function public.handle_new_user() to supabase_auth_admin;
