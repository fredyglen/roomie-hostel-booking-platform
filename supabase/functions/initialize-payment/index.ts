// initialize-payment — v9 (booking-first + deposits), hardened 2026-08-30
// Contract:
//   PREFERRED: { booking_id, payment_kind: 'full'|'deposit'|'balance', email, dry_run? }
//     The booking (created server-side via create_pending_booking) is the sole
//     source of the price. The engine computes the student total from the
//     bearer-aware commission configuration; the deposit split comes from the
//     same configuration. dry_run returns the authoritative quote and charge
//     without contacting Paystack or persisting anything.
//   LEGACY: { base_amount, has_agent, metadata.property_id } — price validated
//     against real property/room prices. Kept only until all clients migrate.
// Money is computed HERE and only here. The browser displays what this returns.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { serverCommissionEngine } from '../_shared/commission-engine.ts'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY')!

const round2 = (n: number) => Math.round(n * 100) / 100
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

const RequestSchema = z.object({
  email: z.string().email(),
  booking_id: z.string().uuid().optional(),
  payment_kind: z.enum(['full', 'deposit', 'balance']).optional().default('full'),
  base_amount: z.number().positive().optional(),
  has_agent: z.boolean().optional().default(false),
  amount: z.number().positive().optional(), // legacy, rejected below
  currency: z.string().optional().default('GHS'),
  metadata: z.object({
    booking_id: z.string().uuid().optional(),
    student_id: z.string().uuid().optional(),
    property_id: z.string().uuid().optional(),
    property_owner_id: z.string().uuid().optional(),
    agent_id: z.string().uuid().optional(),
  }).passthrough().optional(),
  dry_run: z.boolean().optional().default(false),
  callback_url: z.string().url().optional(),
  channels: z.array(z.string()).optional(),
})

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: corsHeaders })

  try {
    const missing = [
      !supabaseUrl && 'SUPABASE_URL',
      !supabaseServiceKey && 'SUPABASE_SERVICE_ROLE_KEY',
      !paystackSecretKey && 'PAYSTACK_SECRET_KEY',
    ].filter(Boolean)
    if (missing.length) return json({ status: false, message: `Server misconfiguration: missing ${missing.join(', ')}` }, 500)

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return json({ status: false, message: 'Unauthorized' }, 401)

    // Authenticate the caller with their own JWT; act with service role.
    const authed = createClient(supabaseUrl, supabaseServiceKey, { global: { headers: { Authorization: authHeader } } })
    const { data: { user }, error: authError } = await authed.auth.getUser()
    if (authError || !user) return json({ status: false, message: 'Unauthorized' }, 401)
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    let body: z.infer<typeof RequestSchema>
    try {
      body = RequestSchema.parse(await req.json())
    } catch {
      return json({ status: false, message: 'Invalid request data' }, 400)
    }

    if (body.amount && !body.base_amount && !body.booking_id) {
      return json({ status: false, message: 'This payment API version is no longer supported. Please refresh the app and try again.', error_code: 'LEGACY_API_REMOVED' }, 400)
    }

    // Fail-closed engine load (bearer-aware, DB-driven).
    try {
      await serverCommissionEngine.loadRates(supabase)
    } catch {
      return json({ status: false, message: 'Server configuration error: unable to load commission rates' }, 500)
    }

    // Deposit config comes from the same active row the engine loaded.
    const { data: cfg } = await supabase
      .from('commission_configurations')
      .select('deposit_enabled, deposit_type, deposit_value, deposit_balance_due_days, booking_hold_hours')
      .eq('is_active', true).order('created_at', { ascending: false }).limit(1).maybeSingle()

    let baseAmount: number
    let hasAgent = false
    let booking: any = null
    let chargeAmount: number
    let kind = body.payment_kind

    if (body.booking_id) {
      // ---------- BOOKING-FIRST PATH (authoritative) ----------
      const { data: b, error: bErr } = await supabase
        .from('bookings_enhanced')
        .select('id, student_id, property_id, property_owner_id, agent_id, status, payment_status, property_rent, total_amount, amount_paid, hold_expires_at')
        .eq('id', body.booking_id).maybeSingle()
      if (bErr || !b) return json({ status: false, message: 'Booking not found.', error_code: 'BOOKING_NOT_FOUND' }, 404)
      if (b.student_id !== user.id) return json({ status: false, message: 'This booking belongs to another account.', error_code: 'NOT_YOUR_BOOKING' }, 403)
      if (!['pending', 'reserved'].includes(b.status)) {
        return json({ status: false, message: `This booking is ${b.status} and cannot be paid.`, error_code: 'BOOKING_NOT_PAYABLE' }, 409)
      }
      if (b.hold_expires_at && new Date(b.hold_expires_at).getTime() < Date.now()) {
        return json({ status: false, message: 'This booking hold has expired. Please start a new booking.', error_code: 'HOLD_EXPIRED' }, 409)
      }
      booking = b
      baseAmount = Number(b.property_rent)
      hasAgent = Boolean(b.agent_id)
      if (!(baseAmount > 0)) return json({ status: false, message: 'Booking has no valid price.', error_code: 'PRICE_UNAVAILABLE' }, 409)
    } else if (body.base_amount) {
      // ---------- LEGACY PATH: validate against real prices ----------
      const propertyId = body.metadata?.property_id
      if (!propertyId) return json({ status: false, message: 'Missing property reference for this payment.', error_code: 'PROPERTY_ID_REQUIRED' }, 400)
      const { data: prop, error: propErr } = await supabase
        .from('properties').select('id, base_price_per_semester, rent, is_available').eq('id', propertyId).single()
      if (propErr || !prop) return json({ status: false, message: 'Property not found for this payment.', error_code: 'PROPERTY_NOT_FOUND' }, 404)
      const { data: propRooms } = await supabase
        .from('rooms').select('rent_amount').eq('property_id', propertyId).not('rent_amount', 'is', null)
      const legit = new Set<number>()
      if (Number(prop.base_price_per_semester) > 0) legit.add(Number(prop.base_price_per_semester))
      if (Number(prop.rent) > 0) legit.add(Number(prop.rent))
      for (const r of propRooms ?? []) if (Number(r.rent_amount) > 0) legit.add(Number(r.rent_amount))
      const matches = [...legit].some(p => Math.abs(p - body.base_amount!) < 0.01)
      if (!legit.size || !matches) {
        console.error('PRICE VALIDATION FAILED', { userId: user.id, propertyId, claimed: body.base_amount, legitimate: [...legit] })
        return json({ status: false, message: 'Payment amount does not match the price of this property. Please refresh and try again.', error_code: 'AMOUNT_MISMATCH' }, 400)
      }
      baseAmount = body.base_amount
      hasAgent = body.has_agent || false
      kind = 'full' // deposits require the booking-first path
    } else {
      return json({ status: false, message: 'Missing required field: booking_id or base_amount' }, 400)
    }

    // ---------- Server-side money ----------
    const calc = serverCommissionEngine.calculateCommissions(baseAmount, hasAgent)
    const total = round2(calc.totalAmount)
    const alreadyPaid = round2(Number(booking?.amount_paid ?? 0))

    if (kind === 'deposit') {
      if (!cfg?.deposit_enabled) return json({ status: false, message: 'Deposits are not currently enabled.', error_code: 'DEPOSIT_DISABLED' }, 400)
      if (alreadyPaid > 0) return json({ status: false, message: 'A payment has already been made on this booking — pay the balance instead.', error_code: 'DEPOSIT_ALREADY_PAID' }, 409)
      chargeAmount = cfg.deposit_type === 'fixed'
        ? round2(Math.min(Number(cfg.deposit_value), total))
        : round2(total * Number(cfg.deposit_value))
      if (!(chargeAmount > 0) || chargeAmount >= total) {
        return json({ status: false, message: 'Deposit configuration is invalid.', error_code: 'DEPOSIT_CONFIG_INVALID' }, 500)
      }
    } else if (kind === 'balance') {
      chargeAmount = round2(total - alreadyPaid)
      if (!(chargeAmount > 0)) return json({ status: false, message: 'Nothing left to pay on this booking.', error_code: 'NOTHING_DUE' }, 409)
    } else {
      chargeAmount = round2(total - alreadyPaid)
      if (!(chargeAmount > 0)) return json({ status: false, message: 'Nothing left to pay on this booking.', error_code: 'NOTHING_DUE' }, 409)
    }

    const quote = {
      breakdown: calc,
      total_amount: total,
      amount_paid: alreadyPaid,
      charge_amount: chargeAmount,
      payment_kind: kind,
      deposit: cfg?.deposit_enabled ? {
        enabled: true, type: cfg.deposit_type, value: Number(cfg.deposit_value),
        deposit_amount: cfg.deposit_type === 'fixed'
          ? round2(Math.min(Number(cfg.deposit_value), total))
          : round2(total * Number(cfg.deposit_value)),
        balance_due_days: Number(cfg.deposit_balance_due_days ?? 14),
      } : { enabled: false },
      rates: serverCommissionEngine.getCurrentRates(),
    }

    if (body.dry_run) return json({ status: true, message: 'Quote generated', data: { quote } })

    // Persist the authoritative totals on the booking before charging.
    if (booking) {
      const { error: upErr } = await supabase.from('bookings_enhanced').update({
        total_amount: total,
        amount_due: round2(total - alreadyPaid),
        payment_plan: kind === 'deposit' ? 'deposit' : (alreadyPaid > 0 ? 'deposit' : 'full'),
        updated_at: new Date().toISOString(),
      }).eq('id', booking.id)
      if (upErr) {
        console.error('Failed to persist booking totals; aborting initialization.', upErr)
        return json({ status: false, message: 'Could not prepare this booking for payment. No charge was made — please try again.', error_code: 'PERSISTENCE_FAILED' }, 500)
      }
    }

    const reference = `ROOMI_${Date.now()}_${Math.random().toString(36).substring(7)}`
    const callbackUrl = body.callback_url || `${supabaseUrl.replace('/supabase', '')}/payment-success`
    const commissionSnapshot = {
      baseAmount: calc.baseAmount,
      platformCommission: calc.platformCommission,
      platformFixedFee: calc.platformFixedFee,
      agentCommission: calc.agentCommission,
      paystackFee: calc.paystackFee,
      vatAmount: calc.vatAmount,
      totalAmount: total,
      ownerReceives: calc.ownerReceives,
      hasAgent,
      calculatedAt: new Date().toISOString(),
      rates: serverCommissionEngine.getCurrentRates(),
    }
    const metadata = {
      ...(body.metadata ?? {}),
      ...(booking ? { booking_id: booking.id, property_id: booking.property_id, property_owner_id: booking.property_owner_id } : {}),
      student_id: user.id,
      user_id: user.id,
      reference,
      platform: 'roomi',
      payment_type: 'booking',
      payment_kind: kind,
      charge_amount: chargeAmount,
      commission_snapshot: commissionSnapshot,
    }

    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${paystackSecretKey}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        email: body.email,
        amount: Math.round(chargeAmount * 100),
        currency: body.currency || 'GHS',
        reference,
        callback_url: callbackUrl,
        metadata,
        channels: body.channels || ['mobile_money', 'bank', 'card'],
      }),
    })
    if (!paystackResponse.ok) {
      const text = await paystackResponse.text()
      console.error('Paystack HTTP error:', { status: paystackResponse.status, body: text })
      throw new Error(`Paystack HTTP ${paystackResponse.status}`)
    }
    const paystackResult = await paystackResponse.json()
    if (!paystackResult?.status) throw new Error(paystackResult?.message || 'Payment initialization failed')

    // Store the expected charge server-side; verification depends on it.
    const { error: dbError } = await supabase.from('transactions').insert({
      reference,
      amount: chargeAmount,
      currency: body.currency || 'GHS',
      status: 'pending',
      customer_email: body.email,
      customer_id: user.id,
      metadata,
      paystack_reference: paystackResult.data?.reference,
      paystack_response: paystackResult,
      created_at: new Date().toISOString(),
    })
    if (dbError) {
      console.error('Transaction persistence failed; aborting initialization.', dbError)
      return json({ status: false, message: 'Could not record this payment attempt. No charge was made — please try again.', error_code: 'PERSISTENCE_FAILED' }, 500)
    }

    console.log('[initialize-payment] initialized', { reference, kind, chargeAmount, total, bookingId: booking?.id ?? null, version: serverCommissionEngine.getCurrentRates().version })
    return json({
      status: true,
      message: 'Payment initialized successfully',
      data: {
        reference,
        access_code: paystackResult.data.access_code,
        authorization_url: paystackResult.data.authorization_url,
        quote,
      },
    })
  } catch (error) {
    console.error('Payment initialization error:', error)
    return json({ status: false, message: error instanceof Error ? error.message : 'Payment initialization failed' }, 500)
  }
})
