# ROOMi — Student Housing Booking Platform (Ghana)

ROOMi connects university students in Ghana with verified hostels and lets them
book and pay online (mobile money, bank, card via Paystack). Owners list and
manage properties; admins control pricing, fees, and verification from a live
dashboard.

**Status:** production-remediated (2026-08-30). All money is computed
server-side, bookings are server-held with atomic bed reservations, deposits
are supported, and clients are cryptographically unable to confirm their own
bookings. See [Security model](#security-model).

---

## Stack

| Layer      | Technology |
|------------|------------|
| Frontend   | React 18 + TypeScript, Vite, Tailwind, shadcn/ui |
| Backend    | Supabase (Postgres + RLS, Auth, Edge Functions on Deno, pg_cron) |
| Payments   | Paystack (GHS; mobile money, bank, card) |
| Tests      | Vitest (unit/integration), Playwright (E2E, `e2e/`) |

Supabase project: **ROOMi_v3** (`ymqnbekeqarjmxftzvks`).

---

## Core principle: the server owns the money

The browser **never computes, stores, or confirms** anything financial. It has
exactly three jobs in a paid booking:

1. Ask the server to **create a pending booking** (`create_pending_booking` RPC).
2. Ask the server for the **price** and to **start the charge** (`initialize-payment`).
3. **Observe** the booking until the server marks it paid.

Everything else — pricing, commission, deposits, confirmation, bed inventory —
happens in Postgres and Edge Functions, enforced by RLS, a write-protection
trigger, and Paystack webhook verification. A malicious client with the anon
key and a valid login can create a hold and pay for it; it cannot confirm,
reprice, forge, or double-book anything.

---

## Booking lifecycle

```
                     create_pending_booking (RPC, atomic)
  student ──────────────────────────────────────────────────▶  status: pending
                bed reserved (rooms.beds_available − 1)        hold: 48 h*
                rent captured server-side into the booking
                                    │
              ┌─────────────────────┼──────────────────────┐
              │ pays FULL           │ pays DEPOSIT (50%*)  │ hold expires / cancels
              ▼                     ▼                      ▼
        status: confirmed     status: reserved        status: expired / cancelled
        payment: paid         payment: partially_paid bed released automatically
                                    │
                                    │ pays BALANCE within 14 days*
                                    ▼                 └── or → deposit_expired,
                              status: confirmed            bed released (policy:
                              payment: paid                manual admin handling)
```

\* All starred values are **admin-configurable live** (no deploy):
`booking_hold_hours`, `deposit_enabled`, `deposit_type` (`percent`/`fixed`),
`deposit_value`, `deposit_balance_due_days` on the active
`commission_configurations` row. A pg_cron job (`roomi_expire_stale_bookings`,
every 10 minutes) expires stale holds and releases beds.

---

## Payment flow (booking-first contract)

```
Browser                        Edge Functions                     Paystack
  │  rpc create_pending_booking     │                                │
  │────────────────────────────────▶│  (Postgres, SECURITY DEFINER)  │
  │  ◀ booking_id, rent, hold       │                                │
  │                                 │                                │
  │  initialize-payment {dry_run}   │                                │
  │────────────────────────────────▶│ engine + deposit config        │
  │  ◀ QUOTE (the only price shown) │                                │
  │                                 │                                │
  │  initialize-payment             │  persists totals on booking,   │
  │  {booking_id, payment_kind}     │  creates transactions row,     │
  │────────────────────────────────▶│  initializes charge ──────────▶│
  │  ◀ authorization_url            │                                │
  │  … student pays on Paystack …   │                                │
  │                                 │◀── charge.success webhook ─────│
  │                                 │  HMAC verify → amount match →  │
  │                                 │  shared settlement:            │
  │                                 │   full  → confirmed/paid       │
  │                                 │   part  → reserved/partially_paid
  │  poll booking status            │                                │
  │────────────────────────────────▶│  (verify-payment also runs the │
  │  ◀ confirmed ✓                  │   same settlement as a backup) │
```

`payment_kind`: `full` | `deposit` | `balance`. Deposits are only accepted on
bookings with no prior payment; balances only where something is owed. The
webhook and `verify-payment` share **one settlement module**
(`supabase/functions/_shared/booking-settlement.ts`), so the two paths cannot
drift.

---

## Commission engine & fee bearers

One bearer-aware engine (`supabase/functions/_shared/commission-engine.ts`)
serves all three functions. Rates **and who pays each fee** are data, not code
— read from the active `commission_configurations` row:

| Setting | Values | Effect |
|---|---|---|
| `commission_bearer` | owner / student / platform | % commission added to student total, deducted from owner payout, or absorbed |
| `fixed_fee_bearer`  | owner / student / platform | flat booking fee routing |
| `paystack_bearer`   | owner / student / platform | processing fee routing |

The engine **fails closed**: no active configuration row → no quote, no charge.
Admins edit rates, bearers, and deposit policy in
**Admin → System Config → Fee Bearers & Deposits**
(`src/components/admin/BearerAndDepositSettings.tsx`); changes go live within
~60 seconds (engine cache TTL) with no deployment.

Current production configuration (v2.2.0): platform 10% owner-borne, 100 GHS
fixed fee student-borne, Paystack ~1.95% platform-absorbed, VAT 0, agent 0.

> The client-side engine in `src/config/centralized-commission.config.ts` is a
> **display estimate only** and is overwritten by the server quote the moment
> the student reaches the payment step. Never re-introduce it as a price source.

---

## Database (key objects)

**Tables**
- `bookings_enhanced` — bookings, incl. `amount_paid`, `amount_due`,
  `payment_plan` (`full`/`deposit`), `hold_expires_at`.
- `transactions` — server-created payment expectations; **no client INSERT
  policy exists** (forgery closed).
- `commission_configurations` — rates, bearers, deposit policy; single
  `is_active` row is authoritative.
- `payment_webhooks` — idempotency ledger; unique on
  `(paystack_event_id, event_type)`.
- `properties` → `rooms` (via `property_id`; a legacy
  buildings→floors→rooms chain is still readable). `rooms.beds_available` is
  the live inventory.

**Functions (RPCs, SECURITY DEFINER)**
- `create_pending_booking(...)` → picks a room `FOR UPDATE SKIP LOCKED`,
  decrements a bed, captures the rent server-side, returns
  `{booking_id, booking_reference, room_id, property_rent, hold_expires_at}`.
  Errors: `PROPERTY_UNAVAILABLE`, `NO_AVAILABILITY`, `PRICE_UNAVAILABLE`.
- `cancel_booking(booking_id)` — own pending/reserved bookings; releases the bed.
- `expire_stale_bookings()` — cron-only; `pending`→`expired`,
  `reserved`→`deposit_expired`, beds released.
- `release_booking_bed(booking_id)` — internal/service-role only.
- `is_service_context()` — trigger helper (service role / privileged session
  / RPC-local flag).

**Trigger** `trg_protect_bookings_enhanced` on `bookings_enhanced`:
- non-service INSERTs are sanitized to `pending`/`pending`/unpaid;
- non-service UPDATEs touching any payment, financial, or identity column
  raise `42501 BOOKING_PROTECTED_FIELDS`. Benign fields (special requests,
  emergency contacts, metadata) remain editable by the owner of the row.

**Cron** `roomi_expire_stale_bookings` — `*/10 * * * *`.

---

## Edge functions

| Function | verify_jwt | Contract |
|---|---|---|
| `initialize-payment` (v9) | ✅ | Preferred: `{ booking_id, payment_kind, email, dry_run? }` — booking is the sole price source; validates ownership, payable status, unexpired hold. `dry_run` returns the quote without charging. Legacy `{ base_amount, has_agent, metadata.property_id }` retained with strict price validation until all clients migrate. |
| `paystack-webhook` (v8) | ❌ (HMAC-SHA512 over raw body is the auth) | Idempotent via `payment_webhooks`; `charge.success` → amount+currency match against the server-stored transaction → shared settlement. `refund.processed` → transaction refunded, booking cancelled, bed released. Never 5xx after the payload is stored (no retry storms). |
| `verify-payment` (v8) | ✅ | `{ reference }` from the transaction owner; verifies with Paystack, then runs the **same** shared settlement. Acts as the fast path/backup to the webhook. |

Required secrets (Supabase → Edge Functions → Secrets):
`PAYSTACK_SECRET_KEY` (plus the standard `SUPABASE_URL`,
`SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`).
Configure the webhook URL in the Paystack dashboard:
`https://<project>.supabase.co/functions/v1/paystack-webhook`.

---

## Security model

1. **RLS everywhere.** Students read/write their own rows; owners theirs;
   admins via a JWT claim (`is_admin_claim()`), not a client-editable column.
2. **Write-protection trigger** — even where RLS grants UPDATE, financial and
   identity columns are server-only.
3. **No client-authored transactions.** Payment expectations are created
   exclusively by `initialize-payment` with the amount the server computed.
4. **Webhook**: HMAC-SHA512 signature (constant-time compare) + event-level
   idempotency + amount/currency matching before any settlement.
5. **Atomic inventory**: bed decrement inside the RPC with row locking
   (`FOR UPDATE SKIP LOCKED`) — no double-booking race.
6. **Fail-closed pricing**: no active commission config → no charges.
7. Secrets are not in git (`.env` untracked; only the anon key and a Paystack
   *public test* key ever appeared historically — rotate on go-live anyway).

Verified live by DB-level tests executed as the demo student: self-confirm
blocked (`42501`), forged transaction blocked, hold expiry releases the bed.

---

## Local development

```bash
git clone https://github.com/fredyglen/roomie-hostel-booking-platform.git
cd roomie-hostel-booking-platform
npm install
cp .env.example .env        # set VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY,
                            # VITE_PAYSTACK_PUBLIC_KEY (test key)
npm run dev                 # http://localhost:8080
```

**Demo accounts** (test data): `student@roomi.com`, `owner@roomi.com`,
`admin@roomi.com` — password `password123`. Supreme admin:
`admin.rooomie@gmail.com`.

### Tests

```bash
npx vitest run                      # unit + integration (296 tests)
npx tsc -p tsconfig.app.json --noEmit   # type debt baseline: ~1,142 errors,
                                        # build unaffected — do not add new ones
npm run build                       # production build
```

### End-to-end (against the live backend, Paystack TEST mode)

```bash
npm i -D @playwright/test @supabase/supabase-js
npx playwright install chromium
BASE_URL=http://localhost:8080 npx playwright test e2e/booking-payment.spec.ts
```

The spec proves: server-held pending booking, self-confirmation impossible,
authoritative dry-run quote (incl. deposit split), UI reaches a server-issued
Paystack authorization. Complete one manual test-mode mobile-money payment and
confirm the booking flips to `confirmed` **without the browser writing it**.

---

## Deployment

**Frontend** — Vite build (`npm run build` → `dist/`), any static host.

**Edge functions** — deployed per function; `_shared/` is bundled in:
```bash
supabase functions deploy initialize-payment
supabase functions deploy verify-payment
supabase functions deploy paystack-webhook --no-verify-jwt   # HMAC is the auth
```

**Database** — migrations live in `supabase/migrations/`; the two remediation
migrations (`booking_integrity_holds_and_deposits`,
`grant_bed_release_to_service_role`) are **already applied** to ROOMi_v3.

Go-live order matters: functions and DB are already live; ship the frontend
build **before** opening to real users (the old client flow can't display
confirmations, though its writes are safely sanitized to pending holds).

---

## Operations runbook

| Situation | Where to look / what to do |
|---|---|
| Booking stuck `pending` after payment | `payment_webhooks` for the event; `transactions.status`; re-run settlement by calling `verify-payment` with the reference. |
| `transactions.status = 'amount_mismatch'` | Paid amount ≠ server expectation. Booking deliberately NOT confirmed. Investigate, refund via Paystack dashboard. |
| `payment_webhooks.status = 'error'` | Settlement threw after storage; payload is safe. Fix cause, re-trigger via `verify-payment`. |
| `deposit_expired` bookings | Balance deadline missed; bed already released. **Forfeit/refund policy is an owner decision — currently manual admin handling.** |
| Refunds | Issue in Paystack; `refund.processed` webhook cancels the booking and releases the bed automatically. |
| Change pricing / deposits | Admin → System Config → Commission + Fee Bearers & Deposits. Live in ≤ 60 s. |
| Function logs | Supabase dashboard → Edge Functions → Logs (`[initialize-payment]`, `[paystack-webhook]`, `[verify-payment]` prefixes). |

---

## Known debt (non-blocking)

- ~1,142 pre-existing TypeScript errors (build unaffected). Policy: reduce,
  never add.
- Legacy `base_amount` path in `initialize-payment` — remove once all deployed
  clients use the booking-first contract.
- Legacy buildings→floors→rooms chain still supported read-only; new inventory
  should use `rooms.property_id` directly.
- `supabase/functions/geocode-property` exists in-repo but is not deployed.

## License

Proprietary — © ROOMi. All rights reserved.
