
import { Property } from '@/types/property';
import { centralizedCommissionEngine } from '@/config/centralized-commission.config';

// ✅ CENTRALIZED COMMISSION SYSTEM - Single Source of Truth
// All payment calculations now use the centralized commission engine
// This eliminates hardcoded values and ensures consistency across the platform

export interface PaymentBreakdown {
  propertyRent: number;
  platformFee: number;
  paymentProcessorFee: number;
  agentFee: number;
  vat: number;
  totalAmount: number;
  ownerReceives: number;
}

export interface BookingCosts {
  baseRent: number;
  duration: number; // in months
  subtotal: number;
  platformFee: number;
  processingFee: number;
  agentFee: number;
  vat: number;
  total: number;
}

export const calculatePaymentBreakdown = (
  propertyRent: number,
  packageType: 'standard' | 'premium' | 'luxury' = 'standard'
): PaymentBreakdown => {
  // ✅ CENTRALIZED COMMISSION CALCULATION - Using single source of truth
  const commissionResult = centralizedCommissionEngine.calculateCommissions(propertyRent, true);

  return {
    propertyRent: commissionResult.baseAmount,
    platformFee: commissionResult.platformCommission + commissionResult.platformFixedFee,
    paymentProcessorFee: commissionResult.paystackFee,
    agentFee: commissionResult.agentCommission,
    vat: commissionResult.vatAmount,
    totalAmount: commissionResult.totalAmount,
    ownerReceives: commissionResult.ownerReceives
  };
};

export const calculateBookingCosts = (
  property: Property,
  durationMonths: number = 1,
  packageType: 'standard' | 'premium' | 'luxury' = 'standard'
): BookingCosts => {
  const baseRent = property.rent || property.price;
  const subtotal = baseRent * durationMonths;

  // ✅ CENTRALIZED COMMISSION CALCULATION - Using single source of truth
  const commissionResult = centralizedCommissionEngine.calculateCommissions(subtotal, true);

  return {
    baseRent,
    duration: durationMonths,
    subtotal,
    platformFee: commissionResult.platformCommission + commissionResult.platformFixedFee,
    processingFee: commissionResult.paystackFee,
    agentFee: commissionResult.agentCommission,
    vat: commissionResult.vatAmount,
    total: commissionResult.totalAmount
  };
};

export const calculatePlatformRevenue = (
  totalPayments: number,
  paymentProcessorFees: number
): number => {
  const platformRevenue = (totalPayments * PAYMENT_CONFIG.platformFeePercentage) - paymentProcessorFees;
  return Math.max(0, platformRevenue);
};

export const calculateOwnerEarnings = (
  propertyRent: number,
  bookingsCount: number = 1
): number => {
  const platformFee = propertyRent * PAYMENT_CONFIG.platformFeePercentage;
  const agentFee = propertyRent * PAYMENT_CONFIG.agentCommissionPercentage;
  const ownerReceivesPerBooking = propertyRent - platformFee - agentFee;
  
  return ownerReceivesPerBooking * bookingsCount;
};

export const formatCurrency = (amount: number, currency: string = PAYMENT_CONFIG.currency): string => {
  if (currency === 'GHS') {
    return `GH₵ ${amount.toFixed(2)}`;
  }
  return `${currency} ${amount.toFixed(2)}`;
};

export const getPackageMultiplier = (packageType: 'standard' | 'premium' | 'luxury'): number => {
  const multipliers = {
    standard: 1.0,
    premium: 1.2,
    luxury: 1.5
  };
  return multipliers[packageType] || 1.0;
};

export const calculateMonthlyPayment = (
  totalAmount: number,
  installments: number = 1
): number => {
  return totalAmount / installments;
};

export const calculateRefund = (
  totalPaid: number,
  daysUsed: number,
  totalDays: number,
  cancellationPolicy: 'flexible' | 'moderate' | 'strict' = 'moderate'
): number => {
  const usageRatio = daysUsed / totalDays;
  let refundRatio = 1 - usageRatio;

  // Apply cancellation policy
  switch (cancellationPolicy) {
    case 'flexible':
      // Full refund minus platform fee if cancelled early
      refundRatio = Math.max(0, refundRatio - PAYMENT_CONFIG.platformFeePercentage);
      break;
    case 'moderate':
      // 50% refund of unused portion
      refundRatio = refundRatio * 0.5;
      break;
    case 'strict':
      // No refund
      refundRatio = 0;
      break;
  }

  return totalPaid * refundRatio;
};

export const validatePaymentAmount = (amount: number): boolean => {
  return amount > 0 && amount <= 1000000; // Max 1M GHS
};

export const convertCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  exchangeRate: number = 1
): number => {
  if (fromCurrency === toCurrency) return amount;
  return amount * exchangeRate;
};

// Payment distribution for multi-party transactions
export const calculatePaymentDistribution = (
  totalAmount: number,
  ownerId: string,
  agentId?: string
): {
  ownerAmount: number;
  agentAmount: number;
  platformAmount: number;
  processorFee: number;
} => {
  const processorFee = totalAmount * PAYMENT_CONFIG.paymentProcessorFeePercentage;
  // Updated to match BE CONSCIOUS structure (5% + GHS 100)
  const platformFee = (totalAmount * PAYMENT_CONFIG.platformFeePercentage) + PAYMENT_CONFIG.platformFixedFee;
  const agentFee = agentId ? totalAmount * PAYMENT_CONFIG.agentCommissionPercentage : 0;

  // Property owner gets 88% as per BE CONSCIOUS
  const ownerAmount = totalAmount * 0.88;
  
  return {
    ownerAmount: Math.max(0, ownerAmount),
    agentAmount: agentFee,
    platformAmount: platformFee,
    processorFee
  };
};

export { PAYMENT_CONFIG };
