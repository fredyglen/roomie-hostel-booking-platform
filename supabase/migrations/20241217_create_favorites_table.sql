-- Create favorites table for student property favorites
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique favorites per user-property combination
  UNIQUE(user_id, property_id)
);

-- Enable RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own favorites"
  ON favorites
  FOR ALL
  USING (auth.uid() = user_id);

-- Indexes for performance
-- Note: CONCURRENTLY cannot run in Supabase CLI pipeline/transaction mode.
-- Using standard CREATE INDEX to ensure migration applies via CLI.
CREATE INDEX IF NOT EXISTS idx_favorites_user_id
  ON favorites (user_id);

CREATE INDEX IF NOT EXISTS idx_favorites_property_id
  ON favorites (property_id);

CREATE INDEX IF NOT EXISTS idx_favorites_user_created
  ON favorites (user_id, created_at DESC);

-- Add favorites table to Supabase types
COMMENT ON TABLE favorites IS 'Student property favorites system';
COMMENT ON COLUMN favorites.user_id IS 'Reference to the user who favorited the property';
COMMENT ON COLUMN favorites.property_id IS 'Reference to the favorited property';
COMMENT ON COLUMN favorites.created_at IS 'When the property was favorited';
