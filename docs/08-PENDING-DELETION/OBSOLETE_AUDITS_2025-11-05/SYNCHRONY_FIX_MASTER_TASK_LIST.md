# SYNCHRONY FIX MASTER TASK LIST
**Branch:** `fix/synchrony-restoration-sprint`  
**Goal:** Ship production-ready platform in 6-8 weeks  
**Approach:** 15-task sprints, commit after each sprint  
**Status:** 🟢 READY TO START

---

## 📋 SPRINT OVERVIEW

| Sprint | Focus Area | Tasks | Est. Time | Priority |
|--------|-----------|-------|-----------|----------|
| **Sprint 1** | Critical Fixes | 15 | 12-15 hours | 🔴 CRITICAL |
| **Sprint 2** | Commission Synchrony | 15 | 10-12 hours | 🔴 CRITICAL |
| **Sprint 3** | Property Type Synchrony | 15 | 12-15 hours | 🔴 CRITICAL |
| **Sprint 4** | Database Schema Alignment | 15 | 8-10 hours | 🟠 HIGH |
| **Sprint 5** | Intelligent Property Router | 15 | 10-12 hours | 🟠 HIGH |
| **Sprint 6** | Admin Portal Completion | 15 | 12-15 hours | 🟡 MEDIUM |
| **Sprint 7** | Owner Portal Polish | 15 | 10-12 hours | 🟡 MEDIUM |
| **Sprint 8** | Testing & Validation | 15 | 15-18 hours | 🔴 CRITICAL |

**Total: 120 tasks, 89-109 hours (6-8 weeks part-time)**

---

## 🔥 SPRINT 1: CRITICAL FIXES (15 TASKS)
**Goal:** Remove fake data, fix payment bypass, fix price filters  
**Time:** 12-15 hours  
**Commit Message:** "fix: remove fake ratings and critical data issues"

### Tasks:

1. [ ] **Remove hardcoded 4.5 rating from PropertyCard.tsx**
   - File: `src/components/property/PropertyCard.tsx`
   - Find: `rating={4.5}`
   - Replace: `rating={property.average_rating || 0}`
   - Test: Verify properties without ratings show 0 or "No ratings yet"

2. [ ] **Remove hardcoded 4.4 rating from PropertyDetailDesktop.tsx**
   - File: `src/components/property/PropertyDetailDesktop.tsx`
   - Find: `4.4` hardcoded rating
   - Replace: `property.average_rating || 0`
   - Add: "No reviews yet" message when rating is 0

3. [ ] **Remove hardcoded 4.5 rating from PropertyDetailModal.tsx**
   - File: `src/components/property/PropertyDetailModal.tsx`
   - Find: `4.5` hardcoded rating
   - Replace: `property.average_rating || 0`
   - Test: Modal shows correct rating

4. [ ] **Remove hardcoded ratings from PremiumPropertyCard.tsx**
   - File: `src/components/properties/PremiumPropertyCard.tsx`
   - Find: All hardcoded rating values
   - Replace: `property.average_rating || 0`
   - Add: Badge "New Listing" when no ratings

5. [ ] **Remove hardcoded ratings from FeaturedProperties.tsx**
   - File: `src/components/student/FeaturedProperties.tsx`
   - Find: Hardcoded ratings in featured list
   - Replace: Real ratings from database
   - Test: Featured properties show correct ratings

6. [ ] **Remove hardcoded ratings from PropertyList.tsx**
   - File: `src/components/student/PropertyList.tsx`
   - Find: Any hardcoded rating values
   - Replace: Database ratings
   - Test: List view shows correct ratings

7. [ ] **Fix price filter max default to 50,000 GHS**
   - File: `src/hooks/filters/useFilteredProperties.tsx`
   - Find: Price filter initialization
   - Change: `maxPrice: 50000` (currently 10000)
   - Test: Properties up to 50K GHS visible by default

8. [ ] **Fix price filter in PropertyFilters.tsx**
   - File: `src/components/student/PropertyFilters.tsx`
   - Find: Price slider max value
   - Change: Max to 50000
   - Test: Slider allows selection up to 50K

9. [ ] **Fix price filter in usePropertyFilters.ts**
   - File: `src/hooks/usePropertyFilters.ts`
   - Find: Default price range
   - Change: `[0, 50000]`
   - Test: Filter state initializes correctly

10. [ ] **Remove payment validation bypass in BookingPayment.tsx**
    - File: `src/components/booking/BookingPayment.tsx`
    - Find: `ALLOW_LEGACY_PAYMENTS` or bypass logic
    - Remove: All legacy payment code
    - Test: Payment requires valid Paystack response

11. [ ] **Remove payment bypass in PaymentService.ts**
    - File: `src/services/payment.service.ts`
    - Find: Legacy payment methods
    - Remove: All non-Paystack payment paths
    - Test: Only Paystack payments work

12. [ ] **Remove payment bypass in BookingConfirmation.tsx**
    - File: `src/components/booking/BookingConfirmation.tsx`
    - Find: Mock payment success logic
    - Remove: All simulated payment confirmations
    - Test: Confirmation only shows after real payment

13. [ ] **Fix student verification simulation**
    - File: `src/components/booking/StudentVerification.tsx`
    - Find: Auto-approve or mock verification
    - Change: Require real student ID upload
    - Test: Verification requires actual document

14. [ ] **Add "No ratings yet" UI component**
    - File: `src/components/property/NoRatingsPlaceholder.tsx` (create)
    - Content: Friendly message for properties without ratings
    - Style: Match design system
    - Test: Shows on properties with 0 ratings

15. [ ] **Run diagnostics and commit Sprint 1**
    - Command: `npm run type-check`
    - Fix: Any TypeScript errors
    - Test: `npm run dev` - verify no console errors
    - Commit: "fix: remove fake ratings and critical data issues"

---

## 🎯 SPRINT 2: COMMISSION SYNCHRONY (15 TASKS)
**Goal:** Connect admin settings to centralizedCommissionEngine  
**Time:** 10-12 hours  
**Commit Message:** "feat: connect admin settings to commission engine dial"

### Tasks:

1. [ ] **Create useRealTimeCommissionConfig hook import in Settings.tsx**
   - File: `src/pages/admin/Settings.tsx`
   - Add: `import { useRealTimeCommissionConfig } from '@/hooks/useRealTimeCommissionConfig'`
   - Add: `import { centralizedCommissionEngine } from '@/config/centralized-commission.config'`

2. [ ] **Add commission config state to Settings component**
   - File: `src/pages/admin/Settings.tsx`
   - Add: Hook initialization with portal='admin', autoSubscribe=true
   - Add: State for loading, error handling

3. [ ] **Replace hardcoded platform commission input**
   - File: `src/pages/admin/Settings.tsx`
   - Find: Hardcoded 5% input
   - Replace: Input connected to `rates.platform`
   - Add: onChange handler calling `updateCommissionRate()`

4. [ ] **Replace hardcoded platform fee input**
   - File: `src/pages/admin/Settings.tsx`
   - Find: Hardcoded 100 GHS input
   - Replace: Input connected to `fees.fixed`
   - Add: onChange handler calling `updatePlatformFee()`

5. [ ] **Add agent commission rate input**
   - File: `src/pages/admin/Settings.tsx`
   - Add: New input for agent commission (3.7%)
   - Connect: To `rates.agent`
   - Handler: `updateCommissionRate('agent', value)`

6. [ ] **Add VAT rate input**
   - File: `src/pages/admin/Settings.tsx`
   - Add: New input for VAT rate
   - Connect: To `rates.vat`
   - Handler: `updateCommissionRate('vat', value)`

7. [ ] **Add real-time update indicator**
   - File: `src/pages/admin/Settings.tsx`
   - Add: Green dot indicator when connected
   - Add: Last updated timestamp
   - Add: "Live" badge when subscribed

8. [ ] **Add save confirmation toast**
   - File: `src/pages/admin/Settings.tsx`
   - Add: Success toast on rate update
   - Add: Error toast on failure
   - Add: Loading state during save

9. [ ] **Add commission rate change reason field**
   - File: `src/pages/admin/Settings.tsx`
   - Add: Optional textarea for change reason
   - Pass: To `updateCommissionRate()` reason parameter
   - Store: In commission_configurations table

10. [ ] **Remove hardcoded 5% from standardizedQueries.ts**
    - File: `src/services/database/standardizedQueries.ts`
    - Find: `0.05` or `5%` hardcoded
    - Replace: Call to `centralizedCommissionEngine.getCurrentRates()`
    - Test: Queries use dynamic rates

11. [ ] **Remove hardcoded 100 GHS from standardizedQueries.ts**
    - File: `src/services/database/standardizedQueries.ts`
    - Find: `100` hardcoded fee
    - Replace: Call to `centralizedCommissionEngine.getCurrentRates()`
    - Test: Queries use dynamic fees

12. [ ] **Update PropertyBookingCard to use commission engine**
    - File: `src/components/property/PropertyBookingCard.tsx`
    - Find: Hardcoded commission calculations
    - Replace: `centralizedCommissionEngine.calculateCommissions()`
    - Test: Booking card shows correct fees

13. [ ] **Update BookingReview to use commission engine**
    - File: `src/components/booking/BookingReview.tsx`
    - Find: Hardcoded fee calculations
    - Replace: Commission engine calls
    - Test: Review shows correct breakdown

14. [ ] **Add commission rate history view (optional)**
    - File: `src/pages/admin/Settings.tsx`
    - Add: Collapsible section showing rate change history
    - Query: `commission_configurations` table
    - Display: Date, old rate, new rate, changed by, reason

15. [ ] **Run diagnostics and commit Sprint 2**
    - Test: Change commission rate in admin settings
    - Verify: Student portal shows new rate immediately
    - Verify: Owner portal calculates with new rate
    - Commit: "feat: connect admin settings to commission engine dial"

---

## 🔧 SPRINT 3: PROPERTY TYPE SYNCHRONY (15 TASKS)
**Goal:** Create single source of truth for property types  
**Time:** 12-15 hours  
**Commit Message:** "refactor: centralize property types configuration"

### Tasks:

1. [ ] **Create property-types.config.ts file**
   - File: `src/config/property-types.config.ts` (create)
   - Content: PROPERTY_TYPES constant with Hostel, Homestel, Apartment
   - Export: Types, getPropertyTypeConfig(), getAllPropertyTypes()

2. [ ] **Define Hostel configuration**
   - File: `src/config/property-types.config.ts`
   - Add: value='hostel', label='Hostel', category='Hostel'
   - Add: pricingModel='semester', roomTypes array
   - Add: requiresStructure=false, description

3. [ ] **Define Homestel configuration**
   - File: `src/config/property-types.config.ts`
   - Add: value='homestel', label='Homestel', category='Homestel'
   - Add: pricingModel='flexible', roomTypes array
   - Add: requiresStructure=false, description

4. [ ] **Define Apartment configuration**
   - File: `src/config/property-types.config.ts`
   - Add: value='apartment', label='Apartment', category='Apartment'
   - Add: pricingModel='monthly', roomTypes array
   - Add: requiresStructure=true, description

5. [ ] **Add TypeScript types for property config**
   - File: `src/config/property-types.config.ts`
   - Add: PropertyTypeValue, PropertyTypeLabel types
   - Add: PropertyTypeConfig interface
   - Export: All types

6. [ ] **Update PropertyInfoFields to use config**
   - File: `src/components/owner/property-form/PropertyInfoFields.tsx`
   - Import: PROPERTY_TYPES from config
   - Replace: Hardcoded category options with getAllPropertyTypes()
   - Test: Dropdown shows correct options

7. [ ] **Update PropertyFormSchema to use config**
   - File: `src/components/owner/property-form/PropertyFormSchema.ts`
   - Import: PropertyTypeValue type
   - Update: Zod schema to use config types
   - Test: Validation uses correct values

8. [ ] **Update PropertyForm to use config**
   - File: `src/components/owner/property-form/PropertyForm.tsx`
   - Import: getPropertyTypeConfig()
   - Replace: Hardcoded type checks with config lookups
   - Test: Form behavior matches config

9. [ ] **Update enhanced-property.service to use config**
   - File: `src/services/enhanced-property.service.ts`
   - Import: PROPERTY_TYPES
   - Replace: String literals with config values
   - Test: Service uses correct types

10. [ ] **Update useFilteredProperties to use config**
    - File: `src/hooks/filters/useFilteredProperties.tsx`
    - Import: getAllPropertyTypes()
    - Replace: Hardcoded type filters with config
    - Test: Filters work correctly

11. [ ] **Update PropertyFilters to use config**
    - File: `src/components/student/PropertyFilters.tsx`
    - Import: PROPERTY_TYPES
    - Replace: Hardcoded type options with config
    - Test: Filter UI shows correct types

12. [ ] **Remove duplicate propertyCategory field**
    - File: `src/components/owner/property-form/PropertyFormSchema.ts`
    - Remove: propertyCategory field (use type only)
    - Update: All references to use type field
    - Test: Form works with single type field

13. [ ] **Update database queries to use type field consistently**
    - Files: All service files
    - Find: Queries using property_type or propertyCategory
    - Standardize: All use 'type' field
    - Test: Queries return correct results

14. [ ] **Add property type helper functions**
    - File: `src/config/property-types.config.ts`
    - Add: isHostel(), isHomestel(), isApartment() helpers
    - Add: getRoomTypesForProperty() helper
    - Export: All helpers

15. [ ] **Run diagnostics and commit Sprint 3**
    - Test: Create property of each type
    - Verify: Correct pricing model applied
    - Verify: Correct room types available
    - Commit: "refactor: centralize property types configuration"

---

## 🗄️ SPRINT 4: DATABASE SCHEMA ALIGNMENT (15 TASKS)
**Goal:** Deploy missing tables and align schema with documentation  
**Time:** 8-10 hours  
**Commit Message:** "feat: deploy beds and compounds tables"

### Tasks:

1. [ ] **Create migration file for missing tables**
   - File: `supabase/migrations/20251105_create_missing_tables.sql` (create)
   - Add: Migration header with description
   - Add: Rollback instructions

2. [ ] **Add beds table creation SQL**
   - File: `supabase/migrations/20251105_create_missing_tables.sql`
   - Add: CREATE TABLE beds with all fields
   - Add: Foreign keys to rooms and properties
   - Add: Unique constraint on room_id + bed_number

3. [ ] **Add beds table indexes**
   - File: `supabase/migrations/20251105_create_missing_tables.sql`
   - Add: Index on property_id
   - Add: Index on room_id
   - Add: Index on is_occupied

4. [ ] **Add beds table RLS policies**
   - File: `supabase/migrations/20251105_create_missing_tables.sql`
   - Add: Students can view available beds
   - Add: Owners can manage their property beds
   - Add: Admins can view all beds

5. [ ] **Add compounds table creation SQL**
   - File: `supabase/migrations/20251105_create_missing_tables.sql`
   - Add: CREATE TABLE compounds with all fields
   - Add: Foreign key to auth.users (owner_id)
   - Add: JSONB fields for amenities

6. [ ] **Add compounds table indexes**
   - File: `supabase/migrations/20251105_create_missing_tables.sql`
   - Add: Index on owner_id
   - Add: Index on city
   - Add: GiST index on location (if using PostGIS)

7. [ ] **Add compounds table RLS policies**
   - File: `supabase/migrations/20251105_create_missing_tables.sql`
   - Add: Owners can manage their compounds
   - Add: Students can view compounds
   - Add: Admins can view all compounds

8. [ ] **Add compound_properties junction table**
   - File: `supabase/migrations/20251105_create_missing_tables.sql`
   - Add: CREATE TABLE compound_properties
   - Add: Foreign keys to compounds and properties
   - Add: Unique constraint on compound_id + property_id

9. [ ] **Add compound_properties RLS policies**
   - File: `supabase/migrations/20251105_create_missing_tables.sql`
   - Add: Owners can manage their compound properties
   - Add: Students can view compound properties
   - Add: Admins can view all

10. [ ] **Add update_property_occupancy trigger**
    - File: `supabase/migrations/20251105_create_missing_tables.sql`
    - Add: CREATE FUNCTION update_property_occupancy()
    - Add: Trigger on rooms table
    - Test: Occupancy updates automatically

11. [ ] **Add update_bed_occupancy trigger**
    - File: `supabase/migrations/20251105_create_missing_tables.sql`
    - Add: CREATE FUNCTION update_bed_occupancy()
    - Add: Trigger on beds table
    - Test: Room occupancy updates when bed occupied

12. [ ] **Test migration in local Supabase**
    - Command: `supabase db reset` (local)
    - Verify: All tables created
    - Verify: RLS policies active
    - Verify: Triggers work

13. [ ] **Run migration on staging Supabase**
    - Command: `supabase db push` (staging)
    - Verify: Migration successful
    - Test: Create test bed, test compound
    - Verify: No errors

14. [ ] **Update TypeScript types for new tables**
    - File: `src/types/database.types.ts`
    - Add: Bed interface
    - Add: Compound interface
    - Add: CompoundProperty interface

15. [ ] **Run diagnostics and commit Sprint 4**
    - Test: Query beds table
    - Test: Query compounds table
    - Verify: Triggers fire correctly
    - Commit: "feat: deploy beds and compounds tables"

---

## 🧠 SPRINT 5: INTELLIGENT PROPERTY ROUTER (15 TASKS)
**Goal:** Integrate router into property form  
**Time:** 10-12 hours  
**Commit Message:** "feat: integrate intelligent property router"

### Tasks:

1. [ ] **Add router state to PropertyForm**
   - File: `src/components/owner/property-form/PropertyForm.tsx`
   - Add: useState for showRouter, routerResult
   - Add: useEffect to show router on first load

2. [ ] **Add router import to PropertyForm**
   - File: `src/components/owner/property-form/PropertyForm.tsx`
   - Import: IntelligentPropertyRouter component
   - Import: PropertyRouterResult type

3. [ ] **Add router component to PropertyForm JSX**
   - File: `src/components/owner/property-form/PropertyForm.tsx`
   - Add: <IntelligentPropertyRouter> before form
   - Props: isOpen, onClose, onComplete

4. [ ] **Implement handleRouterComplete function**
   - File: `src/components/owner/property-form/PropertyForm.tsx`
   - Add: Function to handle router result
   - Set: form.setValue('type', result.propertyType)
   - Set: form.setValue('propertyCategory', ...)

5. [ ] **Add structure type handling**
   - File: `src/components/owner/property-form/PropertyForm.tsx`
   - Check: result.structureType === 'building'
   - Set: setRequiresStructure(true)
   - Check: result.structureType === 'compound'

6. [ ] **Add compound mode state**
   - File: `src/components/owner/property-form/PropertyForm.tsx`
   - Add: useState for compoundMode
   - Add: Conditional rendering for compound UI
   - Test: Compound mode activates correctly

7. [ ] **Add success toast after router completion**
   - File: `src/components/owner/property-form/PropertyForm.tsx`
   - Add: toast.success with recommended setup message
   - Display: result.recommendedSetup
   - Test: Toast shows correct message

8. [ ] **Add "Change Setup" button to form**
   - File: `src/components/owner/property-form/PropertyForm.tsx`
   - Add: Button to reopen router
   - Position: Top right of form
   - Test: Router reopens correctly

9. [ ] **Store router result in form state**
   - File: `src/components/owner/property-form/PropertyForm.tsx`
   - Add: Hidden field for routerResult
   - Store: JSON.stringify(routerResult)
   - Use: For analytics and debugging

10. [ ] **Add agent documentation panel (conditional)**
    - File: `src/components/owner/property-form/PropertyForm.tsx`
    - Check: result.requiresDocumentation === true
    - Show: AgentDocumentationPanel component
    - Test: Panel shows for agents with docs

11. [ ] **Create AgentDocumentationPanel component**
    - File: `src/components/owner/AgentDocumentationPanel.tsx` (create)
    - Content: Document upload UI
    - Features: Drag-drop, file preview, benefits list
    - Test: Upload works

12. [ ] **Add compound mode UI placeholder**
    - File: `src/components/owner/property-form/PropertyForm.tsx`
    - Add: Conditional rendering for compound mode
    - Show: "Compound Management" tab
    - Placeholder: "Coming in Phase 2"

13. [ ] **Add analytics tracking for router choices**
    - File: `src/components/owner/IntelligentPropertyRouter.tsx`
    - Add: Analytics event on completion
    - Track: userType, propertyType, structureType
    - Send: To analytics service

14. [ ] **Test router with all paths**
    - Test: Owner + Simple + Hostel
    - Test: Owner + Multi-floor + Hostel
    - Test: Agent + Compound + Homestel
    - Test: Agent + Multiple separate + Apartment
    - Verify: Correct form configuration each time

15. [ ] **Run diagnostics and commit Sprint 5**
    - Test: Router shows on new property
    - Test: Form configures correctly
    - Test: All paths work
    - Commit: "feat: integrate intelligent property router"

---

## 🎯 NEXT SPRINTS PREVIEW

**Sprint 6: Admin Portal Completion** (15 tasks)
- Remove disabled menu items
- Build functional settings page
- Improve verification workflow
- Add bulk actions

**Sprint 7: Owner Portal Polish** (15 tasks)
- Add validation guidance
- Improve error messages
- Add help tooltips
- Polish UI consistency

**Sprint 8: Testing & Validation** (15 tasks)
- Write unit tests
- Write integration tests
- Manual testing checklist
- Beta launch preparation

---

## 📊 PROGRESS TRACKING

### Completion Status:
- [ ] Sprint 1: Critical Fixes (0/15)
- [ ] Sprint 2: Commission Synchrony (0/15)
- [ ] Sprint 3: Property Type Synchrony (0/15)
- [ ] Sprint 4: Database Schema Alignment (0/15)
- [ ] Sprint 5: Intelligent Property Router (0/15)
- [ ] Sprint 6: Admin Portal Completion (0/15)
- [ ] Sprint 7: Owner Portal Polish (0/15)
- [ ] Sprint 8: Testing & Validation (0/15)

**Overall: 0/120 tasks (0%)**

---

## 🚀 HOW TO USE THIS LIST

1. **Start with Sprint 1** - Don't skip ahead
2. **Complete all 15 tasks** in order
3. **Test after each task** - Don't accumulate bugs
4. **Commit after Sprint 1** - Clean git history
5. **Move to Sprint 2** - Repeat process

**After each sprint:**
```bash
git add -A
git commit -m "[sprint message]"
git push origin fix/synchrony-restoration-sprint
```

---

## ✅ DEFINITION OF DONE

**Each task is done when:**
- [ ] Code changes made
- [ ] TypeScript compiles with no errors
- [ ] Manual testing passed
- [ ] No console errors
- [ ] Documented (if needed)

**Each sprint is done when:**
- [ ] All 15 tasks complete
- [ ] Diagnostics run clean
- [ ] Changes committed
- [ ] Branch pushed

---

**Ready to start Sprint 1? Let's go!**

