-- Migration: Add 'good_to_know' field to properties table
-- Purpose: Allow property owners to share important property considerations with students
-- Date: 2025-01-13
-- Author: ROOMi Platform Development Team

-- Add good_to_know field to properties table
ALTER TABLE properties 
ADD COLUMN good_to_know TEXT;

-- Add character limit constraint (500 characters max)
ALTER TABLE properties 
ADD CONSTRAINT good_to_know_length 
CHECK (char_length(good_to_know) <= 500);

-- Add comment for documentation
COMMENT ON COLUMN properties.good_to_know IS 'Important property considerations and details that students should know before booking (max 500 characters)';

-- Create index for better query performance when filtering properties with good_to_know content
CREATE INDEX idx_properties_good_to_know ON properties(good_to_know) WHERE good_to_know IS NOT NULL;

-- Update existing properties to have NULL good_to_know (explicit for clarity)
UPDATE properties SET good_to_know = NULL WHERE good_to_know IS NULL;
