# ROOMie Project State (Shared Brain)

> Single source of truth for **current issues**, **fixed issues**, and **pending big decisions**.
> Always update this when you fix or discover something significant.

---

## 1. Current Issues Inventory

Status legend: `OPEN`, `IN_PROGRESS`, `BLOCKED`.


- **ISSUE-CARDS-001 – Student cards don’t express flexible pricing across Hostel/Homestel/Apartment**
  - Status: OPEN
  - Area: Student Portal, property cards, pricing
  - Summary: Current card layout shows a single "₵X /semester" price and room-type
    selector optimized for Hostels. Homestels (with weekly/monthly/semester options)
    and Apartments cannot communicate flexible stays or unit-level pricing cleanly
    within the card without bloating text.

- **ISSUE-UTILITIES-001 – "All-inclusive" utilities model too simplistic**
  - Status: OPEN
  - Area: Owner forms, DB design, Student transparency
  - Summary: Current data model cannot accurately express Ghanaian utility complexity (per-utility billing, shared vs individual meters, bill sharing vs included).

- **ISSUE-UTILITIES-002 – `allow_bill_sharing` redundancy / confusion**
  - Status: OPEN
  - Area: Property transparency model
  - Summary: `allow_bill_sharing` overlaps with `meter_type` and future utility matrix; risks drift and dead code if not formally deprecated.

- **ISSUE-FORMS-001 – Owner forms do not match Hostel/Homestel/Apartment semantics**
	  - Status: IN_PROGRESS
  - Area: Owner Portal
  - Summary: Single generic form tries to cover all property types; leads to confusing fields, duplicates (`good_to_know`), and missing category-specific logic.

- **ISSUE-STRUCTURE-001 – Missing Intelligent Router + Structure Creator**
	  - Status: IN_PROGRESS
  - Area: Owner onboarding, property structure
  - Summary: No first-class router that asks friendly questions and routes to specialized flows (Hostel / Homestel / Apartment + Block/Floor/Room/Bed creator).

- **ISSUE-MEDIA-001 – Missing room-type-specific media**
  - Status: OPEN
  - Area: Owner media step, Student story/detail
  - Summary: Each `X_in_a_room` room type should have its own media set; current model treats images as property-level only.

- **ISSUE-MEDIA-002 – Redundant / unused transparency fields in forms**
  - Status: OPEN
  - Area: Owner forms, transparency
  - Summary: Some transparency-related fields are duplicated or not wired through to DB/Admin/Student (e.g. `good_to_know` variants, water reliability fields).

- **ISSUE-AGENTS-001 – Agent & compound model incomplete**
  - Status: OPEN
  - Area: Data model, Owner/Agent/Admin portals
  - Summary: Agents and compounds not yet fully modelled in DB and UIs; business rules forbid student-side fees but this is not encoded in code.

---

## 2. Fixed Issues Log

When an issue from section 1 is resolved, move it here with a short summary.

Template entry:

- **ID:** ISSUE-XXXX-YYY
  - Date fixed: YYYY-MM-DD
  - Area:
  - Summary of fix (1–3 lines)
  - Key PR/commit refs:
  - Related decision(s): DEC-...

---


- **ID:** ISSUE-VISIBILITY-001
  - Date fixed: 2025-11-25
  - Area: Owner Portal, Property Pipeline, Admin Tools
  - Summary of fix: Split pipeline health from student visibility using
    `PropertyVisibilityResult`, updated Owner success/visibility messaging,
    aligned Admin PropertyVisibilityMonitor with verified-only rule, and
    added unit tests for `verifyPropertyVisibility`.
  - Key PR/commit refs: (TBD – link when merged)
  - Related decision(s): DEC-VISIBILITY-001

- **ID:** ISSUE-VISIBILITY-002
  - Date fixed: 2025-11-25
  - Area: Shared media utilities (Owner/Admin/Student)
  - Summary of fix: Standardized cover image derivation via
    `deriveCoverImageFromProperty`, updated booking summary and Explore to use
    the canonical helper, ensured consistent placeholder behavior when no
    valid remote image exists, and added unit tests for the derivation
    logic.
  - Key PR/commit refs: (TBD – link when merged)
  - Related decision(s): DEC-MEDIA-002

---

## 3. Pending Big Decisions

These require explicit `DEC-...` entries in `decision_log.md` before implementation.

- **DEC-VISIBILITY-001 – Align Owner "visibility" checks with verified-only Student rule**
  - Status: IMPLEMENTED (see `decision_log.md`)

- **DEC-UTILITIES-001 – Canonical utilities & billing matrix**
  - Define utility taxonomy (electricity, water, waste, internet, gas, cleaning, security, toilet, other)
  - Decide allowed billing models per utility (included, shared bill, individual bill, not provided)

- **DEC-FORMS-001 – Router questions + specialized forms per property category**
  - Exact onboarding question set
  - Mapping from answers → Hostel/Homestel/Apartment flow and structure creator mode

- **DEC-MEDIA-001 – Room-type media requirements & validation**
  - Minimum required photos per room type
  - How story viewer combines property-level and room-type media

- **DEC-AGENTS-001 – Initial Agent & Compound compensation model**
  - Owner-funded management share vs future Operator Program

- **DEC-OPERATOR-001 – ROOMie Operator Program (long-term)**
  - When and how to introduce fully managed operations without harming students.

