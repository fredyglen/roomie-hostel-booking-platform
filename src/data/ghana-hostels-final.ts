/**
 * Final Ghana Hostel Data - Part 3
 * Completion of real hostel data around UPSA
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

export const ghanaHostelsFinal: Property[] = [
  {
    id: 'paulino-hostel-boys',
    name: 'Paulino Hostel',
    description: 'A rare all-boys hostel located in East Legon near Ayele. Simple accommodation with all necessary facilities exclusively for male students.',
    images: [
      '/images/hostels/paulino-exterior.jpg',
      '/images/hostels/paulino-room.jpg',
      '/images/hostels/paulino-facilities.jpg'
    ],
    price: 750,
    location: {
      address: 'East Legon, Near Ayele, All-Boys Hostel',
      city: 'Accra',
      state: 'Greater Accra',
      country: 'Ghana',
      coordinates: { lat: 5.6915, lng: -0.1620 }
    },
    distanceToCampus: 1.3,
    nearestUniversity: 'University of Professional Studies, Accra (UPSA)',
    propertyType: 'hostel',
    bedrooms: 1,
    bathrooms: 0,
    maxOccupants: 2,
    amenities: [...commonAmenities, 'Male Only', 'Simple Accommodation', 'All Facilities', 'East Legon'],
    rules: [
      'Male students only',
      'Simple living standards',
      'Respect for facilities',
      'Brotherhood environment',
      'Study-focused atmosphere'
    ],
    owner: generateOwner('Mr. Paulino Mensah', '+233 20 678 9012'),
    availableFrom: '2024-08-01',
    availableTo: '2025-07-31',
    isActive: true,
    features: ['All-Boys', 'Simple', 'East Legon', 'Rare Male-Only'],
    house_rules: 'Brotherhood and mutual respect. Simple but adequate facilities.',
    stories: []
  },

  {
    id: 'lillypot-hostel',
    name: 'Lillypot Hostel',
    description: 'Located in East Legon and mainly patronized by UPSA students. Features cozy rooms shared by 2 people each in a comfortable environment.',
    images: [
      '/images/hostels/lillypot-exterior.jpg',
      '/images/hostels/lillypot-room.jpg'
    ],
    price: 850,
    location: {
      address: 'East Legon, UPSA Student Favorite',
      city: 'Accra',
      state: 'Greater Accra',
      country: 'Ghana',
      coordinates: { lat: 5.6908, lng: -0.1628 }
    },
    distanceToCampus: 0.9,
    nearestUniversity: 'University of Professional Studies, Accra (UPSA)',
    propertyType: 'hostel',
    bedrooms: 1,
    bathrooms: 0,
    maxOccupants: 2,
    amenities: [...commonAmenities, 'Cozy Rooms', '2-Person Sharing', 'UPSA Favorite', 'Comfortable'],
    rules: [
      '2 people per room maximum',
      'Cozy living arrangement',
      'UPSA student preference',
      'Comfortable environment',
      'Shared responsibility'
    ],
    owner: generateOwner('Mrs. Lilly Potter', '+233 26 789 0123'),
    availableFrom: '2024-08-15',
    availableTo: '2025-07-31',
    isActive: true,
    features: ['Cozy Rooms', '2-Person', 'UPSA Favorite', 'Comfortable'],
    house_rules: 'Cozy shared living. Perfect for UPSA students seeking comfort.',
    stories: []
  },

  {
    id: 'chiefs-palace-hostel',
    name: "Chief's Palace Hostel",
    description: 'Not exclusively for students - open to anyone needing accommodation for any period. Located in East Legon with flexible rental terms.',
    images: [
      '/images/hostels/chiefs-palace-exterior.jpg',
      '/images/hostels/chiefs-palace-room.jpg'
    ],
    price: 1100,
    location: {
      address: 'East Legon, Mixed Accommodation',
      city: 'Accra',
      state: 'Greater Accra',
      country: 'Ghana',
      coordinates: { lat: 5.6912, lng: -0.1622 }
    },
    distanceToCampus: 1.2,
    nearestUniversity: 'University of Professional Studies, Accra (UPSA)',
    propertyType: 'apartment',
    bedrooms: 1,
    bathrooms: 1,
    maxOccupants: 2,
    amenities: [...premiumAmenities, 'Mixed Accommodation', 'Flexible Terms', 'Non-Student Friendly'],
    rules: [
      'Students and non-students welcome',
      'Flexible rental periods',
      'Professional environment',
      'Respect for all residents',
      'Palace-like standards'
    ],
    owner: generateOwner('Chief Palace Nana', '+233 24 890 1234'),
    availableFrom: '2024-08-01',
    availableTo: '2025-07-31',
    isActive: true,
    features: ['Mixed Use', 'Flexible Terms', 'Palace Standards', 'Professional'],
    house_rules: 'Professional environment welcoming students and working professionals.',
    stories: []
  },

  {
    id: 'joe-hostel-madina',
    name: 'Joe Hostel',
    description: 'A new hostel in Madina, close to UPSA. Popular choice for students with 2 students per room and convenient toilet and bath facilities in each room.',
    images: [
      '/images/hostels/joe-exterior.jpg',
      '/images/hostels/joe-room.jpg',
      '/images/hostels/joe-bathroom.jpg'
    ],
    price: 950,
    location: {
      address: 'Madina, New Hostel Near UPSA',
      city: 'Accra',
      state: 'Greater Accra',
      country: 'Ghana',
      coordinates: { lat: 5.6880, lng: -0.1670 }
    },
    distanceToCampus: 0.7,
    nearestUniversity: 'University of Professional Studies, Accra (UPSA)',
    propertyType: 'hostel',
    bedrooms: 1,
    bathrooms: 1,
    maxOccupants: 2,
    amenities: [...premiumAmenities, 'New Hostel', '2 Students Per Room', 'En-suite Bathroom', 'Popular Choice'],
    rules: [
      '2 students per room only',
      'New facility maintenance',
      'En-suite bathroom care',
      'Popular hostel standards',
      'Modern living expectations'
    ],
    owner: generateOwner('Mr. Joe Asante', '+233 20 901 2345'),
    availableFrom: '2024-08-01',
    availableTo: '2025-07-31',
    isActive: true,
    features: ['New Hostel', 'En-suite', '2-Person', 'Popular Choice'],
    house_rules: 'New facility with modern standards. Maintain the quality for future students.',
    stories: []
  },

  {
    id: 'henrich-hostel',
    name: 'Henrich Hostel',
    description: 'A popular hostel located behind UPSA. The proximity to campus makes this a preferred destination for many students seeking convenience.',
    images: [
      '/images/hostels/henrich-exterior.jpg',
      '/images/hostels/henrich-room.jpg'
    ],
    price: 800,
    location: {
      address: 'Behind UPSA Main Campus',
      city: 'Accra',
      state: 'Greater Accra',
      country: 'Ghana',
      coordinates: { lat: 5.6893, lng: -0.1652 }
    },
    distanceToCampus: 0.2,
    nearestUniversity: 'University of Professional Studies, Accra (UPSA)',
    propertyType: 'hostel',
    bedrooms: 1,
    bathrooms: 0,
    maxOccupants: 2,
    amenities: [...commonAmenities, 'Behind Campus', 'Popular Choice', 'Convenient Location', 'Student Preferred'],
    rules: [
      'Campus proximity advantage',
      'Popular hostel standards',
      'Convenient living',
      'Student-focused environment',
      'Preferred destination maintenance'
    ],
    owner: generateOwner('Mr. Henrich Boateng', '+233 26 012 3456'),
    availableFrom: '2024-09-01',
    availableTo: '2025-08-31',
    isActive: true,
    features: ['Behind Campus', 'Popular', 'Convenient', 'Student Preferred'],
    house_rules: 'Convenience and proximity are our strengths. Maintain student-friendly environment.',
    stories: []
  },

  {
    id: 'west-end-hostel',
    name: 'West End Hostel',
    description: 'Features a clean and serene environment with spacious, clean rooms and basic facilities. Located at Ashale Botwe, 3rd Gate, offering peaceful accommodation.',
    images: [
      '/images/hostels/west-end-exterior.jpg',
      '/images/hostels/west-end-room.jpg',
      '/images/hostels/west-end-environment.jpg'
    ],
    price: 1000,
    location: {
      address: 'Ashale Botwe, 3rd Gate',
      city: 'Accra',
      state: 'Greater Accra',
      country: 'Ghana',
      coordinates: { lat: 5.6920, lng: -0.1610 }
    },
    distanceToCampus: 2.0,
    nearestUniversity: 'University of Professional Studies, Accra (UPSA)',
    propertyType: 'hostel',
    bedrooms: 1,
    bathrooms: 1,
    maxOccupants: 2,
    amenities: [...premiumAmenities, 'Clean Environment', 'Serene Location', 'Spacious Rooms', 'Ashale Botwe'],
    rules: [
      'Maintain clean environment',
      'Respect serene atmosphere',
      'Spacious room advantage',
      'Ashale Botwe community',
      'Peaceful living standards'
    ],
    owner: generateOwner('Mr. West End Kwame', '+233 24 123 4567'),
    availableFrom: '2024-08-15',
    availableTo: '2025-07-31',
    isActive: true,
    features: ['Clean Environment', 'Serene', 'Spacious', 'Ashale Botwe'],
    house_rules: 'Clean and serene environment is our priority. Maintain peaceful atmosphere.',
    stories: []
  }
];

export default ghanaHostelsFinal;
