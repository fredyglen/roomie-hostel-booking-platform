
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY')!

interface PaymentInitRequest {
  email: string
  amount: number
  currency?: string
  metadata?: any
  callback_url?: string
  channels?: string[]
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405,
      headers: corsHeaders
    })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      global: {
        headers: { Authorization: authHeader }
      }
    })

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }

    const paymentData: PaymentInitRequest = await req.json()
    
    // Generate unique reference with business context
    const reference = `ROOMI_${Date.now()}_${Math.random().toString(36).substring(7)}`
    
    // Set callback URL to our payment success page
    const callbackUrl = paymentData.callback_url || 
      `${supabaseUrl.replace('/supabase', '')}/payment-success`
    
    console.log('Initializing payment:', {
      amount: paymentData.amount,
      email: paymentData.email,
      reference,
      metadata: paymentData.metadata
    })

    // Prepare Paystack payload
    const paystackPayload = {
      email: paymentData.email,
      amount: Math.round(paymentData.amount * 100), // Convert to pesewas
      currency: paymentData.currency || 'GHS',
      reference,
      callback_url: callbackUrl,
      metadata: {
        ...paymentData.metadata,
        user_id: user.id,
        reference,
        platform: 'roomi',
        payment_type: 'booking'
      },
      channels: paymentData.channels || ['card', 'mobile_money', 'bank']
    }

    // Initialize transaction with Paystack
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paystackPayload)
    })

    const paystackResult = await paystackResponse.json()

    if (!paystackResult.status) {
      console.error('Paystack initialization failed:', paystackResult)
      throw new Error(paystackResult.message || 'Payment initialization failed')
    }

    console.log('Paystack initialization successful:', paystackResult.data.reference)

    // Store transaction in database
    const { error: dbError } = await supabase.from('transactions').insert({
      reference,
      amount: paymentData.amount,
      currency: paymentData.currency || 'GHS',
      status: 'pending',
      customer_email: paymentData.email,
      customer_id: user.id,
      metadata: paymentData.metadata,
      paystack_reference: paystackResult.data.access_code,
      created_at: new Date().toISOString()
    })

    if (dbError) {
      console.error('Database error:', dbError)
      throw new Error('Failed to store transaction')
    }

    return new Response(JSON.stringify({
      status: true,
      message: 'Payment initialized successfully',
      data: {
        reference,
        access_code: paystackResult.data.access_code,
        authorization_url: paystackResult.data.authorization_url
      }
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Payment initialization error:', error)
    return new Response(JSON.stringify({
      status: false,
      message: error.message || 'Payment initialization failed'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
