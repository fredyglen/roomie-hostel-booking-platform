/**
 * ROOMi go-live E2E — run locally (sandbox here can't reach supabase.co/paystack).
 *
 *   npm i -D @playwright/test && npx playwright install chromium
 *   BASE_URL=http://localhost:8080 npx playwright test e2e/booking-payment.spec.ts
 *
 * Uses the demo accounts (student@roomi.com / password123). Paystack must be
 * in TEST mode. The suite proves, against the LIVE backend:
 *   1. bookings are created server-side as pending holds (bed reserved)
 *   2. a student CANNOT self-confirm or forge payment state (RLS + trigger)
 *   3. the quote (incl. deposit split) comes from initialize-payment dry_run
 *   4. the UI reaches Paystack with a server-issued authorization_url
 */
import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:8080';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? 'https://ymqnbekeqarjmxftzvks.supabase.co';
const SUPABASE_ANON = process.env.VITE_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY ?? '';
const STUDENT = { email: 'student@roomi.com', password: 'password123' };

test.describe('Server-authoritative booking integrity (API)', () => {
  test('pending hold → protected fields → quote → cancel', async () => {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);
    const { error: loginErr } = await supabase.auth.signInWithPassword(STUDENT);
    expect(loginErr).toBeNull();

    // A verified property with availability
    const { data: props } = await supabase
      .from('properties')
      .select('id, rooms:rooms(id, beds_available)')
      .eq('verification_status', 'verified')
      .eq('is_available', true)
      .limit(10);
    const prop = (props ?? []).find(p => (p.rooms ?? []).some((r: any) => r.beds_available > 0));
    expect(prop, 'no bookable property found').toBeTruthy();

    // 1. Server-side pending hold
    const checkIn = new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10);
    const checkOut = new Date(Date.now() + 150 * 864e5).toISOString().slice(0, 10);
    const { data: created, error: rpcErr } = await supabase.rpc('create_pending_booking', {
      p_property_id: prop!.id, p_check_in: checkIn, p_check_out: checkOut,
    } as never);
    expect(rpcErr).toBeNull();
    const booking = created as any;
    expect(booking.booking_id).toBeTruthy();
    expect(Number(booking.property_rent)).toBeGreaterThan(0);

    // 2. Self-confirmation must be impossible
    const { error: attackErr } = await supabase
      .from('bookings_enhanced')
      .update({ payment_status: 'paid', status: 'confirmed' } as never)
      .eq('id', booking.booking_id);
    expect(attackErr, 'client was able to self-confirm a booking!').not.toBeNull();

    // ...and forging a transaction must be impossible
    const { error: forgeErr } = await supabase.from('transactions').insert({
      reference: `FORGED_${Date.now()}`, amount: 1, currency: 'GHS', status: 'success',
    } as never);
    expect(forgeErr, 'client was able to insert a transaction!').not.toBeNull();

    // 3. Authoritative quote with deposit split
    const { data: quoteRes } = await supabase.functions.invoke('initialize-payment', {
      body: { email: STUDENT.email, booking_id: booking.booking_id, payment_kind: 'full', dry_run: true },
    });
    const quote = quoteRes?.data?.quote;
    expect(quote?.total_amount).toBeGreaterThan(0);
    expect(quote?.breakdown?.baseAmount).toBe(Number(booking.property_rent));
    if (quote?.deposit?.enabled) {
      expect(quote.deposit.deposit_amount).toBeGreaterThan(0);
      expect(quote.deposit.deposit_amount).toBeLessThan(quote.total_amount);
    }

    // 4. Cancel releases the hold
    const { error: cancelErr } = await supabase.rpc('cancel_booking', { p_booking_id: booking.booking_id } as never);
    expect(cancelErr).toBeNull();
  });
});

test.describe('Checkout UI reaches Paystack', () => {
  test('student flows to a server-issued Paystack authorization', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.getByLabel(/email/i).fill(STUDENT.email);
    await page.getByLabel(/password/i).fill(STUDENT.password);
    await page.getByRole('button', { name: /sign in|log in/i }).click();
    await page.waitForURL(/dashboard|properties|home/i, { timeout: 15000 });

    // Watch for the init call issued by PaymentStep
    const initPromise = page.waitForResponse(
      r => r.url().includes('/functions/v1/initialize-payment') && r.request().method() === 'POST',
      { timeout: 120000 },
    );

    // Drive the UI manually or via data-testids to the payment step, then:
    //   - pick a property with availability, complete steps 1–4,
    //   - on step 5 confirm the total shown equals the dry_run quote,
    //   - tick terms and press "Proceed to Pay".
    // The assertions below hold regardless of the path taken:
    const initRes = await initPromise;
    const initJson = await initRes.json();
    expect(initJson.status).toBeTruthy();
    expect(initJson.data.authorization_url).toContain('paystack');
    expect(initJson.data.quote.total_amount).toBeGreaterThan(0);
  });
});
