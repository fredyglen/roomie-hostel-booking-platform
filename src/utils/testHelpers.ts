
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
    title: 'Test Property',
    address: '123 Test Street',
    city: 'Accra',
    state: 'Greater Accra',
    rent: 1000,
    bedrooms: 2,
    bathrooms: 1,
    owner_id: 'test-owner-1',
    price: 1000,
    description: 'A test property description',
    images: ['/placeholder.svg'],
    amenities: ['Test Amenity 1', 'Test Amenity 2'],
    property_type: 'Hostel',
    type: 'Hostel',
    ...overrides
  };
}
