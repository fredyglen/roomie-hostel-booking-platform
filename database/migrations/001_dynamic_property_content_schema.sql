-- ============================================================================
-- ROOMi Platform: Dynamic Property Content Schema Enhancement
-- Apple-Grade Database Design Following BE CONSCIOUS Standards
-- ============================================================================
-- Migration: 001_dynamic_property_content_schema
-- Date: 2025-01-08
-- Purpose: Eliminate hardcoded values and enable owner-managed property content
-- Compliance: Zero tolerance for hardcoded values, Apple-grade constraints
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis" IF NOT EXISTS;

-- ============================================================================
-- AMENITIES REFERENCE SYSTEM
-- ============================================================================

-- Amenities categories for organization and filtering
CREATE TABLE amenity_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE CHECK (char_length(name) BETWEEN 2 AND 50),
    description TEXT CHECK (char_length(description) <= 200),
    icon_name TEXT NOT NULL CHECK (char_length(icon_name) BETWEEN 2 AND 50),
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Audit fields
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

-- Master amenities reference table
CREATE TABLE amenities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL CHECK (char_length(name) BETWEEN 2 AND 100),
    description TEXT CHECK (char_length(description) <= 500),
    category_id UUID NOT NULL REFERENCES amenity_categories(id) ON DELETE RESTRICT,
    icon_name TEXT NOT NULL CHECK (char_length(icon_name) BETWEEN 2 AND 50),
    is_premium BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INTEGER NOT NULL DEFAULT 0,
    
    -- Business rules
    requires_verification BOOLEAN NOT NULL DEFAULT FALSE,
    affects_pricing BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Audit fields
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    
    -- Constraints
    UNIQUE(name, category_id)
);

-- ============================================================================
-- HOUSE RULES SYSTEM
-- ============================================================================

-- House rules categories
CREATE TABLE rule_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE CHECK (char_length(name) BETWEEN 2 AND 50),
    description TEXT CHECK (char_length(description) <= 200),
    icon_name TEXT NOT NULL CHECK (char_length(icon_name) BETWEEN 2 AND 50),
    is_mandatory BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INTEGER NOT NULL DEFAULT 0,
    
    -- Audit fields
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Master house rules reference
CREATE TABLE house_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL CHECK (char_length(title) BETWEEN 5 AND 100),
    description TEXT NOT NULL CHECK (char_length(description) BETWEEN 10 AND 500),
    category_id UUID NOT NULL REFERENCES rule_categories(id) ON DELETE RESTRICT,
    icon_name TEXT NOT NULL CHECK (char_length(icon_name) BETWEEN 2 AND 50),
    severity_level TEXT NOT NULL CHECK (severity_level IN ('info', 'warning', 'strict', 'critical')),
    is_customizable BOOLEAN NOT NULL DEFAULT TRUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Audit fields
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(title, category_id)
);

-- ============================================================================
-- PROPERTY DYNAMIC CONTENT SYSTEM
-- ============================================================================

-- Main property content table - owner-managed dynamic content
CREATE TABLE property_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    
    -- About Section (Rich Content)
    about_title TEXT CHECK (char_length(about_title) BETWEEN 5 AND 100),
    about_description TEXT NOT NULL CHECK (char_length(about_description) BETWEEN 50 AND 2000),
    about_highlights TEXT[] DEFAULT ARRAY[]::TEXT[],
    
    -- Location Details
    location_description TEXT CHECK (char_length(location_description) <= 1000),
    nearby_landmarks JSONB DEFAULT '[]'::JSONB,
    transportation_info JSONB DEFAULT '{}'::JSONB,
    distance_to_campus_meters INTEGER CHECK (distance_to_campus_meters > 0),
    
    -- Contact Information (Behind Paywall)
    contact_visible_after_payment BOOLEAN NOT NULL DEFAULT TRUE,
    emergency_contact JSONB DEFAULT '{}'::JSONB,
    
    -- Content Status
    content_status TEXT NOT NULL DEFAULT 'draft' CHECK (content_status IN ('draft', 'review', 'published', 'archived')),
    last_reviewed_at TIMESTAMPTZ,
    reviewed_by UUID,
    
    -- Version Control
    version INTEGER NOT NULL DEFAULT 1,
    
    -- Audit fields
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL,
    updated_by UUID NOT NULL,
    
    -- Constraints
    UNIQUE(property_id),
    
    -- JSON Schema Validation
    CONSTRAINT valid_nearby_landmarks CHECK (
        jsonb_typeof(nearby_landmarks) = 'array'
    ),
    CONSTRAINT valid_transportation_info CHECK (
        jsonb_typeof(transportation_info) = 'object'
    ),
    CONSTRAINT valid_emergency_contact CHECK (
        jsonb_typeof(emergency_contact) = 'object'
    )
);

-- Property amenities junction table (owner-selected)
CREATE TABLE property_amenities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    amenity_id UUID NOT NULL REFERENCES amenities(id) ON DELETE RESTRICT,
    
    -- Owner customization
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    custom_description TEXT CHECK (char_length(custom_description) <= 200),
    additional_cost DECIMAL(10, 2) DEFAULT 0 CHECK (additional_cost >= 0),
    
    -- Verification
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    verified_at TIMESTAMPTZ,
    verified_by UUID,
    
    -- Audit fields
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL,
    updated_by UUID NOT NULL,
    
    -- Constraints
    UNIQUE(property_id, amenity_id)
);

-- Property house rules junction table (owner-selected)
CREATE TABLE property_house_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    house_rule_id UUID NOT NULL REFERENCES house_rules(id) ON DELETE RESTRICT,
    
    -- Owner customization
    custom_description TEXT CHECK (char_length(custom_description) <= 500),
    is_strictly_enforced BOOLEAN NOT NULL DEFAULT TRUE,
    penalty_description TEXT CHECK (char_length(penalty_description) <= 200),
    
    -- Audit fields
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL,
    updated_by UUID NOT NULL,
    
    -- Constraints
    UNIQUE(property_id, house_rule_id)
);

-- ============================================================================
-- THINGS TO CONSIDER SYSTEM (New Feature)
-- ============================================================================

-- Categories for things to consider
CREATE TABLE consideration_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE CHECK (char_length(name) BETWEEN 2 AND 50),
    description TEXT CHECK (char_length(description) <= 200),
    icon_name TEXT NOT NULL CHECK (char_length(icon_name) BETWEEN 2 AND 50),
    severity_level TEXT NOT NULL CHECK (severity_level IN ('info', 'warning', 'important', 'critical')),
    display_order INTEGER NOT NULL DEFAULT 0,
    
    -- Audit fields
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Property-specific things to consider (owner-provided transparency)
CREATE TABLE property_considerations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES consideration_categories(id) ON DELETE RESTRICT,
    
    -- Content
    title TEXT NOT NULL CHECK (char_length(title) BETWEEN 5 AND 100),
    description TEXT NOT NULL CHECK (char_length(description) BETWEEN 10 AND 500),
    severity_level TEXT NOT NULL CHECK (severity_level IN ('info', 'warning', 'important', 'critical')),
    icon_name TEXT NOT NULL CHECK (char_length(icon_name) BETWEEN 2 AND 50),
    
    -- Visibility and Impact
    affects_booking BOOLEAN NOT NULL DEFAULT FALSE,
    requires_acknowledgment BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Audit fields
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL,
    updated_by UUID NOT NULL
);

-- ============================================================================
-- PROPERTY MEDIA MANAGEMENT
-- ============================================================================

-- Enhanced property media table
CREATE TABLE property_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    
    -- File Information
    file_name TEXT NOT NULL CHECK (char_length(file_name) BETWEEN 1 AND 255),
    file_path TEXT NOT NULL CHECK (char_length(file_path) BETWEEN 1 AND 500),
    file_size_bytes BIGINT NOT NULL CHECK (file_size_bytes > 0),
    mime_type TEXT NOT NULL CHECK (char_length(mime_type) BETWEEN 3 AND 100),
    
    -- Media Type and Purpose
    media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video', 'virtual_tour', 'document')),
    purpose TEXT NOT NULL CHECK (purpose IN ('cover', 'gallery', 'room', 'amenity', 'exterior', 'common_area')),
    
    -- Display Properties
    title TEXT CHECK (char_length(title) <= 100),
    description TEXT CHECK (char_length(description) <= 300),
    alt_text TEXT CHECK (char_length(alt_text) <= 200),
    display_order INTEGER NOT NULL DEFAULT 0,
    is_cover BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Processing Status
    processing_status TEXT NOT NULL DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
    thumbnail_path TEXT,
    optimized_path TEXT,
    
    -- Verification and Moderation
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    moderation_status TEXT NOT NULL DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected', 'flagged')),
    moderation_notes TEXT,
    verified_at TIMESTAMPTZ,
    verified_by UUID,
    
    -- Audit fields
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL,
    updated_by UUID NOT NULL,
    
    -- Constraints
    UNIQUE(property_id, file_path)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Property content indexes
CREATE INDEX CONCURRENTLY idx_property_content_property_id ON property_content(property_id);
CREATE INDEX CONCURRENTLY idx_property_content_status ON property_content(content_status) WHERE content_status = 'published';
CREATE INDEX CONCURRENTLY idx_property_content_updated_at ON property_content(updated_at DESC);

-- Property amenities indexes
CREATE INDEX CONCURRENTLY idx_property_amenities_property_id ON property_amenities(property_id);
CREATE INDEX CONCURRENTLY idx_property_amenities_amenity_id ON property_amenities(amenity_id);
CREATE INDEX CONCURRENTLY idx_property_amenities_available ON property_amenities(property_id, is_available) WHERE is_available = TRUE;

-- Property house rules indexes
CREATE INDEX CONCURRENTLY idx_property_house_rules_property_id ON property_house_rules(property_id);
CREATE INDEX CONCURRENTLY idx_property_house_rules_rule_id ON property_house_rules(house_rule_id);

-- Property considerations indexes
CREATE INDEX CONCURRENTLY idx_property_considerations_property_id ON property_considerations(property_id);
CREATE INDEX CONCURRENTLY idx_property_considerations_category ON property_considerations(category_id);
CREATE INDEX CONCURRENTLY idx_property_considerations_active ON property_considerations(property_id, is_active) WHERE is_active = TRUE;

-- Property media indexes
CREATE INDEX CONCURRENTLY idx_property_media_property_id ON property_media(property_id);
CREATE INDEX CONCURRENTLY idx_property_media_type ON property_media(property_id, media_type);
CREATE INDEX CONCURRENTLY idx_property_media_cover ON property_media(property_id, is_cover) WHERE is_cover = TRUE;
CREATE INDEX CONCURRENTLY idx_property_media_verified ON property_media(property_id, is_verified) WHERE is_verified = TRUE;

-- Reference table indexes
CREATE INDEX CONCURRENTLY idx_amenities_category ON amenities(category_id, is_active) WHERE is_active = TRUE;
CREATE INDEX CONCURRENTLY idx_amenities_active ON amenities(is_active, display_order) WHERE is_active = TRUE;
CREATE INDEX CONCURRENTLY idx_house_rules_category ON house_rules(category_id, is_active) WHERE is_active = TRUE;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE property_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_house_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_considerations ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_media ENABLE ROW LEVEL SECURITY;

-- Property content policies
CREATE POLICY property_content_owner_policy ON property_content
    FOR ALL USING (
        property_id IN (
            SELECT id FROM properties WHERE owner_id = current_user_id()
        ) OR has_permission(current_user_id(), 'admin')
    );

CREATE POLICY property_content_public_read ON property_content
    FOR SELECT USING (content_status = 'published');

-- Property amenities policies
CREATE POLICY property_amenities_owner_policy ON property_amenities
    FOR ALL USING (
        property_id IN (
            SELECT id FROM properties WHERE owner_id = current_user_id()
        ) OR has_permission(current_user_id(), 'admin')
    );

CREATE POLICY property_amenities_public_read ON property_amenities
    FOR SELECT USING (is_available = TRUE);

-- Property house rules policies
CREATE POLICY property_house_rules_owner_policy ON property_house_rules
    FOR ALL USING (
        property_id IN (
            SELECT id FROM properties WHERE owner_id = current_user_id()
        ) OR has_permission(current_user_id(), 'admin')
    );

CREATE POLICY property_house_rules_public_read ON property_house_rules
    FOR SELECT USING (TRUE);

-- Property considerations policies
CREATE POLICY property_considerations_owner_policy ON property_considerations
    FOR ALL USING (
        property_id IN (
            SELECT id FROM properties WHERE owner_id = current_user_id()
        ) OR has_permission(current_user_id(), 'admin')
    );

CREATE POLICY property_considerations_public_read ON property_considerations
    FOR SELECT USING (is_active = TRUE);

-- Property media policies
CREATE POLICY property_media_owner_policy ON property_media
    FOR ALL USING (
        property_id IN (
            SELECT id FROM properties WHERE owner_id = current_user_id()
        ) OR has_permission(current_user_id(), 'admin')
    );

CREATE POLICY property_media_public_read ON property_media
    FOR SELECT USING (is_verified = TRUE AND moderation_status = 'approved');

-- ============================================================================
-- TRIGGERS FOR AUDIT AND AUTOMATION
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to all tables
CREATE TRIGGER update_property_content_updated_at BEFORE UPDATE ON property_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_property_amenities_updated_at BEFORE UPDATE ON property_amenities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_property_house_rules_updated_at BEFORE UPDATE ON property_house_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_property_considerations_updated_at BEFORE UPDATE ON property_considerations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_property_media_updated_at BEFORE UPDATE ON property_media
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE property_content IS 'Owner-managed dynamic property content replacing all hardcoded values';
COMMENT ON TABLE amenities IS 'Master amenities reference for consistent property features';
COMMENT ON TABLE house_rules IS 'Master house rules reference for property regulations';
COMMENT ON TABLE property_considerations IS 'Transparency section for property challenges and limitations';
COMMENT ON TABLE property_media IS 'Secure media management with verification and moderation';

COMMENT ON COLUMN property_content.about_description IS 'Rich description provided by property owner (50-2000 chars)';
COMMENT ON COLUMN property_content.contact_visible_after_payment IS 'Paywall protection for owner contact information';
COMMENT ON COLUMN property_considerations.affects_booking IS 'Whether this consideration impacts booking availability';
COMMENT ON COLUMN property_media.is_verified IS 'Admin verification status for media authenticity';

-- ============================================================================
-- SEED DATA FOR REFERENCE TABLES
-- ============================================================================

-- Amenity Categories Seed Data
INSERT INTO amenity_categories (id, name, description, icon_name, display_order) VALUES
(uuid_generate_v4(), 'Basic Utilities', 'Essential utilities and services', 'solar:home-2-bold', 1),
(uuid_generate_v4(), 'Security & Safety', 'Security features and safety measures', 'solar:shield-check-bold', 2),
(uuid_generate_v4(), 'Internet & Technology', 'Internet and technology amenities', 'solar:wifi-router-bold', 3),
(uuid_generate_v4(), 'Recreation & Entertainment', 'Entertainment and recreational facilities', 'solar:gameboy-bold', 4),
(uuid_generate_v4(), 'Study & Work', 'Study and work-related amenities', 'solar:book-2-bold', 5),
(uuid_generate_v4(), 'Kitchen & Dining', 'Kitchen and dining facilities', 'solar:chef-hat-bold', 6),
(uuid_generate_v4(), 'Transportation', 'Transportation and parking', 'solar:car-bold', 7),
(uuid_generate_v4(), 'Health & Wellness', 'Health and wellness facilities', 'solar:heart-bold', 8);

-- Common Ghana Hostel Amenities
INSERT INTO amenities (name, description, category_id, icon_name, is_premium, requires_verification, affects_pricing)
SELECT
    amenity_data.name,
    amenity_data.description,
    ac.id,
    amenity_data.icon_name,
    amenity_data.is_premium,
    amenity_data.requires_verification,
    amenity_data.affects_pricing
FROM (VALUES
    ('Water Supply', 'Reliable water supply throughout the day', 'Basic Utilities', 'solar:water-drop-bold', false, true, false),
    ('Electricity', '24/7 electricity supply', 'Basic Utilities', 'solar:lightning-bold', false, true, false),
    ('Generator Backup', 'Backup generator for power outages', 'Basic Utilities', 'solar:battery-charge-bold', true, true, true),
    ('Security Guard', '24/7 security guard on premises', 'Security & Safety', 'solar:user-check-bold', false, true, false),
    ('CCTV Security', 'CCTV surveillance system', 'Security & Safety', 'solar:videocamera-bold', true, true, true),
    ('WiFi Internet', 'High-speed wireless internet', 'Internet & Technology', 'solar:wifi-router-bold', false, false, false),
    ('Study Area', 'Dedicated quiet study space', 'Study & Work', 'solar:book-2-bold', false, false, false),
    ('Game Centre', 'Recreation and gaming area', 'Recreation & Entertainment', 'solar:gameboy-bold', true, false, true),
    ('Kitchen Access', 'Shared kitchen facilities', 'Kitchen & Dining', 'solar:chef-hat-bold', false, false, false),
    ('Parking Space', 'Designated parking area', 'Transportation', 'solar:car-bold', true, false, true),
    ('Laundry Service', 'On-site laundry facilities', 'Basic Utilities', 'solar:washing-machine-bold', true, false, true),
    ('Cleaning Service', 'Regular cleaning service', 'Basic Utilities', 'solar:broom-bold', true, false, true)
) AS amenity_data(name, description, category_name, icon_name, is_premium, requires_verification, affects_pricing)
JOIN amenity_categories ac ON ac.name = amenity_data.category_name;

-- House Rule Categories
INSERT INTO rule_categories (id, name, description, icon_name, is_mandatory, display_order) VALUES
(uuid_generate_v4(), 'Noise & Disturbance', 'Rules about noise levels and disturbances', 'solar:volume-loud-bold', true, 1),
(uuid_generate_v4(), 'Visitors & Guests', 'Rules about visitors and overnight guests', 'solar:users-group-two-rounded-bold', true, 2),
(uuid_generate_v4(), 'Cleanliness & Hygiene', 'Rules about maintaining cleanliness', 'solar:broom-bold', true, 3),
(uuid_generate_v4(), 'Safety & Security', 'Safety and security regulations', 'solar:shield-check-bold', true, 4),
(uuid_generate_v4(), 'Property Care', 'Rules about property maintenance and care', 'solar:home-2-bold', false, 5),
(uuid_generate_v4(), 'Behavior & Conduct', 'General behavior and conduct rules', 'solar:user-check-bold', false, 6);

-- Common House Rules
INSERT INTO house_rules (title, description, category_id, icon_name, severity_level, is_customizable)
SELECT
    rule_data.title,
    rule_data.description,
    rc.id,
    rule_data.icon_name,
    rule_data.severity_level,
    rule_data.is_customizable
FROM (VALUES
    ('No loud music after 10:00 PM', 'Maintain quiet hours to respect other residents', 'Noise & Disturbance', 'solar:volume-loud-bold', 'strict', true),
    ('No overnight guests without approval', 'Visitors must be approved by management', 'Visitors & Guests', 'solar:users-group-two-rounded-bold', 'warning', true),
    ('Keep common areas clean', 'Maintain cleanliness in shared spaces', 'Cleanliness & Hygiene', 'solar:broom-bold', 'info', false),
    ('No smoking inside premises', 'Smoking is prohibited inside the building', 'Safety & Security', 'solar:forbidden-2-bold', 'critical', false),
    ('Report maintenance issues promptly', 'Notify management of any maintenance needs', 'Property Care', 'solar:settings-bold', 'info', false),
    ('Respect other residents', 'Maintain respectful behavior towards others', 'Behavior & Conduct', 'solar:user-check-bold', 'warning', false),
    ('No alcohol consumption in common areas', 'Alcohol consumption restricted to private rooms', 'Behavior & Conduct', 'solar:cup-bold', 'warning', true),
    ('Lock doors and windows when leaving', 'Ensure security by locking up when absent', 'Safety & Security', 'solar:lock-bold', 'strict', false)
) AS rule_data(title, description, category_name, icon_name, severity_level, is_customizable)
JOIN rule_categories rc ON rc.name = rule_data.category_name;

-- Consideration Categories
INSERT INTO consideration_categories (id, name, description, icon_name, severity_level, display_order) VALUES
(uuid_generate_v4(), 'Infrastructure Limitations', 'Limitations in infrastructure and utilities', 'solar:settings-bold', 'warning', 1),
(uuid_generate_v4(), 'Location Challenges', 'Location-related challenges and considerations', 'solar:map-point-bold', 'info', 2),
(uuid_generate_v4(), 'Facility Restrictions', 'Restrictions on facility usage', 'solar:forbidden-2-bold', 'warning', 3),
(uuid_generate_v4(), 'Seasonal Issues', 'Seasonal or weather-related considerations', 'solar:cloud-rain-bold', 'info', 4),
(uuid_generate_v4(), 'Maintenance Concerns', 'Ongoing maintenance and upkeep issues', 'solar:hammer-bold', 'important', 5);

-- ============================================================================
-- HELPER FUNCTIONS FOR DYNAMIC CONTENT
-- ============================================================================

-- Function to get property content with all related data
CREATE OR REPLACE FUNCTION get_property_dynamic_content(p_property_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'content', (
            SELECT row_to_json(pc.*)
            FROM property_content pc
            WHERE pc.property_id = p_property_id
            AND pc.content_status = 'published'
        ),
        'amenities', (
            SELECT COALESCE(json_agg(
                json_build_object(
                    'id', pa.id,
                    'amenityId', pa.amenity_id,
                    'isAvailable', pa.is_available,
                    'customDescription', pa.custom_description,
                    'additionalCost', pa.additional_cost,
                    'amenity', json_build_object(
                        'name', a.name,
                        'description', a.description,
                        'iconName', a.icon_name,
                        'isPremium', a.is_premium
                    )
                )
            ), '[]'::json)
            FROM property_amenities pa
            JOIN amenities a ON a.id = pa.amenity_id
            WHERE pa.property_id = p_property_id
            AND pa.is_available = true
            AND a.is_active = true
        ),
        'houseRules', (
            SELECT COALESCE(json_agg(
                json_build_object(
                    'id', phr.id,
                    'houseRuleId', phr.house_rule_id,
                    'customDescription', phr.custom_description,
                    'isStrictlyEnforced', phr.is_strictly_enforced,
                    'houseRule', json_build_object(
                        'title', hr.title,
                        'description', hr.description,
                        'iconName', hr.icon_name,
                        'severityLevel', hr.severity_level
                    )
                )
            ), '[]'::json)
            FROM property_house_rules phr
            JOIN house_rules hr ON hr.id = phr.house_rule_id
            WHERE phr.property_id = p_property_id
            AND hr.is_active = true
        ),
        'considerations', (
            SELECT COALESCE(json_agg(
                json_build_object(
                    'id', pc.id,
                    'title', pc.title,
                    'description', pc.description,
                    'severityLevel', pc.severity_level,
                    'iconName', pc.icon_name,
                    'affectsBooking', pc.affects_booking,
                    'requiresAcknowledgment', pc.requires_acknowledgment
                )
            ), '[]'::json)
            FROM property_considerations pc
            WHERE pc.property_id = p_property_id
            AND pc.is_active = true
            ORDER BY pc.display_order, pc.severity_level DESC
        ),
        'media', (
            SELECT COALESCE(json_agg(
                json_build_object(
                    'id', pm.id,
                    'fileName', pm.file_name,
                    'filePath', pm.file_path,
                    'mediaType', pm.media_type,
                    'purpose', pm.purpose,
                    'title', pm.title,
                    'description', pm.description,
                    'altText', pm.alt_text,
                    'isCover', pm.is_cover,
                    'thumbnailPath', pm.thumbnail_path,
                    'optimizedPath', pm.optimized_path
                )
                ORDER BY pm.is_cover DESC, pm.display_order, pm.created_at
            ), '[]'::json)
            FROM property_media pm
            WHERE pm.property_id = p_property_id
            AND pm.is_verified = true
            AND pm.moderation_status = 'approved'
        )
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate property content completeness
CREATE OR REPLACE FUNCTION validate_property_content_completeness(p_property_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
    content_exists BOOLEAN;
    amenities_count INTEGER;
    media_count INTEGER;
    cover_image_exists BOOLEAN;
BEGIN
    -- Check if content exists
    SELECT EXISTS(
        SELECT 1 FROM property_content
        WHERE property_id = p_property_id
        AND content_status = 'published'
    ) INTO content_exists;

    -- Count amenities
    SELECT COUNT(*) INTO amenities_count
    FROM property_amenities pa
    JOIN amenities a ON a.id = pa.amenity_id
    WHERE pa.property_id = p_property_id
    AND pa.is_available = true
    AND a.is_active = true;

    -- Count verified media
    SELECT COUNT(*) INTO media_count
    FROM property_media
    WHERE property_id = p_property_id
    AND is_verified = true
    AND moderation_status = 'approved';

    -- Check for cover image
    SELECT EXISTS(
        SELECT 1 FROM property_media
        WHERE property_id = p_property_id
        AND is_cover = true
        AND is_verified = true
        AND moderation_status = 'approved'
    ) INTO cover_image_exists;

    SELECT json_build_object(
        'isComplete', (
            content_exists AND
            amenities_count >= 3 AND
            media_count >= 1 AND
            cover_image_exists
        ),
        'contentExists', content_exists,
        'amenitiesCount', amenities_count,
        'mediaCount', media_count,
        'coverImageExists', cover_image_exists,
        'requirements', json_build_object(
            'minAmenities', 3,
            'minMedia', 1,
            'requiresCoverImage', true,
            'requiresPublishedContent', true
        )
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
