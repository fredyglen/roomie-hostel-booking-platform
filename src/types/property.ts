
/**
 * ROOMi Platform Property Type Definitions
 * Apple-Grade TypeScript interfaces with zero tolerance for 'any' types
 *
 * UNIFIED PROPERTY INTERFACE - Single source of truth for all property types
 * Eliminates conflicts between legacy interfaces and ensures type safety
 *
 * @version 2.0.0 - Technical Debt Elimination
 * @author ROOMi Platform Team
 */

import { User } from './core';

// =====================================================
// BRANDED TYPES FOR TYPE SAFETY
// =====================================================

type Brand<T, B> = T & { readonly __brand: B };

export type PropertyId = Brand<string, 'PropertyId'>;
export type PropertyPrice = Brand<number, 'PropertyPrice'>;
export type Address = Brand<string, 'Address'>;

// =====================================================
// CORE PROPERTY INTERFACE - UNIFIED
// =====================================================

/**
 * Main Property interface - unified from all legacy interfaces
 * Matches database schema exactly for type safety
 */
export interface Property {
  // Core identification
  readonly id: PropertyId;
  readonly name: string;
  readonly title?: string; // Legacy compatibility
  readonly description: string;
  readonly type: PropertyType;
  readonly property_type?: PropertyType; // Database compatibility
  readonly status: PropertyStatus;
  readonly is_available?: boolean; // Database compatibility

  // Location information
  readonly address: Address;
  readonly city?: string; // Database compatibility
  readonly state?: string; // Database compatibility
  readonly country?: string; // Database compatibility
  readonly zip?: string; // Database compatibility
  readonly latitude?: number;
  readonly longitude?: number;

  // Pricing
  readonly price: PropertyPrice;
  readonly rent?: number; // Database compatibility
  readonly currency?: string;
  readonly base_price_per_semester?: number; // Database compatibility

  // Features and amenities
  readonly features: PropertyFeatures;
  readonly amenities?: string[]; // Database compatibility
  readonly bedrooms?: number; // Database compatibility
  readonly bathrooms?: number; // Database compatibility
  readonly max_occupants?: number; // Database compatibility

  // Media
  readonly media: PropertyMedia[];
  readonly images?: string[]; // Legacy compatibility
  readonly videos?: string[]; // Legacy compatibility

  // Structure
  readonly buildings: Building[];
  readonly rooms?: Room[]; // Database compatibility

  // Ownership
  readonly ownerId: string;
  readonly owner_id?: string; // Database compatibility
  readonly agent_id?: string; // Database compatibility
  readonly owner?: User;

  // Metadata
  readonly createdAt: string;
  readonly created_at?: string; // Database compatibility
  readonly updatedAt: string;
  readonly updated_at?: string; // Database compatibility
  readonly verificationStatus: VerificationStatus;
  readonly verification_status?: VerificationStatus; // Database compatibility
  readonly verificationDetails?: VerificationDetails;

  // Additional database fields
  readonly available_from?: string;
  readonly available_to?: string;
  readonly house_rules?: string[];
  readonly rules?: string[]; // Legacy compatibility
  readonly distance_to_campus?: number;
  readonly nearest_university?: string;
  readonly is_active?: boolean;
  readonly advance_payment_months?: number;
  readonly allow_bill_sharing?: boolean;
  readonly property_category?: string;
  readonly gender_type?: string;
  readonly max_occupancy?: number;
  readonly current_occupancy?: number;
  readonly total_beds?: number;
}

// =====================================================
// PROPERTY ENUMS AND TYPES
// =====================================================

export type PropertyType = 'hostel' | 'homestel' | 'apartment' | 'house' | 'dormitory';

export type PropertyStatus = 'active' | 'inactive' | 'pending' | 'rejected' | 'available' | 'unavailable';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface VerificationDetails {
  readonly verifiedBy?: string;
  readonly verifiedAt?: string;
  readonly rejectionReason?: string;
  readonly notes?: string;
}

// =====================================================
// PROPERTY FEATURES
// =====================================================

export interface PropertyFeatures {
  readonly bedrooms: number;
  readonly bathrooms: number;
  readonly kitchens: number;
  readonly parkingSpaces: number;
  readonly furnished: boolean;
  readonly petsAllowed: boolean;
  readonly utilities: Utilities;
  readonly amenities: string[];
  readonly rules: string[];
}

export interface Utilities {
  readonly water: boolean;
  readonly electricity: boolean;
  readonly internet: boolean;
  readonly gas: boolean;
  readonly cleaning: boolean;
  readonly security: boolean;
}

// =====================================================
// PROPERTY MEDIA
// =====================================================

export interface PropertyMedia {
  readonly id: string;
  readonly url: string;
  readonly type: 'image' | 'video';
  readonly isCover: boolean;
  readonly caption?: string;
}

// =====================================================
// BUILDING STRUCTURE
// =====================================================

export interface Building {
  readonly id: string;
  readonly name: string;
  readonly floors: Floor[];
}

export interface Floor {
  readonly id: string;
  readonly name: string;
  readonly rooms: Room[];
}

export interface Room {
  readonly id: string;
  readonly name?: string;
  readonly room_number?: string; // Database compatibility
  readonly type: RoomType;
  readonly room_type?: string; // Database compatibility
  readonly capacity: number;
  readonly max_occupants?: number; // Database compatibility
  readonly price: number;
  readonly rent_amount?: number; // Database compatibility
  readonly isAvailable: boolean;
  readonly is_available?: boolean; // Database compatibility
  readonly features?: string[];
  readonly amenities?: string[]; // Database compatibility
  readonly property_id?: string; // Database compatibility
  readonly floor_id?: string; // Database compatibility
  readonly available_beds?: number; // Database compatibility
  readonly occupied_beds?: number; // Database compatibility
  readonly is_room_available?: boolean; // Database compatibility
  readonly bed_count?: number; // Database compatibility
  readonly beds_available?: number; // Database compatibility
  readonly description?: string; // Database compatibility
  readonly images?: string[]; // Database compatibility
}

export type RoomType = 'single' | 'double' | 'triple' | 'quad' | 'suite';

// =====================================================
// OWNER INTERFACE
// =====================================================

/**
 * Property owner interface for PropertyOwnerCard component
 * Extends User with owner-specific properties
 */
export interface Owner {
  readonly id: string;
  readonly name?: string;
  readonly email?: string;
  readonly phone?: string;
  readonly avatar?: string;
  readonly responseRate?: string;
  readonly verified?: boolean;
}

// =====================================================
// PROPERTY FORM AND API TYPES
// =====================================================

/**
 * Property form values for creation/editing
 */
export interface PropertyFormValues {
  readonly name: string;
  readonly description: string;
  readonly type: PropertyType;
  readonly address: Address;
  readonly price: PropertyPrice;
  readonly features: PropertyFeatures;
  readonly media: PropertyMedia[];
  readonly buildings: Building[];
}

/**
 * Property insert type for database operations
 * Omits auto-generated fields
 */
export type PropertyInsert = Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'owner'>;

/**
 * Property update type for database operations
 * All fields optional except id
 */
export type PropertyUpdate = Partial<Omit<Property, 'id'>> & { readonly id: PropertyId };

// =====================================================
// LEGACY COMPATIBILITY TYPES
// =====================================================

/**
 * Legacy property interface for backward compatibility
 * @deprecated Use Property interface instead
 */
export interface LegacyProperty {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly propertyType: string;
  readonly status: string;
  readonly location: {
    readonly address: string;
    readonly city: string;
    readonly state: string;
    readonly country: string;
    readonly coordinates?: {
      readonly lat: number;
      readonly lng: number;
    };
  };
  readonly rent?: number;
  readonly price?: number;
  readonly currency?: string;
  readonly bedrooms?: number;
  readonly bathrooms?: number;
  readonly maxOccupants?: number;
  readonly amenities?: string[];
  readonly rules?: string[];
  readonly images?: string[];
  readonly videos?: string[];
  readonly availableFrom?: string;
  readonly availableTo?: string;
  readonly isActive?: boolean;
  readonly distanceToCampus?: number;
  readonly nearestUniversity?: string;
  readonly house_rules?: string[];
  readonly owner?: {
    readonly id: string;
    readonly name?: string;
    readonly email?: string;
    readonly phone?: string;
  };
}

// =====================================================
// PROPERTY SEARCH AND FILTER TYPES
// =====================================================

export interface PropertySearchParams {
  readonly type?: PropertyType;
  readonly city?: string;
  readonly minPrice?: number;
  readonly maxPrice?: number;
  readonly status?: PropertyStatus;
  readonly bedrooms?: number;
  readonly bathrooms?: number;
  readonly amenities?: string[];
  readonly maxDistance?: number;
  readonly university?: string;
}

export interface PropertyFilters {
  readonly priceRange: {
    readonly min: number;
    readonly max: number;
  };
  readonly propertyTypes: PropertyType[];
  readonly amenities: string[];
  readonly locations: string[];
  readonly availability: boolean;
}

// =====================================================
// PROPERTY CATEGORY TYPES
// =====================================================

export type PropertyCategory = 'Hostel' | 'Homestel' | 'Apartment' | 'House' | 'Dormitory';

// =====================================================
// HELPER FUNCTIONS FOR TYPE SAFETY
// =====================================================

/**
 * Type guard to check if a value is a valid PropertyId
 */
export function isPropertyId(value: unknown): value is PropertyId {
  return typeof value === 'string' && value.length > 0;
}

/**
 * Type guard to check if a value is a valid PropertyPrice
 */
export function isPropertyPrice(value: unknown): value is PropertyPrice {
  return typeof value === 'number' && value >= 0;
}

/**
 * Type guard to check if a value is a valid Address
 */
export function isAddress(value: unknown): value is Address {
  return typeof value === 'string' && value.length > 0;
}

/**
 * Creates a PropertyId from a string
 */
export function createPropertyId(id: string): PropertyId {
  if (!isPropertyId(id)) {
    throw new Error(`Invalid PropertyId: ${id}`);
  }
  return id as PropertyId;
}

/**
 * Creates a PropertyPrice from a number
 */
export function createPropertyPrice(price: number): PropertyPrice {
  if (!isPropertyPrice(price)) {
    throw new Error(`Invalid PropertyPrice: ${price}`);
  }
  return price as PropertyPrice;
}

/**
 * Creates an Address from a string
 */
export function createAddress(address: string): Address {
  if (!isAddress(address)) {
    throw new Error(`Invalid Address: ${address}`);
  }
  return address as Address;
}

// Ghana-specific hostel types for semester-based pricing
export interface GhanaHostelProperty {
  id: string;
  name: string;
  description: string;
  images: string[];
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates?: { lat: number; lng: number };
  };
  pricePerSemester: number; // Base price for semester (4 months)
  roomOptions: RoomOption[];
  distanceToCampus: number; // in kilometers
  nearestUniversity: string;
  propertyType: 'hostel' | 'shared_room' | 'apartment';
  bedrooms: number;
  bathrooms: number;
  maxOccupants: number;
  amenities: string[];
  rules: string[];
  owner: {
    id: string;
    name: string;
    email: string;
    phone: string;
    responseRate?: string;
    verified?: boolean;
  };
  availableFrom: string;
  availableTo: string;
  isActive: boolean;
  features: string[];
  house_rules: string;
  stories?: string[];
}

export interface RoomOption {
  type: string; // e.g., '2-in-a-room', '4-in-a-room', '1-in-a-room'
  price: number; // Price per semester for this room type
  available: boolean;
  description?: string;
  maxOccupants?: number;
}
