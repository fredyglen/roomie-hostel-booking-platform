-- APPLIED TO PRODUCTION 2026-08-29 via MCP.
-- Fixes the live 400s: frontend queries rooms.property_id (347 failures/day)
-- but rooms linked to properties only via floor_id -> floors -> buildings.
-- Additive: new nullable column, backfilled, trigger-maintained.
alter table public.rooms
  add column if not exists property_id uuid references public.properties(id);

update public.rooms r
   set property_id = b.property_id
  from public.floors f
  join public.buildings b on f.building_id = b.id
 where r.floor_id = f.id and r.property_id is null;

create index if not exists idx_rooms_property_id on public.rooms(property_id);

create or replace function public.rooms_set_property_id()
returns trigger language plpgsql
set search_path = public, pg_temp as $$
begin
  if new.floor_id is not null then
    select b.property_id into new.property_id
      from public.floors f
      join public.buildings b on f.building_id = b.id
     where f.id = new.floor_id;
  end if;
  return new;
end $$;

drop trigger if exists trg_rooms_set_property_id on public.rooms;
create trigger trg_rooms_set_property_id
  before insert or update of floor_id on public.rooms
  for each row execute function public.rooms_set_property_id();
