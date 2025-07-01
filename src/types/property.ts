
import { User, UserRole } from './core';
import { Database } from '@/integrations/supabase/types';

// Database property type from Supabase
export type DatabaseProperty = Database['public']['Tables']['properties']['Row'];
export type DatabasePropertyInsert = Database['public']['Tables']['properties']['Insert'];
export type DatabasePropertyUpdate = Database['public']['Tables']['properties']['Update'];

// Main Property interface that exactly matches database structure
export interface Property {
  id: string;
  title: string;
  description: string;
  property_type: string;
  property_category: string | null;
  address: string;
  city: string;
  state: string;
  zip: string; // Added to match database
  rent: number;
  currency: string | null;
  bedrooms: number;
  bathrooms: number;
  max_occupants: number | null;
  is_available: boolean | null;
  is_furnished: boolean | null;
  amenities: string[] | null;
  images: string[] | null;
  owner_id: string;
  owner?: User;
  available_from: string;
  available_to: string | null;
  created_at: string;
  updated_at: string;
  verification_status: string | null; // Made non-optional to match database
  // Additional database fields - all exactly matching database schema
  advance_payment_months: number | null;
  allow_bill_sharing: boolean | null;
  base_price_per_semester: number | null; // Added to match database
  beds_available: number | null;
  beds_per_room: number | null;
  cancellation_policy: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  gender_restriction: string | null;
  has_accessibility_features: boolean | null;
  has_bedframes: boolean | null;
  has_fan: boolean | null;
  has_individual_meters: boolean | null;
  has_mattresses: boolean | null;
  has_tiled_room: boolean | null;
  has_wardrobes: boolean | null;
  internet_speed: string | null;
  meter_type: string | null;
  parking_available: boolean | null;
  parking_cost: number | null;
  pet_policy: string | null;
  rooms_available: number | null;
  security_features: string[] | null;
  semester_availability: string[] | null;
  shared_meter_count: number | null;
  shared_washroom_count: number | null;
  size: number | null;
  subscription_expires_at: string | null;
  subscription_status: string | null;
  total_rooms: number | null; // Added to match database
  virtual_tour_url: string | null; // Added to match database
  washroom_type: string | null; // Added to match database
}

// Legacy types for backward compatibility
export type PropertyType = 'hostel' | 'homestel' | 'apartment' | 'shared_room';
export type PropertyStatus = 'active' | 'inactive' | 'pending' | 'rejected';
export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface VerificationDetails {
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  notes?: string;
}

// Simplified Address interface for backward compatibility
export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
}

// Simplified PropertyPrice interface for backward compatibility
export interface PropertyPrice {
  amount: number;
  currency: string;
  period: 'day' | 'week' | 'month' | 'semester' | 'year';
  isNegotiable: boolean;
  discounts?: Discount[];
}

export interface Discount {
  type: 'percentage' | 'fixed';
  value: number;
  description: string;
}

// Simplified PropertyFeatures interface for backward compatibility
export interface PropertyFeatures {
  bedrooms: number;
  bathrooms: number;
  kitchens: number;
  parkingSpaces: number;
  furnished: boolean;
  petsAllowed: boolean;
  utilities: Utilities;
  amenities: string[];
  rules: string[];
}

export interface Utilities {
  water: boolean;
  electricity: boolean;
  internet: boolean;
  gas: boolean;
  cleaning: boolean;
  security: boolean;
}

export interface PropertyMedia {
  id: string;
  url: string;
  type: 'image' | 'video';
  isCover: boolean;
  caption?: string;
}

export interface Building {
  id: string;
  name: string;
  floors: Floor[];
}

export interface Floor {
  id: string;
  name: string;
  rooms: Room[];
}

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  capacity: number;
  price: number;
  isAvailable: boolean;
  features?: string[];
}

export type RoomType = 'single' | 'double' | 'triple' | 'quad' | 'suite';

// Property form values - updated to match database structure
export interface PropertyFormValues {
  title: string;
  description: string;
  property_type: string;
  property_category?: string;
  address: string;
  city: string;
  state: string;
  zip?: string; // Added to match database
  rent: number;
  currency?: string;
  bedrooms: number;
  bathrooms: number;
  max_occupants?: number;
  is_furnished?: boolean;
  amenities?: string[];
  images?: string[];
  available_from: string; // Made required to match database
  available_to?: string;
  gender_restriction?: string;
  parking_available?: boolean;
  has_accessibility_features?: boolean;
  pet_policy?: string;
  cancellation_policy?: string;
  internet_speed?: string;
  virtual_tour_url?: string;
  // Additional form fields that might be needed
  base_price_per_semester?: number;
  advance_payment_months?: number;
  allow_bill_sharing?: boolean;
  beds_available?: number;
  beds_per_room?: number;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  has_bedframes?: boolean;
  has_fan?: boolean;
  has_individual_meters?: boolean;
  has_mattresses?: boolean;
  has_tiled_room?: boolean;
  has_wardrobes?: boolean;
  meter_type?: string;
  parking_cost?: number;
  rooms_available?: number;
  security_features?: string[];
  semester_availability?: string[];
  shared_meter_count?: number;
  shared_washroom_count?: number;
  size?: number;
  total_rooms?: number;
  washroom_type?: string;
}

// Property insert type (for database operations) - matches database structure
export type PropertyInsert = DatabasePropertyInsert;

// Ghana-specific hostel types for semester-based pricing - updated to match database
export interface GhanaHostelProperty {
  id: string;
  title: string; // Changed from 'name' to match database
  description: string;
  images: string[];
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates?: { lat: number; lng: number };
  };
  pricePerSemester: number; // Base price for semester (4 months)
  roomOptions: RoomOption[];
  distanceToCampus: number; // in kilometers
  nearestUniversity: string;
  propertyType: 'hostel' | 'shared_room' | 'apartment';
  bedrooms: number;
  bathrooms: number;
  maxOccupants: number;
  amenities: string[];
  rules: string[];
  owner: {
    id: string;
    name: string;
    email: string;
    phone: string;
    responseRate?: string;
    verified?: boolean;
  };
  availableFrom: string;
  availableTo?: string; // Made optional for backward compatibility
  isActive: boolean;
  features?: string[]; // Made optional
  house_rules?: string[]; // Changed to array and made optional
  stories?: string[];
  // Additional fields for compatibility
  estimatedPrice?: number; // For filtering
  genderRestriction?: 'male' | 'female' | 'mixed';
  verificationStatus?: 'pending' | 'verified' | 'rejected';
  createdAt?: string;
  updatedAt?: string;
}

export interface RoomOption {
  type: string; // e.g., '2-in-a-room', '4-in-a-room', '1-in-a-room'
  price: number; // Price per semester for this room type
  available: boolean;
  description?: string;
  maxOccupants?: number;
}
