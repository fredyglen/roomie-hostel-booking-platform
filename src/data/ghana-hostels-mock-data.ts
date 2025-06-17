/**
 * Real Ghana Hostel Data for ROOMi Platform
 * Based on actual hostels around UPSA (University of Professional Studies, Accra)
 * Transformed into structured Property objects for testing and demo
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

// Common amenities for Ghana hostels
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

export const ghanaHostelsData: GhanaHostelProperty[] = [
  {
    id: 'kitatsu-hostel-upsa',
    name: 'Kitatsu Hostel',
    description: 'An all-girls hostel located very close to UPSA in Madina. One of the few hostels that exclusively accommodates female students. Features flowing water and shared toilet facilities in a safe, secure environment designed specifically for female students.',
    images: [
      '/images/hostels/kitatsu-exterior.jpg',
      '/images/hostels/kitatsu-room.jpg',
      '/images/hostels/kitatsu-common-area.jpg'
    ],
    pricePerSemester: 3200, // GHS per semester (4 months)
    roomOptions: [
      { type: '2-in-a-room', price: 3200, available: true },
      { type: '4-in-a-room', price: 2800, available: true }
    ],
    location: {
      address: 'Madina Estate, Near UPSA Main Gate',
      city: 'Accra',
      state: 'Greater Accra',
      country: 'Ghana',
      coordinates: { lat: 5.6892, lng: -0.1654 }
    },
    distanceToCampus: 0.3, // km
    nearestUniversity: 'University of Professional Studies, Accra (UPSA)',
    propertyType: 'hostel',
    bedrooms: 1,
    bathrooms: 0, // Shared facilities
    maxOccupants: 2,
    amenities: [...commonAmenities, 'Female Only', 'Shared Bathrooms', 'Safe Environment'],
    rules: [
      'Female students only',
      'No male visitors after 8 PM',
      'Quiet hours: 10 PM - 6 AM',
      'No smoking or alcohol',
      'Visitors must register at reception'
    ],
    owner: generateOwner('Mrs. Akosua Mensah', '+233 24 567 8901'),
    availableFrom: '2024-08-01',
    availableTo: '2025-07-31',
    isActive: true,
    features: ['All Female Hostel', 'Close to Campus', 'Secure Environment'],
    house_rules: 'Strictly for female students. Quiet environment maintained for studies.',
    stories: []
  },

  {
    id: 'prestige-hostel-upsa',
    name: 'Prestige Hostel',
    description: 'Located directly opposite UPSA in East Legon, Prestige Hostel is one of the most popular choices for UPSA students. Features spacious, self-contained rooms with private bathrooms, study areas and kitchens on each floor, plus top-notch security.',
    images: [
      '/images/hostels/prestige-exterior.jpg',
      '/images/hostels/prestige-room.jpg',
      '/images/hostels/prestige-kitchen.jpg',
      '/images/hostels/prestige-study-area.jpg'
    ],
    pricePerSemester: 4800, // GHS per semester (4 months)
    roomOptions: [
      { type: '1-in-a-room', price: 4800, available: true },
      { type: '2-in-a-room', price: 4200, available: true }
    ],
    location: {
      address: 'East Legon, Opposite UPSA Main Campus',
      city: 'Accra',
      state: 'Greater Accra',
      country: 'Ghana',
      coordinates: { lat: 5.6901, lng: -0.1643 }
    },
    distanceToCampus: 0.1, // km - directly opposite
    nearestUniversity: 'University of Professional Studies, Accra (UPSA)',
    propertyType: 'hostel',
    bedrooms: 1,
    bathrooms: 1, // Self-contained
    maxOccupants: 2,
    amenities: [...premiumAmenities, 'Self-Contained Rooms', 'Study Room Per Floor', 'Kitchen Per Floor'],
    rules: [
      'No noise after 10 PM',
      'Visitors must sign in/out',
      'Keep common areas clean',
      'No cooking in rooms',
      'Security deposit required'
    ],
    owner: generateOwner('Mr. Kwame Asante', '+233 20 123 4567'),
    availableFrom: '2024-08-15',
    availableTo: '2025-07-31',
    isActive: true,
    features: ['Premium Location', 'Self-Contained', 'High Security', 'Study Facilities'],
    house_rules: 'Maintain cleanliness and respect for other residents. Security is paramount.',
    stories: []
  },

  {
    id: 'makasella-hostel-upsa',
    name: 'Makasella Hostel',
    description: 'A peaceful and comfortable hostel located close to UPSA, housing both male and female students in a secure walled compound. Just a 5-minute walk to campus, offering a quiet environment perfect for studies.',
    images: [
      '/images/hostels/makasella-exterior.jpg',
      '/images/hostels/makasella-compound.jpg',
      '/images/hostels/makasella-room.jpg'
    ],
    pricePerSemester: 3600, // GHS per semester (4 months)
    roomOptions: [
      { type: '2-in-a-room', price: 3600, available: true },
      { type: '3-in-a-room', price: 3200, available: true }
    ],
    location: {
      address: 'Madina, 5 Minutes Walk to UPSA',
      city: 'Accra',
      state: 'Greater Accra',
      country: 'Ghana',
      coordinates: { lat: 5.6885, lng: -0.1661 }
    },
    distanceToCampus: 0.4, // km
    nearestUniversity: 'University of Professional Studies, Accra (UPSA)',
    propertyType: 'hostel',
    bedrooms: 1,
    bathrooms: 0, // Shared
    maxOccupants: 2,
    amenities: [...commonAmenities, 'Walled Compound', 'Mixed Gender', 'Peaceful Environment'],
    rules: [
      'Respect for all residents',
      'No loud music after 9 PM',
      'Visitors allowed until 8 PM',
      'Keep compound clean',
      'Report any issues to management'
    ],
    owner: generateOwner('Mrs. Comfort Adjei', '+233 26 789 0123'),
    availableFrom: '2024-09-01',
    availableTo: '2025-08-31',
    isActive: true,
    features: ['Mixed Gender', 'Walled Compound', 'Walking Distance', 'Peaceful'],
    house_rules: 'Peaceful coexistence and mutual respect among all residents.',
    stories: []
  },

  {
    id: 'mb3-hostel-upsa',
    name: 'MB3 Hostel',
    description: 'A very neat and well-organized hostel in Madina, favored by students for its proximity to campus and excellent facilities. Features spacious, self-contained rooms with easy access to eateries and shops.',
    images: [
      '/images/hostels/mb3-exterior.jpg',
      '/images/hostels/mb3-room.jpg',
      '/images/hostels/mb3-facilities.jpg'
    ],
    price: 1100, // GHS per month
    location: {
      address: 'Madina Township, Near UPSA',
      city: 'Accra',
      state: 'Greater Accra',
      country: 'Ghana',
      coordinates: { lat: 5.6878, lng: -0.1668 }
    },
    distanceToCampus: 0.5, // km
    nearestUniversity: 'University of Professional Studies, Accra (UPSA)',
    propertyType: 'hostel',
    bedrooms: 1,
    bathrooms: 1, // Self-contained
    maxOccupants: 2,
    amenities: [...premiumAmenities, 'Self-Contained', 'Near Shops', 'Well Organized'],
    rules: [
      'Maintain room cleanliness',
      'No overnight guests without permission',
      'Respect common facilities',
      'Pay rent on time',
      'Follow hostel guidelines'
    ],
    owner: generateOwner('Mr. Michael Boateng', '+233 24 345 6789'),
    availableFrom: '2024-08-01',
    availableTo: '2025-07-31',
    isActive: true,
    features: ['Self-Contained', 'Near Amenities', 'Well Maintained', 'Student Favorite'],
    house_rules: 'Cleanliness and orderliness are key. Respect for facilities and other residents.',
    stories: []
  },

  {
    id: 'joy-hostel-east-legon',
    name: 'Joy Hostel',
    description: 'A large hostel for students in East Legon with spacious rooms and shared facilities. Popular among Lancaster University students and other institutions in the area.',
    images: [
      '/images/hostels/joy-exterior.jpg',
      '/images/hostels/joy-room.jpg',
      '/images/hostels/joy-common.jpg'
    ],
    price: 950, // GHS per month
    location: {
      address: 'East Legon, Near Lancaster University',
      city: 'Accra',
      state: 'Greater Accra',
      country: 'Ghana',
      coordinates: { lat: 5.6912, lng: -0.1621 }
    },
    distanceToCampus: 1.2, // km from UPSA
    nearestUniversity: 'Lancaster University Ghana / UPSA',
    propertyType: 'hostel',
    bedrooms: 1,
    bathrooms: 0, // Shared
    maxOccupants: 3,
    amenities: [...commonAmenities, 'Large Compound', 'Shared Facilities', 'Multi-University'],
    rules: [
      'Shared facility etiquette',
      'No loud activities after 10 PM',
      'Clean after use',
      'Respect other students',
      'Follow hostel schedule'
    ],
    owner: generateOwner('Mrs. Joyce Osei', '+233 20 456 7890'),
    availableFrom: '2024-08-15',
    availableTo: '2025-07-31',
    isActive: true,
    features: ['Large Hostel', 'Multi-University', 'East Legon Location', 'Spacious Rooms'],
    house_rules: 'Shared living requires consideration for others. Maintain cleanliness.',
    stories: []
  },

  {
    id: 'heavens-gate-hostel',
    name: 'Heavens Gate Hostel',
    description: 'A twin hostel in East Legon with both old and new blocks. Features spacious self-contained rooms with 4 students per room, ideal for UPSA students looking for affordable shared accommodation.',
    images: [
      '/images/hostels/heavens-gate-new.jpg',
      '/images/hostels/heavens-gate-old.jpg',
      '/images/hostels/heavens-gate-room.jpg'
    ],
    price: 600, // GHS per month (4-in-a-room)
    location: {
      address: 'East Legon, Twin Block Hostel',
      city: 'Accra',
      state: 'Greater Accra',
      country: 'Ghana',
      coordinates: { lat: 5.6895, lng: -0.1635 }
    },
    distanceToCampus: 0.8, // km
    nearestUniversity: 'University of Professional Studies, Accra (UPSA)',
    propertyType: 'shared_room',
    bedrooms: 1,
    bathrooms: 1, // Self-contained
    maxOccupants: 4,
    amenities: [...commonAmenities, 'Twin Blocks', '4-in-a-Room', 'Self-Contained', 'Affordable'],
    rules: [
      '4 students per room maximum',
      'Shared room responsibilities',
      'Quiet study hours',
      'Clean common areas',
      'Respect roommates'
    ],
    owner: generateOwner('Pastor Emmanuel Adjei', '+233 26 567 8901'),
    availableFrom: '2024-08-01',
    availableTo: '2025-07-31',
    isActive: true,
    features: ['4-in-a-Room', 'Twin Blocks', 'Affordable', 'Self-Contained'],
    house_rules: 'Shared accommodation requires mutual respect and cleanliness.',
    stories: []
  },

  {
    id: 'goodwill-hostel-upsa',
    name: 'Goodwill Hostel',
    description: 'A large hostel with many rooms and unique amenities including a game centre on premises. Perfect for students who love gaming (FIFA) and want a fun, social environment. Houses both male and female students.',
    images: [
      '/images/hostels/goodwill-exterior.jpg',
      '/images/hostels/goodwill-game-center.jpg',
      '/images/hostels/goodwill-room.jpg'
    ],
    price: 850,
    location: {
      address: 'Madina, Near UPSA Campus',
      city: 'Accra',
      state: 'Greater Accra',
      country: 'Ghana',
      coordinates: { lat: 5.6888, lng: -0.1658 }
    },
    distanceToCampus: 0.6,
    nearestUniversity: 'University of Professional Studies, Accra (UPSA)',
    propertyType: 'hostel',
    bedrooms: 1,
    bathrooms: 0,
    maxOccupants: 2,
    amenities: [...commonAmenities, 'Game Centre', 'FIFA Gaming', 'Mixed Gender', 'Social Environment'],
    rules: [
      'Game centre hours: 6 AM - 11 PM',
      'No gambling in game centre',
      'Respect gaming schedule',
      'Mixed gender accommodation rules',
      'Keep noise levels reasonable'
    ],
    owner: generateOwner('Mr. Samuel Goodwill', '+233 24 678 9012'),
    availableFrom: '2024-08-01',
    availableTo: '2025-07-31',
    isActive: true,
    features: ['Game Centre', 'FIFA Gaming', 'Large Hostel', 'Social Hub'],
    house_rules: 'Gaming and social activities welcome, but respect study time and other residents.',
    stories: []
  },

  {
    id: 'campus-annex-hostel',
    name: 'Campus Annex Student Hostel',
    description: 'Located in Madina near UPSA and about 10 minutes from University of Ghana. A student favorite with all necessary facilities for a fruitful academic stay.',
    images: [
      '/images/hostels/campus-annex-exterior.jpg',
      '/images/hostels/campus-annex-room.jpg',
      '/images/hostels/campus-annex-facilities.jpg'
    ],
    price: 1000,
    location: {
      address: 'Madina, Between UPSA and University of Ghana',
      city: 'Accra',
      state: 'Greater Accra',
      country: 'Ghana',
      coordinates: { lat: 5.6875, lng: -0.1672 }
    },
    distanceToCampus: 0.7,
    nearestUniversity: 'UPSA / University of Ghana',
    propertyType: 'hostel',
    bedrooms: 1,
    bathrooms: 1,
    maxOccupants: 2,
    amenities: [...premiumAmenities, 'Multi-University Access', 'Student Favorite', 'Complete Facilities'],
    rules: [
      'Students from any university welcome',
      'Maintain academic focus',
      'Respect study hours',
      'Keep facilities clean',
      'Follow hostel regulations'
    ],
    owner: generateOwner('Dr. Patricia Annex', '+233 20 789 0123'),
    availableFrom: '2024-08-15',
    availableTo: '2025-07-31',
    isActive: true,
    features: ['Multi-University', 'Complete Facilities', 'Student Favorite', 'Strategic Location'],
    house_rules: 'Academic excellence is our priority. Maintain a conducive study environment.',
    stories: []
  },

  {
    id: 'green-hostel-upsa',
    name: 'Green Hostel',
    description: 'A 3-storey building located just behind UPSA. Easy walking distance to campus with shared kitchen facilities and excellent public transport access.',
    images: [
      '/images/hostels/green-exterior.jpg',
      '/images/hostels/green-kitchen.jpg',
      '/images/hostels/green-room.jpg'
    ],
    price: 750,
    location: {
      address: 'Behind UPSA Main Campus, 3-Storey Building',
      city: 'Accra',
      state: 'Greater Accra',
      country: 'Ghana',
      coordinates: { lat: 5.6898, lng: -0.1648 }
    },
    distanceToCampus: 0.2,
    nearestUniversity: 'University of Professional Studies, Accra (UPSA)',
    propertyType: 'hostel',
    bedrooms: 1,
    bathrooms: 0,
    maxOccupants: 2,
    amenities: [...commonAmenities, 'Shared Kitchen', 'Public Transport Access', '3-Storey Building'],
    rules: [
      'Kitchen sharing schedule',
      'Clean after cooking',
      'No overnight cooking',
      'Respect kitchen equipment',
      'Walking distance advantage'
    ],
    owner: generateOwner('Mr. Green Mensah', '+233 26 890 1234'),
    availableFrom: '2024-09-01',
    availableTo: '2025-08-31',
    isActive: true,
    features: ['Behind Campus', 'Shared Kitchen', 'Public Transport', '3-Storey'],
    house_rules: 'Kitchen sharing requires cooperation. Maintain cleanliness and respect schedules.',
    stories: []
  },

  {
    id: 'anodams-hostel-madina',
    name: 'Anodams Hostel',
    description: 'Located by the main road in Madina with very comfortable rooms. Surrounded by provision shops and eateries. Preferred by East Legon school students due to excellent public transport access.',
    images: [
      '/images/hostels/anodams-exterior.jpg',
      '/images/hostels/anodams-room.jpg',
      '/images/hostels/anodams-area.jpg'
    ],
    price: 900,
    location: {
      address: 'Madina Main Road, Near Shops and Eateries',
      city: 'Accra',
      state: 'Greater Accra',
      country: 'Ghana',
      coordinates: { lat: 5.6882, lng: -0.1665 }
    },
    distanceToCampus: 0.8,
    nearestUniversity: 'UPSA / East Legon Schools',
    propertyType: 'hostel',
    bedrooms: 1,
    bathrooms: 0,
    maxOccupants: 2,
    amenities: [...commonAmenities, 'Main Road Location', 'Near Shops', 'Public Transport Hub'],
    rules: [
      'Main road noise consideration',
      'Easy transport access',
      'Near shopping convenience',
      'Respect other residents',
      'Follow traffic safety'
    ],
    owner: generateOwner('Mr. Adams Nkrumah', '+233 24 901 2345'),
    availableFrom: '2024-08-01',
    availableTo: '2025-07-31',
    isActive: true,
    features: ['Main Road', 'Near Shops', 'Transport Hub', 'Multi-School Access'],
    house_rules: 'Convenient location with easy access to amenities and transport.',
    stories: []
  }
];

// Additional hostels will be added in the next part
export default ghanaHostelsData;
