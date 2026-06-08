-- =====================================================
-- MIGRATION: Fix Property Creation & Verification Sync
-- Purpose: Complete repair of property pipeline,
--          student portal visibility, and admin verification
-- =====================================================

-- =====================================================
-- STEP 1: Add missing columns to properties table
-- =====================================================

-- Core identification and type columns
ALTER TABLE properties ADD COLUMN IF NOT EXISTS property_type TEXT DEFAULT 'hostel';
ALTER TABLE properties ADD COLUMN IF NOT EXISTS property_category TEXT DEFAULT 'Hostel';
ALTER TABLE properties ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending';

-- Location columns
ALTER TABLE properties ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS region TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS zip TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS nearest_university TEXT;

-- Features
ALTER TABLE properties ADD COLUMN IF NOT EXISTS bedrooms INTEGER DEFAULT 1;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS bathrooms INTEGER DEFAULT 1;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS max_occupants INTEGER DEFAULT 1;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS gender_restriction TEXT DEFAULT 'mixed';
ALTER TABLE properties ADD COLUMN IF NOT EXISTS is_furnished BOOLEAN DEFAULT false;

-- Availability
ALTER TABLE properties ADD COLUMN IF NOT EXISTS available_from TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS available_to TEXT;

-- Pricing (using 'rent' as canonical column)
ALTER TABLE properties ADD COLUMN IF NOT EXISTS rent NUMERIC;

-- Media and amenities
ALTER TABLE properties ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]';
ALTER TABLE properties ADD COLUMN IF NOT EXISTS amenities JSONB DEFAULT '[]';

-- Additional fields
ALTER TABLE properties ADD COLUMN IF NOT EXISTS distance_to_campus TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS parking_available BOOLEAN DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS has_accessibility_features BOOLEAN DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS pet_policy TEXT DEFAULT 'not_allowed';
ALTER TABLE properties ADD COLUMN IF NOT EXISTS cancellation_policy TEXT DEFAULT 'moderate';
ALTER TABLE properties ADD COLUMN IF NOT EXISTS internet_speed TEXT DEFAULT 'standard';
ALTER TABLE properties ADD COLUMN IF NOT EXISTS virtual_tour_url TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS good_to_know TEXT;

-- Metadata
ALTER TABLE properties ADD COLUMN IF NOT EXISTS advance_payment_months INTEGER DEFAULT 1;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS allow_bill_sharing BOOLEAN DEFAULT false;

-- =====================================================
-- STEP 2: Create property_verifications table (Admin queue)
-- =====================================================

CREATE TABLE IF NOT EXISTS property_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  verification_type TEXT DEFAULT 'standard',
  priority_level TEXT DEFAULT 'normal',
  admin_notes TEXT,
  rejection_reason TEXT,
  verification_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE property_verifications ENABLE ROW LEVEL SECURITY;

-- Admin can manage all verifications
CREATE POLICY IF NOT EXISTS "Admins can manage verifications"
  ON property_verifications FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' IN ('supreme_admin', 'campus_admin', 'admin'));

-- Owners can view their own property verifications
CREATE POLICY IF NOT EXISTS "Owners can view their verifications"
  ON property_verifications FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM properties 
    WHERE properties.id = property_verifications.property_id 
    AND properties.owner_id = auth.uid()
  ));

-- =====================================================
-- STEP 3: Create building structure tables
-- =====================================================

-- Buildings table
CREATE TABLE IF NOT EXISTS buildings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  floors_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Floors table
CREATE TABLE IF NOT EXISTS floors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  building_id UUID REFERENCES buildings(id) ON DELETE CASCADE,
  floor_number INTEGER NOT NULL,
  name TEXT,
  description TEXT,
  rooms_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  floor_id UUID REFERENCES floors(id) ON DELETE CASCADE,
  room_number TEXT NOT NULL,
  room_type TEXT,
  bed_count INTEGER DEFAULT 0,
  beds_available INTEGER DEFAULT 0,
  max_occupants INTEGER DEFAULT 0,
  rent_amount NUMERIC,
  amenities JSONB DEFAULT '[]',
  description TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on structure tables
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE floors ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- Policies for buildings
CREATE POLICY IF NOT EXISTS "Public can view buildings"
  ON buildings FOR SELECT TO authenticated USING (true);

CREATE POLICY IF NOT EXISTS "Owners can manage their buildings"
  ON buildings FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM properties WHERE properties.id = buildings.property_id AND properties.owner_id = auth.uid()));

-- Policies for floors
CREATE POLICY IF NOT EXISTS "Public can view floors"
  ON floors FOR SELECT TO authenticated USING (true);

CREATE POLICY IF NOT EXISTS "Owners can manage their floors"
  ON floors FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM buildings 
    JOIN properties ON properties.id = buildings.property_id 
    WHERE floors.building_id = buildings.id AND properties.owner_id = auth.uid()
  ));

-- Policies for rooms
CREATE POLICY IF NOT EXISTS "Public can view rooms"
  ON rooms FOR SELECT TO authenticated USING (true);

CREATE POLICY IF NOT EXISTS "Owners can manage their rooms"
  ON rooms FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM floors 
    JOIN buildings ON buildings.id = floors.building_id
    JOIN properties ON properties.id = buildings.property_id 
    WHERE rooms.floor_id = floors.id AND properties.owner_id = auth.uid()
  ));

-- =====================================================
-- STEP 4: Create function to auto-update updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_properties_updated_at ON properties;
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_property_verifications_updated_at ON property_verifications;
CREATE TRIGGER update_property_verifications_updated_at
  BEFORE UPDATE ON property_verifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- STEP 5: Fix existing data
-- =====================================================

-- Set all existing properties to have proper verification_status
UPDATE properties SET verification_status = 'pending' WHERE verification_status IS NULL;

-- Set all existing properties to be available
UPDATE properties SET is_available = true WHERE is_available IS NULL;

-- Create verification entries for existing properties that don't have one
INSERT INTO property_verifications (property_id, status, verification_type, priority_level)
SELECT 
  id as property_id,
  COALESCE(verification_status, 'pending') as status,
  'standard' as verification_type,
  'normal' as priority_level
FROM properties
WHERE NOT EXISTS (
  SELECT 1 FROM property_verifications 
  WHERE property_verifications.property_id = properties.id
);

-- =====================================================
-- STEP 6: Create indexes for performance
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_properties_verification_status ON properties(verification_status);
CREATE INDEX IF NOT EXISTS idx_properties_is_available ON properties(is_available);
CREATE INDEX IF NOT EXISTS idx_properties_owner_id ON properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);

CREATE INDEX IF NOT EXISTS idx_property_verifications_status ON property_verifications(status);
CREATE INDEX IF NOT EXISTS idx_property_verifications_property_id ON property_verifications(property_id);

CREATE INDEX IF NOT EXISTS idx_buildings_property_id ON buildings(property_id);
CREATE INDEX IF NOT EXISTS idx_floors_building_id ON floors(building_id);
CREATE INDEX IF NOT EXISTS idx_rooms_floor_id ON rooms(floor_id);

-- =====================================================
-- STEP 7: Grant permissions
-- =====================================================

GRANT ALL ON properties TO authenticated;
GRANT ALL ON property_verifications TO authenticated;
GRANT ALL ON buildings TO authenticated;
GRANT ALL ON floors TO authenticated;
GRANT ALL ON rooms TO authenticated;

-- =====================================================
-- VERIFICATION: Check the migration worked
-- =====================================================

SELECT 'Migration complete!' as status;
SELECT COUNT(*) as total_properties FROM properties;
SELECT COUNT(*) as total_verifications FROM property_verifications;
SELECT COUNT(*) as properties_needing_approval 
FROM properties 
WHERE verification_status = 'pending';
