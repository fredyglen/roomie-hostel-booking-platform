-- Post-migration verification checks
-- Tables existence
select now() as executed_at;
select to_regclass('public.property_verifications') as property_verifications_regclass;
select to_regclass('public.payment_audit_log') as payment_audit_log_regclass;
select to_regclass('public.transactions') as transactions_regclass;
select to_regclass('public.payment_webhooks') as payment_webhooks_regclass;

-- Properties columns
select
  exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='properties' and column_name='is_available'
  ) as properties_has_is_available,
  exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='properties' and column_name='verification_status'
  ) as properties_has_verification_status,
  exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='properties' and column_name='deleted_at'
  ) as properties_has_deleted_at;

-- Check constraint on properties.verification_status
select c.conname, pg_get_constraintdef(c.oid) as constraint_def
from pg_constraint c
join pg_class t on c.conrelid = t.oid
join pg_namespace n on n.oid = t.relnamespace
where n.nspname='public' and t.relname='properties' and c.contype='c'
  and pg_get_constraintdef(c.oid) ilike '%verification_status%';

-- RLS enabled flags
select relname, relrowsecurity
from pg_class
where relname in ('properties','property_verifications','payment_audit_log','transactions','payment_webhooks','bookings_enhanced')
order by relname;

-- Policies defined
select schemaname, tablename, policyname, roles, cmd, qual, with_check
from pg_policies
where tablename in ('properties','property_verifications','payment_audit_log','transactions','payment_webhooks','bookings_enhanced')
order by tablename, policyname;

