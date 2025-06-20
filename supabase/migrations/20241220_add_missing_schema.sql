-- ROOMi Platform Database Schema Updates
-- Apple-Level Database Migration for Production Readiness
-- 
-- This migration adds missing tables and columns required for TypeScript compatibility
-- and ensures the database schema matches our Apple-Level application architecture

-- =====================================================
-- PHASE 1: ADD MISSING COLUMNS TO PROPERTIES TABLE
-- =====================================================

-- Add base_price_per_semester column for semester-based pricing
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS base_price_per_semester DECIMAL(10,2);

-- Add currency column for multi-currency support
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'GHS';

-- Update existing properties to have base_price_per_semester = rent for backward compatibility
UPDATE properties 
SET base_price_per_semester = rent 
WHERE base_price_per_semester IS NULL;

-- =====================================================
-- PHASE 2: CREATE NOTIFICATIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS notifications (
    -- Primary key and metadata
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Notification content
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200),
    message TEXT NOT NULL CHECK (char_length(message) BETWEEN 1 AND 1000),
    type VARCHAR(50) NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error', 'booking', 'payment', 'property', 'system')),
    
    -- Notification state
    read BOOLEAN NOT NULL DEFAULT FALSE,
    data JSONB DEFAULT '{}',
    
    -- Indexes for performance
    CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Create indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- =====================================================
-- PHASE 3: CREATE SUBSCRIPTION_PLANS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS subscription_plans (
    -- Primary key and metadata
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Plan details
    name VARCHAR(100) NOT NULL UNIQUE CHECK (char_length(name) BETWEEN 1 AND 100),
    description TEXT NOT NULL CHECK (char_length(description) BETWEEN 10 AND 500),
    
    -- Pricing
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'GHS',
    duration_months INTEGER NOT NULL CHECK (duration_months > 0),
    
    -- Features and status
    features TEXT[] NOT NULL DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Create indexes for subscription_plans
CREATE INDEX IF NOT EXISTS idx_subscription_plans_active ON subscription_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_subscription_plans_price ON subscription_plans(price);

-- =====================================================
-- PHASE 4: INSERT DEFAULT SUBSCRIPTION PLANS
-- =====================================================

-- Insert default subscription plans for ROOMi platform
INSERT INTO subscription_plans (name, description, price, currency, duration_months, features, is_active)
VALUES 
    (
        'Basic Plan',
        'Perfect for individual property owners with up to 5 properties',
        0.00,
        'GHS',
        1,
        ARRAY['Up to 5 properties', 'Basic analytics', 'Email support', 'Standard listing'],
        true
    ),
    (
        'Professional Plan',
        'Ideal for property managers with up to 25 properties',
        150.00,
        'GHS',
        1,
        ARRAY['Up to 25 properties', 'Advanced analytics', 'Priority support', 'Featured listings', 'Bulk operations'],
        true
    ),
    (
        'Enterprise Plan',
        'For large property management companies with unlimited properties',
        500.00,
        'GHS',
        1,
        ARRAY['Unlimited properties', 'Custom analytics', '24/7 phone support', 'Premium listings', 'API access', 'Custom integrations'],
        true
    )
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- PHASE 5: CREATE TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at columns
CREATE TRIGGER update_notifications_updated_at 
    BEFORE UPDATE ON notifications 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_plans_updated_at 
    BEFORE UPDATE ON subscription_plans 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- PHASE 6: ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on new tables
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (auth.uid()::text = user_id);

-- Subscription plans policies (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view subscription plans" ON subscription_plans
    FOR SELECT USING (auth.role() = 'authenticated');

-- =====================================================
-- PHASE 7: COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE notifications IS 'User notifications for the ROOMi platform';
COMMENT ON TABLE subscription_plans IS 'Available subscription plans for property owners';
COMMENT ON COLUMN properties.base_price_per_semester IS 'Semester-based pricing for student housing';
COMMENT ON COLUMN properties.currency IS 'Currency code for property pricing (ISO 4217)';
