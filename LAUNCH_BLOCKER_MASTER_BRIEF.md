# ROOMi — Launch-Blocker Master Brief

**This is the only brief you need. It replaces and supersedes `AUDIT_BRIEF.md` and
`AUDIT_BRIEF_2_DATA_FLOW.md` — read this one, not those; they are kept in the repo
only as dated history of what has already been found and fixed.**

**Owner's mandate, verbatim intent:** ship this platform. Find every remaining
blocker, fix it, and say plainly what still has to happen — including business
decisions only the owner can make — for this to go live with zero blockers. Do
not produce another report that requires a follow-up conversation to act on.
Fix what you can fix. Flag, with a specific question, what you cannot.

**Ground truth date:** 2026-08-29. Everything below was verified against the live
Supabase project (`ymqnbekeqarjmxftzvks`, org `ROOMi_v3`) and commit history on
`main`, not assumed from documentation. Where something could only be checked
statically, it is marked **[VERIFY-LIVE]** — verify it for real before relying on it.

---

## 0. Decisions already made — do not re-ask, build on them

These were litigated in a prior session. Take them as settled.

1. **The commission model is a database setting, not a hardcoded formula.**
   `commission_configurations` now has three columns —
   `commission_bearer`, `fixed_fee_bearer`, `paystack_bearer`, each
   `'owner' | 'student' | 'platform'` — that determine who pays the platform
   commission, the flat fee, and Paystack's processing fee. The rate
   *percentages themselves* (`platform_rate`, `agent_rate`, `paystack_rate`,
   `vat_rate`, `platform_fixed_fee`, `agent_minimum_fee`) were already
   configurable before this session; the bearer columns are new and make the
   *shape* of the formula configurable too. **Do not hardcode who pays what
   anywhere in code.** Read it from the active row.

2. **Current seeded/active model (v2.2.0):** `commission_bearer='owner'`,
   `fixed_fee_bearer='student'`, `paystack_bearer='platform'`. Concretely, for a
   ₵1,500 room: student pays ₵1,600, owner receives ₵1,350, platform nets
   ~₵118.80. This is what the student-facing UI has always displayed. **This is
   the default to preserve** unless the owner changes it in the admin panel described
   in section 3.

3. **The owner wants this adjustable from the super-admin dashboard**, without a
   redeploy, including later realizing the split is wrong and changing it live.
   That requirement is why bearers are data. Build the admin surface for it —
   see section 3. This was explicitly requested and is not optional scope.

4. **Money is computed in exactly one place: the server.** The edge function
   `_shared/commission-engine.ts` is the sole calculator. The browser must never
   compute a charge, a payout, or a fee — only display what the server returns.
   This was the direct cause of the worst bug found this session (section 1) and
   must not be reintroduced anywhere, including in new UI you build for section 3
   or 4.

5. **Partial payments to secure a room ("deposit to hold") are a required
   feature, not a nice-to-have.** This is standard practice in the Ghanaian
   hostel market the owner is building for: a student pays a partial amount to
   lock a bed while they arrange the rest. This does not exist in the codebase
   today in any form. Full requirements in section 5 — this is new scope added
   in this brief, not previously investigated, and needs its own design pass
   before implementation.

---

## 1. What was already found and fixed — verify each still holds, then move on

Do not re-discover these. Do re-verify each is actually true in the live system;
if any has regressed, that itself is a launch blocker.

**Privilege escalation (was live in production).** `is_admin_claim()` accepted an
admin role from `user_metadata.role`, which any account holder can set on
themselves via `auth.updateUser()`. Fixed to read `app_metadata` only.
**[VERIFY-LIVE]** re-run: sign in as a non-admin, attempt
`auth.updateUser({data:{role:'supreme_admin'}})`, then check whether
`is_admin_claim()` still returns false for that session.

**RLS was disabled on four tables**, including `commission_configurations`,
which was readable *and writable* by `anon`. Fixed.

**The build was broken** — archived modules were still imported, `vite build`
failed outright. Restored.

**Card images 403'd platform-wide.** Cause: routed through Supabase's paid
image-transformation endpoint, which this project does not have. Fixed —
opt-in via `VITE_SUPABASE_IMAGE_TRANSFORM`, images compressed client-side on
upload instead.

**The payment amount was fully client-controlled — the most serious finding of
the entire audit process.** `initialize-payment` read zero rows from
`properties`; `base_amount` came straight from client JSON;
`verify-payment` contained the word "amount" **zero times** in 149 lines,
so it could not have compared paid-vs-expected even in principle. A student
could set `base_amount: 1` and receive a confirmed booking for about ₵1.20.
**This is fixed and, per the live edge function inspection below, DEPLOYED —
verify it did not regress:**

- `initialize-payment` (now v8, confirmed live) validates `base_amount`
  against a set of real prices pulled from the property row and its rooms
  (`base_price_per_semester`, `rent`, each room's `rent_amount`); a mismatch
  returns `AMOUNT_MISMATCH` and nothing is charged. The legacy
  client-supplied-total API path returns `LEGACY_API_REMOVED`.
- `verify-payment` and the webhook must independently confirm the amount
  paid via Paystack matches the stored expected amount before marking a
  booking paid. **[VERIFY-LIVE]:** read the currently deployed
  `verify-payment` source directly (`mcp__supabase__get_edge_function` or
  Supabase dashboard) and confirm the amount check is actually present — do
  not trust this document, trust the deployed bytes.
- **Do a real test booking end-to-end before considering payments launch-ready.**
  No one has verified this with an actual card/mobile-money charge yet. Confirm:
  the amount shown to the student in the UI equals the amount Paystack
  actually charges, equals `commission_snapshot.totalAmount` stored on the
  transaction row, equals what the booking ends up recording. All four must
  be the same number to the pesewa.

**Webhook idempotency.** A unique index on
`(paystack_event_id, event_type)` on `payment_webhooks` now exists — confirmed
live. **[VERIFY-LIVE]** whether the webhook handler actually uses
`ON CONFLICT DO NOTHING` (or equivalent) against that index before processing,
or merely has the index sitting unused. An index alone does not make a handler
idempotent if the application code doesn't check it.

**`verification-documents` and `property-documents` buckets are now private**
(confirmed live: `public = false` on both). `property-images` correctly
remains public. Before any real document is uploaded, confirm the RLS/storage
policies on the private buckets actually restrict read access to the
document's owner and admins — a bucket being non-public is necessary but not
sufficient; policy-less private buckets can still be widely readable to any
authenticated user depending on default grants.

**The `role='admin'` orphan profile was repaired to `campus_admin`** in both
`profiles.role` and `auth.users.raw_app_meta_data`. Confirmed live: zero rows
with `role='admin'` remain.

**Commission config v2.2.0 is the single active row**; v2.1.0 (5% + 12.5% VAT +
3.7% agent — a completely different and stale model) is deactivated, not
deleted, preserving the audit trail.

---

## 2. What is done in code but the owner explicitly stopped the deploy for

**Read this section carefully — it describes a live discrepancy between what the
owner believes is true and what is actually true. Resolve the discrepancy, don't
just pick a side.**

During this session, the commission engine was rewritten so that
`commission_bearer` / `fixed_fee_bearer` / `paystack_bearer` are read from the
database and drive the formula (see section 0.1). The owner explicitly declined
to authorize deploying this via an interactive CLI command mid-session.

**However, `initialize-payment` is currently live at version 8** (confirmed via
direct inspection of the deployed function source, not documentation), and its
deployed source **does** contain the bearer-aware engine, the `dry_run` quote
mode, and the price-validation logic from section 1. This means either:

(a) the owner or someone with deploy access shipped it after declining the
    interactive command, or
(b) it was deployed through some other channel this audit didn't see, or
(c) there is a discrepancy in how "deployed" was being tracked and it was
    actually live earlier than believed.

**Do not assume which. Determine it — check Supabase's function deployment
history/logs for `initialize-payment` for exact deploy timestamps and actor,
and reconcile that against git history.** This matters because if the owner
believes a launch-blocking fix is NOT live when it actually IS, that is a
communication failure that could cause a duplicate or conflicting fix attempt;
if it's live but was never actually tested, that's worse — a P0 fix that has
never been exercised against a real payment.

**Action required regardless of how (a)/(b)/(c) resolves:** run one real test
booking through the live system now, today, before anything else, and confirm
the four amounts described in section 1's payment finding actually match.

---

## 3. Build: super-admin commission control panel

Not previously built. This is new scope, fully specified here so no follow-up
question is needed.

**Where:** extend `src/components/admin/CommissionConfigManager.tsx`, which
already exists, is already routed and reachable at `/admin/system` (via
`SystemConfig.tsx`), and already has working update methods
(`updateCommissionRate`, `updatePlatformFee`) that write new versions to
`commission_configurations` in an append-only way (old row deactivated, new
row inserted, audit trail preserved). **Do not build a parallel component** —
this one is real, reachable, and partially functional today.

**What to add to it:**

1. Three selects — Commission bearer, Fixed-fee bearer, Paystack bearer — each
   `owner | student | platform`, wired to the new columns.
2. **A live preview that recalculates as the admin changes any rate, fee, or
   bearer, before they save.** Input: a sample base amount (default ₵1,500,
   editable). Output: "Student pays ₵X, Owner receives ₵Y, Platform nets ₵Z" —
   computed using the *exact same formula* the edge engine uses, not a
   reimplementation. Practically: call `initialize-payment` with `dry_run: true`
   and a synthetic property/amount, or extract the pure calculation into a
   shape that can be imported by both the edge function and this preview
   without duplicating the arithmetic. **Duplicating this formula in a second
   place, even for a "preview," is exactly the mistake that caused the original
   P0 bug (browser and server disagreeing on money math) and must not happen
   again in any form**, including a client-side preview that merely
   approximates the server. If a live server round-trip for the preview is too
   slow for good UX, that's an acceptable reason to solve it differently — but
   "duplicate the formula in TypeScript on the client" is not an acceptable
   solution, full stop.
3. A confirmation step before saving that changes live pricing: show the diff
   between current and proposed (all rates, fees, and bearers), require an
   explicit confirm, and record `changed_by` / `change_reason` (the schema
   already supports this).
4. A visible history/audit view of past commission_configurations rows —
   version, who changed it, when, what changed — so the owner can see the full
   pricing history of the platform, not just the current row.

**Do not let this control panel be reachable by anyone except a real, verified
admin.** Confirm the route is behind `AdminAuthGuard` (it currently is per
`SystemConfig.tsx`'s routing) and that the underlying RLS policy on
`commission_configurations` restricts writes to `is_admin_claim()` — this was
one of the P0 security fixes; do not let new UI accidentally expose a write
path that bypasses it.

---

## 4. Eliminate the browser as a place money gets computed

Twelve non-test call sites in `src/` currently call `calculateCommissions()`
from `src/config/centralized-commission.config.ts` — a second, independent
commission engine that has already drifted from the server engine twice this
year (once on VAT, once on who bears the platform commission). This is not
theoretical risk; it already happened, twice, in a codebase with one owner and
one AI assistant working on it. It will happen again if two engines are allowed
to coexist.

**Call sites to eliminate** (grep for `calculateCommissions(` across `src/`,
excluding `__tests__`/`tests` dirs, to get the current authoritative list —
files move):
`EnhancedBookingForm.tsx`, `BusinessPaymentModal.tsx`, `PaymentCalculator.tsx`,
`useBookingViewModel.tsx`, `useRealTimeCommissionConfig.ts`,
`useBookingService.ts`, `bookingService.ts`, `enhanced-paystack.service.ts`,
`paymentCalculations.ts`, plus `src/examples/portal-integration-examples.tsx`
(check whether this is even shipped or is dead example code — if dead, delete
it rather than fix it).

**Replace with:** one hook, e.g. `useBookingQuote(propertyId, baseAmount,
hasAgent)`, that calls `initialize-payment` with `dry_run: true` (already built
and, per section 2, apparently live) and returns the server's breakdown. Every
UI surface that currently shows a price breakdown to a student or owner must
render this hook's result, not a local calculation.

**`centralized-commission.config.ts` should end this work as a formatter only**
— `formatCurrency`, shared TypeScript types for the breakdown shape, nothing
that does arithmetic on money. If `calculateCommissions()` still exists as a
method with a real formula body anywhere in `src/` (not `supabase/functions/`)
when this is done, that is a failed implementation of this section, not a
partial success.

**Known consumer to fix carefully:** `useBookingViewModel.tsx:160` currently
writes `propertyOwnerAmount: breakdown.ownerReceives` — sourced from the
client engine — directly into booking state, and `pages/admin/Finance.tsx:125`
reads `owner_receives` back out for financial reporting. **This means
client-computed, potentially-wrong numbers may already be sitting in
production financial data.** Two things to do: (1) make this write come from
the server quote going forward, (2) run a data-quality pass on existing
`bookings`/`transactions` rows to identify any whose recorded `owner_receives`
doesn't match what the current server formula would produce for that
`base_amount` — flag these for the owner to review, do not silently
"correct" historical financial records without sign-off.

**Add a CI check, not just a one-time fix:** a grep-based lint (or better, an
ESLint rule) that fails the build if any file under `src/` contains a money
formula — flag patterns like `* rate`, `* 0.0195`, `platformCommission =`,
etc. outside of formatting/display code, or simply forbid re-adding a function
named `calculateCommissions` anywhere under `src/`. The goal is that this
class of bug becomes structurally impossible to reintroduce, not merely absent
today.

---

## 5. NEW REQUIREMENT — partial payment / deposit-to-hold

This is genuinely new scope, added in this brief, not investigated in any prior
session. Design it, then build it. This is real-world behavior in the local
market this platform serves: a student pays a partial amount to secure a
room/bed while arranging the balance, common practice for hostel bookings in
Ghana. **Nothing in the current schema, edge functions, or UI supports this in
any form** — confirm that claim is still true first, then design against it.

**Design questions to resolve — answer them yourself with a recommendation, do
not just relay them back to the owner as an unresolved list, unless a question
is genuinely a business-only call the owner must make (mark those clearly):**

1. **Minimum deposit.** A fixed amount (e.g. ₵200)? A percentage of total rent
   (e.g. 30%)? Configurable per property, or platform-wide? **[OWNER DECISION
   NEEDED]** — recommend a default and flag it for confirmation, don't block on it.
2. **Hold duration.** How long does a room stay reserved after a partial
   payment before the hold expires and the room returns to availability if the
   balance isn't paid? Needs a concrete number (e.g. 48 hours, 7 days) and a
   background job or scheduled function to release expired holds. **[OWNER
   DECISION NEEDED]** on the duration; the mechanism to enforce it is yours to build.
3. **What happens to the room's availability during a hold?** The bed/room
   availability model is already in bad shape platform-wide (see section 6) —
   `beds_available` is 0 on every live property. A hold state has to interact
   correctly with whatever the real availability model ends up being; do not
   bolt this onto the current broken counters without first addressing section 6,
   or the two problems will compound.
4. **What happens if the balance is never paid and the hold expires?** Does the
   student get any of the deposit back? Is it forfeit? Partially refunded? This
   is a genuine business-policy and possibly legal/consumer-protection question
   for a Ghanaian market — **[OWNER DECISION NEEDED]**, flag explicitly, do not
   assume a policy.
5. **Does the deposit count toward the commission calculation immediately, or
   only once the full amount is paid?** i.e., if the platform takes 10% owner
   commission, is that 10% deducted from the deposit as it arrives, or held
   until the booking is fully paid? This interacts directly with the bearer
   model in section 0 — design it as an extension of the same engine, not a
   separate one. **Do not build a third money-calculation path.**
6. **Multiple partial payments, or exactly one deposit + one balance
   payment?** Real-world hostel booking sometimes involves several installments.
   Decide the simplest version that satisfies real need (likely: deposit +
   single balance payment) and design the schema so it isn't a dead end if
   installments are needed later — but do not over-engineer a general
   installment system if it isn't asked for. **[RECOMMEND, don't over-build.]**

**Implementation shape, once the above is resolved:**

- New `booking_status` states (or a new dedicated table) distinguishing
  "deposit paid / holding" from "fully paid / confirmed." Do not overload the
  existing `bookings`/`bookings_enhanced` status field with ambiguous values —
  audit which of those two tables is actually canonical first (there are two
  `Booking` type definitions in `src/types/` per prior findings; determine
  which table backs reality before adding new states to either).
- `initialize-payment` needs a `payment_stage: 'deposit' | 'balance' | 'full'`
  parameter (or equivalent), still validated server-side against the real
  property price — a partial payment must be checked against a real minimum,
  not an arbitrary client-supplied "partial" amount. **The exact same
  amount-tampering vulnerability from section 1 applies here if this is not
  done carefully — a student could otherwise claim to be paying a "deposit" of
  ₵1 for any property.**
- A scheduled job (Supabase cron / pg_cron, or an edge function on a schedule)
  to expire unpaid holds and release rooms back to availability.
- Owner-facing and student-facing UI showing hold status and time remaining —
  where this lives on the student side should follow the priority ordering
  established in section 6 (students first).

---

## 6. Everything else — carried forward from prior investigation, still open

These were found but not fixed. Prioritize by what actually blocks a real
booking from working correctly, not by category.

### 6.1 The data an owner enters mostly never reaches a student — likely the single biggest non-payment blocker to launch

Measured on all live properties **[VERIFY-LIVE — re-run this count, it will
have changed as more properties are added]**:
`beds_available`, `total_rooms`, `beds_per_room`, `washroom_type`,
`emergency_contact_name`, `security_features`, `semester_availability`,
`utilities_included`, `good_to_know` were **populated on zero of the properties
checked**. `base_price_per_semester` was populated on a small minority; most
properties fall back to a `rent` field of unclear billing period.

**Direct consequences:**
- The availability chip on every property card is fed by `beds_available` and
  `max_occupants` — with the former empty, this UI element is decorative, not
  functional, on essentially every listing.
- Listing-page filters (washroom inside/outside, all-inclusive utilities,
  minutes to campus) are backed by columns that are effectively unpopulated —
  **determine whether these filters currently return zero results or silently
  no-op**, and fix whichever is happening; both are bad, differently, and the
  fix differs (a broken filter needs data; a no-op filter is actively
  misleading a student into thinking it filtered when it didn't).
- **Determine definitively whether any student, anywhere in the live system, is
  currently being shown a monthly rent figure labeled `/semester`.** If so this
  is a pricing-accuracy bug of the same severity class as section 1 — it is
  money being misrepresented to a paying customer — not a cosmetic issue, and
  must be fixed before launch, not logged as a backlog item.

**Root cause investigation required, not just patching the symptom:** the
owner-facing property form (`PropertyFormSchema.ts`) defines significantly more
fields than the `properties` table has matching columns for, AND there are at
least four different code paths that can write a property
(`usePropertyCreation.tsx`, `propertyService.ts`, `PropertyNewSimple.tsx`,
`PropertyEditForm.tsx`) which may not agree on what they persist. Determine
which path the *live, currently-shipped* owner form actually submits through,
then produce a field-by-field table: form field → database column (or
explicitly: no column, silently dropped) → what UI surface displays it → is it
populated in production today. This table is the artifact needed to fix this
correctly rather than patching individual symptoms as they're noticed.

### 6.2 Cross-portal sync is mostly absent

Admin approving a property's verification writes `verification_status` and
invalidates only its own query cache key (`['admin-verifications']`). The
owner's dashboard and the student-facing listing hold separately-cached queries
under different keys and are never told the status changed — an owner
currently has to hard-reload to see their property go from "pending" to
"approved," and a student's visible listings do not update in response to an
approval in real time. A `CrossPortalInvalidationService` already exists
(~380 lines, with a `QUERY_KEYS` registry) and is used by exactly two files,
both unrelated student-side forms — it appears to be the intended solution
that was built and then never actually adopted for the flows that need it most.
**Adopt it (or replace it with Supabase Realtime subscriptions if that's a
better fit — make a real engineering call, don't just wire up the existing
half-built thing reflexively if it's the wrong tool) for at minimum: property
verification status changes, booking status changes, and bed/room availability
changes** — these three are the state transitions where a student or owner
seeing stale data directly causes lost bookings or owner confusion.

### 6.3 Identity has five conflicting definitions

`UserRole` is defined five separate, disagreeing ways across the codebase
(`src/types/auth.ts`, `src/types/core.ts`, `src/types/roles.ts`,
`src/types/platform-core.ts`, and a dead file in a since-deleted `BE
CONSCIOUS` folder — confirm that dead one is actually gone post-cleanup).
`Booking` has six definitions, `Property` has two. This already had one
concrete, live victim (an admin profile with an invalid role that was neither
routed correctly nor authorized correctly — repaired per section 1, but the
*root cause*, the five conflicting type definitions, was not). Generate
TypeScript types from the live database schema and make that the single
source of truth; delete the hand-written duplicates as each is migrated over.
This is structural work, not a quick patch, and it's the reason bugs like the
role-repair issue keep recurring in different forms — fixing this class of
problem once, structurally, is worth more than fixing its next five individual
symptoms.

### 6.4 1,165 TypeScript errors, and code that is more broken than that number suggests

`tsc --noEmit` currently reports **1,165 errors**
**[VERIFY-LIVE — re-run, this repo has active work happening on it]**. The most
common single error class is "property does not exist on type" — which is
exactly the error class that would have caught the dropped-`fees`-object
commission bug found and fixed this session, had CI been running `tsc` at the
time it was introduced. There is currently no CI and no pre-commit hook
running `tsc`, tests, or a build — nothing mechanically prevents a broken
build or a wrong-money-math bug from being committed and shipped, which is how
several of the bugs in this document were introduced in the first place. **Set
up CI (GitHub Actions or equivalent) that runs `tsc --noEmit`, `vitest run`,
and `vite build` on every PR, at minimum as a required check before merge to
`main`.** Do not attempt to fix all 1,165 errors before launch — that is not
realistic and not necessary. Do: (a) ensure the count cannot silently increase
from here forward (a ratchet: fail CI if the count on a PR exceeds the count on
main), (b) prioritize burning down errors specifically in files that touch
money, auth, or booking state, since that's where a type error is most likely
to indicate a real bug rather than a cosmetic annoyance.

### 6.5 Two migration directories, neither of which is fully the schema

`supabase/migrations` and `database/migrations` both exist; code references
tables that exist in the live database but were created by neither directory
(meaning some prod schema was applied by hand, outside version control), and
other migrations create tables that were apparently never applied to
production at all (a "dynamic property content" feature has a full service
layer and multiple components built against a schema that doesn't exist live —
either finish applying it or delete the feature; do not ship it half-built,
that's the worst of the three options). **Before launch: pick one directory as
authoritative, `supabase db pull` a real baseline from the live database as a
new migration zero, retire the other directory, and from that point forward
every schema change must go through a committed migration — no more hand-applied
production schema changes.** This is a precondition for trusting any future
RLS review, since a policy audit is meaningless if the reviewed migrations
aren't provably what's actually running.

### 6.6 Repo hygiene — already substantially cleaned, confirm and finish

A prior pass removed 226 stale files (self-labeled "to be deleted" folders,
outdated phase-completion reports, a 460MB and a 7.7MB generated dump that had
no business being committed, docs folders that were living inside `src/` and
being walked by the bundler). Markdown count went from 308 to ~103.
**[VERIFY-LIVE]** that this cleanup is still intact (re-run the file counts;
if new sprawl has re-accumulated, note what and clean it again — this class of
problem tends to recur if nothing structurally prevents it, e.g. a repo
convention doc or a `.github` PR template reminding contributors where docs
belong). Not a launch blocker on its own but continues to slow down every
other investigation in this document, including this one.

---

## 7. What "zero blockers to launch" actually requires — your synthesis, not a checklist to relay

Do not simply reproduce the sections above as a punch list back to the owner.
Produce:

1. **A hard launch gate**: the minimum set of items from sections 1–5 that
   must be true, verified live, before the first real student pays real money
   for a real room. Be opinionated and specific — "payments are correct" is not
   a gate, "a real ₵X booking was completed end-to-end and the amount charged,
   the amount recorded, and the amount displayed to the student all match to
   the pesewa" is a gate.
2. **A short list of genuine business decisions only the owner can make**
   (flagged `[OWNER DECISION NEEDED]` throughout section 5, plus the
   commission-bearer default from section 0.2 if it's to change), presented
   together, once, so the owner answers them in a single pass rather than
   being asked piecemeal across multiple conversations.
3. **Everything else — fix it.** Sections 3, 4, and the implementation half of
   section 5 are build work with enough specification in this document to
   execute without further clarification. Section 6 is prioritized
   investigation-plus-fix work; use engineering judgment on sequencing but do
   not leave section 6.1 (data that never reaches students) unaddressed before
   calling this launch-ready — a booking platform where listings don't show
   real availability or accurate pricing is not launchable regardless of how
   correct the payment plumbing is underneath it.

**Work until zero blockers remain. Report back once, at the end, with: what was
fixed, what was decided and why, what genuinely still needs the owner's
input (list, not narrative), and confirmation that a real test booking was
completed successfully end-to-end.**
