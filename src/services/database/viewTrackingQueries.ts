/**
 * View Tracking Queries for ROOMi Platform
 * Tracks user property views for analytics and dashboard stats
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/enhanced-logger';

export interface PropertyView {
  id: string;
  user_id: string;
  property_id: string;
  viewed_at: string;
  session_id?: string;
  user_agent?: string;
}

export class ViewTrackingQueries {
  /**
   * Track a property view for a user
   */
  static async trackPropertyView(
    userId: string, 
    propertyId: string,
    sessionId?: string
  ): Promise<void> {
    try {
      // Check if user already viewed this property in the last 24 hours
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      
      const { data: existingView } = await supabase
        .from('property_views')
        .select('id')
        .eq('user_id', userId)
        .eq('property_id', propertyId)
        .gte('viewed_at', twentyFourHoursAgo)
        .single();

      // Only track if no recent view exists
      if (!existingView) {
        const { error } = await supabase
          .from('property_views')
          .insert({
            user_id: userId,
            property_id: propertyId,
            viewed_at: new Date().toISOString(),
            session_id: sessionId,
            user_agent: navigator.userAgent
          });

        if (error) {
          logger.warn('Failed to track property view', { error, userId, propertyId });
        } else {
          logger.debug('Property view tracked', { userId, propertyId });
        }
      }
    } catch (error) {
      logger.error('Exception in trackPropertyView', { error, userId, propertyId });
    }
  }

  /**
   * Get total views count for a user
   */
  static async getUserViewsCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('property_views')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (error) {
        logger.error('Failed to get user views count', { error, userId });
        return 0;
      }

      return count || 0;
    } catch (error) {
      logger.error('Exception in getUserViewsCount', { error, userId });
      return 0;
    }
  }

  /**
   * Get unique properties viewed by user
   */
  static async getUserUniqueViewsCount(userId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('property_views')
        .select('property_id')
        .eq('user_id', userId);

      if (error) {
        logger.error('Failed to get user unique views count', { error, userId });
        return 0;
      }

      // Count unique property IDs
      const uniquePropertyIds = new Set(data?.map(view => view.property_id) || []);
      return uniquePropertyIds.size;
    } catch (error) {
      logger.error('Exception in getUserUniqueViewsCount', { error, userId });
      return 0;
    }
  }

  /**
   * Get most viewed properties for analytics
   */
  static async getMostViewedProperties(limit = 10): Promise<Array<{
    property_id: string;
    view_count: number;
    property_title?: string;
  }>> {
    try {
      const { data, error } = await supabase
        .from('property_views')
        .select(`
          property_id,
          properties!inner(title)
        `);

      if (error) {
        logger.error('Failed to get most viewed properties', { error });
        return [];
      }

      // Count views per property
      const viewCounts = new Map<string, number>();
      const propertyTitles = new Map<string, string>();

      data?.forEach(view => {
        const propertyId = view.property_id;
        viewCounts.set(propertyId, (viewCounts.get(propertyId) || 0) + 1);
        
        if (view.properties && 'title' in view.properties) {
          propertyTitles.set(propertyId, view.properties.title as string);
        }
      });

      // Convert to array and sort by view count
      const sortedProperties = Array.from(viewCounts.entries())
        .map(([property_id, view_count]) => ({
          property_id,
          view_count,
          property_title: propertyTitles.get(property_id)
        }))
        .sort((a, b) => b.view_count - a.view_count)
        .slice(0, limit);

      return sortedProperties;
    } catch (error) {
      logger.error('Exception in getMostViewedProperties', { error });
      return [];
    }
  }

  /**
   * Clean up old view records (older than 90 days)
   */
  static async cleanupOldViews(): Promise<void> {
    try {
      const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
      
      const { error } = await supabase
        .from('property_views')
        .delete()
        .lt('viewed_at', ninetyDaysAgo);

      if (error) {
        logger.error('Failed to cleanup old views', { error });
      } else {
        logger.info('Old property views cleaned up successfully');
      }
    } catch (error) {
      logger.error('Exception in cleanupOldViews', { error });
    }
  }
}
