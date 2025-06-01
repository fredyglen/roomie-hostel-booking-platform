
import { Property } from '@/types/property';

export const bookingSampleProperties: Property[] = [
  {
    id: '1',
    owner_id: 'sample-owner-1',
    title: 'Cozy Studio Apartment Near UPSA',
    description: 'A comfortable studio apartment perfect for students, located just minutes from campus with modern amenities.',
    type: 'Homestel',
    price: 850,
    priceUnit: 'month',
    address: '123 University Road, East Legon, Accra',
    city: 'Accra',
    state: 'Greater Accra',
    rent: 850,
    bedrooms: 1,
    bathrooms: 1,
    distanceToCampus: '5 min walk',
    images: ['https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80'],
    roomTypes: [
      { id: '1', name: '1 in a room', price: 1700, unit: 'month', capacity: 1 },
      { id: '2', name: '2 in a room', price: 1200, unit: 'month', capacity: 2 }
    ],
    propertyCategory: 'Homestel',
    amenities: ['WiFi', 'Security', 'Water']
  },
  {
    id: '2',
    owner_id: 'sample-owner-2',
    title: 'Shared 2-Bedroom Apartment',
    description: 'Spacious 2-bedroom apartment with shared facilities, perfect for students who want a comfortable living experience.',
    type: 'Hostel',
    price: 4000,
    priceUnit: 'semester',
    address: '456 College Avenue, Legon, Accra',
    city: 'Accra',
    state: 'Greater Accra',
    rent: 4000,
    bedrooms: 2,
    bathrooms: 1,
    distanceToCampus: '10 min walk',
    images: ['https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80'],
    roomTypes: [
      { id: '3', name: '2 in a room', price: 4000, unit: 'semester', capacity: 2 },
      { id: '4', name: '3 in a room', price: 3600, unit: 'semester', capacity: 3 }
    ],
    propertyCategory: 'Hostel',
    amenities: ['WiFi', 'Security', 'Water', 'Kitchen']
  },
  {
    id: '3',
    owner_id: 'sample-owner-3',
    title: 'Premium Single Room in Hostel',
    description: 'Premium accommodation with excellent facilities and prime location near campus for serious students.',
    type: 'Apartment',
    price: 2600,
    priceUnit: 'month',
    address: '789 Campus Drive, Ayeduase, Kumasi',
    city: 'Kumasi',
    state: 'Ashanti',
    rent: 2600,
    bedrooms: 1,
    bathrooms: 1,
    distanceToCampus: '2 min walk',
    images: ['https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&q=80'],
    roomTypes: [
      { id: '5', name: 'Entire apartment', price: 2600, unit: 'month', capacity: 1 },
      { id: '6', name: 'Shared apartment (per student)', price: 950, unit: 'month', capacity: 1 }
    ],
    propertyCategory: 'Apartment',
    amenities: ['WiFi', 'Air Conditioning', 'Security', 'Water']
  }
];
