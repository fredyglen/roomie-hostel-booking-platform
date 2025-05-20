
import { createClient } from '@supabase/supabase-js';
import { supabase as supabaseClient } from '@/integrations/supabase/client';

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
  status?: string; // Frontend display property
  occupancy?: string; // Frontend display property
  distance_to_campus?: string;
  house_rules?: string[];
  image_url?: string;
  
  // Database properties
  owner_id: string;
  property_type?: string; // Database property
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
}

export type PropertyFormValues = {
  title: string;
  type: string;
  address: string;
  price: number;
  price_unit: string;
  description: string;
  distance_to_campus?: string;
  amenities?: string;
  house_rules?: string;
  status: string;
  occupancy?: string;
  image_url?: string;
};

export type PropertyInsert = {
  title: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  property_type: string;
  rent: number;
  bedrooms: number;
  bathrooms: number;
  size?: number;
  available_from: string;
  available_to?: string;
  is_furnished?: boolean;
  is_available?: boolean;
  description: string;
  owner_id: string;
  amenities?: string[];
  images?: string[];
};
