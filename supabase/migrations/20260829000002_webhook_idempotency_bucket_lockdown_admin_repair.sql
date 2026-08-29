-- APPLIED TO PRODUCTION 2026-08-29 via MCP.
-- 1) Idempotency support for the hardened paystack-webhook (v7):
create unique index if not exists uq_payment_webhooks_event
  on public.payment_webhooks (paystack_event_id, event_type)
  where paystack_event_id is not null;

-- 2) verification-documents and property-documents were PUBLIC (both empty at
--    time of change). Locked; per-user folder access + admin read.
update storage.buckets set public = false
 where name in ('verification-documents','property-documents');

drop policy if exists "sensitive_docs_owner_all" on storage.objects;
create policy "sensitive_docs_owner_all" on storage.objects
  for all to authenticated
  using (bucket_id in ('verification-documents','property-documents')
         and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id in ('verification-documents','property-documents')
         and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "sensitive_docs_admin_read" on storage.objects;
create policy "sensitive_docs_admin_read" on storage.objects
  for select to authenticated
  using (bucket_id in ('verification-documents','property-documents')
         and public.is_admin_claim());

-- 3) Profile d21fdb26 had role='admin' (valid nowhere in the system) and no
--    app_metadata role: routed to the student portal, failed is_admin_claim().
--    Assigned campus_admin (conservative tier) in both identity sources.
--    NOTE: public.profiles has NO updated_at column (types in src lie).
update public.profiles
   set role = 'campus_admin'
 where id = 'd21fdb26-4579-4701-890e-bf2fe7d4deca' and role = 'admin';

update auth.users
   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"campus_admin"}'::jsonb
 where id = 'd21fdb26-4579-4701-890e-bf2fe7d4deca';
