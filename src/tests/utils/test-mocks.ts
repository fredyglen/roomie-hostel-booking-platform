
import { Property } from '@/types/property';

export const mockProperty: Property = {
  id: '1',
  owner_id: 'owner-1',
  name: 'Test Property',
  title: 'Test Property',
  description: 'A test property',
  type: 'hostel',
  status: 'available',
  price: 1000,
  rent: 1000,
  location: 'Test Location',
  address: '123 Test St',
  city: 'Test City',
  state: 'Test State',
  zip: '12345',
  propertyCategory: 'Hostel',
  verified: true,
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
    verified: true,
    responseRate: '95%'
  },
  house_rules: 'No smoking',
  stories: [],
  features: []
};

export const mockProperty2: Property = {
  ...mockProperty,
  id: '2',
  type: 'homestel',
  propertyCategory: 'Homestel',
  name: 'Test Homestel',
  title: 'Test Homestel'
};

export const mockProperties = [mockProperty, mockProperty2];

// Mock functions for navigation
export const mockNavigate = vi.fn();
export const mockUseNavigate = () => mockNavigate;
