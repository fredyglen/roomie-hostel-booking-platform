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

import { config } from '@/config';
import { PLATFORM_RULES } from '@/types/platform-core';

/**
 * @deprecated Use config.payment instead
 * Maintained for backward compatibility only
 */
export const PAYMENT_CONSTANTS = {
  // RESOLVED CONFLICT: Now using unified configuration values
  PLATFORM_COMMISSION_RATE: config.payment.platformCommissionRate, // 5% (was 4.2%)
  AGENT_COMMISSION_RATE: config.payment.agentCommissionRate,        // 3.7%
  AGENT_MINIMUM_FEE: config.payment.agentMinimumFee,              // GHS 100 minimum
  PAYSTACK_FEE_RATE: config.payment.paystackFeeRate,              // 1.95%
  BOOKING_FEE_RATE: config.payment.bookingFeeRate,                // 2%
  CURRENCY_LIMITS: PLATFORM_RULES.CURRENCY_LIMITS,
} as const;

// Re-export unified configuration for new code
export { config as unifiedConfig } from '@/config';
export { PLATFORM_RULES } from '@/types/platform-core';