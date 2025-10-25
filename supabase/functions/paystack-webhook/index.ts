/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
const ErrorHandler = { log: (...args: unknown[]) => console.log(...args) }

interface MinimalSupabaseClient {
  from(tableName: string): any; // Simplified for common usage in this file
}

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
    metadata?: Record<string, unknown>
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
    const supabase: MinimalSupabaseClient = createClient(supabaseUrl, supabaseServiceKey)

    ErrorHandler.log(`Processing webhook event: ${event.event} for reference: ${event.data.reference}`)

    // Store webhook event
    await supabase.from('payment_webhooks').insert({
      event_type: event.event,
      paystack_event_id: event.data.id?.toString(),
      reference: event.data.reference,
      status: 'received',
      payload: event,
      processed: false
    })

    // Also write an audit snapshot including commission metadata (if provided)
    try {
      const meta = (event.data?.metadata ?? {}) as Record<string, unknown>
      const commission = (meta as any)?.commission_breakdown ?? null
      const rates = (meta as any)?.rates_snapshot ?? null
      const version = (meta as any)?.commission_version ?? null

      await supabase.from('payment_audit_log').insert({
        booking_id: (meta as any)?.booking_id ?? null,
        payment_reference: event.data.reference,
        event_type: event.event,
        commission_snapshot: commission,
        rates_snapshot: rates,
        metadata_valid: Boolean(commission && version),
        discrepancy_notes: commission && version ? null : 'Missing commission snapshot or version in metadata',
        paystack_response: event,
      })
    } catch (auditErr) {
      console.error('payment_audit_log insert failed', auditErr)
    }

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
        ErrorHandler.log(`Unhandled event type: ${event.event}`)
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

async function handleChargeSuccess(supabase: MinimalSupabaseClient, event: PaystackWebhookEvent) {
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

  ErrorHandler.log(`Successfully processed charge.success for: ${eventData.reference}`)
}

async function handlePaymentRequestSuccess(supabase: MinimalSupabaseClient, event: PaystackWebhookEvent) {
  // Similar to charge.success but for payment requests
  await handleChargeSuccess(supabase, event)
}

async function handleRefundProcessed(supabase: MinimalSupabaseClient, event: PaystackWebhookEvent) {
  const { data: eventData } = event
  
  // Update transaction status to refunded
  await supabase
    .from('transactions')
    .update({
      status: 'refunded',
      updated_at: new Date().toISOString()
    })
    .eq('reference', eventData.reference)

  ErrorHandler.log(`Successfully processed refund for: ${eventData.reference}`)
}

async function handleSplitPayment(supabase: MinimalSupabaseClient, eventData: Record<string, unknown>) {
  try {
    // Safely access properties with type guards
    const reference = typeof eventData.reference === 'string' ? eventData.reference : null;

    if (!reference) {
      ErrorHandler.log('handleSplitPayment received event without reference', JSON.stringify(eventData));
      return;
    }

    const { data: transaction } = await supabase
      .from('transactions')
      .select('*')
      .eq('reference', reference)
      .single();

    if (transaction && typeof eventData.shares === 'string') { // Assuming shares is a JSON string
      try {
        const shares = JSON.parse(eventData.shares);
        if (Array.isArray(shares)) {
          // Process split payments
          for (const share of shares) {
            // Assuming share is an object with amount and split_code
            if (typeof share.split_code === 'string' && typeof share.amount === 'number') {
              if (share.split_code === 'SPL_xxxxxx') { // Replace with actual split code config
                // Handle platform revenue share
                const platformAmount = share.amount;
                // Record platform revenue
              } else if (share.split_code === 'SPL_yyyyyy') { // Replace with actual split code config
                // Handle agent commission share
                const agentAmount = share.amount;
                // Record agent commission
              }
              // Handle owner share (main recipient)
            }
          }
        }
      } catch (parseError) {
        ErrorHandler.log('Failed to parse shares JSON', parseError);
      }
    } else if (transaction && Array.isArray(eventData.shares)) { // If shares is directly an array
       // Process split payments (similar logic as above)
       for (const share of eventData.shares) {
          if (typeof share.split_code === 'string' && typeof share.amount === 'number') {
            if (share.split_code === 'SPL_xxxxxx') { // Replace with actual split code config
              // Handle platform revenue share
              const platformAmount = share.amount;
              // Record platform revenue
            } else if (share.split_code === 'SPL_yyyyyy') { // Replace with actual split code config
              // Handle agent commission share
              const agentAmount = share.amount;
              // Record agent commission
            }
            // Handle owner share (main recipient)
          }
        }
    }

  } catch (error) {
    ErrorHandler.log('Error in handleSplitPayment:', error);
  }
}
