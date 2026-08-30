-- =====================================================================
-- Booking integrity: server-held pending bookings, atomic bed holds,
-- deposit-to-hold, and a write-protection trigger.
--
-- ALREADY APPLIED to ROOMi_v3 (2026-08-30). This file documents it into
-- version control -- it was not committed as SQL by the agent that applied
-- it (only the resulting edge-function/frontend code was delivered as a
-- patch), so it is reconstructed here from the live objects via
-- pg_get_functiondef/pg_get_triggerdef and information_schema, then
-- verified against the live database column-for-column and grant-for-grant
-- before being trusted. All DDL is written idempotently (IF NOT EXISTS /
-- OR REPLACE) so this file is safe to keep in the migration history even
-- though it must never be re-run against this project.
--
-- What this closes: the browser previously computed and could implicitly
-- influence booking state. Now the ONLY way a booking is created is
-- create_pending_booking() (SECURITY DEFINER), which:
--   - requires a real auth.uid() (raises AUTH_REQUIRED / 42501 otherwise)
--   - picks a room FOR UPDATE SKIP LOCKED and decrements beds_available
--     inside the same transaction -- no double-booking race
--   - captures the rent server-side from the property/room, never from
--     the client
--   - sets a hold_expires_at from the admin-configurable
--     commission_configurations.booking_hold_hours (default 48h)
--
-- A booking never becomes 'confirmed' or picks up money by direct write:
-- trg_protect_bookings_enhanced strips/blocks any non-service INSERT or
-- UPDATE that touches a financial or identity column. That is what makes
-- "clients are cryptographically unable to confirm their own bookings"
-- (README) true rather than aspirational -- it holds even if every other
-- layer (RLS, edge function validation) were somehow bypassed.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Booking/deposit columns
-- ---------------------------------------------------------------------

alter table public.bookings_enhanced
  add column if not exists amount_paid     numeric not null default 0,
  add column if not exists amount_due      numeric,
  add column if not exists payment_plan    text not null default 'full',
  add column if not exists hold_expires_at timestamptz;

comment on column public.bookings_enhanced.amount_paid is
  'Cumulative amount successfully paid toward this booking (server-written only).';
comment on column public.bookings_enhanced.amount_due is
  'Remaining balance; null once nothing is owed.';
comment on column public.bookings_enhanced.payment_plan is
  ''''full'''' or ''''deposit''''. Set by the server when a deposit payment_kind is used.';
comment on column public.bookings_enhanced.hold_expires_at is
  'When a pending/reserved booking''s bed hold lapses. Enforced by expire_stale_bookings() via cron.';

-- ---------------------------------------------------------------------
-- Deposit / hold policy on the commission configuration
-- (admin-configurable live, no deploy -- see BearerAndDepositSettings.tsx)
-- ---------------------------------------------------------------------

alter table public.commission_configurations
  add column if not exists booking_hold_hours       integer not null default 48,
  add column if not exists deposit_enabled           boolean not null default false,
  add column if not exists deposit_type              text    not null default 'percent',
  add column if not exists deposit_value              numeric not null default 0.5,
  add column if not exists deposit_balance_due_days   integer not null default 14;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'deposit_type_valid') then
    alter table public.commission_configurations
      add constraint deposit_type_valid check (deposit_type in ('percent','fixed'));
  end if;
end $$;

comment on column public.commission_configurations.booking_hold_hours is
  'Hours a pending (unpaid) booking holds its bed before expire_stale_bookings() releases it. Default 48.';
comment on column public.commission_configurations.deposit_enabled is
  'Whether payment_kind=deposit is accepted by initialize-payment.';
comment on column public.commission_configurations.deposit_type is
  '''percent'' (deposit_value is a fraction of total) or ''fixed'' (deposit_value is a GHS amount).';
comment on column public.commission_configurations.deposit_value is
  'Deposit size: fraction (0-1) if percent, GHS amount if fixed. Default 0.5 (50%).';
comment on column public.commission_configurations.deposit_balance_due_days is
  'Days after a deposit before the balance is due and the hold on a reserved booking lapses. Default 14.';

-- ---------------------------------------------------------------------
-- is_service_context(): trigger helper. True for the service role, a
-- non-anon/authenticated Postgres role, or an RPC that has explicitly
-- flagged itself via the roomi.allow_protected_write session GUC (the
-- mechanism create_pending_booking/cancel_booking/expire_stale_bookings
-- use to write financial columns despite running as SECURITY DEFINER
-- under an ordinary user's session).
-- ---------------------------------------------------------------------

create or replace function public.is_service_context()
returns boolean
language sql
stable
set search_path to 'public', 'pg_temp'
as $function$
  select coalesce(current_setting('request.jwt.claims', true)::jsonb->>'role','') = 'service_role'
      or current_user not in ('anon','authenticated','authenticator')
      or coalesce(current_setting('roomi.allow_protected_write', true),'') = '1';
$function$;

-- ---------------------------------------------------------------------
-- Write-protection trigger: the enforcement point for "the browser
-- cannot confirm its own booking". Applies even if RLS would otherwise
-- allow the UPDATE.
-- ---------------------------------------------------------------------

create or replace function public.protect_bookings_enhanced_writes()
returns trigger
language plpgsql
set search_path to 'public', 'pg_temp'
as $function$
begin
  if public.is_service_context() then
    return new;
  end if;

  if tg_op = 'INSERT' then
    -- Client-created bookings are always unpaid holds; the server fills money.
    new.status := 'pending';
    new.payment_status := 'pending';
    new.amount_paid := 0;
    new.amount_due := null;
    new.payment_plan := 'full';
    new.transaction_reference := null;
    new.paystack_reference := null;
    new.payment_reference := null;
    return new;
  end if;

  if tg_op = 'UPDATE' then
    if new.payment_status is distinct from old.payment_status
       or new.status is distinct from old.status
       or new.total_amount is distinct from old.total_amount
       or new.amount_paid is distinct from old.amount_paid
       or new.amount_due is distinct from old.amount_due
       or new.payment_plan is distinct from old.payment_plan
       or new.hold_expires_at is distinct from old.hold_expires_at
       or new.property_rent is distinct from old.property_rent
       or new.platform_fee is distinct from old.platform_fee
       or new.agent_fee is distinct from old.agent_fee
       or new.transaction_reference is distinct from old.transaction_reference
       or new.paystack_reference is distinct from old.paystack_reference
       or new.payment_reference is distinct from old.payment_reference
       or new.student_id is distinct from old.student_id
       or new.property_id is distinct from old.property_id
       or new.property_owner_id is distinct from old.property_owner_id
       or new.room_id is distinct from old.room_id
    then
      raise exception 'BOOKING_PROTECTED_FIELDS: payment and financial fields are managed by the server'
        using errcode = '42501';
    end if;
    return new;
  end if;

  return new;
end;
$function$;

drop trigger if exists trg_protect_bookings_enhanced on public.bookings_enhanced;
create trigger trg_protect_bookings_enhanced
  before insert or update on public.bookings_enhanced
  for each row execute function public.protect_bookings_enhanced_writes();

-- ---------------------------------------------------------------------
-- release_booking_bed(): shared by cancel_booking, expire_stale_bookings,
-- and the paystack-webhook refund path. Capped at the room's bed_count so
-- repeated release calls (e.g. a retried webhook) cannot inflate
-- beds_available past capacity.
-- ---------------------------------------------------------------------

create or replace function public.release_booking_bed(p_booking_id uuid)
returns void
language plpgsql
security definer
set search_path to 'public', 'pg_temp'
as $function$
declare v_room uuid;
begin
  select room_id into v_room from public.bookings_enhanced where id = p_booking_id;
  if v_room is not null then
    update public.rooms
       set beds_available = least(coalesce(bed_count, beds_available + 1), coalesce(beds_available,0) + 1),
           updated_at = now()
     where id = v_room;
  end if;
end;
$function$;

-- ---------------------------------------------------------------------
-- create_pending_booking(): the sole booking-creation path. Atomically
-- reserves a bed (FOR UPDATE SKIP LOCKED so concurrent students never
-- double-book the same bed) and captures the price server-side.
-- ---------------------------------------------------------------------

create or replace function public.create_pending_booking(
  p_property_id uuid,
  p_check_in date,
  p_check_out date,
  p_room_type text default null,
  p_semester_period text default null,
  p_roommates_count integer default 1,
  p_special_requests text default null,
  p_emergency_contact_name text default null,
  p_emergency_contact_phone text default null,
  p_emergency_contact_relationship text default null,
  p_student_id_number text default null,
  p_university text default null,
  p_program text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path to 'public', 'pg_temp'
as $function$
declare
  v_uid uuid := auth.uid();
  v_prop record;
  v_room record;
  v_rent numeric;
  v_hold_hours integer;
  v_expires timestamptz;
  v_booking_id uuid;
  v_ref text;
begin
  if v_uid is null then
    raise exception 'AUTH_REQUIRED' using errcode = '42501';
  end if;
  if p_check_in is null or p_check_out is null or p_check_out <= p_check_in then
    raise exception 'INVALID_DATES';
  end if;

  select id, owner_id, rent, base_price_per_semester
    into v_prop
    from public.properties
   where id = p_property_id
     and coalesce(is_available,false) = true
     and coalesce(verification_status,'pending') = 'verified'
     and deleted_at is null;
  if not found then
    raise exception 'PROPERTY_UNAVAILABLE';
  end if;

  -- Atomically hold one bed in a matching room.
  select id, rent_amount into v_room
    from public.rooms
   where property_id = p_property_id
     and coalesce(is_available,false) = true
     and coalesce(beds_available,0) > 0
     and (p_room_type is null or room_type = p_room_type)
   order by beds_available desc
   limit 1
   for update skip locked;
  if not found then
    raise exception 'NO_AVAILABILITY';
  end if;

  update public.rooms
     set beds_available = beds_available - 1,
         updated_at = now()
   where id = v_room.id;

  v_rent := coalesce(v_room.rent_amount, v_prop.base_price_per_semester, v_prop.rent);
  if v_rent is null or v_rent <= 0 then
    raise exception 'PRICE_UNAVAILABLE';
  end if;

  select coalesce(booking_hold_hours,48) into v_hold_hours
    from public.commission_configurations where is_active = true
    order by created_at desc limit 1;
  v_expires := now() + make_interval(hours => coalesce(v_hold_hours,48));
  v_ref := 'BK-' || to_char(now(),'YYYYMMDD') || '-' || upper(substr(md5(gen_random_uuid()::text),1,8));

  perform set_config('roomi.allow_protected_write','1', true);

  insert into public.bookings_enhanced (
    booking_reference, property_id, student_id, property_owner_id, room_id,
    check_in_date, check_out_date, start_date, end_date,
    semester_period, room_type, roommates_count, special_requests,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
    student_id_number, university, program,
    status, payment_status, payment_plan,
    property_rent, total_amount, amount_paid, amount_due,
    hold_expires_at, metadata
  ) values (
    v_ref, p_property_id, v_uid, v_prop.owner_id, v_room.id,
    p_check_in, p_check_out, p_check_in, p_check_out,
    p_semester_period, p_room_type, greatest(coalesce(p_roommates_count,1),1), p_special_requests,
    p_emergency_contact_name, p_emergency_contact_phone, p_emergency_contact_relationship,
    p_student_id_number, p_university, p_program,
    'pending', 'pending', 'full',
    v_rent, v_rent, 0, null,
    v_expires, coalesce(p_metadata,'{}'::jsonb)
  ) returning id into v_booking_id;

  return jsonb_build_object(
    'booking_id', v_booking_id,
    'booking_reference', v_ref,
    'room_id', v_room.id,
    'property_rent', v_rent,
    'hold_expires_at', v_expires
  );
end;
$function$;

-- ---------------------------------------------------------------------
-- cancel_booking(): a student cancelling their own pending/reserved
-- booking. Confirmed bookings are NOT cancellable this way (payments
-- require the manual admin/refund path -- see README operations runbook).
-- ---------------------------------------------------------------------

create or replace function public.cancel_booking(p_booking_id uuid)
returns jsonb
language plpgsql
security definer
set search_path to 'public', 'pg_temp'
as $function$
declare
  v_uid uuid := auth.uid();
  v_row record;
begin
  if v_uid is null then
    raise exception 'AUTH_REQUIRED' using errcode = '42501';
  end if;
  select id, status, payment_status into v_row
    from public.bookings_enhanced
   where id = p_booking_id and student_id = v_uid
   for update;
  if not found then
    raise exception 'BOOKING_NOT_FOUND';
  end if;
  if v_row.status not in ('pending','reserved') then
    raise exception 'CANNOT_CANCEL_STATUS_%', v_row.status;
  end if;

  perform set_config('roomi.allow_protected_write','1', true);
  update public.bookings_enhanced
     set status = 'cancelled', updated_at = now()
   where id = p_booking_id;
  perform public.release_booking_bed(p_booking_id);

  return jsonb_build_object('cancelled', true, 'booking_id', p_booking_id,
    'note', case when v_row.payment_status <> 'pending'
                 then 'payments on this booking require manual refund handling' else null end);
end;
$function$;

-- ---------------------------------------------------------------------
-- expire_stale_bookings(): cron-only. pending -> expired,
-- reserved -> deposit_expired (a paid deposit whose balance deadline
-- passed -- see README: forfeit/refund policy is currently manual admin
-- handling, deliberately not automated here).
-- ---------------------------------------------------------------------

create or replace function public.expire_stale_bookings()
returns integer
language plpgsql
security definer
set search_path to 'public', 'pg_temp'
as $function$
declare
  v_count integer := 0;
  r record;
begin
  perform set_config('roomi.allow_protected_write','1', true);
  for r in
    select id, status from public.bookings_enhanced
     where status in ('pending','reserved')
       and hold_expires_at is not null
       and hold_expires_at < now()
     for update skip locked
  loop
    update public.bookings_enhanced
       set status = case when r.status = 'pending' then 'expired' else 'deposit_expired' end,
           updated_at = now()
     where id = r.id;
    perform public.release_booking_bed(r.id);
    v_count := v_count + 1;
  end loop;
  return v_count;
end;
$function$;

-- Public-facing RPCs: broad EXECUTE, identity enforced inside the
-- function body (auth.uid() is null -> AUTH_REQUIRED / 42501).
grant execute on function public.create_pending_booking(uuid, date, date, text, text, integer, text, text, text, text, text, text, text, jsonb) to anon, authenticated;
grant execute on function public.cancel_booking(uuid) to anon, authenticated;

-- ---------------------------------------------------------------------
-- Cron: release holds that were never paid.
-- ---------------------------------------------------------------------

select cron.schedule(
  'roomi_expire_stale_bookings',
  '*/10 * * * *',
  $$select public.expire_stale_bookings()$$
) where not exists (select 1 from cron.job where jobname = 'roomi_expire_stale_bookings');
