-- =====================================================================
-- Bring commission_configurations up to the v2.0.0 "Phase 1" model that
-- src/config/centralized-commission.config.ts:60-69 defines as canonical.
--
-- Decision recorded in ROOMI_SALVAGE_REPORT_2026-08-27.md (#3): the code
-- model is correct; the DB row and the unit tests were both wrong.
--
--                     old (2.1.0)   new (2.2.0)
--   platform_rate        0.0500       0.1000   owner pays 10%
--   agent_rate           0.0370       0.0000   agent disabled for Phase 1
--   vat_rate             0.1250       0.0000   VAT removed completely
--   agent_minimum_fee    100.00       0.00     agent disabled
--   paystack_rate        0.0195       0.0195   unchanged, platform absorbs
--   platform_fixed_fee   100.00       100.00   unchanged, student pays 100 GHS
--
-- Append-only: the 2.1.0 row is deactivated, not mutated, so the audit trail
-- survives and this is reversible by flipping is_active back.
--
-- Version is 2.2.0 rather than 2.0.0 so it supersedes 2.1.0 under the loader's
-- "is_active = true, newest created_at" selection
-- (centralized-commission.config.ts:437-445).
--
-- APPLIED TO PRODUCTION 2026-08-29 via MCP. Active row is now v2.2.0.
-- =====================================================================

begin;

update public.commission_configurations
   set is_active = false,
       updated_at = now()
 where is_active = true;

insert into public.commission_configurations (
  platform_rate, agent_rate, paystack_rate, vat_rate,
  platform_fixed_fee, agent_minimum_fee,
  currency, version, environment, is_active,
  changed_by, change_reason
) values (
  0.1000, 0.0000, 0.0195, 0.0000,
  100.00, 0.00,
  'GHS', '2.2.0', 'production', true,
  'salvage_2026_08_28',
  'Align DB with the canonical v2.0.0 Phase 1 model in centralized-commission.config.ts: owner pays 10%, VAT removed, agent commission disabled. Supersedes 2.1.0 which charged 5% platform + 12.5% VAT + 3.7% agent.'
);

commit;
