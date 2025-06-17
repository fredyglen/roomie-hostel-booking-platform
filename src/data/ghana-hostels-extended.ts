/**
 * Extended Ghana Hostel Data - Part 2
 * Continuation of real hostel data around UPSA
 */

import { Property } from '@/types/property';

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

export const ghanaHostelsExtended: Property[] = [
  {
    id: 'new-century-hostel',
    name: 'New Century Hostel',
    description: 'A Madina hostel located close to UPSA, popular among students for enhanced security and excellent room conditions. Modern facilities in a secure environment.',
    images: [
      '/images/hostels/new-century-exterior.jpg',
      '/images/hostels/new-century-security.jpg',
      '/images/hostels/new-century-room.jpg'
    ],
    price: 1050,
    location: {
      address: 'Madina Township, Close to UPSA',
      city: 'Accra',
      state: 'Greater Accra',
      country: 'Ghana',
      coordinates: { lat: 5.6890, lng: -0.1660 }
    },
    distanceToCampus: 0.5,
    nearestUniversity: 'University of Professional Studies, Accra (UPSA)',
    propertyType: 'hostel',
    bedrooms: 1,
    bathrooms: 1,
    maxOccupants: 2,
    amenities: [...premiumAmenities, 'Enhanced Security', 'Modern Facilities', 'CCTV Surveillance'],
    rules: [
      'Enhanced security protocols',
      'ID required for entry',
      'Visitor registration mandatory',
      'Modern facility maintenance',
      'Security deposit required'
    ],
    owner: generateOwner('Mr. Century Kwaku', '+233 20 012 3456'),
    availableFrom: '2024-08-01',
    availableTo: '2025-07-31',
    isActive: true,
    features: ['Enhanced Security', 'Modern Facilities', 'Close to Campus', 'CCTV'],
    house_rules: 'Security is our priority. All residents must follow security protocols.',
    stories: []
  },

  {
    id: 'chika-hostel-east-legon',
    name: 'Chika Hostel',
    description: 'An all-girls hostel in East Legon with a spacious compound and well-ventilated rooms. Features password-secured gate locks and comprehensive facilities for female students only.',
    images: [
      '/images/hostels/chika-exterior.jpg',
      '/images/hostels/chika-compound.jpg',
      '/images/hostels/chika-room.jpg'
    ],
    price: 950,
    location: {
      address: 'East Legon, All-Girls Hostel',
      city: 'Accra',
      state: 'Greater Accra',
      country: 'Ghana',
      coordinates: { lat: 5.6905, lng: -0.1630 }
    },
    distanceToCampus: 1.0,
    nearestUniversity: 'University of Professional Studies, Accra (UPSA)',
    propertyType: 'hostel',
    bedrooms: 1,
    bathrooms: 1,
    maxOccupants: 2,
    amenities: [...premiumAmenities, 'Female Only', 'Password Security', 'Spacious Compound', 'Well Ventilated'],
    rules: [
      'Female students only',
      'Password-secured entry',
      'No male visitors after 7 PM',
      'Maintain compound cleanliness',
      'Respect privacy of others'
    ],
    owner: generateOwner('Mrs. Chika Okafor', '+233 26 123 4567'),
    availableFrom: '2024-08-15',
    availableTo: '2025-07-31',
    isActive: true,
    features: ['All-Girls', 'Password Security', 'Spacious Compound', 'East Legon'],
    house_rules: 'Safe haven for female students. Security and privacy are paramount.',
    stories: []
  },

  {
    id: 'oasis-hostel-upsa',
    name: 'Oasis Hostel',
    description: 'Located directly behind UPSA with small but adequate rooms and compound. Perfect for students who prioritize proximity to campus over space.',
    images: [
      '/images/hostels/oasis-exterior.jpg',
      '/images/hostels/oasis-room.jpg'
    ],
    price: 650,
    location: {
      address: 'Behind UPSA Main Campus',
      city: 'Accra',
      state: 'Greater Accra',
      country: 'Ghana',
      coordinates: { lat: 5.6895, lng: -0.1650 }
    },
    distanceToCampus: 0.1,
    nearestUniversity: 'University of Professional Studies, Accra (UPSA)',
    propertyType: 'hostel',
    bedrooms: 1,
    bathrooms: 0,
    maxOccupants: 2,
    amenities: [...commonAmenities, 'Behind Campus', 'Compact Rooms', 'Budget Friendly'],
    rules: [
      'Compact living consideration',
      'Maximize space efficiency',
      'Respect shared areas',
      'Campus proximity advantage',
      'Budget-conscious living'
    ],
    owner: generateOwner('Mr. Oasis Tetteh', '+233 24 234 5678'),
    availableFrom: '2024-09-01',
    availableTo: '2025-08-31',
    isActive: true,
    features: ['Behind Campus', 'Budget Friendly', 'Compact', 'Close Proximity'],
    house_rules: 'Compact living requires organization and respect for shared spaces.',
    stories: []
  },

  {
    id: 'student-hostel-east-legon',
    name: 'Student Hostel',
    description: 'An all-female hostel in East Legon with a large compound and private rooms. Located on a principal road with excellent public transport access.',
    images: [
      '/images/hostels/student-hostel-exterior.jpg',
      '/images/hostels/student-hostel-compound.jpg',
      '/images/hostels/student-hostel-room.jpg'
    ],
    price: 1000,
    location: {
      address: 'East Legon Principal Road, All-Female Hostel',
      city: 'Accra',
      state: 'Greater Accra',
      country: 'Ghana',
      coordinates: { lat: 5.6910, lng: -0.1625 }
    },
    distanceToCampus: 1.1,
    nearestUniversity: 'University of Professional Studies, Accra (UPSA)',
    propertyType: 'hostel',
    bedrooms: 1,
    bathrooms: 1,
    maxOccupants: 1,
    amenities: [...premiumAmenities, 'Female Only', 'Large Compound', 'Private Rooms', 'Principal Road'],
    rules: [
      'Female students only',
      'Privacy respected',
      'Large compound maintenance',
      'Principal road safety',
      'Transport access advantage'
    ],
    owner: generateOwner('Mrs. Student Akoto', '+233 20 345 6789'),
    availableFrom: '2024-08-01',
    availableTo: '2025-07-31',
    isActive: true,
    features: ['All-Female', 'Private Rooms', 'Large Compound', 'Principal Road'],
    house_rules: 'Privacy and safety for female students. Large compound for recreation.',
    stories: []
  },

  {
    id: 'bendavid-hostel-yellow',
    name: 'Bendavid Hostel (Yellow Hostel)',
    description: 'Popularly known as Yellow Hostel, located just 300 meters from UPSA. Offers basic standard accommodation with excellent proximity to campus.',
    images: [
      '/images/hostels/bendavid-exterior.jpg',
      '/images/hostels/bendavid-room.jpg'
    ],
    price: 700,
    location: {
      address: '300 Meters from UPSA Main Gate',
      city: 'Accra',
      state: 'Greater Accra',
      country: 'Ghana',
      coordinates: { lat: 5.6900, lng: -0.1645 }
    },
    distanceToCampus: 0.3,
    nearestUniversity: 'University of Professional Studies, Accra (UPSA)',
    propertyType: 'hostel',
    bedrooms: 1,
    bathrooms: 0,
    maxOccupants: 2,
    amenities: [...commonAmenities, 'Yellow Building', 'Basic Standards', 'Very Close to Campus'],
    rules: [
      'Basic accommodation standards',
      'Campus proximity advantage',
      'Maintain cleanliness',
      'Respect basic facilities',
      'Student-friendly environment'
    ],
    owner: generateOwner('Mr. Ben David', '+233 26 456 7890'),
    availableFrom: '2024-08-15',
    availableTo: '2025-07-31',
    isActive: true,
    features: ['Yellow Building', 'Very Close', 'Basic Standards', 'Student Popular'],
    house_rules: 'Basic but clean accommodation. Proximity to campus is the main advantage.',
    stories: []
  },

  {
    id: 'precious-hostel-twin',
    name: 'Precious Hostel',
    description: 'A twin hostel separated by the street with a homey feel. Easily accessible from most locations and considered a Madina hostel.',
    images: [
      '/images/hostels/precious-hostel-a.jpg',
      '/images/hostels/precious-hostel-b.jpg',
      '/images/hostels/precious-room.jpg'
    ],
    price: 800,
    location: {
      address: 'Madina, Twin Hostel Blocks',
      city: 'Accra',
      state: 'Greater Accra',
      country: 'Ghana',
      coordinates: { lat: 5.6885, lng: -0.1663 }
    },
    distanceToCampus: 0.6,
    nearestUniversity: 'University of Professional Studies, Accra (UPSA)',
    propertyType: 'hostel',
    bedrooms: 1,
    bathrooms: 0,
    maxOccupants: 2,
    amenities: [...commonAmenities, 'Twin Blocks', 'Homey Feel', 'Easy Access', 'Street Separated'],
    rules: [
      'Twin block coordination',
      'Street crossing safety',
      'Homey atmosphere maintenance',
      'Easy accessibility',
      'Community feeling'
    ],
    owner: generateOwner('Mrs. Precious Asiedu', '+233 24 567 8901'),
    availableFrom: '2024-09-01',
    availableTo: '2025-08-31',
    isActive: true,
    features: ['Twin Blocks', 'Homey Feel', 'Easy Access', 'Madina Location'],
    house_rules: 'Maintain the homey atmosphere. Twin blocks offer variety and community.',
    stories: []
  }
];

export default ghanaHostelsExtended;
