# PAYSTACK Mobile Money & Bank Transfer Testing Guide (Ghana)

This guide walks you step‑by‑step through configuring Paystack in **test mode** and running end‑to‑end tests for:

- **Mobile Money (Ghana)** – MTN, Vodafone, AirtelTigo
- **Bank payments** – via Paystack’s `bank` channel
- **Webhook delivery** – using **Supabase Edge Function logs**
- **Booking status verification** – using the unified `bookings_enhanced` table

---

## 1. Testing Prerequisites

### 1.1 Get Paystack Test API Keys

1. Log into your Paystack dashboard: `https://dashboard.paystack.com/`
2. Switch to **Test** mode (toggle at the top of the dashboard).
3. Go to **Settings → API Keys & Webhooks**.
4. Copy:
   - **Test Public Key** – looks like `pk_test_XXXXXXXXXXXXXXXXXXXX`
   - **Test Secret Key** – looks like `sk_test_XXXXXXXXXXXXXXXXXXXX`

> Keep these keys private – they control access to your Paystack account (even in test mode).

### 1.2 Configure Environment Variables

#### Frontend (`.env` in ROOMie project root)

1. Open the `.env` file in the project root.
2. Set / update the Paystack public key:

```env
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here
VITE_PAYSTACK_BASE_URL=https://api.paystack.co
```

3. Save the file.
4. **Restart** the dev server so Vite picks up the new env values:

```bash
npm run dev
```

#### Supabase Edge Functions (Secret Key)

1. Open **Supabase Dashboard** for the ROOMie project.
2. Go to **Edge Functions → (top right) Manage secrets**.
3. Add / update the Paystack secret key:

- **Key**: `PAYSTACK_SECRET_KEY`
- **Value**: `sk_test_your_secret_key_here`

4. Save the secret.
5. If you have the Edge Functions CLI or deployment pipeline, redeploy the `initialize-payment` and `paystack-webhook` functions so they see the new secret.

### 1.3 Configure Webhook URL in Paystack

1. In **Paystack Dashboard → Settings → API Keys & Webhooks**.
2. In the **Webhook URL** field, enter:

```text
https://ymqnbekeqarjmxftzvks.supabase.co/functions/v1/paystack-webhook
```

3. Click **Save**.

> This URL points to the ROOMie Supabase Edge Function that processes Paystack webhook events (e.g. `charge.success`).

---

## 2. Mobile Money Testing (Ghana)

The ROOMie integration uses the Paystack `mobile_money` **channel** with provider codes:

- **MTN** → `mtn`
- **Vodafone** → `vod`
- **AirtelTigo** → `tgo`

> In test mode, Paystack typically accepts any **valid‑looking Ghanaian mobile number** in the correct format (e.g. `0551234987`). Always confirm with your own Paystack account if they expose specific test numbers.

### 2.1 General Flow (what ROOMie does)

1. User reaches **Payment** step in the booking flow.
2. User selects **Mobile Money** (default) and agrees to terms.
3. ROOMie calls the `initialize-payment` Edge Function with:
   - Base booking amount
   - Metadata (including `booking_id`)
   - Channels: `['mobile_money', 'bank']`
4. Edge Function:
   - Calculates commissions server‑side.
   - Calls Paystack `/transaction/initialize` with `channel: 'mobile_money'`.
5. Frontend opens Paystack’s hosted checkout via **Inline JS v2**.
6. Customer enters their mobile number and selects **network provider**.
7. Paystack sends **offline prompts** to the phone (USSD / push notification).
8. Once the customer approves, Paystack triggers:
   - `charge.success` webhook to Supabase; and
   - A success redirect / callback that closes the checkout.

### 2.2 MTN Mobile Money (Test)

**Expected behaviour from Paystack docs:**

- Status returned from the `charge` API: `pay_offline`.
- Customer sees a prompt on their MTN line (e.g. SIM toolkit, push, or USSD) to approve the payment.

**Steps to test:**

1. Use a test MTN number (e.g. `0551234987`) or your own MTN line in test mode.
2. Start a booking on ROOMie and choose **Mobile Money**.
3. When Paystack checkout asks for network, select **MTN**.
4. Submit the payment.
5. On the phone:
   - Approve the transaction when prompted.
6. Back on ROOMie:
   - Wait a few seconds for Paystack to confirm the charge.
   - Expect the app to show a **payment success** state.
7. In Supabase logs (see section 4):
   - Confirm a `charge.success` event was received with `channel: "mobile_money"` and bank `"MTN Mobile Money"`.

### 2.3 Vodafone Mobile Money (Test)

Vodafone uses a **voucher** flow.

From Paystack docs:

- Initial charge returns `status: 'send_otp'` and a `display_text` telling the user to dial `*110#` to generate a voucher.
- The voucher is then submitted to Paystack to complete the charge.

**Steps to test:**

1. Use a valid Vodafone‑format test number (e.g. `0201234567`).
2. In ROOMie, choose **Mobile Money** and select **Vodafone** in the Paystack checkout.
3. Paystack will display instructions similar to:
   - *“Please dial *110# to generate a voucher code…”*
4. On the phone:
   - Dial `*110#` and follow prompts to generate a voucher code.
5. Back in the Paystack checkout:
   - Enter the voucher code.
6. After submitting the voucher:
   - Paystack completes the charge and sends `charge.success` to the webhook.
7. Verify in Supabase logs and bookings (see sections 4 and 5).

### 2.4 AirtelTigo Mobile Money (Test)

AirtelTigo behaves like MTN in test mode according to Paystack docs.

- Status from Paystack: `pay_offline`.
- Customer must authorize payment on their phone.

**Steps to test:**

1. Use an AirtelTigo‑style number (e.g. `0261234567`).
2. In ROOMie, select **Mobile Money** and choose **AirtelTigo**.
3. Submit the payment.
4. Approve the transaction on the handset when prompted.
5. Confirm `charge.success` webhook in Supabase logs.
6. Confirm booking status is updated (see section 5).

---

## 3. Bank Payment Testing (Paystack `bank` channel)

ROOMie enables the `bank` channel alongside `mobile_money`.

**What the user sees:**

- On the payment step, they can choose **Bank Transfer** (secondary option).
- Paystack opens a bank‑payment flow appropriate for Ghana (e.g. Pay with Bank or Pay with Transfer where available).

**To test:**

1. On the ROOMie Payment step, choose **Bank Transfer** instead of Mobile Money.
2. When Paystack checkout opens:
   - Follow the on‑screen instructions for test mode (Paystack may show sample bank accounts or a mock approval flow).
3. Complete the flow until Paystack shows **payment successful**.
4. Verify that:
   - A successful transaction appears in Paystack’s **Transactions** list (test mode).
   - A `charge.success` webhook is delivered (see section 4).
   - The booking is marked as paid / confirmed (see section 5).

> Note: Paystack’s exact bank test experience can vary by region and time. Always cross‑check their **Payment Channels** and **Test Payments** documentation from your dashboard for the latest bank‑testing specifics.

---

## 4. Webhook Verification (Supabase Logs)

### 4.1 Important: No Webhook Logs in Paystack Settings Screen

- The **API Keys & Webhooks** page in Paystack **does not show per‑event logs**.
- Once you set the webhook URL, Paystack simply POSTs events to that URL.
- If there is an error, Paystack retries according to its internal schedule, but you **don’t** see a detailed log UI on that settings page.

**Therefore, for ROOMie you must use Supabase logs to confirm webhook delivery.**

### 4.2 Viewing Webhook Logs in Supabase

1. Open **Supabase Dashboard**.
2. Go to **Edge Functions**.
3. Click on the `paystack-webhook` function.
4. Open the **Logs** tab.
5. Trigger a payment (mobile money or bank) in test mode.
6. After completing the payment, watch the logs for entries such as:
   - Incoming HTTP POST to `/functions/v1/paystack-webhook`
   - Parsed event with `event: "charge.success"` and `data.channel: "mobile_money"` or `"bank"`.

If you don’t see any logs:

- Double‑check that the **webhook URL** matches exactly.
- Ensure Paystack is in **Test** mode and the event you triggered is from the **Test** environment.

### 4.3 Alternative: Manual Transaction Verification

Even if the webhook has issues, you can still verify payments by calling Paystack’s **verify transaction** endpoint from the backend or using the `verifyPaystackPayment` helper in ROOMie.

Typical flow:

1. Get the Paystack reference returned after checkout.
2. Call `/transaction/verify/:reference` with your **secret key**.
3. If `status === 'success'` and `data.status === 'success'`, treat the payment as paid.

ROOMie’s Edge Functions and hooks already encapsulate this logic; in normal flow you mostly need to confirm that:

- The payment succeeded in Paystack.
- The webhook or verification path updated the booking correctly.

---

## 5. Payment Verification Checklist (ROOMie + Supabase)

ROOMie’s canonical booking table is **`bookings_enhanced`** (often referenced via `TABLE_NAMES.BOOKINGS`).

After a successful **mobile money** or **bank** payment:

1. **Check `transactions` table** (if enabled):
   - `status` should be `success`.
   - `webhook_verified` should be `true` once the webhook handler runs.

2. **Check `bookings_enhanced` table** for the relevant booking (by `id` or `booking_reference`):
   - `payment_status` should be `paid` (or `completed` in some older flows).
   - `status` should be `confirmed`.
   - `payment_method` should match the Paystack channel (e.g. `mobile_money` or `bank`).
   - `transaction_reference` / `paystack_reference` should be populated.

3. **Check the application UI**:
   - Student booking history shows the booking as **Confirmed/Paid**.
   - Owner / admin views reflect the updated status.

### 5.1 Troubleshooting Common Issues

**Issue: Payment went through on Paystack, but booking is still pending**

- Check Supabase Edge Function logs for `paystack-webhook`:
  - Look for errors when inserting/updating `transactions` or `bookings_enhanced`.
- Confirm the webhook URL is correct and publicly reachable.
- Verify that the Paystack event’s `metadata.booking_id` is present; ROOMie relies on this to tie transactions to bookings.

**Issue: No webhook logs at all**

- Webhook URL typo or missing HTTPS.
- Paystack still in **Live** mode while you are testing in **Test**, or vice versa.
- Temporary network issues between Paystack and Supabase.

**Issue: Payment marked failed in ROOMie but succeeded in Paystack**

- Confirm the `verifyPaystackPayment` call is using the **correct secret key** (test vs live).
- Compare the reference stored in `bookings_enhanced` with the one in Paystack – mismatches can cause verification to fail.

---

## 6. Test Mode Limitations

- **Real money is not moved**: Test mode simulates charges; customers are not billed.
- **Test credentials only**: Test cards, test bank flows, and simulated mobile money behaviour may differ slightly from live.
- **No production‑level fraud checks**: Some fraud‑prevention rules are relaxed in test.
- **Webhooks still fire**: Even in test mode, Paystack sends real webhook events, which is perfect for end‑to‑end testing.

When ready to go live:

1. Switch Paystack dashboard to **Live** mode.
2. Replace keys with `pk_live_...` and `sk_live_...` in `.env` and Supabase secrets.
3. Keep the same webhook URL unless you are using a different Supabase project for production.

---

## 7. Quick Start: 3‑Step Setup + First Test Payment

### Step 1 – Configure Keys & Webhook (10–15 minutes)

1. Get **test public + secret keys** from Paystack (`Settings → API Keys & Webhooks`).
2. Set `VITE_PAYSTACK_PUBLIC_KEY` in `.env` and restart `npm run dev`.
3. Set `PAYSTACK_SECRET_KEY` in Supabase Edge Function secrets.
4. Set webhook URL to:

```text
https://ymqnbekeqarjmxftzvks.supabase.co/functions/v1/paystack-webhook
```

### Step 2 – Make Your First Test Mobile Money Payment

1. Run the app locally and navigate to the **booking flow**.
2. Complete all steps until you reach **Confirm & Pay**.
3. Leave **Mobile Money** selected (it is the default and primary method).
4. Enter a Ghana mobile number and choose a provider (MTN / Vodafone / AirtelTigo).
5. Follow the on‑screen and phone prompts until Paystack shows **success**.

### Step 3 – Verify Everything Worked

1. In Supabase Dashboard → **Edge Functions → paystack-webhook → Logs**:
   - Confirm a `charge.success` event was received.
2. In Supabase **`bookings_enhanced`** table:
   - Confirm the booking’s `payment_status` and `status` are updated (paid / confirmed).
3. In the ROOMie UI:
   - Confirm the booking appears as paid/confirmed in student and owner views.

If all three surfaces (Paystack dashboard, Supabase tables, ROOMie UI) agree, your mobile money integration is correctly wired in test mode.

