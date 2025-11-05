-- =====================================================
-- COMPOUNDS & BEDS SYSTEM MIGRATION (CORRECT VERSION)
-- =====================================================
-- Created: 2025-11-05
-- Purpose: Add compounds and beds system to existing schema
--
-- USES EXISTING SCHEMA:
-- - properties.id (UUID primary key)
-- - profiles.role (for admin checks)
-- - rooms table (already exists with floor_id reference)
-- - buildings, floors tables (already exist)
--
-- CREATES:
-- 1. compounds table
-- 2. beds table (references EXISTING rooms table)
-- 3. compound_properties junction table
-- 4. structure_type, is_part_of_compound, compound_id columns on properties

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

CREATE POLICY "Owners can manage their compounds" ON compounds
  FOR ALL USING (owner_id = auth.uid());

CREATE POLICY "Public can view compounds" ON compounds
  FOR SELECT USING (true);

CREATE POLICY "Admins can view all compounds" ON compounds
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('supreme_admin', 'campus_admin')
    )
  );

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
-- STEP 3: CREATE BEDS TABLE (REFERENCES EXISTING ROOMS)
-- =====================================================

CREATE TABLE IF NOT EXISTS beds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,

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
CREATE INDEX IF NOT EXISTS idx_beds_room_id ON beds (room_id);
CREATE INDEX IF NOT EXISTS idx_beds_availability ON beds (is_occupied, is_reserved) WHERE is_occupied = FALSE AND is_reserved = FALSE;
CREATE INDEX IF NOT EXISTS idx_beds_current_occupant ON beds (current_occupant_id) WHERE current_occupant_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_beds_occupancy_dates ON beds (occupied_from, occupied_until) WHERE occupied_from IS NOT NULL;

-- RLS Policies
ALTER TABLE beds ENABLE ROW LEVEL SECURITY;

-- Get property_id from room → floor → building → property chain
-- Note: We need to trace through the hierarchy to find the property owner
CREATE POLICY "Room owners can manage beds" ON beds
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM rooms r
      JOIN floors f ON f.id = r.floor_id
      JOIN buildings b ON b.id = f.building_id
      JOIN properties p ON p.id = b.property_id
      WHERE r.id = beds.room_id
      AND p.owner_id = auth.uid()
    )
  );

CREATE POLICY "Students can view available beds" ON beds
  FOR SELECT USING (is_occupied = FALSE AND is_reserved = FALSE);

CREATE POLICY "Occupants can view their own bed" ON beds
  FOR SELECT USING (current_occupant_id = auth.uid());

CREATE POLICY "Public can view beds" ON beds
  FOR SELECT USING (true);

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
-- STEP 4: CREATE COMPOUND_PROPERTIES JUNCTION TABLE
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

-- RLS Policies
ALTER TABLE compound_properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Compound owners can manage their compound properties" ON compound_properties
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM compounds
      WHERE compounds.id = compound_properties.compound_id
      AND compounds.owner_id = auth.uid()
    )
  );

CREATE POLICY "Property owners can view their properties in compounds" ON compound_properties
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = compound_properties.property_id
      AND properties.owner_id = auth.uid()
    )
  );

CREATE POLICY "Public can view compound properties" ON compound_properties
  FOR SELECT USING (true);

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
-- STEP 5: ADD COMPOUND COLUMNS TO PROPERTIES TABLE
-- =====================================================

ALTER TABLE properties
ADD COLUMN IF NOT EXISTS is_part_of_compound BOOLEAN DEFAULT FALSE;

ALTER TABLE properties
ADD COLUMN IF NOT EXISTS compound_id UUID REFERENCES compounds(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_properties_compound_id
ON properties (compound_id)
WHERE compound_id IS NOT NULL;

COMMENT ON COLUMN properties.is_part_of_compound IS 'TRUE if property belongs to a compound';
COMMENT ON COLUMN properties.compound_id IS 'ID of compound this property belongs to (NULL if standalone)';

-- =====================================================
-- STEP 6: CREATE TRIGGERS FOR COMPOUND METRICS
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
  IF TG_OP = 'DELETE' THEN
    v_compound_id := OLD.compound_id;
  ELSE
    v_compound_id := NEW.compound_id;
  END IF;

  SELECT COUNT(*) INTO v_total_properties
  FROM compound_properties
  WHERE compound_id = v_compound_id;

  SELECT
    COALESCE(SUM(p.total_rooms), 0),
    COALESCE(SUM(p.beds_available), 0)
  INTO v_total_rooms, v_total_beds
  FROM compound_properties cp
  JOIN properties p ON p.id = cp.property_id
  WHERE cp.compound_id = v_compound_id;

  SELECT COUNT(*) INTO v_occupied_beds
  FROM beds b
  JOIN rooms r ON r.id = b.room_id
  JOIN floors f ON f.id = r.floor_id
  JOIN buildings bld ON bld.id = f.building_id
  JOIN compound_properties cp ON cp.property_id = bld.property_id
  WHERE cp.compound_id = v_compound_id
  AND b.is_occupied = TRUE;

  IF v_total_beds > 0 THEN
    v_occupancy_rate := (v_occupied_beds::DECIMAL / v_total_beds::DECIMAL) * 100;
  ELSE
    v_occupancy_rate := 0;
  END IF;

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

CREATE OR REPLACE FUNCTION update_property_compound_status()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE properties
    SET
      is_part_of_compound = TRUE,
      compound_id = NEW.compound_id
    WHERE id = NEW.property_id;

  ELSIF TG_OP = 'DELETE' THEN
    UPDATE properties
    SET
      is_part_of_compound = FALSE,
      compound_id = NULL
    WHERE id = OLD.property_id;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

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
-- TABLES CREATED:
-- 1. compounds - Multi-property compound management
-- 2. beds - Individual bed tracking (references EXISTING rooms table)
-- 3. compound_properties - Junction table linking properties to compounds
--
-- COLUMNS ADDED TO PROPERTIES:
-- 1. structure_type - Property structure type (simple/building/compound)
-- 2. is_part_of_compound - Boolean flag for compound membership
-- 3. compound_id - Foreign key to compounds table
--
-- USES EXISTING SCHEMA:
-- - properties.id (UUID) ✅
-- - profiles.role (for admin checks) ✅
-- - rooms table (with floor_id reference) ✅
-- - buildings → floors → rooms hierarchy ✅
--
-- RLS POLICIES:
-- ✅ Owner policies (manage own resources)
-- ✅ Admin policies (manage all resources using profiles.role)
-- ✅ Public policies (view all for browsing)
-- ✅ Student policies (view available beds)
-- ✅ Occupant policies (view own bed)

