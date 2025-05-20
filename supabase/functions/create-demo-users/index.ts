
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.14.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") as string;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405,
    });
  }

  try {
    // Define demo users
    const demoUsers = [
      {
        email: "student@roomi.com",
        password: "password123",
        role: "student",
        first_name: "Student",
        last_name: "Demo",
        phone: "+233501234567"
      },
      {
        email: "owner@roomi.com",
        password: "password123",
        role: "owner",
        first_name: "Owner",
        last_name: "Demo",
        phone: "+233501234568"
      },
      {
        email: "admin@roomi.com",
        password: "password123",
        role: "admin",
        first_name: "Admin",
        last_name: "Demo",
        phone: "+233501234569"
      }
    ];

    console.log('Starting to create/update demo users...');

    // Forcefully delete users first to ensure clean slate
    for (const user of demoUsers) {
      try {
        const { data: existingUsers } = await supabase.auth.admin.listUsers({
          filter: { email: user.email }
        });
        
        if (existingUsers?.users?.length > 0) {
          const userId = existingUsers.users[0].id;
          console.log(`Deleting existing user ${user.email} with ID ${userId}`);
          await supabase.auth.admin.deleteUser(userId);
        }
      } catch (error) {
        console.log(`Error checking/deleting existing user ${user.email}:`, error.message);
      }
    }

    // Wait a moment to ensure deletion is processed
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create demo users
    const results = [];
    for (const user of demoUsers) {
      console.log(`Creating user ${user.email}...`);
      
      // Create user with auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
          phone: user.phone
        }
      });

      if (authError) {
        console.error(`Failed to create user ${user.email}:`, authError.message);
        results.push({
          email: user.email,
          status: 'Failed',
          error: authError.message,
        });
        continue;
      }

      // Update the profile with correct role
      if (authData.user) {
        console.log(`User ${user.email} created with ID ${authData.user.id}, updating profile...`);
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({ 
            id: authData.user.id,
            email: user.email,
            role: user.role,
            first_name: user.first_name,
            last_name: user.last_name,
            phone: user.phone
          });

        if (profileError) {
          console.error(`Failed to update profile for ${user.email}:`, profileError.message);
          results.push({
            email: user.email,
            status: 'Created but profile update failed',
            error: profileError.message,
          });
          continue;
        }

        results.push({
          email: user.email,
          status: 'Created',
        });
        console.log(`User ${user.email} created successfully!`);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Demo users processed',
      results
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error processing demo users:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to create demo users',
      error: error.message,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
