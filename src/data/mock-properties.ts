/**
 * Consolidated Mock Property Data for ROOMi Platform
 * Real Ghana hostel data transformed for testing and demo
 */

import { Property } from '@/types/property';
import ghanaHostelsData from './ghana-hostels-mock-data';
import ghanaHostelsExtended from './ghana-hostels-extended';
import ghanaHostelsFinal from './ghana-hostels-final';

// Combine all hostel data
export const allGhanaHostels: Property[] = [
  ...ghanaHostelsData,
  ...ghanaHostelsExtended,
  ...ghanaHostelsFinal,
];

// Property statistics for dashboard
export const propertyStats = {
  total: allGhanaHostels.length,
  byType: {
    hostel: allGhanaHostels.filter(p => p.propertyType === 'hostel').length,
    shared_room: allGhanaHostels.filter(p => p.propertyType === 'shared_room').length,
    apartment: allGhanaHostels.filter(p => p.propertyType === 'apartment').length,
  },
  byGender: {
    mixed: allGhanaHostels.filter(p => !p.amenities.includes('Female Only') && !p.amenities.includes('Male Only')).length,
    femaleOnly: allGhanaHostels.filter(p => p.amenities.includes('Female Only')).length,
    maleOnly: allGhanaHostels.filter(p => p.amenities.includes('Male Only')).length,
  },
  priceRange: {
    min: Math.min(...allGhanaHostels.map(p => p.price)),
    max: Math.max(...allGhanaHostels.map(p => p.price)),
    average: Math.round(allGhanaHostels.reduce((sum, p) => sum + p.price, 0) / allGhanaHostels.length),
  },
  distanceRange: {
    closest: Math.min(...allGhanaHostels.map(p => p.distanceToCampus)),
    farthest: Math.max(...allGhanaHostels.map(p => p.distanceToCampus)),
    averageDistance: Math.round((allGhanaHostels.reduce((sum, p) => sum + p.distanceToCampus, 0) / allGhanaHostels.length) * 10) / 10,
  }
};

// Featured properties for homepage
export const featuredProperties = allGhanaHostels
  .filter(p => p.price <= 1000 && p.distanceToCampus <= 0.5)
  .slice(0, 6);

// Properties by category
export const propertiesByCategory = {
  budget: allGhanaHostels.filter(p => p.price <= 800),
  premium: allGhanaHostels.filter(p => p.price > 1000),
  closeToCampus: allGhanaHostels.filter(p => p.distanceToCampus <= 0.5),
  femaleOnly: allGhanaHostels.filter(p => p.amenities.includes('Female Only')),
  maleOnly: allGhanaHostels.filter(p => p.amenities.includes('Male Only')),
  selfContained: allGhanaHostels.filter(p => p.bathrooms >= 1),
  shared: allGhanaHostels.filter(p => p.bathrooms === 0),
};

// Search suggestions based on real data
export const searchSuggestions = {
  locations: [
    'Madina',
    'East Legon',
    'Behind UPSA',
    'Opposite UPSA',
    'Ashale Botwe',
    'Near UPSA Main Gate'
  ],
  amenities: [
    'WiFi',
    'Security Guard',
    'Kitchen Access',
    'Self-Contained',
    'Shared Bathroom',
    'Game Centre',
    'Study Area',
    'Parking Space',
    'CCTV Security',
    'Generator Backup'
  ],
  priceRanges: [
    { label: 'Budget (Under GHS 800)', min: 0, max: 800 },
    { label: 'Mid-range (GHS 800-1000)', min: 800, max: 1000 },
    { label: 'Premium (Above GHS 1000)', min: 1000, max: 2000 }
  ]
};

// Mock booking data for testing
export const mockBookings = [
  {
    id: 'booking-001',
    propertyId: 'prestige-hostel-upsa',
    userId: 'user-001',
    checkInDate: '2024-08-15',
    checkOutDate: '2025-05-15',
    status: 'confirmed',
    totalAmount: 10800, // 9 months * 1200
    guestCount: 1,
    emergencyContact: {
      name: 'Mrs. Akosua Mensah',
      phone: '+233 24 567 8901',
      relationship: 'Mother'
    }
  },
  {
    id: 'booking-002',
    propertyId: 'kitatsu-hostel-upsa',
    userId: 'user-002',
    checkInDate: '2024-09-01',
    checkOutDate: '2025-06-01',
    status: 'pending',
    totalAmount: 7200, // 9 months * 800
    guestCount: 1,
    emergencyContact: {
      name: 'Mr. Kwame Asante',
      phone: '+233 20 123 4567',
      relationship: 'Father'
    }
  }
];

// Mock user data for testing
export const mockUsers = [
  {
    id: 'user-001',
    email: 'ama.student@upsa.edu.gh',
    firstName: 'Ama',
    lastName: 'Osei',
    role: 'student',
    phone: '+233 24 111 2222',
    university: 'University of Professional Studies, Accra',
    program: 'Business Administration',
    yearOfStudy: '2nd Year'
  },
  {
    id: 'user-002',
    email: 'kwaku.student@upsa.edu.gh',
    firstName: 'Kwaku',
    lastName: 'Mensah',
    role: 'student',
    phone: '+233 26 333 4444',
    university: 'University of Professional Studies, Accra',
    program: 'Computer Science',
    yearOfStudy: '3rd Year'
  }
];

// Mock reviews for properties
export const mockReviews = [
  {
    id: 'review-001',
    propertyId: 'prestige-hostel-upsa',
    userId: 'user-001',
    rating: 5,
    title: 'Excellent location and facilities',
    comment: 'Being directly opposite UPSA makes this hostel perfect for students. The self-contained rooms are spacious and the security is top-notch. Highly recommend!',
    wouldRecommend: true,
    categories: {
      cleanliness: 5,
      location: 5,
      value: 4,
      communication: 5,
      amenities: 5
    },
    createdAt: '2024-01-15'
  },
  {
    id: 'review-002',
    propertyId: 'kitatsu-hostel-upsa',
    userId: 'user-002',
    rating: 4,
    title: 'Safe environment for female students',
    comment: 'As a female student, I feel very safe here. The all-girls environment is perfect and the location is very close to campus. Only downside is shared bathrooms.',
    wouldRecommend: true,
    categories: {
      cleanliness: 4,
      location: 5,
      value: 4,
      communication: 4,
      amenities: 3
    },
    createdAt: '2024-01-10'
  }
];

// Export functions for data manipulation
export const getPropertyById = (id: string): Property | undefined => {
  return allGhanaHostels.find(property => property.id === id);
};

export const getPropertiesByType = (type: string): Property[] => {
  return allGhanaHostels.filter(property => property.propertyType === type);
};

export const getPropertiesByPriceRange = (min: number, max: number): Property[] => {
  return allGhanaHostels.filter(property => property.price >= min && property.price <= max);
};

export const getPropertiesByDistance = (maxDistance: number): Property[] => {
  return allGhanaHostels.filter(property => property.distanceToCampus <= maxDistance);
};

export const searchProperties = (query: string): Property[] => {
  const lowercaseQuery = query.toLowerCase();
  return allGhanaHostels.filter(property => 
    property.name.toLowerCase().includes(lowercaseQuery) ||
    property.description.toLowerCase().includes(lowercaseQuery) ||
    property.location.address.toLowerCase().includes(lowercaseQuery) ||
    property.amenities.some(amenity => amenity.toLowerCase().includes(lowercaseQuery))
  );
};

// Default export
export default allGhanaHostels;
