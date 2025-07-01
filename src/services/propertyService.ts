
/**
 * Property Service for ROOMi Platform
 * Handles all property-related database operations with proper type safety
 *
 * @fileoverview Apple-Level Property Service Implementation
 * @author ROOMi Development Team
 * @version 1.0.0
 */

import { supabase } from '@/integrations/supabase/client';
import {
  Property,
  PropertyType,
  PropertyStatus,
  Address,
  PropertyPrice,
  PropertyFeatures,
  PropertyMedia,
  Building
} from '@/types/property';
import { User } from '@/types/core';
import { PropertyQueries } from '@/services/database/standardizedQueries';
import { ErrorHandler } from '@/utils/ErrorHandler';
import {
  PropertyNotFoundError,
  PropertyUploadError,
  PropertyOwnershipError
} from '@/errors/property-errors';

/**
 * Property Service Implementation
 * Provides type-safe property operations with comprehensive error handling
 */
export const propertyService = {
  /**
   * Get all available properties with proper type transformation
   *
   * @returns Promise<Property[]> - Array of properly typed properties
   * @throws PropertyNotFoundError - When no properties are found
   * @throws InternalServerError - When database operation fails
   */
  async getProperties(): Promise<Property[]> {
    try {
      const result = await PropertyQueries.getAvailableProperties({ limit: 50 });

      if (!result.properties || result.properties.length === 0) {
        return [];
      }

      // Transform database results to Property interface
      return result.properties.map(dbProperty => {
        return this.transformDatabaseToProperty(dbProperty);
      });
    } catch (error) {
      const appError = ErrorHandler.handle(error, { operation: 'getProperties' });
      throw appError;
    }
  },

  /**
   * Transform database property to Property interface
   *
   * @param dbProperty - Raw database property object
   * @returns Property - Properly typed property object
   * @private
   */
  transformDatabaseToProperty(dbProperty: any): Property {
    // Extract profile data safely
    const profileData = Array.isArray(dbProperty.profiles)
      ? dbProperty.profiles[0]
      : dbProperty.profiles;

    // Create proper Address object
    const address: Address = {
      street: dbProperty.address || '',
      city: dbProperty.city || '',
      state: dbProperty.state || '',
      country: 'Ghana',
      postalCode: dbProperty.zip || undefined,
      latitude: dbProperty.latitude || undefined,
      longitude: dbProperty.longitude || undefined
    };

    // Create proper PropertyPrice object
    const price: PropertyPrice = {
      amount: dbProperty.base_price_per_semester || dbProperty.rent || 0,
      currency: 'GHS',
      period: 'semester',
      isNegotiable: dbProperty.is_negotiable || false,
      discounts: []
    };

    // Create proper PropertyFeatures object
    const features: PropertyFeatures = {
      bedrooms: dbProperty.bedrooms || 0,
      bathrooms: dbProperty.bathrooms || 0,
      kitchens: dbProperty.kitchens || 0,
      parkingSpaces: dbProperty.parking_spaces || 0,
      furnished: dbProperty.furnished || false,
      petsAllowed: dbProperty.pets_allowed || false,
      utilities: {
        water: true,
        electricity: true,
        internet: dbProperty.has_internet || false,
        gas: dbProperty.has_gas || false,
        cleaning: dbProperty.has_cleaning || false,
        security: dbProperty.has_security || false
      },
      amenities: Array.isArray(dbProperty.amenities) ? dbProperty.amenities : [],
      rules: Array.isArray(dbProperty.rules) ? dbProperty.rules : []
    };

    // Create proper PropertyMedia array
    const media: PropertyMedia[] = Array.isArray(dbProperty.images)
      ? dbProperty.images.map((imageUrl: string, index: number) => ({
          id: `${dbProperty.id}_image_${index}`,
          url: imageUrl,
          type: 'image' as const,
          isCover: index === 0,
          caption: undefined
        }))
      : [];

    // Create proper User object for owner
    const owner: User | undefined = profileData ? {
      id: dbProperty.owner_id || 'unknown',
      email: profileData.email || '',
      role: 'owner' as const,
      profile: {
        firstName: profileData.first_name || '',
        lastName: profileData.last_name || '',
        phone: profileData.phone || '',
        avatar: profileData.avatar || undefined
      },
      createdAt: profileData.created_at || new Date().toISOString(),
      updatedAt: profileData.updated_at || new Date().toISOString()
    } : undefined;

    // Return properly typed Property object
    return {
      id: dbProperty.id,
      name: dbProperty.title || dbProperty.name || '',
      description: dbProperty.description || '',
      type: (dbProperty.property_type || 'hostel') as PropertyType,
      status: this.mapVerificationStatusToPropertyStatus(dbProperty.verification_status),
      address,
      price,
      features,
      media,
      buildings: [], // TODO: Implement building structure
      ownerId: dbProperty.owner_id || '',
      owner,
      createdAt: dbProperty.created_at || new Date().toISOString(),
      updatedAt: dbProperty.updated_at || new Date().toISOString(),
      verificationStatus: dbProperty.verification_status || 'pending',
      verificationDetails: undefined
    };
  },

  /**
   * Map database verification status to PropertyStatus
   *
   * @param verificationStatus - Database verification status
   * @returns PropertyStatus - Mapped property status
   * @private
   */
  mapVerificationStatusToPropertyStatus(verificationStatus?: string): PropertyStatus {
    switch (verificationStatus) {
      case 'verified':
        return 'active';
      case 'rejected':
        return 'rejected';
      case 'pending':
        return 'pending';
      default:
        return 'inactive';
    }
  },
  
  /**
   * Get property by ID with comprehensive error handling
   *
   * @param id - Property ID to fetch
   * @returns Promise<Property> - The requested property
   * @throws PropertyNotFoundError - When property doesn't exist
   * @throws InternalServerError - When database operation fails
   */
  async getPropertyById(id: string): Promise<Property> {
    if (!id) {
      throw new PropertyNotFoundError('Property ID is required', id);
    }

    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          profiles!owner_id (
            id,
            first_name,
            last_name,
            email,
            phone,
            avatar,
            created_at,
            updated_at
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new PropertyNotFoundError(`Property with ID ${id} not found`, id);
        }
        throw error;
      }

      if (!data) {
        throw new PropertyNotFoundError(`Property with ID ${id} not found`, id);
      }

      return this.transformDatabaseToProperty(data);
    } catch (error) {
      if (error instanceof PropertyNotFoundError) {
        throw error;
      }

      const appError = ErrorHandler.handle(error, {
        operation: 'getPropertyById',
        propertyId: id
      });
      throw appError;
    }
  },
  
  /**
   * Create new property with proper validation and type safety
   *
   * @param propertyData - Property data to create (without id, timestamps)
   * @returns Promise<Property> - The created property
   * @throws PropertyUploadError - When property creation fails
   * @throws ValidationError - When property data is invalid
   */
  async createProperty(propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<Property> {
    try {
      // Validate required fields
      if (!propertyData.name) {
        throw new PropertyUploadError('Property name is required');
      }
      if (!propertyData.description) {
        throw new PropertyUploadError('Property description is required');
      }
      if (!propertyData.ownerId) {
        throw new PropertyUploadError('Property owner ID is required');
      }

      // Convert Property to database format
      const dbProperty = this.transformPropertyToDatabase(propertyData);

      const { data, error } = await supabase
        .from('properties')
        .insert([dbProperty])
        .select(`
          *,
          profiles!owner_id (
            id,
            first_name,
            last_name,
            email,
            phone,
            avatar,
            created_at,
            updated_at
          )
        `)
        .single();

      if (error) {
        throw new PropertyUploadError(`Failed to create property: ${error.message}`);
      }

      if (!data) {
        throw new PropertyUploadError('Property creation returned no data');
      }

      return this.transformDatabaseToProperty(data);
    } catch (error) {
      if (error instanceof PropertyUploadError) {
        throw error;
      }

      const appError = ErrorHandler.handle(error, {
        operation: 'createProperty',
        propertyName: propertyData.name
      });
      throw appError;
    }
  },

  /**
   * Transform Property object to database format
   *
   * @param property - Property object to transform
   * @returns Database-compatible property object
   * @private
   */
  transformPropertyToDatabase(property: Omit<Property, 'id' | 'created_at' | 'updated_at'>): Record<string, unknown> {
    return {
      title: property.title,
      description: property.description,
      property_type: property.property_type,
      property_category: property.property_category,
      address: property.address,
      city: property.city,
      state: property.state,
      rent: property.rent,
      currency: property.currency,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      max_occupants: property.max_occupants,
      is_available: property.is_available,
      is_furnished: property.is_furnished,
      amenities: property.amenities,
      images: property.images,
      owner_id: property.owner_id,
      available_from: property.available_from,
      available_to: property.available_to,
      verification_status: property.verification_status || 'pending',
    };
  },
  
  /**
   * Update property with proper validation and authorization
   *
   * @param id - Property ID to update
   * @param updates - Partial property updates
   * @param userId - ID of user making the update (for authorization)
   * @returns Promise<Property> - The updated property
   * @throws PropertyNotFoundError - When property doesn't exist
   * @throws PropertyOwnershipError - When user doesn't own the property
   */
  async updateProperty(id: string, updates: Partial<Property>, userId?: string): Promise<Property> {
    if (!id) {
      throw new PropertyNotFoundError('Property ID is required', id);
    }

    try {
      // Check if property exists and user has permission
      const existingProperty = await this.getPropertyById(id);

      if (userId && existingProperty.owner_id !== userId) {
        throw new PropertyOwnershipError(
          'User does not have permission to update this property',
          id,
          userId
        );
      }

      // Convert Property updates to database format
      const dbUpdates = this.transformPropertyUpdatesToDatabase(updates);

      const { data, error } = await supabase
        .from('properties')
        .update(dbUpdates)
        .eq('id', id)
        .select(`
          *,
          profiles!owner_id (
            id,
            first_name,
            last_name,
            email,
            phone,
            avatar,
            created_at,
            updated_at
          )
        `)
        .single();

      if (error) {
        throw new PropertyUploadError(`Failed to update property: ${error.message}`);
      }

      if (!data) {
        throw new PropertyNotFoundError(`Property with ID ${id} not found after update`, id);
      }

      return this.transformDatabaseToProperty(data);
    } catch (error) {
      if (error instanceof PropertyNotFoundError || error instanceof PropertyOwnershipError) {
        throw error;
      }

      const appError = ErrorHandler.handle(error, {
        operation: 'updateProperty',
        propertyId: id,
        userId
      });
      throw appError;
    }
  },

  /**
   * Transform partial Property updates to database format
   *
   * @param updates - Partial property updates
   * @returns Database-compatible updates object
   * @private
   */
  transformPropertyUpdatesToDatabase(updates: Partial<Property>): Record<string, unknown> {
    const dbUpdates: Record<string, unknown> = {};

    if (updates.title) dbUpdates.title = updates.title;
    if (updates.description) dbUpdates.description = updates.description;
    if (updates.property_type) dbUpdates.property_type = updates.property_type;
    if (updates.property_category) dbUpdates.property_category = updates.property_category;
    if (updates.verification_status) dbUpdates.verification_status = updates.verification_status;

    if (updates.address) dbUpdates.address = updates.address;
    if (updates.city) dbUpdates.city = updates.city;
    if (updates.state) dbUpdates.state = updates.state;

    if (updates.rent !== undefined) dbUpdates.rent = updates.rent;
    if (updates.currency) dbUpdates.currency = updates.currency;
    if (updates.bedrooms !== undefined) dbUpdates.bedrooms = updates.bedrooms;
    if (updates.bathrooms !== undefined) dbUpdates.bathrooms = updates.bathrooms;
    if (updates.max_occupants !== undefined) dbUpdates.max_occupants = updates.max_occupants;
    if (updates.is_available !== undefined) dbUpdates.is_available = updates.is_available;
    if (updates.is_furnished !== undefined) dbUpdates.is_furnished = updates.is_furnished;
    if (updates.amenities) dbUpdates.amenities = updates.amenities;
    if (updates.images) dbUpdates.images = updates.images;
    if (updates.available_from) dbUpdates.available_from = updates.available_from;
    if (updates.available_to) dbUpdates.available_to = updates.available_to;

    return dbUpdates;
  },

  /**
   * Delete property with proper authorization
   *
   * @param id - Property ID to delete
   * @param userId - ID of user making the deletion (for authorization)
   * @returns Promise<boolean> - True if deletion was successful
   * @throws PropertyNotFoundError - When property doesn't exist
   * @throws PropertyOwnershipError - When user doesn't own the property
   */
  async deleteProperty(id: string, userId?: string): Promise<boolean> {
    if (!id) {
      throw new PropertyNotFoundError('Property ID is required', id);
    }

    try {
      // Check if property exists and user has permission
      if (userId) {
        const existingProperty = await this.getPropertyById(id);

        if (existingProperty.owner_id !== userId) {
          throw new PropertyOwnershipError(
            'User does not have permission to delete this property',
            id,
            userId
          );
        }
      }

      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) {
        throw new PropertyUploadError(`Failed to delete property: ${error.message}`);
      }

      return true;
    } catch (error) {
      if (error instanceof PropertyNotFoundError || error instanceof PropertyOwnershipError) {
        throw error;
      }

      const appError = ErrorHandler.handle(error, {
        operation: 'deleteProperty',
        propertyId: id,
        userId
      });
      throw appError;
    }
  }
};
