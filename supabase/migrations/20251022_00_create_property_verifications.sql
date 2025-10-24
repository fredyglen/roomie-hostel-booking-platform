-- Create property_verifications table referenced by admin VerificationManagement page
-- Includes fields used by UI and RLS for owner submit + admin review

create table if not exists public.property_verifications (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,

  -- Status lifecycle
  status text not null default 'pending' check (status in ('pending','verified','rejected')),
  verification_type text,
  priority_level text default 'normal' check (priority_level in ('low','normal','high','urgent')),
  verification_deadline timestamptz,
  verification_date timestamptz,
  resubmission_count int not null default 0,

  -- Notes & docs
  notes text,
  admin_notes text,
  rejection_reason text,
  documents text[],
  verification_requirements text[],

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;$$;

-- Create trigger if missing
do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'trg_property_verifications_updated_at'
  ) then
    create trigger trg_property_verifications_updated_at
      before update on public.property_verifications
      for each row execute function public.set_updated_at();
  end if;
end$$;

-- Enable RLS
alter table if exists public.property_verifications enable row level security;

-- Owner can create a verification request for their own property
-- (Postgres lacks IF NOT EXISTS for policies; safe to drop first when refactoring later)
drop policy if exists "Owners can create verification requests" on public.property_verifications;
create policy "Owners can create verification requests"
  on public.property_verifications
  for insert
  with check (
    exists (
      select 1 from public.properties p
      where p.id = property_verifications.property_id
        and p.owner_id = auth.uid()
    )
  );

-- Owners can read their own property verifications
drop policy if exists "Owners can read their property verifications" on public.property_verifications;
create policy "Owners can read their property verifications"
  on public.property_verifications
  for select
  using (
    exists (
      select 1 from public.properties p
      where p.id = property_verifications.property_id
        and p.owner_id = auth.uid()
    )
  );

-- Helpful index
create index if not exists idx_property_verifications_property on public.property_verifications(property_id);

