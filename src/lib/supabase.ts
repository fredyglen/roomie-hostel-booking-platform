import { createClient } from '@supabase/supabase-js';
import { config } from '@/config';
import { supabase as supabaseClient } from '@/integrations/supabase/client';
import { Property, PropertyFormValues, PropertyInsert } from '@/types/property';

// Export the supabase client 
export const supabase = createClient(
  config.supabase.url!,
  config.supabase.anonKey!
);

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
