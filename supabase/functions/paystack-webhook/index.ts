// paystack-webhook — hardened 2026-08-29
// Auth: Paystack HMAC-SHA512 signature over the raw body (constant-time compare).
// verify_jwt is DISABLED for this function — Paystack cannot send a Supabase JWT;
// the signature is the authentication.
// Idempotent: each (paystack_event_id, event_type) is processed at most once,
// enforced by unique index uq_payment_webhooks_event.
// Trust: booking financials come from the server-stored transaction row and a
// server-side recomputation — never from client-authored metadata.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { ServerCommissionEngine } from '../_shared/commission-engine.ts'

const log = (msg: string, extra?: unknown) =>
  console.log(`[paystack-webhook] ${msg}`, extra === undefined ? '' : JSON.stringify(extra))

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY')!

  try {
    const signature = req.headers.get('x-paystack-signature')
    if (!signature) return new Response('No signature provided', { status: 400 })

    const body = await req.text()
    const key = await crypto.subtle.importKey(
      'raw', new TextEncoder().encode(paystackSecretKey),
      { name: 'HMAC', hash: 'SHA-512' }, false, ['sign'],
    )
    const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body))
    const computedHex = Array.from(new Uint8Array(mac)).map(b => b.toString(16).padStart(2, '0')).join('')
    if (!timingSafeEqualHex(computedHex, signature.toLowerCase())) {
      console.error('[paystack-webhook] invalid signature')
      return new Response('Invalid signature', { status: 400 })
    }

    const event = JSON.parse(body)
    const supabase = createClient(supabaseUrl, serviceKey)
    const eventId = event.data?.id?.toString() ?? null
    const reference = event.data?.reference ?? null
    log(`event ${event.event} ref=${reference} id=${eventId}`)

    // ---- Idempotency gate: first delivery wins ----
    const { error: insErr } = await supabase.from('payment_webhooks').insert({
      event_type: event.event,
      paystack_event_id: eventId,
      reference,
      status: 'received',
      payload: event,
      processed: false,
    })
    if (insErr) {
      if (insErr.code === '23505') {
        log('duplicate delivery — already processed, skipping', { eventId, event: event.event })
        return new Response('OK (duplicate)', { status: 200, headers: corsHeaders })
      }
      // Could not persist the event; ask Paystack to retry later.
      console.error('[paystack-webhook] failed to persist event', insErr)
      return new Response('Storage error', { status: 500 })
    }

    try {
      switch (event.event) {
        case 'charge.success':
          await handleChargeSuccess(supabase, event)
          break
        case 'refund.processed':
          await handleRefundProcessed(supabase, event)
          break
        default:
          log(`unhandled event type: ${event.event}`)
      }
      await supabase.from('payment_webhooks')
        .update({ processed: true, status: 'processed' })
        .eq('paystack_event_id', eventId).eq('event_type', event.event)
    } catch (procErr) {
      // Payload is safely stored; do NOT return 5xx (retry storm into work we
      // may have half-done). Mark for manual/automated reprocessing instead.
      console.error('[paystack-webhook] processing error', procErr)
      await supabase.from('payment_webhooks')
        .update({ status: 'error' })
        .eq('paystack_event_id', eventId).eq('event_type', event.event)
    }

    return new Response('OK', { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error('[paystack-webhook] fatal', error)
    return new Response('Internal server error', { status: 500, headers: corsHeaders })
  }
})

async function handleChargeSuccess(supabase: any, event: any) {
  const ed = event.data

  // Server-stored expectation is the source of truth
  const { data: txn } = await supabase
    .from('transactions')
    .select('id, amount, currency, metadata')
    .eq('reference', ed.reference)
    .maybeSingle()

  if (!txn) {
    log('charge.success for unknown reference — recording only', { reference: ed.reference })
    return
  }

  const paidPesewas = Number(ed.amount)
  const expectedPesewas = Math.round(Number(txn.amount) * 100)
  const amountOk = Number.isFinite(paidPesewas) && paidPesewas === expectedPesewas
  const currencyOk = (ed.currency || 'GHS') === (txn.currency || 'GHS')

  await supabase.from('transactions').update({
    status: amountOk && currencyOk ? 'success' : 'amount_mismatch',
    paystack_reference: ed.id?.toString(),
    paystack_response: ed,
    webhook_verified: true,
    updated_at: new Date().toISOString(),
  }).eq('id', txn.id)

  if (!amountOk || !currencyOk) {
    console.error('[paystack-webhook] AMOUNT MISMATCH — booking NOT confirmed', {
      reference: ed.reference, expectedPesewas, paidPesewas,
      expectedCurrency: txn.currency, paidCurrency: ed.currency,
    })
    return
  }

  const bookingId = txn.metadata?.booking_id
  if (!bookingId) return

  const bookingUpdate: Record<string, unknown> = {
    payment_status: 'paid',
    status: 'confirmed',
    transaction_reference: ed.reference,
    paystack_reference: ed.id?.toString(),
    payment_method: ed.authorization?.card_type || ed.channel || 'unknown',
    updated_at: new Date().toISOString(),
  }

  // Financial breakdown: prefer the SERVER-authored snapshot persisted at
  // initialization; otherwise recompute server-side (fail-closed engine).
  const snapshot = txn.metadata?.commission_snapshot
  if (snapshot?.totalAmount) {
    Object.assign(bookingUpdate, {
      total_amount: snapshot.totalAmount,
      platform_commission: snapshot.platformCommission,
      platform_fee: snapshot.platformFixedFee,
      agent_commission: snapshot.agentCommission || 0,
      paystack_fee: snapshot.paystackFee,
      vat_amount: snapshot.vatAmount || 0,
      owner_receives: snapshot.ownerReceives,
      property_rent: snapshot.baseAmount,
    })
  } else {
    const { data: booking } = await supabase
      .from('bookings_enhanced')
      .select('property_rent, agent_id')
      .eq('id', bookingId)
      .maybeSingle()
    if (booking?.property_rent) {
      const engine = new ServerCommissionEngine()
      await engine.loadRates(supabase)
      const calc = engine.calculateCommissions(booking.property_rent, Boolean(booking.agent_id))
      Object.assign(bookingUpdate, {
        total_amount: calc.totalAmount,
        platform_commission: calc.platformCommission,
        platform_fee: calc.platformFixedFee,
        agent_commission: calc.agentCommission,
        paystack_fee: calc.paystackFee,
        vat_amount: calc.vatAmount,
        owner_receives: calc.ownerReceives,
      })
    }
  }

  const { error } = await supabase.from('bookings_enhanced').update(bookingUpdate).eq('id', bookingId)
  if (error) console.error('[paystack-webhook] booking update failed', error)
  else log('booking confirmed', { bookingId, total: bookingUpdate.total_amount })
}

async function handleRefundProcessed(supabase: any, event: any) {
  const ed = event.data
  const reference = ed.transaction_reference || ed.reference
  if (!reference) return

  await supabase.from('transactions').update({
    status: 'refunded',
    paystack_response: ed,
    updated_at: new Date().toISOString(),
  }).eq('reference', reference)

  const { data: txn } = await supabase
    .from('transactions').select('metadata').eq('reference', reference).maybeSingle()
  if (txn?.metadata?.booking_id) {
    await supabase.from('bookings_enhanced').update({
      payment_status: 'refunded',
      status: 'cancelled',
      updated_at: new Date().toISOString(),
    }).eq('id', txn.metadata.booking_id)
    log('booking cancelled after refund', { bookingId: txn.metadata.booking_id })
  }
}
