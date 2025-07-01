/**
 * Owner dashboard database queries for ROOMi platform
 * Handles owner-specific statistics and data
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/enhanced-logger';

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
  beds_available: number | null;
  max_occupants: number | null;
  is_available: boolean | null;
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
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('property_owner_id', ownerId);

      if (bookingsError) throw bookingsError;

      // Get pending bookings count
      const { count: pendingBookings, error: pendingError } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('property_owner_id', ownerId)
        .eq('status', 'pending');

      if (pendingError) throw pendingError;

      // Get confirmed bookings count
      const { count: confirmedBookings, error: confirmedError } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('property_owner_id', ownerId)
        .eq('status', 'confirmed');

      if (confirmedError) throw confirmedError;

      // Get monthly earnings (current month)
      const currentMonth = new Date();
      const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

      const { data: earningsData, error: earningsError } = await supabase
        .from('bookings')
        .select('total_amount')
        .eq('property_owner_id', ownerId)
        .eq('payment_status', 'paid')
        .gte('created_at', firstDayOfMonth.toISOString())
        .lte('created_at', lastDayOfMonth.toISOString());

      if (earningsError) throw earningsError;

      const monthlyEarnings = earningsData?.reduce((sum, booking) => sum + booking.total_amount, 0) || 0;

      // Calculate occupancy rate using available beds and max occupants
      const { data: propertiesData, error: occupancyError } = await supabase
        .from('properties')
        .select('beds_available, max_occupants')
        .eq('owner_id', ownerId);

      if (occupancyError) throw occupancyError;

      let totalAvailable = 0;
      let totalCapacity = 0;

      propertiesData?.forEach(property => {
        totalAvailable += property.beds_available || 0;
        totalCapacity += property.max_occupants || 0;
      });

      // Calculate occupancy as (capacity - available) / capacity
      const totalOccupied = totalCapacity - totalAvailable;
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
   * Get recent bookings for an owner
   */
  static async getRecentBookings(ownerId: string, limit: number = 5): Promise<RecentBooking[]> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          booking_reference,
          student_name,
          student_email,
          check_in_date,
          check_out_date,
          total_amount,
          status,
          payment_status,
          created_at,
          properties!bookings_property_id_fkey (
            title
          )
        `)
        .eq('property_owner_id', ownerId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      const recentBookings: RecentBooking[] = data?.map(booking => ({
        id: booking.id,
        booking_reference: booking.booking_reference,
        student_name: booking.student_name,
        student_email: booking.student_email,
        property_title: booking.properties?.title || 'Unknown Property',
        check_in_date: booking.check_in_date,
        check_out_date: booking.check_out_date,
        total_amount: booking.total_amount,
        status: booking.status,
        payment_status: booking.payment_status,
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
        .from('properties')
        .select(`
          id,
          title,
          beds_available,
          max_occupants,
          is_available
        `)
        .eq('owner_id', ownerId)
        .limit(limit);

      if (propertiesError) throw propertiesError;

      const performanceData: PropertyPerformance[] = [];

      for (const property of propertiesData || []) {
        // Get total earnings for this property
        const { data: earningsData, error: earningsError } = await supabase
          .from('bookings')
          .select('total_amount')
          .eq('property_id', property.id)
          .eq('payment_status', 'paid');

        if (earningsError) {
          logger.warn('Error fetching earnings for property', { propertyId: property.id, error: earningsError });
        }

        const totalEarnings = earningsData?.reduce((sum, booking) => sum + booking.total_amount, 0) || 0;

        // Get total bookings count for this property
        const { count: totalBookings, error: bookingsError } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .eq('property_id', property.id);

        if (bookingsError) {
          logger.warn('Error fetching bookings count for property', { propertyId: property.id, error: bookingsError });
        }

        const maxOccupants = property.max_occupants || 0;
        const bedsAvailable = property.beds_available || 0;
        const currentOccupancy = maxOccupants - bedsAvailable;
        const occupancyRate = maxOccupants > 0
          ? Math.round((currentOccupancy / maxOccupants) * 100)
          : 0;

        performanceData.push({
          id: property.id,
          title: property.title,
          occupancy_rate: occupancyRate,
          total_earnings: totalEarnings,
          total_bookings: totalBookings || 0,
          beds_available: property.beds_available,
          max_occupants: property.max_occupants,
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
