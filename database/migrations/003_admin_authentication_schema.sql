-- ============================================================================
-- ADMIN AUTHENTICATION & ROLE MANAGEMENT SCHEMA
-- ============================================================================
-- 
-- Business Purpose: Database schema for ROOMi admin authentication system
-- supporting Supreme and Campus admin roles with jurisdiction management
-- 
-- Technical Implementation: Extends existing profiles table and creates
-- admin-specific tables for role management, permissions, and audit logging
-- 
-- Compliance: BE CONSCIOUS Apple-Grade Standards with comprehensive RLS
-- 
-- Author: ROOMi Platform Team
-- Version: 2.0.0
-- Date: 2025-01-08
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- ADMIN ROLES TABLE
-- ============================================================================

/**
 * Admin roles configuration table
 * Stores role definitions, permissions, and features for admin users
 */
CREATE TABLE IF NOT EXISTS admin_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Role Configuration
  role_type TEXT NOT NULL UNIQUE CHECK (role_type IN ('supreme_admin', 'campus_admin')),
  role_name TEXT NOT NULL,
  role_description TEXT,
  
  -- Permissions and Features
  permissions TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  features TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  
  -- Jurisdiction Configuration
  jurisdiction_scope TEXT NOT NULL CHECK (jurisdiction_scope IN ('global', 'country', 'campus')),
  international_access BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Status and Metadata
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_permissions CHECK (array_length(permissions, 1) > 0),
  CONSTRAINT valid_features CHECK (array_length(features, 1) > 0)
);

-- ============================================================================
-- ADMIN JURISDICTIONS TABLE
-- ============================================================================

/**
 * Admin jurisdiction assignments
 * Maps admin users to their specific campus/country jurisdictions
 */
CREATE TABLE IF NOT EXISTS admin_jurisdictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Admin User Reference
  admin_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Jurisdiction Details
  jurisdiction_type TEXT NOT NULL CHECK (jurisdiction_type IN ('campus', 'country')),
  jurisdiction_code TEXT NOT NULL, -- Campus code (e.g., 'upsa-accra') or country code (e.g., 'GH')
  jurisdiction_name TEXT NOT NULL,
  
  -- Assignment Details
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(admin_user_id, jurisdiction_type, jurisdiction_code)
);

-- ============================================================================
-- ADMIN SESSIONS TABLE
-- ============================================================================

/**
 * Admin session tracking for security and audit
 * Tracks admin login sessions with enhanced security monitoring
 */
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Session Details
  admin_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  
  -- Authentication Details
  admin_role TEXT NOT NULL,
  permissions TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  jurisdiction_data JSONB DEFAULT '{}',
  
  -- Session Lifecycle
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  
  -- Security Tracking
  ip_address INET,
  user_agent TEXT,
  login_method TEXT DEFAULT 'password',
  
  -- Session Termination
  terminated_at TIMESTAMPTZ,
  termination_reason TEXT,
  
  -- Constraints
  CONSTRAINT valid_expiry CHECK (expires_at > created_at),
  CONSTRAINT valid_termination CHECK (
    (terminated_at IS NULL AND termination_reason IS NULL) OR
    (terminated_at IS NOT NULL AND termination_reason IS NOT NULL)
  )
);

-- ============================================================================
-- ADMIN AUDIT LOG TABLE
-- ============================================================================

/**
 * Comprehensive audit logging for admin actions
 * Tracks all admin activities for compliance and security
 */
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Actor Information
  admin_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  admin_role TEXT NOT NULL,
  session_id UUID REFERENCES admin_sessions(id) ON DELETE SET NULL,
  
  -- Action Details
  action_type TEXT NOT NULL, -- 'create', 'read', 'update', 'delete', 'approve', 'reject'
  resource_type TEXT NOT NULL, -- 'property', 'user', 'booking', 'setting'
  resource_id TEXT, -- ID of the affected resource
  
  -- Action Context
  action_description TEXT NOT NULL,
  action_data JSONB DEFAULT '{}',
  
  -- Request Context
  ip_address INET,
  user_agent TEXT,
  request_id TEXT,
  
  -- Timing
  performed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Result
  success BOOLEAN NOT NULL DEFAULT TRUE,
  error_message TEXT,
  
  -- Compliance
  compliance_flags TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Constraints
  CONSTRAINT valid_action_type CHECK (action_type IN (
    'create', 'read', 'update', 'delete', 'approve', 'reject', 
    'login', 'logout', 'permission_check', 'system_config'
  )),
  CONSTRAINT valid_resource_type CHECK (resource_type IN (
    'property', 'user', 'booking', 'setting', 'system', 'session', 'audit'
  ))
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Admin roles indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_admin_roles_type 
ON admin_roles(role_type) WHERE is_active = true;

-- Admin jurisdictions indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_admin_jurisdictions_user 
ON admin_jurisdictions(admin_user_id) WHERE is_active = true;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_admin_jurisdictions_type_code 
ON admin_jurisdictions(jurisdiction_type, jurisdiction_code) WHERE is_active = true;

-- Admin sessions indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_admin_sessions_user_active 
ON admin_sessions(admin_user_id, is_active, expires_at);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_admin_sessions_token 
ON admin_sessions(session_token) WHERE is_active = true;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_admin_sessions_expiry 
ON admin_sessions(expires_at) WHERE is_active = true;

-- Admin audit log indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_admin_audit_user_time 
ON admin_audit_log(admin_user_id, performed_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_admin_audit_resource 
ON admin_audit_log(resource_type, resource_id, performed_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_admin_audit_action_time 
ON admin_audit_log(action_type, performed_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all admin tables
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_jurisdictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Admin roles policies (read-only for authenticated users)
CREATE POLICY "Authenticated users can read admin roles" 
ON admin_roles FOR SELECT 
TO authenticated 
USING (is_active = true);

-- Admin jurisdictions policies
CREATE POLICY "Admins can read their own jurisdictions" 
ON admin_jurisdictions FOR SELECT 
TO authenticated 
USING (
  admin_user_id = auth.uid() OR
  auth.jwt() ->> 'role' = 'supreme_admin'
);

CREATE POLICY "Supreme admins can manage all jurisdictions" 
ON admin_jurisdictions FOR ALL 
TO authenticated 
USING (auth.jwt() ->> 'role' = 'supreme_admin');

-- Admin sessions policies
CREATE POLICY "Admins can read their own sessions" 
ON admin_sessions FOR SELECT 
TO authenticated 
USING (
  admin_user_id = auth.uid() OR
  auth.jwt() ->> 'role' = 'supreme_admin'
);

CREATE POLICY "System can manage admin sessions" 
ON admin_sessions FOR ALL 
TO service_role 
USING (true);

-- Admin audit log policies
CREATE POLICY "Admins can read relevant audit logs" 
ON admin_audit_log FOR SELECT 
TO authenticated 
USING (
  admin_user_id = auth.uid() OR
  auth.jwt() ->> 'role' = 'supreme_admin' OR
  (auth.jwt() ->> 'role' = 'campus_admin' AND 
   resource_type IN ('property', 'user', 'booking'))
);

CREATE POLICY "System can write audit logs" 
ON admin_audit_log FOR INSERT 
TO service_role 
WITH CHECK (true);

-- ============================================================================
-- INITIAL DATA SEEDING
-- ============================================================================

-- Insert default admin roles
INSERT INTO admin_roles (
  role_type, 
  role_name, 
  role_description, 
  permissions, 
  features, 
  jurisdiction_scope, 
  international_access
) VALUES 
(
  'supreme_admin',
  'Supreme Administrator',
  'Global platform administrator with full access to all features and data',
  ARRAY[
    'global.read', 'global.write', 'global.delete',
    'countries.manage', 'campuses.manage', 'users.manage',
    'settings.global', 'analytics.global', 'audit.access',
    'revenue.global', 'system.configure'
  ],
  ARRAY[
    'global_dashboard', 'country_management', 'campus_oversight',
    'financial_reporting', 'system_configuration', 'user_management',
    'audit_access', 'revenue_analytics'
  ],
  'global',
  true
),
(
  'campus_admin',
  'Campus Administrator',
  'Campus-specific administrator for property approval and student verification',
  ARRAY[
    'campus.read', 'campus.write', 'properties.approve',
    'students.verify', 'analytics.campus', 'disputes.resolve',
    'bookings.manage', 'revenue.campus'
  ],
  ARRAY[
    'campus_dashboard', 'property_approval', 'student_verification',
    'campus_analytics', 'local_disputes', 'campus_settings',
    'booking_oversight', 'local_revenue'
  ],
  'campus',
  false
)
ON CONFLICT (role_type) DO UPDATE SET
  role_name = EXCLUDED.role_name,
  role_description = EXCLUDED.role_description,
  permissions = EXCLUDED.permissions,
  features = EXCLUDED.features,
  jurisdiction_scope = EXCLUDED.jurisdiction_scope,
  international_access = EXCLUDED.international_access,
  updated_at = NOW();

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_admin_roles_updated_at 
  BEFORE UPDATE ON admin_roles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_jurisdictions_updated_at 
  BEFORE UPDATE ON admin_jurisdictions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to log admin actions
CREATE OR REPLACE FUNCTION log_admin_action(
  p_admin_user_id UUID,
  p_admin_role TEXT,
  p_session_id UUID,
  p_action_type TEXT,
  p_resource_type TEXT,
  p_resource_id TEXT,
  p_action_description TEXT,
  p_action_data JSONB DEFAULT '{}',
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  audit_id UUID;
BEGIN
  INSERT INTO admin_audit_log (
    admin_user_id, admin_role, session_id, action_type, resource_type,
    resource_id, action_description, action_data, ip_address, user_agent
  ) VALUES (
    p_admin_user_id, p_admin_role, p_session_id, p_action_type, p_resource_type,
    p_resource_id, p_action_description, p_action_data, p_ip_address, p_user_agent
  ) RETURNING id INTO audit_id;
  
  RETURN audit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- SCHEMA VALIDATION
-- ============================================================================

-- Verify all tables were created successfully
DO $$
DECLARE
  table_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO table_count 
  FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name IN ('admin_roles', 'admin_jurisdictions', 'admin_sessions', 'admin_audit_log');
  
  IF table_count != 4 THEN
    RAISE EXCEPTION 'Admin authentication schema creation failed. Expected 4 tables, found %', table_count;
  END IF;
  
  RAISE NOTICE 'Admin authentication schema created successfully with % tables', table_count;
END $$;
