
import { Property } from '@/types/property';
import { vi } from 'vitest';

/**
 * Mock property data for testing
 */
export const mockProperties: Property[] = [
  {
    id: 'test-property-1',
    title: 'Test Hostel',
    owner_id: 'owner-1',
    type: 'Hostel',
    property_type: 'Hostel',
    city: 'Accra',
    state: 'Greater Accra',
    rent: 1500,
    bedrooms: 2,
    bathrooms: 1,
    price: 1500,
    priceUnit: 'semester',
    address: '123 Test Street, Campus Area',
    distanceToCampus: '5 min walk',
    images: ['https://example.com/image1.jpg'],
    propertyCategory: 'Hostel',
    description: 'A test hostel property',
    amenities: []
  },
  {
    id: 'test-property-2',
    title: 'Test Homestel',
    owner_id: 'owner-2',
    type: 'Homestel',
    property_type: 'Homestel',
    city: 'Kumasi',
    state: 'Ashanti',
    rent: 900,
    bedrooms: 1,
    bathrooms: 1,
    price: 900,
    priceUnit: 'month',
    address: '456 Test Avenue, Near University',
    distanceToCampus: '10 min walk',
    images: ['https://example.com/image2.jpg'],
    propertyCategory: 'Homestel',
    description: 'A test homestel property',
    amenities: []
  }
];

/**
 * Mock navigation function for testing
 */
export const mockNavigate = vi.fn();

/**
 * Mock the react-router-dom's useNavigate hook
 */
export const mockUseNavigate = () => () => mockNavigate;

/**
 * Reset all mocks between tests
 */
export const resetAllMocks = () => {
  mockNavigate.mockReset();
};
