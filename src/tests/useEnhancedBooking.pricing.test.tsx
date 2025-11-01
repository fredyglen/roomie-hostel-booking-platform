import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { centralizedCommissionEngine } from '@/config/centralized-commission.config';
import { BookingService } from '@/services/bookingService';
import { useEnhancedBooking } from '@/hooks/booking/useEnhancedBooking';

// Mock auth and toast deps used by the hook
vi.mock('@/context/EnhancedAuthContext', () => ({
  useAuth: () => ({ user: null })
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: () => {} })
}));

describe('useEnhancedBooking.recomputePricing', () => {
  it('recomputes pricing when called with new base amount', () => {
    const mockProperty: any = { id: 'prop_1', rent: 5000, agent_id: undefined };

    const { result } = renderHook(() => useEnhancedBooking(mockProperty));

    const initialTotal = result.current.pricing.totalAmount;
    const expectedInitial = BookingService.calculateBookingPricing(5000, false).totalAmount;
    expect(initialTotal).toBe(expectedInitial);

    act(() => {
      result.current.recomputePricing(6000);
    });

    const updatedTotal = result.current.pricing.totalAmount;
    const expectedUpdated = BookingService.calculateBookingPricing(6000, false).totalAmount;
    expect(updatedTotal).toBe(expectedUpdated);
  });
});

