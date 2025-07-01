
import { Property } from '@/types/property';

import { paymentConfig } from '@/config/environment';

// Payment configuration from environment
const PAYMENT_CONFIG = {
  platformFeePercentage: paymentConfig.commissionRate,
  paymentProcessorFeePercentage: 0.015, // 1.5% Paystack fee (external rate)
  agentCommissionPercentage: 0.10, // 10% agent commission (business rule)
  vatRate: 0.125, // 12.5% VAT in Ghana (legal requirement)
  currency: paymentConfig.currency
};

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
  // Base calculations
  const platformFee = propertyRent * PAYMENT_CONFIG.platformFeePercentage;
  const paymentProcessorFee = propertyRent * PAYMENT_CONFIG.paymentProcessorFeePercentage;
  const agentFee = propertyRent * PAYMENT_CONFIG.agentCommissionPercentage;
  
  const subtotal = propertyRent + platformFee + paymentProcessorFee + agentFee;
  const vat = subtotal * PAYMENT_CONFIG.vatRate;
  const totalAmount = subtotal + vat;
  
  // What the property owner receives (rent minus platform and agent fees)
  const ownerReceives = propertyRent - platformFee - agentFee;

  return {
    propertyRent,
    platformFee,
    paymentProcessorFee,
    agentFee,
    vat,
    totalAmount,
    ownerReceives
  };
};

export const calculateBookingCosts = (
  property: Property,
  durationMonths: number = 1,
  packageType: 'standard' | 'premium' | 'luxury' = 'standard'
): BookingCosts => {
  const baseRent = property.price.amount;
  const subtotal = baseRent * durationMonths;
  
  const platformFee = subtotal * PAYMENT_CONFIG.platformFeePercentage;
  const processingFee = subtotal * PAYMENT_CONFIG.paymentProcessorFeePercentage;
  const agentFee = subtotal * PAYMENT_CONFIG.agentCommissionPercentage;
  
  const beforeVat = subtotal + platformFee + processingFee + agentFee;
  const vat = beforeVat * PAYMENT_CONFIG.vatRate;
  const total = beforeVat + vat;

  return {
    baseRent,
    duration: durationMonths,
    subtotal,
    platformFee,
    processingFee,
    agentFee,
    vat,
    total
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
  const platformFee = totalAmount * PAYMENT_CONFIG.platformFeePercentage;
  const agentFee = agentId ? totalAmount * PAYMENT_CONFIG.agentCommissionPercentage : 0;
  
  const ownerAmount = totalAmount - processorFee - platformFee - agentFee;
  
  return {
    ownerAmount: Math.max(0, ownerAmount),
    agentAmount: agentFee,
    platformAmount: platformFee,
    processorFee
  };
};

export { PAYMENT_CONFIG };
