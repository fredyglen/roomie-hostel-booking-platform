-- Create transactions and payment_webhooks tables required by Edge Functions
-- Idempotent and RLS-safe

-- Ensure UUID generation extension
create extension if not exists pgcrypto;

-- Transactions table
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  amount numeric not null,
  currency text not null default 'GHS',
  status text not null default 'pending',
  customer_email text not null,
  customer_id uuid references auth.users(id) on delete set null,
  payment_method text,
  paystack_reference text,
  paystack_response jsonb,
  metadata jsonb,
  webhook_verified boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Helpful indexes
create index if not exists idx_transactions_reference on public.transactions(reference);
create index if not exists idx_transactions_customer on public.transactions(customer_id);
create index if not exists idx_transactions_created_at on public.transactions(created_at);

-- Enable RLS
alter table if exists public.transactions enable row level security;

-- Admin helper (idempotent)
create or replace function public.is_admin()
returns boolean
language sql
stable
as $fn$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role in ('supreme_admin','campus_admin')
  );
$fn$;

-- Drop then create policies (idempotent)
drop policy if exists "Admins can read all transactions" on public.transactions;
create policy "Admins can read all transactions"
  on public.transactions
  for select
  using (public.is_admin());

drop policy if exists "Users can read their own transactions" on public.transactions;
create policy "Users can read their own transactions"
  on public.transactions
  for select
  using (auth.uid() = customer_id);

-- payment_webhooks table stores raw webhook payloads
create table if not exists public.payment_webhooks (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  paystack_event_id text,
  reference text,
  status text not null default 'received',
  payload jsonb not null,
  processed boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_payment_webhooks_reference on public.payment_webhooks(reference);
create index if not exists idx_payment_webhooks_created_at on public.payment_webhooks(created_at);

alter table if exists public.payment_webhooks enable row level security;

drop policy if exists "Admins can read all webhooks" on public.payment_webhooks;
create policy "Admins can read all webhooks"
  on public.payment_webhooks
  for select
  using (public.is_admin());

-- Note: Inserts/updates are performed by Edge Functions with service role, bypassing RLS.

