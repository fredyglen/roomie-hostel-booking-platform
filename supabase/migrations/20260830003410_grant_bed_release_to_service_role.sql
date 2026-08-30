-- =====================================================================
-- Lock down release_booking_bed() and expire_stale_bookings() to the
-- service role only.
--
-- ALREADY APPLIED to ROOMi_v3 (2026-08-30). Reconstructed from live grants
-- (information_schema.routine_privileges) and committed for the same
-- reason as 20260830003116 -- documenting what is actually running, not
-- re-running it. See that migration's header for the fuller context.
--
-- PostgreSQL grants EXECUTE on a newly created function to PUBLIC by
-- default. create_pending_booking and cancel_booking are meant to be
-- callable by any authenticated student (identity is enforced inside the
-- function body via auth.uid()), so their broad grant is correct and is
-- set explicitly in the previous migration.
--
-- release_booking_bed and expire_stale_bookings are different: they mutate
-- bed inventory directly with no per-caller identity check of their own
-- (release_booking_bed trusts its caller entirely; expire_stale_bookings
-- is meant to run on the cron schedule only). Leaving PUBLIC's default
-- grant in place on these two would mean any authenticated user could
-- invoke pg_cron's or the webhook's internal bed-release path directly.
-- This migration closes that gap.
-- =====================================================================

revoke execute on function public.release_booking_bed(uuid) from public, anon, authenticated;
grant  execute on function public.release_booking_bed(uuid) to service_role, postgres;

revoke execute on function public.expire_stale_bookings() from public, anon, authenticated;
grant  execute on function public.expire_stale_bookings() to service_role, postgres;
