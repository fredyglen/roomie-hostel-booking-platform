# ROOMie Decision Log

> Purpose: capture *why* major decisions were made, which options were
> considered, and how to roll them back. One entry per decision.

Status values: `PLANNED`, `IMPLEMENTED`, `SUPERSEDED`, `REJECTED`.

---

## 0. How to Use This File

For every non-trivial change (schema, visibility rules, pricing, routing, media,
agent model, etc.):

1. Create a new section with ID `DEC-{AREA}-{NNN}` (e.g. `DEC-VISIBILITY-001`).
2. Fill in all fields in the template below.
3. Update `Status` as the work moves from PLANNED → IMPLEMENTED.
4. Link to relevant issues in `project_state.md` and to code/tests.

### Decision Template (copy-paste)

- **ID:** DEC-AREA-XXX
- **Title:**
- **Date:** YYYY-MM-DD
- **Status:** PLANNED | IMPLEMENTED | SUPERSEDED | REJECTED

- **Problem:**
  - Short description of the problem this decision addresses.

- **Context:**
  - Additional background from `project_state.md`, `be_conscious`, or code.

- **Options Considered:**
  1. Option A – ... (pros/cons)
  2. Option B – ...
  3. Option C – ...

- **Chosen Approach:**
  - Which option we picked and a one-line summary.

- **Rationale:**
  - Why this option is better for ROOMie given constraints.

- **Potential Impacts:**
  - How this might affect other parts of the system.

- **Rollback Plan:**
  - Concrete steps to undo/soften the decision if needed.

- **Code References (Planned or Implemented):**
  - File paths + key functions/classes to touch.

- **Tests:**
  - Planned or implemented tests verifying the decision.

- **Related Issues:**
  - IDs from `project_state.md`.

---

## DEC-VISIBILITY-001 – Align Owner "visibility" Checks with Verified-only Student Rule

- **ID:** DEC-VISIBILITY-001
- **Title:** Align Owner "Visibility" Checks with Student Verified-only Filters
- **Date:** 2025-11-24
- **Status:** IMPLEMENTED

- **Problem:**
  - Owners see a success message implying student visibility as soon as a
    property is marked available, even when `verification_status = 'pending'`.
    Student-facing queries, however, only show `verification_status = 'verified'`
    and `is_available = true`. This mismatch is misleading.

- **Context:**
  - `PROPERTY_PIPELINE_CONTRACT.md` defines the invariant: Student Portal must
    only show properties with `is_available = true` and
    `verification_status = 'verified'`.
  - `verifyPropertyVisibility` currently checks only `is_available = true` and
    drives Owner-facing messaging.

- **Options Considered:**
  1. **Option A – Loosen Student filters to show pending properties**
     - Pros: Owners see traffic sooner.
     - Cons: Violates verified-only rule; harms trust and safety.
  2. **Option B – Strengthen Owner check to require verified status**
     - Pros: Honest; matches Student filters.
     - Cons: Loses useful pipeline diagnostics; may confuse Owners right after
       creation.
  3. **Option C – Split "pipeline health" vs "student visibility" checks
     (Preferred)**
     - Pros: Keeps a diagnostic signal for Owners while being fully honest
       about Student visibility; extensible for future states.
     - Cons: Slightly more complex implementation and UI copy.

- **Chosen Approach:**
  - **Option C – Introduce separate `pipelineHealthy` and `studentVisible`
    concepts in the visibility check and Owner UI.**

- **Rationale:**
  - Preserves the strict verified-only Student rule.
  - Gives Owners actionable feedback without lying.
  - Fits ROOMie's transparency and safety goals.

- **Potential Impacts:**
  - Owner expectations around "going live" must be reset with clearer copy.
  - Admin verification flow must be discoverable and reasonably fast.
  - Any tooling assuming the old `verifyPropertyVisibility` semantics must be
    audited.

- **Rollback Plan:**
  - Keep the old single-boolean implementation in version control.
  - If needed, revert to a neutral diagnostic-only check and simpler Owner
    messaging while keeping Student filters strict.

- **Code References (Implemented):**
  - `src/services/propertyPipeline.ts` – `PropertyVisibilityResult` interface and
    `verifyPropertyVisibility` implementation using `pipelineHealthy`,
    `studentVisible`, and a `property` snapshot for diagnostics.
  - `src/hooks/property/usePropertyCreation.tsx` – Owner creation success flow,
    delayed visibility check toasts, `usePropertyVisibility`, and
    `usePropertyPipelineStatus` messaging.
  - `src/components/admin/PropertyVisibilityMonitor.tsx` – Admin visibility
    monitor student-query simulation and summary copy aligned with the
    verified-only rule.
  - `src/services/enhanced-property.service.ts` – Student-facing filters already
    enforcing `verification_status = 'verified' AND is_available = true` (no
    behavior change required).

- **Tests (Implemented):**
  - `src/tests/unit/propertyVisibility.test.ts` – unit tests for
    `verifyPropertyVisibility` covering combinations of `is_available` and
    `verification_status`, plus Supabase error handling.

- **Related Issues:**
  - `ISSUE-VISIBILITY-001` in `project_state.md`.


## DEC-MEDIA-002 – Canonical Cover Image Derivation for Student Surfaces

- **ID:** DEC-MEDIA-002
- **Title:** Canonicalize cover image derivation via `deriveCoverImageFromProperty`
- **Date:** 2025-11-25
- **Status:** IMPLEMENTED

- **Problem:**
  - Student-facing surfaces (Explore cards, booking summary, story previews)
    derive cover images using slightly different logic. Some use
    `deriveCoverImageFromProperty`, others duplicate its behavior with weaker
    validation and no placeholder. `Property.image_url` is not part of the typed
    `Property` model, and `Property.images` is often unset, so fallbacks are
    fragile and inconsistent.

- **Context:**
  - `PROPERTY_PIPELINE_CONTRACT.md` defines the contract: cover image should be
    derived once (cover media → `image_url` → `images[0]`) and reused by cards,
    booking summary, and Paystack metadata.
  - `transformDbProperty` maps DB `images[]` into `Property.media[]` with
    `isCover` on index 0, but does not populate `Property.images` or any
    `image_url` field on the typed `Property`.
  - Explore already uses `deriveCoverImageFromProperty` + `/placeholder.svg`,
    while `BookingSummarySidebar` uses its own helper and shows no placeholder
    when media is missing.

- **Options Considered:**
  1. **Option A – Strong unification via `deriveCoverImageFromProperty`
     (Recommended)**
     - Pros: Single source of truth; consistent validation and placeholder
       behavior across cards, booking summary, and previews. No schema changes.
     - Cons: Requires updating multiple call sites and tightening URL
       validation, which may surface invalid legacy data.
  2. **Option B – Add `getPropertyHeroImage()` wrapper above
     `deriveCoverImageFromProperty`**
     - Pros: Clearer UI contract (url vs placeholder flags), easier to extend.
     - Cons: Adds another layer of abstraction and more boilerplate for limited
       immediate benefit.
  3. **Option C – Minimal patch: fix booking summary only**
     - Pros: Smallest change; directly addresses the most visible bug.
     - Cons: Leaves duplicated logic and ambiguous contracts in place.

- **Chosen Approach:**
  - **Option A – Use `deriveCoverImageFromProperty` as the canonical hero image
    derivation helper and standardize all student-facing surfaces on it.**

- **Rationale:**
  - Aligns implementation with `PROPERTY_PIPELINE_CONTRACT.md` without DB
    migrations.
  - Reduces the risk of future drift by having exactly one place where
    media/image_url/images[] fallbacks are defined and tested.
  - Makes it trivial to add cover image unit tests and to reason about how
    legacy data is handled.

- **Potential Impacts:**
  - Old data containing blob or localhost URLs in `images[]` or `image_url` will
    now consistently result in placeholder images instead of broken or unsafe
    URLs.
  - Any components relying on non-http(s) image URLs will need to be audited
    (none are expected in production).
  - Slight behavior change in booking summary: properties without valid remote
    images will show a consistent placeholder instead of hiding the image
    section entirely.

- **Rollback Plan:**
  - Keep the previous booking summary helper (`getPropertyCoverImage`) and
    Explore wrapper implementation in git history.
  - To roll back, reintroduce those functions and stop importing
    `deriveCoverImageFromProperty` in booking.
  - If URL validation proves too strict for some legacy data, relax it
    selectively (e.g. allow certain storage-relative paths) behind a feature
    flag.

	- **Code References (Implemented):**
	  - `src/utils/propertyPreviewCache.ts` –
	    `deriveCoverImageFromProperty` URL validation tightened for `image_url` and
	    documented hero image priority via JSDoc.
	  - `src/components/booking/BookingSummarySidebar.tsx` –
	    replaced local `getPropertyCoverImage` with canonical helper and ensured
	    the booking hero section always renders with either a real cover image or
	    `/placeholder.svg`.
	  - `src/pages/student/Explore.tsx` –
	    simplified `getPropertyCoverImages` to a thin wrapper over
	    `deriveCoverImageFromProperty`, letting card components handle
	    placeholder fallback.

	- **Tests (Implemented):**
	  - `src/tests/unit/propertyPreviewCache.test.ts`  unit tests for
	    `deriveCoverImageFromProperty` covering:
	    - media-only, image_url-only, images-only, mixed, and no-media cases.
	    - Blob/localhost/invalid URL rejection and legacy string `images` fields.
	  - (Planned follow-up) Component-level tests for Explore cards and booking
	    summary to assert correct cover vs placeholder rendering in realistic UI
	    flows.

- **Related Issues:**
  - `ISSUE-VISIBILITY-002` in `project_state.md`.

---

## DEC-CARDS-001 – Student Property Card Pricing & Layout

- **ID:** DEC-CARDS-001
- **Title:** Unify Hostel/Homestel cards and express flexible pricing safely
- **Date:** 2025-11-25
- **Status:** PLANNED

- **Problem:**
  - Listing cards currently assume a single "₵X /semester" headline tied to one
    room type. Homestels include 1w/2w/6m/1y options and Apartments are unit-based,
    so the card cannot express key pricing signals without clutter.

- **Context:**
  - `PROPERTY_PIPELINE_CONTRACT.md` defines different default durations per
    category (Hostel ≈ semester/year; Homestel singles use flexible durations;
    Apartments are unit-based). Student cards should share a consistent skeleton
    while making these differences clear without overwhelming the card.

 - **Options Considered (high level):**
  1. **Option A – Single "From ₵X /duration" per category + flexibility chip**
     - Pros: Simple, keeps cards visually consistent; matches filter defaults.
     - Cons: Under-communicates price span for extreme matrices.
  2. **Option B – Show explicit ranges (₵min–₵max and 1–N in a room) on card**
     - Pros: Immediate sense of span across room types and durations.
     - Cons: Harder to read; mixes weeks/months/semesters on one line.
  3. **Option C – Category-specific card variants** for Hostel vs Homestel vs Apartment
     - Pros: Maximum clarity per category; tailored microcopy.
     - Cons: More branching and greater risk of drift over time.
 
 - **Chosen Approach:**
  - **Hybrid of Option A + Option C** – keep a unified card skeleton for all
    categories, use a single canonical "From ₵X /duration" headline per
    category, add a small flexibility chip for Homestels, and treat Apartments
    as a light variant (same layout, different microcopy and no `X_in_a_room`
    dropdown).

 - **Rationale:**
  - Mirrors established patterns from major accommodation platforms (Airbnb,
    Booking, etc.) which favor a single canonical unit + "from" price and use
    chips to signal flexibility instead of full matrices on cards.
  - Keeps Hostel and Homestel visually consistent in the grid while still
    allowing Homestels to advertise flexible stays via microcopy.
  - Allows Apartments to coexist in the same grid without inventing a totally
    separate layout.
  - Future-proofed by centralizing the mapping from category → canonical unit
    and "from" price in a pricing summary helper, so changes in pricing rules
    or new property categories rarely require card-layout rewrites.

- **Potential Impacts:**
  - Changes to how price filters map to card headlines.
  - Need to ensure Apartments remain discoverable without breaking Hostel/Homestel
    mental models.

- **Rollback Plan:**
  - Keep current "₵X /semester" card implementation in git history.
  - If new layout proves confusing, revert headline logic while preserving any
    back-end pricing summaries added for analytics.

- **Code References (Planned):**
  - `src/components/properties/PremiumPropertyCard.tsx` and
    `src/components/properties/PropertyCard.tsx` – card headline and pricing rows.
  - `src/services/enhanced-property.service.ts` – property pricing summary helpers
    derived from room_type_pricing.
  - `src/pages/student/Explore.tsx` – usage of cards for main listing sections.

- **Tests (Planned):**
  - Unit tests for pricing summary helpers (min/max/from values per category).
  - Integration tests for Explore to assert correct card headlines for Hostel,
    Homestel, and Apartment examples.

- **Related Issues:**
  - `ISSUE-CARDS-001` in `project_state.md`.

	---
	
	## DEC-FORMS-001 – Intelligent Owner Forms by Category & Structure
	
	- **ID:** DEC-FORMS-001
	- **Title:** Intelligent Owner Property Forms with Hostel/Homestel/Apartment Semantics
	- **Date:** 2025-11-25
	- **Status:** PLANNED
	
	- **Problem:**
	  - Owner property forms treat Hostel, Homestel, and Apartment as a single generic
	    flow. This allows invalid combinations (e.g. Hostel + `1_bedroom_apartment`,
	    Hostel + monthly pricing) and ignores structure differences (simple vs
	    multi-floor vs compound). There is also no first-class "Intelligent Router"
	    to convert Owner-friendly questions into the correct `property_type`,
	    `property_category`, and `structure_type` values for the pipeline and DB.
	
	- **Context:**
	  - `PROPERTY_PIPELINE_CONTRACT.md` defines canonical categories (Hostel,
	    Homestel, Apartment), Ghana-standard room types (`X_in_a_room` and
	    `*_bedroom_apartment`), and duration rules (Hostel ≈ semester/year;
	    Homestel singles = flexible durations; Apartments = unit-based).
	  - `project_state.md` tracks:
	    - `ISSUE-FORMS-001` – Owner forms don't match Hostel/Homestel/Apartment
	      semantics.
	    - `ISSUE-STRUCTURE-001` – Missing Intelligent Router + Structure Creator.
	  - `code_standards.md` requires a single canonical schema per major form and
	    Zod-backed validation instead of ad-hoc checks scattered in UI.
	
	- **Options Considered:**
	  1. **Option A – Keep generic form, add ad-hoc per-field guards in UI**
	     - Pros: Minimal refactor; less immediate TypeScript churn.
	     - Cons: Easy to bypass via programmatic calls; rules drift across
	       components; hard to test and reason about; conflicts with
	       PROPERTY_PIPELINE_CONTRACT.
	  2. **Option B – Split three completely separate forms (Hostel/Homestel/Apartment)**
	     - Pros: Clear separation; easier to reason about each category.
	     - Cons: Lots of duplication; shared fields (address, media, amenities,
	       verification) diverge; higher maintenance cost.
	  3. **Option C – Single canonical Zod schema + Intelligent Router + light
	       category-specific sections (Preferred)**
	     - Pros: One source of truth for validation; router owns the
	       `property_type`/`property_category`/`structure_type` mapping; UI composes
	       shared vs category-specific sections; tests can target schema + router
	       behavior directly.
	
	- **Chosen Approach:**
	  - **Option C – Implement an Intelligent Router that sets
	    `property_type`, `property_category`, and `structure_type`, backed by a
	    single `PropertyFormSchema` Zod schema with category- and
	    structure-aware validation.**
	
	- **Rationale:**
	  - Keeps the Owner UX friendly (questions about building shape and number of
	    properties) while guaranteeing that downstream data always respects
	    Hostel/Homestel/Apartment semantics.
	  - Centralizes room-type and duration rules in the schema so Student and
	    Admin surfaces can trust the pipeline output.
	  - Provides a natural connection point to future Structure Creator flows
	    (multi-floor buildings, compounds) via `structure_type`.
	
	- **Potential Impacts:**
	  - Requires aligning `PropertyFormValues` across Owner components, hooks, and
	    the pipeline on the Zod-inferred type from `PropertyFormSchema`.
	  - DB schema must be extended to persist `structure_type` (and possibly more
	    structure metadata) on `public.properties` to keep the pipeline and
	    Admin/Student portals in sync.
	  - Existing seed/fixture data may need normalization to match canonical room
	    type and duration rules.
	
	- **Rollback Plan:**
	  - Keep the previous generic `PropertyFormValues` interface and form wiring in
	    git history.
	  - If the Intelligent Router proves confusing, temporarily bypass it and
	    allow Owners to pick category/type directly, while keeping the Zod schema
	    constraints in place to prevent invalid combinations.
	  - If `structure_type` storage causes migration pain, keep the column nullable
	    and gate Structure Creator flows behind feature flags until data catches up.
	
	- **Code References (Planned/Partially Implemented):**
	  - `src/components/owner/IntelligentPropertyRouter.tsx` – multi-step router
	    that emits `PropertyRouterResult { propertyType, structureType, userType,
	    recommendedSetup }`.
	  - `src/components/owner/property-form/PropertyFormSchema.ts` – canonical Zod
	    schema defining `PropertyFormValues` and enforcing category-specific room
	    type and duration rules plus `structure_type`.
	  - `src/components/owner/property-form/PropertyForm.tsx` – integrates the
	    router with the form (`handleRouterComplete` sets `type`,
	    `propertyCategory`, `structure_type`) and drives Owner UX.
	  - `src/hooks/property/usePropertyCreation.tsx` – Owner creation hook using
	    `PropertyFormValues` from the schema and the `PropertyPipelineService`.
	  - `src/services/propertyPipeline.ts` – transforms `PropertyFormValues` into
	    DB inserts (to be extended with `structure_type` once DB schema is updated).
	
	- **Tests (Planned):**
	  - `src/tests/unit/propertyFormSchema.test.ts` – unit tests verifying category
	    semantics (Hostel/Homestel/Apartment combinations, room types, durations).
	  - Component tests for `PropertyForm` + `IntelligentPropertyRouter` to assert
	    correct form defaults per router output.
	  - Integration tests for `PropertyPipelineService.createPropertyWithPipeline`
	    to ensure `property_type`, `property_category`, `structure_type`, and
	    structure records are persisted consistently.
	
	- **Related Issues:**
	  - `ISSUE-FORMS-001` – Owner forms don't match Hostel/Homestel/Apartment
	    semantics.
	  - `ISSUE-STRUCTURE-001` – Missing Intelligent Router + Structure Creator.
	pm run dev