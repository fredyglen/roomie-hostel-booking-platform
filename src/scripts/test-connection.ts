/**
 * Database Connection Test
 * Simple test to verify Supabase connection works
 */

import { supabase } from '@/lib/supabase-node';

async function testConnection() {
  console.log('🔍 Testing database connection...');
  
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('id')
      .limit(1);

    if (error) {
      console.error('❌ Database connection failed:', error.message);
      return false;
    }

    console.log('✅ Database connection successful!');
    console.log(`📊 Found ${data?.length || 0} properties in database`);
    return true;

  } catch (error) {
    console.error('💥 Connection test error:', error);
    return false;
  }
}

// Run the test
testConnection().then(success => {
  process.exit(success ? 0 : 1);
});
