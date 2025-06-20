/**
 * Property Constants Configuration for ROOMi Platform
 * Apple-Level configuration management with type safety
 *
 * @fileoverview Centralized Property Configuration
 * @author ROOMi Development Team
 * @version 1.0.0
 */

/**
 * Default property rules for Ghana student housing
 * Based on common university accommodation standards
 */
export const DEFAULT_PROPERTY_RULES = [
  'No smoking inside the premises',
  'No loud music after 10:00 PM',
  'No overnight guests without prior approval',
  'Keep common areas clean and tidy',
  'Respect other tenants and neighbors',
  'No illegal substances or activities',
  'Report maintenance issues promptly',
  'Follow university academic calendar for occupancy'
] as const;

/**
 * Property validation constraints
 */
export const PROPERTY_VALIDATION = {
  TITLE: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 100
  },
  DESCRIPTION: {
    MIN_LENGTH: 20,
    MAX_LENGTH: 2000
  },
  PRICE: {
    MIN_AMOUNT: 100, // Minimum 100 GHS per semester
    MAX_AMOUNT: 50000, // Maximum 50,000 GHS per semester
    SUPPORTED_CURRENCIES: ['GHS', 'USD', 'EUR'] as const
  },
  BEDROOMS: {
    MIN: 1,
    MAX: 20
  },
  BATHROOMS: {
    MIN: 1,
    MAX: 10
  },
  IMAGES: {
    MIN_COUNT: 1,
    MAX_COUNT: 20,
    MAX_SIZE_MB: 5
  }
} as const;

/**
 * Property type mappings for database compatibility
 */
export const PROPERTY_TYPE_MAPPING = {
  'hostel': 'hostel',
  'apartment': 'apartment',
  'house': 'house',
  'room': 'room',
  'studio': 'studio',
  'shared_room': 'shared_room'
} as const;

/**
 * Property status mappings
 */
export const PROPERTY_STATUS_MAPPING = {
  'available': 'active',
  'unavailable': 'inactive',
  'pending': 'pending',
  'verified': 'active',
  'unverified': 'pending'
} as const;

/**
 * Default amenities for Ghana student housing
 */
export const DEFAULT_AMENITIES = [
  'Water supply',
  'Electricity',
  'Security',
  'Cleaning service'
] as const;

/**
 * Performance monitoring thresholds
 */
export const PERFORMANCE_THRESHOLDS = {
  TRANSFORM_WARNING_MS: 10,
  TRANSFORM_ERROR_MS: 50,
  BATCH_SIZE_LIMIT: 100
} as const;

export const PROPERTY_CONSTANTS = {
  DEFAULT_RULES: DEFAULT_PROPERTY_RULES,
  VALIDATION: PROPERTY_VALIDATION,
  TYPE_MAPPING: PROPERTY_TYPE_MAPPING,
  STATUS_MAPPING: PROPERTY_STATUS_MAPPING,
  DEFAULT_AMENITIES,
  PERFORMANCE: PERFORMANCE_THRESHOLDS
} as const;

export type PropertyConstants = typeof PROPERTY_CONSTANTS;
