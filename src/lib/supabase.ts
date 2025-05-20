
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

// Updated Property type to match database schema
export interface Property {
  id: string;
  title: string;
  address: string;
  description: string;
  owner_id: string;
  property_type: string; // matches DB column
  rent: number; // matches DB column instead of price
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
  // Additional fields used in frontend but not in DB
  type?: string;
  price?: number;
  price_unit?: string;
  status?: string;
  occupancy?: string;
  distance_to_campus?: string;
  house_rules?: string[];
  image_url?: string;
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
