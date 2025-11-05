-- =====================================================
-- ADD STRUCTURE_TYPE COLUMN TO PROPERTIES TABLE
-- =====================================================
-- Adds structure_type column to track property structure
-- Part of Intelligent Property Router integration
--
-- Migration: 20251105_add_structure_type_to_properties.sql
-- Created: 2025-11-05
-- Purpose: Persist router decisions for property structure type

-- =====================================================
-- ADD STRUCTURE_TYPE COLUMN
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

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON COLUMN properties.structure_type IS 'Property structure type from Intelligent Router: simple (Normal Home), building (Story Building), compound (Multiple Buildings)';

