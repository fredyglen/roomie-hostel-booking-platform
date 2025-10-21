-- Unify bookings tables: migrate legacy `bookings` data into `bookings_enhanced`
-- Safe, idempotent migration. Run on dev/staging first.

begin;

-- 1) Ensure target table exists with essential columns
create table if not exists public.bookings_enhanced (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  property_owner_id uuid references public.profiles(id) on delete set null,
  booking_reference text unique,
  check_in_date date not null,
  check_out_date date not null,
  total_amount numeric(12,2) not null default 0,
  payment_status text not null default 'pending', -- pending | paid | failed | refunded
  status text not null default 'pending',        -- pending | confirmed | cancelled | completed
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) Add columns if missing (idempotent)
alter table public.bookings_enhanced
  add column if not exists property_owner_id uuid references public.profiles(id) on delete set null,
  add column if not exists booking_reference text,
  add column if not exists total_amount numeric(12,2) not null default 0,
  add column if not exists payment_status text not null default 'pending',
  add column if not exists status text not null default 'pending',
  add column if not exists check_in_date date,
  add column if not exists check_out_date date;

-- 3) Backfill from legacy `bookings` where not already present
--    Field mapping:
--      bookings.owner_id            -> property_owner_id
--      bookings.start_date          -> check_in_date
--      bookings.end_date            -> check_out_date
--      bookings.amount              -> total_amount
--      bookings.status              -> status
--      generated 'LEGACY-'||id      -> booking_reference (if missing)
insert into public.bookings_enhanced (
  id,
  property_id,
  student_id,
  property_owner_id,
  booking_reference,
  check_in_date,
  check_out_date,
  total_amount,
  payment_status,
  status,
  created_at,
  updated_at
)
select
  b.id,
  b.property_id,
  b.student_id,
  b.owner_id as property_owner_id,
  coalesce(be.booking_reference, 'LEGACY-'||b.id::text) as booking_reference,
  coalesce(be.check_in_date, b.start_date) as check_in_date,
  coalesce(be.check_out_date, b.end_date) as check_out_date,
  coalesce(be.total_amount, b.amount)::numeric(12,2) as total_amount,
  coalesce(be.payment_status, 'pending') as payment_status,
  coalesce(be.status, b.status, 'pending') as status,
  least(b.created_at, now()) as created_at,
  greatest(b.updated_at, now()) as updated_at
from public.bookings b
left join public.bookings_enhanced be on be.id = b.id
where be.id is null;

-- 4) Indexes to support portal queries
create index if not exists idx_bookings_enhanced_student_id on public.bookings_enhanced(student_id);
create index if not exists idx_bookings_enhanced_owner_id on public.bookings_enhanced(property_owner_id);
create index if not exists idx_bookings_enhanced_property_id on public.bookings_enhanced(property_id);
create unique index if not exists idx_bookings_enhanced_reference on public.bookings_enhanced(booking_reference);

-- 5) Optional: freeze legacy table (manual step)
-- alter table public.bookings rename to bookings_legacy; -- manual, after verification

commit;

-- Verification (run manually):
-- select count(*) from public.bookings;
-- select count(*) from public.bookings_enhanced;
-- select count(*) from public.bookings b where not exists (select 1 from public.bookings_enhanced be where be.id = b.id);
-- select * from public.bookings_enhanced order by created_at desc limit 5;
