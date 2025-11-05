-- =====================================================
-- COMPOUNDS TABLE MIGRATION (FIXED)
-- =====================================================
-- Creates the compounds table for multi-property management
-- Part of ROOMi's premium compound management system
--
-- Migration: 20251105_create_compounds_table_fixed.sql
-- Created: 2025-11-05
-- Purpose: Enable agents to manage multiple properties as a single compound
-- FIXED: Removed user_roles dependency from RLS policies

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

-- Policy: Everyone can view compounds (for public browsing)
CREATE POLICY "Public can view compounds" ON compounds
  FOR SELECT USING (true);

-- ✅ REMOVED: Admin policies that depend on user_roles table
-- These will be added later when user_roles table is created

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

  -- Calculate occupied beds (if beds table exists)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'beds') THEN
    SELECT COUNT(*) INTO v_occupied_beds
    FROM beds b
    JOIN compound_properties cp ON cp.property_id = b.property_id
    WHERE cp.compound_id = v_compound_id
    AND b.is_occupied = TRUE;
  ELSE
    v_occupied_beds := 0;
  END IF;

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
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE compounds IS 'Multi-property compounds for agents managing multiple properties in one location';
COMMENT ON COLUMN compounds.name IS 'Compound name (e.g., "Sunrise Student Village")';
COMMENT ON COLUMN compounds.shared_amenities IS 'Amenities shared across all properties in compound';
COMMENT ON COLUMN compounds.total_properties IS 'Calculated count of properties in compound';
COMMENT ON COLUMN compounds.total_rooms IS 'Calculated sum of rooms across all properties';
COMMENT ON COLUMN compounds.total_beds IS 'Calculated sum of beds across all properties';
COMMENT ON COLUMN compounds.occupancy_rate IS 'Calculated occupancy percentage (0-100)';


