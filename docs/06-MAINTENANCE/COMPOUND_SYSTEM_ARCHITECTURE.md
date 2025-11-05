# COMPOUND SYSTEM ARCHITECTURE
**Date:** 2025-11-05  
**Purpose:** Enable agents to manage multiple properties as a unified business  
**Status:** 🟡 DESIGNED - READY FOR IMPLEMENTATION

---

## 🎯 WHAT IS A COMPOUND?

**Definition:**  
A compound is a collection of one or more properties managed by an agent as a unified business entity, regardless of accommodation type (Hostel, Homestel, or Apartment).

**Key Principle:**  
**ACCOMMODATION-AGNOSTIC** - Works with any property type without affecting existing functionality.

---

## 🏗️ ARCHITECTURE PRINCIPLES

### 1. **Non-Invasive Design**
- Compounds are OPTIONAL - properties work fine without them
- Existing property functionality unchanged
- No breaking changes to current system

### 2. **Accommodation-Agnostic**
- Hostels can be in compounds
- Homestels can be in compounds
- Apartments can be in compounds
- Mixed types allowed in same compound

### 3. **Business-Focused**
- Compounds represent business entities
- Enable business reporting and analytics
- Support loan qualification
- Track agent performance

### 4. **Data Integrity**
- Properties maintain independence
- Compound deletion doesn't delete properties
- Property can leave compound without data loss

---

## 📊 DATABASE SCHEMA

### **Compounds Table**

```sql
CREATE TABLE compounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic Info
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  business_registration_number TEXT,
  
  -- Location (shared by all properties in compound)
  address TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Accra',
  state TEXT NOT NULL DEFAULT 'Greater Accra',
  country TEXT NOT NULL DEFAULT 'Ghana',
  
  -- Shared Amenities (available to all properties)
  shared_amenities TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Media
  cover_image_url TEXT,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Business Metrics (calculated)
  total_properties INTEGER DEFAULT 0,
  total_rooms INTEGER DEFAULT 0,
  total_beds INTEGER DEFAULT 0,
  occupancy_rate DECIMAL(5,2) DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_compounds_owner_id ON compounds(owner_id);
CREATE INDEX idx_compounds_city ON compounds(city);

-- RLS Policies
ALTER TABLE compounds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can manage their compounds" ON compounds
  FOR ALL USING (owner_id = auth.uid());

CREATE POLICY "Students can view compounds" ON compounds
  FOR SELECT USING (true);

CREATE POLICY "Admins can view all compounds" ON compounds
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role IN ('supreme_admin', 'country_admin')
    )
  );
```

### **Compound Properties Junction Table**

```sql
CREATE TABLE compound_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  compound_id UUID NOT NULL REFERENCES compounds(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  
  -- Property identifier within compound
  block_identifier TEXT NOT NULL, -- e.g., "Block A", "Building 1", "Unit 5"
  display_order INTEGER DEFAULT 0,
  
  -- Timestamps
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(compound_id, property_id)
);

-- Indexes
CREATE INDEX idx_compound_properties_compound_id ON compound_properties(compound_id);
CREATE INDEX idx_compound_properties_property_id ON compound_properties(property_id);

-- RLS Policies
ALTER TABLE compound_properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can manage their compound properties" ON compound_properties
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM compounds
      WHERE id = compound_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Students can view compound properties" ON compound_properties
  FOR SELECT USING (true);
```

### **Properties Table Update (Non-Breaking)**

```sql
-- Add optional compound reference to existing properties table
ALTER TABLE properties
ADD COLUMN compound_id UUID REFERENCES compounds(id) ON DELETE SET NULL;

-- Index for compound queries
CREATE INDEX idx_properties_compound_id ON properties(compound_id);

-- This is OPTIONAL - properties work fine without compound_id
```

---

## 🔧 BUSINESS LOGIC

### **Compound Metrics Calculation**

```typescript
interface CompoundMetrics {
  totalProperties: number;
  totalRooms: number;
  totalBeds: number;
  occupancyRate: number;
  totalRevenue: number;
  averageRating: number;
  totalBookings: number;
}

const calculateCompoundMetrics = async (compoundId: string): Promise<CompoundMetrics> => {
  // Get all properties in compound
  const { data: properties } = await supabase
    .from('compound_properties')
    .select(`
      property_id,
      properties (
        id,
        total_rooms,
        capacity,
        current_occupancy,
        average_rating
      )
    `)
    .eq('compound_id', compoundId);

  // Aggregate metrics
  const metrics: CompoundMetrics = {
    totalProperties: properties.length,
    totalRooms: properties.reduce((sum, p) => sum + (p.properties.total_rooms || 0), 0),
    totalBeds: properties.reduce((sum, p) => sum + (p.properties.capacity || 0), 0),
    occupancyRate: 0,
    totalRevenue: 0,
    averageRating: 0,
    totalBookings: 0
  };

  // Calculate occupancy rate
  const totalOccupied = properties.reduce((sum, p) => sum + (p.properties.current_occupancy || 0), 0);
  metrics.occupancyRate = metrics.totalBeds > 0 ? (totalOccupied / metrics.totalBeds) * 100 : 0;

  // Calculate average rating
  const ratingsSum = properties.reduce((sum, p) => sum + (p.properties.average_rating || 0), 0);
  metrics.averageRating = properties.length > 0 ? ratingsSum / properties.length : 0;

  // Get revenue and bookings
  const { data: bookings } = await supabase
    .from('bookings_enhanced')
    .select('total_amount, status')
    .in('property_id', properties.map(p => p.property_id))
    .eq('status', 'confirmed');

  metrics.totalBookings = bookings?.length || 0;
  metrics.totalRevenue = bookings?.reduce((sum, b) => sum + b.total_amount, 0) || 0;

  return metrics;
};
```

### **Compound Business Reports**

```typescript
interface CompoundBusinessReport {
  compoundId: string;
  compoundName: string;
  reportPeriod: { start: Date; end: Date };
  
  // Financial
  totalRevenue: number;
  totalCommissions: number;
  netIncome: number;
  
  // Performance
  occupancyRate: number;
  averageBookingValue: number;
  totalBookings: number;
  
  // Property Breakdown
  propertyPerformance: Array<{
    propertyId: string;
    propertyName: string;
    revenue: number;
    occupancy: number;
    bookings: number;
  }>;
  
  // Loan Eligibility
  loanEligibility: {
    eligible: boolean;
    maxLoanAmount: number;
    reason: string;
  };
}

const generateCompoundBusinessReport = async (
  compoundId: string,
  startDate: Date,
  endDate: Date
): Promise<CompoundBusinessReport> => {
  // Implementation here
  // This is what agents use for loan applications
};
```

---

## 🎨 USER INTERFACE

### **Compound Dashboard (Agent View)**

```
┌─────────────────────────────────────────────────────────────┐
│ Legon Hills Compound                              [Settings] │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  📊 Overview                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │    5     │  │   120    │  │   450    │  │   78%    │   │
│  │Properties│  │  Rooms   │  │  Beds    │  │Occupancy │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                               │
│  🏢 Properties                                [+ Add Property]│
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Block A - Hostel          120 beds    85% occupied      ││
│  │ Block B - Homestel         80 beds    72% occupied      ││
│  │ Block C - Hostel          150 beds    80% occupied      ││
│  │ Block D - Apartment        60 units   65% occupied      ││
│  │ Block E - Hostel          100 beds    90% occupied      ││
│  └─────────────────────────────────────────────────────────┘│
│                                                               │
│  💰 Financial Summary (This Month)                           │
│  Revenue: GHS 125,000  |  Commissions: GHS 6,250            │
│  Net Income: GHS 118,750                                     │
│                                                               │
│  📈 Business Reports                    [Generate Report]    │
│  Use for loan applications, partnership proposals            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### **Student View (Compound Listing)**

```
┌─────────────────────────────────────────────────────────────┐
│ 🏘️ Legon Hills Compound                          ⭐ 4.6     │
├─────────────────────────────────────────────────────────────┤
│ [Cover Image]                                                │
│                                                               │
│ 5 Properties | 450 Beds Available | Starting from GHS 800   │
│                                                               │
│ 📍 East Legon, Accra                                         │
│                                                               │
│ ✨ Shared Amenities:                                         │
│ • 24/7 Security  • Swimming Pool  • Gym  • Study Rooms      │
│                                                               │
│ 🏢 Available Properties:                                     │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Block A - Hostel          GHS 1,200/semester            │ │
│ │ Block B - Homestel        GHS 800/month                 │ │
│ │ Block C - Hostel          GHS 1,000/semester            │ │
│ │ Block D - Apartment       GHS 1,500/month               │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                               │
│ [View All Properties]                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔌 API ENDPOINTS

### **Compound Management**

```typescript
// Create compound
POST /api/compounds
Body: {
  name: string;
  description: string;
  address: string;
  city: string;
  shared_amenities: string[];
  cover_image_url?: string;
}

// Add property to compound
POST /api/compounds/:compoundId/properties
Body: {
  property_id: string;
  block_identifier: string;
}

// Get compound with properties
GET /api/compounds/:compoundId
Response: {
  compound: Compound;
  properties: Property[];
  metrics: CompoundMetrics;
}

// Generate business report
GET /api/compounds/:compoundId/report?start=2024-01-01&end=2024-12-31
Response: CompoundBusinessReport

// Remove property from compound
DELETE /api/compounds/:compoundId/properties/:propertyId
```

---

## 🎯 LOAN QUALIFICATION SYSTEM

### **Eligibility Criteria**

```typescript
interface LoanEligibilityCheck {
  hasBusinessRegistration: boolean;
  hasTaxID: boolean;
  accountAge: number; // months
  totalProperties: number;
  totalRevenue: number;
  occupancyRate: number;
  averageRating: number;
  totalBookings: number;
}

const calculateLoanEligibility = (compound: Compound, check: LoanEligibilityCheck) => {
  let score = 0;
  let maxLoan = 0;
  
  // Base requirements
  if (check.hasBusinessRegistration) score += 20;
  if (check.hasTaxID) score += 20;
  
  // Performance metrics
  if (check.accountAge >= 6) score += 10;
  if (check.totalProperties >= 3) score += 15;
  if (check.totalRevenue >= 50000) score += 15;
  if (check.occupancyRate >= 70) score += 10;
  if (check.averageRating >= 4.0) score += 10;
  
  // Calculate max loan
  if (score >= 70) {
    maxLoan = Math.min(
      check.totalRevenue * 0.5, // 50% of annual revenue
      50000 // Cap at GHS 50,000
    );
  }
  
  return {
    eligible: score >= 70,
    score,
    maxLoanAmount: maxLoan,
    interestRate: 12, // 12% annual
    repaymentPeriod: 12, // 12 months
    reason: score < 70 ? 'Build more track record' : 'Eligible for business loan'
  };
};
```

---

## ✅ IMPLEMENTATION CHECKLIST

### **Phase 1: Database (Sprint 4)**
- [x] Create compounds table migration
- [x] Create compound_properties junction table
- [x] Add compound_id to properties (optional)
- [x] Add RLS policies
- [x] Add indexes

### **Phase 2: Backend Services**
- [ ] Create CompoundService
- [ ] Add compound CRUD operations
- [ ] Implement metrics calculation
- [ ] Build business report generator
- [ ] Add loan eligibility calculator

### **Phase 3: Agent UI**
- [ ] Create CompoundDashboard component
- [ ] Add compound creation flow
- [ ] Build property assignment UI
- [ ] Implement business reports view
- [ ] Add loan application UI

### **Phase 4: Student UI**
- [ ] Add compound listing cards
- [ ] Create compound detail page
- [ ] Show shared amenities
- [ ] List all properties in compound
- [ ] Enable booking from compound view

### **Phase 5: Testing**
- [ ] Test compound creation
- [ ] Test property assignment
- [ ] Test metrics calculation
- [ ] Test business reports
- [ ] Test loan eligibility

---

## 🚀 ROLLOUT STRATEGY

### **Week 1: Backend**
- Deploy database tables
- Build compound service
- Test CRUD operations

### **Week 2: Agent Portal**
- Build compound dashboard
- Add creation flow
- Test with 2-3 agents

### **Week 3: Student Portal**
- Add compound listings
- Build detail pages
- Test booking flow

### **Week 4: Business Features**
- Implement reports
- Add loan calculator
- Beta test with agents

---

## 💡 KEY BENEFITS

### **For Agents:**
- Manage all properties from one dashboard
- Generate professional business reports
- Qualify for business loans
- Build verified track record
- Attract more property owners

### **For Students:**
- See all options in one location
- Benefit from shared amenities
- Trust verified agent businesses
- Compare properties easily

### **For Platform:**
- Attract professional agents
- Increase property inventory
- Enable business services
- Generate more revenue
- Build ecosystem

---

**This architecture ensures compounds work seamlessly with ALL property types without breaking existing functionality.**

