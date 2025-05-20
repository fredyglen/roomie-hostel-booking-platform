
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.14.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") as string;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { 'Content-Type': 'application/json' },
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

    // Create demo users
    const results = [];
    for (const user of demoUsers) {
      // Check if user already exists
      const { data: existingUsers, error: queryError } = await supabase.auth.admin
        .listUsers({ 
          filter: { 
            email: user.email 
          }
        });
      
      const existingUser = existingUsers?.users?.length > 0 ? existingUsers.users[0] : null;
      
      if (existingUser) {
        console.log(`User ${user.email} already exists with ID ${existingUser.id}`);
        
        // Update the profile to ensure correct role
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({ 
            id: existingUser.id,
            email: user.email,
            role: user.role,
            first_name: user.first_name,
            last_name: user.last_name,
            phone: user.phone
          });
          
        results.push({
          email: user.email,
          status: 'Already exists, profile updated',
          error: profileError ? profileError.message : null
        });
        continue;
      }

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
        results.push({
          email: user.email,
          status: 'Failed',
          error: authError.message,
        });
        continue;
      }

      // Update the profile with correct role
      if (authData.user) {
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
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Demo users processed',
      results
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to create demo users',
      error: error.message,
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
