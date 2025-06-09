
import { Property, PropertyType } from '@/types/property';

export const sampleProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Apartment Near Campus',
    name: 'Modern Apartment Near Campus',
    description: 'Beautiful modern apartment with all amenities',
    location: 'Accra, Ghana',
    price: 1500,
    rent: 1500,
    type: 'apartment' as PropertyType,
    propertyCategory: 'Apartment',
    property_category: 'Apartment',
    images: ['/placeholder.svg'],
    amenities: ['WiFi', 'Parking', 'Security'],
    bedrooms: 2,
    bathrooms: 1,
    max_occupants: 4,
    verified: true,
    verification_status: 'verified',
    available_from: '2024-01-01',
    owner: {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+233123456789',
      verified: true
    },
    owner_id: '1',
    city: 'Accra',
    state: 'Greater Accra',
    address: '123 University Road',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    status: 'Available'
  },
  {
    id: '2',
    title: 'Cozy Hostel Room',
    name: 'Cozy Hostel Room',
    description: 'Comfortable hostel accommodation',
    location: 'Kumasi, Ghana',
    price: 800,
    rent: 800,
    type: 'hostel' as PropertyType,
    propertyCategory: 'Hostel',
    property_category: 'Hostel',
    images: ['/placeholder.svg'],
    amenities: ['WiFi', 'Security'],
    bedrooms: 1,
    bathrooms: 1,
    max_occupants: 2,
    verified: true,
    verification_status: 'verified',
    available_from: '2024-01-01',
    owner: {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+233123456790',
      verified: true
    },
    owner_id: '2',
    city: 'Kumasi',
    state: 'Ashanti',
    address: '456 Campus Avenue',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    status: 'Available'
  }
];
