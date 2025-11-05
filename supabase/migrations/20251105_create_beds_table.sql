-- =====================================================
-- BEDS TABLE MIGRATION
-- =====================================================
-- Creates the beds table for individual bed tracking in hostels
-- Part of ROOMi's intelligent bed availability system
--
-- Migration: 20251105_create_beds_table.sql
-- Created: 2025-11-05
-- Purpose: Enable bed-level occupancy tracking for hostel properties

-- =====================================================
-- CREATE BEDS TABLE
-- =====================================================

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

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Index for finding available beds by property
CREATE INDEX IF NOT EXISTS idx_beds_property_availability 
ON beds (property_id, is_occupied, is_reserved) 
WHERE is_occupied = FALSE AND is_reserved = FALSE;

-- Index for finding beds by room
CREATE INDEX IF NOT EXISTS idx_beds_room_id 
ON beds (room_id);

-- Index for finding occupied beds by occupant
CREATE INDEX IF NOT EXISTS idx_beds_current_occupant 
ON beds (current_occupant_id) 
WHERE current_occupant_id IS NOT NULL;

-- Index for finding beds by occupancy dates
CREATE INDEX IF NOT EXISTS idx_beds_occupancy_dates 
ON beds (occupied_from, occupied_until) 
WHERE occupied_from IS NOT NULL;

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

ALTER TABLE beds ENABLE ROW LEVEL SECURITY;

-- Policy: Property owners can view and manage beds in their properties
CREATE POLICY "Property owners can manage their beds" ON beds
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = beds.property_id
      AND properties.owner_id = auth.uid()
    )
  );

-- Policy: Agents can view beds in properties they manage
CREATE POLICY "Agents can view beds in their properties" ON beds
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = beds.property_id
      AND properties.agent_id = auth.uid()
    )
  );

-- Policy: Students can view available beds
CREATE POLICY "Students can view available beds" ON beds
  FOR SELECT USING (
    is_occupied = FALSE AND is_reserved = FALSE
  );

-- Policy: Current occupants can view their own bed
CREATE POLICY "Occupants can view their own bed" ON beds
  FOR SELECT USING (
    current_occupant_id = auth.uid()
  );

-- Policy: Admins can view all beds
CREATE POLICY "Admins can view all beds" ON beds
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() 
      AND role IN ('supreme_admin', 'country_admin', 'campus_admin')
    )
  );

-- =====================================================
-- TRIGGER: UPDATE updated_at TIMESTAMP
-- =====================================================

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

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE beds IS 'Individual bed tracking for hostel properties - enables bed-level occupancy management';
COMMENT ON COLUMN beds.bed_identifier IS 'Human-readable bed identifier (e.g., "Ground Floor Room 1 Bed 1")';
COMMENT ON COLUMN beds.is_occupied IS 'TRUE if bed is currently occupied by a student';
COMMENT ON COLUMN beds.is_reserved IS 'TRUE if bed is reserved but not yet occupied';
COMMENT ON COLUMN beds.current_occupant_id IS 'User ID of current occupant (NULL if vacant)';
COMMENT ON COLUMN beds.occupied_from IS 'Start date of current occupancy period';
COMMENT ON COLUMN beds.occupied_until IS 'End date of current occupancy period';

