// Shared settlement logic — the ONE place a payment is applied to a booking.
// Used by both paystack-webhook and verify-payment so they cannot drift.
import { ServerCommissionEngine } from './commission-engine.ts'

const round2 = (n: number) => Math.round(n * 100) / 100

export interface SettlementResult {
  applied: boolean
  bookingId?: string
  outcome?: 'confirmed' | 'reserved'
  amountPaid?: number
  amountDue?: number
  reason?: string
}

/**
 * Apply a verified, amount-matched successful charge to its booking.
 * paidGhs is what Paystack reports as paid (converted from pesewas).
 * Kind-aware: deposits move the booking to 'reserved' with a balance
 * deadline; full/balance completion moves it to 'confirmed'/'paid'.
 */
export async function applyPaymentToBooking(
  supabase: any,
  txn: { id: string; metadata: any },
  paystackData: any,
): Promise<SettlementResult> {
  const bookingId = txn.metadata?.booking_id
  if (!bookingId) return { applied: false, reason: 'no booking_id on transaction' }

  const paidGhs = round2(Number(paystackData.amount) / 100)

  const { data: booking, error: bErr } = await supabase
    .from('bookings_enhanced')
    .select('id, status, amount_paid, total_amount, property_rent, agent_id')
    .eq('id', bookingId)
    .maybeSingle()
  if (bErr || !booking) return { applied: false, reason: `booking not found: ${bookingId}` }

  const snapshot = txn.metadata?.commission_snapshot
  let total = Number(snapshot?.totalAmount ?? booking.total_amount ?? 0)
  let financials: Record<string, unknown> = {}

  if (snapshot?.totalAmount) {
    financials = {
      total_amount: snapshot.totalAmount,
      property_rent: snapshot.baseAmount,
      platform_fee: snapshot.platformFixedFee,
      agent_fee: snapshot.agentCommission || 0,
    }
  } else if (booking.property_rent) {
    // Fallback: recompute with the fail-closed bearer engine.
    const engine = new ServerCommissionEngine()
    await engine.loadRates(supabase)
    const calc = engine.calculateCommissions(Number(booking.property_rent), Boolean(booking.agent_id))
    total = calc.totalAmount
    financials = {
      total_amount: calc.totalAmount,
      platform_fee: calc.platformFixedFee,
      agent_fee: calc.agentCommission,
    }
  }
  if (!(total > 0)) return { applied: false, reason: 'no authoritative total for booking' }

  const newPaid = round2(Number(booking.amount_paid ?? 0) + paidGhs)
  const commonRefs = {
    transaction_reference: paystackData.reference,
    paystack_reference: paystackData.id?.toString(),
    payment_method: paystackData.authorization?.card_type || paystackData.channel || 'unknown',
    updated_at: new Date().toISOString(),
  }

  if (newPaid + 0.01 >= total) {
    const { error } = await supabase.from('bookings_enhanced').update({
      ...commonRefs, ...financials,
      status: 'confirmed',
      payment_status: 'paid',
      amount_paid: newPaid,
      amount_due: 0,
    }).eq('id', bookingId)
    if (error) return { applied: false, reason: `update failed: ${error.message}` }
    return { applied: true, bookingId, outcome: 'confirmed', amountPaid: newPaid, amountDue: 0 }
  }

  // Partial payment (deposit): hold becomes a reservation with a balance deadline.
  const { data: cfg } = await supabase
    .from('commission_configurations')
    .select('deposit_balance_due_days')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  const dueDays = Number(cfg?.deposit_balance_due_days ?? 14)
  const amountDue = round2(total - newPaid)

  const { error } = await supabase.from('bookings_enhanced').update({
    ...commonRefs, ...financials,
    status: 'reserved',
    payment_status: 'partially_paid',
    payment_plan: 'deposit',
    amount_paid: newPaid,
    amount_due: amountDue,
    hold_expires_at: new Date(Date.now() + dueDays * 86400_000).toISOString(),
  }).eq('id', bookingId)
  if (error) return { applied: false, reason: `update failed: ${error.message}` }
  return { applied: true, bookingId, outcome: 'reserved', amountPaid: newPaid, amountDue }
}
