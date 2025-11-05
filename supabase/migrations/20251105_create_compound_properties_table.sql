-- =====================================================
-- COMPOUND PROPERTIES JUNCTION TABLE MIGRATION
-- =====================================================
-- Creates the compound_properties junction table
-- Part of ROOMi's premium compound management system
--
-- Migration: 20251105_create_compound_properties_table.sql
-- Created: 2025-11-05
-- Purpose: Link properties to compounds (many-to-one relationship)

-- =====================================================
-- CREATE COMPOUND_PROPERTIES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS compound_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  compound_id UUID NOT NULL REFERENCES compounds(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  
  -- Property identifier within compound
  block_identifier TEXT NOT NULL, -- e.g., "Block A", "Building 1", "Unit 5"
  display_order INTEGER DEFAULT 0,
  
  -- Timestamps
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(compound_id, property_id),
  CHECK (display_order >= 0)
);

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Index for finding properties by compound
CREATE INDEX IF NOT EXISTS idx_compound_properties_compound_id 
ON compound_properties (compound_id, display_order);

-- Index for finding compound by property
CREATE INDEX IF NOT EXISTS idx_compound_properties_property_id 
ON compound_properties (property_id);

-- Index for ordering properties within compound
CREATE INDEX IF NOT EXISTS idx_compound_properties_display_order 
ON compound_properties (compound_id, display_order);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

ALTER TABLE compound_properties ENABLE ROW LEVEL SECURITY;

-- Policy: Compound owners can manage their compound properties
CREATE POLICY "Compound owners can manage their compound properties" ON compound_properties
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM compounds
      WHERE compounds.id = compound_properties.compound_id
      AND compounds.owner_id = auth.uid()
    )
  );

-- Policy: Property owners can view their properties in compounds
CREATE POLICY "Property owners can view their properties in compounds" ON compound_properties
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = compound_properties.property_id
      AND properties.owner_id = auth.uid()
    )
  );

-- Policy: Students can view all compound properties
CREATE POLICY "Students can view compound properties" ON compound_properties
  FOR SELECT USING (true);

-- Policy: Admins can manage all compound properties
CREATE POLICY "Admins can manage all compound properties" ON compound_properties
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() 
      AND role IN ('supreme_admin', 'country_admin', 'campus_admin')
    )
  );

-- =====================================================
-- TRIGGER: UPDATE COMPOUND METRICS ON PROPERTY CHANGES
-- =====================================================
-- This trigger updates compound metrics when properties are added/removed

CREATE TRIGGER trigger_update_compound_metrics_on_property_change
  AFTER INSERT OR DELETE ON compound_properties
  FOR EACH ROW
  EXECUTE FUNCTION update_compound_metrics();

-- =====================================================
-- TRIGGER: UPDATE PROPERTY COMPOUND STATUS
-- =====================================================
-- This trigger updates the property's compound status when added/removed

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

CREATE TRIGGER trigger_update_property_compound_status
  AFTER INSERT OR DELETE ON compound_properties
  FOR EACH ROW
  EXECUTE FUNCTION update_property_compound_status();

-- =====================================================
-- ADD COMPOUND COLUMNS TO PROPERTIES TABLE
-- =====================================================
-- Add columns to properties table to track compound membership

ALTER TABLE properties
ADD COLUMN IF NOT EXISTS is_part_of_compound BOOLEAN DEFAULT FALSE;

ALTER TABLE properties
ADD COLUMN IF NOT EXISTS compound_id UUID REFERENCES compounds(id) ON DELETE SET NULL;

-- Create index for finding properties by compound
CREATE INDEX IF NOT EXISTS idx_properties_compound_id 
ON properties (compound_id) 
WHERE compound_id IS NOT NULL;

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE compound_properties IS 'Junction table linking properties to compounds';
COMMENT ON COLUMN compound_properties.block_identifier IS 'Property identifier within compound (e.g., "Block A", "Building 1")';
COMMENT ON COLUMN compound_properties.display_order IS 'Order in which properties should be displayed within compound';
COMMENT ON COLUMN properties.is_part_of_compound IS 'TRUE if property belongs to a compound';
COMMENT ON COLUMN properties.compound_id IS 'ID of compound this property belongs to (NULL if standalone)';

