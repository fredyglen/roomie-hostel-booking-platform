-- Backfill property_verifications for existing pending properties with no request row
-- Idempotent: inserts only when a property has no related verification row

insert into public.property_verifications (property_id, status, verification_type)
select p.id, 'pending', 'standard'
from public.properties p
left join public.property_verifications pv
  on pv.property_id = p.id
where pv.id is null
  and coalesce(p.verification_status, 'pending') = 'pending';

