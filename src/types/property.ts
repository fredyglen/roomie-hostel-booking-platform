
// Story types
export type Story = {
  type: string;
  url: string;
  duration: number;
  caption?: string;
};

// Room type
export type RoomType = {
  name: string;
  price: number;
  unit: string;
  bedsAvailable?: number;
  totalBeds?: number;
};

// Property types
export type PropertyCategory = 'Hostel' | 'Homestel' | 'Apartment';

// Gender types
export type GenderType = 'Girls' | 'Boys' | 'Mixed';

/**
 * Unified Property interface
 * - Required database fields are non-optional
 * - Presentation fields are marked optional
 * - Both snake_case (database) and camelCase (frontend) variants are included
 */
export interface Property {
  // Core identifiers - required
  id: string;
  owner_id: string;
  title: string;
  address: string;

  // Basic property details
  type?: string;
  property_type?: string; 
  price?: number;
  rent?: number;
  priceUnit?: 'month' | 'semester' | 'year' | 'week';
  price_unit?: string;
  
  // Location information
  city?: string;
  state?: string;
  zip?: string;
  location?: string;
  landmark?: string;
  distanceToCampus?: string;
  distance_to_campus?: string;
  
  // Property features
  description?: string;
  bedrooms?: number;
  bathrooms?: number;
  size?: number;
  amenities?: string[];
  house_rules?: string[];
  images?: string[];
  image_url?: string;
  
  // Room management properties
  total_rooms?: number;
  rooms_available?: number;
  beds_per_room?: number;
  beds_available?: number;
  max_occupants?: number;
  availableUnits?: number;
  
  // Facility features
  has_bedframes?: boolean;
  has_mattresses?: boolean;
  has_wardrobes?: boolean;
  has_individual_meters?: boolean;
  
  // Property classification
  propertyCategory?: PropertyCategory;
  property_category?: PropertyCategory;
  genderType?: GenderType;
  gender_type?: string;
  
  // Payment and occupancy details
  advance_payment_months?: number;
  allow_bill_sharing?: boolean;
  allInclusive?: boolean;
  all_inclusive?: boolean;
  utilities?: string[];
  
  // Availability
  occupancy?: string;
  is_available?: boolean;
  is_furnished?: boolean;
  status?: string;
  available_from?: string;
  available_to?: string;
  
  // Timestamps
  created_at?: string;
  updated_at?: string;
  
  // UI/display properties
  rating?: number;
  reviewCount?: number;
  verified?: boolean;
  stories?: Story[];
  roomTypes?: RoomType[];
  
  // Owner information (presentation only)
  owner?: {
    name: string;
    phone: string;
    responseRate: string;
    verified: boolean;
  };
}

// This interface is for the PropertyForm component
export interface PropertyFormValues {
  title: string;
  type: string;
  propertyCategory: PropertyCategory;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  price_unit: string;
  description: string;
  distance_to_campus?: string;
  amenities?: string;
  house_rules?: string;
  status: string;
  occupancy?: string;
  image_url?: string;
  images?: string[];
  all_inclusive: boolean;
  utilities?: string;
  location?: string;
  landmark?: string;
  
  // Basic property stats
  bedrooms: number;
  bathrooms: number;
  
  // Room management fields
  total_rooms?: number;
  rooms_available?: number;
  beds_per_room?: number;
  beds_available?: number;
  max_occupants?: number;
  
  // Additional facility features
  has_bedframes?: boolean;
  has_mattresses?: boolean;
  has_wardrobes?: boolean;
  has_individual_meters?: boolean;
  
  // Payment and occupancy details
  advance_payment_months?: number;
  allow_bill_sharing?: boolean;
}

// This interface is for inserting into the database
export interface PropertyInsert {
  owner_id: string;
  title: string;
  property_type: string;
  property_category?: string;
  rent: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  bedrooms: number;
  bathrooms: number;
  available_from: string;
  description: string;
  amenities?: string[];
  images?: string[];
  is_available?: boolean;
  distance_to_campus?: string;
  house_rules?: string[];
  all_inclusive?: boolean;
  utilities?: string[];
  location?: string;
  landmark?: string;
  
  // Room management fields
  total_rooms?: number;
  rooms_available?: number;
  beds_per_room?: number;
  beds_available?: number;
  max_occupants?: number;
  
  // Additional facility features
  has_bedframes?: boolean;
  has_mattresses?: boolean;
  has_wardrobes?: boolean;
  has_individual_meters?: boolean;
  
  // Payment and occupancy details
  advance_payment_months?: number;
  allow_bill_sharing?: boolean;
}
