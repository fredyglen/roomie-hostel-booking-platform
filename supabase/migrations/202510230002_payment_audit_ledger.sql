-- Payment audit ledger to capture Paystack webhook events with commission snapshots
-- Idempotent migration

-- Ensure extension for gen_random_uuid
create extension if not exists pgcrypto;

create table if not exists public.payment_audit_log (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid,
  payment_reference text,
  event_type text not null,
  commission_snapshot jsonb,
  rates_snapshot jsonb,
  metadata_valid boolean,
  discrepancy_notes text,
  paystack_response jsonb not null,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_payment_audit_log_reference on public.payment_audit_log (payment_reference);
create index if not exists idx_payment_audit_log_booking on public.payment_audit_log (booking_id);
create index if not exists idx_payment_audit_log_created_at on public.payment_audit_log (created_at);

-- Enable RLS
alter table if exists public.payment_audit_log enable row level security;

-- Helper function for admin detection (if missing)
create or replace function public.is_admin() returns boolean
language sql stable as $$
  select exists(
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role in ('supreme_admin','campus_admin')
  );
$$;

-- Policies: admins can read all
drop policy if exists "Admins can read all audit logs" on public.payment_audit_log;
create policy "Admins can read all audit logs"
  on public.payment_audit_log
  for select
  using (public.is_admin());

-- Note: Inserts are typically done by Edge Functions using service role which bypasses RLS.
-- No public insert/update/delete policies are added here for safety.

