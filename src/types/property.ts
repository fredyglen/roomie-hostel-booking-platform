
import { BaseEntity, Amenity } from './common';

export type PropertyCategory = 'Hostel' | 'Apartment' | 'Shared' | 'Studio' | 'House' | 'Homestel';
export type PropertyType = 'hostel' | 'apartment' | 'house';
export type PropertyStatus = 'available' | 'booked' | 'maintenance' | 'unavailable';

export interface Story {
  type: 'image' | 'video';
  url: string;
  caption?: string;
  duration: number;
}

export interface RoomType {
  id: string;
  name: string;
  description?: string;
  capacity: number;
  price: number;
  unit?: string;
}

export interface PropertyOwner {
  name: string;
  email: string;
  phone: string;
  responseRate: string;
  verified: boolean;
}

export interface Location {
  address: string;
  city: string;
  state: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface Property extends BaseEntity {
  // Core identification
  name: string;
  title: string;
  description: string;
  
  // Property classification
  type: PropertyType;
  property_type?: PropertyType;
  property_category?: PropertyCategory;
  propertyCategory?: PropertyCategory;
  status: PropertyStatus;
  
  // Location information
  location: Location | string;
  address: string;
  city: string;
  state: string;
  zip?: string;
  country?: string;
  
  // Ownership and management
  owner_id: string;
  university_id?: string;
  owner?: PropertyOwner;
  
  // Pricing
  price: number;
  rent?: number;
  priceUnit?: string;
  price_unit?: string;
  
  // Property specifications
  bedrooms: number;
  bathrooms: number;
  size?: number;
  max_occupants?: number;
  
  // Availability
  available_from: string;
  available_to?: string;
  is_available?: boolean;
  
  // Furnishing and features
  is_furnished?: boolean;
  has_bedframes?: boolean;
  has_mattresses?: boolean;
  has_wardrobes?: boolean;
  has_fan?: boolean;
  has_tiled_room?: boolean;
  has_individual_meters?: boolean;
  
  // Facilities
  washroom_type?: string;
  meter_type?: string;
  parking_available?: boolean;
  parking_cost?: number;
  
  // Room management
  total_rooms?: number;
  rooms_available?: number;
  beds_per_room?: number;
  beds_available?: number;
  availableUnits?: number;
  
  // Policies and restrictions
  gender_restriction?: string;
  genderType?: string;
  gender_type?: string;
  pet_policy?: string;
  cancellation_policy?: string;
  
  // Verification and status
  verification_status?: string;
  verified?: boolean;
  
  // Media and content
  amenities: (Amenity | string)[];
  images: string[];
  virtual_tour_url?: string;
  
  // Reviews and ratings
  rating?: number;
  review_count?: number;
  reviewCount?: number;
  
  // Rules and policies
  rules?: string[];
  house_rules?: string[];
  features?: string[];
  
  // Location context
  distanceToCampus?: string;
  distance_to_campus?: string;
  
  // Enhanced features
  stories?: Story[];
  roomTypes?: RoomType[];
  
  // Business settings
  advance_payment_months?: number;
  allow_bill_sharing?: boolean;
  all_inclusive?: boolean;
  utilities?: string;
  landmark?: string;
  
  // Security and accessibility
  has_accessibility_features?: boolean;
  security_features?: string[];
  internet_speed?: string;
  
  // Subscription and management
  subscription_status?: string;
  subscription_expires_at?: string;
  
  // Emergency contacts
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  
  // Additional facility details
  shared_washroom_count?: number;
  shared_meter_count?: number;
  
  // Semester availability
  semester_availability?: string[];
}

export interface PropertyFormValues {
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  property_type: string;
  property_category: PropertyCategory;
  rent: number;
  bedrooms: number;
  bathrooms: number;
  size?: number;
  available_from: string;
  available_to?: string;
  is_furnished: boolean;
  amenities: string[];
  images: string[];
  gender_restriction?: string;
  parking_available: boolean;
  total_rooms?: number;
  rooms_available?: number;
  beds_per_room?: number;
  max_occupants?: number;
  has_bedframes: boolean;
  has_mattresses: boolean;
  has_wardrobes: boolean;
  has_fan: boolean;
  has_tiled_room: boolean;
  has_individual_meters: boolean;
  washroom_type?: string;
  meter_type?: string;
}

export interface PropertyInsert extends Omit<PropertyFormValues, 'images'> {
  owner_id: string;
  images?: string[];
}
