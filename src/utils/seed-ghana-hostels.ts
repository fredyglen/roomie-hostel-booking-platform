/**
 * Seed Ghana Hostels into Database
 * Quick seeding script for testing
 */

import { supabase } from '@/integrations/supabase/client';
import { ghanaHostelsSemesterPricing } from '@/data/ghana-hostels-semester-pricing';
import { logger } from './enhanced-logger';

export async function seedGhanaHostels() {
  try {
    logger.info('Starting Ghana hostels seeding...');

    // First, create a default owner profile if it doesn't exist
    const defaultOwnerId = 'default-owner-id';
    
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', defaultOwnerId)
      .single();

    if (!existingProfile) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: defaultOwnerId,
          email: 'default.owner@roomi.com',
          first_name: 'Default',
          last_name: 'Owner',
          role: 'owner',
          phone: '+233 50 123 4567',
        });

      if (profileError) {
        logger.error('Failed to create default owner profile', profileError);
        throw profileError;
      }
    }

    // Transform Ghana hostels to database format
    const propertiesToInsert = ghanaHostelsSemesterPricing.map(hostel => ({
      id: hostel.id,
      owner_id: defaultOwnerId,
      title: hostel.name,
      description: hostel.description,
      address: hostel.location.address,
      city: hostel.location.city,
      state: hostel.location.state,
      zip: '00000', // Default zip
      property_type: hostel.propertyType,
      rent: hostel.pricePerSemester,
      bedrooms: hostel.bedrooms,
      bathrooms: hostel.bathrooms,
      available_from: hostel.availableFrom,
      available_to: hostel.availableTo,
      is_available: hostel.isActive,
      images: hostel.images,
      amenities: hostel.amenities,
      verification_status: 'verified',
      property_category: 'Hostel',
      max_occupants: hostel.maxOccupants,
      gender_restriction: hostel.amenities.includes('Female Only') ? 'female' : 
                         hostel.amenities.includes('Male Only') ? 'male' : 'mixed',
      parking_available: hostel.amenities.includes('Parking Space'),
      total_rooms: 10, // Default
      rooms_available: 8, // Default
      beds_per_room: hostel.maxOccupants,
      beds_available: 8 * hostel.maxOccupants,
      has_bedframes: true,
      has_mattresses: true,
      has_wardrobes: true,
      has_fan: true,
      has_tiled_room: true,
      has_individual_meters: hostel.amenities.includes('Self-Contained'),
      washroom_type: hostel.bathrooms > 0 ? 'inside' : 'shared',
      meter_type: 'shared',
      advance_payment_months: 4, // Semester payment
      allow_bill_sharing: true,
      subscription_status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    // Insert properties in batches
    const batchSize = 5;
    for (let i = 0; i < propertiesToInsert.length; i += batchSize) {
      const batch = propertiesToInsert.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('properties')
        .insert(batch);

      if (error) {
        logger.error(`Failed to insert batch ${i / batchSize + 1}`, error);
        throw error;
      }

      logger.info(`Inserted batch ${i / batchSize + 1}/${Math.ceil(propertiesToInsert.length / batchSize)}`);
    }

    logger.info(`Successfully seeded ${propertiesToInsert.length} Ghana hostels!`);
    return { success: true, count: propertiesToInsert.length };

  } catch (error) {
    logger.error('Failed to seed Ghana hostels', error);
    throw error;
  }
}

// Function to clear existing data
export async function clearProperties() {
  try {
    const { error } = await supabase
      .from('properties')
      .delete()
      .neq('id', '');

    if (error) throw error;
    
    logger.info('Cleared all properties');
    return { success: true };
  } catch (error) {
    logger.error('Failed to clear properties', error);
    throw error;
  }
}

// Function to check seeding status
export async function checkSeedingStatus() {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('id, title')
      .limit(10);

    if (error) throw error;

    return {
      count: data?.length || 0,
      properties: data || []
    };
  } catch (error) {
    logger.error('Failed to check seeding status', error);
    throw error;
  }
}
