
import { Property, PropertyType, PropertyStatus, PropertyCategory } from '@/types/property';

// Simple, reliable transformation function
export function transformDbProperty(dbItem: any): Property {
  // Safely extract profile data
  const profileData = Array.isArray(dbItem.profiles) 
    ? dbItem.profiles[0] 
    : dbItem.profiles;
  
  // Create property with all required fields, using defaults for missing data
  const property: Property = {
    id: String(dbItem.id || ''),
    owner_id: String(dbItem.owner_id || ''),
    name: String(dbItem.title || ''),
    title: String(dbItem.title || ''),
    description: String(dbItem.description || ''),
    type: (dbItem.property_type as PropertyType) || 'hostel',
    status: (dbItem.is_available ? 'available' : 'occupied') as PropertyStatus,
    price: Number(dbItem.rent || 0),
    rent: Number(dbItem.rent || 0),
    location: String(dbItem.address || ''),
    address: String(dbItem.address || ''),
    city: String(dbItem.city || ''),
    state: String(dbItem.state || ''),
    zip: String(dbItem.zip || ''),
    propertyCategory: (dbItem.property_category as PropertyCategory) || 'Hostel',
    verified: true,
    is_available: Boolean(dbItem.is_available ?? true),
    bedrooms: Number(dbItem.bedrooms || 1),
    bathrooms: Number(dbItem.bathrooms || 1),
    amenities: Array.isArray(dbItem.amenities) ? dbItem.amenities : [],
    images: Array.isArray(dbItem.images) ? dbItem.images : [],
    available_from: String(dbItem.available_from || ''),
    created_at: String(dbItem.created_at || ''),
    updated_at: String(dbItem.updated_at || ''),
    house_rules: 'No smoking, no pets', // Default house rules since column doesn't exist
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
