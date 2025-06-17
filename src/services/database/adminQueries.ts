/**
 * Admin database queries for ROOMi platform
 * Handles admin-specific operations and platform management
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/enhanced-logger';

export interface AdminUser {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  last_sign_in_at?: string | null;
  email_confirmed_at?: string | null;
}

export interface PlatformStats {
  totalUsers: number;
  totalProperties: number;
  totalBookings: number;
  totalRevenue: number;
  activeUsers: number;
  pendingVerifications: number;
  monthlyGrowth: {
    users: number;
    properties: number;
    bookings: number;
    revenue: number;
  };
}

export interface PropertyVerification {
  id: string;
  property_id: string;
  owner_id: string;
  verification_status: string;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  verification_notes: string | null;
  property: {
    title: string;
    address: string;
    city: string;
    property_type: string;
  };
  owner: {
    first_name: string | null;
    last_name: string | null;
    email: string;
  };
}

export class AdminQueries {
  /**
   * Get all users with pagination
   */
  static async getAllUsers(page: number = 1, limit: number = 20): Promise<{ users: AdminUser[]; total: number }> {
    try {
      const offset = (page - 1) * limit;

      // Get total count
      const { count, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;

      // Get users with pagination
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          first_name,
          last_name,
          role,
          phone,
          avatar_url,
          created_at
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      logger.info('Admin users fetched successfully', { page, limit, total: count });
      return {
        users: data || [],
        total: count || 0
      };
    } catch (error) {
      logger.error('Failed to fetch admin users', { error, page, limit });
      throw error;
    }
  }

  /**
   * Get platform statistics for admin dashboard
   */
  static async getPlatformStats(): Promise<PlatformStats> {
    try {
      // Get total users
      const { count: totalUsers, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (usersError) throw usersError;

      // Get total properties
      const { count: totalProperties, error: propertiesError } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true });

      if (propertiesError) throw propertiesError;

      // Get total bookings
      const { count: totalBookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true });

      if (bookingsError) throw bookingsError;

      // Get total revenue
      const { data: revenueData, error: revenueError } = await supabase
        .from('bookings')
        .select('total_amount')
        .eq('payment_status', 'paid');

      if (revenueError) throw revenueError;

      const totalRevenue = revenueData?.reduce((sum, booking) => sum + booking.total_amount, 0) || 0;

      // Get active users (users who have logged in within last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { count: activeUsers, error: activeError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString()); // Approximation

      if (activeError) throw activeError;

      // Get pending verifications
      const { count: pendingVerifications, error: verificationsError } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('verification_status', 'pending');

      if (verificationsError) throw verificationsError;

      // Calculate monthly growth (simplified)
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      const { count: newUsersThisMonth } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', lastMonth.toISOString());

      const { count: newPropertiesThisMonth } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', lastMonth.toISOString());

      const { count: newBookingsThisMonth } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', lastMonth.toISOString());

      const { data: monthlyRevenueData } = await supabase
        .from('bookings')
        .select('total_amount')
        .eq('payment_status', 'paid')
        .gte('created_at', lastMonth.toISOString());

      const monthlyRevenue = monthlyRevenueData?.reduce((sum, booking) => sum + booking.total_amount, 0) || 0;

      const stats: PlatformStats = {
        totalUsers: totalUsers || 0,
        totalProperties: totalProperties || 0,
        totalBookings: totalBookings || 0,
        totalRevenue,
        activeUsers: activeUsers || 0,
        pendingVerifications: pendingVerifications || 0,
        monthlyGrowth: {
          users: newUsersThisMonth || 0,
          properties: newPropertiesThisMonth || 0,
          bookings: newBookingsThisMonth || 0,
          revenue: monthlyRevenue,
        },
      };

      logger.info('Platform stats fetched successfully', stats);
      return stats;
    } catch (error) {
      logger.error('Failed to fetch platform stats', { error });
      throw error;
    }
  }

  /**
   * Update user role
   */
  static async updateUserRole(userId: string, newRole: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      logger.info('User role updated successfully', { userId, newRole });
    } catch (error) {
      logger.error('Failed to update user role', { error, userId, newRole });
      throw error;
    }
  }

  /**
   * Get properties pending verification
   */
  static async getPendingVerifications(limit: number = 20): Promise<PropertyVerification[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          id,
          owner_id,
          verification_status,
          created_at,
          title,
          address,
          city,
          property_type,
          profiles!properties_owner_id_fkey (
            first_name,
            last_name,
            email
          )
        `)
        .eq('verification_status', 'pending')
        .order('created_at', { ascending: true })
        .limit(limit);

      if (error) throw error;

      const verifications: PropertyVerification[] = data?.map(property => ({
        id: property.id,
        property_id: property.id,
        owner_id: property.owner_id,
        verification_status: property.verification_status,
        submitted_at: property.created_at,
        reviewed_at: null,
        reviewed_by: null,
        verification_notes: null,
        property: {
          title: property.title,
          address: property.address,
          city: property.city,
          property_type: property.property_type,
        },
        owner: {
          first_name: property.profiles?.first_name || null,
          last_name: property.profiles?.last_name || null,
          email: property.profiles?.email || '',
        },
      })) || [];

      logger.info('Pending verifications fetched successfully', { count: verifications.length });
      return verifications;
    } catch (error) {
      logger.error('Failed to fetch pending verifications', { error });
      throw error;
    }
  }

  /**
   * Approve or reject property verification
   */
  static async updatePropertyVerification(
    propertyId: string, 
    status: 'verified' | 'rejected', 
    adminId: string,
    notes?: string
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ 
          verification_status: status,
          // TODO: Add reviewed_by and reviewed_at fields to properties table
        })
        .eq('id', propertyId);

      if (error) throw error;

      logger.info('Property verification updated successfully', { propertyId, status, adminId });
    } catch (error) {
      logger.error('Failed to update property verification', { error, propertyId, status });
      throw error;
    }
  }

  /**
   * Search users by email or name
   */
  static async searchUsers(query: string, limit: number = 20): Promise<AdminUser[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          first_name,
          last_name,
          role,
          phone,
          avatar_url,
          created_at
        `)
        .or(`email.ilike.%${query}%,first_name.ilike.%${query}%,last_name.ilike.%${query}%`)
        .limit(limit);

      if (error) throw error;

      logger.info('User search completed successfully', { query, resultsCount: data?.length || 0 });
      return data || [];
    } catch (error) {
      logger.error('Failed to search users', { error, query });
      throw error;
    }
  }
}
