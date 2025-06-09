
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
  profiles?: any; // Use any to avoid deep inference
}

// Simple transformation function
export function transformDbProperty(dbItem: any): Property {
  // Extract profile data safely
  const profileData = Array.isArray(dbItem.profiles) 
    ? dbItem.profiles[0] 
    : dbItem.profiles;
  
  const property: Property = {
    id: dbItem.id,
    owner_id: dbItem.owner_id,
    name: dbItem.title,
    title: dbItem.title,
    description: dbItem.description,
    type: (dbItem.property_type as PropertyType) || 'hostel',
    status: (dbItem.is_available ? 'available' : 'occupied') as PropertyStatus,
    price: dbItem.rent,
    rent: dbItem.rent,
    location: dbItem.address,
    address: dbItem.address,
    city: dbItem.city,
    state: dbItem.state,
    zip: dbItem.zip || '',
    propertyCategory: (dbItem.property_category as PropertyCategory) || 'Hostel',
    verified: true,
    is_available: dbItem.is_available,
    bedrooms: dbItem.bedrooms,
    bathrooms: dbItem.bathrooms,
    amenities: dbItem.amenities || [],
    images: dbItem.images || [],
    available_from: dbItem.available_from || '',
    created_at: dbItem.created_at,
    updated_at: dbItem.updated_at,
    house_rules: dbItem.house_rules || 'No smoking, no pets',
    stories: [],
    features: []
  };

  // Add owner info if available
  if (profileData) {
    property.owner = {
      id: profileData.id || dbItem.owner_id,
      name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || 'Property Owner',
      email: profileData.email || '',
      phone: profileData.phone || '',
      verified: true,
      responseRate: '95%'
    };
  } else {
    property.owner = {
      id: dbItem.owner_id,
      name: 'Property Owner',
      email: '',
      phone: '',
      verified: false,
      responseRate: '0%'
    };
  }

  return property;
}
