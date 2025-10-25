-- Repair script: drop duplicate policies so migrations can recreate them idempotently
-- Safe to run multiple times

-- Notifications
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;

-- Subscription plans
DROP POLICY IF EXISTS "Authenticated users can view subscription plans" ON subscription_plans;

-- Property views
DROP POLICY IF EXISTS "Users can view their own property views" ON property_views;
DROP POLICY IF EXISTS "Users can insert their own property views" ON property_views;
DROP POLICY IF EXISTS "Property owners can view their property views" ON property_views;

-- Payments
DROP POLICY IF EXISTS "Users can view their own payments" ON payments;
DROP POLICY IF EXISTS "Users can insert their own payments" ON payments;

-- User subscriptions
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON user_subscriptions;
DROP POLICY IF EXISTS "Users can manage their own subscriptions" ON user_subscriptions;

