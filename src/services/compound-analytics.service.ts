/**
 * Compound Analytics Service
 * 
 * Provides business-grade analytics for compound management.
 * Aggregates metrics across multiple properties within a compound.
 * 
 * Design Principles:
 * - Real-time data from Supabase
 * - Efficient joins to minimize queries
 * - Type-safe interfaces
 * - Comprehensive error handling
 */

import { supabase } from '@/lib/supabase';
import { enhancedLogger as logger } from '@/services/monitoring/enhanced-logger';

// =====================================================
// TYPESCRIPT INTERFACES
// =====================================================

export interface CompoundMetrics {
  compound_id: string;
  compound_name: string;
  total_properties: number;
  total_revenue: number; // This month
  total_revenue_all_time: number;
  average_occupancy: number; // Percentage
  total_bookings: number;
  total_beds: number;
  total_beds_available: number;
  total_beds_occupied: number;
  properties_count: number;
}

export interface CompoundPropertyMetrics {
  property_id: string;
  property_name: string;
  block_identifier: string;
  revenue_this_month: number;
  revenue_all_time: number;
  occupancy_rate: number;
  total_bookings: number;
  total_beds: number;
  beds_available: number;
  beds_occupied: number;
  average_rating: number | null;
  is_available: boolean;
}

export interface PropertyComparison {
  property_id: string;
  property_name: string;
  block_identifier: string;
  revenue: number;
  occupancy: number;
  bookings: number;
  rating: number | null;
}

export interface RevenueHistoryPoint {
  month: string; // Format: "2025-01"
  property_id: string;
  property_name: string;
  revenue: number;
}

export interface CompoundRevenueHistory {
  months: string[]; // ["2025-01", "2025-02", ...]
  properties: Array<{
    property_id: string;
    property_name: string;
    data: number[]; // Revenue for each month
  }>;
  total_by_month: number[]; // Aggregated total for each month
}

// =====================================================
// COMPOUND ANALYTICS SERVICE
// =====================================================

export class CompoundAnalyticsService {
  /**
   * Get aggregated metrics for a compound
   */
  static async getCompoundMetrics(compoundId: string): Promise<CompoundMetrics | null> {
    try {
      logger.info('Fetching compound metrics', { compoundId });

      // Get compound basic info
      const { data: compound, error: compoundError } = await supabase
        .from('compounds')
        .select('id, name, total_properties, total_rooms, total_beds, occupancy_rate')
        .eq('id', compoundId)
        .single();

      if (compoundError) throw compoundError;
      if (!compound) return null;

      // Get all properties in compound with their metrics
      const { data: properties, error: propertiesError } = await supabase
        .from('compound_properties')
        .select(`
          property_id,
          properties (
            id,
            title,
            max_occupants,
            current_occupancy
          )
        `)
        .eq('compound_id', compoundId);

      if (propertiesError) throw propertiesError;

      const propertyIds = properties?.map((cp: any) => cp.property_id) || [];

      // Get bookings for revenue calculation (this month)
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings_enhanced')
        .select('property_id, total_amount, created_at')
        .in('property_id', propertyIds)
        .gte('created_at', startOfMonth.toISOString())
        .in('status', ['ACTIVE', 'PAYMENT_CONFIRMED']);

      if (bookingsError) throw bookingsError;

      // Get all-time bookings
      const { data: allBookings, error: allBookingsError } = await supabase
        .from('bookings_enhanced')
        .select('property_id, total_amount')
        .in('property_id', propertyIds)
        .in('status', ['ACTIVE', 'PAYMENT_CONFIRMED', 'COMPLETED']);

      if (allBookingsError) throw allBookingsError;

      // Get bed availability
      const { data: beds, error: bedsError } = await supabase
        .from('beds')
        .select('property_id, is_occupied, is_reserved')
        .in('property_id', propertyIds);

      if (bedsError) throw bedsError;

      // Calculate metrics
      const totalRevenueThisMonth = bookings?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0;
      const totalRevenueAllTime = allBookings?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0;
      const totalBookings = allBookings?.length || 0;

      const totalBeds = beds?.length || 0;
      const totalBedsOccupied = beds?.filter(b => b.is_occupied || b.is_reserved).length || 0;
      const totalBedsAvailable = totalBeds - totalBedsOccupied;
      const averageOccupancy = totalBeds > 0 ? (totalBedsOccupied / totalBeds) * 100 : 0;

      const metrics: CompoundMetrics = {
        compound_id: compound.id,
        compound_name: compound.name,
        total_properties: properties?.length || 0,
        total_revenue: totalRevenueThisMonth,
        total_revenue_all_time: totalRevenueAllTime,
        average_occupancy: Math.round(averageOccupancy * 10) / 10, // Round to 1 decimal
        total_bookings: totalBookings,
        total_beds: totalBeds,
        total_beds_available: totalBedsAvailable,
        total_beds_occupied: totalBedsOccupied,
        properties_count: properties?.length || 0,
      };

      logger.info('Compound metrics calculated', { compoundId, metrics });
      return metrics;
    } catch (error) {
      logger.error('Failed to fetch compound metrics', { compoundId, error });
      return null;
    }
  }

  /**
   * Get individual property metrics within a compound
   */
  static async getCompoundProperties(compoundId: string): Promise<CompoundPropertyMetrics[]> {
    try {
      logger.info('Fetching compound properties with metrics', { compoundId });

      // Get properties in compound
      const { data: compoundProperties, error: cpError } = await supabase
        .from('compound_properties')
        .select(`
          property_id,
          block_identifier,
          properties (
            id,
            title,
            max_occupants,
            current_occupancy,
            is_available
          )
        `)
        .eq('compound_id', compoundId)
        .order('display_order');

      if (cpError) throw cpError;
      if (!compoundProperties || compoundProperties.length === 0) return [];

      const propertyIds = compoundProperties.map((cp: any) => cp.property_id);

      // Get bookings for each property (this month)
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: bookingsThisMonth } = await supabase
        .from('bookings_enhanced')
        .select('property_id, total_amount')
        .in('property_id', propertyIds)
        .gte('created_at', startOfMonth.toISOString())
        .in('status', ['ACTIVE', 'PAYMENT_CONFIRMED']);

      const { data: allBookings } = await supabase
        .from('bookings_enhanced')
        .select('property_id, total_amount')
        .in('property_id', propertyIds)
        .in('status', ['ACTIVE', 'PAYMENT_CONFIRMED', 'COMPLETED']);

      // Get beds for each property
      const { data: beds } = await supabase
        .from('beds')
        .select('property_id, is_occupied, is_reserved')
        .in('property_id', propertyIds);

      // Calculate metrics for each property
      const propertiesWithMetrics: CompoundPropertyMetrics[] = compoundProperties.map((cp: any) => {
        const property = cp.properties;
        const propertyId = cp.property_id;

        const revenueThisMonth = bookingsThisMonth
          ?.filter(b => b.property_id === propertyId)
          .reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0;

        const revenueAllTime = allBookings
          ?.filter(b => b.property_id === propertyId)
          .reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0;

        const totalBookings = allBookings?.filter(b => b.property_id === propertyId).length || 0;

        const propertyBeds = beds?.filter(b => b.property_id === propertyId) || [];
        const totalBeds = propertyBeds.length;
        const bedsOccupied = propertyBeds.filter(b => b.is_occupied || b.is_reserved).length;
        const bedsAvailable = totalBeds - bedsOccupied;
        const occupancyRate = totalBeds > 0 ? (bedsOccupied / totalBeds) * 100 : 0;

        return {
          property_id: propertyId,
          property_name: property.title,
          block_identifier: cp.block_identifier,
          revenue_this_month: revenueThisMonth,
          revenue_all_time: revenueAllTime,
          occupancy_rate: Math.round(occupancyRate * 10) / 10,
          total_bookings: totalBookings,
          total_beds: totalBeds,
          beds_available: bedsAvailable,
          beds_occupied: bedsOccupied,
          average_rating: null, // TODO: Implement ratings when available
          is_available: property.is_available,
        };
      });

      logger.info('Compound properties fetched', { compoundId, count: propertiesWithMetrics.length });
      return propertiesWithMetrics;
    } catch (error) {
      logger.error('Failed to fetch compound properties', { compoundId, error });
      return [];
    }
  }

  /**
   * Get side-by-side comparison data for properties in compound
   */
  static async comparePropertiesInCompound(compoundId: string): Promise<PropertyComparison[]> {
    try {
      const properties = await this.getCompoundProperties(compoundId);

      return properties.map(p => ({
        property_id: p.property_id,
        property_name: p.property_name,
        block_identifier: p.block_identifier,
        revenue: p.revenue_this_month,
        occupancy: p.occupancy_rate,
        bookings: p.total_bookings,
        rating: p.average_rating,
      }));
    } catch (error) {
      logger.error('Failed to compare properties', { compoundId, error });
      return [];
    }
  }

  /**
   * Get revenue history for compound (last N months)
   * Returns data structured for Recharts stacked area chart
   */
  static async getCompoundRevenueHistory(
    compoundId: string,
    months: number = 6
  ): Promise<CompoundRevenueHistory | null> {
    try {
      logger.info('Fetching compound revenue history', { compoundId, months });

      // Get properties in compound
      const { data: compoundProperties, error: cpError } = await supabase
        .from('compound_properties')
        .select(`
          property_id,
          properties (
            id,
            title
          )
        `)
        .eq('compound_id', compoundId);

      if (cpError) throw cpError;
      if (!compoundProperties || compoundProperties.length === 0) return null;

      const propertyIds = compoundProperties.map((cp: any) => cp.property_id);

      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);

      // Get all bookings in date range
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings_enhanced')
        .select('property_id, total_amount, created_at')
        .in('property_id', propertyIds)
        .gte('created_at', startDate.toISOString())
        .in('status', ['ACTIVE', 'PAYMENT_CONFIRMED', 'COMPLETED']);

      if (bookingsError) throw bookingsError;

      // Generate month labels
      const monthLabels: string[] = [];
      for (let i = months - 1; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        monthLabels.push(date.toISOString().substring(0, 7)); // "2025-01"
      }

      // Group bookings by property and month
      const revenueByPropertyAndMonth: Record<string, Record<string, number>> = {};

      compoundProperties.forEach((cp: any) => {
        revenueByPropertyAndMonth[cp.property_id] = {};
        monthLabels.forEach(month => {
          revenueByPropertyAndMonth[cp.property_id][month] = 0;
        });
      });

      bookings?.forEach(booking => {
        const month = booking.created_at.substring(0, 7);
        if (revenueByPropertyAndMonth[booking.property_id] && monthLabels.includes(month)) {
          revenueByPropertyAndMonth[booking.property_id][month] += booking.total_amount || 0;
        }
      });

      // Structure data for Recharts
      const properties = compoundProperties.map((cp: any) => ({
        property_id: cp.property_id,
        property_name: cp.properties.title,
        data: monthLabels.map(month => revenueByPropertyAndMonth[cp.property_id][month] || 0),
      }));

      const totalByMonth = monthLabels.map(month => {
        return compoundProperties.reduce((sum: number, cp: any) => {
          return sum + (revenueByPropertyAndMonth[cp.property_id][month] || 0);
        }, 0);
      });

      const history: CompoundRevenueHistory = {
        months: monthLabels,
        properties,
        total_by_month: totalByMonth,
      };

      logger.info('Revenue history calculated', { compoundId, months: monthLabels.length });
      return history;
    } catch (error) {
      logger.error('Failed to fetch revenue history', { compoundId, error });
      return null;
    }
  }
}

