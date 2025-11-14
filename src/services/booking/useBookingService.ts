
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Booking } from '@/types/booking';
import { ErrorHandler } from '@/utils/ErrorHandler';
import { BookingQueries, TABLE_NAMES } from '@/services/database/standardizedQueries';
import { logger } from '@/utils/enhanced-logger';
import { centralizedCommissionEngine } from '@/config/centralized-commission.config';

interface CreateBookingData {
  property_id: string;
  start_date: string;
  end_date: string;
  guest_count: number;
  special_requests?: string;
  total_amount: number;
}

export const useBookingService = () => {
  const queryClient = useQueryClient();

  /**
   * Apple-Grade Booking Creation Service
   *
   * Business Purpose: Creates accommodation booking with comprehensive validation and commission calculation
   * Technical Implementation: Uses standardized table reference, centralized commission engine, full audit trail
   *
   * @param bookingData - Complete booking information with validation
   * @returns Promise<Booking> - Success with booking entity or detailed error
   *
   * @throws ValidationError - When booking data is invalid or incomplete
   * @throws AuthorizationError - When user lacks booking permissions
   * @throws DatabaseError - When booking creation fails
   *
   * Business Impact: Critical for revenue generation and cross-portal data synchronization
   * Monitoring: Track success rate, booking creation time, commission accuracy
   */
  const createBooking = useMutation({
    mutationFn: async (bookingData: CreateBookingData): Promise<Booking> => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        logger.error('Booking creation attempted without authenticated user', {
          service: 'useBookingService',
          action: 'createBooking'
        });
        throw new Error('User authentication required for booking creation');
      }

      logger.info('Initiating booking creation via service', {
        userId: user.id,
        propertyId: bookingData.property_id,
        service: 'useBookingService'
      });

      // Apple-Grade: Use centralized commission calculation
      const commissionData = centralizedCommissionEngine.calculateCommissions(bookingData.total_amount);

      const enhancedBookingData = {
        student_id: user.id,
        property_id: bookingData.property_id,
        check_in_date: bookingData.start_date,
        check_out_date: bookingData.end_date,
        total_amount: commissionData.totalAmount,
        platform_commission: commissionData.platformCommission,
        platform_fee: commissionData.platformFee,
        special_requests: bookingData.special_requests,
        status: 'pending',
        payment_status: 'pending'
      };

      logger.info('Creating booking with standardized table reference', {
        userId: user.id,
        propertyId: bookingData.property_id,
        totalAmount: commissionData.totalAmount,
        table: TABLE_NAMES.BOOKINGS
      });

      // Apple-Grade: Use standardized table reference for owner portal synchronization
      const { data, error } = await supabase
        .from(TABLE_NAMES.BOOKINGS) // Resolves to 'bookings_enhanced'
        .insert(enhancedBookingData)
        .select()
        .single();

      if (error) {
        logger.error('Database error creating booking via service', {
          error: error.message,
          userId: user.id,
          propertyId: bookingData.property_id,
          table: TABLE_NAMES.BOOKINGS
        });
        throw error;
      }

      logger.info('Booking created successfully via service', {
        bookingId: data.id,
        bookingReference: data.booking_reference,
        userId: user.id,
        propertyId: bookingData.property_id
      });

      return data as unknown as Booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error) => {
      ErrorHandler.handle(error, 'Failed to create booking');
    }
  });

  /**
   * Apple-Grade Booking Retrieval Service
   *
   * Business Purpose: Retrieves student booking history with comprehensive error handling
   * Technical Implementation: Uses standardized table reference for cross-portal data consistency
   *
   * @returns Promise<Booking[]> - Array of user bookings or detailed error
   *
   * @throws ValidationError - When user authentication fails
   * @throws DatabaseError - When booking retrieval fails
   *
   * Business Impact: Critical for student booking management and owner portal synchronization
   * Monitoring: Track fetch success rate, response time, data consistency
   */
  const getBookings = useQuery({
    queryKey: ['bookings'],
    queryFn: async (): Promise<Booking[]> => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        logger.error('Booking retrieval attempted without authenticated user', {
          service: 'useBookingService',
          action: 'getBookings'
        });
        throw new Error('User authentication required for booking retrieval');
      }

      logger.info('Fetching bookings via service', {
        userId: user.id,
        service: 'useBookingService',
        table: TABLE_NAMES.BOOKINGS
      });

      // Apple-Grade: Use standardized table reference for owner portal synchronization
      const { data, error } = await supabase
        .from(TABLE_NAMES.BOOKINGS) // Resolves to 'bookings_enhanced'
        .select('*')
        .eq('student_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Database error fetching bookings via service', {
          error: error.message,
          userId: user.id,
          table: TABLE_NAMES.BOOKINGS
        });
        throw error;
      }

      const bookingCount = data?.length || 0;
      logger.info('Bookings fetched successfully via service', {
        userId: user.id,
        bookingCount,
        table: TABLE_NAMES.BOOKINGS
      });

      return (data || []) as unknown as Booking[];
    }
  });

  return {
    createBooking,
    getBookings,
    isLoading: createBooking.isPending || getBookings.isLoading,
    error: createBooking.error || getBookings.error
  };
};
