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
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_notifications_updated_at'
  ) THEN
    CREATE TRIGGER update_notifications_updated_at
      BEFORE UPDATE ON notifications
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_subscription_plans_updated_at'
  ) THEN
    CREATE TRIGGER update_subscription_plans_updated_at
      BEFORE UPDATE ON subscription_plans
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END$$;

-- =====================================================
-- PHASE 6: ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on new tables
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

-- Notifications policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Subscription plans policies (read-only for all authenticated users)
DROP POLICY IF EXISTS "Authenticated users can view subscription plans" ON subscription_plans;
CREATE POLICY "Authenticated users can view subscription plans" ON subscription_plans
    FOR SELECT USING (auth.role() = 'authenticated');

-- =====================================================
-- PHASE 7: MISSING TABLES FOR TYPESCRIPT COMPATIBILITY
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

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hour bucket column for 1-hour uniqueness on property views
ALTER TABLE property_views
ADD COLUMN IF NOT EXISTS viewed_hour_epoch BIGINT;

-- Trigger function to maintain viewed_hour_epoch (avoids IMMUTABLE requirement on generated columns)
CREATE OR REPLACE FUNCTION set_property_views_hour_bucket()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.viewed_hour_epoch := (extract(epoch FROM NEW.viewed_at)::bigint) / 3600;
  RETURN NEW;
END;
$$;

-- Create trigger if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_property_views_hour_bucket_trg'
  ) THEN
    CREATE TRIGGER set_property_views_hour_bucket_trg
      BEFORE INSERT OR UPDATE OF viewed_at ON property_views
      FOR EACH ROW EXECUTE FUNCTION set_property_views_hour_bucket();
  END IF;
END$$;

-- Backfill existing rows
UPDATE property_views
SET viewed_hour_epoch = (extract(epoch FROM viewed_at)::bigint) / 3600
WHERE viewed_hour_epoch IS NULL;


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
-- PHASE 8: ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Property Views RLS
ALTER TABLE property_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own property views" ON property_views;
CREATE POLICY "Users can view their own property views" ON property_views
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own property views" ON property_views;
CREATE POLICY "Users can insert their own property views" ON property_views
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Property owners can view their property views" ON property_views;
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

DROP POLICY IF EXISTS "Users can view their own payments" ON payments;
CREATE POLICY "Users can view their own payments" ON payments
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own payments" ON payments;
CREATE POLICY "Users can insert their own payments" ON payments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Subscriptions RLS
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own subscriptions" ON user_subscriptions;
CREATE POLICY "Users can view their own subscriptions" ON user_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own subscriptions" ON user_subscriptions;
CREATE POLICY "Users can manage their own subscriptions" ON user_subscriptions
    FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- PHASE 9: PERFORMANCE INDEXES
-- =====================================================

-- Property Views Indexes
-- Note: CONCURRENTLY not supported in Supabase CLI pipeline; using standard CREATE INDEX
CREATE INDEX IF NOT EXISTS idx_property_views_user_property
    ON property_views(user_id, property_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_property_views_user_property_hour
    ON property_views (user_id, property_id, viewed_hour_epoch);
CREATE INDEX IF NOT EXISTS idx_property_views_property_date
    ON property_views(property_id, viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_property_views_session
    ON property_views(session_id) WHERE session_id IS NOT NULL;

-- Payments Indexes
CREATE INDEX IF NOT EXISTS idx_payments_user_status
    ON payments(user_id, status);
CREATE INDEX IF NOT EXISTS idx_payments_date_status
    ON payments(transaction_date DESC, status);
CREATE INDEX IF NOT EXISTS idx_payments_metadata
    ON payments USING GIN(metadata);

-- User Subscriptions Indexes
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_status
    ON user_subscriptions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_period
    ON user_subscriptions(current_period_end) WHERE status = 'active';

-- =====================================================
-- PHASE 10: TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Add updated_at triggers for new tables (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_payments_updated_at'
  ) THEN
    CREATE TRIGGER update_payments_updated_at
      BEFORE UPDATE ON payments
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_subscriptions_updated_at'
  ) THEN
    CREATE TRIGGER update_user_subscriptions_updated_at
      BEFORE UPDATE ON user_subscriptions
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END$$;

-- =====================================================
-- PHASE 11: COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE notifications IS 'User notifications for the ROOMi platform';
COMMENT ON TABLE subscription_plans IS 'Available subscription plans for property owners';
COMMENT ON TABLE property_views IS 'Tracks property viewing analytics for business intelligence';
COMMENT ON TABLE payments IS 'Comprehensive payment transaction tracking with Paystack integration';
COMMENT ON TABLE user_subscriptions IS 'User subscription management for premium features';

COMMENT ON COLUMN properties.base_price_per_semester IS 'Semester-based pricing for student housing';
COMMENT ON COLUMN properties.currency IS 'Currency code for property pricing (ISO 4217)';
COMMENT ON COLUMN payments.metadata IS 'Additional payment context and business data';
COMMENT ON COLUMN user_subscriptions.subscription_metadata IS 'Subscription-specific configuration and preferences';
