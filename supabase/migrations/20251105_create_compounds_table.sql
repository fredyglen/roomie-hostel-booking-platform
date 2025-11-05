-- =====================================================
-- COMPOUNDS TABLE MIGRATION
-- =====================================================
-- Creates the compounds table for multi-property management
-- Part of ROOMi's premium compound management system
--
-- Migration: 20251105_create_compounds_table.sql
-- Created: 2025-11-05
-- Purpose: Enable agents to manage multiple properties as a single compound

-- =====================================================
-- CREATE COMPOUNDS TABLE
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

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Index for finding compounds by owner
CREATE INDEX IF NOT EXISTS idx_compounds_owner_id 
ON compounds (owner_id);

-- Index for finding compounds by location
CREATE INDEX IF NOT EXISTS idx_compounds_city 
ON compounds (city, state);

-- Index for finding compounds by name (for search)
CREATE INDEX IF NOT EXISTS idx_compounds_name 
ON compounds USING gin(to_tsvector('english', name));

-- Index for geospatial queries
CREATE INDEX IF NOT EXISTS idx_compounds_location 
ON compounds (latitude, longitude) 
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

ALTER TABLE compounds ENABLE ROW LEVEL SECURITY;

-- Policy: Owners can manage their own compounds
CREATE POLICY "Owners can manage their compounds" ON compounds
  FOR ALL USING (
    owner_id = auth.uid()
  );

-- Policy: Students can view all compounds
CREATE POLICY "Students can view compounds" ON compounds
  FOR SELECT USING (true);

-- Policy: Admins can view all compounds
CREATE POLICY "Admins can view all compounds" ON compounds
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() 
      AND role IN ('supreme_admin', 'country_admin', 'campus_admin')
    )
  );

-- Policy: Admins can manage all compounds
CREATE POLICY "Admins can manage all compounds" ON compounds
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() 
      AND role IN ('supreme_admin', 'country_admin')
    )
  );

-- =====================================================
-- TRIGGER: UPDATE updated_at TIMESTAMP
-- =====================================================

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

-- =====================================================
-- TRIGGER: UPDATE COMPOUND METRICS
-- =====================================================
-- This trigger automatically updates compound metrics when properties are added/removed

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

-- Note: Trigger will be created after compound_properties table exists
-- See: 20251105_create_compound_properties_table.sql

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE compounds IS 'Multi-property compounds for agents managing multiple properties in one location';
COMMENT ON COLUMN compounds.name IS 'Compound name (e.g., "Sunrise Student Village")';
COMMENT ON COLUMN compounds.shared_amenities IS 'Amenities shared across all properties in compound';
COMMENT ON COLUMN compounds.total_properties IS 'Calculated count of properties in compound';
COMMENT ON COLUMN compounds.total_rooms IS 'Calculated sum of rooms across all properties';
COMMENT ON COLUMN compounds.total_beds IS 'Calculated sum of beds across all properties';
COMMENT ON COLUMN compounds.occupancy_rate IS 'Calculated occupancy percentage (0-100)';

