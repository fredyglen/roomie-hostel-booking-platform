
-- This SQL script is for setting up the Supabase database schema

-- Create a profiles table for user profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student',
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Set up Row Level Security (RLS) for the profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profiles
CREATE POLICY "Users can read their own profiles" 
  ON profiles 
  FOR SELECT 
  USING (auth.uid() = id);

-- Allow users to update their own profiles
CREATE POLICY "Users can update their own profiles" 
  ON profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Allow users to create their own profiles
CREATE POLICY "Users can insert their own profiles" 
  ON profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Create a properties table
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  address TEXT NOT NULL,
  price NUMERIC NOT NULL,
  price_unit TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Available',
  occupancy TEXT,
  image_url TEXT,
  description TEXT,
  distance_to_campus TEXT,
  amenities TEXT[],
  house_rules TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Set up Row Level Security (RLS) for the properties table
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Allow all users to read properties
CREATE POLICY "All users can read properties" 
  ON properties 
  FOR SELECT 
  USING (true);

-- Allow owners to create their own properties
CREATE POLICY "Owners can create their own properties" 
  ON properties 
  FOR INSERT 
  WITH CHECK (auth.uid() = owner_id);

-- Allow owners to update their own properties
CREATE POLICY "Owners can update their own properties" 
  ON properties 
  FOR UPDATE 
  USING (auth.uid() = owner_id);

-- Allow owners to delete their own properties
CREATE POLICY "Owners can delete their own properties" 
  ON properties 
  FOR DELETE 
  USING (auth.uid() = owner_id);

-- Create a bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_title TEXT NOT NULL,
  student_name TEXT NOT NULL,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Set up Row Level Security (RLS) for the bookings table
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow students to read their own bookings
CREATE POLICY "Students can read their own bookings" 
  ON bookings 
  FOR SELECT 
  USING (auth.uid() = student_id);

-- Allow owners to read bookings for their properties
CREATE POLICY "Owners can read bookings for their properties" 
  ON bookings 
  FOR SELECT 
  USING (auth.uid() = owner_id);

-- Allow students to create bookings
CREATE POLICY "Students can create bookings" 
  ON bookings 
  FOR INSERT 
  WITH CHECK (auth.uid() = student_id);

-- Allow owners to update booking status
CREATE POLICY "Owners can update booking status" 
  ON bookings 
  FOR UPDATE 
  USING (auth.uid() = owner_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update the updated_at column
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON properties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create enhanced bookings table (used by components)
CREATE TABLE IF NOT EXISTS bookings_enhanced (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_reference TEXT UNIQUE NOT NULL DEFAULT 'ROOMI_' || extract(epoch from now()) || '_' || substr(md5(random()::text), 1, 6),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  property_owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  room_id UUID,
  check_in_date TIMESTAMPTZ NOT NULL,
  check_out_date TIMESTAMPTZ NOT NULL,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  total_amount NUMERIC NOT NULL,
  property_rent NUMERIC,
  platform_fee NUMERIC DEFAULT 0,
  agent_fee NUMERIC DEFAULT 0,
  package_type TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  payment_reference TEXT,
  paystack_reference TEXT,
  paystack_access_code TEXT,
  transaction_reference TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  emergency_contact_relationship TEXT,
  special_requests TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Set up RLS for bookings_enhanced
ALTER TABLE bookings_enhanced ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can read their own enhanced bookings"
  ON bookings_enhanced
  FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Owners can read enhanced bookings for their properties"
  ON bookings_enhanced
  FOR SELECT
  USING (auth.uid() = property_owner_id);

CREATE POLICY "Students can create enhanced bookings"
  ON bookings_enhanced
  FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Owners can update enhanced booking status"
  ON bookings_enhanced
  FOR UPDATE
  USING (auth.uid() = property_owner_id);

-- Create trigger for bookings_enhanced
CREATE TRIGGER update_bookings_enhanced_updated_at
    BEFORE UPDATE ON bookings_enhanced
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Student verification system
CREATE TABLE IF NOT EXISTS student_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  university_name TEXT,
  student_id_number TEXT,
  verification_status TEXT DEFAULT 'pending',
  documents JSONB,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE student_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can read their own verifications"
  ON student_verifications
  FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Students can create their own verifications"
  ON student_verifications
  FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- Saved searches
CREATE TABLE IF NOT EXISTS saved_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  search_criteria JSONB,
  search_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own saved searches"
  ON saved_searches
  FOR ALL
  USING (auth.uid() = user_id);

-- User preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own preferences"
  ON user_preferences
  FOR ALL
  USING (auth.uid() = user_id);

-- Platform analytics
CREATE TABLE IF NOT EXISTS platform_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_name TEXT NOT NULL,
  metric_value NUMERIC,
  metric_data JSONB,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Only admins can access analytics (no RLS policy for regular users)
ALTER TABLE platform_analytics ENABLE ROW LEVEL SECURITY;
