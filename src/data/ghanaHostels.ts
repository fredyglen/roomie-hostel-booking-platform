// Real Ghana Hostel Data for ROOMi Platform
// Data source: 21 hostels near UPSA university

export interface GhanaHostelData {
  id: string;
  name: string;
  description: string;
  location: string;
  distanceToCampus: string;
  genderRestriction: 'male' | 'female' | 'mixed';
  roomType: string;
  facilityType: 'self-contained' | 'shared' | 'mixed';
  amenities: string[];
  specialFeatures: string[];
  securityLevel: 'basic' | 'enhanced' | 'high';
  proximityType: 'walking' | 'opposite' | 'behind' | 'nearby';
  estimatedPrice: number; // GHS per semester
  maxOccupants: number;
  images: string[];
}

export const ghanaHostelsData: GhanaHostelData[] = [
  {
    id: 'kitatsu-hostel',
    name: 'Kitatsu Hostel',
    description: 'All girls hostel located very close to UPSA in Madina with water flowing and shared toilet facilities.',
    location: 'Madina',
    distanceToCampus: '2 min walk to campus',
    genderRestriction: 'female',
    roomType: '2 in a room',
    facilityType: 'shared',
    amenities: ['Water Supply', 'Shared Toilets'],
    specialFeatures: ['Female Only', 'Close to Campus'],
    securityLevel: 'basic',
    proximityType: 'walking',
    estimatedPrice: 2400,
    maxOccupants: 2,
    images: ['/placeholder-hostel.jpg']
  },
  {
    id: 'prestige-hostel',
    name: 'Prestige Hostel',
    description: 'Located opposite UPSA with spacious self-contained rooms, study areas, kitchen on each floor, and enhanced security.',
    location: 'East Legon',
    distanceToCampus: '1 min walk to campus',
    genderRestriction: 'mixed',
    roomType: '2 in a room',
    facilityType: 'self-contained',
    amenities: ['Self-contained', 'Study Area', 'Kitchen', 'Security'],
    specialFeatures: ['Opposite Campus', 'Spacious Rooms', 'Enhanced Security'],
    securityLevel: 'enhanced',
    proximityType: 'opposite',
    estimatedPrice: 3200,
    maxOccupants: 2,
    images: ['/placeholder-hostel.jpg']
  },
  {
    id: 'makasella-hostel',
    name: 'Makasella Hostel',
    description: 'Peaceful and comfortable hostel close to UPSA housing both male and female students in walled compound.',
    location: 'Near UPSA',
    distanceToCampus: '5 min walk to campus',
    genderRestriction: 'mixed',
    roomType: '2 in a room',
    facilityType: 'mixed',
    amenities: ['Walled Compound', 'Mixed Gender'],
    specialFeatures: ['Peaceful Environment', 'Comfortable'],
    securityLevel: 'basic',
    proximityType: 'walking',
    estimatedPrice: 2800,
    maxOccupants: 2,
    images: ['/placeholder-hostel.jpg']
  },
  {
    id: 'mb3-hostel',
    name: 'MB3 Hostel',
    description: 'Very neat and well organized hostel with spacious self-contained rooms, close to campus with nearby eateries and shops.',
    location: 'Madina',
    distanceToCampus: '3 min walk to campus',
    genderRestriction: 'mixed',
    roomType: '2 in a room',
    facilityType: 'self-contained',
    amenities: ['Self-contained', 'Nearby Shops', 'Eateries'],
    specialFeatures: ['Well Organized', 'Spacious Rooms'],
    securityLevel: 'basic',
    proximityType: 'walking',
    estimatedPrice: 2900,
    maxOccupants: 2,
    images: ['/placeholder-hostel.jpg']
  },
  {
    id: 'joy-hostel',
    name: 'Joy Hostel',
    description: 'Large hostel in East Legon with spacious rooms and shared facilities, popular with Lancaster University students.',
    location: 'East Legon',
    distanceToCampus: '7 min walk to campus',
    genderRestriction: 'mixed',
    roomType: '2 in a room',
    facilityType: 'shared',
    amenities: ['Shared Facilities', 'Large Compound'],
    specialFeatures: ['Spacious Rooms', 'Multi-University'],
    securityLevel: 'basic',
    proximityType: 'nearby',
    estimatedPrice: 2600,
    maxOccupants: 2,
    images: ['/placeholder-hostel.jpg']
  },
  {
    id: 'heavens-gate-hostel',
    name: 'Heavens Gate Hostel',
    description: 'Twin hostel in East Legon with old and new blocks, spacious self-contained rooms, all rooms are 4 in a room.',
    location: 'East Legon',
    distanceToCampus: '5 min walk to campus',
    genderRestriction: 'mixed',
    roomType: '4 in a room',
    facilityType: 'self-contained',
    amenities: ['Self-contained', 'Twin Blocks', 'Spacious'],
    specialFeatures: ['Old & New Blocks', 'Ideal for UPSA'],
    securityLevel: 'basic',
    proximityType: 'walking',
    estimatedPrice: 2200,
    maxOccupants: 4,
    images: ['/placeholder-hostel.jpg']
  },
  {
    id: 'goodwill-hostel',
    name: 'Goodwill Hostel',
    description: 'Large hostel with game centre on premises, houses both male and female students, great for FIFA lovers.',
    location: 'Near UPSA',
    distanceToCampus: '6 min walk to campus',
    genderRestriction: 'mixed',
    roomType: '2 in a room',
    facilityType: 'mixed',
    amenities: ['Game Centre', 'FIFA', 'Large Compound'],
    specialFeatures: ['Game Centre', 'Entertainment'],
    securityLevel: 'basic',
    proximityType: 'walking',
    estimatedPrice: 2700,
    maxOccupants: 2,
    images: ['/placeholder-hostel.jpg']
  },
  {
    id: 'campus-annex-hostel',
    name: 'Campus Annex Student Hostel',
    description: 'Located in Madina near UPSA and 10 mins from University of Ghana with all necessary facilities.',
    location: 'Madina',
    distanceToCampus: '4 min walk to campus',
    genderRestriction: 'mixed',
    roomType: '2 in a room',
    facilityType: 'mixed',
    amenities: ['All Facilities', 'Multi-University Access'],
    specialFeatures: ['Near Multiple Universities', 'Complete Facilities'],
    securityLevel: 'basic',
    proximityType: 'walking',
    estimatedPrice: 2800,
    maxOccupants: 2,
    images: ['/placeholder-hostel.jpg']
  },
  {
    id: 'green-hostel',
    name: 'Green Hostel',
    description: '3 storey building behind UPSA with shared kitchens and easy access to public transport.',
    location: 'Behind UPSA',
    distanceToCampus: '2 min walk to campus',
    genderRestriction: 'mixed',
    roomType: '2 in a room',
    facilityType: 'shared',
    amenities: ['Shared Kitchen', 'Public Transport', '3 Storey'],
    specialFeatures: ['Behind Campus', 'Easy Transport Access'],
    securityLevel: 'basic',
    proximityType: 'behind',
    estimatedPrice: 2500,
    maxOccupants: 2,
    images: ['/placeholder-hostel.jpg']
  },
  {
    id: 'anodams-hostel',
    name: 'Anodams Hostel',
    description: 'Located by main road in Madina with comfortable rooms, provision shops and eateries nearby.',
    location: 'Madina',
    distanceToCampus: '6 min walk to campus',
    genderRestriction: 'mixed',
    roomType: '2 in a room',
    facilityType: 'mixed',
    amenities: ['Main Road Access', 'Provision Shops', 'Eateries'],
    specialFeatures: ['Main Road Location', 'Easy Transport'],
    securityLevel: 'basic',
    proximityType: 'nearby',
    estimatedPrice: 2600,
    maxOccupants: 2,
    images: ['/placeholder-hostel.jpg']
  },
  {
    id: 'new-century-hostel',
    name: 'New Century Hostel',
    description: 'Madina hostel close to UPSA with enhanced security and well-maintained rooms and facilities.',
    location: 'Madina',
    distanceToCampus: '4 min walk to campus',
    genderRestriction: 'mixed',
    roomType: '2 in a room',
    facilityType: 'mixed',
    amenities: ['Enhanced Security', 'Well-maintained'],
    specialFeatures: ['Enhanced Security', 'Quality Facilities'],
    securityLevel: 'enhanced',
    proximityType: 'walking',
    estimatedPrice: 2900,
    maxOccupants: 2,
    images: ['/placeholder-hostel.jpg']
  },
  {
    id: 'chika-hostel',
    name: 'Chika Hostel',
    description: 'All girls hostel in East Legon with spacious compound, well ventilated rooms, and password secured gate.',
    location: 'East Legon',
    distanceToCampus: '5 min walk to campus',
    genderRestriction: 'female',
    roomType: '2 in a room',
    facilityType: 'mixed',
    amenities: ['Spacious Compound', 'Well Ventilated', 'Password Lock'],
    specialFeatures: ['Female Only', 'High Security', 'Spacious'],
    securityLevel: 'high',
    proximityType: 'walking',
    estimatedPrice: 2800,
    maxOccupants: 2,
    images: ['/placeholder-hostel.jpg']
  },
  {
    id: 'oasis-hostel',
    name: 'Oasis Hostel',
    description: 'Located behind UPSA with compact rooms and compound, very close to campus.',
    location: 'Behind UPSA',
    distanceToCampus: '1 min walk to campus',
    genderRestriction: 'mixed',
    roomType: '2 in a room',
    facilityType: 'mixed',
    amenities: ['Compact Design', 'Very Close'],
    specialFeatures: ['Behind Campus', 'Ultra Close'],
    securityLevel: 'basic',
    proximityType: 'behind',
    estimatedPrice: 2300,
    maxOccupants: 2,
    images: ['/placeholder-hostel.jpg']
  },
  {
    id: 'student-hostel-eastlegon',
    name: 'Student Hostel',
    description: 'All female hostel in East Legon with large compound, privacy, and principal road access.',
    location: 'East Legon',
    distanceToCampus: '6 min walk to campus',
    genderRestriction: 'female',
    roomType: '2 in a room',
    facilityType: 'mixed',
    amenities: ['Large Compound', 'Privacy', 'Principal Road'],
    specialFeatures: ['Female Only', 'Privacy', 'Easy Transport'],
    securityLevel: 'basic',
    proximityType: 'nearby',
    estimatedPrice: 2700,
    maxOccupants: 2,
    images: ['/placeholder-hostel.jpg']
  },
  {
    id: 'bendavid-hostel',
    name: 'Bendavid Hostel',
    description: 'Known as Yellow hostel, located 300 metres from UPSA with basic standard rooms.',
    location: 'Near UPSA',
    distanceToCampus: '3 min walk to campus',
    genderRestriction: 'mixed',
    roomType: '2 in a room',
    facilityType: 'mixed',
    amenities: ['Basic Standards', 'Close Proximity'],
    specialFeatures: ['Popular Choice', 'Very Close'],
    securityLevel: 'basic',
    proximityType: 'walking',
    estimatedPrice: 2500,
    maxOccupants: 2,
    images: ['/placeholder-hostel.jpg']
  },
  {
    id: 'precious-hostel',
    name: 'Precious Hostel',
    description: 'Twin hostel separated by street in Madina with homey feel and easy access.',
    location: 'Madina',
    distanceToCampus: '5 min walk to campus',
    genderRestriction: 'mixed',
    roomType: '2 in a room',
    facilityType: 'mixed',
    amenities: ['Twin Buildings', 'Homey Feel'],
    specialFeatures: ['Twin Hostel', 'Comfortable'],
    securityLevel: 'basic',
    proximityType: 'walking',
    estimatedPrice: 2600,
    maxOccupants: 2,
    images: ['/placeholder-hostel.jpg']
  },
  {
    id: 'paulino-hostel',
    name: 'Paulino Hostel',
    description: 'All boys hostel in East Legon near Ayele with all necessary facilities.',
    location: 'East Legon',
    distanceToCampus: '7 min walk to campus',
    genderRestriction: 'male',
    roomType: '2 in a room',
    facilityType: 'mixed',
    amenities: ['All Facilities', 'Male Only'],
    specialFeatures: ['Male Only', 'Complete Facilities'],
    securityLevel: 'basic',
    proximityType: 'nearby',
    estimatedPrice: 2700,
    maxOccupants: 2,
    images: ['/placeholder-hostel.jpg']
  },
  {
    id: 'lillypot-hostel',
    name: 'Lillypot Hostel',
    description: 'Located in East Legon with cozy rooms shared by 2 people each, popular with UPSA students.',
    location: 'East Legon',
    distanceToCampus: '6 min walk to campus',
    genderRestriction: 'mixed',
    roomType: '2 in a room',
    facilityType: 'mixed',
    amenities: ['Cozy Rooms', 'UPSA Popular'],
    specialFeatures: ['Cozy Environment', 'Student Favorite'],
    securityLevel: 'basic',
    proximityType: 'walking',
    estimatedPrice: 2600,
    maxOccupants: 2,
    images: ['/placeholder-hostel.jpg']
  },
  {
    id: 'chiefs-palace-hostel',
    name: 'Chief\'s Palace Hostel',
    description: 'Open to students and general public in East Legon for flexible rental periods.',
    location: 'East Legon',
    distanceToCampus: '8 min walk to campus',
    genderRestriction: 'mixed',
    roomType: '2 in a room',
    facilityType: 'mixed',
    amenities: ['Flexible Rental', 'Open Access'],
    specialFeatures: ['Flexible Terms', 'General Public'],
    securityLevel: 'basic',
    proximityType: 'nearby',
    estimatedPrice: 2800,
    maxOccupants: 2,
    images: ['/placeholder-hostel.jpg']
  },
  {
    id: 'joe-hostel',
    name: 'Joe Hostel',
    description: 'New hostel in Madina close to UPSA with 2 students per room, all rooms have toilet and bath.',
    location: 'Madina',
    distanceToCampus: '4 min walk to campus',
    genderRestriction: 'mixed',
    roomType: '2 in a room',
    facilityType: 'self-contained',
    amenities: ['Self-contained', 'New Building', 'Toilet & Bath'],
    specialFeatures: ['New Hostel', 'Modern Facilities'],
    securityLevel: 'basic',
    proximityType: 'walking',
    estimatedPrice: 2900,
    maxOccupants: 2,
    images: ['/placeholder-hostel.jpg']
  },
  {
    id: 'henrich-hostel',
    name: 'Henrich Hostel',
    description: 'Popular hostel located behind UPSA with excellent proximity to campus.',
    location: 'Behind UPSA',
    distanceToCampus: '2 min walk to campus',
    genderRestriction: 'mixed',
    roomType: '2 in a room',
    facilityType: 'mixed',
    amenities: ['Behind Campus', 'Popular Choice'],
    specialFeatures: ['Behind Campus', 'Student Favorite'],
    securityLevel: 'basic',
    proximityType: 'behind',
    estimatedPrice: 2600,
    maxOccupants: 2,
    images: ['/placeholder-hostel.jpg']
  },
  {
    id: 'west-end-hostel',
    name: 'West End Hostel',
    description: 'Clean and serene environment at Ashale Botwe, 3rd Gate with spacious rooms and basic facilities.',
    location: 'Ashale Botwe',
    distanceToCampus: '10 min walk to campus',
    genderRestriction: 'mixed',
    roomType: '2 in a room',
    facilityType: 'mixed',
    amenities: ['Clean Environment', 'Serene', 'Spacious'],
    specialFeatures: ['Clean & Serene', 'Spacious Rooms'],
    securityLevel: 'basic',
    proximityType: 'nearby',
    estimatedPrice: 2700,
    maxOccupants: 2,
    images: ['/placeholder-hostel.jpg']
  }
];

// Helper functions for data processing
export const getGenderRestrictionLabel = (restriction: string): string => {
  switch (restriction) {
    case 'female': return 'All Girls';
    case 'male': return 'All Boys';
    case 'mixed': return 'Mixed';
    default: return 'Mixed';
  }
};

export const getFacilityTypeLabel = (type: string): string => {
  switch (type) {
    case 'self-contained': return 'Self-contained';
    case 'shared': return 'Shared Facilities';
    case 'mixed': return 'Mixed Facilities';
    default: return 'Standard';
  }
};

export const getSecurityLevelColor = (level: string): string => {
  switch (level) {
    case 'high': return '#22c55e'; // green
    case 'enhanced': return '#3b82f6'; // blue
    case 'basic': return '#6b7280'; // gray
    default: return '#6b7280';
  }
};

export const getProximityBadge = (type: string): string => {
  switch (type) {
    case 'opposite': return 'Opposite Campus';
    case 'behind': return 'Behind Campus';
    case 'walking': return 'Walking Distance';
    case 'nearby': return 'Near Campus';
    default: return 'Near Campus';
  }
};
