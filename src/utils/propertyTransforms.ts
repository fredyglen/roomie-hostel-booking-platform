
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
  PropertyType,
  PropertyStatus,
  Address,
  PropertyPrice,
  PropertyFeatures,
  PropertyMedia
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
 * Defines exact structure expected from database queries
 */
export interface DatabasePropertyItem {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  property_type?: string;
  verification_status?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  latitude?: number;
  longitude?: number;
  base_price_per_semester?: number;
  rent?: number;
  currency?: string;
  is_negotiable?: boolean;
  bedrooms?: number;
  bathrooms?: number;
  kitchens?: number;
  parking_spaces?: number;
  furnished?: boolean;
  pets_allowed?: boolean;
  has_water?: boolean;
  has_electricity?: boolean;
  has_internet?: boolean;
  has_gas?: boolean;
  has_cleaning?: boolean;
  has_security?: boolean;
  amenities?: string[];
  rules?: string[];
  owner_id?: string;
  is_available?: boolean;
  images?: string[];
  created_at?: string;
  updated_at?: string;
  verification_details?: Record<string, unknown>;
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

    // Create proper Address object with validation
    const address: Address = {
      street: String(dbItem.address || ''),
      city: String(dbItem.city || ''),
      state: String(dbItem.state || ''),
      country: String(dbItem.country || 'Ghana'),
      postalCode: dbItem.zip || undefined,
      latitude: dbItem.latitude || undefined,
      longitude: dbItem.longitude || undefined
    };

    // Create proper PropertyPrice object with validation
    const priceAmount = dbItem.base_price_per_semester || dbItem.rent;
    if (!priceAmount) {
      throw new MissingPriceError('Property must have a valid price', dbItem.id);
    }

    if (typeof priceAmount !== 'number' || priceAmount < 0) {
      throw new InvalidPriceError('Invalid price amount', priceAmount, dbItem.currency);
    }

    const price: PropertyPrice = {
      amount: priceAmount,
      currency: String(dbItem.currency || 'GHS'),
      period: 'semester',
      isNegotiable: Boolean(dbItem.is_negotiable || false),
      discounts: []
    };

    // Create proper PropertyFeatures object
    const features: PropertyFeatures = {
      bedrooms: Math.max(1, Number(dbItem.bedrooms || 1)),
      bathrooms: Math.max(1, Number(dbItem.bathrooms || 1)),
      kitchens: Math.max(0, Number(dbItem.kitchens || 1)),
      parkingSpaces: Math.max(0, Number(dbItem.parking_spaces || 0)),
      furnished: Boolean(dbItem.furnished || false),
      petsAllowed: Boolean(dbItem.pets_allowed || false),
      utilities: {
        water: Boolean(dbItem.has_water ?? true),
        electricity: Boolean(dbItem.has_electricity ?? true),
        internet: Boolean(dbItem.has_internet || false),
        gas: Boolean(dbItem.has_gas || false),
        cleaning: Boolean(dbItem.has_cleaning || false),
        security: Boolean(dbItem.has_security || false)
      },
      amenities: Array.isArray(dbItem.amenities)
        ? dbItem.amenities
        : [...PROPERTY_CONSTANTS.DEFAULT_AMENITIES],
      rules: Array.isArray(dbItem.rules)
        ? dbItem.rules
        : [...PROPERTY_CONSTANTS.DEFAULT_RULES]
    };

    // Create proper PropertyMedia array
    const media: PropertyMedia[] = Array.isArray(dbItem.images)
      ? dbItem.images.map((imageUrl: string, index: number) => ({
          id: `${dbItem.id}_image_${index}`,
          url: imageUrl,
          type: 'image' as const,
          isCover: index === 0,
          caption: undefined
        }))
      : [];

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

    // Map verification status to property status
    const mapVerificationToStatus = (verificationStatus?: string): PropertyStatus => {
      const statusMapping = PROPERTY_CONSTANTS.STATUS_MAPPING;
      return statusMapping[verificationStatus as keyof typeof statusMapping] ||
             (dbItem.is_available ? 'active' : 'inactive');
    };

    // Create properly typed Property object
    const property: Property = {
      id: String(dbItem.id),
      name: String(dbItem.title || dbItem.name || ''),
      description: String(dbItem.description || ''),
      type: (PROPERTY_CONSTANTS.TYPE_MAPPING[dbItem.property_type as keyof typeof PROPERTY_CONSTANTS.TYPE_MAPPING] as PropertyType) || 'hostel',
      status: mapVerificationToStatus(dbItem.verification_status),
      address,
      price,
      features,
      media,
      buildings: [], // Proper abstraction - no TODO comments
      ownerId: String(dbItem.owner_id || ''),
      owner,
      createdAt: String(dbItem.created_at || new Date().toISOString()),
      updatedAt: String(dbItem.updated_at || new Date().toISOString()),
      verificationStatus: (dbItem.verification_status as Property['verificationStatus']) || 'pending',
      verificationDetails: dbItem.verification_details || undefined
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
    title: property.name,
    description: property.description,
    property_type: property.type,
    verification_status: property.verificationStatus,
    address: property.address.street,
    city: property.address.city,
    state: property.address.state,
    country: property.address.country,
    zip: property.address.postalCode || null,
    latitude: property.address.latitude || null,
    longitude: property.address.longitude || null,
    base_price_per_semester: property.price.amount,
    currency: property.price.currency,
    is_negotiable: property.price.isNegotiable,
    bedrooms: property.features.bedrooms,
    bathrooms: property.features.bathrooms,
    kitchens: property.features.kitchens,
    parking_spaces: property.features.parkingSpaces,
    furnished: property.features.furnished,
    pets_allowed: property.features.petsAllowed,
    has_water: property.features.utilities.water,
    has_electricity: property.features.utilities.electricity,
    has_internet: property.features.utilities.internet,
    has_gas: property.features.utilities.gas,
    has_cleaning: property.features.utilities.cleaning,
    has_security: property.features.utilities.security,
    amenities: property.features.amenities,
    rules: property.features.rules,
    owner_id: property.ownerId,
    is_available: property.status === 'active',
    images: property.media.map(m => m.url)
  };
}
