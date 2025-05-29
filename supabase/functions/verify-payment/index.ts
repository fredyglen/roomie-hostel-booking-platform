
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY')!

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'GET') {
    return new Response('Method not allowed', { 
      status: 405,
      headers: corsHeaders
    })
  }

  try {
    const url = new URL(req.url)
    const reference = url.searchParams.get('reference')
    
    if (!reference) {
      return new Response('Reference is required', { 
        status: 400,
        headers: corsHeaders
      })
    }

    // Verify with Paystack
    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json'
      }
    })

    const paystackResult = await paystackResponse.json()

    if (!paystackResult.status) {
      throw new Error(paystackResult.message || 'Payment verification failed')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Update local transaction record
    const { error: updateError } = await supabase
      .from('transactions')
      .update({
        status: paystackResult.data.status,
        paystack_response: paystackResult.data,
        updated_at: new Date().toISOString()
      })
      .eq('reference', reference)

    if (updateError) {
      console.error('Error updating transaction:', updateError)
    }

    return new Response(JSON.stringify({
      status: true,
      message: 'Payment verification successful',
      data: paystackResult.data
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Payment verification error:', error)
    return new Response(JSON.stringify({
      status: false,
      message: error.message || 'Payment verification failed'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
