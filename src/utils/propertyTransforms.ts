
/**
 * Property Transform Utilities for ROOMi Platform
 * Handles transformation between database and application property formats
 *
 * @fileoverview Apple-Level Property Transform Implementation
 * @author ROOMi Development Team
 * @version 1.0.0
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

/**
 * Transform database property item to Property interface
 * Handles all type conversions and provides safe defaults
 *
 * @param dbItem - Raw database property object
 * @returns Property - Properly typed property object
 */
export function transformDbProperty(dbItem: any): Property {
  // Safely extract profile data
  const profileData = Array.isArray(dbItem.profiles)
    ? dbItem.profiles[0]
    : dbItem.profiles;

  // Create proper Address object
  const address: Address = {
    street: String(dbItem.address || ''),
    city: String(dbItem.city || ''),
    state: String(dbItem.state || ''),
    country: String(dbItem.country || 'Ghana'),
    postalCode: dbItem.zip || undefined,
    latitude: dbItem.latitude || undefined,
    longitude: dbItem.longitude || undefined
  };

  // Create proper PropertyPrice object
  const price: PropertyPrice = {
    amount: Number(dbItem.base_price_per_semester || dbItem.rent || 0),
    currency: String(dbItem.currency || 'GHS'),
    period: 'semester',
    isNegotiable: Boolean(dbItem.is_negotiable || false),
    discounts: []
  };

  // Create proper PropertyFeatures object
  const features: PropertyFeatures = {
    bedrooms: Number(dbItem.bedrooms || 1),
    bathrooms: Number(dbItem.bathrooms || 1),
    kitchens: Number(dbItem.kitchens || 1),
    parkingSpaces: Number(dbItem.parking_spaces || 0),
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
    amenities: Array.isArray(dbItem.amenities) ? dbItem.amenities : [],
    rules: Array.isArray(dbItem.rules) ? dbItem.rules : ['No smoking', 'No loud music after 10pm']
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
    switch (verificationStatus) {
      case 'verified':
        return 'active';
      case 'rejected':
        return 'rejected';
      case 'pending':
        return 'pending';
      default:
        return dbItem.is_available ? 'active' : 'inactive';
    }
  };

  // Create properly typed Property object
  const property: Property = {
    id: String(dbItem.id || ''),
    name: String(dbItem.title || dbItem.name || ''),
    description: String(dbItem.description || ''),
    type: (dbItem.property_type as PropertyType) || 'hostel',
    status: mapVerificationToStatus(dbItem.verification_status),
    address,
    price,
    features,
    media,
    buildings: [], // TODO: Implement building structure when available
    ownerId: String(dbItem.owner_id || ''),
    owner,
    createdAt: String(dbItem.created_at || new Date().toISOString()),
    updatedAt: String(dbItem.updated_at || new Date().toISOString()),
    verificationStatus: dbItem.verification_status || 'pending',
    verificationDetails: dbItem.verification_details || undefined
  };

  return property;
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
