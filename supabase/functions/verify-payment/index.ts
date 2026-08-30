// verify-payment — hardened 2026-08-29
// Contract: POST/GET { reference } from an authenticated user who owns the
// transaction. Verifies with Paystack, then confirms the booking ONLY if the
// amount Paystack reports as paid matches the server-stored expected amount.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { applyPaymentToBooking } from '../_shared/booking-settlement.ts'

const log = (msg: string, extra?: unknown) =>
  console.log(`[verify-payment] ${msg}`, extra === undefined ? '' : JSON.stringify(extra))

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY')!

    // Authenticate the caller with their own JWT
    const authClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } },
    })
    const { data: { user }, error: authError } = await authClient.auth.getUser()
    if (authError || !user) {
      return new Response(JSON.stringify({ status: false, message: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    let reference: string | null = null
    if (req.method === 'GET') reference = new URL(req.url).searchParams.get('reference')
    else if (req.method === 'POST') reference = (await req.json()).reference
    if (!reference || typeof reference !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(reference)) {
      return new Response(JSON.stringify({ status: false, message: 'Valid reference is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Service-role client for privileged reads/writes
    const supabase = createClient(supabaseUrl, serviceKey)

    // Ownership + expected amount in one read
    const { data: txn, error: txnErr } = await supabase
      .from('transactions')
      .select('id, amount, currency, customer_id, metadata')
      .eq('reference', reference)
      .eq('customer_id', user.id)
      .maybeSingle()

    if (txnErr || !txn) {
      return new Response(JSON.stringify({ status: false, message: 'Transaction not found or unauthorized' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    log(`Verifying reference ${reference}`)
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${paystackSecretKey}` } },
    )
    const paystackResult = await paystackResponse.json()
    if (!paystackResult.status) {
      throw new Error(paystackResult.message || 'Payment verification failed')
    }

    const pd = paystackResult.data
    const paidPesewas = Number(pd.amount)
    const expectedPesewas = Math.round(Number(txn.amount) * 100)
    const amountOk = Number.isFinite(paidPesewas) && paidPesewas === expectedPesewas
    const currencyOk = (pd.currency || 'GHS') === (txn.currency || 'GHS')
    const paid = pd.status === 'success'

    // Record the verification outcome on the transaction either way
    await supabase.from('transactions').update({
      status: amountOk && currencyOk ? pd.status : 'amount_mismatch',
      paystack_response: pd,
      gateway_response: pd.gateway_response,
      updated_at: new Date().toISOString(),
    }).eq('id', txn.id)

    if (paid && (!amountOk || !currencyOk)) {
      console.error('[verify-payment] AMOUNT MISMATCH — booking NOT confirmed', {
        reference, expectedPesewas, paidPesewas,
        expectedCurrency: txn.currency, paidCurrency: pd.currency, userId: user.id,
      })
      return new Response(JSON.stringify({
        status: false,
        message: 'Payment received but the amount does not match this booking. Our team has been notified.',
        error_code: 'AMOUNT_MISMATCH',
      }), { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Confirm/settle the booking only on verified success with matching
    // amount — via the same shared settlement used by the webhook (kind-aware:
    // deposits reserve, completion confirms).
    if (paid) {
      const result = await applyPaymentToBooking(supabase, txn, pd)
      log('settlement', result)
    }

    return new Response(JSON.stringify({
      status: true, message: 'Payment verification successful', data: pd,
    }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error('[verify-payment] error', error)
    return new Response(JSON.stringify({ status: false, message: 'Payment verification failed' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
