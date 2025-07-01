/**
 * Data Seeder for ROOMi Platform
 * Populates the platform with real Ghana hostel data for testing and demo
 */

import { supabase } from '@/config/supabase';
import { allGhanaHostels, mockUsers, mockBookings, mockReviews } from '@/data/mock-properties';
import { logger } from './enhanced-logger';

export class DataSeeder {
  private static instance: DataSeeder;

  private constructor() {}

  static getInstance(): DataSeeder {
    if (!DataSeeder.instance) {
      DataSeeder.instance = new DataSeeder();
    }
    return DataSeeder.instance;
  }

  /**
   * Seed all data into the platform
   */
  async seedAllData(): Promise<void> {
    try {
      logger.info('Starting data seeding process...');

      // Check if data already exists
      const existingProperties = await this.checkExistingData();
      if (existingProperties.length > 0) {
        logger.info('Data already exists, skipping seeding');
        return;
      }

      // Seed in order of dependencies
      await this.seedUsers();
      await this.seedProperties();
      await this.seedBookings();
      await this.seedReviews();

      logger.info('Data seeding completed successfully');
    } catch (error) {
      logger.error('Data seeding failed', error);
      throw error;
    }
  }

  /**
   * Check if data already exists
   */
  private async checkExistingData(): Promise<any[]> {
    const { data, error } = await supabase
      .from('properties')
      .select('id')
      .limit(1);

    if (error) {
      logger.warn('Could not check existing data', error);
      return [];
    }

    return data || [];
  }

  /**
   * Seed user data
   */
  private async seedUsers(): Promise<void> {
    logger.info('Seeding users...');

    for (const user of mockUsers) {
      try {
        // Create auth user first
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: user.email,
          password: 'TempPassword123!', // Temporary password
          options: {
            data: {
              first_name: user.firstName,
              last_name: user.lastName,
              role: user.role,
            }
          }
        });

        if (authError) {
          logger.warn(`Failed to create auth user for ${user.email}`, authError);
          continue;
        }

        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user?.id,
            email: user.email,
            first_name: user.firstName,
            last_name: user.lastName,
            role: user.role,
            phone: user.phone,
            university: user.university,
            program: user.program,
            year_of_study: user.yearOfStudy,
          });

        if (profileError) {
          logger.warn(`Failed to create profile for ${user.email}`, profileError);
        }

      } catch (error) {
        logger.warn(`Error seeding user ${user.email}`, error);
      }
    }

    logger.info('Users seeded successfully');
  }

  /**
   * Seed property data
   */
  private async seedProperties(): Promise<void> {
    logger.info('Seeding properties...');

    // Transform properties for database
    const propertiesToInsert = allGhanaHostels.map(property => ({
      id: property.id,
      title: property.name,
      description: property.description,
      address: property.location.address,
      city: property.location.city,
      state: property.location.state,
      country: property.location.country,
      latitude: property.location.coordinates?.lat,
      longitude: property.location.coordinates?.lng,
      property_type: property.propertyType,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      max_occupants: property.maxOccupants,
      price_per_month: property.price,
      currency: 'GHS',
      distance_to_campus: property.distanceToCampus,
      nearest_university: property.nearestUniversity,
      amenities: property.amenities,
      rules: property.rules,
      images: property.images,
      available_from: property.availableFrom,
      available_to: property.availableTo,
      is_active: property.isActive,
      features: property.features,
      house_rules: property.house_rules,
      owner_id: property.owner.id,
      owner_name: property.owner.name,
      owner_email: property.owner.email,
      owner_phone: property.owner.phone,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    // Insert in batches to avoid timeout
    const batchSize = 10;
    for (let i = 0; i < propertiesToInsert.length; i += batchSize) {
      const batch = propertiesToInsert.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('properties')
        .insert(batch);

      if (error) {
        logger.error(`Failed to insert property batch ${i / batchSize + 1}`, error);
      } else {
        logger.info(`Inserted property batch ${i / batchSize + 1}/${Math.ceil(propertiesToInsert.length / batchSize)}`);
      }
    }

    logger.info('Properties seeded successfully');
  }

  /**
   * Seed booking data
   */
  private async seedBookings(): Promise<void> {
    logger.info('Seeding bookings...');

    const bookingsToInsert = mockBookings.map(booking => ({
      id: booking.id,
      property_id: booking.propertyId,
      user_id: booking.userId,
      check_in_date: booking.checkInDate,
      check_out_date: booking.checkOutDate,
      status: booking.status,
      total_amount: booking.totalAmount,
      guest_count: booking.guestCount,
      emergency_contact: booking.emergencyContact,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from('bookings')
      .insert(bookingsToInsert);

    if (error) {
      logger.error('Failed to seed bookings', error);
    } else {
      logger.info('Bookings seeded successfully');
    }
  }

  /**
   * Seed review data
   */
  private async seedReviews(): Promise<void> {
    logger.info('Seeding reviews...');

    const reviewsToInsert = mockReviews.map(review => ({
      id: review.id,
      property_id: review.propertyId,
      user_id: review.userId,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      would_recommend: review.wouldRecommend,
      categories: review.categories,
      created_at: review.createdAt,
    }));

    const { error } = await supabase
      .from('reviews')
      .insert(reviewsToInsert);

    if (error) {
      logger.error('Failed to seed reviews', error);
    } else {
      logger.info('Reviews seeded successfully');
    }
  }

  /**
   * Clear all seeded data (for testing)
   */
  async clearAllData(): Promise<void> {
    try {
      logger.info('Clearing all seeded data...');

      // Delete in reverse order of dependencies
      await supabase.from('reviews').delete().neq('id', '');
      await supabase.from('bookings').delete().neq('id', '');
      await supabase.from('properties').delete().neq('id', '');
      
      // Note: We don't delete users as they might be real test accounts

      logger.info('All seeded data cleared successfully');
    } catch (error) {
      logger.error('Failed to clear seeded data', error);
      throw error;
    }
  }

  /**
   * Seed specific property by ID
   */
  async seedProperty(propertyId: string): Promise<void> {
    const property = allGhanaHostels.find(p => p.id === propertyId);
    if (!property) {
      throw new Error(`Property with ID ${propertyId} not found`);
    }

    const propertyToInsert = {
      id: property.id,
      title: property.name,
      description: property.description,
      address: property.location.address,
      city: property.location.city,
      state: property.location.state,
      country: property.location.country,
      latitude: property.location.coordinates?.lat,
      longitude: property.location.coordinates?.lng,
      property_type: property.propertyType,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      max_occupants: property.maxOccupants,
      price_per_month: property.price,
      currency: 'GHS',
      distance_to_campus: property.distanceToCampus,
      nearest_university: property.nearestUniversity,
      amenities: property.amenities,
      rules: property.rules,
      images: property.images,
      available_from: property.availableFrom,
      available_to: property.availableTo,
      is_active: property.isActive,
      features: property.features,
      house_rules: property.house_rules,
      owner_id: property.owner.id,
      owner_name: property.owner.name,
      owner_email: property.owner.email,
      owner_phone: property.owner.phone,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('properties')
      .insert(propertyToInsert);

    if (error) {
      logger.error(`Failed to seed property ${propertyId}`, error);
      throw error;
    }

    logger.info(`Property ${propertyId} seeded successfully`);
  }

  /**
   * Get seeding statistics
   */
  async getSeedingStats(): Promise<{
    properties: number;
    users: number;
    bookings: number;
    reviews: number;
  }> {
    const [properties, users, bookings, reviews] = await Promise.all([
      supabase.from('properties').select('id', { count: 'exact' }),
      supabase.from('profiles').select('id', { count: 'exact' }),
      supabase.from('bookings').select('id', { count: 'exact' }),
      supabase.from('reviews').select('id', { count: 'exact' }),
    ]);

    return {
      properties: properties.count || 0,
      users: users.count || 0,
      bookings: bookings.count || 0,
      reviews: reviews.count || 0,
    };
  }
}

// Export singleton instance
export const dataSeeder = DataSeeder.getInstance();

// Export convenience functions
export const seedAllData = () => dataSeeder.seedAllData();
export const clearAllData = () => dataSeeder.clearAllData();
export const seedProperty = (id: string) => dataSeeder.seedProperty(id);
export const getSeedingStats = () => dataSeeder.getSeedingStats();
