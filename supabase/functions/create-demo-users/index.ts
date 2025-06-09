import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Create demo users
    const demoUsers = [
      {
        email: 'student@roomi.com',
        password: 'password123',
        role: 'student',
        full_name: 'Demo Student'
      },
      {
        email: 'owner@roomi.com',
        password: 'password123',
        role: 'owner',
        full_name: 'Demo Owner'
      },
      {
        email: 'admin@roomi.com',
        password: 'password123',
        role: 'admin',
        full_name: 'Demo Admin'
      }
    ]

    for (const user of demoUsers) {
      // Create auth user
      const { data: authData, error: authError } = await supabaseClient.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true
      })

      if (authError) {
        if (authError.message.includes('already registered')) {
          continue
        }
        throw authError
      }

      // Create profile
      const { error: profileError } = await supabaseClient
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          is_verified: true
        })

      if (profileError) {
        throw profileError
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
