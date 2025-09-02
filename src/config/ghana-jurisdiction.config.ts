/**
 * Ghana Jurisdiction Configuration
 * Apple-Grade implementation following BE CONSCIOUS standards
 * 
 * Business Purpose: Provides comprehensive jurisdiction management for Ghana
 * covering all regions, universities, and educational institutions to support
 * scalable campus admin assignments across the entire country
 * 
 * Technical Implementation: Defines hierarchical jurisdiction structure with
 * regions, cities, and institutions using branded types for compile-time safety
 * 
 * @author ROOMi Platform Team
 * @version 1.0.0
 * @compliance BE CONSCIOUS Apple-Grade Standards
 */

import { 
  CampusJurisdiction, 
  CountryJurisdiction,
  createCampusJurisdiction,
  createCountryJurisdiction 
} from '@/types/auth';

// ============================================================================
// GHANA REGIONS CONFIGURATION
// ============================================================================

/**
 * Ghana's 16 administrative regions
 */
export const GHANA_REGIONS = {
  'greater-accra': {
    name: 'Greater Accra Region',
    capital: 'Accra',
    code: 'GAR',
    population: 5455692,
    area: 3245, // km²
    coordinates: { latitude: 5.6037, longitude: -0.1870 }
  },
  'ashanti': {
    name: 'Ashanti Region',
    capital: 'Kumasi',
    code: 'ASH',
    population: 5440463,
    area: 24389,
    coordinates: { latitude: 6.6885, longitude: -1.6244 }
  },
  'central': {
    name: 'Central Region',
    capital: 'Cape Coast',
    code: 'CR',
    population: 2859821,
    area: 9826,
    coordinates: { latitude: 5.1037, longitude: -1.2466 }
  },
  'eastern': {
    name: 'Eastern Region',
    capital: 'Koforidua',
    code: 'ER',
    population: 2916319,
    area: 19323,
    coordinates: { latitude: 6.0891, longitude: -0.2644 }
  },
  'northern': {
    name: 'Northern Region',
    capital: 'Tamale',
    code: 'NR',
    population: 2479461,
    area: 70384,
    coordinates: { latitude: 9.4034, longitude: -0.8424 }
  },
  'volta': {
    name: 'Volta Region',
    capital: 'Ho',
    code: 'VR',
    population: 2118252,
    area: 20570,
    coordinates: { latitude: 6.6086, longitude: 0.4708 }
  },
  'western': {
    name: 'Western Region',
    capital: 'Sekondi-Takoradi',
    code: 'WR',
    population: 2060585,
    area: 23921,
    coordinates: { latitude: 4.9344, longitude: -1.7918 }
  },
  'upper-east': {
    name: 'Upper East Region',
    capital: 'Bolgatanga',
    code: 'UER',
    population: 1301221,
    area: 8842,
    coordinates: { latitude: 10.7856, longitude: -0.8514 }
  },
  'upper-west': {
    name: 'Upper West Region',
    capital: 'Wa',
    code: 'UWR',
    population: 746539,
    area: 18476,
    coordinates: { latitude: 10.0601, longitude: -2.5057 }
  },
  'brong-ahafo': {
    name: 'Bono Region',
    capital: 'Sunyani',
    code: 'BR',
    population: 1208649,
    area: 39557,
    coordinates: { latitude: 7.3392, longitude: -2.3265 }
  },
  'western-north': {
    name: 'Western North Region',
    capital: 'Sefwi Wiawso',
    code: 'WNR',
    population: 819478,
    area: 9608,
    coordinates: { latitude: 6.2089, longitude: -2.4917 }
  },
  'ahafo': {
    name: 'Ahafo Region',
    capital: 'Goaso',
    code: 'AHR',
    population: 563677,
    area: 8761,
    coordinates: { latitude: 7.1667, longitude: -2.5833 }
  },
  'bono-east': {
    name: 'Bono East Region',
    capital: 'Techiman',
    code: 'BER',
    population: 1262907,
    area: 12291,
    coordinates: { latitude: 7.5906, longitude: -1.9372 }
  },
  'oti': {
    name: 'Oti Region',
    capital: 'Dambai',
    code: 'OR',
    population: 1067649,
    area: 14194,
    coordinates: { latitude: 8.1667, longitude: 0.4833 }
  },
  'north-east': {
    name: 'North East Region',
    capital: 'Nalerigu',
    code: 'NER',
    population: 596806,
    area: 9574,
    coordinates: { latitude: 10.5333, longitude: -0.3667 }
  },
  'savannah': {
    name: 'Savannah Region',
    capital: 'Damongo',
    code: 'SR',
    population: 731653,
    area: 35862,
    coordinates: { latitude: 9.0833, longitude: -1.8167 }
  }
} as const;

export type GhanaRegionCode = keyof typeof GHANA_REGIONS;

// ============================================================================
// COMPREHENSIVE GHANA UNIVERSITIES
// ============================================================================

/**
 * Comprehensive list of Ghana universities and tertiary institutions
 * Organized by type and region for scalable jurisdiction management
 */
export const GHANA_UNIVERSITIES = {
  // Public Universities
  'ug-legon': {
    code: 'UG',
    name: 'University of Ghana',
    type: 'public',
    location: 'Legon, Accra',
    region: 'greater-accra',
    established: 1948,
    studentPopulation: 38000,
    campuses: ['Legon Campus', 'Korle Bu Campus'],
    specializations: ['Medicine', 'Engineering', 'Business', 'Arts', 'Sciences'],
    contactEmail: 'info@ug.edu.gh',
    website: 'https://ug.edu.gh'
  },
  'knust-kumasi': {
    code: 'KNUST',
    name: 'Kwame Nkrumah University of Science and Technology',
    type: 'public',
    location: 'Kumasi',
    region: 'ashanti',
    established: 1952,
    studentPopulation: 60000,
    campuses: ['Main Campus'],
    specializations: ['Engineering', 'Technology', 'Architecture', 'Sciences'],
    contactEmail: 'info@knust.edu.gh',
    website: 'https://knust.edu.gh'
  },
  'ucc-cape-coast': {
    code: 'UCC',
    name: 'University of Cape Coast',
    type: 'public',
    location: 'Cape Coast',
    region: 'central',
    established: 1962,
    studentPopulation: 70000,
    campuses: ['Main Campus'],
    specializations: ['Education', 'Business', 'Arts', 'Sciences'],
    contactEmail: 'info@ucc.edu.gh',
    website: 'https://ucc.edu.gh'
  },
  'upsa-accra': {
    code: 'UPSA',
    name: 'University of Professional Studies, Accra',
    type: 'public',
    location: 'Accra',
    region: 'greater-accra',
    established: 1965,
    studentPopulation: 15000,
    campuses: ['Main Campus'],
    specializations: ['Business', 'Management', 'Accounting', 'Law'],
    contactEmail: 'info@upsa.edu.gh',
    website: 'https://upsa.edu.gh'
  },
  'uew-winneba': {
    code: 'UEW',
    name: 'University of Education, Winneba',
    type: 'public',
    location: 'Winneba',
    region: 'central',
    established: 1992,
    studentPopulation: 45000,
    campuses: ['Winneba Campus', 'Kumasi Campus', 'Mampong Campus'],
    specializations: ['Education', 'Arts', 'Sciences'],
    contactEmail: 'info@uew.edu.gh',
    website: 'https://uew.edu.gh'
  },
  'uds-tamale': {
    code: 'UDS',
    name: 'University for Development Studies',
    type: 'public',
    location: 'Tamale',
    region: 'northern',
    established: 1992,
    studentPopulation: 40000,
    campuses: ['Tamale Campus', 'Wa Campus', 'Navrongo Campus'],
    specializations: ['Development Studies', 'Agriculture', 'Medicine', 'Applied Sciences'],
    contactEmail: 'info@uds.edu.gh',
    website: 'https://uds.edu.gh'
  },
  'gimpa-accra': {
    code: 'GIMPA',
    name: 'Ghana Institute of Management and Public Administration',
    type: 'public',
    location: 'Accra',
    region: 'greater-accra',
    established: 1961,
    studentPopulation: 12000,
    campuses: ['Greenhill Campus'],
    specializations: ['Management', 'Public Administration', 'Law', 'Technology'],
    contactEmail: 'info@gimpa.edu.gh',
    website: 'https://gimpa.edu.gh'
  },
  'umat-tarkwa': {
    code: 'UMaT',
    name: 'University of Mines and Technology',
    type: 'public',
    location: 'Tarkwa',
    region: 'western',
    established: 2004,
    studentPopulation: 8000,
    campuses: ['Main Campus'],
    specializations: ['Mining Engineering', 'Petroleum Engineering', 'Environmental Sciences'],
    contactEmail: 'info@umat.edu.gh',
    website: 'https://umat.edu.gh'
  },
  // Private Universities (Major ones)
  'ashesi-berekuso': {
    code: 'ASHESI',
    name: 'Ashesi University',
    type: 'private',
    location: 'Berekuso',
    region: 'eastern',
    established: 2002,
    studentPopulation: 3000,
    campuses: ['Main Campus'],
    specializations: ['Engineering', 'Business', 'Computer Science'],
    contactEmail: 'info@ashesi.edu.gh',
    website: 'https://ashesi.edu.gh'
  },
  'central-university': {
    code: 'CU',
    name: 'Central University',
    type: 'private',
    location: 'Accra',
    region: 'greater-accra',
    established: 1988,
    studentPopulation: 15000,
    campuses: ['Miotso Campus', 'Mataheko Campus'],
    specializations: ['Business', 'Theology', 'Computing', 'Engineering'],
    contactEmail: 'info@central.edu.gh',
    website: 'https://central.edu.gh'
  },
  'valley-view-university': {
    code: 'VVU',
    name: 'Valley View University',
    type: 'private',
    location: 'Accra',
    region: 'greater-accra',
    established: 1979,
    studentPopulation: 8000,
    campuses: ['Oyibi Campus'],
    specializations: ['Business', 'Computing', 'Health Sciences'],
    contactEmail: 'info@vvu.edu.gh',
    website: 'https://vvu.edu.gh'
  }
} as const;

export type GhanaUniversityCode = keyof typeof GHANA_UNIVERSITIES;

// ============================================================================
// JURISDICTION HIERARCHY
// ============================================================================

/**
 * Jurisdiction hierarchy for scalable access control
 */
export interface JurisdictionHierarchy {
  readonly country: CountryJurisdiction;
  readonly regions: readonly {
    readonly code: GhanaRegionCode;
    readonly name: string;
    readonly universities: readonly GhanaUniversityCode[];
  }[];
}

/**
 * Ghana jurisdiction hierarchy
 */
export const GHANA_JURISDICTION_HIERARCHY: JurisdictionHierarchy = {
  country: createCountryJurisdiction('ghana'),
  regions: [
    {
      code: 'greater-accra',
      name: 'Greater Accra Region',
      universities: ['ug-legon', 'upsa-accra', 'gimpa-accra', 'central-university', 'valley-view-university']
    },
    {
      code: 'ashanti',
      name: 'Ashanti Region',
      universities: ['knust-kumasi']
    },
    {
      code: 'central',
      name: 'Central Region',
      universities: ['ucc-cape-coast', 'uew-winneba']
    },
    {
      code: 'eastern',
      name: 'Eastern Region',
      universities: ['ashesi-berekuso']
    },
    {
      code: 'northern',
      name: 'Northern Region',
      universities: ['uds-tamale']
    },
    {
      code: 'western',
      name: 'Western Region',
      universities: ['umat-tarkwa']
    },
    // Other regions can be added as universities are established
    {
      code: 'volta',
      name: 'Volta Region',
      universities: []
    },
    {
      code: 'upper-east',
      name: 'Upper East Region',
      universities: []
    },
    {
      code: 'upper-west',
      name: 'Upper West Region',
      universities: []
    },
    {
      code: 'brong-ahafo',
      name: 'Bono Region',
      universities: []
    },
    {
      code: 'western-north',
      name: 'Western North Region',
      universities: []
    },
    {
      code: 'ahafo',
      name: 'Ahafo Region',
      universities: []
    },
    {
      code: 'bono-east',
      name: 'Bono East Region',
      universities: []
    },
    {
      code: 'oti',
      name: 'Oti Region',
      universities: []
    },
    {
      code: 'north-east',
      name: 'North East Region',
      universities: []
    },
    {
      code: 'savannah',
      name: 'Savannah Region',
      universities: []
    }
  ]
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get university by code
 */
export const getUniversityByCode = (code: GhanaUniversityCode) => {
  return GHANA_UNIVERSITIES[code];
};

/**
 * Get universities by region
 */
export const getUniversitiesByRegion = (regionCode: GhanaRegionCode): GhanaUniversityCode[] => {
  const region = GHANA_JURISDICTION_HIERARCHY.regions.find(r => r.code === regionCode);
  return region ? [...region.universities] : [];
};

/**
 * Get region by university
 */
export const getRegionByUniversity = (universityCode: GhanaUniversityCode): GhanaRegionCode | null => {
  const university = GHANA_UNIVERSITIES[universityCode];
  return university ? university.region : null;
};

/**
 * Get all university options for UI components
 */
export const getAllUniversityOptions = () => {
  return Object.entries(GHANA_UNIVERSITIES).map(([code, university]) => ({
    value: code,
    label: `${university.code} - ${university.name}`,
    location: university.location,
    region: university.region,
    type: university.type,
    studentPopulation: university.studentPopulation
  }));
};

/**
 * Get universities by type
 */
export const getUniversitiesByType = (type: 'public' | 'private'): GhanaUniversityCode[] => {
  return Object.entries(GHANA_UNIVERSITIES)
    .filter(([_, university]) => university.type === type)
    .map(([code, _]) => code as GhanaUniversityCode);
};

/**
 * Validate jurisdiction assignment
 */
export const validateJurisdictionAssignment = (
  adminRole: 'supreme_admin' | 'campus_admin',
  universities: GhanaUniversityCode[]
): { valid: boolean; reason?: string } => {
  if (adminRole === 'supreme_admin') {
    return { valid: true }; // Supreme admin can access all
  }
  
  if (adminRole === 'campus_admin') {
    if (universities.length === 0) {
      return { valid: false, reason: 'Campus admin must have at least one university assignment' };
    }
    
    // Validate all universities exist
    const invalidUniversities = universities.filter(code => !GHANA_UNIVERSITIES[code]);
    if (invalidUniversities.length > 0) {
      return { 
        valid: false, 
        reason: `Invalid university codes: ${invalidUniversities.join(', ')}` 
      };
    }
    
    return { valid: true };
  }
  
  return { valid: false, reason: 'Invalid admin role' };
};
