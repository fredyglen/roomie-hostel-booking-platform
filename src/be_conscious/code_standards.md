# ROOMie Code & Product Standards (Shared Brain)

> Canonical rules for property categories, room types, utilities, visibility,
> media, and quality. All implementation must respect these standards.

---

## 1. Property Categories & Semantics

ROOMie recognizes three primary categories:

- **Hostel**
  - Many beds, often multi-block/multi-floor.
  - Booking: mostly **per bed** in `X_in_a_room`, plus possible private `1_in_a_room`.
  - Default durations: **semester (4 months)** and **academic year (8 months)**.
  - Structure: `blocks → floors → rooms → beds`.

- **Homestel**
  - Normal houses/homestels with a smaller number of rooms.
  - Mix of single and shared rooms.
  - Single rooms use flexible Homestel pricing (1w–2y); shared rooms closer to hostel rules.

- **Apartment**
  - Self-contained units (students rent the whole unit).
  - Booking: **per unit**.
  - Structure: `buildings → floors → units`; bed-level tracking optional.

Owner flows, DB fields, and pricing logic must be explicit about which category they target.

---

## 2. Room Types & Booking Modes

- Canonical hostel room types: `1_in_a_room`, `2_in_a_room`, `3_in_a_room`, `4_in_a_room`, `5_in_a_room`, `6_in_a_room`.
- Apartment types: `1_bedroom_apartment`, `2_bedroom_apartment`, etc.
- Each room type carries a **booking mode**:
  - `per_bed`, `per_room`, or `per_unit`.
- Student UI must:
  - Show prices and occupancy per selected room type.
  - Keep naming consistent with Owner forms and DB.

No `single_room` / `shared_room` pseudo-types; always use the canonical names.

---

## 3. Visibility Rules (Non‑Negotiable)

- **Student Portal visibility** must always enforce:
  - `is_available = true`
  - `verification_status = 'verified'`
- Owner/Admin tools may see more, but must **never** imply student visibility when:
  - `verification_status != 'verified'`, or
  - `is_available = false`.
- For diagnostics, prefer two concepts:
  - `pipelineHealthy`: record and structure exist; no obvious errors.
  - `studentVisible`: satisfies the strict rule above.

Any new feature affecting visibility must be checked against this rule.

---

## 4. Utilities & Billing Model

- Utilities are modelled as a **per-utility matrix**, not a single `all_inclusive` flag.
- Utility types (minimum set):
  - electricity, water, waste, internet, gas, cleaning, security, toilet, other.
- For each utility, allowed **billing models**:
  - `included_in_rent`, `shared_bill`, `individual_bill`, `not_provided`.
- `meter_type` (e.g. `shared_meter`, `self_meter`, `all_inclusive_meter`) describes how metered utilities are measured, not the billing model itself.
- `allow_bill_sharing` is considered **deprecated**:
  - New logic should derive bill sharing from `meter_type` + utility matrix.
  - Existing usages should be slowly removed or migrated.
- "All inclusive" in UI is a **preset** that configures the matrix; it is not a field.

Student-facing transparency text must be specific (e.g. "Light, water & waste included; you pay your own internet"), never just "all inclusive".

---

## 5. Media & Transparency

- Media model:
  - `cover_image`: single hero image used on cards and booking summary.
  - `property_images[]`: shared/property-level images (building, environment).
  - `room_type_media[room_type][]`: images/videos specific to each room type (e.g. `2_in_a_room`).
- Owner media step must:
  - Collect at least one image per active room type.
  - Make it clear which media belong to which room type.
- Student detail & Story viewer must:
  - Show room-type media when a room type is selected.
  - End with a clear **Transparency / Must Know** slide summarizing utilities, washroom, and rules.
- No runtime AI-generated copy in the product UI:
  - Essentials / Transparency sentences must be deterministic templates.

---

## 6. TypeScript, Testing & Quality

- TypeScript:
  - Prefer strict typing; avoid `any`.
  - Define interfaces/types for all major data structures (properties, room types, utilities, bookings).
- Testing:
  - Use Vitest + Testing Library.
  - For every non-trivial change, add or update unit tests.
  - For cross-cutting flows (e.g. visibility, booking, payments), add integration tests.
- Error handling:
  - Fail fast and visibly; no silent catches that hide real issues.

---

## 7. AI Agent Conduct & Tool Usage

- All AI agents must:
  - Follow `ROOMIE_DEV_WORKFLOW.md` before any code change.
  - Use `codebase-retrieval` and `view` for archaeology.
  - Use `web-search` / `web-fetch` for non-trivial behavior and library usage.
  - Use `launch-process` to run tests/linters/builds after changes.
- DB changes:
  - Must follow the DATABASE MIGRATION PROTOCOL.
  - Never assume table/column existence; always verify against live schema output provided by the user.
- Frontend conventions:
  - Use React 18 + TypeScript + Vite, shadcn/ui, Tailwind, Radix, React Hook Form + Zod, TanStack Query.
  - No external Unsplash/default URLs; use placeholders when media missing.

Any deviation from these standards must be explicitly justified and documented in `decision_log.md`.

