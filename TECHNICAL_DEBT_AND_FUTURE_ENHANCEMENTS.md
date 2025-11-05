# Technical Debt & Future Enhancements
**Date:** 2025-11-05  
**Branch:** fix/critical-implementation-gaps  
**Status:** Post-MVP Roadmap

---

## OVERVIEW

This document tracks technical debt and future enhancements that were **intentionally deferred** to prioritize MVP launch. All items listed here are **non-blocking** for the initial release.

---

## DEFERRED TO POST-LAUNCH

### 1. Compound Management Enhancements (Priority: P1)

**Current State (MVP):**
- ✅ Compounds table created with RLS policies
- ✅ CompoundsList page shows basic compound list
- ✅ CompoundDashboard page structure created
- ✅ CompoundNew page for compound creation
- ✅ Owner sidebar navigation integrated

**Deferred Features:**
- [ ] **Real-time Analytics Dashboard**
  - Revenue charts (Recharts integration)
  - Occupancy heatmaps
  - Property comparison tables
  - Live booking updates via Supabase subscriptions
  - **Estimated Effort:** 8-12 hours
  - **Dependencies:** Need real booking data to test charts

- [ ] **Bulk Operations**
  - Bulk price updates across compound properties
  - Bulk availability management
  - Bulk amenity updates
  - **Estimated Effort:** 4-6 hours
  - **Dependencies:** None

- [ ] **Advanced Filtering & Search**
  - Filter compounds by occupancy rate
  - Filter by revenue performance
  - Search by property names within compound
  - **Estimated Effort:** 2-3 hours
  - **Dependencies:** None

- [ ] **Export & Reporting**
  - PDF export of compound analytics
  - CSV export of booking data
  - Monthly revenue reports
  - **Estimated Effort:** 6-8 hours
  - **Dependencies:** Reporting library selection

**Why Deferred:**
- MVP only needs basic compound CRUD operations
- Analytics require real booking data to be meaningful
- Charts and visualizations are polish, not core functionality

---

### 2. Review System Implementation (Priority: P2)

**Current State (MVP):**
- ✅ Fake ratings removed from all property components
- ✅ Components show "No reviews yet" placeholder
- ✅ Database has property_reviews table

**Deferred Features:**
- [ ] **Review Submission Flow**
  - Student review form after booking completion
  - Rating validation (1-5 stars)
  - Review moderation workflow
  - **Estimated Effort:** 6-8 hours
  - **Dependencies:** Booking completion webhook

- [ ] **Review Display**
  - Show real reviews on property pages
  - Calculate average ratings
  - Sort/filter reviews
  - **Estimated Effort:** 4-6 hours
  - **Dependencies:** Review submission flow

- [ ] **Review Analytics**
  - Owner dashboard showing review trends
  - Response rate tracking
  - Sentiment analysis (future)
  - **Estimated Effort:** 4-6 hours
  - **Dependencies:** Review display

**Why Deferred:**
- No bookings yet = no reviews to display
- Fake ratings removed is sufficient for MVP
- Review system can be added once platform has users

---

### 3. Advanced Property Search (Priority: P2)

**Current State (MVP):**
- ✅ Basic price filter (0-50,000 GHS)
- ✅ Property type filter (Hostel, Homestel, Apartment)
- ✅ Gender restriction filter

**Deferred Features:**
- [ ] **Location-Based Search**
  - Map view with property markers
  - Distance from campus calculation
  - Geo-location sorting
  - **Estimated Effort:** 8-10 hours
  - **Dependencies:** Google Maps API integration

- [ ] **Advanced Filters**
  - Amenity multi-select (WiFi, AC, Kitchen, etc.)
  - Availability date range picker
  - Room type filter (1 in a room, 2 in a room, etc.)
  - **Estimated Effort:** 4-6 hours
  - **Dependencies:** None

- [ ] **Saved Searches**
  - Save filter combinations
  - Email alerts for new matching properties
  - **Estimated Effort:** 6-8 hours
  - **Dependencies:** Email service integration

**Why Deferred:**
- Basic filters sufficient for MVP
- Map integration requires API costs
- Advanced filters can be added based on user feedback

---

### 4. Payment System Enhancements (Priority: P1)

**Current State (MVP):**
- ✅ Paystack integration working
- ✅ Commission calculation server-side
- ✅ Legacy payment API blocked
- ✅ Payment webhooks handling

**Deferred Features:**
- [ ] **Split Payment Tracking**
  - Track individual student contributions in shared bookings
  - Payment reminders for pending contributions
  - Partial payment status display
  - **Estimated Effort:** 6-8 hours
  - **Dependencies:** None

- [ ] **Payment Analytics**
  - Revenue dashboard for owners
  - Commission breakdown for admins
  - Payment success rate tracking
  - **Estimated Effort:** 4-6 hours
  - **Dependencies:** Real payment data

- [ ] **Refund Workflow**
  - Cancellation policy enforcement
  - Automated refund calculations
  - Refund approval workflow
  - **Estimated Effort:** 8-10 hours
  - **Dependencies:** Paystack refund API

**Why Deferred:**
- Basic payment flow working for MVP
- Analytics need real transaction data
- Refunds can be handled manually initially

---

### 5. Bed Tracking System (Priority: P1)

**Current State (MVP):**
- ✅ Beds table created with RLS policies
- ✅ References existing rooms table correctly
- ✅ Occupancy tracking fields (is_occupied, current_occupant_id)

**Deferred Features:**
- [ ] **Automatic Bed Assignment**
  - Assign beds on booking confirmation
  - Decrement beds_available count
  - Prevent overbooking
  - **Estimated Effort:** 4-6 hours
  - **Dependencies:** Booking webhook integration

- [ ] **Bed Availability Display**
  - Show available beds per room type
  - Real-time availability updates
  - Bed selection during booking
  - **Estimated Effort:** 6-8 hours
  - **Dependencies:** Automatic bed assignment

- [ ] **Occupancy Reports**
  - Occupancy rate by property
  - Bed utilization analytics
  - Vacancy alerts
  - **Estimated Effort:** 4-6 hours
  - **Dependencies:** Real occupancy data

**Why Deferred:**
- Table structure ready for future use
- Manual bed management sufficient for MVP
- Automatic assignment needs booking flow testing

---

### 6. Code Quality Improvements (Priority: P3)

**Current State (MVP):**
- ✅ 0 TypeScript errors
- ✅ All modified files compile successfully
- ✅ Database migration protocol established

**Deferred Improvements:**
- [ ] **Unit Tests**
  - Test commission calculation logic
  - Test price filter functions
  - Test property type helpers
  - **Estimated Effort:** 8-12 hours
  - **Dependencies:** Testing framework setup

- [ ] **Integration Tests**
  - Test booking flow end-to-end
  - Test payment webhook handling
  - Test compound creation flow
  - **Estimated Effort:** 12-16 hours
  - **Dependencies:** Test database setup

- [ ] **Performance Optimization**
  - Implement query caching
  - Optimize image loading
  - Add pagination to property lists
  - **Estimated Effort:** 6-8 hours
  - **Dependencies:** Performance monitoring tools

**Why Deferred:**
- MVP focused on functionality over test coverage
- Performance optimization needs real user data
- Can be added incrementally post-launch

---

## TECHNICAL DEBT TO ADDRESS

### 1. Duplicate Constraints (Low Priority)
**Issue:** `properties.owner_id` has two foreign key constraints:
- `fk_properties_owner` (working)
- `properties_owner_id_fkey` (duplicate)

**Action:** Drop duplicate constraint in future migration
**Impact:** None (duplicate constraint doesn't break anything)
**Estimated Effort:** 5 minutes

### 2. Legacy Bookings Table (Low Priority)
**Issue:** `bookings` table still exists alongside `bookings_enhanced`
**Action:** Migrate remaining data and deprecate old table
**Impact:** None (bookings_enhanced is authoritative)
**Estimated Effort:** 2-3 hours

### 3. Temporary SQL Files (Low Priority)
**Issue:** Verification SQL files in root directory
**Files:** check_database_schema.sql, check_buildings_table.sql, verify_broken_constraints.sql
**Action:** Move to scripts/ directory or delete
**Impact:** None (used for one-time verification)
**Estimated Effort:** 5 minutes

---

## PRIORITY MATRIX

| Feature | Priority | Effort | Dependencies | Launch Blocker? |
|---------|----------|--------|--------------|-----------------|
| Compound Analytics | P1 | 8-12h | Real data | ❌ No |
| Split Payment Tracking | P1 | 6-8h | None | ❌ No |
| Bed Assignment | P1 | 4-6h | Webhooks | ❌ No |
| Review System | P2 | 10-14h | Bookings | ❌ No |
| Advanced Search | P2 | 8-10h | Maps API | ❌ No |
| Unit Tests | P3 | 8-12h | Framework | ❌ No |

**None of these items block MVP launch.**

---

## NEXT STEPS

1. **Launch MVP** with current feature set
2. **Gather user feedback** on most-needed features
3. **Prioritize enhancements** based on actual usage patterns
4. **Implement in sprints** (2-week cycles)

---

## NOTES

- All deferred features have database schema support already in place
- No breaking changes required to add these features
- Can be implemented incrementally without disrupting live system

