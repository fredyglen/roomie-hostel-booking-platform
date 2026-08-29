# ROOMi — Audit Brief #2: the listing→display→admin data flow

Follow-up to `AUDIT_BRIEF.md`. Same ground rule: **verify everything here, including
my numbers.** Two of my figures in brief #1 were wrong and you caught both.

Scope: what an owner enters when listing a property, what a student actually sees,
and how the three portals stay (or fail to stay) in sync with admin.

All figures below were measured on **2026-08-29** against the live database
(`ymqnbekeqarjmxftzvks`, 13 non-deleted properties) and commit `c58f947`.

---

## The headline

**Most of what an owner types is never stored, and the fields students most need are
empty on every single property in production.**

This is not a display bug. The data is not there. Measured on all 13 live properties:

| Field | Populated | What depends on it |
|---|---|---|
| `total_rooms` | **0 / 13** | room counts, capacity |
| `beds_per_room` | **0 / 13** | per-bed pricing, occupancy label |
| `beds_available` | **0 / 13** | **the availability chip on every card** |
| `washroom_type` | **0 / 13** | a headline filter on the listing page |
| `emergency_contact_name` / `_phone` | **0 / 13** | safety, and a verification input |
| `security_features` | **0 / 13** | trust signals |
| `semester_availability` | **0 / 13** | "can I move in this semester" |
| `utilities_included` | **0 / 13** | true cost to the student |
| `good_to_know` | **0 / 13** | owner's own caveats |
| `virtual_tour_url` | **0 / 13** | the video affordance on the card |
| `base_price_per_semester` | 4 / 13 | the price students are shown *per semester* |
| `max_occupants` | 10 / 13 | "N in a room" |
| `structure_type` | 9 / 13 | hostel vs homestel vs apartment behaviour |

Reproduce with a single `count(col)` query over `public.properties where deleted_at is null`.

**Direct consequence:** the property card renders availability as `taken/total` derived
from `beds_available` and `max_occupants`. With `beds_available` empty on every row,
every card in production shows a meaningless or "full" state. The same emptiness makes
the video button and the washroom filter dead controls.

---

## 1. The owner form collects far more than anything persists

- The zod schema at `src/components/owner/property-form/PropertyFormSchema.ts` defines
  **78 fields**.
- `public.properties` has **67 columns**.
- **34 form fields have no column of that name at all.**

Some of those 34 are naming mismatches rather than true losses, and telling the two
apart is the first job:

| Form field | Probable column | Status |
|---|---|---|
| `type` | `property_type` | rename |
| `furnished` | `is_furnished` | rename |
| `utilities` | `utilities_included` | rename |
| `price` / `price_unit` | `rent` / `base_price_per_semester` | ambiguous — two price concepts |
| `washroom_location` + `washroom_sharing` | `washroom_type` | **two fields collapsed into one; 0/13 populated** |
| `room_types`, `rooms`, `floors`, `buildings` | `rooms` / `floors` / `buildings` tables | relational, not columns |
| `house_rules`, `landmark`, `distance_to_campus`, `nearest_university`, `people_per_washroom`, `occupancy_*`, `homestel_pricing_matrix`, `room_type_pricing`, `booking_duration`, `all_inclusive` | none found | **candidate true data loss** |

**What to determine:** for each of the 34, is it (a) renamed, (b) written to a child
table, or (c) silently dropped? Category (c) is the bug. The owner fills in a field, the
UI confirms success, and the value never existed.

**Complication — there are at least four write paths**, and they do not agree:
`src/hooks/property/usePropertyCreation.tsx`, `src/api/propertyService.ts`,
`src/pages/owner/PropertyNewSimple.tsx`, `src/components/owner/PropertyEditForm.tsx`.
I measured one of them (`usePropertyCreation`) writing a 32-field payload against the
78-field form. **I did not confirm which path the production form actually submits
through — establish that first**, because the 63-field gap I measured is only meaningful
for the path that really runs. The DB population table above is path-independent
evidence and is the number I would trust.

---

## 2. What the student is shown

- `src/components/properties/ROOMiPropertyCard.tsx` shows: cover image, gender badge,
  title, location, price + `/semester`, occupancy label, availability chip, six amenities.
- The availability chip is fed `beds_available` and `max_occupants` — **empty on every
  property**. It is currently decoration.
- Price shows `/semester` but `base_price_per_semester` is populated on **4 of 13**; the
  rest fall back to `rent`, which may be a monthly figure. **Determine whether students
  are being shown a monthly price labelled as a semester price.** If so this is a P0
  commercial correctness bug, not a cosmetic one.
- Amenities are matched by regex against a free-text `amenities` array. There is no
  controlled vocabulary, so "Wi-Fi", "wifi", "WIFI" and "Internet" are four different
  values. Assess how many listings lose amenities to spelling.
- The listing page exposes filters (washroom inside/outside, all-inclusive utilities,
  minutes to campus) whose backing columns are **0/13 populated**. Verify whether those
  filters return zero results or silently ignore themselves — both are bad, differently.

**Ask throughout: for each thing a student sees, which column feeds it, and is that
column populated in production?** That single question is the spine of this audit.

---

## 3. Portals do not sync; they poll or go stale

- Only **4 files** in the codebase open a realtime channel:
  `centralized-commission.config.ts`, `useDynamicProperties.ts`, `useNotifications.ts`,
  `realTimeBedAvailabilityService.ts`.
- `src/services/queryInvalidation.ts` implements a `CrossPortalInvalidationService`
  (~380 lines, with a `QUERY_KEYS` registry) — and it is imported by exactly **two**
  files, both student forms (`MaintenanceRequestForm`, `PropertyReviewForm`). It is
  not used by property creation, verification, or booking.
- **Admin approval does not reach the other portals.**
  `src/pages/admin/VerificationManagement.tsx:153` writes `verification_status`, then
  line 167 invalidates only `['admin-verifications']` — its own key. The owner's
  dashboard and the student listing hold their own cached queries under different keys
  and are never told. An owner watching their screen sees "pending" until a hard reload.
- Because `properties` RLS filters student visibility on `verification_status` +
  `is_available`, approving a property is precisely the moment a student's list should
  change — and it is the moment nothing is invalidated.

**What to produce:** a map of every cross-portal state transition (owner publishes →
admin queue; admin approves → owner status + student listing; student books → owner
dashboard + bed counts; payment confirms → booking status everywhere), and for each one
say what currently propagates it: realtime, invalidation, polling, or nothing. My
expectation is that "nothing" dominates. Then propose one mechanism — the existing
`QUERY_KEYS` registry looks like the intended design that was never adopted.

---

## 4. Specific questions I want answered

1. Which write path does the live owner form use, and exactly which of its 78 fields
   reach a durable store? A field-by-field table, with evidence.
2. Is any student shown a monthly price labelled `/semester`? Yes or no, with the query.
3. Why is `beds_available` empty on all 13 properties when the form collects it and the
   card renders it? Is the bed/room model (`rooms`, `beds`, `floors`, `buildings`) wired
   to the form at all, or is it a parallel schema nobody populates? Note the related
   finding that all 3 `compounds` rows are orphaned.
4. What actually happens when an admin approves a property — trace every consumer.
5. Are the listing-page filters backed by populated columns? Which return zero by
   construction?
6. Is `usePropertyViewingTracker`'s gate the only thing between anonymous users and
   media, given it is `localStorage`-backed?

---

## 5. Deliverables

Same shape as brief #1: findings register with severity and evidence, a sequenced plan,
and a clear statement of what to fix first.

One addition: **a field-level data contract** — one table listing every property
attribute, its form control, its column, its display surface, and whether it is
populated in production. That table is the artefact this codebase is missing, and most
of the findings above are symptoms of its absence.

Assume nothing in `src/types/` is accurate; it disagrees with the database in known
ways (five `UserRole` definitions, six `Booking`). Generate types from the database and
compare.
