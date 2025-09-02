
// ROOMi Booking Service
// Handles all booking-related database operations for Ghana hostel bookings

import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { centralizedCommissionEngine } from '@/config/centralized-commission.config';

type BookingEnhanced = Database['public']['Tables']['bookings_enhanced']['Row'];
type BookingInsert = Database['public']['Tables']['bookings_enhanced']['Insert'];
type BookingUpdate = Database['public']['Tables']['bookings_enhanced']['Update'];

/**
 * Type-safe booking metadata interface
 */
export interface BookingMetadata {
  readonly source?: 'web' | 'mobile' | 'admin';
  readonly booking_source?: 'web' | 'mobile' | 'admin';
  readonly referral_code?: string;
  readonly special_instructions?: string;
  readonly payment_plan?: 'full' | 'installment';
  readonly emergency_contact_verified?: boolean;
  readonly university_verification_status?: 'pending' | 'verified' | 'failed';
  readonly student_verification_status?: 'pending' | 'verified' | 'failed';
  readonly booking_channel?: 'direct' | 'agent' | 'partner';
  readonly discount_applied?: {
    readonly code: string;
    readonly amount: number;
    readonly type: 'percentage' | 'fixed';
  };
  readonly additional_services?: readonly string[];
  readonly property_title?: string;
  readonly furnishing?: string;
  readonly floor?: string;
}

export interface CreateBookingData {
  // Property and Student Info
  property_id: string;
  student_id: string;
  property_owner_id?: string;
  agent_id?: string;

  // Booking Details
  check_in_date: string;
  check_out_date: string;
  semester_period?: string;
  room_type?: string;
  bed_number?: number;
  roommates_count?: number;

  // Pricing
  total_amount: number;
  property_rent: number;
  platform_fee: number;
  agent_fee?: number;

  // Student Information
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  student_id_number?: string;
  university?: string;
  program?: string;

  // Payment Info
  payment_method?: string;
  mobile_money_network?: string;
  mobile_money_number?: string;

  // Additional
  special_requests?: string;
  metadata?: BookingMetadata;
}

export interface RoommateData {
  roommate_name: string;
  roommate_email?: string;
  roommate_phone?: string;
  roommate_student_id?: string;
  is_primary_booker?: boolean;
  payment_responsibility?: 'individual' | 'shared' | 'primary_pays';
  payment_amount?: number;
}

export class BookingService {

  /**
   * Create a new booking with roommates
   */
  static async createBooking(
    bookingData: CreateBookingData,
    roommates: RoommateData[] = []
  ): Promise<{ booking: BookingEnhanced; booking_id: string }> {
    try {
      // Insert main booking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings_enhanced')
        .insert({
          property_id: bookingData.property_id,
          student_id: bookingData.student_id,
          property_owner_id: bookingData.property_owner_id,
          agent_id: bookingData.agent_id,
          check_in_date: bookingData.check_in_date,
          check_out_date: bookingData.check_out_date,
          semester_period: bookingData.semester_period,
          room_type: bookingData.room_type,
          bed_number: bookingData.bed_number,
          roommates_count: bookingData.roommates_count || 1,
          total_amount: bookingData.total_amount,
          property_rent: bookingData.property_rent,
          platform_fee: bookingData.platform_fee,
          agent_fee: bookingData.agent_fee || 0,
          emergency_contact_name: bookingData.emergency_contact_name,
          emergency_contact_phone: bookingData.emergency_contact_phone,
          emergency_contact_relationship: bookingData.emergency_contact_relationship,
          student_id_number: bookingData.student_id_number,
          university: bookingData.university,
          program: bookingData.program,
          payment_method: bookingData.payment_method,
          mobile_money_network: bookingData.mobile_money_network,
          mobile_money_number: bookingData.mobile_money_number,
          special_requests: bookingData.special_requests,
          metadata: bookingData.metadata,
          status: 'pending',
          payment_status: 'pending',
          student_verification_status: 'pending'
        })
        .select()
        .single();

      if (bookingError) {
        throw new Error(`Failed to create booking: ${bookingError.message}`);
      }

      // Insert roommates if any
      if (roommates.length > 0) {
        const roommateInserts = roommates.map(roommate => ({
          booking_id: booking.id,
          ...roommate
        }));

        const { error: roommatesError } = await supabase
          .from('booking_roommates')
          .insert(roommateInserts);

        if (roommatesError) {
          console.error('Failed to insert roommates:', roommatesError);
          // Don't throw here, booking is already created
        }
      }

      return { booking, booking_id: booking.id };
    } catch (error) {
      console.error('BookingService.createBooking error:', error);
      throw error;
    }
  }

  /**
   * Update booking payment information
   */
  static async updateBookingPayment(
    bookingId: string,
    paymentData: {
      payment_status?: string;
      paystack_reference?: string;
      paystack_access_code?: string;
      payment_reference?: string;
      transaction_reference?: string;
      metadata?: BookingMetadata;
    }
  ): Promise<BookingEnhanced> {
    try {
      const { data: booking, error } = await supabase
        .from('bookings_enhanced')
        .update({
          ...paymentData,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update booking payment: ${error.message}`);
      }

      return booking;
    } catch (error) {
      console.error('BookingService.updateBookingPayment error:', error);
      throw error;
    }
  }

  /**
   * Calculate booking pricing based on ROOMi business model
   * ✅ CENTRALIZED COMMISSION CALCULATION - Using single source of truth
   */
  static calculateBookingPricing(
    propertyRent: number,
    hasAgent: boolean = false
  ): {
    propertyRent: number;
    platformCommission: number;
    platformFixedFee: number;
    agentFee: number;
    totalPlatformFee: number;
    totalAmount: number;
    ownerReceives: number;
  } {
    // ✅ CENTRALIZED COMMISSION CALCULATION - Using single source of truth
    const commissionResult = centralizedCommissionEngine.calculateCommissions(propertyRent, hasAgent);

    const totalPlatformFee = commissionResult.platformCommission + commissionResult.platformFixedFee;

    return {
      propertyRent: commissionResult.baseAmount,
      platformCommission: commissionResult.platformCommission,
      platformFixedFee: commissionResult.platformFixedFee,
      agentFee: commissionResult.agentCommission,
      totalPlatformFee,
      totalAmount: commissionResult.totalAmount,
      ownerReceives: commissionResult.ownerReceives
    };
  }

  /**
   * Generate unique booking reference
   */
  static generateBookingReference(): string {
    const now = new Date();
    const year = now.getFullYear();
    const dayOfYear = Math.floor((now.getTime() - new Date(year, 0, 0).getTime()) / 86400000);
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();

    return `BK-${year}-${dayOfYear.toString().padStart(3, '0')}-${hour}${minute}-${random}`;
  }
}

export default BookingService;
