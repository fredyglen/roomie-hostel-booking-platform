
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY')!

interface PaystackWebhookEvent {
  event: string
  data: {
    id: number
    reference: string
    amount: number
    status: string
    currency: string
    customer: {
      email: string
      id?: number
    }
    authorization?: {
      authorization_code: string
      card_type: string
      last4: string
      exp_month: string
      exp_year: string
      bin: string
      bank: string
    }
    split?: {
      id: number
      name: string
      split_code: string
      shares: {
        integration: number
        subaccounts: Array<{
          amount: number
          subaccount_code: string
          id: number
        }>
      }
    }
    metadata?: any
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const signature = req.headers.get('x-paystack-signature')
    if (!signature) {
      return new Response('No signature provided', { status: 400 })
    }

    const body = await req.text()
    
    // Verify webhook signature
    const hash = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(paystackSecretKey),
      { name: 'HMAC', hash: 'SHA-512' },
      false,
      ['sign']
    )
    
    const computedSignature = await crypto.subtle.sign(
      'HMAC',
      hash,
      new TextEncoder().encode(body)
    )
    
    const computedHex = Array.from(new Uint8Array(computedSignature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    if (computedHex !== signature) {
      console.error('Invalid signature')
      return new Response('Invalid signature', { status: 400 })
    }

    const event: PaystackWebhookEvent = JSON.parse(body)
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('Processing webhook event:', event.event, 'for reference:', event.data.reference)

    // Store webhook event
    await supabase.from('payment_webhooks').insert({
      event_type: event.event,
      paystack_event_id: event.data.id?.toString(),
      reference: event.data.reference,
      status: 'received',
      payload: event,
      processed: false
    })

    // Process different event types
    switch (event.event) {
      case 'charge.success':
        await handleChargeSuccess(supabase, event)
        break
      
      case 'paymentrequest.success':
        await handlePaymentRequestSuccess(supabase, event)
        break
      
      case 'refund.processed':
        await handleRefundProcessed(supabase, event)
        break
      
      default:
        console.log('Unhandled event type:', event.event)
    }

    // Mark webhook as processed
    await supabase
      .from('payment_webhooks')
      .update({ processed: true, status: 'processed' })
      .eq('reference', event.data.reference)
      .eq('event_type', event.event)

    return new Response('OK', { 
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Webhook processing error:', error)
    return new Response('Internal server error', { 
      status: 500,
      headers: corsHeaders
    })
  }
})

async function handleChargeSuccess(supabase: any, event: PaystackWebhookEvent) {
  const { data: eventData } = event
  
  // Update transaction status
  const { error: transactionError } = await supabase
    .from('transactions')
    .update({
      status: 'success',
      paystack_reference: eventData.id.toString(),
      paystack_response: eventData,
      webhook_verified: true,
      updated_at: new Date().toISOString()
    })
    .eq('reference', eventData.reference)

  if (transactionError) {
    console.error('Error updating transaction:', transactionError)
    return
  }

  // Get transaction to find associated booking
  const { data: transaction } = await supabase
    .from('transactions')
    .select('metadata')
    .eq('reference', eventData.reference)
    .single()

  if (transaction?.metadata?.booking_id) {
    // Update booking status
    await supabase
      .from('bookings_enhanced')
      .update({
        payment_status: 'paid',
        status: 'confirmed',
        transaction_reference: eventData.reference,
        paystack_reference: eventData.id.toString(),
        payment_method: eventData.authorization?.card_type || 'unknown',
        updated_at: new Date().toISOString()
      })
      .eq('id', transaction.metadata.booking_id)
  }

  // Handle split payments if present
  if (eventData.split) {
    await handleSplitPayment(supabase, eventData)
  }

  console.log('Successfully processed charge.success for:', eventData.reference)
}

async function handlePaymentRequestSuccess(supabase: any, event: PaystackWebhookEvent) {
  // Similar to charge.success but for payment requests
  await handleChargeSuccess(supabase, event)
}

async function handleRefundProcessed(supabase: any, event: PaystackWebhookEvent) {
  const { data: eventData } = event
  
  // Update transaction status to refunded
  await supabase
    .from('transactions')
    .update({
      status: 'refunded',
      updated_at: new Date().toISOString()
    })
    .eq('reference', eventData.reference)

  console.log('Successfully processed refund for:', eventData.reference)
}

async function handleSplitPayment(supabase: any, eventData: any) {
  const { data: transaction } = await supabase
    .from('transactions')
    .select('id, metadata')
    .eq('reference', eventData.reference)
    .single()

  if (!transaction || !eventData.split) return

  // Record split payment details
  for (const subaccount of eventData.split.shares.subaccounts) {
    await supabase.from('split_payments').insert({
      transaction_id: transaction.id,
      split_code: eventData.split.split_code,
      platform_amount: eventData.split.shares.integration,
      owner_amount: subaccount.amount,
      owner_id: transaction.metadata?.owner_id,
      split_type: 'percentage',
      status: 'completed'
    })
  }
}
