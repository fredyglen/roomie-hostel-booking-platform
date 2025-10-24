-- Synchronize properties.verification_status with property_verifications

-- Function: when a verification row becomes verified/rejected, reflect it onto the property
create or replace function public.sync_property_verification_status()
returns trigger
language plpgsql
as $$
begin
  if (tg_op = 'INSERT') then
    -- Nothing to sync on insert; status defaults to 'pending'
    return new;
  end if;

  if (tg_op = 'UPDATE') then
    if new.status is distinct from old.status then
      update public.properties
        set verification_status = new.status,
            updated_at = now()
        where id = new.property_id;
    end if;
    return new;
  end if;

  return new;
end;$$;

-- Attach trigger (update only)
do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'trg_sync_property_verification_status'
  ) then
    create trigger trg_sync_property_verification_status
      after update of status on public.property_verifications
      for each row execute function public.sync_property_verification_status();
  end if;
end$$;

