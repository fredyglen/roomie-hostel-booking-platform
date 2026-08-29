# ROOMi — Deep Technical Audit Brief

Hand this to a senior engineer, or paste it as the opening prompt for an AI agent
with repo and database access.

---

## Your mission

Perform an exhaustive technical audit of ROOMi, a student housing marketplace for
Ghana, and produce a prioritised remediation plan a small team could execute over
the next quarter.

I do not want reassurance, and I do not want a list of style nits. I want to know
what is actually broken, what is silently costing money or trust, what is dead
weight, and what order to fix it in. Where you find something serious, prove it —
run the query, run the build, show the failing output.

---

## The stack

| | |
|---|---|
| Frontend | React 18 + Vite 5 + TypeScript, Tailwind + shadcn/ui, React Router, TanStack Query |
| Backend | Supabase — Postgres + RLS, Auth, Storage, 6 Deno edge functions |
| Payments | Paystack (Ghana), commission engine in `src/config/centralized-commission.config.ts` |
| Users | students, property owners, admins (`supreme_admin`, `campus_admin`) |

## The scale

| | |
|---|---|
| Tracked files | 1,099 |
| TS/TSX under `src/` | 606 files, **118,572 LOC** |
| Components / pages / hooks | 297 / 81 / 68 |
| Markdown docs in repo | **307** |
| Migration directories | **two** — `supabase/migrations` (26), `database/migrations` (6) |
| Edge functions | 6 |
| Type errors from `tsc --noEmit` | **1,165** |
| Test suite | 303 passing, 5 failing |

---

## Ground rule: trust nothing that is written down

**This is the single most important instruction in this brief.** This repo's own
documentation has been wrong repeatedly, in ways that caused real damage:

- `DEAD_CODE_ARCHIVE_MARKED_FOR_DELETION/ARCHIVE_NOTE_RESTORED_FILES.md` states
  that four archived modules had "verified no active imports found". All four were
  actively imported. Archiving them **broke the production build entirely.** The
  note then repeats the same claim in the paragraph explaining the first mistake.
- A prior audit reported "180 type errors". The real number is **1,165**.
- Two committed migrations (`202510240010`, `202510240012`) claim to harden admin
  checks. Both are logically broken — they `coalesce()` over three checks, and the
  top-level `role` claim is always present (`'authenticated'`), so the first check
  short-circuits and the intended source is never read. Applying either locks out
  every admin.

Verify every claim, including the ones in this brief. Where you disagree with
something here, say so and show the evidence — that is more valuable than agreement.

---

## Already investigated — do not redo, but do verify

These were found and fixed recently. Confirm the fixes hold, then move on.

**Privilege escalation (was live in production).** `is_admin_claim()` accepted the
admin role from `user_metadata.role`, which any account holder can set on
themselves via `auth.updateUser()`. Any signed-in user could become
`supreme_admin`. Fixed to read `app_metadata` only.

**RLS disabled on four tables**, including `commission_configurations`, which was
readable *and writable* by `anon` — meaning anyone holding the publishable key that
ships in the client bundle could rewrite the platform's fee structure. Fixed.

**Build was broken.** Archived modules were still imported; `vite build` failed on
the first unresolved import. Restored.

**Card images 403'd platform-wide.** Images were routed through Supabase's
`/storage/v1/render/image/...` transform endpoint, which is a **paid add-on this
project does not have** — every request returned `403 FeatureNotEnabled`, and cards
silently fell back to a placeholder while detail pages looked fine. Now opt-in via
`VITE_SUPABASE_IMAGE_TRANSFORM`, with client-side compression on upload instead.

**Commission config dropped fields.** `loadConfigurationFromDatabase()` replaced the
whole `fees` object with two of its four keys, so `platform: 80` and
`processing: 20` became `undefined` on every app boot — the exact values the UI uses
to show students the fee breakdown.

---

## Known-open issues — your starting points, not your scope

**1. Production commission rates do not match the code.**
The active DB row (v2.1.0) charges 5% platform + 12.5% VAT + 3.7% agent. The code
(`centralized-commission.config.ts`) declares the Phase 1 model: 10% platform, no
VAT, no agent. The unit tests were aligned to the code; **the database was not.**
A migration exists at `supabase/migrations/20260828000001_*.sql` and is deliberately
unapplied. Determine which model is commercially correct, then make all three agree.
Trace every code path that reads a rate — including the Deno edge functions, which
may compute independently of the frontend engine.

**2. Five failing tests encode a fourth commission model.**
`src/tests/integration/adminRateChangePropagation.test.ts` asserts a *configurable*
VAT (`beforeVat * 0.15`), but `calculateCommissions()` hardcodes `vatAmount = 0`.
These cannot pass as written. Decide whether VAT is a real requirement or dead, and
delete or fix accordingly.

**3. Identity is defined five different ways.**
`UserRole` has **5 definitions** across `src/types/auth.ts`, `src/types/core.ts`,
`src/types/roles.ts`, `src/BE CONSCIOUS/platform-definitions.ts` and others. They
disagree: some include `'admin'` and `'agent'`, the auth context's does not.

This has a live victim. `AuthRedirect.tsx` switches on `'admin'` and `'agent'` —
neither exists in the union the auth context uses — so both branches are dead code.
There is a profile in the database with `role = 'admin'`, which therefore falls
through to the student portal *and* fails `is_admin_claim()`. That account is an
admin who is neither routed nor authorised as one.

`Booking` has **6 definitions**. `Property` has 2. Find the rest.

**4. Storage buckets `verification-documents` and `property-documents` are public.**
Both are empty today. The moment an ID document or ownership paper is uploaded, it
is world-readable to anyone who can guess the path. Fix before verification ships.

**5. Phantom database objects.**
Code references tables that do not exist in the live database — the dynamic property
content feature has a full service layer and 8 components, but its schema migration
was never applied. Enumerate every table, column, RPC and bucket the code references
and diff that against the live database in both directions.

**6. Orphaned data.** Three `compounds` rows exist; **zero** properties link to any
of them (`compound_id` is null everywhere, `beds` is empty). Either the feature was
abandoned mid-build or the linkage is broken. Find out which.

---

## What to audit

### A. Database and RLS
- Full schema review: tables, columns, types, constraints, indexes, FKs. Flag
  missing constraints that let bad data in, and unused indexes costing writes.
- **Every RLS policy, read against the actual threat model.** For each table ask:
  what can `anon` do? A logged-in student? An owner, against *another* owner's rows?
  Test with real JWTs, not by reading policy text.
- Reconcile the **two migration directories**. Which is authoritative? What is
  applied to production but absent from both? What is committed but never applied?
- `SECURITY DEFINER` functions: who can execute them, and what do they bypass?
- Money integrity: can a booking exist without a payment? A payment without a ledger
  entry? Are there transactions that should be atomic but are not?

### B. Backend and edge functions
- Review all 6 Deno functions. Do they duplicate frontend business logic — commission
  math especially — and can the two disagree?
- Webhook handling: is Paystack signature verification present and correct? Are
  webhooks idempotent? What happens on replay or out-of-order delivery?
- Secrets handling, error handling, timeouts, retries.

### C. Frontend architecture
- **Dead and duplicate code.** There are at least three competing landing pages
  (`Landing.tsx`, `ModernHomepage.tsx`, `OwnerLanding.tsx`) plus a newer
  `StudentLanding.tsx`. 80 page files exist against 72 declared routes. Find every
  unrouted page, unimported component, and unused hook.
- **Duplicated logic.** Example: `PremiumPropertyCard` reimplements the same
  image-resolution and URL-safety rules as `deriveCoverImageFromProperty`, and the
  two now disagree about localhost. Find the rest of this pattern.
- The **1,165 type errors**. Categorise them. How many mask real bugs? (At least one
  did — see the commission `fees` bug above.) Produce a realistic path to
  `tsc --noEmit` passing, then gate CI on it.
- Data fetching: TanStack Query usage, cache invalidation, N+1 patterns, waterfalls.
- Bundle: `vendor` is 653 KB. What is in it, and what should be lazy?

### D. The three portals
Audit student, owner and admin separately, end to end:
- Can each role reach only what it should? Test by URL manipulation, not by UI.
- Is every feature actually wired to real data, or are there mock/placeholder paths
  still live in production?
- Trace the critical journeys fully: **search → view → book → pay → confirm**, and
  **owner: list → verify → publish → get paid**. Where do they break?

### E. Middleware and cross-cutting concerns
- Auth: session handling, token refresh, race conditions on load, redirect loops.
- Error handling: is there a real strategy, or scattered `try/catch`?
- Logging: what reaches production, and does any of it leak PII?
- The anonymous viewing-limit system (`usePropertyViewingTracker`) — it is
  `localStorage`-backed, so trivially bypassed. Is that acceptable?

### F. Dead weight and hygiene
- **307 markdown files.** Most are almost certainly stale AI-generated status
  reports. Identify the few worth keeping, delete the rest.
- **`src/paystack docs/`** — a 258-file documentation folder living *inside* `src/`,
  with a space in its name, 75 files tracked. It is walked by the bundler and
  typechecker. It does not belong in `src`.
- `DEAD_CODE_ARCHIVE_MARKED_FOR_DELETION/`, `src/BE CONSCIOUS/`, and similar folders.
- `.env` is tracked. Everything in it is `VITE_*` (so client-public by construction,
  not a true secret leak) — but confirm no server key has ever been committed, and
  check history.
- A **460 MB** generated dump (`FORENSIC_AUDIT_INDEPENDENT.md`) was committed and had
  to be removed from history to make pushes work. Look for other artifacts like it.
- No CI. No pre-commit hooks. Nothing runs `tsc` or the test suite automatically.

---

## Deliverables

**1. Executive summary (1 page).** Is this codebase salvageable or should parts be
rewritten? Be direct. If a rewrite of a subsystem is genuinely cheaper than repair,
say so and justify it with numbers.

**2. Findings register.** Every issue with: severity (P0 blocks launch / P1 breaks
correctness / P2 slows the team), the evidence that it is real, blast radius, and
estimated effort. Order by severity, not by area.

**3. A sequenced remediation plan.** Not a list — a sequence, with dependencies
made explicit. What must happen before what, and why. Assume a small team.

**4. A deletion list.** Explicit paths, with the evidence that each is genuinely
unreferenced. Given the archive incident above, `grep` before you recommend deleting
anything, and say so in the entry.

**5. Architecture direction.** Where should this codebase be in six months? What are
the two or three structural decisions that would most reduce the ongoing cost of
change? The recurring failure mode here is *no single source of truth* — five user
models, two migration directories, three landing pages, four commission models —
so proposals that collapse duplication are especially welcome.

---

## What good looks like

- Every serious claim backed by a command, query, or output you actually ran.
- Numbers, not adjectives. "1,165 type errors, 40% in `src/services`" beats
  "type safety is poor".
- When you are uncertain, say so explicitly rather than hedging everything.
- Tell me what you would do first on Monday morning, and why that and not something
  else.
