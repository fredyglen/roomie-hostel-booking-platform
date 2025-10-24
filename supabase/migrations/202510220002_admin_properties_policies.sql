-- Admin RLS policies for properties management (update/delete/select)
-- Idempotent: drop-then-create (Postgres doesn't support CREATE POLICY IF NOT EXISTS)

-- Ensure RLS is enabled
alter table if exists public.properties enable row level security;

-- Admins can update all properties
drop policy if exists "Admins can update all properties" on public.properties;
create policy "Admins can update all properties"
  on public.properties
  for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('supreme_admin','campus_admin')
    )
  );

-- Admins can delete all properties
drop policy if exists "Admins can delete all properties" on public.properties;
create policy "Admins can delete all properties"
  on public.properties
  for delete
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('supreme_admin','campus_admin')
    )
  );

-- Admins can read all properties
drop policy if exists "Admins can read all properties" on public.properties;
create policy "Admins can read all properties"
  on public.properties
  for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('supreme_admin','campus_admin')
    )
  );

