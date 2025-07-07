-- =====================================================
-- ROOMi PLATFORM MISSING TABLES MIGRATION
-- =====================================================
-- This script creates all missing tables causing TypeScript errors
-- Run this in Supabase SQL Editor to fix database schema issues
-- 
-- CRITICAL: This follows Apple-Level development standards
-- and implements enterprise-grade database design
-- =====================================================

-- =====================================================
-- PHASE 1: PROPERTY VIEWS TRACKING TABLE
-- =====================================================

-- Property Views Tracking Table (for analytics and user behavior)
CREATE TABLE IF NOT EXISTS property_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    
    -- View Details
    viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    session_id TEXT,
    user_agent TEXT,
    ip_address INET,
    
    -- Analytics Data
    view_duration INTEGER, -- seconds spent viewing
    source_page TEXT, -- where user came from
    device_type TEXT CHECK (device_type IN ('mobile', 'tablet', 'desktop')),
    
    -- Constraints
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique constraint to prevent duplicate views within 1 hour
CREATE UNIQUE INDEX IF NOT EXISTS idx_property_views_unique_hourly 
    ON property_views(user_id, property_id, date_trunc('hour', viewed_at));

-- =====================================================
-- PHASE 2: PAYMENTS TABLE
-- =====================================================

-- Payments Table (comprehensive payment tracking)
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Payment Identification
    reference TEXT UNIQUE NOT NULL,
    paystack_reference TEXT UNIQUE,
    
    -- Payment Details
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    currency TEXT NOT NULL DEFAULT 'GHS',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'success', 'failed', 'cancelled', 'refunded')),
    
    -- Payment Method Information
    payment_method TEXT,
    channel TEXT, -- 'card', 'mobile_money', 'bank_transfer'
    gateway_response JSONB,
    
    -- Business Context
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}',
    
    -- Audit Trail
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PHASE 3: SUBSCRIPTION PLANS TABLE (create first)
-- =====================================================

-- Create subscription_plans table first (no dependencies)
CREATE TABLE IF NOT EXISTS subscription_plans (
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

-- =====================================================
-- PHASE 4: USER SUBSCRIPTIONS TABLE (after plans)
-- =====================================================

-- User Subscriptions Table (for premium features)
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Subscription Details
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES subscription_plans(id) ON DELETE RESTRICT,

    -- Subscription Status
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'suspended')),

    -- Billing Information
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    cancelled_at TIMESTAMP WITH TIME ZONE,

    -- Payment Information
    payment_reference TEXT,
    last_payment_date TIMESTAMP WITH TIME ZONE,
    next_billing_date TIMESTAMP WITH TIME ZONE,

    -- Metadata
    subscription_metadata JSONB DEFAULT '{}',

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    UNIQUE(user_id, plan_id, current_period_start)
);

-- =====================================================
-- PHASE 5: PERFORMANCE INDEXES
-- =====================================================

-- Property Views Indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_property_views_user_property 
    ON property_views(user_id, property_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_property_views_property_date 
    ON property_views(property_id, viewed_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_property_views_session 
    ON property_views(session_id) WHERE session_id IS NOT NULL;

-- Payments Indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payments_user_id 
    ON payments(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payments_reference 
    ON payments(reference);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payments_status 
    ON payments(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payments_date 
    ON payments(transaction_date DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payments_user_status 
    ON payments(user_id, status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payments_metadata 
    ON payments USING GIN(metadata);

-- User Subscriptions Indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_subscriptions_user_status 
    ON user_subscriptions(user_id, status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_subscriptions_period 
    ON user_subscriptions(current_period_end) WHERE status = 'active';

-- =====================================================
-- PHASE 6: ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Property Views RLS
ALTER TABLE property_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own property views" ON property_views
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own property views" ON property_views
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Property owners can view their property views" ON property_views
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM properties 
            WHERE properties.id = property_views.property_id 
            AND properties.owner_id = auth.uid()
        )
    );

-- Payments RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payments" ON payments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payments" ON payments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Subscriptions RLS
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscriptions" ON user_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own subscriptions" ON user_subscriptions
    FOR ALL USING (auth.uid() = user_id);

-- Subscription Plans RLS (read-only for authenticated users)
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view subscription plans" ON subscription_plans
    FOR SELECT USING (auth.role() = 'authenticated');

-- =====================================================
-- PHASE 7: UPDATED_AT TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp (create if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers for new tables
CREATE TRIGGER update_payments_updated_at 
    BEFORE UPDATE ON payments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at 
    BEFORE UPDATE ON user_subscriptions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_plans_updated_at 
    BEFORE UPDATE ON subscription_plans 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- PHASE 8: SEED DATA FOR SUBSCRIPTION PLANS
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
        ARRAY['Unlimited properties', 'Custom analytics', '24/7 support', 'Premium listings', 'API access', 'White-label options'],
        true
    )
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- PHASE 9: TABLE COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE property_views IS 'Tracks property viewing analytics for business intelligence and user behavior analysis';
COMMENT ON TABLE payments IS 'Comprehensive payment transaction tracking with Paystack integration and audit trail';
COMMENT ON TABLE user_subscriptions IS 'User subscription management for premium features and billing cycles';
COMMENT ON TABLE subscription_plans IS 'Available subscription plans for property owners with features and pricing';

COMMENT ON COLUMN payments.metadata IS 'Additional payment context and business data in JSON format';
COMMENT ON COLUMN user_subscriptions.subscription_metadata IS 'Subscription-specific configuration and preferences';
COMMENT ON COLUMN property_views.view_duration IS 'Time spent viewing property in seconds for engagement analytics';

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- All missing tables have been created with enterprise-grade standards
-- Next step: Regenerate Supabase types to fix TypeScript errors
-- =====================================================
