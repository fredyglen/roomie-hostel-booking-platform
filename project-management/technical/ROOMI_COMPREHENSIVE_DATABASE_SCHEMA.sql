-- ROOMi Platform CORE Database Schema
-- Focused on essential functionality for operational platform
-- Premium features and advanced analytics to be added in Phase 2

-- =====================================================
-- CORE PROPERTY MANAGEMENT SCHEMA
-- =====================================================

-- Enhanced Properties Table
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Basic Property Information
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  property_type TEXT NOT NULL CHECK (property_type IN ('hostel', 'homestel', 'apartment')),
  
  -- Location Details
  address TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Accra',
  state TEXT NOT NULL DEFAULT 'Greater Accra',
  zip TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  distance_to_campus TEXT,
  campus_name TEXT DEFAULT 'UPSA',
  
  -- Property Structure (for storey buildings)
  total_floors INTEGER DEFAULT 1,
  rooms_per_floor JSONB, -- {"ground": 8, "first": 10, "second": 12}
  
  -- Compound Management (Premium Feature)
  is_part_of_compound BOOLEAN DEFAULT FALSE,
  compound_id UUID,
  block_identifier TEXT, -- "Block A", "Block B", etc.
  
  -- Pricing and Availability
  base_price_per_semester DECIMAL(10, 2) NOT NULL,
  price_currency TEXT DEFAULT 'GHS',
  is_available BOOLEAN DEFAULT TRUE,
  available_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  available_to TIMESTAMP WITH TIME ZONE,
  
  -- Gender and Occupancy
  gender_type TEXT NOT NULL CHECK (gender_type IN ('male', 'female', 'mixed')),
  max_occupancy INTEGER NOT NULL,
  current_occupancy INTEGER DEFAULT 0,
  
  -- Property Features
  amenities TEXT[] DEFAULT ARRAY[]::TEXT[],
  house_rules TEXT[] DEFAULT ARRAY[]::TEXT[],
  utilities_included BOOLEAN DEFAULT TRUE,
  
  -- Media and Documentation
  cover_image_url TEXT,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  videos TEXT[] DEFAULT ARRAY[]::TEXT[],
  environment_video_url TEXT,
  
  -- Business Logic
  allows_rebooking BOOLEAN DEFAULT FALSE,
  allows_shared_payment BOOLEAN DEFAULT FALSE,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  
  -- Search and Indexing
  search_text TEXT GENERATED ALWAYS AS (
    lower(title || ' ' || description || ' ' || address || ' ' || city || ' ' || array_to_string(amenities, ' '))
  ) STORED,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- COMPOUND MANAGEMENT (PREMIUM FEATURE)
-- =====================================================

-- Compounds Table (Premium Feature)
CREATE TABLE IF NOT EXISTS compounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic Compound Information
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  
  -- Location Details
  address TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Accra',
  state TEXT NOT NULL DEFAULT 'Greater Accra',
  zip TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Compound Features
  amenities TEXT[] DEFAULT ARRAY[]::TEXT[],
  house_rules TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Media
  cover_image_url TEXT,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Compound Properties Relationship Table
CREATE TABLE IF NOT EXISTS compound_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  compound_id UUID NOT NULL REFERENCES compounds(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  block_identifier TEXT NOT NULL, -- "Block A", "Block B", etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(compound_id, property_id)
);

-- =====================================================
-- ROOM AND BED TRACKING SCHEMA
-- =====================================================

-- Rooms Table (for detailed room management)
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  
  -- Room Identification
  room_number TEXT NOT NULL,
  floor_number INTEGER NOT NULL DEFAULT 0, -- 0 = ground floor
  room_name TEXT, -- "Ground Floor Room 1", "Block A Room 203"
  
  -- Room Configuration
  beds_count INTEGER NOT NULL CHECK (beds_count >= 1 AND beds_count <= 4),
  room_type TEXT GENERATED ALWAYS AS (
    CASE 
      WHEN beds_count = 1 THEN '1 in a room'
      WHEN beds_count = 2 THEN '2 in a room'
      WHEN beds_count = 3 THEN '3 in a room'
      WHEN beds_count = 4 THEN '4 in a room'
      ELSE beds_count || ' in a room'
    END
  ) STORED,
  
  -- Pricing (varies by bed count)
  price_per_bed_per_semester DECIMAL(10, 2) NOT NULL,
  
  -- Room Features
  has_ensuite BOOLEAN DEFAULT FALSE,
  has_ac BOOLEAN DEFAULT FALSE,
  has_wardrobe BOOLEAN DEFAULT TRUE,
  room_amenities TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Availability Tracking
  available_beds INTEGER NOT NULL,
  occupied_beds INTEGER DEFAULT 0,
  is_room_available BOOLEAN GENERATED ALWAYS AS (available_beds > 0) STORED,
  
  -- Room Media
  room_images TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_occupancy CHECK (occupied_beds <= beds_count),
  CONSTRAINT valid_availability CHECK (available_beds >= 0 AND available_beds <= beds_count)
);

-- =====================================================
-- BED TRACKING SCHEMA (Primary Booking Unit)
-- =====================================================

-- Individual Beds Table
CREATE TABLE IF NOT EXISTS beds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  
  -- Bed Identification
  bed_number INTEGER NOT NULL,
  bed_identifier TEXT NOT NULL, -- "Ground Floor Room 1 Bed 1"
  
  -- Bed Status
  is_occupied BOOLEAN DEFAULT FALSE,
  is_reserved BOOLEAN DEFAULT FALSE,
  current_occupant_id UUID REFERENCES auth.users(id),
  
  -- Booking Information
  occupied_from TIMESTAMP WITH TIME ZONE,
  occupied_until TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(room_id, bed_number)
);

-- =====================================================
-- ENHANCED BOOKING SCHEMA
-- =====================================================

-- Comprehensive Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_reference TEXT UNIQUE NOT NULL DEFAULT 'ROOMI_' || extract(epoch from now()) || '_' || substr(md5(random()::text), 1, 6),
  
  -- Booking Parties
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  property_owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  bed_id UUID NOT NULL REFERENCES beds(id) ON DELETE CASCADE,
  
  -- Booking Duration (Ghana Semester System)
  semester_type TEXT NOT NULL CHECK (semester_type IN ('first_semester', 'second_semester', 'full_year')),
  check_in_date TIMESTAMP WITH TIME ZONE NOT NULL,
  check_out_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_weeks INTEGER GENERATED ALWAYS AS (
    EXTRACT(WEEK FROM check_out_date - check_in_date)
  ) STORED,
  
  -- Pricing Breakdown (Updated Business Model)
  base_property_price DECIMAL(10, 2) NOT NULL,
  platform_commission DECIMAL(10, 2) NOT NULL, -- 5% of booking value
  platform_fee DECIMAL(10, 2) NOT NULL DEFAULT 100.00, -- Fixed 100 GHS fee
  agent_commission DECIMAL(10, 2) DEFAULT 0,
  paystack_fee DECIMAL(10, 2) NOT NULL DEFAULT 0, -- 1.95% of total
  total_amount DECIMAL(10, 2) NOT NULL,
  
  -- Shared Payment Support (Primary Booker System)
  is_shared_payment BOOLEAN DEFAULT FALSE,
  primary_booker_id UUID REFERENCES auth.users(id), -- Student who pays platform
  total_roommates INTEGER DEFAULT 1,
  student_share_amount DECIMAL(10, 2),
  roommate_collection_status TEXT DEFAULT 'pending' CHECK (roommate_collection_status IN ('pending', 'collected', 'partial')),
  
  -- Booking Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'paid', 'checked_in', 'completed', 'cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  
  -- Payment Information
  payment_reference TEXT,
  paystack_reference TEXT,
  payment_method TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  
  -- Student Information
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  student_phone TEXT NOT NULL,
  student_id_number TEXT,
  university_name TEXT DEFAULT 'UPSA',
  student_level TEXT, -- "Level 100", "Level 200", etc.
  
  -- Emergency Contact
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  
  -- Terms and Verification
  terms_accepted BOOLEAN DEFAULT FALSE,
  terms_accepted_at TIMESTAMP WITH TIME ZONE,
  student_verified BOOLEAN DEFAULT FALSE,
  id_document_url TEXT,
  
  -- Rebooking Support
  is_rebooking BOOLEAN DEFAULT FALSE,
  previous_booking_id UUID REFERENCES bookings(id),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SHARED PAYMENT SCHEMA
-- =====================================================

-- Roommate Information for Shared Payments
CREATE TABLE IF NOT EXISTS booking_roommates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  
  -- Roommate Details
  roommate_name TEXT NOT NULL,
  roommate_email TEXT NOT NULL,
  roommate_phone TEXT NOT NULL,
  roommate_student_id TEXT,
  
  -- Payment Responsibility
  payment_share DECIMAL(10, 2) NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  payment_reference TEXT,
  
  -- Verification
  is_verified_student BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- AGENT PARTNERSHIP SCHEMA
-- =====================================================

-- Agent-Property Relationships
CREATE TABLE IF NOT EXISTS agent_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  property_owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Partnership Terms
  commission_percentage DECIMAL(5, 2) DEFAULT 4.00, -- 4% default
  is_exclusive BOOLEAN DEFAULT FALSE,
  can_manage_property BOOLEAN DEFAULT TRUE,
  
  -- Status
  partnership_status TEXT DEFAULT 'active' CHECK (partnership_status IN ('active', 'suspended', 'terminated')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(agent_id, property_id)
);

-- =====================================================
-- PROPERTY VISIBILITY TRACKING
-- =====================================================

-- Property Visibility Monitor (for admin)
CREATE TABLE IF NOT EXISTS property_visibility_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  
  -- Visibility Status
  is_visible_to_students BOOLEAN NOT NULL,
  visibility_issues TEXT[],
  
  -- Check Details
  checked_by UUID REFERENCES auth.users(id),
  check_type TEXT NOT NULL CHECK (check_type IN ('automated', 'manual', 'system')),
  
  -- Resolution
  issues_resolved BOOLEAN DEFAULT FALSE,
  resolution_notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Property Search Optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_properties_search 
ON properties USING GIN (search_text gin_trgm_ops);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_properties_location_available 
ON properties (city, is_available, verification_status) 
WHERE is_available = true AND verification_status = 'verified';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_properties_price_range 
ON properties (base_price_per_semester, gender_type, property_category) 
WHERE is_available = true;

-- Room and Bed Availability
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_rooms_availability 
ON rooms (property_id, available_beds) 
WHERE available_beds > 0;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_beds_availability 
ON beds (property_id, is_occupied, is_reserved) 
WHERE is_occupied = false AND is_reserved = false;

-- Booking Performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bookings_student_status 
ON bookings (student_id, status, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bookings_property_dates 
ON bookings (property_id, check_in_date, check_out_date);

-- Agent Performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_agent_properties_active 
ON agent_properties (agent_id, partnership_status) 
WHERE partnership_status = 'active';

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE beds ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Property Policies
CREATE POLICY "Students can view verified available properties" ON properties
  FOR SELECT USING (
    is_available = true 
    AND verification_status = 'verified'
    AND auth.jwt() ->> 'role' = 'student'
  );

CREATE POLICY "Owners can manage their properties" ON properties
  FOR ALL USING (
    owner_id = auth.uid() 
    OR (agent_id = auth.uid() AND auth.jwt() ->> 'role' = 'owner')
  );

CREATE POLICY "Admins can access all properties" ON properties
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Booking Policies
CREATE POLICY "Students can view their bookings" ON bookings
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Property owners can view their property bookings" ON bookings
  FOR SELECT USING (property_owner_id = auth.uid());

CREATE POLICY "Agents can view bookings for their properties" ON bookings
  FOR SELECT USING (
    agent_id = auth.uid() 
    OR property_id IN (
      SELECT property_id FROM agent_properties 
      WHERE agent_id = auth.uid() AND partnership_status = 'active'
    )
  );

-- =====================================================
-- TRIGGERS FOR AUTOMATION
-- =====================================================

-- Update property occupancy when bookings change
CREATE OR REPLACE FUNCTION update_property_occupancy()
RETURNS TRIGGER AS $$
BEGIN
  -- Update room availability
  UPDATE rooms SET 
    occupied_beds = (
      SELECT COUNT(*) FROM beds 
      WHERE room_id = COALESCE(NEW.room_id, OLD.room_id) 
      AND is_occupied = true
    ),
    available_beds = beds_count - (
      SELECT COUNT(*) FROM beds 
      WHERE room_id = COALESCE(NEW.room_id, OLD.room_id) 
      AND is_occupied = true
    )
  WHERE id = COALESCE(NEW.room_id, OLD.room_id);
  
  -- Update property current occupancy
  UPDATE properties SET 
    current_occupancy = (
      SELECT COUNT(*) FROM beds 
      WHERE property_id = COALESCE(NEW.property_id, OLD.property_id) 
      AND is_occupied = true
    )
  WHERE id = COALESCE(NEW.property_id, OLD.property_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_occupancy
  AFTER INSERT OR UPDATE OR DELETE ON beds
  FOR EACH ROW EXECUTE FUNCTION update_property_occupancy();

-- Auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


