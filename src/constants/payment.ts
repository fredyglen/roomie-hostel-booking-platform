export const PAYMENT_CONSTANTS = {
  PLATFORM_COMMISSION_RATE: 0.042, // 4.2%
  AGENT_COMMISSION_RATE: 0.037,    // 3.7%
  AGENT_MINIMUM_FEE: 100,          // GHS 100 minimum
  PAYSTACK_FEE_RATE: 0.0195,       // 1.95%
  BOOKING_FEE_RATE: 0.02,          // 2%
  CURRENCY_LIMITS: {
    GHS: { min: 0.10, max: 50000 },
    NGN: { min: 50, max: 10000000 },
    USD: { min: 2, max: 100000 },
    ZAR: { min: 1, max: 100000 },
    KES: { min: 1, max: 1000000 },
  },
}; 