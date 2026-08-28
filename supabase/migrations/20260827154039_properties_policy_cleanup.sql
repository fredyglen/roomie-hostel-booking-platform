-- =====================================================================
-- Collapse duplicate RLS policies on properties and compounds, and stop
-- the blanket USING (true) SELECT policies from nullifying the scoped ones.
--
-- Background: migration 202510220003 added a correctly scoped public-read
-- policy to properties, but the older "Anyone can view properties" policy
-- (USING true) was never dropped. Permissive policies OR together, so the
-- scoped policy has been dead code ever since -- unverified, unavailable
-- and soft-deleted properties are all publicly readable today.
--
-- Repeated migration passes also left exact-duplicate owner/admin policies.
-- Every duplicate is evaluated on every query (advisor:
-- multiple_permissive_policies, 171 warnings project-wide).
--
-- Survivors are recreated with (select auth.uid()) so the value is computed
-- once per query instead of once per row (advisor: auth_rls_initplan).
-- =====================================================================

begin;

-- ---------------------------------------------------------------------
-- 1) properties: drop the blanket public-read policy
-- ---------------------------------------------------------------------
-- "Public can read verified available properties" (202510220003) already
-- covers anon access and stays in place untouched.
drop policy if exists "Anyone can view properties" on public.properties;

-- ---------------------------------------------------------------------
-- 2) properties: drop exact duplicates
-- ---------------------------------------------------------------------
drop policy if exists "Owners can insert their own properties" on public.properties; -- dup of "Owners can insert properties"
drop policy if exists "Owners can update their properties"     on public.properties; -- dup of "Owners can update their own properties"
drop policy if exists "admin_update_all_properties"            on public.properties; -- dup of "Admins can update all properties"
drop policy if exists "admin_delete_all_properties"            on public.properties; -- dup of "Admins can delete all properties"

-- ---------------------------------------------------------------------
-- 3) properties: recreate owner policies with a stable auth.uid()
-- ---------------------------------------------------------------------
drop policy if exists "Owners can read their properties" on public.properties;
create policy "Owners can read their properties"
  on public.properties for select
  using ( owner_id = (select auth.uid()) );

drop policy if exists "Owners can insert properties" on public.properties;
create policy "Owners can insert properties"
  on public.properties for insert
  with check ( owner_id = (select auth.uid()) );

-- NOTE: the previous UPDATE policy had no WITH CHECK, which let an owner
-- reassign owner_id and hand their property to another account. Added here.
drop policy if exists "Owners can update their own properties" on public.properties;
create policy "Owners can update their own properties"
  on public.properties for update
  using      ( owner_id = (select auth.uid()) )
  with check ( owner_id = (select auth.uid()) );

drop policy if exists "Owners can delete their own properties" on public.properties;
create policy "Owners can delete their own properties"
  on public.properties for delete
  using ( owner_id = (select auth.uid()) );

-- ---------------------------------------------------------------------
-- 4) compounds: replace USING (true) with the same visibility rule
-- ---------------------------------------------------------------------
-- compounds carries owner_id, business_registration_number, address and
-- coordinates. Every frontend read is owner-side (src/pages/owner/*,
-- compound-analytics.service.ts) and is covered by the owner/admin policies
-- below it, so nothing student-facing depends on blanket public read.
-- Scoped rather than dropped so that any property->compound embed keeps
-- working for properties that are themselves publicly visible.
drop policy if exists "Public can view compounds" on public.compounds;
create policy "Public can view compounds"
  on public.compounds for select
  using (
    exists (
      select 1
      from public.properties p
      where p.compound_id = compounds.id
        and coalesce(p.is_available, false) = true
        and coalesce(p.verification_status, 'pending') = 'verified'
        and p.deleted_at is null
    )
  );

-- ---------------------------------------------------------------------
-- 5) bookings_enhanced: stable auth.uid() + drop the recursive admin policy
-- ---------------------------------------------------------------------
-- "Admins can read all bookings (finance)" re-reads public.profiles per row;
-- "Admins can read all bookings_enhanced" does the same job via the JWT claim
-- with no table read. Keep the claim-based one.
drop policy if exists "Admins can read all bookings (finance)" on public.bookings_enhanced;

drop policy if exists "Users can view their own bookings" on public.bookings_enhanced;
create policy "Users can view their own bookings"
  on public.bookings_enhanced for select
  using ( student_id = (select auth.uid()) );

drop policy if exists "Users can create their own bookings" on public.bookings_enhanced;
create policy "Users can create their own bookings"
  on public.bookings_enhanced for insert
  with check ( student_id = (select auth.uid()) );

drop policy if exists "Users can update their own bookings" on public.bookings_enhanced;
create policy "Users can update their own bookings"
  on public.bookings_enhanced for update
  using      ( student_id = (select auth.uid()) )
  with check ( student_id = (select auth.uid()) );

drop policy if exists "Property owners can view bookings for their properties" on public.bookings_enhanced;
create policy "Property owners can view bookings for their properties"
  on public.bookings_enhanced for select
  using (
    exists (
      select 1
      from public.properties p
      where p.id = bookings_enhanced.property_id
        and p.owner_id = (select auth.uid())
    )
  );

commit;
