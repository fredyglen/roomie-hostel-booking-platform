
import { createClient } from '@supabase/supabase-js';
import { supabase as supabaseClient } from '@/integrations/supabase/client';
import { Property, PropertyFormValues, PropertyInsert } from '@/types/property';

// Export the supabase client from the Lovable-generated integration
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

// Re-export the Property type from our consolidated definition
export type { Property, PropertyFormValues, PropertyInsert } from '@/types/property';
