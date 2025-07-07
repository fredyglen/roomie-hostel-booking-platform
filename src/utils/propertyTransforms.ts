
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

  // Create property with all required fields using unified Property interface
  const property: Property = {
    // Core identification with branded types
    id: createPropertyId(String(dbItem.id || '')),
    name: String(dbItem.title || 'Unnamed Property'),
    description: String(dbItem.description || ''),
    type: (dbItem.property_type as PropertyType) || 'hostel',
    status: (dbItem.is_available ? 'available' : 'inactive') as PropertyStatus,

    // Location information
    address: {
      street: String(dbItem.address || ''),
      city: String(dbItem.city || ''),
      state: String(dbItem.state || ''),
      zipCode: String(dbItem.zip || ''),
      country: 'Ghana',
      coordinates: {
        latitude: Number(dbItem.latitude || 0),
        longitude: Number(dbItem.longitude || 0)
      }
    },

    // Pricing with branded types
    price: createPropertyPrice(Number(dbItem.rent || dbItem.base_price_per_semester || 0)),

    // Physical features
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
    },

    // Media
    media: Array.isArray(dbItem.images)
      ? dbItem.images.map((url, index) => ({
          id: `${dbItem.id}-${index}`,
          url,
          type: 'image' as const,
          isCover: index === 0,
        }))
      : [],

    // Ownership and metadata
    ownerId: String(dbItem.owner_id || ''),
    owner: profileData ? {
      id: String(profileData.id || dbItem.owner_id || ''),
      first_name: String(profileData.first_name || 'Property'),
      last_name: String(profileData.last_name || 'Owner'),
      email: String(profileData.email || 'owner@example.com'),
      phone: String(profileData.phone || ''),
      role: 'owner' as const,
    } : {
      id: String(dbItem.owner_id || ''),
      first_name: 'Property',
      last_name: 'Owner',
      email: 'owner@example.com',
      phone: '',
      role: 'owner' as const,
    },
    buildings: [],

    // Timestamps
    createdAt: String(dbItem.created_at || new Date().toISOString()),
    updatedAt: String(dbItem.updated_at || new Date().toISOString()),

    // Verification
    verificationStatus: (dbItem.verification_status as any) || 'pending',
  };

  return property;
}
