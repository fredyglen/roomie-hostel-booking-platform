
/**
 * Test Mocks for ROOMi Platform
 * Provides properly typed mock data for testing
 *
 * @fileoverview Apple-Level Test Mock Implementation
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
import { vi } from 'vitest';

/**
 * Create a properly typed mock Property for testing
 * Follows the exact Property interface structure
 */
export const createMockProperty = (overrides: Partial<Property> = {}): Property => {
  const mockAddress: Address = {
    street: '123 Test Street',
    city: 'Accra',
    state: 'Greater Accra',
    country: 'Ghana',
    postalCode: '00233',
    latitude: 5.6037,
    longitude: -0.1870
  };

  const mockPrice: PropertyPrice = {
    amount: 2500,
    currency: 'GHS',
    period: 'semester',
    isNegotiable: false,
    discounts: []
  };

  const mockFeatures: PropertyFeatures = {
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

  const mockMedia: PropertyMedia[] = [
    {
      id: 'media-1',
      url: '/test-images/property-1.jpg',
      type: 'image',
      isCover: true,
      caption: 'Main property view'
    }
  ];

  const mockOwner: User = {
    id: 'owner-1',
    email: 'owner@test.com',
    role: 'owner',
    profile: {
      firstName: 'Test',
      lastName: 'Owner',
      phone: '+233501234567',
      avatar: '/test-images/owner-avatar.jpg'
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  };

  const baseProperty: Property = {
    id: 'property-1',
    name: 'Test Property - Modern Hostel',
    description: 'A well-furnished hostel property perfect for students. Located in a safe neighborhood with easy access to campus.',
    type: 'hostel' as PropertyType,
    status: 'active' as PropertyStatus,
    address: mockAddress,
    price: mockPrice,
    features: mockFeatures,
    media: mockMedia,
    buildings: [], // TODO: Add building structure when implemented
    ownerId: 'owner-1',
    owner: mockOwner,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    verificationStatus: 'verified',
    verificationDetails: {
      verifiedBy: 'admin-1',
      verifiedAt: '2024-01-01T00:00:00Z',
      notes: 'Property verified through on-site inspection'
    }
  };

  return {
    ...baseProperty,
    ...overrides
  };
};

/**
 * Default mock property for testing
 */
export const mockProperty: Property = createMockProperty();

/**
 * Second mock property with different characteristics
 */
export const mockProperty2: Property = createMockProperty({
  id: 'property-2',
  name: 'Test Homestel - Cozy Apartment',
  type: 'homestel',
  status: 'pending',
  address: {
    street: '456 University Avenue',
    city: 'Kumasi',
    state: 'Ashanti',
    country: 'Ghana',
    postalCode: '00233',
    latitude: 6.6885,
    longitude: -1.6244
  },
  price: {
    amount: 3000,
    currency: 'GHS',
    period: 'semester',
    isNegotiable: true,
    discounts: [
      {
        type: 'percentage',
        value: 10,
        description: 'Early bird discount'
      }
    ]
  },
  features: {
    bedrooms: 3,
    bathrooms: 2,
    kitchens: 1,
    parkingSpaces: 2,
    furnished: true,
    petsAllowed: true,
    utilities: {
      water: true,
      electricity: true,
      internet: true,
      gas: true,
      cleaning: false,
      security: true
    },
    amenities: ['WiFi', 'Parking', 'Security', 'Gym', 'Laundry'],
    rules: ['No smoking', 'Pets allowed with deposit', 'Quiet hours 10pm-6am']
  },
  verificationStatus: 'pending'
});

/**
 * Array of mock properties for testing lists
 */
export const mockProperties: Property[] = [mockProperty, mockProperty2];

/**
 * Create multiple mock properties for testing pagination
 *
 * @param count - Number of properties to create
 * @returns Array of mock properties
 */
export const createMockProperties = (count: number): Property[] => {
  return Array.from({ length: count }, (_, index) =>
    createMockProperty({
      id: `property-${index + 1}`,
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
};

/**
 * Mock navigation functions for testing
 */
export const mockNavigate = vi.fn();
export const mockUseNavigate = () => mockNavigate;

/**
 * Mock user for testing authentication
 */
export const mockUser: User = {
  id: 'user-1',
  email: 'test@example.com',
  role: 'student',
  profile: {
    firstName: 'Test',
    lastName: 'User',
    phone: '+233501234567',
    avatar: '/test-images/user-avatar.jpg'
  },
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
};

/**
 * Mock owner user for testing property management
 */
export const mockOwnerUser: User = {
  id: 'owner-1',
  email: 'owner@example.com',
  role: 'owner',
  profile: {
    firstName: 'Property',
    lastName: 'Owner',
    phone: '+233501234567',
    avatar: '/test-images/owner-avatar.jpg'
  },
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
};

/**
 * Reset all mocks - useful for test cleanup
 */
export const resetAllMocks = (): void => {
  mockNavigate.mockReset();
};
