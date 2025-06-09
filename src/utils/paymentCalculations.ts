import { PAYMENT_CONSTANTS } from '@/constants/payment';
import { PaymentCalculationConfig } from '@/types/payment';
import { config } from '@/config';

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

/**
 * Calculate payment breakdown based on property price and configuration
 */
export const calculatePaymentBreakdown = (
  propertyPrice: number,
  configOverride?: PaymentConfig
): PaymentBreakdown => {
  const currentConfig = configOverride || config.payment;

  // Calculate each component
  const agentCommission = Math.max(
    propertyPrice * currentConfig.agentCommissionRate,
    currentConfig.agentMinimumFee
  );
  
  const platformFee = propertyPrice * currentConfig.platformCommissionRate;
  const paystackFee = (propertyPrice * (currentConfig?.paystackFeeRate ?? config.payment.paystackFeeRate));
  
  // Assuming propertyOwnerAmount is total - fees for now
  const propertyOwnerAmount = propertyPrice - agentCommission - platformFee - paystackFee; 

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
  configOverride?: PaymentConfig
): number => {
   const currentConfig = configOverride || config.payment;
  return Math.max(
    propertyPrice * currentConfig.agentCommissionRate,
    currentConfig.agentMinimumFee
  );
};

/**
 * Calculate platform fee
 */
export const calculatePlatformFee = (
  propertyPrice: number,
  configOverride?: PaymentConfig
): number => {
   const currentConfig = configOverride || config.payment;
  return propertyPrice * currentConfig.platformCommissionRate;
};

/**
 * Calculate property owner amount after fees
 */
export const calculatePropertyOwnerAmount = (
  propertyPrice: number,
  configOverride?: PaymentConfig
): number => {
   const currentConfig = configOverride || config.payment;
   // Recalculate based on fees, as propertyOwnerRetention is missing from config.payment
   const agentCommission = calculateAgentCommission(propertyPrice, currentConfig);
   const platformFee = calculatePlatformFee(propertyPrice, currentConfig);
   const paystackFee = calculatePaystackFee(propertyPrice, currentConfig);
   
   return propertyPrice - agentCommission - platformFee - paystackFee; // Assuming this calculation
};

/**
 * Validate payment amounts add up correctly
 */
export const validatePaymentBreakdown = (breakdown: PaymentBreakdown): boolean => {
  const totalCalculated = breakdown.propertyOwnerAmount + breakdown.agentCommission + breakdown.platformFee + breakdown.paystackFee; // Include paystackFee in validation
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
  config?: any // TODO: Define proper type for discount config if needed
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

export function calculatePlatformCommission(amount: number): number {
  return amount * PAYMENT_CONSTANTS.PLATFORM_COMMISSION_RATE;
}

export function calculatePaystackFee(amount: number, configOverride?: PaymentConfig): number {
  const currentConfig = configOverride || config.payment;
   // Note: config.payment doesn't currently have a fixed fee, only rate.
   // If a fixed fee is needed, it should be added to src/config/index.ts.
   return amount * currentConfig.paystackFeeRate; 
}

export function calculateBookingFee(amount: number): number {
  return amount * PAYMENT_CONSTANTS.BOOKING_FEE_RATE;
}

export function getCurrencyLimits(currency: string) {
  return PAYMENT_CONSTANTS.CURRENCY_LIMITS[currency] || PAYMENT_CONSTANTS.CURRENCY_LIMITS['GHS'];
}
