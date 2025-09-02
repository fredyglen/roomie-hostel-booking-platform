// Re-export the supabase client from the correct location
// This file exists to maintain compatibility with any cached imports
export { supabase } from '@/integrations/supabase/client';
export type { Database } from '@/integrations/supabase/types';
