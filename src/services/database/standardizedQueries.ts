/**
 * Standardized database queries for ROOMi platform
 * This file centralizes all database table names and query patterns
 * to ensure consistency across the application
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/enhanced-logger';

// Standardized table names - use these throughout the application
export const TABLE_NAMES = {
  PROPERTIES: 'properties',
  BOOKINGS: 'bookings', // Use the main bookings table, not bookings_enhanced
  PROFILES: 'profiles',
  ROOMS: 'rooms',
  BEDS: 'beds',
  PROPERTY_VERIFICATIONS: 'property_verifications',
  PROPERTY_VISIBILITY_LOG: 'property_visibility_log',
  AGENT_PROPERTIES: 'agent_properties',
  BOOKING_ROOMMATES: 'booking_roommates'
} as const;

// Standardized column selections for consistent data fetching
export const COLUMN_SELECTIONS = {
  PROPERTIES_BASIC: `
    id,
    owner_id,
    agent_id,
    title,
    description,
    property_type,
    property_category,
    address,
    city,
    state,
    zip,
    base_price_per_semester,
    price_currency,
    is_available,
    gender_type,
    max_occupancy,
    current_occupancy,
    amenities,
    images,
    cover_image_url,
    verification_status,
    created_at,
    updated_at
  `,
  
  PROPERTIES_WITH_OWNER: `
    id,
    owner_id,
    agent_id,
    title,
    description,
    property_type,
    property_category,
    address,
    city,
    state,
    zip,
    base_price_per_semester,
    price_currency,
    is_available,
    gender_type,
    max_occupancy,
    current_occupancy,
    amenities,
    images,
    cover_image_url,
    verification_status,
    created_at,
    updated_at,
    profiles!properties_owner_id_fkey (
      id,
      first_name,
      last_name,
      email,
      phone
    )
  `,
  
  BOOKINGS_BASIC: `
    id,
    booking_reference,
    student_id,
    property_id,
    property_owner_id,
    agent_id,
    room_id,
    bed_id,
    check_in_date,
    check_out_date,
    total_amount,
    platform_commission,
    platform_fee,
    status,
    payment_status,
    payment_reference,
    paystack_reference,
    student_name,
    student_email,
    student_phone,
    created_at,
    updated_at
  `,
  
  BOOKINGS_WITH_PROPERTY: `
    id,
    booking_reference,
    student_id,
    property_id,
    property_owner_id,
    agent_id,
    room_id,
    bed_id,
    check_in_date,
    check_out_date,
    total_amount,
    platform_commission,
    platform_fee,
    status,
    payment_status,
    payment_reference,
    paystack_reference,
    student_name,
    student_email,
    student_phone,
    created_at,
    updated_at,
    properties!bookings_property_id_fkey (
      title,
      address,
      city,
      property_category
    )
  `
} as const;

/**
 * Standardized property queries
 */
export class PropertyQueries {
  static async getAvailableProperties(options: {
    limit?: number;
    offset?: number;
    city?: string;
    priceRange?: { min: number; max: number };
    genderType?: string;
  } = {}) {
    try {
      let query = supabase
        .from(TABLE_NAMES.PROPERTIES)
        .select(COLUMN_SELECTIONS.PROPERTIES_WITH_OWNER, { count: 'exact' })
        .eq('is_available', true)
        .eq('verification_status', 'verified');

      // Apply filters
      if (options.city) {
        query = query.ilike('city', `%${options.city}%`);
      }
      
      if (options.priceRange) {
        query = query
          .gte('base_price_per_semester', options.priceRange.min)
          .lte('base_price_per_semester', options.priceRange.max);
      }
      
      if (options.genderType && options.genderType !== 'mixed') {
        query = query.in('gender_type', [options.genderType, 'mixed']);
      }

      // Apply pagination
      if (options.limit) {
        query = query.limit(options.limit);
      }
      
      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) {
        logger.error('Error fetching properties', { error, options });
        throw error;
      }

      return {
        properties: data || [],
        totalCount: count || 0,
        hasMore: (count || 0) > (options.offset || 0) + (data?.length || 0)
      };
    } catch (error) {
      logger.error('Exception in getAvailableProperties', { error, options });
      throw error;
    }
  }

  static async getPropertyById(id: string) {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAMES.PROPERTIES)
        .select(COLUMN_SELECTIONS.PROPERTIES_WITH_OWNER)
        .eq('id', id)
        .single();

      if (error) {
        logger.error('Error fetching property by ID', { error, id });
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('Exception in getPropertyById', { error, id });
      throw error;
    }
  }

  static async getPropertiesByOwner(ownerId: string) {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAMES.PROPERTIES)
        .select(COLUMN_SELECTIONS.PROPERTIES_BASIC)
        .eq('owner_id', ownerId)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Error fetching properties by owner', { error, ownerId });
        throw error;
      }

      return data || [];
    } catch (error) {
      logger.error('Exception in getPropertiesByOwner', { error, ownerId });
      throw error;
    }
  }
}

/**
 * Standardized booking queries
 */
export class BookingQueries {
  static async getBookingsByStudent(studentId: string) {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAMES.BOOKINGS)
        .select(COLUMN_SELECTIONS.BOOKINGS_WITH_PROPERTY)
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Error fetching bookings by student', { error, studentId });
        throw error;
      }

      return data || [];
    } catch (error) {
      logger.error('Exception in getBookingsByStudent', { error, studentId });
      throw error;
    }
  }

  static async getBookingsByProperty(propertyId: string) {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAMES.BOOKINGS)
        .select(COLUMN_SELECTIONS.BOOKINGS_BASIC)
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Error fetching bookings by property', { error, propertyId });
        throw error;
      }

      return data || [];
    } catch (error) {
      logger.error('Exception in getBookingsByProperty', { error, propertyId });
      throw error;
    }
  }

  static async createBooking(bookingData: {
    student_id: string;
    property_id: string;
    property_owner_id: string;
    agent_id?: string;
    room_id: string;
    bed_id: string;
    check_in_date: string;
    check_out_date: string;
    total_amount: number;
    student_name: string;
    student_email: string;
    student_phone: string;
    special_requests?: string;
  }) {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAMES.BOOKINGS)
        .insert({
          ...bookingData,
          platform_commission: bookingData.total_amount * 0.05, // 5% commission
          platform_fee: 100, // 100 GHS platform fee
          status: 'pending',
          payment_status: 'pending'
        })
        .select(COLUMN_SELECTIONS.BOOKINGS_BASIC)
        .single();

      if (error) {
        logger.error('Error creating booking', { error, bookingData });
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('Exception in createBooking', { error, bookingData });
      throw error;
    }
  }
}

/**
 * Standardized admin queries
 */
export class AdminQueries {
  static async getPlatformStats() {
    try {
      const [propertiesResult, bookingsResult, usersResult] = await Promise.all([
        supabase.from(TABLE_NAMES.PROPERTIES).select('id', { count: 'exact' }),
        supabase.from(TABLE_NAMES.BOOKINGS).select('id', { count: 'exact' }),
        supabase.from(TABLE_NAMES.PROFILES).select('id', { count: 'exact' })
      ]);

      // Get pending verifications count
      const { count: pendingVerificationsCount } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('verification_status', 'pending');

      // Get active disputes count (using bookings with disputed status)
      const { count: activeDisputesCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'disputed');

      return {
        totalProperties: propertiesResult.count || 0,
        totalBookings: bookingsResult.count || 0,
        totalUsers: usersResult.count || 0,
        pendingVerifications: pendingVerificationsCount || 0,
        activeDisputes: activeDisputesCount || 0
      };
    } catch (error) {
      logger.error('Exception in getPlatformStats', { error });
      throw error;
    }
  }
}
