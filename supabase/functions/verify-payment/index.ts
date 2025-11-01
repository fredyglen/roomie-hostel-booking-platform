import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { ErrorHandler } from '../_shared/ErrorHandler.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY') ?? ''

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ status: false, message: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      global: { headers: { Authorization: authHeader } }
    })
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return new Response(JSON.stringify({ status: false, message: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    let reference: string | null = null

    if (req.method === 'GET') {
      const url = new URL(req.url)
      reference = url.searchParams.get('reference')
    } else if (req.method === 'POST') {
      const body = await req.json()
      reference = body.reference
    }
    
    if (!reference || typeof reference !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(reference)) {
      return new Response(JSON.stringify({
        status: false,
        message: 'Valid reference is required'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Authorize: Ensure the authenticated user is associated with this transaction reference
    const { count, error: authzError } = await supabase
      .from('transactions')
      .select('id', { count: 'exact' })
      .eq('reference', reference)
      .eq('customer_id', user.id) // Check if the transaction belongs to the authenticated user
    
    if (authzError) {
      ErrorHandler.log('Error during transaction authorization check:', authzError);
      return new Response(JSON.stringify({ status: false, message: 'Authorization check failed' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (count === 0) {
      // Transaction not found for this user, or user is not authorized
      return new Response(JSON.stringify({ status: false, message: 'Transaction not found or unauthorized' }), {
        status: 403, // Use 403 Forbidden as the user is authenticated but not authorized for this resource
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    ErrorHandler.log(`Verifying payment reference: ${reference}`)

    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json'
      }
    })

    const paystackResult = await paystackResponse.json()

    if (!paystackResult.status) {
      ErrorHandler.log('Paystack verification failed', paystackResult)
      throw new Error(paystackResult.message || 'Payment verification failed')
    }

    ErrorHandler.log('Paystack verification successful', paystackResult)

    const { error: updateError } = await supabase
      .from('transactions')
      .update({
        status: paystackResult.data.status,
        paystack_response: paystackResult.data,
        gateway_response: paystackResult.data.gateway_response,
        updated_at: new Date().toISOString()
      })
      .eq('reference', reference)

    if (updateError) {
      ErrorHandler.log('Error updating transaction', updateError)
    }

    if (paystackResult.data.status === 'success' && paystackResult.data.metadata?.booking_id) {
      const { error: bookingError } = await supabase
        .from('bookings_enhanced')
        .update({
          payment_status: 'paid',
          status: 'confirmed',
          transaction_reference: reference,
          paystack_reference: paystackResult.data.id?.toString(),
          payment_method: paystackResult.data.channel,
          updated_at: new Date().toISOString()
        })
        .eq('id', paystackResult.data.metadata.booking_id)

      if (bookingError) {
        ErrorHandler.log('Error updating booking', bookingError)
      } else {
        ErrorHandler.log(`Booking updated successfully: ${paystackResult.data.metadata.booking_id}`)
      }
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
    ErrorHandler.log('Payment verification error', error)
    return new Response(JSON.stringify({
      status: false,
      message: error.message || 'Payment verification failed'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
