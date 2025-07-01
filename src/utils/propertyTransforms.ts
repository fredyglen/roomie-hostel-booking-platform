
/**
 * Property Transform Utilities for ROOMi Platform
 * Apple-Level property transformation with comprehensive error handling and validation
 *
 * @fileoverview Enterprise-Grade Property Transform Implementation
 * @author ROOMi Development Team
 * @version 2.0.0
 * @since 2024-12-20
 */

import {
  Property,
  PropertyType
} from '@/types/property';
import { User } from '@/types/core';
import { logger } from '@/utils/enhanced-logger';
import {
  PropertyTransformError,
  InvalidPropertyDataError,
  MissingPriceError,
  InvalidPriceError
} from '@/errors/property-errors';
import { PROPERTY_CONSTANTS } from '@/config/property-constants';

/**
 * Database Property Item Interface
 * Defines exact structure expected from database queries - matches actual database schema
 */
export interface DatabasePropertyItem {
  id: string;
  title?: string;
  description?: string;
  property_type?: string;
  property_category?: string | null;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  rent?: number;
  currency?: string | null;
  bedrooms?: number;
  bathrooms?: number;
  max_occupants?: number | null;
  is_available?: boolean | null;
  is_furnished?: boolean | null;
  amenities?: string[] | null;
  images?: string[] | null;
  owner_id?: string;
  available_from?: string;
  available_to?: string | null;
  created_at?: string;
  updated_at?: string;
  verification_status?: string | null;
  // Additional database fields that exactly match the schema
  advance_payment_months?: number | null;
  allow_bill_sharing?: boolean | null;
  base_price_per_semester?: number | null;
  beds_available?: number | null;
  beds_per_room?: number | null;
  cancellation_policy?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  gender_restriction?: string | null;
  has_accessibility_features?: boolean | null;
  has_bedframes?: boolean | null;
  has_fan?: boolean | null;
  has_individual_meters?: boolean | null;
  has_mattresses?: boolean | null;
  has_tiled_room?: boolean | null;
  has_wardrobes?: boolean | null;
  internet_speed?: string | null;
  meter_type?: string | null;
  parking_available?: boolean | null;
  parking_cost?: number | null;
  pet_policy?: string | null;
  rooms_available?: number | null;
  security_features?: string[] | null;
  semester_availability?: string[] | null;
  shared_meter_count?: number | null;
  shared_washroom_count?: number | null;
  size?: number | null;
  subscription_expires_at?: string | null;
  subscription_status?: string | null;
  total_rooms?: number | null;
  virtual_tour_url?: string | null;
  washroom_type?: string | null;
  profiles?: DatabaseProfileItem | DatabaseProfileItem[];
}

/**
 * Database Profile Item Interface
 * Defines structure for owner profile data
 */
export interface DatabaseProfileItem {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Transformation Result Type
 * Apple-Level result pattern for error handling
 */
export type TransformResult<T> =
  | { success: true; data: T; warnings?: string[] }
  | { success: false; error: PropertyTransformError | InvalidPropertyDataError; context?: Record<string, unknown> };

/**
 * Property Data Validator
 * Apple-Level validation with comprehensive error reporting
 */
class PropertyDataValidator {
  /**
   * Validate database property item
   */
  validate(dbItem: unknown): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Type check
    if (!dbItem || typeof dbItem !== 'object') {
      errors.push('Property data must be a valid object');
      return { isValid: false, errors };
    }

    const item = dbItem as Record<string, unknown>;

    // Required fields validation
    if (!item.id || typeof item.id !== 'string') {
      errors.push('Property ID is required and must be a string');
    }

    if (!item.title && !item.name) {
      errors.push('Property title or name is required');
    }

    // Price validation
    const hasValidPrice = this.validatePrice(item);
    if (!hasValidPrice.isValid) {
      errors.push(...hasValidPrice.errors);
    }

    // Numeric fields validation
    if (item.bedrooms !== undefined && (!Number.isInteger(item.bedrooms) || Number(item.bedrooms) < 0)) {
      errors.push('Bedrooms must be a non-negative integer');
    }

    if (item.bathrooms !== undefined && (!Number.isInteger(item.bathrooms) || Number(item.bathrooms) < 0)) {
      errors.push('Bathrooms must be a non-negative integer');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validate price data
   */
  private validatePrice(item: Record<string, unknown>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const { base_price_per_semester, rent } = item;

    if (!base_price_per_semester && !rent) {
      errors.push('Property must have either base_price_per_semester or rent');
      return { isValid: false, errors };
    }

    const price = base_price_per_semester || rent;
    if (typeof price !== 'number' || price < PROPERTY_CONSTANTS.VALIDATION.PRICE.MIN_AMOUNT) {
      errors.push(`Price must be at least ${PROPERTY_CONSTANTS.VALIDATION.PRICE.MIN_AMOUNT} GHS`);
    }

    if (typeof price === 'number' && price > PROPERTY_CONSTANTS.VALIDATION.PRICE.MAX_AMOUNT) {
      errors.push(`Price cannot exceed ${PROPERTY_CONSTANTS.VALIDATION.PRICE.MAX_AMOUNT} GHS`);
    }

    return { isValid: errors.length === 0, errors };
  }
}

/**
 * Property Transformer
 * Apple-Level transformation with monitoring and error handling
 */
class PropertyTransformer {
  private validator = new PropertyDataValidator();

  /**
   * Transform database property with comprehensive error handling
   */
  async transform(dbItem: DatabasePropertyItem): Promise<TransformResult<Property>> {
    const startTime = performance.now();
    const propertyId = dbItem.id || 'unknown';

    try {
      logger.debug('Starting property transformation', { propertyId });

      // Validate input data
      const validationResult = this.validator.validate(dbItem);
      if (!validationResult.isValid) {
        const error = new InvalidPropertyDataError(
          'Property data validation failed',
          validationResult.errors
        );
        logger.error('Property validation failed', { propertyId, errors: validationResult.errors });
        return { success: false, error, context: { propertyId, validationErrors: validationResult.errors } };
      }

      // Transform with monitoring
      const property = this.performTransformation(dbItem);

      const duration = performance.now() - startTime;

      // Performance monitoring
      if (duration > PROPERTY_CONSTANTS.PERFORMANCE.TRANSFORM_ERROR_MS) {
        logger.error('Property transformation too slow', { propertyId, duration });
      } else if (duration > PROPERTY_CONSTANTS.PERFORMANCE.TRANSFORM_WARNING_MS) {
        logger.warn('Property transformation slow', { propertyId, duration });
      }

      logger.debug('Property transformation completed', { propertyId, duration });

      return { success: true, data: property };

    } catch (error) {
      const duration = performance.now() - startTime;
      logger.error('Property transformation failed', { propertyId, duration, error });

      const transformError = new PropertyTransformError(
        `Failed to transform property ${propertyId}`,
        'transformation'
      );

      return { success: false, error: transformError, context: { propertyId, duration } };
    }
  }

  /**
   * Perform the actual transformation logic
   */
  private performTransformation(dbItem: DatabasePropertyItem): Property {
    // Safely extract profile data
    const profileData = Array.isArray(dbItem.profiles)
      ? dbItem.profiles[0]
      : dbItem.profiles;

    // Validate required fields
    if (!dbItem.rent && !dbItem.base_price_per_semester) {
      throw new MissingPriceError('Property must have a valid price', dbItem.id);
    }

    const priceAmount = dbItem.rent || dbItem.base_price_per_semester || 0;
    if (typeof priceAmount !== 'number' || priceAmount < 0) {
      throw new InvalidPriceError('Invalid price amount', priceAmount, dbItem.currency || undefined);
    }

    // Create proper User object for owner
    const owner: User | undefined = profileData ? {
      id: String(profileData.id || dbItem.owner_id || ''),
      email: String(profileData.email || ''),
      role: 'owner' as const,
      profile: {
        firstName: String(profileData.first_name || ''),
        lastName: String(profileData.last_name || ''),
        phone: String(profileData.phone || ''),
        avatar: profileData.avatar || undefined
      },
      createdAt: String(profileData.created_at || new Date().toISOString()),
      updatedAt: String(profileData.updated_at || new Date().toISOString())
    } : undefined;

    // Create properly typed Property object matching database structure
    const property: Property = {
      id: String(dbItem.id),
      title: String(dbItem.title || ''),
      description: String(dbItem.description || ''),
      property_type: String(dbItem.property_type || 'hostel'),
      property_category: dbItem.property_category || null,
      address: String(dbItem.address || ''),
      city: String(dbItem.city || ''),
      state: String(dbItem.state || ''),
      zip: String(dbItem.zip || ''),
      rent: Number(dbItem.rent || 0),
      currency: dbItem.currency || null,
      bedrooms: Number(dbItem.bedrooms || 1),
      bathrooms: Number(dbItem.bathrooms || 1),
      max_occupants: dbItem.max_occupants || null,
      is_available: dbItem.is_available || null,
      is_furnished: dbItem.is_furnished || null,
      amenities: dbItem.amenities || null,
      images: dbItem.images || null,
      owner_id: String(dbItem.owner_id || ''),
      owner,
      available_from: String(dbItem.available_from || new Date().toISOString()),
      available_to: dbItem.available_to || null,
      created_at: String(dbItem.created_at || new Date().toISOString()),
      updated_at: String(dbItem.updated_at || new Date().toISOString()),
      verification_status: dbItem.verification_status || null,
      // Additional database fields
      advance_payment_months: dbItem.advance_payment_months || null,
      allow_bill_sharing: dbItem.allow_bill_sharing || null,
      base_price_per_semester: dbItem.base_price_per_semester || null,
      beds_available: dbItem.beds_available || null,
      beds_per_room: dbItem.beds_per_room || null,
      cancellation_policy: dbItem.cancellation_policy || null,
      emergency_contact_name: dbItem.emergency_contact_name || null,
      emergency_contact_phone: dbItem.emergency_contact_phone || null,
      gender_restriction: dbItem.gender_restriction || null,
      has_accessibility_features: dbItem.has_accessibility_features || null,
      has_bedframes: dbItem.has_bedframes || null,
      has_fan: dbItem.has_fan || null,
      has_individual_meters: dbItem.has_individual_meters || null,
      has_mattresses: dbItem.has_mattresses || null,
      has_tiled_room: dbItem.has_tiled_room || null,
      has_wardrobes: dbItem.has_wardrobes || null,
      internet_speed: dbItem.internet_speed || null,
      meter_type: dbItem.meter_type || null,
      parking_available: dbItem.parking_available || null,
      parking_cost: dbItem.parking_cost || null,
      pet_policy: dbItem.pet_policy || null,
      rooms_available: dbItem.rooms_available || null,
      security_features: dbItem.security_features || null,
      semester_availability: dbItem.semester_availability || null,
      shared_meter_count: dbItem.shared_meter_count || null,
      shared_washroom_count: dbItem.shared_washroom_count || null,
      size: dbItem.size || null,
      subscription_expires_at: dbItem.subscription_expires_at || null,
      subscription_status: dbItem.subscription_status || null,
      total_rooms: dbItem.total_rooms || null,
      virtual_tour_url: dbItem.virtual_tour_url || null,
      washroom_type: dbItem.washroom_type || null,
    };

    return property;
  }
}

// Create singleton transformer instance
const propertyTransformer = new PropertyTransformer();

/**
 * Apple-Level Property Transformation Function
 * Public API with comprehensive error handling and monitoring
 *
 * @param dbItem - Database property item to transform
 * @returns Promise<TransformResult<Property>> - Transformation result with error handling
 */
export async function transformDbProperty(dbItem: DatabasePropertyItem): Promise<TransformResult<Property>> {
  return propertyTransformer.transform(dbItem);
}

/**
 * Legacy synchronous transformation function
 * Maintained for backward compatibility but logs deprecation warning
 *
 * @deprecated Use transformDbProperty async version instead
 * @param dbItem - Database property item to transform
 * @returns Property - Transformed property (throws on error)
 */
export function transformDbPropertySync(dbItem: DatabasePropertyItem): Property {
  logger.warn('Using deprecated synchronous property transformation', {
    propertyId: dbItem.id,
    deprecationNotice: 'Use transformDbProperty async version instead'
  });

  const transformer = new PropertyTransformer();
  const result = transformer['performTransformation'](dbItem);
  return result;
}

/**
 * Transform Property object to database format
 * Converts typed Property to database-compatible object
 *
 * @param property - Property object to transform
 * @returns Database-compatible property object
 */
export function transformPropertyToDb(property: Property): Record<string, unknown> {
  return {
    title: property.title,
    description: property.description,
    property_type: property.property_type,
    property_category: property.property_category,
    address: property.address,
    city: property.city,
    state: property.state,
    zip: property.zip,
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
    verification_status: property.verification_status,
    // Additional fields
    advance_payment_months: property.advance_payment_months,
    allow_bill_sharing: property.allow_bill_sharing,
    base_price_per_semester: property.base_price_per_semester,
    beds_available: property.beds_available,
    beds_per_room: property.beds_per_room,
    cancellation_policy: property.cancellation_policy,
    emergency_contact_name: property.emergency_contact_name,
    emergency_contact_phone: property.emergency_contact_phone,
    gender_restriction: property.gender_restriction,
    has_accessibility_features: property.has_accessibility_features,
    has_bedframes: property.has_bedframes,
    has_fan: property.has_fan,
    has_individual_meters: property.has_individual_meters,
    has_mattresses: property.has_mattresses,
    has_tiled_room: property.has_tiled_room,
    has_wardrobes: property.has_wardrobes,
    internet_speed: property.internet_speed,
    meter_type: property.meter_type,
    parking_available: property.parking_available,
    parking_cost: property.parking_cost,
    pet_policy: property.pet_policy,
    rooms_available: property.rooms_available,
    security_features: property.security_features,
    semester_availability: property.semester_availability,
    shared_meter_count: property.shared_meter_count,
    shared_washroom_count: property.shared_washroom_count,
    size: property.size,
    subscription_expires_at: property.subscription_expires_at,
    subscription_status: property.subscription_status,
    total_rooms: property.total_rooms,
    virtual_tour_url: property.virtual_tour_url,
    washroom_type: property.washroom_type,
  };
}
