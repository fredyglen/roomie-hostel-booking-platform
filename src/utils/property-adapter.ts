/**
 * Property Adapter Utility
 * Handles conversion between legacy Property interface and new database-aligned Property interface
 * Provides backward compatibility during the transition period
 */

import { Property, Address, PropertyPrice, PropertyFeatures, PropertyMedia } from '@/types/property';
import { Database } from '@/integrations/supabase/types';

// Database property type from Supabase
type DatabaseProperty = Database['public']['Tables']['properties']['Row'];

// Legacy Property interface for backward compatibility
export interface LegacyProperty {
  id: string;
  name: string;
  description: string;
  type: string;
  status: string;
  address: Address;
  price: PropertyPrice;
  features: PropertyFeatures;
  media: PropertyMedia[];
  buildings: any[];
  ownerId: string;
  owner?: any;
  createdAt: string;
  updatedAt: string;
  verificationStatus: string;
}

/**
 * Converts legacy Property to new database-aligned Property
 */
export function adaptLegacyToNew(legacy: LegacyProperty): Property {
  return {
    id: legacy.id,
    title: legacy.name,
    description: legacy.description,
    property_type: legacy.type,
    property_category: null,
    address: legacy.address.street,
    city: legacy.address.city,
    state: legacy.address.state,
    zip: legacy.address.postalCode || '',
    rent: legacy.price.amount,
    currency: legacy.price.currency,
    bedrooms: legacy.features.bedrooms,
    bathrooms: legacy.features.bathrooms,
    max_occupants: null,
    is_available: legacy.status === 'active',
    is_furnished: legacy.features.furnished,
    amenities: legacy.features.amenities,
    images: legacy.media.map(m => m.url),
    owner_id: legacy.ownerId,
    owner: legacy.owner,
    available_from: legacy.createdAt,
    available_to: null,
    created_at: legacy.createdAt,
    updated_at: legacy.updatedAt,
    verification_status: legacy.verificationStatus,
    // Additional required database fields
    advance_payment_months: null,
    allow_bill_sharing: null,
    base_price_per_semester: legacy.price.amount,
    beds_available: null,
    beds_per_room: null,
    cancellation_policy: null,
    emergency_contact_name: null,
    emergency_contact_phone: null,
    gender_restriction: null,
    has_accessibility_features: null,
    has_bedframes: null,
    has_fan: null,
    has_individual_meters: null,
    has_mattresses: null,
    has_tiled_room: null,
    has_wardrobes: null,
    internet_speed: null,
    meter_type: null,
    parking_available: null,
    parking_cost: null,
    pet_policy: null,
    rooms_available: null,
    security_features: null,
    semester_availability: null,
    shared_meter_count: null,
    shared_washroom_count: null,
    size: null,
    subscription_expires_at: null,
    subscription_status: null,
    total_rooms: null,
    virtual_tour_url: null,
    washroom_type: null,
  };
}

/**
 * Converts new Property to legacy Property for backward compatibility
 */
export function adaptNewToLegacy(newProp: Property): LegacyProperty {
  return {
    id: newProp.id,
    name: newProp.title,
    description: newProp.description,
    type: newProp.property_type,
    status: newProp.is_available ? 'active' : 'inactive',
    address: {
      street: newProp.address,
      city: newProp.city,
      state: newProp.state,
      country: 'Ghana',
      postalCode: '',
      latitude: 0,
      longitude: 0,
    },
    price: {
      amount: newProp.rent,
      currency: newProp.currency || 'GHS',
      period: 'semester',
      isNegotiable: false,
    },
    features: {
      bedrooms: newProp.bedrooms,
      bathrooms: newProp.bathrooms,
      kitchens: 0,
      parkingSpaces: 0,
      furnished: newProp.is_furnished || false,
      petsAllowed: false,
      utilities: {
        water: true,
        electricity: true,
        internet: true,
        gas: false,
        cleaning: false,
        security: false,
      },
      amenities: newProp.amenities || [],
      rules: [],
    },
    media: (newProp.images || []).map((url, index) => ({
      id: `${newProp.id}-${index}`,
      url,
      type: 'image' as const,
      isCover: index === 0,
    })),
    buildings: [],
    ownerId: newProp.owner_id,
    owner: newProp.owner,
    createdAt: newProp.created_at,
    updatedAt: newProp.updated_at,
    verificationStatus: newProp.verification_status || 'pending',
  };
}

/**
 * Converts database property to frontend Property
 */
export function adaptDatabaseToProperty(dbProp: DatabaseProperty): Property {
  return {
    id: dbProp.id,
    title: dbProp.title || '',
    description: dbProp.description,
    property_type: dbProp.property_type,
    property_category: dbProp.property_category,
    address: dbProp.address,
    city: dbProp.city,
    state: dbProp.state,
    zip: dbProp.zip,
    rent: dbProp.rent,
    currency: dbProp.currency,
    bedrooms: dbProp.bedrooms,
    bathrooms: dbProp.bathrooms,
    max_occupants: dbProp.max_occupants,
    is_available: dbProp.is_available,
    is_furnished: dbProp.is_furnished,
    amenities: dbProp.amenities,
    images: dbProp.images,
    owner_id: dbProp.owner_id,
    available_from: dbProp.available_from,
    available_to: dbProp.available_to,
    created_at: dbProp.created_at,
    updated_at: dbProp.updated_at,
    verification_status: dbProp.verification_status,
    // Additional fields
    advance_payment_months: dbProp.advance_payment_months,
    allow_bill_sharing: dbProp.allow_bill_sharing,
    base_price_per_semester: dbProp.base_price_per_semester,
    beds_available: dbProp.beds_available,
    beds_per_room: dbProp.beds_per_room,
    cancellation_policy: dbProp.cancellation_policy,
    emergency_contact_name: dbProp.emergency_contact_name,
    emergency_contact_phone: dbProp.emergency_contact_phone,
    gender_restriction: dbProp.gender_restriction,
    has_accessibility_features: dbProp.has_accessibility_features,
    has_bedframes: dbProp.has_bedframes,
    has_fan: dbProp.has_fan,
    has_individual_meters: dbProp.has_individual_meters,
    has_mattresses: dbProp.has_mattresses,
    has_tiled_room: dbProp.has_tiled_room,
    has_wardrobes: dbProp.has_wardrobes,
    internet_speed: dbProp.internet_speed,
    meter_type: dbProp.meter_type,
    parking_available: dbProp.parking_available,
    parking_cost: dbProp.parking_cost,
    pet_policy: dbProp.pet_policy,
    rooms_available: dbProp.rooms_available,
    security_features: dbProp.security_features,
    semester_availability: dbProp.semester_availability,
    shared_meter_count: dbProp.shared_meter_count,
    shared_washroom_count: dbProp.shared_washroom_count,
    size: dbProp.size,
    subscription_expires_at: dbProp.subscription_expires_at,
    subscription_status: dbProp.subscription_status,
    total_rooms: dbProp.total_rooms,
    virtual_tour_url: dbProp.virtual_tour_url,
    washroom_type: dbProp.washroom_type,
  };
}

/**
 * Helper function to safely access property title
 */
export function getPropertyTitle(property: Property | LegacyProperty): string {
  if ('title' in property) {
    return property.title;
  }
  if ('name' in property) {
    return (property as LegacyProperty).name;
  }
  return 'Untitled Property';
}

/**
 * Helper function to safely access property owner ID
 */
export function getPropertyOwnerId(property: Property | LegacyProperty): string {
  if ('owner_id' in property) {
    return property.owner_id;
  }
  if ('ownerId' in property) {
    return (property as LegacyProperty).ownerId;
  }
  return '';
}

/**
 * Helper function to safely access property address
 */
export function getPropertyAddress(property: Property | LegacyProperty): string {
  if ('address' in property && typeof property.address === 'string') {
    return property.address;
  }
  if ('address' in property && typeof property.address === 'object') {
    const addr = property.address as Address;
    return addr.street || '';
  }
  return '';
}

/**
 * Helper function to safely access property price
 */
export function getPropertyPrice(property: Property | LegacyProperty): number {
  if ('rent' in property) {
    return property.rent;
  }
  if ('price' in property && typeof property.price === 'object') {
    return (property as LegacyProperty).price.amount;
  }
  return 0;
}
