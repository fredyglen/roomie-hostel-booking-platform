# ROOMie Property Pipeline Contract (Owner → DB → Admin → Student)

> **Scope**
> Hostels first; focuses on properties table + room/room-type pricing pipeline, with transparency fields that drive student decisions. Sources: `scripts/sql/public_schema_dump.sql`, `docs/.../ROOMI_COMPREHENSIVE_DATABASE_SCHEMA.sql`, Owner/Admin/Student React code.

## 1. Canonical invariants

- **DB is source of truth**: All student‑facing property data must come from Supabase `public.properties` (and related room/pricing tables), never from mocks.
- **Visibility rule (student portal)**
  - Queries (e.g. `propertyDataService.fetchProperties`) enforce: `is_available = true` and `verification_status = 'verified'`.
  - Admin tools (`VerificationManagement`, `QuickPropertyVerifier`, `PropertyVisibilityMonitor`) manage `verification_status` + `is_available` and therefore student visibility.
- **Golden path**
  - **Owner** submits property via `PropertyForm` + sub‑components.
  - **DB** stores row in `public.properties` (+ future `rooms` / pricing tables).
  - **Admin** reviews via `VerificationManagement` (primary) and `QuickPropertyVerifier` / `PropertyVisibilityMonitor` (legacy helpers).
  - **Student** sees listing → detail → booking using:
    - `propertyDataService.fetchProperties` / `useDynamicProperties` / `propertyService` for listings.
    - `PropertyDetailView` + `PropertyTabs` for detail + transparency.
    - `BookingStepsContainer` + `EnhancedBookingForm` + `RoomSelectionStep` + `BookingSummarySidebar` + `PaymentStep` for booking.

## 2. Properties schema (from repo SQL)

**Actual Supabase dump (`scripts/sql/public_schema_dump.sql`, line ~599)**

Key columns (abridged):

- Identity: `id uuid PK`, `owner_id uuid`.
- Core info: `title text`, `description text`, `property_type text`, `property_category text DEFAULT 'Hostel'`.
- Location: `address text`, `city text`, `state text`, `zip text`.
- Pricing & availability: `rent numeric`, `available_from date`, `available_to date`, `is_furnished boolean`, `is_available boolean DEFAULT true`.
- Structure & capacity: `bedrooms int`, `bathrooms int`, `total_rooms int`, `rooms_available int`, `beds_per_room int`, `beds_available int`, `max_occupants int`.
- Media & amenities: `images text[]`, `amenities text[]`, `virtual_tour_url text`.
- Verification / safety / policies:
  - `verification_status text DEFAULT 'pending'`
  - `gender_restriction text`, `semester_availability text[]`
  - `parking_available boolean`, `parking_cost numeric(10,2)`
  - `security_features text[]`, `internet_speed text`
  - `emergency_contact_name text`, `emergency_contact_phone text`
  - `has_accessibility_features boolean`, `pet_policy text`, `cancellation_policy text`
- Auditing: `created_at timestamptz`, `updated_at timestamptz`.

**Target design doc (`ROOMI_COMPREHENSIVE_DATABASE_SCHEMA.sql`)**

- Adds / renames:
  - `base_price_per_semester numeric`, `price_currency text DEFAULT 'GHS'`.
  - `gender_type text`, `max_occupancy int`, `current_occupancy int`.
  - Lat/lng, `distance_to_campus`, `campus_name`, compound fields.
  - Additional room/bed tables (`rooms`, `beds`) and indexes/RLS.
- **Gap**: Some of these fields (e.g. `base_price_per_semester`, `gender_type`, `max_occupancy`) are assumed in TypeScript (e.g. `propertyService`), but are not present in the exported `public_schema_dump.sql`. Live DB must be verified before any migration.

## 3. Field mapping: Owner → DB → Admin → Student

### 3.1 Identity, location, category

| Concept | Owner form source | DB column(s) | Admin usage | Student usage |
| --- | --- | --- | --- | --- |
| Property title | `PropertyInfoFields` → `title` | `title` | Seen in `VerificationManagement`, `QuickPropertyVerifier`, `PropertyVisibilityMonitor` | Card titles, detail header, booking summary (`property.title` / `name`) |
| Category (Hostel/Homestel/Apartment) | `IntelligentPropertyRouter` → `propertyType` + `PropertyForm` → `propertyCategory` | `property_type`, `property_category` | Displayed in `VerificationManagement` (`property_category`); used implicitly in other admin tools | Drives copy & pricing rules (Hostel defaults to semester, etc.; used by `usePropertyRoomTypes` & booking) |
| Address/location | `PropertyInfoFields` → `address`, `city`, `state` | `address`, `city`, `state`, `zip` | Not richly surfaced; admin cards show address/city only in some views | Used in cards, detail `location` text, and map/location sections |
| Nearest university / campus | Owner form fields (e.g. `nearest_university`) | **Planned**: `campus_name` / `distance_to_campus` in design doc; not present in dump | Not visible in current admin UIs | Shown in detail About tab (distance text) when available; currently partly mock/derived |

### 3.2 Availability, verification, visibility

| Concept | Owner form source | DB column(s) | Admin usage | Student usage |
| --- | --- | --- | --- | --- |
| Availability toggle | `PropertyDetailsFields` → `status` / `is_available` | `is_available` | `PropertyVisibilityMonitor` checks/repairs; `QuickPropertyVerifier`/`VerificationManagement` assume `is_available` controls Live vs Hidden | `fetchProperties` filters on `is_available = true`; students never see unavailable properties |
| Verification status | Not set by Owner (system/admin) | `verification_status` | Central in `VerificationManagement`, `QuickPropertyVerifier`, `PropertyVisibilityMonitor` for approve/reject | Student listing & detail are implicitly filtered to `verification_status = 'verified'` via service queries |
| Capacity / max occupants | Owner form fields for `rooms`, `beds`, occupancy | `max_occupants`, `total_rooms`, `rooms_available`, `beds_per_room`, `beds_available` | Currently **not** displayed in admin UIs beyond count summaries | Student sees availability per room type via `usePropertyRoomTypes` (derived), not directly from these raw columns |

### 3.3 Pricing and room types

| Concept | Owner form source | DB column(s) | Admin usage | Student usage |
| --- | --- | --- | --- | --- |
| Base semester price | `PropertyForm` → `rent` / pricing matrix | **Dump**: `rent`; **Design**: `base_price_per_semester`, `price_currency` | Admin sees `rent`/`price` in property lists; not exposed as structured semester vs month | Student listing cards use `rent`/`price` (per‑semester display); detail uses `IntelligentRoomPricing` for room‑type‑specific price |
| Room types & per‑room pricing | Owner structure + pricing matrix (`room_type_pricing`, `room_types`) | Planned in `rooms` / pricing tables (design doc). Current DB dump has only aggregate capacity columns | Admin has **no** direct, structured view of room type pricing | Student About tab + booking use `usePropertyRoomTypes` (joins `room_type_pricing`/fallbacks) to show a dropdown of room types & prices |
| Selected room type for booking | `RoomSelectionStep` (`selectedRoomType`) | Stored with booking, not on `properties` | Admin will see via bookings not properties | Student sees chosen room type in booking summary + Paystack metadata |

### 3.4 Transparency fields (decision‑critical)

These are the fields you care most about for student decisions.

| Concept | Owner form source | DB column(s) (expected) | Admin usage | Student usage |
| --- | --- | --- | --- | --- |
| Good to know / Must‑know | `PropertyInfoFields` **and** `PropertyDetailsFields` both bind `good_to_know` (duplicate) | **Design**: `good_to_know text`; **Dump**: **missing** (value currently lives in form + TS only) | Not visible in any admin view | `PropertyTabs` shows "Must know information" box when `good_to_know` present; also included in Essentials tone |
| Washroom type (private/shared/external) | Owner washroom config fields (washroom location/sharing) | **Design**: `washroom_type text`; **Dump**: **missing** | Not visible; cannot be explicitly verified | `PropertyTabs` builds Essentials line using `washroomType` prop; currently populated only when TS + DB agree |
| Utilities / billing (individual meters, bill sharing, meter type) | `PropertyDetailsFields` → `allow_bill_sharing`; planned meters section | **Design**: `has_individual_meters boolean`, `allow_bill_sharing boolean`, `meter_type text`; **Dump**: **missing** | Not visible in admin; cannot be checked before verification | `PropertyTabs` passes these fields to a transparency section and the Essentials line, defaulting when absent |
| Water reliability | Planned Owner field (not yet wired) | **Design**: `water_reliability text`, `water_reliability_notes text`; **Dump**: **missing** | Not in admin UIs | Student About tab is prepared to show water reliability (part of Essentials) but currently often blank |
| Parking & security | Owner amenities/flags | `parking_available`, `parking_cost`, `security_features text[]` | Not prominently shown during verification | Student sees these via amenities + transparency UI (e.g. icons/badges) |
| Internet speed | Owner amenities/flags | `internet_speed text` | Not surfaced to admin | Appears in detail/amenities; also candidate for Essentials in future |
| Gender restriction | Owner form → `gender_restriction` (TS also checks `gender_type`) | `gender_restriction text` (dump), `gender_type` (design) | Admin list shows `gender_restriction` | Student cards & detail show a small gender badge + copy derived from this |
| Cancellation policy | Owner form or default text | `cancellation_policy text` | Not editable/visible in admin | Student sees generic cancellation terms on Payment step (currently hardcoded, not property‑specific) |

### 3.5 Media & story

| Concept | Owner form source | DB column(s) | Admin usage | Student usage |
| --- | --- | --- | --- | --- |
| Cover image | `MediaUploadFields` → sets `image_url` + first image in `images` | **Dump**: `images text[]`; **Code** also uses `image_url` (not in dump) and `media` JSON on some paths | Admin sees tiny thumbnails only in some views via `deriveCoverImageFromProperty` | Student listing/booking summary/Paystack metadata use `deriveCoverImageFromProperty`, preferring cover, then `image_url`, then first in `images` |
| Property/Environment images | `MediaUploadFields` merges property + environment into `images[]` | `images text[]` | Not browsable in admin verification tools (no gallery) | Student detail + Story viewer use this gallery extensively |

## 4. Transparency matrix (decision view)

For each transparency dimension:

1. **Washroom & utilities**
   - Owner: Configured via washroom + billing sections (some fields not yet backed by real columns).
   - DB: Design includes `washroom_type`, `has_individual_meters`, `allow_bill_sharing`, `meter_type`; dump lacks them → **schema gap**.
   - Admin: Cannot currently see or edit these values.
   - Student: Sees simplified Essentials sentence and Must‑know box; currently often based on partial/default data.

2. **Water reliability**
   - Owner: Intended text field (not fully wired in live form).
   - DB: Design includes `water_reliability`, `water_reliability_notes`; dump lacks them.
   - Admin: No surface.
   - Student: About tab prepared but mostly blank → **transparency promise not fully honored**.

3. **Parking, internet, security**
   - Owner: Configurable via amenities and a few booleans.
   - DB: Backed by `parking_available`, `parking_cost`, `internet_speed`, `security_features[]`.
   - Admin: Not first‑class in verification flows.
   - Student: Visible via amenities and detail copy.

4. **Gender & eligibility**
   - Owner: Selects `gender_restriction` ("Male only", "Female only", "Mixed").
   - DB: `gender_restriction` (dump) / `gender_type` (design) with minor naming drift.
   - Admin: Sees in property lists, but not strongly emphasized in verification.
   - Student: Badge on cards + detail.

5. **Must know / rules**
   - Owner: `good_to_know` (duplicated field) + house rules section.
   - DB: `cancellation_policy` exists; `good_to_know`/`house_rules` not present in dump.
   - Admin: Cannot read the actual owner narrative before verifying.
   - Student: Sees `good_to_know` block and generic T&Cs on Payment step.

## 5. Gaps & risks (high level)

- **Schema drift** between `public_schema_dump.sql` and `ROOMI_COMPREHENSIVE_DATABASE_SCHEMA.sql` and TypeScript assumptions (e.g. `base_price_per_semester`, `gender_type`, `max_occupancy`, transparency columns) → must be reconciled via the DATABASE MIGRATION PROTOCOL against the live Supabase schema.
- **Transparency fields partially virtual**: Many decision‑critical fields are wired in React and design docs but not fully backed by physical columns or admin UIs → students see defaults or nothing instead of clear owner‑verified data.
- **Admin blind spots**: Verification tools focus on status and high‑level info; they cannot currently verify:
  - Washroom type and sharing arrangement.
  - Water reliability.
  - Billing/utility rules (individual meter vs shared, who pays what).
  - Property‑level must‑know notes and cancellation nuances.
- **Owner form confusion**:
  - Duplicate `good_to_know` fields.
  - Weak linkage between pricing matrix (room types) and what students/booking actually see.
- **Room‑type pricing contract implicit**: `usePropertyRoomTypes` + booking flow rely on a room/pricing schema that is not consistently visible in Admin or clearly documented at DB level.

> **Next step (Phase 2, after your approval):**
> 1) Lock this contract as the canonical map, 2) run Supabase verification queries to confirm live schema, and 3) implement targeted changes: clean up Owner form fields, expose transparency fields in Admin verification, and ensure Student About/booking use only real, owner‑ and admin‑verified data.



## 6. Stage A.1 – Canonical Student Loader & Booking Alignment (STATUS: COMPLETE)

- **Canonical service:** All student‑facing single‑property loads now go through `enhancedPropertyService`:
  - Listings: `useDynamicProperties` → `enhancedPropertyService.searchProperties` → `transformDatabaseProperty`.
  - Detail: `PropertyDetail.tsx` → `usePropertyById` (from `useDynamicProperties`) → `enhancedPropertyService.getPropertyById`.
  - Booking: `BookingStepsContainer.tsx` → `usePropertyById` → `enhancedPropertyService.getPropertyById`.
- **Visibility invariants:** `enhancedPropertyService.getPropertyById` enforces the student visibility rule documented above:
  - `is_available = true`
  - `verification_status = 'verified'`
  - Unverified/unavailable/deleted properties surface to the UI as "Property not found" on both detail and booking.
- **Canonical transformer:** `transformDatabaseProperty` in `enhanced-property.service.ts` now delegates to `transformDbProperty` (in `src/utils/propertyTransforms.ts`) and then layers in DB‑backed transparency fields. This ensures the `Property` type used by listings, detail, and booking is consistent and includes:
  - `gender_restriction` / `gender_type`
  - `washroom_type`, `shared_washroom_count`
  - `internet_speed`
  - `parking_available`, `parking_cost`
  - `security_features[]`
  - `cancellation_policy`
  - plus optional design‑only fields (e.g. `good_to_know`, `has_individual_meters`, `allow_bill_sharing`, `meter_type`, `water_reliability`, `water_reliability_notes`) when present.
- **Transparency availability:** `PropertyDetailView` / `PropertyTabs` now receive these transparency fields via the canonical `Property` from `usePropertyById`. The same `Property` instance is passed to `EnhancedBookingForm`, so booking summaries and Paystack metadata reflect the same verified data students saw on the detail page.
- **Previously flagged gaps now resolved:**
  - **"BookingStepsContainer unsafe direct queries"** – fixed. `BookingStepsContainer` no longer calls Supabase directly or assembles ad‑hoc `Property` objects; it relies entirely on `usePropertyById` and the canonical transformer.
  - **"PropertyDetail using deprecated hook without verification checks"** – fixed. `PropertyDetail` no longer uses `usePropertyData`/`propertyDataService`; it now uses `usePropertyById`, inheriting the visibility invariants and the enhanced transparency mapping.
