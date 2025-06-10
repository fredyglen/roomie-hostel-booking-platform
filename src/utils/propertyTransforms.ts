
import { Property, PropertyType, PropertyStatus, PropertyCategory } from '@/types/property';

// Simple interface for database results - avoid complex inference
export interface RawProperty {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zip?: string;
  rent: number;
  property_type: string;
  property_category?: string;
  is_available: boolean;
  bedrooms: number;
  bathrooms: number;
  amenities?: string[];
  images?: string[];
  available_from?: string;
  available_to?: string;
  created_at: string;
  updated_at: string;
  house_rules?: string;
  profiles?: any;
}

// Simple, reliable transformation function
export function transformDbProperty(dbItem: any): Property {
  // Safely extract profile data
  const profileData = Array.isArray(dbItem.profiles) 
    ? dbItem.profiles[0] 
    : dbItem.profiles;
  
  // Create property with all required fields
  const property: Property = {
    id: String(dbItem.id || ''),
    owner_id: String(dbItem.owner_id || ''),
    name: String(dbItem.title || dbItem.name || ''),
    title: String(dbItem.title || dbItem.name || ''),
    description: String(dbItem.description || ''),
    type: (dbItem.property_type as PropertyType) || 'hostel',
    status: (dbItem.is_available ? 'available' : 'occupied') as PropertyStatus,
    price: Number(dbItem.rent || dbItem.price || 0),
    rent: Number(dbItem.rent || dbItem.price || 0),
    location: String(dbItem.address || ''),
    address: String(dbItem.address || ''),
    city: String(dbItem.city || ''),
    state: String(dbItem.state || ''),
    zip: String(dbItem.zip || ''),
    propertyCategory: (dbItem.property_category as PropertyCategory) || 'Hostel',
    verified: Boolean(dbItem.verified ?? true),
    is_available: Boolean(dbItem.is_available ?? true),
    bedrooms: Number(dbItem.bedrooms || 1),
    bathrooms: Number(dbItem.bathrooms || 1),
    amenities: Array.isArray(dbItem.amenities) ? dbItem.amenities : [],
    images: Array.isArray(dbItem.images) ? dbItem.images : [],
    available_from: String(dbItem.available_from || ''),
    created_at: String(dbItem.created_at || ''),
    updated_at: String(dbItem.updated_at || ''),
    house_rules: String(dbItem.house_rules || 'No smoking, no pets'),
    stories: [],
    features: []
  };

  // Add owner info safely
  if (profileData && typeof profileData === 'object') {
    property.owner = {
      id: String(profileData.id || dbItem.owner_id || ''),
      name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || 'Property Owner',
      email: String(profileData.email || ''),
      phone: String(profileData.phone || ''),
      verified: true,
      responseRate: '95%'
    };
  } else {
    property.owner = {
      id: String(dbItem.owner_id || ''),
      name: 'Property Owner',
      email: '',
      phone: '',
      verified: false,
      responseRate: '0%'
    };
  }

  return property;
}
