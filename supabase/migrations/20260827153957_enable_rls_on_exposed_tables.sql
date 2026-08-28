-- =====================================================================
-- Enable RLS on four public tables that had it switched off entirely.
-- Source: Supabase security advisor, rls_disabled_in_public (ERROR x4)
-- Verified against live schema 2026-08-27.
--
-- The material item is commission_configurations: it was readable AND
-- writable by the `anon` role, i.e. by anyone holding the publishable key
-- that ships in the client bundle. The commission engine writes this table
-- from the browser (src/config/centralized-commission.config.ts:490-509),
-- so writes are narrowed to admins rather than to service_role only --
-- otherwise the admin rate-change UI would break.
-- =====================================================================

begin;

-- ---------------------------------------------------------------------
-- commission_configurations : public read, admin-only write
-- ---------------------------------------------------------------------
alter table public.commission_configurations enable row level security;

-- Read stays open to anon. The commission singleton loads this on app boot
-- for every visitor to render fee breakdowns
-- (centralized-commission.config.ts:120 -> 437). Rates are not secret.
drop policy if exists "commission_config_public_read" on public.commission_configurations;
create policy "commission_config_public_read"
  on public.commission_configurations
  for select
  to anon, authenticated
  using ( true );

drop policy if exists "commission_config_admin_insert" on public.commission_configurations;
create policy "commission_config_admin_insert"
  on public.commission_configurations
  for insert
  to authenticated
  with check ( public.is_admin_claim() );

drop policy if exists "commission_config_admin_update" on public.commission_configurations;
create policy "commission_config_admin_update"
  on public.commission_configurations
  for update
  to authenticated
  using ( public.is_admin_claim() )
  with check ( public.is_admin_claim() );

-- No DELETE policy on purpose: rate history is append-only.
-- service_role bypasses RLS and can still prune if ever needed.

-- ---------------------------------------------------------------------
-- payment_distributions : participants read their own rows
-- ---------------------------------------------------------------------
alter table public.payment_distributions enable row level security;

drop policy if exists "payment_distributions_participant_read" on public.payment_distributions;
create policy "payment_distributions_participant_read"
  on public.payment_distributions
  for select
  to authenticated
  using (
    property_owner_id = (select auth.uid())
    or agent_id = (select auth.uid())
    or public.is_admin_claim()
  );

-- No write policies: payout rows are written by edge functions holding the
-- service key, which bypasses RLS.

-- ---------------------------------------------------------------------
-- booking_roommates : holds roommate name / email / phone / student id
-- ---------------------------------------------------------------------
alter table public.booking_roommates enable row level security;

drop policy if exists "booking_roommates_participant_read" on public.booking_roommates;
create policy "booking_roommates_participant_read"
  on public.booking_roommates
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.bookings_enhanced b
      where b.id = booking_roommates.booking_id
        and ( b.student_id = (select auth.uid())
              or b.property_owner_id = (select auth.uid()) )
    )
    or public.is_admin_claim()
  );

drop policy if exists "booking_roommates_booker_insert" on public.booking_roommates;
create policy "booking_roommates_booker_insert"
  on public.booking_roommates
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.bookings_enhanced b
      where b.id = booking_roommates.booking_id
        and b.student_id = (select auth.uid())
    )
  );

-- ---------------------------------------------------------------------
-- properties_backup_before_blob_cleanup : internal snapshot, 11 rows
-- ---------------------------------------------------------------------
-- Intentionally left with zero policies: RLS on + no policy = reachable
-- only via service_role. This table should not be exposed through the API
-- at all, and ideally is dropped once the blob cleanup is confirmed good.
alter table public.properties_backup_before_blob_cleanup enable row level security;

commit;
