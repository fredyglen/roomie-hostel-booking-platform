
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
