
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
