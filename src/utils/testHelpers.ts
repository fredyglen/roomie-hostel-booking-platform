import { Amenity } from '@/types/common';
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
    description: 'A test property description',
    type: 'apartment',
    status: 'available',
    price: 1000,
    location: {
      address: '123 Test St',
      city: 'Test City',
      state: 'Test State',
      country: 'Test Country',
    },
    university_id: 'test-uni-1',
    images: ['/placeholder.svg'],
    amenities: ['WIFI', 'PARKING', 'SECURITY'] as Amenity[],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}
