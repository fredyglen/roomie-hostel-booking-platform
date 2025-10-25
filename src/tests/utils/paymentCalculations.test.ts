import { describe, it, expect } from 'vitest';
import {
  calculatePaymentBreakdown,
  calculateBookingCosts,
  calculatePlatformRevenue,
  calculateOwnerEarnings,
  calculateRefund,
  calculatePaymentDistribution,
} from '@/utils/paymentCalculations';
import { centralizedCommissionEngine } from '@/config/centralized-commission.config';

// Minimal Property stub
const makeProperty = (overrides: Partial<any> = {}) => ({
  id: 'prop_1',
  title: 'Test Property',
  rent: 1000,
  price: 1000,
  ...overrides,
});

describe('paymentCalculations', () => {
  it('calculatePaymentBreakdown matches centralizedCommissionEngine', () => {
    const base = 1000;
    const expected = centralizedCommissionEngine.calculateCommissions(base, true);
    const result = calculatePaymentBreakdown(base);

    expect(result.propertyRent).toBeCloseTo(expected.baseAmount, 6);
    expect(result.platformFee).toBeCloseTo(expected.platformCommission + expected.platformFixedFee, 6);
    expect(result.paymentProcessorFee).toBeCloseTo(expected.paystackFee, 6);
    expect(result.vat).toBeCloseTo(expected.vatAmount, 6);
    expect(result.totalAmount).toBeCloseTo(expected.totalAmount, 6);
    expect(result.ownerReceives).toBeCloseTo(expected.ownerReceives, 6);
  });

  it('calculateBookingCosts aggregates duration and matches engine totals', () => {
    const property = makeProperty({ rent: 800 });
    const duration = 6;
    const subtotal = property.rent * duration;
    const expected = centralizedCommissionEngine.calculateCommissions(subtotal, true);

    const result = calculateBookingCosts(property, duration);

    expect(result.baseRent).toBe(800);
    expect(result.subtotal).toBe(subtotal);
    expect(result.platformFee).toBeCloseTo(expected.platformCommission + expected.platformFixedFee, 6);
    expect(result.processingFee).toBeCloseTo(expected.paystackFee, 6);
    expect(result.vat).toBeCloseTo(expected.vatAmount, 6);
    expect(result.total).toBeCloseTo(expected.totalAmount, 6);
  });

  it('calculatePlatformRevenue respects platform rate minus processor fees', () => {
    const totalPayments = 10000;
    const processorFees = 150;
    const platformRate = centralizedCommissionEngine.getCommissionRates().platform;
    const expected = Math.max(0, totalPayments * platformRate - processorFees);

    expect(calculatePlatformRevenue(totalPayments, processorFees)).toBeCloseTo(expected, 6);
  });

  it('calculateOwnerEarnings returns base rent per booking count', () => {
    expect(calculateOwnerEarnings(1200, 3)).toBe(3600);
  });

  it('calculateRefund applies policy rules', () => {
    const totalPaid = 2000;
    const daysUsed = 15;
    const totalDays = 30;

    const flexible = calculateRefund(totalPaid, daysUsed, totalDays, 'flexible');
    const moderate = calculateRefund(totalPaid, daysUsed, totalDays, 'moderate');
    const strict = calculateRefund(totalPaid, daysUsed, totalDays, 'strict');

    expect(strict).toBe(0);
    expect(moderate).toBeGreaterThan(0);
    expect(flexible).toBeGreaterThan(moderate);
  });

  it('calculatePaymentDistribution returns non-negative amounts and includes agent when provided', () => {
    const total = 5000;
    const ownerId = 'owner_1';

    const noAgent = calculatePaymentDistribution(total, ownerId);
    expect(noAgent.ownerAmount).toBeGreaterThan(0);
    expect(noAgent.agentAmount).toBe(0);
    expect(noAgent.platformAmount).toBeGreaterThan(0);
    expect(noAgent.processorFee).toBeGreaterThan(0);

    const withAgent = calculatePaymentDistribution(total, ownerId, 'agent_1');
    expect(withAgent.agentAmount).toBeGreaterThan(0);
  });
});

