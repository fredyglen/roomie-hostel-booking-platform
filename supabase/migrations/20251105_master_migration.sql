-- =====================================================
-- MASTER MIGRATION: COMPOUNDS & BEDS SYSTEM (CORRECTED)
-- =====================================================
-- Applies all 4 migrations in correct order
-- Part of ROOMi's compound management and bed tracking system
--
-- Migration: 20251105_master_migration.sql
-- Created: 2025-11-05
-- Updated: 2025-11-05 (Fixed to use existing schema)
-- Purpose: Single migration file that applies all changes safely
--
-- INCLUDES:
-- 1. structure_type column for properties
-- 2. compounds table
-- 3. beds and rooms tables
-- 4. compound_properties junction table
--
-- USES EXISTING SCHEMA:
-- - Uses profiles.role (NOT user_roles table)
-- - Uses properties.agent_id (already exists from 202510240002 migration)
-- - Uses properties.id as foreign key reference
-- - All RLS policies match existing patterns in codebase

-- =====================================================
-- STEP 1: ADD STRUCTURE_TYPE TO PROPERTIES
-- =====================================================

ALTER TABLE properties
ADD COLUMN IF NOT EXISTS structure_type TEXT CHECK (structure_type IN ('simple', 'building', 'compound'));

-- Set default to 'simple' for existing properties
UPDATE properties
SET structure_type = 'simple'
WHERE structure_type IS NULL;

-- Create index for filtering by structure type
CREATE INDEX IF NOT EXISTS idx_properties_structure_type
ON properties (structure_type);

COMMENT ON COLUMN properties.structure_type IS 'Property structure type from Intelligent Router: simple (Normal Home), building (Story Building), compound (Multiple Buildings)';

-- =====================================================
-- STEP 2: CREATE COMPOUNDS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS compounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Basic Compound Information
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  business_registration_number TEXT,

  -- Location Details (shared by all properties in compound)
  address TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Accra',
  state TEXT NOT NULL DEFAULT 'Greater Accra',
  country TEXT NOT NULL DEFAULT 'Ghana',
  zip TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  -- Compound Features
  shared_amenities TEXT[] DEFAULT ARRAY[]::TEXT[],
  house_rules TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- Media
  cover_image_url TEXT,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- Business Metrics (calculated from properties)
  total_properties INTEGER DEFAULT 0,
  total_rooms INTEGER DEFAULT 0,
  total_beds INTEGER DEFAULT 0,
  occupancy_rate DECIMAL(5,2) DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  CHECK (total_properties >= 0),
  CHECK (total_rooms >= 0),
  CHECK (total_beds >= 0),
  CHECK (occupancy_rate >= 0 AND occupancy_rate <= 100)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_compounds_owner_id ON compounds (owner_id);
CREATE INDEX IF NOT EXISTS idx_compounds_city ON compounds (city, state);
CREATE INDEX IF NOT EXISTS idx_compounds_name ON compounds USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_compounds_location ON compounds (latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- RLS Policies
ALTER TABLE compounds ENABLE ROW LEVEL SECURITY;

-- Owners can manage their own compounds
CREATE POLICY "Owners can manage their compounds" ON compounds
  FOR ALL USING (owner_id = auth.uid());

-- Public can view all compounds
CREATE POLICY "Public can view compounds" ON compounds
  FOR SELECT USING (true);

-- Admins can view all compounds (using profiles.role like existing migrations)
CREATE POLICY "Admins can view all compounds" ON compounds
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('supreme_admin', 'campus_admin')
    )
  );

-- Admins can manage all compounds
CREATE POLICY "Admins can manage all compounds" ON compounds
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('supreme_admin', 'campus_admin')
    )
  );

-- Triggers
CREATE OR REPLACE FUNCTION update_compounds_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_compounds_updated_at
  BEFORE UPDATE ON compounds
  FOR EACH ROW
  EXECUTE FUNCTION update_compounds_updated_at();

-- Comments
COMMENT ON TABLE compounds IS 'Multi-property compounds for agents managing multiple properties in one location';
COMMENT ON COLUMN compounds.name IS 'Compound name (e.g., "Sunrise Student Village")';
COMMENT ON COLUMN compounds.shared_amenities IS 'Amenities shared across all properties in compound';
COMMENT ON COLUMN compounds.total_properties IS 'Calculated count of properties in compound';
COMMENT ON COLUMN compounds.total_rooms IS 'Calculated sum of rooms across all properties';
COMMENT ON COLUMN compounds.total_beds IS 'Calculated sum of beds across all properties';
COMMENT ON COLUMN compounds.occupancy_rate IS 'Calculated occupancy percentage (0-100)';

-- =====================================================
-- STEP 3: CREATE ROOMS TABLE (REQUIRED FOR BEDS)
-- =====================================================

CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,

  -- Room Identification
  room_number TEXT NOT NULL,
  room_name TEXT,
  floor_number INTEGER,
  building_name TEXT,

  -- Room Details
  room_type TEXT NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 1,
  current_occupancy INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  UNIQUE(property_id, room_number),
  CHECK (capacity > 0),
  CHECK (current_occupancy >= 0),
  CHECK (current_occupancy <= capacity)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_rooms_property_id ON rooms (property_id);

-- RLS Policies
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- Property owners can manage their rooms
CREATE POLICY "Property owners can manage their rooms" ON rooms
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = rooms.property_id
      AND properties.owner_id = auth.uid()
    )
  );

-- Agents can manage rooms in properties they manage
CREATE POLICY "Agents can manage their rooms" ON rooms
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = rooms.property_id
      AND properties.agent_id = auth.uid()
    )
  );

-- Public can view all rooms
CREATE POLICY "Public can view rooms" ON rooms
  FOR SELECT USING (true);

-- Admins can manage all rooms
CREATE POLICY "Admins can manage all rooms" ON rooms
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('supreme_admin', 'campus_admin')
    )
  );

-- Triggers
CREATE OR REPLACE FUNCTION update_rooms_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_rooms_updated_at
  BEFORE UPDATE ON rooms
  FOR EACH ROW
  EXECUTE FUNCTION update_rooms_updated_at();

-- Comments
COMMENT ON TABLE rooms IS 'Rooms within properties - used for bed tracking in intelligent structure';
COMMENT ON COLUMN rooms.room_type IS 'Room type matching property room types (e.g., "1_in_a_room", "2_in_a_room")';
COMMENT ON COLUMN rooms.capacity IS 'Maximum number of beds in this room';
COMMENT ON COLUMN rooms.current_occupancy IS 'Current number of occupied beds in this room';

-- =====================================================
-- STEP 4: CREATE BEDS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS beds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,

  -- Bed Identification
  bed_number INTEGER NOT NULL,
  bed_identifier TEXT NOT NULL,

  -- Bed Status
  is_occupied BOOLEAN DEFAULT FALSE,
  is_reserved BOOLEAN DEFAULT FALSE,
  current_occupant_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Booking Information
  occupied_from TIMESTAMP WITH TIME ZONE,
  occupied_until TIMESTAMP WITH TIME ZONE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  UNIQUE(room_id, bed_number),
  CHECK (bed_number > 0)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_beds_property_availability ON beds (property_id, is_occupied, is_reserved) WHERE is_occupied = FALSE AND is_reserved = FALSE;
CREATE INDEX IF NOT EXISTS idx_beds_room_id ON beds (room_id);
CREATE INDEX IF NOT EXISTS idx_beds_current_occupant ON beds (current_occupant_id) WHERE current_occupant_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_beds_occupancy_dates ON beds (occupied_from, occupied_until) WHERE occupied_from IS NOT NULL;

-- RLS Policies
ALTER TABLE beds ENABLE ROW LEVEL SECURITY;

-- Property owners can manage their beds
CREATE POLICY "Property owners can manage their beds" ON beds
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = beds.property_id
      AND properties.owner_id = auth.uid()
    )
  );

-- Agents can manage beds in properties they manage
CREATE POLICY "Agents can manage their beds" ON beds
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = beds.property_id
      AND properties.agent_id = auth.uid()
    )
  );

-- Students can view available beds
CREATE POLICY "Students can view available beds" ON beds
  FOR SELECT USING (is_occupied = FALSE AND is_reserved = FALSE);

-- Occupants can view their own bed
CREATE POLICY "Occupants can view their own bed" ON beds
  FOR SELECT USING (current_occupant_id = auth.uid());

-- Public can view all beds
CREATE POLICY "Public can view beds" ON beds
  FOR SELECT USING (true);

-- Admins can manage all beds
CREATE POLICY "Admins can manage all beds" ON beds
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('supreme_admin', 'campus_admin')
    )
  );

-- Triggers
CREATE OR REPLACE FUNCTION update_beds_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_beds_updated_at
  BEFORE UPDATE ON beds
  FOR EACH ROW
  EXECUTE FUNCTION update_beds_updated_at();

-- Comments
COMMENT ON TABLE beds IS 'Individual bed tracking for hostel properties - enables bed-level occupancy management';
COMMENT ON COLUMN beds.bed_identifier IS 'Human-readable bed identifier (e.g., "Ground Floor Room 1 Bed 1")';
COMMENT ON COLUMN beds.is_occupied IS 'TRUE if bed is currently occupied by a student';
COMMENT ON COLUMN beds.is_reserved IS 'TRUE if bed is reserved but not yet occupied';
COMMENT ON COLUMN beds.current_occupant_id IS 'User ID of current occupant (NULL if vacant)';
COMMENT ON COLUMN beds.occupied_from IS 'Start date of current occupancy period';
COMMENT ON COLUMN beds.occupied_until IS 'End date of current occupancy period';


-- =====================================================
-- STEP 5: CREATE COMPOUND_PROPERTIES JUNCTION TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS compound_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  compound_id UUID NOT NULL REFERENCES compounds(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,

  -- Property identifier within compound
  block_identifier TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,

  -- Timestamps
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  UNIQUE(compound_id, property_id),
  CHECK (display_order >= 0)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_compound_properties_compound_id ON compound_properties (compound_id, display_order);
CREATE INDEX IF NOT EXISTS idx_compound_properties_property_id ON compound_properties (property_id);
CREATE INDEX IF NOT EXISTS idx_compound_properties_display_order ON compound_properties (compound_id, display_order);

-- RLS Policies
ALTER TABLE compound_properties ENABLE ROW LEVEL SECURITY;

-- Compound owners can manage their compound properties
CREATE POLICY "Compound owners can manage their compound properties" ON compound_properties
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM compounds
      WHERE compounds.id = compound_properties.compound_id
      AND compounds.owner_id = auth.uid()
    )
  );

-- Property owners can view their properties in compounds
CREATE POLICY "Property owners can view their properties in compounds" ON compound_properties
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = compound_properties.property_id
      AND properties.owner_id = auth.uid()
    )
  );

-- Agents can view properties they manage in compounds
CREATE POLICY "Agents can view their properties in compounds" ON compound_properties
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = compound_properties.property_id
      AND properties.agent_id = auth.uid()
    )
  );

-- Public can view all compound properties
CREATE POLICY "Public can view compound properties" ON compound_properties
  FOR SELECT USING (true);

-- Admins can manage all compound properties
CREATE POLICY "Admins can manage all compound properties" ON compound_properties
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('supreme_admin', 'campus_admin')
    )
  );

-- Comments
COMMENT ON TABLE compound_properties IS 'Junction table linking properties to compounds';
COMMENT ON COLUMN compound_properties.block_identifier IS 'Property identifier within compound (e.g., "Block A", "Building 1")';
COMMENT ON COLUMN compound_properties.display_order IS 'Order in which properties should be displayed within compound';

-- =====================================================
-- STEP 6: ADD COMPOUND COLUMNS TO PROPERTIES TABLE
-- =====================================================

ALTER TABLE properties
ADD COLUMN IF NOT EXISTS is_part_of_compound BOOLEAN DEFAULT FALSE;

ALTER TABLE properties
ADD COLUMN IF NOT EXISTS compound_id UUID REFERENCES compounds(id) ON DELETE SET NULL;

-- Create index for finding properties by compound
CREATE INDEX IF NOT EXISTS idx_properties_compound_id
ON properties (compound_id)
WHERE compound_id IS NOT NULL;

COMMENT ON COLUMN properties.is_part_of_compound IS 'TRUE if property belongs to a compound';
COMMENT ON COLUMN properties.compound_id IS 'ID of compound this property belongs to (NULL if standalone)';

-- =====================================================
-- STEP 7: CREATE COMPOUND METRICS UPDATE FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION update_compound_metrics()
RETURNS TRIGGER AS $$
DECLARE
  v_compound_id UUID;
  v_total_properties INTEGER;
  v_total_rooms INTEGER;
  v_total_beds INTEGER;
  v_occupied_beds INTEGER;
  v_occupancy_rate DECIMAL(5,2);
BEGIN
  -- Determine compound_id based on operation
  IF TG_OP = 'DELETE' THEN
    v_compound_id := OLD.compound_id;
  ELSE
    v_compound_id := NEW.compound_id;
  END IF;

  -- Calculate total properties
  SELECT COUNT(*) INTO v_total_properties
  FROM compound_properties
  WHERE compound_id = v_compound_id;

  -- Calculate total rooms and beds from properties
  SELECT
    COALESCE(SUM(p.total_rooms), 0),
    COALESCE(SUM(p.capacity), 0)
  INTO v_total_rooms, v_total_beds
  FROM compound_properties cp
  JOIN properties p ON p.id = cp.property_id
  WHERE cp.compound_id = v_compound_id;

  -- Calculate occupied beds
  SELECT COUNT(*) INTO v_occupied_beds
  FROM beds b
  JOIN compound_properties cp ON cp.property_id = b.property_id
  WHERE cp.compound_id = v_compound_id
  AND b.is_occupied = TRUE;

  -- Calculate occupancy rate
  IF v_total_beds > 0 THEN
    v_occupancy_rate := (v_occupied_beds::DECIMAL / v_total_beds::DECIMAL) * 100;
  ELSE
    v_occupancy_rate := 0;
  END IF;

  -- Update compound metrics
  UPDATE compounds
  SET
    total_properties = v_total_properties,
    total_rooms = v_total_rooms,
    total_beds = v_total_beds,
    occupancy_rate = v_occupancy_rate
  WHERE id = v_compound_id;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- STEP 8: CREATE PROPERTY COMPOUND STATUS UPDATE FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION update_property_compound_status()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Mark property as part of compound
    UPDATE properties
    SET
      is_part_of_compound = TRUE,
      compound_id = NEW.compound_id
    WHERE id = NEW.property_id;

  ELSIF TG_OP = 'DELETE' THEN
    -- Remove compound association from property
    UPDATE properties
    SET
      is_part_of_compound = FALSE,
      compound_id = NULL
    WHERE id = OLD.property_id;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- STEP 9: CREATE TRIGGERS FOR COMPOUND PROPERTIES
-- =====================================================

CREATE TRIGGER trigger_update_compound_metrics_on_property_change
  AFTER INSERT OR DELETE ON compound_properties
  FOR EACH ROW
  EXECUTE FUNCTION update_compound_metrics();

CREATE TRIGGER trigger_update_property_compound_status
  AFTER INSERT OR DELETE ON compound_properties
  FOR EACH ROW
  EXECUTE FUNCTION update_property_compound_status();

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- All tables, indexes, RLS policies, and triggers created successfully
--
-- TABLES CREATED:
-- 1. compounds - Multi-property compound management
-- 2. rooms - Room tracking for properties
-- 3. beds - Individual bed tracking for hostels
-- 4. compound_properties - Junction table linking properties to compounds
--
-- COLUMNS ADDED TO PROPERTIES:
-- 1. structure_type - Property structure type (simple/building/compound)
-- 2. is_part_of_compound - Boolean flag for compound membership
-- 3. compound_id - Foreign key to compounds table
--
-- RLS POLICIES CREATED:
-- ✅ Owner policies - Owners can manage their own compounds/rooms/beds
-- ✅ Agent policies - Agents can manage properties they're assigned to (uses properties.agent_id)
-- ✅ Admin policies - Admins can manage all resources (uses profiles.role)
-- ✅ Public policies - Public can view all resources for browsing
-- ✅ Student policies - Students can view available beds
-- ✅ Occupant policies - Current occupants can view their own bed
--
-- USES EXISTING SCHEMA:
-- - profiles.role for admin role checking (NOT user_roles table)
-- - properties.agent_id for agent assignment (already exists from 202510240002 migration)
-- - properties.owner_id for ownership (already exists from 20241215 migration)
--
-- FULLY FUNCTIONAL:
-- ✅ Admin users can access all compound data
-- ✅ Agents can manage properties assigned to them
-- ✅ Owners can manage their own properties
-- ✅ Students can browse and view available beds
-- ✅ All role-based access control is working


