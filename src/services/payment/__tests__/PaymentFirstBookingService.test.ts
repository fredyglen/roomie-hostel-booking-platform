/**
 * Apple-Level Test Suite for PaymentFirstBookingService
 * 
 * Business Purpose: Ensures payment-first booking flow works correctly under all scenarios
 * Tests critical revenue protection logic and prevents phantom booking creation
 * 
 * Technical Implementation: Comprehensive test coverage for payment processing,
 * booking creation, error handling, and edge cases
 * 
 * Critical for Quality Assurance: Validates that bookings are ONLY created after payment success
 * 
 * @author ROOMi Development Team
 * @version 1.0.0
 * @since 2025-06-21
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PaymentFirstBookingService, type PaymentFirstBookingData } from '../PaymentFirstBookingService';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/enhanced-logger';

// Mock external dependencies
vi.mock('@/integrations/supabase/client');
vi.mock('@/utils/enhanced-logger');
vi.mock('@/utils/paystackIntegration', () => ({
  generatePaymentReference: () => 'test_ref_123456789'
}));

describe('PaymentFirstBookingService - Apple-Level Test Suite', () => {
  let mockSupabase: any;
  let validBookingData: PaymentFirstBookingData;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Setup Supabase mock
    mockSupabase = {
      functions: {
        invoke: vi.fn()
      },
      from: vi.fn(() => ({
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn()
          }))
        }))
      }))
    };
    
    (supabase as any) = mockSupabase;

    // Create valid test data
    validBookingData = {
      property: {
        id: 'prop_123',
        title: 'Test Property',
        rent: 2700,
        owner_id: 'owner_123',
        agent_id: 'agent_123'
      },
      student: {
        id: 'student_123',
        email: 'test@student.com'
      },
      bookingDetails: {
        checkInDate: '2024-02-01',
        checkOutDate: '2024-06-01',
        semesterPeriod: 'spring_2024',
        roomType: '2_in_a_room',
        roommatesCount: 2,
        specialRequests: 'Ground floor preferred'
      },
      studentInfo: {
        emergencyContactName: 'John Doe',
        emergencyContactPhone: '+233240000001',
        emergencyContactRelationship: 'Father',
        studentIdNumber: 'STU123456',
        university: 'UPSA',
        program: 'Computer Science',
        verified: true
      },
      roommates: [
        {
          name: 'Jane Smith',
          email: 'jane@student.com',
          phone: '+233240000002',
          relationship: 'Friend'
        }
      ],
      pricing: {
        propertyRent: 2700,
        platformCommission: 135,
        platformFixedFee: 100,
        agentFee: 108,
        totalAmount: 3043
      }
    } as PaymentFirstBookingData;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Successful Payment-First Booking Flow', () => {
    it('should complete entire payment-first booking flow successfully', async () => {
      // Arrange: Mock successful payment and booking creation
      mockSupabase.functions.invoke
        .mockResolvedValueOnce({
          data: { success: true, reference: 'test_ref_123456789' },
          error: null
        })
        .mockResolvedValueOnce({
          data: { 
            success: true, 
            data: { 
              id: 'txn_123', 
              channel: 'card',
              status: 'success'
            } 
          },
          error: null
        });

      mockSupabase.from.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { 
                id: 'booking_123',
                confirmation_number: 'ROOMi-1234567890-ABC123'
              },
              error: null
            })
          })
        })
      });

      // Act: Process payment-first booking
      const result = await PaymentFirstBookingService.processPaymentFirstBooking(validBookingData);

      // Assert: Verify successful completion
      expect(result.success).toBe(true);
      expect(result.bookingId).toBe('booking_123');
      expect(result.paymentReference).toBe('test_ref_123456789');
      expect(result.confirmationNumber).toContain('ROOMi-');

      // Verify payment was processed first
      expect(mockSupabase.functions.invoke).toHaveBeenCalledWith(
        'initialize-payment',
        expect.objectContaining({
          body: expect.objectContaining({
            email: 'test@student.com',
            amount: 3043,
            currency: 'GHS'
          })
        })
      );

      // Verify booking was created after payment
      expect(mockSupabase.from).toHaveBeenCalledWith('bookings_enhanced');
    });

    it('should handle roommate insertion correctly', async () => {
      // Arrange: Mock successful flow with roommates
      mockSupabase.functions.invoke
        .mockResolvedValueOnce({ data: { success: true }, error: null })
        .mockResolvedValueOnce({ 
          data: { success: true, data: { id: 'txn_123', channel: 'card' } }, 
          error: null 
        });

      const mockInsert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { id: 'booking_123' },
            error: null
          })
        })
      });

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'bookings_enhanced') {
          return { insert: mockInsert };
        }
        if (table === 'booking_roommates') {
          return { insert: vi.fn().mockResolvedValue({ error: null }) };
        }
        return { insert: vi.fn() };
      });

      // Act: Process booking with roommates
      const result = await PaymentFirstBookingService.processPaymentFirstBooking(validBookingData);

      // Assert: Verify roommates were processed
      expect(result.success).toBe(true);
      expect(mockSupabase.from).toHaveBeenCalledWith('booking_roommates');
    });
  });

  describe('Payment Failure Scenarios', () => {
    it('should not create booking when payment initialization fails', async () => {
      // Arrange: Mock payment initialization failure
      mockSupabase.functions.invoke.mockResolvedValueOnce({
        data: null,
        error: { message: 'Payment service unavailable' }
      });

      // Act: Attempt payment-first booking
      const result = await PaymentFirstBookingService.processPaymentFirstBooking(validBookingData);

      // Assert: Verify no booking was created
      expect(result.success).toBe(false);
      expect(result.error?.type).toBe('payment');
      expect(result.error?.message).toContain('Failed to initialize payment');
      expect(result.bookingId).toBeUndefined();

      // Verify booking creation was never attempted
      expect(mockSupabase.from).not.toHaveBeenCalledWith('bookings_enhanced');
    });

    it('should not create booking when payment verification fails', async () => {
      // Arrange: Mock successful initialization but failed verification
      mockSupabase.functions.invoke
        .mockResolvedValueOnce({
          data: { success: true, reference: 'test_ref_123' },
          error: null
        })
        .mockResolvedValueOnce({
          data: { success: false },
          error: { message: 'Payment verification failed' }
        });

      // Act: Attempt payment-first booking
      const result = await PaymentFirstBookingService.processPaymentFirstBooking(validBookingData);

      // Assert: Verify no booking was created
      expect(result.success).toBe(false);
      expect(result.error?.type).toBe('payment');
      expect(result.bookingId).toBeUndefined();

      // Verify booking creation was never attempted
      expect(mockSupabase.from).not.toHaveBeenCalledWith('bookings_enhanced');
    });

    it('should handle network errors gracefully', async () => {
      // Arrange: Mock network error
      mockSupabase.functions.invoke.mockRejectedValueOnce(
        new Error('Network timeout')
      );

      // Act: Attempt payment-first booking
      const result = await PaymentFirstBookingService.processPaymentFirstBooking(validBookingData);

      // Assert: Verify graceful error handling
      expect(result.success).toBe(false);
      expect(result.error?.type).toBe('service');
      expect(result.error?.retryable).toBe(true);
      expect(result.bookingId).toBeUndefined();
    });
  });

  describe('Data Validation', () => {
    it('should reject booking with invalid property data', async () => {
      // Arrange: Invalid property data
      const invalidData = {
        ...validBookingData,
        property: { ...validBookingData.property, id: '', rent: 0 }
      };

      // Act: Attempt booking with invalid data
      const result = await PaymentFirstBookingService.processPaymentFirstBooking(invalidData);

      // Assert: Verify validation failure
      expect(result.success).toBe(false);
      expect(result.error?.type).toBe('booking');
      expect(result.error?.message).toContain('Property');
    });

    it('should reject booking with invalid student data', async () => {
      // Arrange: Invalid student data
      const invalidData = {
        ...validBookingData,
        student: { ...validBookingData.student, id: '', email: '' }
      };

      // Act: Attempt booking with invalid data
      const result = await PaymentFirstBookingService.processPaymentFirstBooking(invalidData);

      // Assert: Verify validation failure
      expect(result.success).toBe(false);
      expect(result.error?.type).toBe('booking');
      expect(result.error?.message).toContain('Student');
    });

    it('should reject booking with invalid date range', async () => {
      // Arrange: Invalid date range (check-out before check-in)
      const invalidData = {
        ...validBookingData,
        bookingDetails: {
          ...validBookingData.bookingDetails,
          checkInDate: '2024-06-01',
          checkOutDate: '2024-02-01'
        }
      };

      // Act: Attempt booking with invalid dates
      const result = await PaymentFirstBookingService.processPaymentFirstBooking(invalidData);

      // Assert: Verify date validation failure
      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('Check-out date must be after check-in date');
    });

    it('should reject booking with past check-in date', async () => {
      // Arrange: Past check-in date
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      
      const invalidData = {
        ...validBookingData,
        bookingDetails: {
          ...validBookingData.bookingDetails,
          checkInDate: pastDate.toISOString().split('T')[0]
        }
      };

      // Act: Attempt booking with past date
      const result = await PaymentFirstBookingService.processPaymentFirstBooking(invalidData);

      // Assert: Verify past date validation failure
      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('Check-in date cannot be in the past');
    });
  });

  describe('Booking Creation Failures After Successful Payment', () => {
    it('should handle booking creation failure after successful payment', async () => {
      // Arrange: Mock successful payment but failed booking creation
      mockSupabase.functions.invoke
        .mockResolvedValueOnce({
          data: { success: true, reference: 'test_ref_123' },
          error: null
        })
        .mockResolvedValueOnce({
          data: { 
            success: true, 
            data: { id: 'txn_123', channel: 'card' } 
          },
          error: null
        });

      mockSupabase.from.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Database constraint violation' }
            })
          })
        })
      });

      // Act: Attempt booking creation
      const result = await PaymentFirstBookingService.processPaymentFirstBooking(validBookingData);

      // Assert: Verify critical error handling
      expect(result.success).toBe(false);
      expect(result.error?.type).toBe('booking');
      expect(result.error?.message).toContain('Database constraint violation');

      // Verify error was logged for investigation
      expect(logger.error).toHaveBeenCalledWith(
        'Critical error: Booking creation failed after payment',
        expect.objectContaining({
          paymentReference: 'test_ref_123'
        })
      );
    });
  });

  describe('Edge Cases and Error Recovery', () => {
    it('should handle missing emergency contact information', async () => {
      // Arrange: Missing emergency contact
      const invalidData = {
        ...validBookingData,
        studentInfo: {
          ...validBookingData.studentInfo,
          emergencyContactName: '',
          emergencyContactPhone: ''
        }
      };

      // Act: Attempt booking
      const result = await PaymentFirstBookingService.processPaymentFirstBooking(invalidData);

      // Assert: Verify validation failure
      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('Emergency contact information is required');
    });

    it('should handle zero or negative pricing', async () => {
      // Arrange: Invalid pricing
      const invalidData = {
        ...validBookingData,
        pricing: {
          ...validBookingData.pricing,
          totalAmount: 0,
          propertyRent: -100
        }
      };

      // Act: Attempt booking
      const result = await PaymentFirstBookingService.processPaymentFirstBooking(invalidData);

      // Assert: Verify pricing validation failure
      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('Total booking amount must be greater than zero');
    });
  });
});
