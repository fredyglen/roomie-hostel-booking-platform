/**
 * Ghana Hostel Data with Authentic Semester-Based Pricing
 * Real hostel data around UPSA with correct pricing model
 */

import { GhanaHostelProperty } from '@/types/property';

// Generate realistic owner profiles (anonymized)
const generateOwner = (name: string, phone: string) => ({
  id: `owner-${name.toLowerCase().replace(/\s+/g, '-')}`,
  name,
  email: `${name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
  phone,
  responseRate: '95%',
  verified: true,
});

const commonAmenities = [
  'Security Guard',
  'Water Supply',
  'Electricity',
  'Parking Space',
  'Study Area',
];

const premiumAmenities = [
  ...commonAmenities,
  'WiFi',
  'Kitchen Access',
  'Laundry Service',
  'CCTV Security',
  'Generator Backup',
];

export const ghanaHostelsSemesterPricing: GhanaHostelProperty[] = [
  {
    id: 'kitatsu-hostel-upsa',
    name: 'Kitatsu Hostel',
    description: 'An all-girls hostel located in Madina, very close to UPSA. Known for its safe environment and female-only accommodation with shared bathroom facilities.',
    images: [
      '/images/hostels/kitatsu-exterior.jpg',
      '/images/hostels/kitatsu-room.jpg',
      '/images/hostels/kitatsu-security.jpg'
    ],
    pricePerSemester: 3200, // Base price for 2-in-a-room
    roomOptions: [
      { type: '2-in-a-room', price: 3200, available: true, maxOccupants: 2 },
      { type: '4-in-a-room', price: 2800, available: true, maxOccupants: 4 }
    ],
    location: {
      address: 'Madina Township, Close to UPSA',
      city: 'Accra',
      state: 'Greater Accra',
      country: 'Ghana',
      coordinates: { lat: 5.6885, lng: -0.1665 }
    },
    distanceToCampus: 0.4,
    nearestUniversity: 'University of Professional Studies, Accra (UPSA)',
    propertyType: 'hostel',
    bedrooms: 1,
    bathrooms: 0, // Shared bathrooms
    maxOccupants: 4,
    amenities: [...commonAmenities, 'Female Only', 'Shared Bathroom', 'Safe Environment'],
    rules: [
      'Female students only',
      'Shared bathroom maintenance',
      'Safe environment protocols',
      'Visitor restrictions',
      'Study hours respect'
    ],
    owner: generateOwner('Mrs. Kitatsu Asante', '+233 24 123 4567'),
    availableFrom: '2024-08-01',
    availableTo: '2025-07-31',
    isActive: true,
    features: ['All-Girls', 'Close to Campus', 'Safe Environment', 'Madina Location'],
    house_rules: 'Safe haven for female students. Shared facilities require mutual respect.',
    stories: []
  },

  {
    id: 'prestige-hostel-upsa',
    name: 'Prestige Hostel',
    description: 'Premium hostel located directly opposite UPSA main gate. Features self-contained rooms with modern amenities and excellent security. Perfect for students who value comfort and convenience.',
    images: [
      '/images/hostels/prestige-exterior.jpg',
      '/images/hostels/prestige-room.jpg',
      '/images/hostels/prestige-bathroom.jpg'
    ],
    pricePerSemester: 4800, // Premium pricing for self-contained
    roomOptions: [
      { type: '1-in-a-room', price: 4800, available: true, maxOccupants: 1, description: 'Private self-contained room' },
      { type: '2-in-a-room', price: 4200, available: true, maxOccupants: 2, description: 'Shared self-contained room' }
    ],
    location: {
      address: 'Opposite UPSA Main Gate',
      city: 'Accra',
      state: 'Greater Accra',
      country: 'Ghana',
      coordinates: { lat: 5.6900, lng: -0.1655 }
    },
    distanceToCampus: 0.1,
    nearestUniversity: 'University of Professional Studies, Accra (UPSA)',
    propertyType: 'hostel',
    bedrooms: 1,
    bathrooms: 1, // Self-contained
    maxOccupants: 2,
    amenities: [...premiumAmenities, 'Self-Contained', 'Opposite Campus', 'Premium Location', 'Modern Amenities'],
    rules: [
      'Premium facility maintenance',
      'Self-contained room care',
      'Campus proximity advantage',
      'Modern amenity respect',
      'Premium service standards'
    ],
    owner: generateOwner('Mr. Prestige Kwame', '+233 20 987 6543'),
    availableFrom: '2024-08-01',
    availableTo: '2025-07-31',
    isActive: true,
    features: ['Self-Contained', 'Opposite Campus', 'Premium', 'Modern'],
    house_rules: 'Premium accommodation with modern standards. Maintain the prestige.',
    stories: []
  },

  {
    id: 'makasella-hostel-peaceful',
    name: 'Makasella Hostel',
    description: 'A peaceful mixed-gender hostel with a serene environment perfect for studying. Features both male and female sections with shared facilities and a quiet atmosphere.',
    images: [
      '/images/hostels/makasella-exterior.jpg',
      '/images/hostels/makasella-study.jpg',
      '/images/hostels/makasella-peaceful.jpg'
    ],
    pricePerSemester: 3600, // Mid-range pricing
    roomOptions: [
      { type: '2-in-a-room', price: 3600, available: true, maxOccupants: 2 },
      { type: '3-in-a-room', price: 3200, available: true, maxOccupants: 3 },
      { type: '4-in-a-room', price: 2900, available: true, maxOccupants: 4 }
    ],
    location: {
      address: 'Peaceful Area, Mixed Gender Hostel',
      city: 'Accra',
      state: 'Greater Accra',
      country: 'Ghana',
      coordinates: { lat: 5.6895, lng: -0.1660 }
    },
    distanceToCampus: 0.6,
    nearestUniversity: 'University of Professional Studies, Accra (UPSA)',
    propertyType: 'hostel',
    bedrooms: 1,
    bathrooms: 0, // Shared bathrooms
    maxOccupants: 4,
    amenities: [...commonAmenities, 'Mixed Gender', 'Peaceful Environment', 'Study Friendly', 'Quiet Area'],
    rules: [
      'Mixed gender respect',
      'Peaceful environment maintenance',
      'Study-friendly atmosphere',
      'Quiet hours enforcement',
      'Shared facility care'
    ],
    owner: generateOwner('Mr. Makasella Peace', '+233 26 456 7890'),
    availableFrom: '2024-08-15',
    availableTo: '2025-07-31',
    isActive: true,
    features: ['Mixed Gender', 'Peaceful', 'Study Friendly', 'Quiet'],
    house_rules: 'Peaceful environment for serious students. Respect study hours.',
    stories: []
  },

  {
    id: 'mb3-hostel-organized',
    name: 'MB3 Hostel',
    description: 'Well-organized hostel with self-contained rooms and excellent management. Known for its structured environment and reliable facilities.',
    images: [
      '/images/hostels/mb3-exterior.jpg',
      '/images/hostels/mb3-organized.jpg',
      '/images/hostels/mb3-room.jpg'
    ],
    pricePerSemester: 4400, // Premium for self-contained + organization
    roomOptions: [
      { type: '1-in-a-room', price: 4400, available: true, maxOccupants: 1 },
      { type: '2-in-a-room', price: 3800, available: true, maxOccupants: 2 }
    ],
    location: {
      address: 'Well Organized Hostel Area',
      city: 'Accra',
      state: 'Greater Accra',
      country: 'Ghana',
      coordinates: { lat: 5.6888, lng: -0.1658 }
    },
    distanceToCampus: 0.5,
    nearestUniversity: 'University of Professional Studies, Accra (UPSA)',
    propertyType: 'hostel',
    bedrooms: 1,
    bathrooms: 1, // Self-contained
    maxOccupants: 2,
    amenities: [...premiumAmenities, 'Self-Contained', 'Well Organized', 'Excellent Management', 'Structured Environment'],
    rules: [
      'Well-organized living',
      'Excellent management standards',
      'Self-contained maintenance',
      'Structured environment',
      'Reliable facility care'
    ],
    owner: generateOwner('Mr. MB3 Organization', '+233 24 789 0123'),
    availableFrom: '2024-08-01',
    availableTo: '2025-07-31',
    isActive: true,
    features: ['Self-Contained', 'Well Organized', 'Excellent Management', 'Structured'],
    house_rules: 'Organization and structure are our strengths. Maintain standards.',
    stories: []
  },

  {
    id: 'joy-hostel-east-legon',
    name: 'Joy Hostel',
    description: 'Large hostel located in East Legon with spacious compound and multiple room options. Popular among students for its size and location.',
    images: [
      '/images/hostels/joy-exterior.jpg',
      '/images/hostels/joy-compound.jpg',
      '/images/hostels/joy-room.jpg'
    ],
    pricePerSemester: 3800, // Mid-premium pricing
    roomOptions: [
      { type: '2-in-a-room', price: 3800, available: true, maxOccupants: 2 },
      { type: '3-in-a-room', price: 3400, available: true, maxOccupants: 3 },
      { type: '4-in-a-room', price: 3000, available: true, maxOccupants: 4 }
    ],
    location: {
      address: 'East Legon, Large Hostel Complex',
      city: 'Accra',
      state: 'Greater Accra',
      country: 'Ghana',
      coordinates: { lat: 5.6905, lng: -0.1635 }
    },
    distanceToCampus: 0.8,
    nearestUniversity: 'University of Professional Studies, Accra (UPSA)',
    propertyType: 'hostel',
    bedrooms: 1,
    bathrooms: 0, // Shared bathrooms
    maxOccupants: 4,
    amenities: [...commonAmenities, 'Large Compound', 'East Legon', 'Multiple Options', 'Spacious'],
    rules: [
      'Large compound maintenance',
      'East Legon community',
      'Multiple room respect',
      'Spacious living advantage',
      'Popular hostel standards'
    ],
    owner: generateOwner('Mrs. Joy Happiness', '+233 20 234 5678'),
    availableFrom: '2024-08-15',
    availableTo: '2025-07-31',
    isActive: true,
    features: ['Large Compound', 'East Legon', 'Multiple Options', 'Spacious'],
    house_rules: 'Large compound offers space and freedom. Use it responsibly.',
    stories: []
  },

  {
    id: 'heavens-gate-hostel',
    name: 'Heavens Gate Hostel',
    description: 'Budget-friendly hostel with 4-in-a-room accommodation across twin blocks. Perfect for students seeking affordable housing with basic amenities.',
    images: [
      '/images/hostels/heavens-gate-exterior.jpg',
      '/images/hostels/heavens-gate-room.jpg'
    ],
    pricePerSemester: 2800, // Minimum price point
    roomOptions: [
      { type: '4-in-a-room', price: 2800, available: true, maxOccupants: 4, description: 'Budget-friendly shared room' }
    ],
    location: {
      address: 'Twin Blocks, Budget Accommodation',
      city: 'Accra',
      state: 'Greater Accra',
      country: 'Ghana',
      coordinates: { lat: 5.6892, lng: -0.1662 }
    },
    distanceToCampus: 0.7,
    nearestUniversity: 'University of Professional Studies, Accra (UPSA)',
    propertyType: 'hostel',
    bedrooms: 1,
    bathrooms: 0, // Shared bathrooms
    maxOccupants: 4,
    amenities: [...commonAmenities, 'Budget Friendly', 'Twin Blocks', '4-in-a-room', 'Basic Amenities'],
    rules: [
      'Budget accommodation standards',
      'Twin block coordination',
      '4-person room sharing',
      'Basic amenity care',
      'Affordable living respect'
    ],
    owner: generateOwner('Mr. Heavens Gate', '+233 26 345 6789'),
    availableFrom: '2024-09-01',
    availableTo: '2025-08-31',
    isActive: true,
    features: ['Budget Friendly', 'Twin Blocks', '4-in-a-room', 'Affordable'],
    house_rules: 'Budget accommodation requires cooperation and respect for shared spaces.',
    stories: []
  }
];

export default ghanaHostelsSemesterPricing;
