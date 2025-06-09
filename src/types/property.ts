
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface Location {
  address: string;
  city: string;
  state: string;
  latitude?: number;
  longitude?: number;
}

export interface Amenity {
  id: string;
  name: string;
  category?: string;
}

export interface Story {
  id: string;
  type: 'image' | 'video';
  url: string;
  caption?: string;
  duration?: number;
}

export interface Owner {
  id: string;
  name: string;
  email: string;
  phone: string;
  verified: boolean;
  responseRate?: number | string;
}

export interface RoomType {
  id: string;
  name: string;
  capacity: number;
  price: number;
  unit?: string;
}

export type PropertyType = 'hostel' | 'apartment' | 'homestel';
export type PropertyCategory = 'Hostel' | 'Apartment' | 'Homestel';
export type PropertyStatus = 'available' | 'occupied' | 'maintenance' | 'pending';

export interface Property extends BaseEntity {
  // Core identifiers
  name: string;
  title: string;
  owner_id: string;
  
  // Location information
  location: string | Location;
  address: string;
  city: string;
  state: string;
  zip: string;
  
  // Property details
  type: PropertyType;
  property_type?: string;
  property_category?: PropertyCategory;
  propertyCategory: PropertyCategory;
  description: string;
  status?: PropertyStatus;
  verified: boolean;
  
  // Pricing
  price: number;
  rent: number;
  priceUnit?: string;
  price_unit?: string;
  
  // Physical attributes
  bedrooms: number;
  bathrooms: number;
  size?: number;
  max_occupants?: number;
  
  // Availability
  available_from: string;
  available_to?: string;
  is_available: boolean;
  availableUnits?: number;
  
  // Features and amenities
  amenities: string[] | Amenity[];
  images: string[];
  stories?: Story[];
  features?: string[];
  
  // Hostel/Apartment specific
  total_rooms?: number;
  rooms_available?: number;
  beds_per_room?: number;
  beds_available?: number;
  
  // Additional features
  is_furnished?: boolean;
  parking_available?: boolean;
  parking_cost?: number;
  gender_restriction?: string;
  genderType?: string;
  gender_type?: string;
  pet_policy?: string;
  has_accessibility_features?: boolean;
  internet_speed?: string;
  security_features?: string[];
  house_rules?: string;
  
  // Contact and emergency
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  
  // Business rules
  cancellation_policy?: string;
  advance_payment_months?: number;
  allow_bill_sharing?: boolean;
  semester_availability?: string[];
  
  // Utilities and meters
  meter_type?: string;
  washroom_type?: string;
  shared_meter_count?: number;
  shared_washroom_count?: number;
  has_individual_meters?: boolean;
  has_tiled_room?: boolean;
  
  // Furnishing details
  has_fan?: boolean;
  has_wardrobes?: boolean;
  has_mattresses?: boolean;
  has_bedframes?: boolean;
  
  // Subscription and verification
  subscription_status?: string;
  subscription_expires_at?: string;
  verification_status?: string;
  virtual_tour_url?: string;
  
  // Distance and campus info
  distance_to_campus?: string | number;
  distanceToCampus?: string | number;
  
  // Owner information
  owner?: Owner;
  
  // Room types for complex properties
  roomTypes?: RoomType[];
  
  // Building structure
  occupancy?: any;
  
  // Additional properties for compatibility
  rating?: number;
}

export interface PropertyFormValues {
  title: string;
  description: string;
  type: PropertyType;
  address: string;
  city: string;
  state: string;
  zip: string;
  rent: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  available_from: string;
  available_to?: string;
  is_furnished: boolean;
  parking_available: boolean;
  parking_cost?: number;
  max_occupants?: number;
  gender_restriction?: string;
  pet_policy?: string;
  has_accessibility_features: boolean;
  internet_speed?: string;
  security_features: string[];
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  cancellation_policy?: string;
  advance_payment_months?: number;
  allow_bill_sharing: boolean;
  semester_availability: string[];
  meter_type?: string;
  washroom_type?: string;
  shared_meter_count?: number;
  shared_washroom_count?: number;
  has_individual_meters: boolean;
  has_tiled_room: boolean;
  has_fan: boolean;
  has_wardrobes: boolean;
  has_mattresses: boolean;
  has_bedframes: boolean;
  total_rooms?: number;
  rooms_available?: number;
  beds_per_room?: number;
  beds_available?: number;
  virtual_tour_url?: string;
}

// Export PropertyInsert for database operations
export type PropertyInsert = Omit<Property, 'id' | 'created_at' | 'updated_at'>;
