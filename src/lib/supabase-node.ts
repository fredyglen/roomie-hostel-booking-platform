/**
 * Node.js Compatible Supabase Client
 * Apple-Grade Database Client for Migration Scripts
 * 
 * Purpose: Provide Supabase client that works in Node.js environment for migration scripts
 * Compliance: BE CONSCIOUS zero tolerance for configuration errors
 * Architecture: Environment-aware client configuration
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// ============================================================================
// ENVIRONMENT CONFIGURATION
// ============================================================================

/**
 * Get Supabase configuration from environment variables
 * Supports both Vite (VITE_*) and Node.js (SUPABASE_*) environment variables
 */
function getSupabaseConfig(): {
  url: string;
  anonKey: string;
} {
  // Try Vite environment variables first (for consistency with frontend)
  let url = process.env.VITE_SUPABASE_URL;
  let anonKey = process.env.VITE_SUPABASE_ANON_KEY;

  // Fallback to Node.js environment variables
  if (!url) {
    url = process.env.SUPABASE_URL;
  }
  if (!anonKey) {
    anonKey = process.env.SUPABASE_ANON_KEY;
  }

  // Validate configuration
  if (!url) {
    throw new Error(
      'Supabase URL not found. Please set VITE_SUPABASE_URL or SUPABASE_URL environment variable.'
    );
  }

  if (!anonKey) {
    throw new Error(
      'Supabase Anon Key not found. Please set VITE_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY environment variable.'
    );
  }

  return { url, anonKey };
}

// ============================================================================
// SUPABASE CLIENT CREATION
// ============================================================================

/**
 * Create Supabase client for Node.js environment
 */
function createNodeSupabaseClient() {
  const { url, anonKey } = getSupabaseConfig();

  return createClient<Database>(url, anonKey, {
    auth: {
      persistSession: false, // Don't persist sessions in Node.js
      autoRefreshToken: false, // Don't auto-refresh in scripts
      storage: undefined // No storage in Node.js environment
    },
    global: {
      headers: {
        'User-Agent': 'ROOMi-Migration-Script/1.0'
      }
    }
  });
}

// ============================================================================
// EXPORT CLIENT
// ============================================================================

export const supabase = createNodeSupabaseClient();

// Export types for convenience
export type { Database } from '@/integrations/supabase/types';

// Export configuration function for testing
export { getSupabaseConfig };
