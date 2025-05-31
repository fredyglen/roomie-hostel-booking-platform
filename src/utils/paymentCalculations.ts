
// Payment calculation utilities based on PAYMENT_RULES.md

export interface PaymentBreakdown {
  totalAmount: number;
  propertyOwnerAmount: number;
  agentCommission: number;
  platformFee: number;
  paystackFee: number;
  platformNet: number;
}

export interface PaymentConfig {
  platformCommissionRate: number;
  agentCommissionRate: number;
  agentMinimumFee: number;
  propertyOwnerRetention: number;
  paystackFeeRate: number;
  bookingFeeRate: number;
}

// Default payment configuration - easily adjustable
export const DEFAULT_PAYMENT_CONFIG: PaymentConfig = {
  platformCommissionRate: 0.042, // 4.2%
  agentCommissionRate: 0.037,    // 3.7%
  agentMinimumFee: 100,          // GHS 100 minimum
  propertyOwnerRetention: 0.98,   // 98%
  paystackFeeRate: 0.0195,       // 1.95%
  bookingFeeRate: 0.02           // 2%
};

/**
 * Calculate payment breakdown based on property price and configuration
 */
export const calculatePaymentBreakdown = (
  propertyPrice: number,
  config: PaymentConfig = DEFAULT_PAYMENT_CONFIG
): PaymentBreakdown => {
  // Calculate each component
  const agentCommission = Math.max(
    propertyPrice * config.agentCommissionRate,
    config.agentMinimumFee
  );
  
  const platformFee = propertyPrice * config.platformCommissionRate;
  const propertyOwnerAmount = propertyPrice * config.propertyOwnerRetention;
  const paystackFee = propertyPrice * config.paystackFeeRate;
  
  // Platform net is platform fee minus Paystack fees
  const platformNet = platformFee - paystackFee;

  return {
    totalAmount: propertyPrice,
    propertyOwnerAmount: Math.round(propertyOwnerAmount * 100) / 100,
    agentCommission: Math.round(agentCommission * 100) / 100,
    platformFee: Math.round(platformFee * 100) / 100,
    paystackFee: Math.round(paystackFee * 100) / 100,
    platformNet: Math.round(platformNet * 100) / 100
  };
};

/**
 * Calculate agent commission with minimum fee consideration
 */
export const calculateAgentCommission = (
  propertyPrice: number,
  config: PaymentConfig = DEFAULT_PAYMENT_CONFIG
): number => {
  return Math.max(
    propertyPrice * config.agentCommissionRate,
    config.agentMinimumFee
  );
};

/**
 * Calculate platform fee
 */
export const calculatePlatformFee = (
  propertyPrice: number,
  config: PaymentConfig = DEFAULT_PAYMENT_CONFIG
): number => {
  return propertyPrice * config.platformCommissionRate;
};

/**
 * Calculate property owner amount after fees
 */
export const calculatePropertyOwnerAmount = (
  propertyPrice: number,
  config: PaymentConfig = DEFAULT_PAYMENT_CONFIG
): number => {
  return propertyPrice * config.propertyOwnerRetention;
};

/**
 * Validate payment amounts add up correctly
 */
export const validatePaymentBreakdown = (breakdown: PaymentBreakdown): boolean => {
  const totalCalculated = breakdown.propertyOwnerAmount + breakdown.agentCommission + breakdown.platformFee;
  const difference = Math.abs(totalCalculated - breakdown.totalAmount);
  
  // Allow for small rounding differences (less than 1 pesewa)
  return difference < 0.01;
};

/**
 * Convert amount to Paystack format (pesewas)
 */
export const convertToPesewas = (amount: number): number => {
  return Math.round(amount * 100);
};

/**
 * Convert from Paystack format to cedis
 */
export const convertFromPesewas = (pesewas: number): number => {
  return pesewas / 100;
};

/**
 * Format amount for display
 */
export const formatAmount = (amount: number): string => {
  return `GHS ${amount.toFixed(2)}`;
};

/**
 * Calculate discount amount based on rules
 */
export const calculateDiscount = (
  amount: number,
  discountType: 'early_30' | 'early_60' | 'academic_year' | 'loyalty_second' | 'loyalty_third',
  config?: any
): number => {
  const discountRates = {
    early_30: 0.05,      // 5%
    early_60: 0.08,      // 8%
    academic_year: 0.10, // 10%
    loyalty_second: 0.03, // 3%
    loyalty_third: 0.05   // 5%
  };

  return amount * (discountRates[discountType] || 0);
};

/**
 * Apply discount to payment breakdown
 */
export const applyDiscount = (
  breakdown: PaymentBreakdown,
  discountAmount: number
): PaymentBreakdown => {
  const discountedTotal = breakdown.totalAmount - discountAmount;
  return calculatePaymentBreakdown(discountedTotal);
};
