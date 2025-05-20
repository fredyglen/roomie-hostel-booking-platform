
import { createClient } from '@supabase/supabase-js';
import { supabase as supabaseClient } from '@/integrations/supabase/client';
import { PropertyCategory, PropertyFormValues, PropertyInsert, Story } from '@/types/property';

// Export the supabase client 
export const supabase = supabaseClient;

export type AuthUser = {
  id: string;
  email: string;
  role: 'owner' | 'student' | 'admin';
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  createdAt?: string;
};

// This interface is for frontend display purposes
export interface Property {
  id: string;
  title: string;
  address: string;
  description: string;
  type?: string; // Frontend display property
  price?: number; // Frontend display property
  price_unit?: string; // Frontend display property
  priceUnit?: string; // Frontend display property
  status?: string; // Frontend display property
  occupancy?: string; // Frontend display property
  distance_to_campus?: string;
  distanceToCampus?: string; // Frontend display property
  house_rules?: string[];
  image_url?: string;
  
  // Database properties
  owner_id: string;
  property_type?: string; // Database property
  property_category?: PropertyCategory; // Database property
  propertyCategory?: PropertyCategory; // Frontend display property
  rent?: number; // Database property
  city: string;
  state: string;
  zip: string;
  bedrooms: number;
  bathrooms: number;
  size?: number;
  available_from: string;
  available_to?: string;
  is_furnished?: boolean;
  is_available?: boolean;
  created_at: string;
  updated_at: string;
  images?: string[];
  amenities?: string[];
  all_inclusive?: boolean; // Database property
  allInclusive?: boolean; // Frontend display property
  utilities?: string[];
  location?: string;
  landmark?: string;
  
  // Room management properties
  total_rooms?: number;
  rooms_available?: number;
  beds_per_room?: number;
  beds_available?: number;
  max_occupants?: number;
  
  // Facility features
  has_bedframes?: boolean;
  has_mattresses?: boolean;
  has_wardrobes?: boolean;
  has_individual_meters?: boolean;
  
  // Payment and occupancy details
  advance_payment_months?: number;
  allow_bill_sharing?: boolean;
  
  // UI properties - these aren't in the database but are added in frontend
  rating?: number;
  reviewCount?: number;
  verified?: boolean;
  
  // Story related properties
  stories?: Story[];
  
  // Gender type property - from database (gender_type)
  gender_type?: string;
  genderType?: 'Girls' | 'Boys' | 'Mixed';
  
  // Owner information - added in frontend
  owner?: {
    name: string;
    phone: string;
    responseRate: string;
    verified: boolean;
  };
  
  // UI properties
  availableUnits?: number;
}

export type { PropertyFormValues, PropertyInsert } from '@/types/property';
