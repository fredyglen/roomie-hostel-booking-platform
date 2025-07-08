/**
 * Owner dashboard database queries for ROOMi platform
 * Handles owner-specific statistics and data
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/enhanced-logger';
import { TABLE_NAMES, COLUMN_SELECTIONS } from './standardizedQueries';

export interface OwnerDashboardStats {
  totalProperties: number;
  totalBookings: number;
  monthlyEarnings: number;
  occupancyRate: number;
  averageRating: number;
  totalReviews: number;
  pendingBookings: number;
  confirmedBookings: number;
}

export interface RecentBooking {
  id: string;
  booking_reference: string;
  student_name: string;
  student_email: string;
  property_title: string;
  check_in_date: string;
  check_out_date: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
}

export interface PropertyPerformance {
  id: string;
  title: string;
  occupancy_rate: number;
  total_earnings: number;
  total_bookings: number;
  current_occupancy: number;
  max_occupancy: number;
  is_available: boolean;
}

export class OwnerQueries {
  /**
   * Get comprehensive dashboard statistics for an owner
   */
  static async getDashboardStats(ownerId: string): Promise<OwnerDashboardStats> {
    try {
      // Get total properties count
      const { count: totalProperties, error: propertiesError } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', ownerId);

      if (propertiesError) throw propertiesError;

      // Get total bookings count
      const { count: totalBookings, error: bookingsError } = await supabase
        .from('bookings_enhanced')
        .select('*', { count: 'exact', head: true })
        .eq('property_owner_id', ownerId);

      if (bookingsError) throw bookingsError;

      // Get pending bookings count
      const { count: pendingBookings, error: pendingError } = await supabase
        .from('bookings_enhanced')
        .select('*', { count: 'exact', head: true })
        .eq('property_owner_id', ownerId)
        .eq('status', 'pending');

      if (pendingError) throw pendingError;

      // Get confirmed bookings count
      const { count: confirmedBookings, error: confirmedError } = await supabase
        .from('bookings_enhanced')
        .select('*', { count: 'exact', head: true })
        .eq('property_owner_id', ownerId)
        .eq('status', 'confirmed');

      if (confirmedError) throw confirmedError;

      // Get monthly earnings (current month)
      const currentMonth = new Date();
      const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

      const { data: earningsData, error: earningsError } = await supabase
        .from('bookings_enhanced')
        .select('total_amount')
        .eq('property_owner_id', ownerId)
        .eq('status', 'confirmed')
        .gte('created_at', firstDayOfMonth.toISOString())
        .lte('created_at', lastDayOfMonth.toISOString());

      if (earningsError) throw earningsError;

      const monthlyEarnings = earningsData?.reduce((sum, booking) => sum + booking.total_amount, 0) || 0;

      // Apple-grade occupancy rate calculation with proper type safety
      // Note: Using max_occupants and beds_available from actual Supabase schema
      const { data: propertiesData, error: occupancyError } = await supabase
        .from('properties')
        .select('max_occupants, beds_available, bedrooms')
        .eq('owner_id', ownerId);

      if (occupancyError) {
        logger.error('Error fetching property occupancy data', { error: occupancyError, ownerId });
        throw occupancyError;
      }

      let totalOccupied = 0;
      let totalCapacity = 0;

      // Type-safe occupancy calculation following BE CONSCIOUS standards
      // Using available schema columns: max_occupants and beds_available
      propertiesData?.forEach(property => {
        const maxOccupants = typeof property.max_occupants === 'number' ? property.max_occupants : 0;
        const bedsAvailable = typeof property.beds_available === 'number' ? property.beds_available : 0;
        const currentOccupancy = maxOccupants - bedsAvailable; // Calculate current occupancy from available beds
        totalOccupied += currentOccupancy;
        totalCapacity += maxOccupants;
      });

      const occupancyRate = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;

      // TODO: Implement reviews system
      const averageRating = 4.5; // Placeholder
      const totalReviews = 0; // Placeholder

      const stats: OwnerDashboardStats = {
        totalProperties: totalProperties || 0,
        totalBookings: totalBookings || 0,
        monthlyEarnings,
        occupancyRate,
        averageRating,
        totalReviews,
        pendingBookings: pendingBookings || 0,
        confirmedBookings: confirmedBookings || 0,
      };

      logger.info('Owner dashboard stats fetched successfully', { ownerId, stats });
      return stats;
    } catch (error) {
      logger.error('Failed to fetch owner dashboard stats', { error, ownerId });
      throw error;
    }
  }

  /**
   * Apple-grade recent bookings query with proper type safety
   */
  static async getRecentBookings(ownerId: string, limit: number = 5): Promise<RecentBooking[]> {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAMES.BOOKINGS)
        .select(`
          id,
          booking_reference,
          check_in_date,
          check_out_date,
          total_amount,
          status,
          created_at,
          properties (
            title
          )
        `)
        .eq('property_owner_id', ownerId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        logger.error('Error fetching recent bookings', { error, ownerId });
        throw error;
      }

      const recentBookings: RecentBooking[] = data?.map(booking => ({
        id: booking.id,
        booking_reference: booking.booking_reference,
        student_name: 'Student', // Placeholder since student_name doesn't exist in bookings table
        student_email: 'student@example.com', // Placeholder until we have email in bookings
        property_title: booking.properties?.title || 'Unknown Property',
        check_in_date: booking.check_in_date,
        check_out_date: booking.check_out_date,
        total_amount: booking.total_amount,
        status: booking.status,
        payment_status: 'pending', // Placeholder until we have payment_status
        created_at: booking.created_at,
      })) || [];

      logger.info('Recent bookings fetched successfully', { ownerId, bookingsCount: recentBookings.length });
      return recentBookings;
    } catch (error) {
      logger.error('Failed to fetch recent bookings', { error, ownerId });
      throw error;
    }
  }

  /**
   * Get property performance data for an owner
   */
  static async getPropertyPerformance(ownerId: string, limit: number = 5): Promise<PropertyPerformance[]> {
    try {
      const { data: propertiesData, error: propertiesError } = await supabase
        .from(TABLE_NAMES.PROPERTIES)
        .select(`
          id,
          title,
          max_occupants,
          beds_available,
          is_available
        `)
        .eq('owner_id', ownerId)
        .limit(limit);

      if (propertiesError) {
        logger.error('Error fetching properties for performance analysis', { error: propertiesError, ownerId });
        throw propertiesError;
      }

      const performanceData: PropertyPerformance[] = [];

      for (const property of propertiesData || []) {
        // Apple-grade earnings calculation with proper error handling
        const { data: earningsData, error: earningsError } = await supabase
          .from(TABLE_NAMES.BOOKINGS)
          .select('total_amount')
          .eq('property_id', property.id)
          .eq('status', 'confirmed');

        if (earningsError) {
          logger.warn('Error fetching earnings for property', { propertyId: property.id, error: earningsError });
        }

        const totalEarnings = earningsData?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0;

        // Apple-grade bookings count with proper error handling
        const { count: totalBookings, error: bookingsError } = await supabase
          .from(TABLE_NAMES.BOOKINGS)
          .select('*', { count: 'exact', head: true })
          .eq('property_id', property.id);

        if (bookingsError) {
          logger.warn('Error fetching bookings count for property', { propertyId: property.id, error: bookingsError });
        }

        // Apple-grade type-safe occupancy calculation using available schema columns
        const maxOccupants = typeof property.max_occupants === 'number' ? property.max_occupants : 0;
        const bedsAvailable = typeof property.beds_available === 'number' ? property.beds_available : 0;
        const currentOccupancy = maxOccupants - bedsAvailable; // Calculate current occupancy
        const occupancyRate = maxOccupants > 0
          ? Math.round((currentOccupancy / maxOccupants) * 100)
          : 0;

        performanceData.push({
          id: property.id,
          title: property.title,
          occupancy_rate: occupancyRate,
          total_earnings: totalEarnings,
          total_bookings: totalBookings || 0,
          current_occupancy: currentOccupancy,
          max_occupancy: maxOccupants,
          is_available: property.is_available,
        });
      }

      logger.info('Property performance data fetched successfully', { ownerId, propertiesCount: performanceData.length });
      return performanceData;
    } catch (error) {
      logger.error('Failed to fetch property performance', { error, ownerId });
      throw error;
    }
  }
}
