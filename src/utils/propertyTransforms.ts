
import {
  Property,
  PropertyType,
  PropertyStatus,
  PropertyCategory,
  createPropertyId,
  createPropertyPrice,
  createAddress
} from '@/types/property';
import { User } from '@/types/core';
import { Database } from '@/integrations/supabase/types';

// Type-safe database property interface
type DatabasePropertyRow = Database['public']['Tables']['properties']['Row'] & {
  profiles?: {
    id: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
  } | {
    id: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
  }[];
};

// Simple, reliable transformation function
export function transformDbProperty(dbItem: DatabasePropertyRow): Property {
  // Safely extract profile data
  const profileData = Array.isArray(dbItem.profiles)
    ? dbItem.profiles[0]
    : dbItem.profiles;

  // Create property with all required fields, using defaults for missing data
  const property: Property = {
    // Core identification with branded types
    id: createPropertyId(String(dbItem.id || '')),
    name: String(dbItem.title || ''),
    title: String(dbItem.title || ''),
    description: String(dbItem.description || ''),
    type: (dbItem.property_type as PropertyType) || 'hostel',
    property_type: (dbItem.property_type as PropertyType) || 'hostel',
    status: (dbItem.is_available ? 'active' : 'inactive') as PropertyStatus,
    is_available: Boolean(dbItem.is_available ?? true),

    // Location with branded types
    address: createAddress(String(dbItem.address || '')),
    city: String(dbItem.city || ''),
    state: String(dbItem.state || ''),
    zip: String(dbItem.zip || ''),
    country: 'Ghana', // Default country

    // Pricing with branded types
    price: createPropertyPrice(Number(dbItem.rent || 0)),
    rent: Number(dbItem.rent || 0),
    currency: 'GHS',

    // Property features
    bedrooms: Number(dbItem.bedrooms || 1),
    bathrooms: Number(dbItem.bathrooms || 1),
    kitchens: 1, // Default
    parkingSpaces: 0, // Default
    furnished: Boolean(dbItem.is_furnished),
    is_furnished: Boolean(dbItem.is_furnished),

    // Arrays
    amenities: Array.isArray(dbItem.amenities) ? dbItem.amenities : [],
    images: Array.isArray(dbItem.images) ? dbItem.images : [],
    rules: ['No smoking', 'No pets'], // Default rules
    house_rules: ['No smoking', 'No pets'], // Database compatibility

    // Ownership
    ownerId: String(dbItem.owner_id || ''),
    owner_id: String(dbItem.owner_id || ''),

    // Timestamps
    createdAt: String(dbItem.created_at || ''),
    updatedAt: String(dbItem.updated_at || ''),
    created_at: String(dbItem.created_at || ''),
    updated_at: String(dbItem.updated_at || ''),
    available_from: String(dbItem.available_from || ''),

    // Verification
    verificationStatus: 'pending',
    verification_status: 'pending',

    // Additional fields
    media: [],
    buildings: [],
    features: {
      bedrooms: Number(dbItem.bedrooms || 1),
      bathrooms: Number(dbItem.bathrooms || 1),
      kitchens: 1,
      parkingSpaces: 0,
      furnished: Boolean(dbItem.is_furnished),
      petsAllowed: false,
      utilities: {
        water: true,
        electricity: true,
        internet: true,
        gas: false,
        cleaning: false,
        security: false,
      },
      amenities: Array.isArray(dbItem.amenities) ? dbItem.amenities : [],
      rules: ['No smoking', 'No pets'],
    }
  };

  // Add owner info safely with proper User type
  if (profileData && typeof profileData === 'object') {
    property.owner = {
      id: String(profileData.id || dbItem.owner_id || ''),
      name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || 'Property Owner',
      email: String(profileData.email || ''),
      phone: String(profileData.phone || ''),
      role: 'owner',
      first_name: profileData.first_name || '',
      last_name: profileData.last_name || '',
    } as User;
  } else {
    property.owner = {
      id: String(dbItem.owner_id || ''),
      name: 'Property Owner',
      email: '',
      phone: '',
      role: 'owner',
      first_name: '',
      last_name: '',
    } as User;
  }

  return property;
}
