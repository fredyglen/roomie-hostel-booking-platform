/**
 * Favorites database queries for ROOMi platform
 * Handles student property favorites functionality
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/enhanced-logger';

export interface Favorite {
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
  property?: {
    id: string;
    title: string;
    address: string;
    city: string;
    base_price_per_semester: number;
    price_currency: string;
    cover_image_url: string | null;
    images: string[] | null;
    property_type: string;
    property_category: string | null;
    gender_type: string;
    max_occupancy: number;
    current_occupancy: number;
    amenities: string[] | null;
    is_available: boolean;
    verification_status: string | null;
  };
}

export class FavoritesQueries {
  /**
   * Add a property to user's favorites
   */
  static async addFavorite(userId: string, propertyId: string): Promise<Favorite> {
    try {
      // Check if already favorited
      const { data: existing } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('property_id', propertyId)
        .single();

      if (existing) {
        throw new Error('Property is already in favorites');
      }

      const { data, error } = await supabase
        .from('favorites')
        .insert({
          user_id: userId,
          property_id: propertyId
        })
        .select()
        .single();

      if (error) {
        logger.error('Error adding favorite', { error, userId, propertyId });
        throw error;
      }

      logger.info('Favorite added successfully', { userId, propertyId });
      return data;
    } catch (error) {
      logger.error('Failed to add favorite', { error, userId, propertyId });
      throw error;
    }
  }

  /**
   * Remove a property from user's favorites
   */
  static async removeFavorite(userId: string, propertyId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('property_id', propertyId);

      if (error) {
        logger.error('Error removing favorite', { error, userId, propertyId });
        throw error;
      }

      logger.info('Favorite removed successfully', { userId, propertyId });
    } catch (error) {
      logger.error('Failed to remove favorite', { error, userId, propertyId });
      throw error;
    }
  }

  /**
   * Get all favorites for a user with property details
   */
  static async getUserFavorites(userId: string): Promise<Favorite[]> {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          id,
          user_id,
          property_id,
          created_at,
          properties!favorites_property_id_fkey (
            id,
            title,
            address,
            city,
            base_price_per_semester,
            price_currency,
            cover_image_url,
            images,
            property_type,
            property_category,
            gender_type,
            max_occupancy,
            current_occupancy,
            amenities,
            is_available,
            verification_status
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Error fetching user favorites', { error, userId });
        throw error;
      }

      logger.info('User favorites fetched successfully', { 
        userId, 
        favoritesCount: data?.length || 0 
      });

      return data || [];
    } catch (error) {
      logger.error('Failed to fetch user favorites', { error, userId });
      throw error;
    }
  }

  /**
   * Check if a property is favorited by user
   */
  static async isFavorited(userId: string, propertyId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('property_id', propertyId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        logger.error('Error checking favorite status', { error, userId, propertyId });
        throw error;
      }

      return !!data;
    } catch (error) {
      logger.error('Failed to check favorite status', { error, userId, propertyId });
      return false;
    }
  }

  /**
   * Get user's favorite property IDs (for quick lookup)
   */
  static async getUserFavoriteIds(userId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('property_id')
        .eq('user_id', userId);

      if (error) {
        logger.error('Error fetching user favorite IDs', { error, userId });
        throw error;
      }

      return data?.map(fav => fav.property_id) || [];
    } catch (error) {
      logger.error('Failed to fetch user favorite IDs', { error, userId });
      return [];
    }
  }

  /**
   * Get favorites count for a user
   */
  static async getFavoritesCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (error) {
        logger.error('Error getting favorites count', { error, userId });
        throw error;
      }

      return count || 0;
    } catch (error) {
      logger.error('Failed to get favorites count', { error, userId });
      return 0;
    }
  }

  /**
   * Toggle favorite status (add if not favorited, remove if favorited)
   */
  static async toggleFavorite(userId: string, propertyId: string): Promise<boolean> {
    try {
      const isFavorited = await this.isFavorited(userId, propertyId);
      
      if (isFavorited) {
        await this.removeFavorite(userId, propertyId);
        return false;
      } else {
        await this.addFavorite(userId, propertyId);
        return true;
      }
    } catch (error) {
      logger.error('Failed to toggle favorite', { error, userId, propertyId });
      throw error;
    }
  }
}
