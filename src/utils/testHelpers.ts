
import {
  Property,
  PropertyFeatures,
  createPropertyId,
  createPropertyPrice,
  createAddress
} from '@/types/property';
import { User } from '@/types/core';

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
  const features: PropertyFeatures = {
    bedrooms: 2,
    bathrooms: 1,
    kitchens: 1,
    parkingSpaces: 1,
    furnished: true,
    petsAllowed: false,
    utilities: {
      water: true,
      electricity: true,
      internet: true,
      gas: false,
      cleaning: false,
      security: true,
    },
    amenities: ['WiFi', 'Parking'],
    rules: ['No smoking', 'No pets'],
  };

  const owner: User = {
    id: 'test-owner-1',
    email: 'owner@test.com',
    role: 'owner',
    first_name: 'Test',
    last_name: 'Owner',
    phone: '+1234567890',
  };

  return {
    id: createPropertyId('test-id-1'),
    owner_id: 'test-owner-1',
    name: 'Test Property',
    title: 'Test Property',
    description: 'A test property description',
    type: 'apartment',
    property_type: 'apartment',
    status: 'available',
    is_available: true,
    price: createPropertyPrice(1000),
    rent: 1000,
    currency: 'GHS',
    address: createAddress('123 Test St'),
    city: 'Test City',
    state: 'Test State',
    country: 'Ghana',
    zip: '12345',
    property_category: 'Apartment',
    bedrooms: 2,
    bathrooms: 1,
    amenities: ['WiFi', 'Parking'],
    images: ['/placeholder.svg'],
    available_from: '2024-01-01',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    owner,
    house_rules: ['No smoking', 'No pets'],
    features,
    media: [{
      id: 'test-media-1',
      url: '/placeholder.svg',
      type: 'image',
      isCover: true,
    }],
    buildings: [],
    ownerId: 'test-owner-1',
    ...overrides,
  };
}
