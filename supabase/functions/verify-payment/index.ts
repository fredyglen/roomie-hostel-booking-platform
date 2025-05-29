
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY')!

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    let reference: string | null = null

    if (req.method === 'GET') {
      const url = new URL(req.url)
      reference = url.searchParams.get('reference')
    } else if (req.method === 'POST') {
      const body = await req.json()
      reference = body.reference
    }
    
    if (!reference) {
      return new Response(JSON.stringify({
        status: false,
        message: 'Reference is required'
      }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log('Verifying payment reference:', reference)

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
      console.error('Paystack verification failed:', paystackResult)
      throw new Error(paystackResult.message || 'Payment verification failed')
    }

    console.log('Paystack verification successful:', {
      reference: paystackResult.data.reference,
      status: paystackResult.data.status,
      amount: paystackResult.data.amount
    })

    // Update local transaction record
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
      console.error('Error updating transaction:', updateError)
    }

    // If payment was successful, update any related booking
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
        console.error('Error updating booking:', bookingError)
      } else {
        console.log('Booking updated successfully:', paystackResult.data.metadata.booking_id)
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
