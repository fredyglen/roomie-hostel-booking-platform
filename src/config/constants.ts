/**
 * ✅ PLATFORM CONSTANTS - Single Source of Truth
 *
 * Centralized constants for the ROOMie platform
 * All hardcoded values should be defined here
 */

/**
 * Price filter defaults for property search
 * Memory: User prefers 50,000 GHS max to show all properties
 */
export const PRICE_FILTER_DEFAULTS = {
  MIN: 0,
  MAX: 50000, // GHS - Maximum price for property filters
  STEP: 100    // GHS - Price slider step increment
} as const;

/**
 * Distance filter defaults for campus proximity
 */
export const DISTANCE_FILTER_DEFAULTS = {
  MIN: 1,
  MAX: 30,     // minutes
  DEFAULT: 15  // minutes
} as const;

/**
 * Minutes-to-campus filter defaults (agent/owner-reported)
 */
export const MINUTES_TO_CAMPUS_FILTER_DEFAULTS = {
  MIN: 0,
  MAX: 60,   // minutes
  STEP: 5    // minutes step
} as const;


/**
 * Pagination defaults
 */
export const PAGINATION_DEFAULTS = {
  PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100
} as const;

/**
 * Image upload constraints
 */
export const IMAGE_CONSTRAINTS = {
  MAX_SIZE_MB: 5,
  MAX_IMAGES_PER_PROPERTY: 10,
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'] as const
} as const;

/**
 * Video upload constraints
 */
export const VIDEO_CONSTRAINTS = {
  MAX_SIZE_MB: 50,
  MAX_VIDEOS_PER_PROPERTY: 3,
  ALLOWED_TYPES: ['video/mp4', 'video/webm'] as const
} as const;

