
import { Property, PropertyStatus, createPropertyId, createPropertyPrice, createAddress } from '@/types/property';
import { User } from '@/types/core';
import { vi } from 'vitest';

export const mockProperty: Property = {
  id: createPropertyId('1'),
  owner_id: 'owner-1',
  name: 'Test Property',
  title: 'Test Property',
  description: 'A test property',
  type: 'hostel',
  status: 'active' as PropertyStatus,
  price: createPropertyPrice(1000),
  rent: 1000,
  address: createAddress('123 Test St'),
  city: 'Test City',
  state: 'Test State',
  zip: '12345',
  property_category: 'Hostel',
  is_available: true,
  bedrooms: 2,
  bathrooms: 1,
  amenities: ['WiFi', 'Parking'],
  images: ['/test-image.jpg'],
  available_from: '2024-01-01',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  owner: {
    id: 'owner-1',
    name: 'Test Owner',
    email: 'owner@test.com',
    phone: '+1234567890',
    role: 'owner'
  } as User,
  house_rules: ['No smoking'],
  ownerId: 'owner-1',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  verificationStatus: 'pending',
  media: [],
  buildings: [],
  features: {
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
      security: true,
    },
    amenities: ['WiFi', 'Parking'],
    rules: ['No smoking'],
  }
};

export const mockProperty2: Property = {
  ...mockProperty,
  id: createPropertyId('2'),
  type: 'homestel',
  propertyCategory: 'Homestel',
  name: 'Test Homestel',
  title: 'Test Homestel'
};

export const mockProperties = [mockProperty, mockProperty2];

// Mock functions for navigation
export const mockNavigate = vi.fn();
export const mockUseNavigate = () => mockNavigate;
