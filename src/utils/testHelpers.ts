
import { Property } from '@/types/property';

/**
 * Validates a property object to ensure it has all required fields
 * This can be used to test property data integrity
 */
export function validateProperty(property: Property): boolean {
  if (!property) return false;
  if (!property.id) return false;
  if (!property.title) return false;
  if (!property.address) return false;
  
  // All required fields are present, property is valid
  return true;
}

/**
 * Validates that property IDs are consistently strings
 * This helps prevent ID format mismatches
 */
export function normalizePropertyId(id: string | number): string {
  return String(id);
}

/**
 * Generates a test property for testing UI components
 */
export function generateTestProperty(overrides: Partial<Property> = {}): Property {
  return {
    id: 'test-id-1',
    owner_id: 'test-owner-1',
    name: 'Test Property',
    title: 'Test Property',
    description: 'A test property description',
    type: 'apartment',
    status: 'available',
    price: 1000,
    rent: 1000,
    location: {
      address: '123 Test St',
      city: 'Test City',
      state: 'Test State',
    },
    address: '123 Test St',
    city: 'Test City',
    state: 'Test State',
    zip: '12345',
    propertyCategory: 'Apartment',
    verified: true,
    is_available: true,
    bedrooms: 2,
    bathrooms: 1,
    amenities: ['WiFi', 'Parking'],
    images: ['/placeholder.svg'],
    available_from: '2024-01-01',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    owner: {
      id: 'test-owner-1',
      name: 'Test Owner',
      email: 'owner@test.com',
      phone: '+1234567890',
      verified: true,
      responseRate: '95%'
    },
    house_rules: 'No smoking, no pets',
    stories: [],
    features: [],
    ...overrides,
  };
}
