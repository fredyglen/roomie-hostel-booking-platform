// Ghana Hostel Service - Integrates real hostel data with ROOMi platform
import { ghanaHostelsData, GhanaHostelData, getGenderRestrictionLabel, getFacilityTypeLabel, getProximityBadge } from '../data/ghanaHostels';

// Simple property interface for Ghana hostels
export interface GhanaProperty {
  id: number;
  title: string;
  description: string;
  location: string;
  roomType: string;
  images: string[];
  amenities: string[];
  rent: number;
  maxOccupants: number;
  genderRestriction: string;
  facilityType: string;
  specialFeatures: string[];
  securityLevel: string;
  proximityType: string;
  distanceToCampus: string;
}

export class GhanaHostelService {
  /**
   * Convert Ghana hostel data to ROOMi Property format
   */
  static convertToProperties(): GhanaProperty[] {
    return ghanaHostelsData.map((hostel, index) => ({
      id: index + 1,
      title: hostel.name,
      description: hostel.description,
      location: `${hostel.location}, ${hostel.distanceToCampus}`,
      roomType: this.mapRoomType(hostel.roomType),
      images: hostel.images,
      amenities: this.mapAmenities(hostel),
      rent: hostel.estimatedPrice,
      maxOccupants: hostel.maxOccupants,
      genderRestriction: hostel.genderRestriction,
      facilityType: hostel.facilityType,
      specialFeatures: hostel.specialFeatures,
      securityLevel: hostel.securityLevel,
      proximityType: hostel.proximityType,
      distanceToCampus: hostel.distanceToCampus
    }));
  }

  /**
   * Map room types to ROOMi format
   */
  private static mapRoomType(roomType: string): string {
    switch (roomType) {
      case '2 in a room': return '2 in a Room';
      case '4 in a room': return '4 in a Room';
      case 'single room': return 'Single Room';
      default: return '2 in a Room';
    }
  }

  /**
   * Map amenities from Ghana hostel data to ROOMi amenities
   */
  private static mapAmenities(hostel: GhanaHostelData): string[] {
    const amenityMap: { [key: string]: string } = {
      'Water Supply': 'water',
      'Shared Toilets': 'shared_bathroom',
      'Self-contained': 'private_bathroom',
      'Study Area': 'study_area',
      'Kitchen': 'kitchen',
      'Security': 'security',
      'Game Centre': 'recreation',
      'FIFA': 'recreation',
      'Walled Compound': 'security',
      'Nearby Shops': 'shopping',
      'Eateries': 'dining',
      'Large Compound': 'parking',
      'Shared Kitchen': 'kitchen',
      'Public Transport': 'transport',
      'Main Road Access': 'transport',
      'Provision Shops': 'shopping',
      'Enhanced Security': 'security',
      'Well-maintained': 'maintenance',
      'Spacious Compound': 'parking',
      'Well Ventilated': 'ventilation',
      'Password Lock': 'security',
      'Compact Design': 'space_efficient',
      'Very Close': 'proximity',
      'Privacy': 'privacy',
      'Principal Road': 'transport',
      'Basic Standards': 'basic_amenities',
      'Close Proximity': 'proximity',
      'Twin Buildings': 'multiple_blocks',
      'Homey Feel': 'comfort',
      'All Facilities': 'full_amenities',
      'Male Only': 'gender_specific',
      'Female Only': 'gender_specific',
      'Cozy Rooms': 'comfort',
      'UPSA Popular': 'popular',
      'Flexible Rental': 'flexible_terms',
      'Open Access': 'open_policy',
      'New Building': 'modern',
      'Toilet & Bath': 'private_bathroom',
      'Behind Campus': 'proximity',
      'Popular Choice': 'popular',
      'Clean Environment': 'cleanliness',
      'Serene': 'peaceful',
      'Spacious': 'spacious'
    };

    const mappedAmenities = new Set<string>();
    
    // Map from amenities array
    hostel.amenities.forEach(amenity => {
      if (amenityMap[amenity]) {
        mappedAmenities.add(amenityMap[amenity]);
      }
    });

    // Map from special features
    hostel.specialFeatures.forEach(feature => {
      if (amenityMap[feature]) {
        mappedAmenities.add(amenityMap[feature]);
      }
    });

    // Add facility type as amenity
    if (hostel.facilityType === 'self-contained') {
      mappedAmenities.add('private_bathroom');
    } else if (hostel.facilityType === 'shared') {
      mappedAmenities.add('shared_bathroom');
    }

    // Add gender restriction as amenity if specific
    if (hostel.genderRestriction !== 'mixed') {
      mappedAmenities.add('gender_specific');
    }

    // Add security level
    if (hostel.securityLevel === 'enhanced' || hostel.securityLevel === 'high') {
      mappedAmenities.add('security');
    }

    return Array.from(mappedAmenities);
  }

  /**
   * Get all unique locations from Ghana hostels
   */
  static getUniqueLocations(): string[] {
    const locations = new Set(ghanaHostelsData.map(hostel => hostel.location));
    return Array.from(locations);
  }

  /**
   * Filter hostels by criteria
   */
  static filterHostels(criteria: {
    genderRestriction?: string;
    maxPrice?: number;
    roomType?: string;
    location?: string;
    securityLevel?: string;
  }): GhanaProperty[] {
    let filtered = ghanaHostelsData;

    if (criteria.genderRestriction && criteria.genderRestriction !== 'mixed') {
      filtered = filtered.filter(hostel => 
        hostel.genderRestriction === criteria.genderRestriction || hostel.genderRestriction === 'mixed'
      );
    }

    if (criteria.maxPrice) {
      filtered = filtered.filter(hostel => hostel.estimatedPrice <= criteria.maxPrice);
    }

    if (criteria.roomType) {
      filtered = filtered.filter(hostel => hostel.roomType === criteria.roomType);
    }

    if (criteria.location) {
      filtered = filtered.filter(hostel => 
        hostel.location.toLowerCase().includes(criteria.location.toLowerCase())
      );
    }

    if (criteria.securityLevel) {
      filtered = filtered.filter(hostel => hostel.securityLevel === criteria.securityLevel);
    }

    return filtered.map((hostel, index) => ({
      id: index + 1,
      title: hostel.name,
      description: hostel.description,
      location: `${hostel.location}, ${hostel.distanceToCampus}`,
      roomType: this.mapRoomType(hostel.roomType),
      images: hostel.images,
      amenities: this.mapAmenities(hostel),
      rent: hostel.estimatedPrice,
      maxOccupants: hostel.maxOccupants,
      genderRestriction: hostel.genderRestriction,
      facilityType: hostel.facilityType,
      specialFeatures: hostel.specialFeatures,
      securityLevel: hostel.securityLevel,
      proximityType: hostel.proximityType,
      distanceToCampus: hostel.distanceToCampus
    }));
  }

  /**
   * Get hostel statistics
   */
  static getStatistics() {
    const total = ghanaHostelsData.length;
    const genderStats = {
      mixed: ghanaHostelsData.filter(h => h.genderRestriction === 'mixed').length,
      female: ghanaHostelsData.filter(h => h.genderRestriction === 'female').length,
      male: ghanaHostelsData.filter(h => h.genderRestriction === 'male').length
    };
    
    const priceRange = {
      min: Math.min(...ghanaHostelsData.map(h => h.estimatedPrice)),
      max: Math.max(...ghanaHostelsData.map(h => h.estimatedPrice)),
      average: Math.round(ghanaHostelsData.reduce((sum, h) => sum + h.estimatedPrice, 0) / total)
    };

    const locationStats = this.getUniqueLocations().map(location => ({
      location,
      count: ghanaHostelsData.filter(h => h.location === location).length
    }));

    return {
      total,
      genderStats,
      priceRange,
      locationStats
    };
  }
}

export default GhanaHostelService;
