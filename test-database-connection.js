// Quick database connection test
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ymqnbekeqarjmxftzvks.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltcW5iZWtlcWFyam14ZnR6dmtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MDQzOTgsImV4cCI6MjA2MzI4MDM5OH0.X9FeOLvG4zDQkFyHP7evIXXzAiWnw5UbfwFv1E9UEVY';

console.log('🔧 Supabase URL:', supabaseUrl);
console.log('🔧 Supabase Key (first 20 chars):', supabaseKey.substring(0, 20) + '...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔍 Testing database connection...');
  
  try {
    // Test 1: Basic connection
    console.log('🔍 Testing basic table access...');
    const { data: healthCheck, error: healthError } = await supabase
      .from('properties')
      .select('count(*)', { count: 'exact', head: true });

    if (healthError) {
      console.error('❌ Database connection failed:');
      console.error('Error message:', healthError.message);
      console.error('Error details:', healthError.details);
      console.error('Error hint:', healthError.hint);
      console.error('Error code:', healthError.code);
      return;
    }
    
    console.log('✅ Database connection successful');
    
    // Test 2: Check properties table
    const { data: properties, error: propError } = await supabase
      .from('properties')
      .select('id, title, owner_id, is_available')
      .limit(5);
    
    if (propError) {
      console.error('❌ Properties query failed:', propError);
      return;
    }
    
    console.log(`📊 Properties in database: ${properties?.length || 0}`);
    if (properties && properties.length > 0) {
      console.log('Sample properties:', properties);
    } else {
      console.log('⚠️  No properties found in database');
    }
    
    // Test 3: Check profiles table
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, role, first_name, last_name')
      .limit(5);
    
    if (profileError) {
      console.error('❌ Profiles query failed:', profileError);
      return;
    }
    
    console.log(`👥 Users in database: ${profiles?.length || 0}`);
    if (profiles && profiles.length > 0) {
      console.log('Sample users:', profiles);
    } else {
      console.log('⚠️  No users found in database');
    }
    
    // Test 4: Check auth status
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('🔐 No authenticated user (expected for test script)');
    } else if (user) {
      console.log('🔐 Authenticated user found:', user.email);
    } else {
      console.log('🔐 No authenticated user');
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

testConnection();
