/**
 * Payment Constants - DEPRECATED
 *
 * This file has been deprecated in favor of the unified configuration system.
 * All payment constants are now managed through:
 * - src/types/platform-core.ts (PLATFORM_RULES)
 * - src/config/index.ts (unified configuration)
 *
 * @deprecated Use config.payment from src/config/index.ts instead
 */

import { centralizedCommissionEngine } from '@/config/centralized-commission.config';

/**
 * @deprecated Use centralizedCommissionEngine directly
 * This file is deprecated and will be removed in next cleanup phase.
 *
 * MIGRATION COMPLETED: All commission rates now come from centralized system
 * - Platform Commission: 5% (DEFINITIVE)
 * - Agent Commission: 3.7% (DEFINITIVE)
 * - Platform Fixed Fee: 100 GHS (DEFINITIVE)
 * - Agent Minimum Fee: 100 GHS (DEFINITIVE)
 */
export const PAYMENT_CONSTANTS = {
  // ✅ CENTRALIZED COMMISSION SYSTEM - All values from single source of truth
  PLATFORM_COMMISSION_RATE: centralizedCommissionEngine.getCommissionRates().platform,
  AGENT_COMMISSION_RATE: centralizedCommissionEngine.getCommissionRates().agent,
  AGENT_MINIMUM_FEE: centralizedCommissionEngine.getPlatformFees().agentMinimum,
  PAYSTACK_FEE_RATE: centralizedCommissionEngine.getCommissionRates().paystack,
  PLATFORM_FIXED_FEE: centralizedCommissionEngine.getPlatformFees().fixed,
  VAT_RATE: centralizedCommissionEngine.getCommissionRates().vat,
  CURRENCY_LIMITS: centralizedCommissionEngine.getCurrencyConfig().limits,
} as const;

// Re-export unified configuration for new code
export { config as unifiedConfig } from '@/config';
export { PLATFORM_RULES } from '@/types/platform-core';