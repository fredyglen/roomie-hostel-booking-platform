# ROOMie – Paystack Mobile Money (Ghana) & Bank Transfer Integration Guide

_Last reviewed: 2025-11 (based on Paystack public docs and current ROOMie implementation)_

## 1. Scope & Goals

This document explains how ROOMie integrates Paystack for Ghana **mobile money** and **bank transfer** payments, and what has been intentionally disabled.

**Goals:**
- Use **mobile money as the primary payment method** for students
- Offer **bank transfer as a secondary method**
- **Disable card payments** in the UI and configuration
- Keep all commission logic centralized in the existing commission engine and Supabase Edge Functions

## 2. Paystack Channels – Ghana

Paystack supports a `channels` array on `transaction/initialize` and in InlineJS V2 configuration.

### 2.1 Channel parameter values

Relevant values for Ghana (2024–2025 docs):
- `mobile_money` – all supported mobile money providers (MTN, Vodafone, AirtelTigo)
- `bank` – direct bank account / bank payment option
- `bank_transfer` – dedicated bank-transfer experience (virtual account / transfer-style flows)
- `ussd` – USSD-based payments
- `card` – **card payments (we are disabling this)**
- `qr` – QR-based payments (currently low-priority for ROOMie)

**ROOMie decision:**
- Frontend (InlineJS V2): **`['mobile_money', 'bank', 'ussd', 'bank_transfer']`**
- Server `initialize-payment` function default: **`['mobile_money', 'bank']`**
- Global config defaults: **`['mobile_money', 'bank', 'ussd', 'qr']`**

This ensures mobile money is always available, with bank/bank_transfer as secondary options, while card is removed.

### 2.2 Ghana mobile money provider codes

Paystack mobile money charge APIs and metadata use string **provider codes**. Common codes in the docs and examples are:
- MTN: `mtn`
- Vodafone: `vodafone` (sometimes abbreviated as `vod`)
- AirtelTigo: `airteltigo` (sometimes abbreviated as `tgo` or `airtel`)

**ROOMie canonical codes in the codebase:**
- `mtn`
- `vodafone`
- `airtel`

These are exposed via:
- `src/types/payment.ts` → `MobileMoneyNetwork`
- `src/utils/paystackIntegration.ts` → `getMobileMoneyProviders()`
- `src/components/booking/PaymentOptions.tsx` → MoMo provider dropdown

If Paystack changes naming (for example, requiring `airteltigo` instead of `airtel`), update **both** the type union and `getMobileMoneyProviders()` to keep everything in sync.

## 3. Bank Transfer vs Bank Channels

Paystack currently exposes **two closely related channels**:

- `bank` – standard bank account payments (bank selection, debit, etc.)
- `bank_transfer` – bank-transfer style payments (e.g., virtual accounts / transfer flows)

**ROOMie strategy:**
- Use **`bank`** consistently in server-side `initialize-payment` so Paystack always has a simple bank option.
- In the frontend InlineJS V2 (`ModernPaystackPayment`), include **both `bank` and `bank_transfer`** in the `channels` array so whichever bank experience Paystack exposes for Ghana is available.

Practically, this means students will see a single **“Bank Transfer”** option in the UI, but under the hood Paystack can pick the most appropriate bank flow based on the customer and country.

## 4. Where this is configured in ROOMie

Key integration points:

1. **Global Paystack config**  
   - File: `src/config/index.ts`  
   - Field: `config.paystack.channels`  
   - New value: `['mobile_money', 'bank', 'ussd', 'qr'] as const`

2. **InlineJS V2 booking payments**  
   - File: `src/components/payment/ModernPaystackPayment.tsx`  
   - Field: `channels` in `transactionConfig`  
   - New value: `['mobile_money', 'bank', 'ussd', 'bank_transfer']`

3. **Supabase Edge Function – initialize-payment**  
   - File: `supabase/functions/initialize-payment/index.ts`  
   - Field: `channels` inside `paystackPayload`  
   - New default: `paymentData.channels || ['mobile_money', 'bank']`

4. **Legacy Paystack popup wrapper**  
   - File: `src/lib/paystack.ts`  
   - Field: `paystackConfig.channels`  
   - New value: `['mobile_money', 'bank']`

5. **Validation & types**  
   - `src/schemas/validation-schemas.ts` – `paymentSchema.paymentMethod` now excludes `'card'`  
   - `src/types/payment.ts` – `PaymentMethod` no longer includes `'card'`; supports `mobile_money` and `bank`/`bank_transfer`  
   - `src/types/platform-core.ts` – `PaymentChannel` enum no longer has `CARD`

## 5. Webhooks & Logging

### 5.1 Paystack dashboard

In the Paystack dashboard, webhook configuration is under:
- **Settings → API Keys & Webhooks**: where you set the webhook URL
- **Developers → Logs / Webhooks** (or similar, depending on UI version): where you can filter for webhook deliveries and inspect payloads and response codes

If you only see the **API Configuration** section and no delivery logs yet, it usually means:
- No events have been fired to that webhook URL, or
- Your account UI has logging consolidated under **Developers → Logs** instead of a dedicated “Webhooks” tab.

### 5.2 Supabase Edge Function logs (recommended primary source)

Because webhook deliveries can be hard to debug purely from the Paystack dashboard, ROOMie treats **Supabase as the primary source of truth** for webhook success:

- Go to **Supabase Dashboard → Edge Functions → paystack-webhook → Logs**
- Trigger a test payment in **test mode**
- Confirm you see a `charge.success` event and that no unhandled exceptions occur

For deeper debugging you can also:
- Use the Supabase CLI: `supabase functions logs paystack-webhook --project-ref <project-ref>`
- Add structured logging inside the webhook handler (already present in `supabase/functions/paystack-webhook/index.ts`)

## 6. Test Mode – Mobile Money & Bank

### 6.1 API keys (test mode)

From the Paystack dashboard:
- Navigate to **Settings → API Keys & Webhooks**
- Use:
  - **Test Public Key** (`pk_test_...`) → goes into `.env` as `VITE_PAYSTACK_PUBLIC_KEY`
  - **Test Secret Key** (`sk_test_...`) → goes into Supabase Edge Function secrets (e.g., `PAYSTACK_SECRET_KEY`)

ROOMie already has:
- `.env` → `VITE_PAYSTACK_PUBLIC_KEY=pk_test_...`
- Supabase → Edge Function secret `PAYSTACK_SECRET_KEY=sk_test_...` (to be set in the Supabase dashboard if not already present)

### 6.2 Mobile money test flow (Ghana)

For **Ghana mobile money** Paystack does **not** provide fixed dummy phone numbers; instead you:
- Keep your keys in **test mode** (`pk_test_`, `sk_test_`)
- Use a **real Ghana mobile money number** you control (MTN, Vodafone, AirtelTigo)
- Complete the prompts (USSD, OTP, or SIM toolkit approval)

Because the account is in **test mode**, no real money is moved, even though the prompts feel real.

### 6.3 Bank / bank transfer test flow

- Use the **same test keys** (`pk_test_...` / `sk_test_...`)
- In the Paystack popup, choose the **Bank / Bank Transfer** option
- Follow the prompts; Paystack simulates success/failure based on its current test environment rules

After each test payment, verify:
1. The Paystack dashboard shows a **successful transaction** in test mode
2. Supabase `paystack-webhook` logs show a `charge.success` event
3. The corresponding ROOMie **booking / transaction row** is updated with the expected status and commission fields

## 7. Summary of Intended Behaviour

- Students see **only two methods** in the booking UI:
  - **Mobile Money** (default / primary)
  - **Bank Transfer** (secondary)
- **Card payments are fully hidden/disabled** from the booking flow UI and config
- All Paystack API calls use **`mobile_money`** for MoMo and `bank`/`bank_transfer` for bank options
- Webhook handling and commission calculations remain centralized in Supabase Edge Functions using the unified commission engine.

