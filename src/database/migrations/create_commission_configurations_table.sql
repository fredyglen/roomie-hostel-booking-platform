-- ============================================================================
-- COMMISSION CONFIGURATIONS TABLE - BE CONSCIOUS COMPLIANCE
-- ============================================================================
-- 
-- Purpose: Store real-time commission configuration with audit trail
-- Features: Version control, change tracking, real-time updates
-- Compliance: BE CONSCIOUS Apple-Grade standards with zero tolerance
-- 
-- Table: commission_configurations
-- Description: Centralized storage for all commission rates and fees
-- ============================================================================

-- Create commission_configurations table
CREATE TABLE IF NOT EXISTS commission_configurations (
  -- Primary identification
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Commission rates (stored as decimals, e.g., 0.05 for 5%)
  platform_rate DECIMAL(5,4) NOT NULL CHECK (platform_rate >= 0 AND platform_rate <= 1),
  agent_rate DECIMAL(5,4) NOT NULL CHECK (agent_rate >= 0 AND agent_rate <= 1),
  paystack_rate DECIMAL(5,4) NOT NULL CHECK (paystack_rate >= 0 AND paystack_rate <= 1),
  vat_rate DECIMAL(5,4) NOT NULL CHECK (vat_rate >= 0 AND vat_rate <= 1),
  
  -- Platform fees (stored in base currency units)
  platform_fixed_fee DECIMAL(10,2) NOT NULL CHECK (platform_fixed_fee >= 0),
  agent_minimum_fee DECIMAL(10,2) NOT NULL CHECK (agent_minimum_fee >= 0),
  
  -- Configuration metadata
  currency VARCHAR(3) NOT NULL DEFAULT 'GHS',
  version VARCHAR(20) NOT NULL,
  environment VARCHAR(20) NOT NULL DEFAULT 'production',
  
  -- Status and activation
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  -- Change tracking
  change_event JSONB NULL, -- Stores ConfigurationChangeEvent data
  changed_by VARCHAR(255) NULL,
  change_reason TEXT NULL,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Index for active configuration lookup (most common query)
CREATE INDEX IF NOT EXISTS idx_commission_config_active 
ON commission_configurations (is_active, created_at DESC) 
WHERE is_active = true;

-- Index for version tracking
CREATE INDEX IF NOT EXISTS idx_commission_config_version 
ON commission_configurations (version);

-- Index for environment-specific configurations
CREATE INDEX IF NOT EXISTS idx_commission_config_environment 
ON commission_configurations (environment, is_active);

-- Index for change tracking and audit
CREATE INDEX IF NOT EXISTS idx_commission_config_changes 
ON commission_configurations (changed_by, created_at);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS for secure access
ALTER TABLE commission_configurations ENABLE ROW LEVEL SECURITY;

-- Policy: Admin users can read all configurations
CREATE POLICY "Admin users can read commission configurations" 
ON commission_configurations FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'supreme_admin')
  )
);

-- Policy: Admin users can insert new configurations
CREATE POLICY "Admin users can insert commission configurations" 
ON commission_configurations FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'supreme_admin')
  )
);

-- Policy: Admin users can update configurations (for deactivation)
CREATE POLICY "Admin users can update commission configurations" 
ON commission_configurations FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'supreme_admin')
  )
);

-- Policy: System can read active configurations (for application use)
CREATE POLICY "System can read active commission configurations" 
ON commission_configurations FOR SELECT 
USING (is_active = true);

-- ============================================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ============================================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_commission_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER trigger_commission_config_updated_at
  BEFORE UPDATE ON commission_configurations
  FOR EACH ROW
  EXECUTE FUNCTION update_commission_config_updated_at();

-- ============================================================================
-- INITIAL DATA INSERTION
-- ============================================================================

-- Insert initial commission configuration (BE CONSCIOUS compliant rates)
INSERT INTO commission_configurations (
  platform_rate,
  agent_rate,
  paystack_rate,
  vat_rate,
  platform_fixed_fee,
  agent_minimum_fee,
  currency,
  version,
  environment,
  is_active,
  change_reason,
  changed_by
) VALUES (
  0.05,    -- 5% platform commission (CONFIRMED)
  0.037,   -- 3.7% agent commission (CONFIRMED)
  0.0195,  -- 1.95% Paystack fee (Standard rate)
  0.125,   -- 12.5% VAT (Ghana standard)
  100.00,  -- 100 GHS platform fixed fee (CONFIRMED)
  100.00,  -- 100 GHS agent minimum fee (CONFIRMED)
  'GHS',   -- Ghana Cedis
  '2.1.0', -- Initial version
  'production',
  true,
  'Initial commission configuration setup following BE CONSCIOUS standards',
  'system_initialization'
) ON CONFLICT DO NOTHING;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE commission_configurations IS 
'Centralized commission configuration storage with real-time updates and audit trail. Follows BE CONSCIOUS Apple-Grade standards.';

COMMENT ON COLUMN commission_configurations.platform_rate IS 
'Platform commission rate as decimal (e.g., 0.05 for 5%). Current: 5%';

COMMENT ON COLUMN commission_configurations.agent_rate IS 
'Agent commission rate as decimal (e.g., 0.037 for 3.7%). Current: 3.7%';

COMMENT ON COLUMN commission_configurations.is_active IS 
'Only one configuration should be active at a time. Used for version control.';

COMMENT ON COLUMN commission_configurations.change_event IS 
'JSON storage of ConfigurationChangeEvent for complete audit trail';

-- ============================================================================
-- VERIFICATION QUERY
-- ============================================================================

-- Query to verify the table was created successfully
-- SELECT 
--   platform_rate * 100 as platform_percentage,
--   agent_rate * 100 as agent_percentage,
--   platform_fixed_fee,
--   version,
--   is_active,
--   created_at
-- FROM commission_configurations 
-- WHERE is_active = true
-- ORDER BY created_at DESC
-- LIMIT 1;
