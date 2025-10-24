-- Admin Finance access: allow admins to read all bookings for analytics
-- Safe to run multiple times (IF NOT EXISTS guards)

-- Ensure RLS is enabled (no-op if already enabled)
alter table if exists public.bookings_enhanced enable row level security;

-- Create index to speed up date-range queries used by Finance dashboard
create index if not exists bookings_enhanced_created_at_idx
  on public.bookings_enhanced (created_at);

-- Create admin read policy only if it doesn't already exist
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'bookings_enhanced'
      and policyname = 'Admins can read all bookings (finance)'
  ) then
    create policy "Admins can read all bookings (finance)"
      on public.bookings_enhanced
      for select
      using (
        exists (
          select 1
          from public.profiles p
          where p.id = auth.uid()
            and p.role in ('supreme_admin', 'campus_admin')
        )
      );
  end if;
end$$;

