/**
 * ✅ CENTRALIZED PROPERTY TYPES CONFIGURATION
 * 
 * Single source of truth for all property type definitions across ROOMie platform.
 * Eliminates hardcoded property types and ensures consistency.
 * 
 * Property Categories:
 * - Hostel: Traditional student hostels (semester-based pricing, bed tracking)
 * - Homestel: Converted homes to hostels (flexible pricing, room tracking)
 * - Apartment: Executive apartments (monthly pricing, unit tracking)
 */

import { Building, Home, Users } from 'lucide-react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Property type enum - lowercase for database storage
 */
export type PropertyType = 'hostel' | 'homestel' | 'apartment';

/**
 * Property category enum - title case for UI display
 */
export type PropertyCategory = 'Hostel' | 'Homestel' | 'Apartment';

/**
 * Room occupancy types - Ghana standard "X in a room" system
 */
export type RoomOccupancyType =
  | '1_in_a_room'
  | '2_in_a_room'
  | '3_in_a_room'
  | '4_in_a_room'
  | '5_in_a_room'
  | '6_in_a_room';

/**
 * Pricing unit types for different property categories
 */
export type PricingUnit = 'week' | 'month' | 'semester' | 'year';

/**
 * Occupancy tracking types
 */
export type OccupancyType = 'beds' | 'rooms' | 'units';

/**
 * Property type configuration interface
 */
export interface PropertyTypeConfig {
  readonly type: PropertyType;
  readonly category: PropertyCategory;
  readonly displayName: string;
  readonly description: string;
  readonly icon: typeof Building | typeof Home | typeof Users;
  readonly defaultPricingUnit: PricingUnit;
  readonly allowedPricingUnits: readonly PricingUnit[];
  readonly occupancyType: OccupancyType;
  readonly defaultRoomTypes: readonly RoomOccupancyType[];
  readonly features: {
    readonly hasStructure: boolean; // Buildings/floors/rooms structure
    readonly hasRoomTypes: boolean; // Multiple room type options
    readonly hasFlexiblePricing: boolean; // Multiple pricing durations
    readonly requiresVerification: boolean;
  };
}

// ============================================================================
// PROPERTY TYPE CONFIGURATIONS
// ============================================================================

/**
 * ✅ HOSTEL CONFIGURATION
 * Traditional student hostels with semester-based pricing
 */
const HOSTEL_CONFIG: PropertyTypeConfig = {
  type: 'hostel',
  category: 'Hostel',
  displayName: 'Hostel',
  description: 'Traditional student hostels with semester-based pricing and bed tracking',
  icon: Building,
  defaultPricingUnit: 'semester',
  allowedPricingUnits: ['semester', 'year'],
  occupancyType: 'beds',
  defaultRoomTypes: ['1_in_a_room', '2_in_a_room', '3_in_a_room', '4_in_a_room'],
  features: {
    hasStructure: true,
    hasRoomTypes: true,
    hasFlexiblePricing: false,
    requiresVerification: true
  }
} as const;

/**
 * ✅ HOMESTEL CONFIGURATION
 * Converted homes with flexible pricing
 */
const HOMESTEL_CONFIG: PropertyTypeConfig = {
  type: 'homestel',
  category: 'Homestel',
  displayName: 'Homestel',
  description: 'Converted homes with flexible pricing (weekly to yearly) and room tracking',
  icon: Home,
  defaultPricingUnit: 'month',
  allowedPricingUnits: ['week', 'month', 'semester', 'year'],
  occupancyType: 'rooms',
  defaultRoomTypes: ['1_in_a_room', '2_in_a_room', '3_in_a_room', '4_in_a_room'],
  features: {
    hasStructure: true,
    hasRoomTypes: true,
    hasFlexiblePricing: true,
    requiresVerification: true
  }
} as const;

/**
 * ✅ APARTMENT CONFIGURATION
 * Executive apartments with monthly pricing
 */
const APARTMENT_CONFIG: PropertyTypeConfig = {
  type: 'apartment',
  category: 'Apartment',
  displayName: 'Apartment',
  description: 'Executive apartments with monthly pricing and unit tracking',
  icon: Users,
  defaultPricingUnit: 'month',
  allowedPricingUnits: ['month', 'year'],
  occupancyType: 'units',
  defaultRoomTypes: ['1_in_a_room', '2_in_a_room', '3_in_a_room'],
  features: {
    hasStructure: false,
    hasRoomTypes: false,
    hasFlexiblePricing: false,
    requiresVerification: true
  }
} as const;

/**
 * ✅ CENTRALIZED PROPERTY TYPES REGISTRY
 * Single source of truth for all property type configurations
 */
export const PROPERTY_TYPES = {
  HOSTEL: HOSTEL_CONFIG,
  HOMESTEL: HOMESTEL_CONFIG,
  APARTMENT: APARTMENT_CONFIG
} as const;

// ============================================================================
// ROOM TYPE UTILITIES
// ============================================================================

/**
 * Room type display labels
 */
export const ROOM_TYPE_LABELS: Record<RoomOccupancyType, string> = {
  '1_in_a_room': '1 in a Room',
  '2_in_a_room': '2 in a Room',
  '3_in_a_room': '3 in a Room',
  '4_in_a_room': '4 in a Room',
  '5_in_a_room': '5 in a Room',
  '6_in_a_room': '6 in a Room'
} as const;

/**
 * Convert room type to occupant count
 */
export const getRoomOccupantCount = (roomType: RoomOccupancyType): number => {
  const match = roomType.match(/^(\d+)_in_a_room$/);
  return match ? parseInt(match[1], 10) : 1;
};

/**
 * Format room type for display
 */
export const formatRoomTypeLabel = (roomType: RoomOccupancyType | string): string => {
  if (roomType in ROOM_TYPE_LABELS) {
    return ROOM_TYPE_LABELS[roomType as RoomOccupancyType];
  }
  // Fallback for non-standard formats
  const match = roomType.match(/^(\d+)_in_a_room$/);
  return match ? `${match[1]} in a Room` : roomType;
};

/**
 * Get all available room types
 */
export const getAllRoomTypes = (): readonly RoomOccupancyType[] => {
  return ['1_in_a_room', '2_in_a_room', '3_in_a_room', '4_in_a_room', '5_in_a_room', '6_in_a_room'] as const;
};

// ============================================================================
// PROPERTY TYPE HELPER FUNCTIONS
// ============================================================================

/**
 * Get configuration for a specific property type
 */
export const getPropertyTypeConfig = (type: PropertyType): PropertyTypeConfig => {
  switch (type) {
    case 'hostel':
      return PROPERTY_TYPES.HOSTEL;
    case 'homestel':
      return PROPERTY_TYPES.HOMESTEL;
    case 'apartment':
      return PROPERTY_TYPES.APARTMENT;
    default:
      throw new Error(`Unknown property type: ${type}`);
  }
};

/**
 * Get configuration by category name
 */
export const getPropertyConfigByCategory = (category: PropertyCategory): PropertyTypeConfig => {
  switch (category) {
    case 'Hostel':
      return PROPERTY_TYPES.HOSTEL;
    case 'Homestel':
      return PROPERTY_TYPES.HOMESTEL;
    case 'Apartment':
      return PROPERTY_TYPES.APARTMENT;
    default:
      throw new Error(`Unknown property category: ${category}`);
  }
};

/**
 * Get all property type configurations as array
 */
export const getAllPropertyTypes = (): readonly PropertyTypeConfig[] => {
  return [PROPERTY_TYPES.HOSTEL, PROPERTY_TYPES.HOMESTEL, PROPERTY_TYPES.APARTMENT] as const;
};

/**
 * Get property type options for dropdowns
 */
export const getPropertyTypeOptions = () => {
  return getAllPropertyTypes().map(config => ({
    value: config.category,
    label: config.displayName,
    description: config.description,
    icon: config.icon
  }));
};

/**
 * Convert category to type (title case to lowercase)
 */
export const categoryToType = (category: PropertyCategory): PropertyType => {
  return category.toLowerCase() as PropertyType;
};

/**
 * Convert type to category (lowercase to title case)
 */
export const typeToCategory = (type: PropertyType): PropertyCategory => {
  return (type.charAt(0).toUpperCase() + type.slice(1)) as PropertyCategory;
};

/**
 * Validate property type
 */
export const isValidPropertyType = (type: string): type is PropertyType => {
  return type === 'hostel' || type === 'homestel' || type === 'apartment';
};

/**
 * Validate property category
 */
export const isValidPropertyCategory = (category: string): category is PropertyCategory => {
  return category === 'Hostel' || category === 'Homestel' || category === 'Apartment';
};

/**
 * Get default pricing unit for property type
 */
export const getDefaultPricingUnit = (type: PropertyType): PricingUnit => {
  return getPropertyTypeConfig(type).defaultPricingUnit;
};

/**
 * Get allowed pricing units for property type
 */
export const getAllowedPricingUnits = (type: PropertyType): readonly PricingUnit[] => {
  return getPropertyTypeConfig(type).allowedPricingUnits;
};

/**
 * Check if property type supports flexible pricing
 */
export const hasFlexiblePricing = (type: PropertyType): boolean => {
  return getPropertyTypeConfig(type).features.hasFlexiblePricing;
};

/**
 * Get occupancy type for property type
 */
export const getOccupancyType = (type: PropertyType): OccupancyType => {
  return getPropertyTypeConfig(type).occupancyType;
};

