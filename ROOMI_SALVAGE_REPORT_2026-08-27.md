# ROOMi — Salvage Report

**Date:** 2026-08-27
**Branch:** `RECOVERED-8TH-JULY-26`
**Supabase project:** `ymqnbekeqarjmxftzvks` (live)
**Scale:** ~105k LOC, 599 TS/TSX files, 80 routed pages

**Method — everything below is first-hand, not inferred from the repo:** live
PostgREST/GoTrue/Edge-Function probes against the running project using the credentials in
`.env`; a full `tsc --noEmit`; a real `vite build`; the `vitest` suite; and a whole-repo
import-resolution scan.

---

## VERDICT: KEEP IT

You asked whether to delete this after heavy spend on AI coding tools. **No.**

The expensive, hard-to-rebuild parts are intact: a live database holding real data,
row-level security that actually works, deployed payment functions, and a working
auth/routing shell.

What is broken is shallow and specific. **The app cannot build because a previous AI
"cleanup" pass moved four still-imported files into an archive folder.** That folder's own
note admits the error:

> "The CODEBASE_AUDIT.md audit incorrectly marked some files as dead."
> — `DEAD_CODE_ARCHIVE_MARKED_FOR_DELETION/ARCHIVE_NOTE_RESTORED_FILES.md`

Restoring those four files is most of the fix.

The one finding that costs you real money is separate, and smaller than you'd fear: one
wrong number in one database row means **every booking currently under-charges commission
by half.**

### Vital signs

| Check | Result |
|---|---|
| Production build | **FAILS** (exit 1, missing module) |
| Broken imports | **20** across 15 files |
| TypeScript errors | **180** across 39 files (never checked at build time) |
| Unit tests | **288 / 305** pass — 17 failures, all commission |
| Database | **LIVE**, RLS enforcing, no data leak |
| Disk free | **58 MB of 238 GB** — corrupts builds silently |

---

## What you'd be throwing away

- **The database is alive.** GoTrue v2.195.0 responding, anon key valid, PostgREST serving.
- **Row-level security actually works.** As an anonymous caller, `profiles`,
  `bookings_enhanced`, `transactions` and `payments` all returned **zero rows**.
- **Real data, not fixtures.** 13 properties, 11 distinct owners, 87 rooms, 6 buildings,
  6 floors, 3 compounds — with clean image URLs (no `blob:`/localhost leftovers).
- **Payments infrastructure is deployed.** 4 of 5 edge functions live
  (`initialize-payment`, `verify-payment`, `paystack-webhook`, `create-demo-users`).
  Every secret correctly server-side via `Deno.env` — none in client code.
- **The test suite mostly passes** — 288/305, every failure tracing to one known disagreement.
- **The shell works.** 80 routed pages, lazy-loaded, Sentry and Paystack wired in.

---

## P0 — SECURITY: two live holes, found by direct DB inspection 2026-08-27

Neither of these is visible from the code alone. Both were confirmed against the production
database, not inferred.

### 0a. Any signed-in user can promote themselves to supreme admin  ← most severe finding

`public.is_admin_claim()` — the function guarding every admin RLS policy — accepted the admin
role from **three** JWT sources, one of which the account holder controls:

```sql
(claims #>> '{app_metadata,role}')  in ('supreme_admin','campus_admin')   -- server-controlled, fine
(claims #>> '{user_metadata,role}') in ('supreme_admin','campus_admin')   -- USER-CONTROLLED
(claims ->> 'role')                 in ('supreme_admin','campus_admin')   -- always 'authenticated'
```

`user_metadata` is writable by the user it belongs to:

```js
await supabase.auth.updateUser({ data: { role: 'supreme_admin' } })
```

After that call the next issued JWT satisfies `is_admin_claim()`, which grants read/update/delete
on **every property**, read on **every profile** (82 rows), and read on **every booking**.

The mechanism is already in routine use — `handle_new_user` reads `raw_user_meta_data->>'role'`
at signup, so **80 of 82 accounts already carry a `role` key in user_metadata**. Nothing exotic
is required; the field is part of the normal signup path.

Measured before writing the fix:

| Admin provisioning route | Accounts |
|---|---|
| `app_metadata.role` (server-controlled) | 1 |
| `user_metadata.role` (user-controlled) | **0** |

Because no admin depends on the user-controlled branch, removing it locks out nobody.
Fix: `supabase/migrations/20260827154130_harden_is_admin_claim.sql`.

> **Do not apply `202510240010` or `202510240012`.** Both rebuild `is_admin_claim()` with
> `coalesce()` over the three checks. `coalesce` returns the first **non-NULL** value, and the
> top-level `role` claim is always present (`'authenticated'`), so the first check evaluates to
> `false`, `coalesce` stops there, and `app_metadata` is never read. Either file denies **every**
> admin. The live definition was better than both; the migration above supersedes all three.

### 0b. Four tables have RLS switched off — one is the commission table

Supabase's security advisor returns four `rls_disabled_in_public` **ERROR**s:

| Table | Rows | Exposure via the anon key shipped in the client bundle |
|---|---|---|
| **`commission_configurations`** | 1 | **read *and write*** — anyone can rewrite your live rates |
| `booking_roommates` | 0 | roommate name, email, phone, student id (PII) |
| `payment_distributions` | 0 | per-party payout amounts |
| `properties_backup_before_blob_cleanup` | 11 | full copy of properties, no PK, no RLS |

`commission_configurations` reframes finding #3 below. The concern there is that the row holds
the wrong numbers. The larger problem is that **the row is writable by the public** — the
frontend itself writes it through the browser client
(`src/config/centralized-commission.config.ts:490-509`), so the write path was never privileged.
Correcting the rate without enabling RLS fixes nothing durable; the next person with your
publishable key can set it back.

Fix: `supabase/migrations/20260827153957_enable_rls_on_exposed_tables.sql`.

### 0c. A blanket `USING (true)` has been cancelling your scoped policy

RLS *is* enabled on `properties` — the earlier read of "RLS works" was right about that. But
migration `202510220003` added a properly scoped public-read policy without dropping the older
`"Anyone can view properties"` policy, whose expression is just `true`. Permissive policies OR
together, so **the scoped policy has been dead code since the day it landed**: unverified,
unavailable and soft-deleted rows are all publicly readable. Same pattern on `compounds`.

Currently 12 of 13 properties are legitimately public, so today's leak is one row — but the
control you believe you have is not in force. Fix:
`supabase/migrations/20260827154039_properties_policy_cleanup.sql`.

---
## P0 — BLOCKING: the app cannot build or deploy

### 1. An AI cleanup archived files the code still imports

```
$ npx vite build
error during build:
[vite:load-fallback] Could not load src/services/queryInvalidation
  (imported by src/components/student/MaintenanceRequestForm.tsx)
  ENOENT: no such file or directory
[exited with code 1]
```

That is the *first* failure, not the only one. A whole-repo scan found **20 unresolvable
imports across 15 files**, resolving to 7 missing modules. Four already exist in
`DEAD_CODE_ARCHIVE_MARKED_FOR_DELETION/`. I verified their exports against every import
site — they match exactly.

| Restore to | Status | Unblocks |
|---|---|---|
| `src/services/queryInvalidation.ts` | in archive, 382 ln | MaintenanceRequestForm, PropertyReviewForm |
| `src/services/realTimeBedAvailabilityService.ts` | in archive, 411 ln | 4 files — bed availability on all property cards |
| `src/services/dynamic-property-content.service.ts` | in archive, 515 ln | useDynamicPropertyContent |
| `src/types/dynamic-property-content.ts` | in archive, 374 ln | 8 files in `components/owner/property-content/` |
| `src/components/owner/property-form/FormSection.tsx` | **genuinely gone** | BasicInfoFields, VerificationFields |
| `src/components/ui/combobox.tsx` | **genuinely gone** | BasicInfoFields (shadcn has a standard recipe) |
| `@/config/supabase` | **wrong path** | `data-seeder.ts` → repoint to `@/integrations/supabase/client` |

Two more files crash the moment they render, independent of the build:

- `src/components/common/LazyLoadWrapper.tsx` — `LazyImage` calls `useState`, `useRef` and
  `useEffect` that are **never imported**. Guaranteed `ReferenceError`.
- `src/components/owner/property-form/TagBasedAmenitiesSelector.tsx` — references undefined
  `amenityCategories`, `searchTerm`, `activeCategory`.

### 2. The machine is out of disk

**58 MB free of 238 GB.** Not an app bug, but it silently corrupts `npm install`, vite
builds and git — my first commands this session died with `No space left on device`. Any
recent build result is untrustworthy until this is cleared.

```
AppData\Local      39.1 GB
AppData\Roaming    21.4 GB
Downloads          19.5 GB
PROJECTS           10.9 GB   (this repo: 0.4 GB)
```

---

## P1 — CORRECTNESS: money and schema

### 3. Three sources disagree about your commission  ← highest-value fix

`src/config/centralized-commission.config.ts` hardcodes a "Phase 1 / v2.0.0" model, but at
line 439 it loads its rates **at runtime** from the `commission_configurations` table. That
live row is a different, older model — still `is_active: true`, `environment: "production"`.
The tests assert a third model again.

| Source | Platform | VAT | Agent | Owner receives |
|---|---|---|---|---|
| Code constant (v2.0.0) | 10% | 0% | 0% | base − 10% |
| **Live DB row — what actually runs** | **5%** | 12.5% | 3.7% | **base − 5%** |
| Unit tests | — | 12.5% | 3.7% | full base |

```
AssertionError: expected 1425 to be 1500
  > expect(result.ownerReceives).toBe(baseAmount)
AssertionError: expected 1100 to be close to 1150
AssertionError: expected 1100 to be close to 1121.45
AssertionError: expected  150 to be close to  171.45
```

> ### DECISION RECORDED (yours, 2026-08-27)
>
> **The v2.0.0 code model is correct** — owner pays **10%**, **no VAT**, agent disabled,
> student pays rent + GHS 100. The live DB row and the tests are therefore both wrong and
> must be brought up to the code:
>
> 1. Insert a **new active** `commission_configurations` version at `platform_rate 0.10`,
>    `vat_rate 0`, `agent_rate 0` — rather than mutating the existing audit row.
> 2. Rewrite the 17 assertions in `src/tests/unit/centralizedCommissionEngine.test.ts` to
>    expect `ownerReceives === baseAmount - 0.10 * baseAmount` and `vatAmount === 0`.
>
> **Until step 1 ships, every booking under-charges commission by half.**
>
> **CORRECTION (DB-verified 2026-08-27):** that last line overstates it. `bookings_enhanced`,
> `bookings`, `transactions`, `payments` and `payment_distributions` are **all empty** — zero
> rows each. No booking has ever been recorded, so no money has been mischarged. This is a
> pre-launch correctness fix, not an active revenue leak, and it can be sequenced behind the
> P0 security items above. The *urgent* half of this finding is 0b: the table is publicly
> writable, so fixing the number without enabling RLS does not hold.

Separately: `.env` sets `VITE_APP_BASE_URL` to port **8080** while `vite.config.ts` serves on
**5173** — Paystack callback URLs will not resolve in local testing.

### 4. The code queries four tables that don't exist

```
admin_jurisdictions     404  relation "public.admin_jurisdictions" does not exist
reviews                 404  relation "public.reviews" does not exist
student_verifications   404  relation "public.student_verifications" does not exist
admin_audit_log         404  relation "public.admin_audit_log" does not exist
```

Every feature touching these throws at runtime. `student_verifications` is the telling one —
it appears in **no migration anywhere** in the repo. It was invented directly into the client
code and never existed.


> **CORRECTION (DB-verified 2026-08-27).** All four are confirmed absent — but two of them have
> a traceable origin, and two are near-misses of tables that *do* exist:
>
> - `admin_jurisdictions` and `admin_audit_log` are both created by
>   `database/migrations/003_admin_authentication_schema.sql`, which was **written but never
>   applied** (see #5). They are not invented — they are stranded.
> - `reviews` and `admin_audit_log` shadow real live tables named **`property_reviews`** and
>   **`payment_audit_log`**. Some of these call sites may be renames rather than rewrites.
> - `student_verifications` remains genuinely invented — it appears in no migration in either
>   directory.

### 5. Your migrations were never applied

`supabase/migrations/202511020001_properties_add_coordinates_and_nearby_function.sql` adds
`latitude`/`longitude` plus a `properties_nearby` RPC. The database has neither.

```
properties?select=latitude    400  column properties.latitude does not exist
rpc/properties_nearby         404  could not find the function
functions/v1/geocode-property 404  NOT_FOUND — never deployed
```

Map and "nearby" search are entirely dead. **Treat every migration in this repo as unapplied
until proven otherwise.** It does not help that there are two competing migration systems —
`supabase/migrations/` (20 files) and `database/migrations/` (6 files) — defining overlapping
objects, with neither authoritative.

> **CORRECTION (DB-verified 2026-08-27).** "Never applied" is too strong, and the migration
> ledger is not a reliable guide. The ledger records 13 migrations, but several unrecorded ones
> were clearly applied by hand through the SQL editor — `rating`, `review_count`, `good_to_know`,
> `compound_id`, the `compounds`/`beds` tables and `is_admin_claim()` are all live despite being
> absent from it. Each file below was checked against actual schema objects rather than the ledger.
>
> **`supabase/migrations` — the 7 not in the ledger:**
>
> | Migration | Real status |
> |---|---|
> | `202510240002_properties_add_missing_columns` | ❌ not applied — `cover_image_url`, `current_occupancy`, `agent_id` absent |
> | `202510240010_admin_claim_based_policies` | ✅ applied out-of-band — **but its function is broken, see 0a** |
> | `202510240011_backfill_property_verifications_pending` | ✅ satisfied — 0 pending properties lack a row |
> | `202510240012_fix_is_admin_claim_role_path` | ⚠️ **superseded — do not apply, see 0a** |
> | `202511020001_..._coordinates_and_nearby_function` | ❌ not applied — **and broken, see below** |
> | `20251105_add_rating_columns_to_properties` | ✅ applied out-of-band — columns + all 3 indexes live |
> | `20251105_compounds_and_beds_CORRECT` | ✅ applied out-of-band — all 3 tables + policies live |
>
> **`database/migrations` — essentially all unapplied:**
>
> | Migration | Real status |
> |---|---|
> | `001_dynamic_property_content_schema` | ❌ none of its 10 tables exist |
> | `003_admin_authentication_schema` | ❌ not applied — **source of 2 of the 4 phantom tables in #4** |
> | `004_fix_property_sync` | ❌ not applied — **and cannot run:** line 76 uses `CREATE POLICY IF NOT EXISTS`, which PostgreSQL has never supported. It also declares `images`/`amenities` as `JSONB` where live is `text[]`, and `available_from`/`available_to` as `TEXT` where live is `date`. |
> | `add_good_to_know_field` | ✅ applied — column + index live |
> | `drop_duplicate_fk_properties_owner_id_fkey` | ❌ not applied — see below |
> | `deprecate_legacy_bookings_table` | ❌ not applied (`bookings` is empty, so a no-op) |
>
> **`supabase/migrations/` is authoritative.** It is the directory the ledger tracks and the one
> the live schema actually reflects. `database/migrations/` is a parallel experiment that landed
> exactly one change. That answers where the phantom tables came from: the client was written
> against a schema that only ever existed in the second directory.
>
> **`202511020001` would not have worked even if applied.** `properties_nearby` selects `p.price`
> and `p.type`; the live columns are `rent` and `property_type`. A plpgsql body is not
> name-checked at creation, so it would install cleanly and throw on first call. Rewrite it
> against real column names before applying.
>
> **Bonus, unrelated to any migration:** `properties.owner_id` carries **two** foreign keys —
> `fk_properties_owner` → `profiles(id)` and `properties_owner_id_fkey` → `auth.users(id)`.
> PostgREST cannot resolve an embed like `properties?select=*,profiles(*)` and returns HTTP 300.
> The cascade chain survives dropping the second (`auth.users`→`profiles`→`properties`), so the
> one-line fix in `database/migrations/` is correct — it is just sitting in the wrong directory.
> Folded into `supabase/migrations/20260827154218_schema_hygiene.sql`.

### 6. Stale types are why all of this compiles

`src/integrations/supabase/types.ts` defines **17 tables**. The code queries **28**. That
eleven-table gap is untyped, which is exactly why phantom tables and missing columns sail past
the compiler and only fail in a user's browser.

Regenerating types from the live DB converts this whole class of bug from a runtime surprise
into a compile error. Highest-leverage single command in this report.

---

## P2 — ARCHITECTURE ROT: why iteration keeps costing you

### 7. Five incompatible definitions of what a user is

- `src/types/auth.ts` → `student | owner | supreme_admin | campus_admin`
- `src/types/core.ts` → `owner | student | admin | agent`
- plus `src/types/roles.ts`, `src/types/platform-core.ts`, `src/BE CONSCIOUS/platform-definitions.ts`

Not cosmetic: `AuthRedirect.tsx` and `LoginRedirect.tsx` fail to compile because `"admin"`
isn't in the union they can see. **Role-based routing is not trustworthy** until there is one
definition.

### 8. Five parallel property service layers

~1,800 lines doing the same job five ways: `src/api/propertyService.ts` (**zero importers —
entirely dead**), `services/propertyService.ts`, `enhanced-property.service.ts`,
`propertyDataService.ts`, `propertyPipeline.ts`. Booking and payment are duplicated the same way.

This is the mechanism behind the spend: each new AI session must work out which layer is real
before it can change anything, and often guesses differently than the last one.

### 9. 1,093 type errors ship silently

Vite + SWC strips types without checking them, so none of these stop a build. Adding
`tsc --noEmit` as a pre-build step is what stops new ones arriving.

> **CORRECTION (measured 2026-08-28).** The figure in the original report was **180**. A direct
> `npx tsc --noEmit` on the untouched tree returns **1,093** errors -- six times higher. The 180
> figure appears to have come from a partial or aborted run; there is no `type-check` script in
> `package.json`, so it was ad-hoc. Concentrations by area: `src/services` 392, `src/components`
> 242, `src/pages` 155, `src/hooks` 150, `src/config` 101.
>
> After the step-5 restores the count is **1,166**. The +73 is not new breakage: those modules
> were previously unresolvable, so their call sites failed with "cannot find module" (one error
> per site) and their internals were never checked at all. Restoring them converts a build-stopper
> into ordinary type errors.
>
> **This is not a cosmetic backlog.** A concrete bug it was hiding was found and fixed this
> session -- see "Bug found while realigning the commission tests" below. `fees` is declared with
> four required fields; the DB loader assigned an object with two. `tsc` flags it; nothing else
> did, and it shipped.

### 10. Doc sprawl and committed env files

**307 tracked markdown files**, 36 in the repo root alone — phase summaries, audits and
completion reports from past sessions, most now contradicting each other. Plus
`src/BE CONSCIOUS/`, `src/be_conscious/` and `src/paystack docs/` (with PNGs) inside the source
tree.

`.env`, `.env.txt` and `.env.example` are all committed — `.gitignore` never excludes `.env`.
Only the anon key is exposed, which is public by design, so this is hygiene not a breach.
Still: untrack them before this repo goes anywhere.

---

## Recommended sequence

> **Status update 2026-08-27.** The database findings above (0a/0b/0c and the corrections to
> #3/#4/#5) were verified by direct inspection of the live project. **Steps 2–4 below are DONE** —
> five corrective migrations were written to `supabase/migrations/` and applied to production,
> each verified individually; see "Corrective migrations — APPLIED" below. The security advisor
> went from 25 findings (4 of them ERROR) to 4, with **zero ERRORs remaining**.
>
> **Update 2026-08-28: steps 5-6 are DONE and step 7 is half done.** `vite build` now passes and
> the commission unit suite is 62/62. Application source *has* now been modified -- see "Build
> repair and commission realignment" below for the full list. The one thing still outstanding in
> step 7 is the production commission row, whose migration is written but deliberately not
> applied.

| # | Step | Phase |
|---|---|---|
| 1 | **Free disk space** — nothing below is reliable under 58 MB | Prerequisite |
| 2 | ~~**Harden `is_admin_claim()`**~~ — ✅ **DONE**, self-promotion to admin closed (0a) | **Security** |
| 3 | ~~**Enable RLS on the 4 exposed tables**~~ — ✅ **DONE**, commission rates no longer publicly writable (0b) | **Security** |
| 4 | ~~**Drop the blanket `USING (true)` policies**~~ — ✅ **DONE**, anon now sees 12 of 13 properties (0c) | Security |
| 5 | ~~**Restore the 4 archived modules**, `FormSection`, repoint `data-seeder`~~ — ✅ **DONE**, `vite build` passes | Deployable again |
| 6 | ~~**Fix the 2 crashes**~~ — ✅ **DONE**, `LazyLoadWrapper` hook imports + dead code in `TagBasedAmenitiesSelector` | Deployable again |
| 7 | **Correct commission to 10% / no VAT** — ✅ tests realigned (62/62 pass); ⏳ **DB row still pending**, migration written but blocked awaiting approval | Correctness |
| 8 | **Reconcile the schema** — adopt `supabase/migrations/` as the single directory, retire `database/migrations/`, **rewrite** `properties_nearby` against real column names before applying, deploy `geocode-property`, resolve the 4 phantom tables | Correctness |
| 9 | **Regenerate `types.ts`** from the live DB | Correctness |
| 10 | **Collapse `UserRole` to one definition**, fix auth redirects | Stops the bleeding |
| 11 | **Delete dead layers + doc sprawl**, gate builds on `tsc` | Stops the bleeding |

Steps 2–4 are the new head of the queue and are independent of the build being fixed — they are
database-side and can ship immediately. Steps 5–6 are roughly an afternoon and produce a
building, deployable app. Steps 7–9 are the correctness work. Steps 10–11 are what stop future
AI sessions from rediscovering the same contradictions.

---

## Corrective migrations — APPLIED 2026-08-27

Five migrations were written to `supabase/migrations/` and **applied to the production project**
in version order, each verified before the next was run.

| File | Does | Verified after |
|---|---|---|
| `20260827153957_enable_rls_on_exposed_tables.sql` | RLS on the 4 open tables. `commission_configurations` keeps **public read** (the commission singleton loads it on boot for every visitor) but writes narrow to admins. `payment_distributions` / `booking_roommates` get participant-scoped reads. Backup table gets RLS with no policies — service_role only. | All 4 `relrowsecurity = true`, policy counts 3 / 1 / 2 / 0 |
| `20260827154039_properties_policy_cleanup.sql` | Drops `"Anyone can view properties"` and the blanket compounds read; removes 4 duplicate policies; rebuilds owner/booking policies with `(select auth.uid())`; adds the missing `WITH CHECK` on the properties UPDATE policy. | `set role anon` → **12** visible properties, down from 13. Policy counts SELECT 4→3, INSERT 2→1, UPDATE 3→2, DELETE 3→2 |
| `20260827154130_harden_is_admin_claim.sql` | Removes the user-controlled `user_metadata.role` branch. Supersedes the two broken repo definitions. | Simulated JWT with `user_metadata.role = supreme_admin` → **`false`**. Simulated `app_metadata.role = supreme_admin` → **`true`** |
| `20260827154218_schema_hygiene.sql` | Drops duplicate `properties_owner_id_fkey`; drops 3 duplicate indexes; pins `search_path` on all public functions. | properties FKs 3→2; duplicate indexes remaining 0; functions without `search_path` 0 |
| `20260827154312_revoke_public_execute_handle_new_user.sql` | Follow-up — `…0004`'s revoke targeted `anon`/`authenticated`, but the grant lived on `PUBLIC` (`proacl` = `=X/postgres`), so it was a no-op. | `anon` → false, `authenticated` → false, `supabase_auth_admin` → true |

> **Admins must sign out and back in** to receive a fresh JWT before admin screens work again.

**Post-apply read-path verification** (simulated roles, all in rolled-back transactions):

| Caller | commission config | properties | compounds |
|---|---|---|---|
| `anon` | 1 ✅ | 12 ✅ | 0 |
| `authenticated` (student) | 1 ✅ | 12 ✅ | — |
| `authenticated` (compound owner) | — | — | 1 ✅ own |

The `0` for anon compounds is correct, and it surfaced a separate data gap worth recording:
**all 3 compounds are orphaned.** No property has `compound_id` set, none is flagged
`is_part_of_compound`, and `beds` is empty. The `20251105_compounds_and_beds_CORRECT` migration
built the tables and 3 compounds were created, but nothing was ever linked to them. Owner-side
pages still work (owners read their own rows via the owner policy, verified above); the compound
feature simply has no linked data yet.


### Security advisor: before → after

| Lint | Level | Before | After |
|---|---|---|---|
| `rls_disabled_in_public` | **ERROR** | 4 | **0** |
| `function_search_path_mutable` | WARN | 16 | **0** |
| `anon_security_definer_function_executable` | WARN | 1 | **0** |
| `authenticated_security_definer_function_executable` | WARN | 1 | **0** |
| `rls_enabled_no_policy` | INFO | 1 | 2 |
| `auth_leaked_password_protection` | WARN | 1 | 1 |
| `vulnerable_postgres_version` | WARN | 1 | 1 |
| **Total** | | **25** | **4** |

**Zero ERROR-level findings remain.** The four survivors are deliberate or out of scope for SQL:

- `properties_backup_before_blob_cleanup` — RLS on with no policies is the intended end state
  (service_role only). It is counted as a new INFO because the table previously had RLS off
  entirely, which is strictly worse. Drop the table once the blob cleanup is confirmed good.
- `verification_requirements` — pre-existing; RLS on with no policies means the app cannot read
  it at all. Needs a policy written against whatever is supposed to consume it.
- Leaked-password protection — a dashboard Auth setting, not SQL.
- Postgres `15.8.1.121` — needs a platform upgrade, scheduled separately.

---
## Build repair and commission realignment — 2026-08-28

### The build is green

`npx vite build` now succeeds (~23s, 2149 modules). Baseline before this session was a hard
failure on the first unresolvable import.

| Missing module | Resolution |
|---|---|
| `src/services/queryInvalidation.ts` | Restored from archive (382 ln) |
| `src/services/realTimeBedAvailabilityService.ts` | Restored from archive (411 ln) |
| `src/services/dynamic-property-content.service.ts` | Restored from archive (515 ln) |
| `src/types/dynamic-property-content.ts` | Restored from archive (374 ln) |
| `src/components/owner/property-form/FormSection.tsx` | **Written** |
| `@/components/ui/combobox` | **Import deleted** — not needed |
| `@/config/supabase` | Repointed to `@/integrations/supabase/client` |

Exports were checked against every import site before restoring. The archive's own
`ARCHIVE_NOTE_RESTORED_FILES.md` claimed all four had "verified no active imports" — the same
audit error that caused the outage, made twice.

Two of the report's original prescriptions turned out to be wrong on inspection:

- **`combobox` did not need writing.** `Combobox` appears exactly once in `BasicInfoFields.tsx`
  — the import. There is no `<Combobox` anywhere; `UNIVERSITIES` renders through a `Select`. The
  component was swapped out and the import left behind. Deleting the line is the whole fix.
- **`FormSection` already existed** at `@/components/common/form/FormSection`, but it is a
  default export that forces an inner `md:grid-cols-2` on its children, and every
  `property-form` caller supplies its own layout wrapper. Reusing it would have half-widthed
  those sections, so a local named export was written to match the sibling convention.

### The two runtime crashes

- `LazyLoadWrapper.tsx` — `useState`/`useRef`/`useEffect` used at lines 109-114, imported
  nowhere. This one was real and would throw on render. Added to the React import.
- `TagBasedAmenitiesSelector.tsx` — **not actually a crash.** The undefined `amenityCategories`,
  `searchTerm` and `activeCategory` live only inside `getAllAmenities()` and
  `getFilteredAmenities()`, and neither is ever called; the render uses the separate `categories`
  array. Undefined identifiers inside an uncalled function body never evaluate. Both dead
  functions were deleted, which removes the TS errors, but the component was never crashing.

`toggleAmenity` and `addCustomAmenity` are also dead — the render inlines that logic. They were
left alone as valid code, but note the inline version drops the 20-amenity cap the dead helpers
enforced.

### Commission tests: 62/62 pass

`src/tests/unit/centralizedCommissionEngine.test.ts` was **three** inconsistent models in one
file, not two: a `vi.mock` returning the old 2.1.0 DB row (5% / 3.7% / 12.5%), assertions
expecting a third "owner receives full base" model, and the engine computing from the mock.

Both mock declarations (there are two — one inside the `vi.mock` factory, one at module scope)
were aligned to the Phase 1 model, and the assertions rewritten to the engine's actual formula:

| For base 1000 | Phase 1 value |
|---|---|
| platform commission (owner pays) | 100 |
| fixed fee (student pays) | 100 |
| agent commission | 0 — disabled, and **hardcoded** in the engine |
| student total | 1100 |
| Paystack (platform absorbs) | 21.45 |
| VAT | 0 — also hardcoded |
| owner receives | 900 |

Aligning the mock first *raised* the failure count from 11 to 17, because tests that hard-coded
the old rates in their names and assertions then broke too. That 17 matches the report's
original figure. All now pass.

Two tests were rewritten rather than re-valued: "agent commission as percentage when above
minimum" and "as minimum when below threshold" test behaviour that no longer exists —
`calculateCommissions()` sets `agentCommission = 0` unconditionally and ignores its own
`includeAgent` parameter. They now assert the Phase 1 contract instead.

### Bug found while realigning the commission tests

`loadConfigurationFromDatabase()` replaced the whole `fees` object with just `fixed` and
`agentMinimum`:

```ts
fees: {
  fixed: createPlatformFee(data.platform_fixed_fee),
  agentMinimum: createPlatformFee(data.agent_minimum_fee)
},
```

`fees` also carries `platform: 80` and `processing: 20`, and the DB has no columns for either.
So after **every** successful load — which is every app boot, for every visitor — both became
`undefined`, and `calculateCommissions()` returned
`platformFeeBreakdown: { platform: undefined, processing: undefined }`. That is the object the
UI uses to show students the "80 + 20" split. Fixed by spreading the existing fees first.

The `fees` type declares all four fields as required, so `tsc` flags this assignment. It shipped
because nothing runs `tsc` — see the correction to #9.

### Remaining test failures are pre-existing

The full suite is **302 passed, 6 failed**. All 6 were verified to fail identically with this
session's two modified files stashed, and neither file is one this session touched:

- `adminRateChangePropagation.test.ts` (5) — has its own independent `vi.mock` and asserts a
  configurable VAT (`beforeVat * 0.15`). The engine hardcodes `vatAmount = 0`, so these can
  never pass as written. Same "sources disagree" problem as #3, in a different file: the DB row
  and this suite still assume VAT exists.
- `propertyPreviewCache.test.ts` (1) — unrelated image-fallback assertion.

### Step 7 is half done

Test realignment is complete. The **DB row change was blocked** and is not applied: writing new
commission rates to production was refused by the permission layer, which is the correct
outcome for an unattended money change. The migration is written and ready at
`supabase/migrations/20260828000001_commission_config_v220_phase1_model.sql` — append-only, it
deactivates 2.1.0 rather than mutating it, so it is reversible by flipping `is_active` back.

**Until it runs, production still charges the 2.1.0 model (5% + 12.5% VAT + 3.7% agent) while
the code, the tests and the UI all assume 10% / no VAT.**

---
## Property card images were 403ing — Supabase image transformation is a paid add-on

**Symptom:** logged in as a student, every card on *Available Properties* showed a grey
placeholder, but the same property's images appeared on its detail page.

**Cause:** `getOptimizedPropertyImageUrl()` rewrote every card image through
`supabase.storage.from(bucket).getPublicUrl(path, { transform })`, which points at
`/storage/v1/render/image/public/...`. That endpoint is a **paid Supabase add-on** and is not
enabled on this project. Verified directly against a real property image:

```
raw          /storage/v1/object/public/property-images/properties/temp_1763677585657.jpg
             -> HTTP 200  image/jpeg  1,515,662 bytes

transformed  /storage/v1/render/image/public/...?width=1000&quality=80&resize=cover
             -> HTTP 403  {"error":"FeatureNotEnabled",
                           "message":"feature not enabled for this tenant"}
```

Every card image 403'd, and `<img onError>` swapped in `/placeholder.svg`. Detail pages were
unaffected because they use the raw URL and never call the optimizer. Nothing was wrong with the
data: 9 of the 12 visible properties have valid storage URLs (3 genuinely have no images).

**Fix:** transformation is now opt-in via `VITE_SUPABASE_IMAGE_TRANSFORM` (default `false`).
When off, `getOptimizedPropertyImageUrl` returns the original public URL, which always serves.
One change in `src/utils/imageOptimization.ts` covers all four call sites — `PremiumPropertyCard`,
`PropertyCard`, `StoryOptimizedImage`, `StoryViewEnhanced` — so **stories were silently broken
the same way** and are fixed too. Set the flag to `true` if the plan ever includes the add-on.

> **Follow-up worth taking:** the originals are large (the one measured is **1.5 MB**). A
> 12-card grid is roughly 18 MB per page load, which matters for students on Ghanaian mobile
> data. Transformation was the right instinct, just unavailable. Options: enable the paid
> add-on and flip the flag, or resize on upload in `SupabaseImageUpload`/`PropertyImageUpload`
> so the stored object is already card-sized.

**Also fixed while here:**

- Five `console.log('DEBUG PremiumPropertyCard: ...')` statements were shipping to production.
  Removed.
- `deriveCoverImageFromProperty` documents that it rejects "blob: URLs and localhost
  references", but no branch checked localhost, so a dev-only `http://localhost:3000/...`
  `image_url` would win over a valid CDN URL. Extracted a single `isSafeRemoteImageUrl` guard
  and applied it to all three branches. This clears the last unrelated test failure
  (`propertyPreviewCache.test.ts`), taking the suite to **303 passed / 5 failed**.

> **Known duplication, not addressed:** `PremiumPropertyCard` re-implements the same
> media/images/URL-safety resolution that `deriveCoverImageFromProperty` already performs, and
> `PropertyList` calls the util *and* passes `media` through, so the card's copy wins. The two
> now disagree about localhost. The card should delegate to the util.

---
## Client-side image compression before upload

The follow-up to the 403 above: rather than paying for Supabase's transformation add-on,
images are now shrunk in the browser so the **stored object is already serving-sized**.

**Library:** `browser-image-compression` v2.0.2. Chosen over `compressorjs` and a hand-rolled
canvas routine because it runs in a Web Worker (the main thread stays responsive on a
mid-range phone) and correctly bakes EXIF rotation into the output — without that, photos
taken on a phone upload sideways.

**Where:** `src/utils/imageCompression.ts`, called from `SupabaseImageUpload.tsx`, which is the
**only** `.upload()` call site in the codebase — so every property image goes through it.

**Settings:** longest edge 1600px, target 400 KB, re-encoded to WebP at quality 0.8. Against
the 1.5 MB sample measured earlier that is roughly a 10-20x reduction, and a 12-card grid drops
from ~18 MB to well under 1 MB.

Details that needed care:

- **Order of operations.** The size cap is now enforced on the *compressed* file, not the
  original. Previously a 12 MB phone photo was rejected outright against the 5 MB limit; now it
  is shrunk and accepted. Type validation still runs first, on what the user actually picked.
- **Filename extension.** `browser-image-compression` keeps the input filename, so WebP bytes
  would have been stored as `temp_123.jpg`. The util renames to match the real encoding, and the
  upload path derives its extension from the compressed file.
- **Never a gate.** Every failure path returns the original file. Videos, files already under
  200 KB, and anything over a 25 MB ceiling pass through untouched. A compression problem can
  never block an upload.
- **EXIF is stripped**, which also drops the GPS coordinates phone cameras attach — worth having
  when owners photograph their own homes.
- **Bundle cost pushed off the student path.** The library is `import()`ed on demand, and
  `vite.config.ts` gives it its own `image-compression` chunk. Without that rule the
  `manualChunks` catch-all (`return 'vendor'`) swept it into the shared vendor bundle, taking it
  from 653.69 KB to 706.97 KB for *every* visitor — students included, who never upload
  anything. With the rule, `vendor` is unchanged and the 21 KB (gzipped) chunk loads only when
  an owner actually picks a photo.

**Verified:** `property-images` has `allowed_mime_types: null`, so the bucket accepts WebP.
Build passes; suite unchanged at 303 passed / 5 failed.

> **Not addressed — existing images.** The 71 objects already in the bucket are still full-size;
> compression only affects new uploads. A one-off re-encode of what is there would need a
> separate backfill script.

> **Noticed while checking buckets:** `verification-documents` and `property-documents` are both
> marked **public**. They are empty today, so nothing is exposed — but the moment an ID document
> or ownership paper is uploaded it will be world-readable by URL. Worth flipping to private with
> signed-URL access before that feature goes live.

---
## Advisor results and index coverage

**Security advisor**, beyond 0a/0b: `verification_requirements` has RLS enabled with **zero
policies**, so it is unreachable by the app; `handle_new_user()` is `SECURITY DEFINER` and was
callable at `POST /rest/v1/rpc/handle_new_user`; 16 functions have a mutable `search_path`;
leaked-password protection is off; Postgres `15.8.1.121` has outstanding security patches.
All but the last two are handled by migration `…0004`.

**Performance advisor** returns 335 lints — but read them in context: **13 properties and 0
bookings**. Postgres sequential-scans both tables regardless of indexing, which is why almost
every index reports zero scans. The `unused_index` warnings are artifacts of scale, not dead
weight, and are **not** actionable yet.

| Lint | Count | Actionable now? |
|---|---|---|
| `multiple_permissive_policies` | 171 | Yes — duplicate policies, fixed by `…0002` |
| `unused_index` | 81 | No — 13-row table, revisit at scale |
| `auth_rls_initplan` | 72 | Partly — 7 on these two tables, fixed by `…0002` |
| `unindexed_foreign_keys` | 7 | Low priority — all on empty tables |
| `duplicate_index` | 3 | Yes — fixed by `…0004` |
| `no_primary_key` | 1 | The backup table; drop it once blob cleanup is confirmed |

**`properties`** — 10 indexes, 3 ever used: `idx_properties_owner` (18 scans),
`properties_pkey` (4), `idx_properties_verification_status` (1). Coverage itself is sound:
`idx_properties_availability (is_available, verification_status)` matches the public-read
predicate exactly and will be used once the table grows. Three rating indexes serve a column
that is entirely NULL — speculative, but harmless.

**`bookings_enhanced`** — 9 indexes, 0 rows, all unused. Coverage is genuinely good
(`student_id`, `property_id`, `property_owner_id`, `status`, `payment_reference`, `created_at`,
PK). One real defect: `bookings_enhanced_booking_reference_key` and
`idx_bookings_enhanced_reference` are byte-identical unique indexes on `booking_reference`, so
every insert maintains both. Same duplication on `property_verifications` and `transactions`.

---

## Supabase MCP — configured, needs your approval

`.mcp.json` was created this session, scoped to project `ymqnbekeqarjmxftzvks` with the feature
groups from your screenshot (docs, account, database, debugging, development, functions,
branching):

```json
{
  "mcpServers": {
    "supabase": {
      "type": "http",
      "url": "https://mcp.supabase.com/mcp?project_ref=ymqnbekeqarjmxftzvks&features=docs%2Caccount%2Cdatabase%2Cdebugging%2Cdevelopment%2Cfunctions%2Cbranching"
    }
  }
}
```

Current status: **Pending approval.** Two interactive steps remain, both needing a regular
terminal (not the IDE extension), and neither of which I can perform:

1. Run `claude` in the project directory and **approve** the project-scoped server.
2. Run `/mcp`, select `supabase`, and **Authenticate** (OAuth browser flow).

Until then I query PostgREST directly with the `.env` credentials — which is how every DB claim
in this report was verified. What MCP adds on top is `information_schema` access: exact RLS
policy listings, indexes and constraints that the anon REST API cannot expose.

---

## Verification checklist

- `npx vite build` → exits 0 (currently exit 1)
- `npx tsc --noEmit -p tsconfig.app.json` → error count falling from 180
- `npx vitest run` → 305/305 (currently 288/305)
- Live re-probe: `properties?select=latitude,longitude` → 200; `rpc/properties_nearby` → 200;
  `functions/v1/geocode-property` → no longer 404
- Manual: load a property card (exercises `LazyImage` + bed availability); open the owner
  property form (exercises `BasicInfoFields`/`FormSection`/amenities); run one test-mode
  Paystack booking end-to-end and confirm recorded commission is 10% of base with no VAT
