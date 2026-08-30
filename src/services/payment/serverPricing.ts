/**
 * Server-authoritative pricing + booking lifecycle client.
 *
 * The browser NEVER computes money. Every figure shown to a student comes
 * from initialize-payment's dry_run quote; every booking is created as a
 * server-held pending row (bed atomically reserved) BEFORE any charge, and
 * is confirmed only by the server (webhook / verify-payment settlement).
 */
import { supabase } from '@/integrations/supabase/client';

export type PaymentKind = 'full' | 'deposit' | 'balance';

export interface ServerQuote {
  breakdown: {
    baseAmount: number;
    platformCommission: number;
    platformFixedFee: number;
    agentCommission: number;
    paystackFee: number;
    vatAmount: number;
    totalAmount: number;
    ownerReceives: number;
    studentPays?: Record<string, number>;
    [k: string]: unknown;
  };
  total_amount: number;
  amount_paid: number;
  charge_amount: number;
  payment_kind: PaymentKind;
  deposit: {
    enabled: boolean;
    type?: 'percent' | 'fixed';
    value?: number;
    deposit_amount?: number;
    balance_due_days?: number;
  };
  rates?: unknown;
}

export interface PendingBookingResult {
  booking_id: string;
  booking_reference: string;
  room_id: string;
  property_rent: number;
  hold_expires_at: string;
}

export interface CreatePendingBookingInput {
  propertyId: string;
  checkIn: string;          // YYYY-MM-DD
  checkOut: string;         // YYYY-MM-DD
  roomType?: string | null;
  semesterPeriod?: string | null;
  roommatesCount?: number;
  specialRequests?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  emergencyContactRelationship?: string | null;
  studentIdNumber?: string | null;
  university?: string | null;
  program?: string | null;
  metadata?: Record<string, unknown>;
}

/** Create the server-held pending booking (atomically reserves a bed). */
export async function createPendingBooking(input: CreatePendingBookingInput): Promise<PendingBookingResult> {
  const { data, error } = await (supabase.rpc as CallableFunction)('create_pending_booking', {
    p_property_id: input.propertyId,
    p_check_in: input.checkIn,
    p_check_out: input.checkOut,
    p_room_type: input.roomType ?? null,
    p_semester_period: input.semesterPeriod ?? null,
    p_roommates_count: input.roommatesCount ?? 1,
    p_special_requests: input.specialRequests ?? null,
    p_emergency_contact_name: input.emergencyContactName ?? null,
    p_emergency_contact_phone: input.emergencyContactPhone ?? null,
    p_emergency_contact_relationship: input.emergencyContactRelationship ?? null,
    p_student_id_number: input.studentIdNumber ?? null,
    p_university: input.university ?? null,
    p_program: input.program ?? null,
    p_metadata: (input.metadata ?? {}) as never,
  });
  if (error) {
    if (error.message?.includes('NO_AVAILABILITY')) {
      throw new Error('No beds are available for the selected room type. Please choose another option.');
    }
    if (error.message?.includes('PROPERTY_UNAVAILABLE')) {
      throw new Error('This property is not currently available for booking.');
    }
    throw new Error(error.message || 'Could not start your booking. Please try again.');
  }
  return data as unknown as PendingBookingResult;
}

/** Cancel a pending/reserved booking (server releases the held bed). */
export async function cancelPendingBooking(bookingId: string): Promise<void> {
  const { error } = await (supabase.rpc as CallableFunction)('cancel_booking', { p_booking_id: bookingId });
  if (error) throw new Error(error.message || 'Could not cancel this booking.');
}

/** Fetch the authoritative quote for a booking (or legacy property price). */
export async function getServerQuote(args: {
  email: string;
  bookingId?: string;
  kind?: PaymentKind;
  baseAmount?: number;
  propertyId?: string;
  hasAgent?: boolean;
}): Promise<ServerQuote> {
  const body: Record<string, unknown> = { email: args.email, dry_run: true, currency: 'GHS' };
  if (args.bookingId) {
    body.booking_id = args.bookingId;
    body.payment_kind = args.kind ?? 'full';
  } else {
    body.base_amount = args.baseAmount;
    body.has_agent = Boolean(args.hasAgent);
    body.metadata = { property_id: args.propertyId };
  }
  const { data, error } = await supabase.functions.invoke('initialize-payment', { body });
  if (error || !data?.status || !data?.data?.quote) {
    throw new Error(data?.message || 'Could not fetch the price for this booking.');
  }
  return data.data.quote as ServerQuote;
}

/**
 * Wait for the SERVER (webhook / verify settlement) to mark the booking paid.
 * The browser never writes payment state — it only observes it.
 */
export async function waitForBookingSettlement(
  bookingId: string,
  timeoutMs = 20000,
  intervalMs = 1500,
): Promise<{ settled: boolean; status?: string; payment_status?: string }> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const { data } = await supabase
      .from('bookings_enhanced')
      .select('status, payment_status')
      .eq('id', bookingId)
      .maybeSingle();
    if (data && ['paid', 'partially_paid'].includes(data.payment_status)) {
      return { settled: true, ...data };
    }
    await new Promise(r => setTimeout(r, intervalMs));
  }
  return { settled: false };
}
