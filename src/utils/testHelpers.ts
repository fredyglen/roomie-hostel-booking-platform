
/**
 * Test Helper Utilities for ROOMi Platform
 * Provides utility functions for testing with proper type safety
 *
 * @fileoverview Apple-Level Test Helper Implementation
 * @author ROOMi Development Team
 * @version 1.0.0
 */

import {
  Property,
  PropertyType,
  PropertyStatus,
  Address,
  PropertyPrice,
  PropertyFeatures,
  PropertyMedia
} from '@/types/property';
import { User } from '@/types/core';

/**
 * Validates a property object to ensure it has all required fields
 * This can be used to test property data integrity
 *
 * @param property - Property object to validate
 * @returns boolean - True if property is valid
 */
export function validateProperty(property: Property): boolean {
  if (!property) return false;
  if (!property.id) return false;
  if (!property.name) return false;
  if (!property.description) return false;
  if (!property.address) return false;
  if (!property.price) return false;
  if (!property.features) return false;
  if (!property.ownerId) return false;

  // Validate address structure
  if (!property.address.street || !property.address.city || !property.address.state) {
    return false;
  }

  // Validate price structure
  if (!property.price.amount || !property.price.currency) {
    return false;
  }

  // All required fields are present, property is valid
  return true;
}

/**
 * Validates that property IDs are consistently strings
 * This helps prevent ID format mismatches
 *
 * @param id - ID to normalize (string or number)
 * @returns string - Normalized string ID
 */
export function normalizePropertyId(id: string | number): string {
  return String(id);
}

/**
 * Generates a test property for testing UI components
 * Creates a properly typed Property object with realistic data
 *
 * @param overrides - Partial property data to override defaults
 * @returns Property - Complete property object for testing
 */
export function generateTestProperty(overrides: Partial<Property> = {}): Property {
  const testAddress: Address = {
    street: '123 Test Street',
    city: 'Accra',
    state: 'Greater Accra',
    country: 'Ghana',
    postalCode: '00233',
    latitude: 5.6037,
    longitude: -0.1870
  };

  const testPrice: PropertyPrice = {
    amount: 2500,
    currency: 'GHS',
    period: 'semester',
    isNegotiable: false,
    discounts: []
  };

  const testFeatures: PropertyFeatures = {
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
      cleaning: true,
      security: true
    },
    amenities: ['WiFi', 'Parking', 'Security'],
    rules: ['No smoking', 'No loud music after 10pm']
  };

  const testMedia: PropertyMedia[] = [
    {
      id: 'test-media-1',
      url: '/placeholder.svg',
      type: 'image',
      isCover: true,
      caption: 'Test property image'
    }
  ];

  const testOwner: User = {
    id: 'test-owner-1',
    email: 'owner@test.com',
    role: 'owner',
    profile: {
      firstName: 'Test',
      lastName: 'Owner',
      phone: '+233501234567',
      avatar: '/test-avatar.jpg'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const baseProperty: Property = {
    id: 'test-property-1',
    name: 'Test Property - Student Hostel',
    description: 'A well-furnished test property perfect for testing UI components and functionality.',
    type: 'hostel' as PropertyType,
    status: 'active' as PropertyStatus,
    address: testAddress,
    price: testPrice,
    features: testFeatures,
    media: testMedia,
    buildings: [],
    ownerId: 'test-owner-1',
    owner: testOwner,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    verificationStatus: 'verified',
    verificationDetails: {
      verifiedBy: 'test-admin',
      verifiedAt: new Date().toISOString(),
      notes: 'Test verification'
    }
  };

  return {
    ...baseProperty,
    ...overrides
  };
}

/**
 * Generate multiple test properties for testing lists and pagination
 *
 * @param count - Number of properties to generate
 * @param baseOverrides - Base overrides to apply to all properties
 * @returns Property[] - Array of test properties
 */
export function generateTestProperties(
  count: number,
  baseOverrides: Partial<Property> = {}
): Property[] {
  return Array.from({ length: count }, (_, index) =>
    generateTestProperty({
      ...baseOverrides,
      id: `test-property-${index + 1}`,
      name: `Test Property ${index + 1}`,
      price: {
        amount: 2000 + (index * 100),
        currency: 'GHS',
        period: 'semester',
        isNegotiable: index % 2 === 0,
        discounts: []
      }
    })
  );
}

/**
 * Validate that a property matches expected test data structure
 *
 * @param property - Property to validate
 * @param expectedFields - Expected field values
 * @returns boolean - True if property matches expectations
 */
export function validateTestProperty(
  property: Property,
  expectedFields: Partial<Property> = {}
): boolean {
  if (!validateProperty(property)) {
    return false;
  }

  // Check specific expected fields
  for (const [key, expectedValue] of Object.entries(expectedFields)) {
    if (property[key as keyof Property] !== expectedValue) {
      return false;
    }
  }

  return true;
}
