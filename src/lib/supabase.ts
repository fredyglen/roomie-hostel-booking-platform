
import { createClient } from '@supabase/supabase-js';
import { APP_CONFIG } from '@/config/constants';
import { Database } from '@/types/supabase';

// Create a single supabase client for the entire application
export const supabase = createClient<Database>(
  APP_CONFIG.SUPABASE.URL,
  APP_CONFIG.SUPABASE.ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

// Export types for convenience
export type { Database } from '@/types/supabase';
