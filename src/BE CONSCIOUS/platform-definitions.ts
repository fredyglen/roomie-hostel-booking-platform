/**
 * 🏠 ROOMi Platform Master Type Definitions
 * 
 * This file serves as the single source of truth for all ROOMi platform types.
 * It defines strict TypeScript definitions for the Ghana student housing marketplace
 * that connects students with verified hostels/accommodations through a three-portal
 * system (student/owner/admin) with booking and payment flows.
 * 
 * Business Model: 5% commission + 100 GHS platform fee, semester-based pricing
 * 
 * @version 1.0.0
 * @author ROOMi Development Team
 * @date January 2025
 */

// =====================================================
// CORE BUSINESS ENTITIES
// =====================================================

/**
 * User roles in the ROOMi platform ecosystem
 * - student: University students seeking accommodation
 * - owner: Property owners listing accommodations
 * - admin: Platform administrators managing operations
 * - agent: Traditional agents partnering with platform
 */
export type UserRole = 'student' | 'owner' | 'admin' | 'agent';

/**
 * User verification status for platform security
 */
export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'suspended';

/**
 * Core user entity representing all platform users
 */
export interface User {
  readonly id: string;
  readonly email: string;
  readonly role: UserRole;
  readonly verification_status: VerificationStatus;
  readonly profile: UserProfile;
  readonly created_at: string;
  readonly updated_at: string;
  readonly last_login?: string;
}

/**
 * User profile information specific to each role
 */
export interface UserProfile {
  readonly first_name: string;
  readonly last_name: string;
  readonly phone?: string;
  readonly avatar_url?: string;
  readonly university?: string; // For students
  readonly student_id?: string; // For students
  readonly graduation_year?: number; // For students
  readonly business_name?: string; // For owners/agents
  readonly business_license?: string; // For owners/agents
  readonly emergency_contact?: EmergencyContact;
}

/**
 * Emergency contact information for students
 */
export interface EmergencyContact {
  readonly name: string;
  readonly phone: string;
  readonly relationship: string;
  readonly email?: string;
}

// =====================================================
// PROPERTY MANAGEMENT SYSTEM
// =====================================================

/**
 * Property types in Ghana hostel market
 * - hostel: Traditional student hostels
 * - apartment: Executive apartments for sharing
 * - homestel: Converted homes to hostels
 * - compound: Multiple buildings in one location
 */
export type PropertyType = 'hostel' | 'apartment' | 'homestel' | 'compound';

/**
 * Property categories for classification
 */
export type PropertyCategory = 'Hostel' | 'Apartment' | 'Homestel' | 'Compound' | 'Single Room';

/**
 * Gender restrictions for properties
 */
export type GenderRestriction = 'male' | 'female' | 'mixed';

/**
 * Property verification status
 */
export type PropertyVerificationStatus = 'pending' | 'verified' | 'rejected' | 'suspended';

/**
 * Core property entity representing all accommodations
 * Matches exact database schema for type safety
 */
export interface Property {
  // Core identification
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly property_type: PropertyType;
  readonly property_category: PropertyCategory | null;
  
  // Location information
  readonly address: string;
  readonly city: string;
  readonly state: string;
  readonly zip: string;
  
  // Pricing (semester-based for Ghana market)
  readonly rent: number; // Per semester pricing
  readonly currency: string | null; // Default: GHS
  readonly base_price_per_semester: number | null;
  
  // Capacity and occupancy
  readonly bedrooms: number;
  readonly bathrooms: number;
  readonly max_occupants: number | null;
  readonly beds_available: number | null;
  readonly beds_per_room: number | null;
  readonly total_rooms: number | null;
  readonly rooms_available: number | null;
  
  // Property features
  readonly is_available: boolean | null;
  readonly is_furnished: boolean | null;
  readonly gender_restriction: GenderRestriction | null;
  readonly amenities: string[] | null;
  readonly security_features: string[] | null;
  
  // Business logic
  readonly allow_bill_sharing: boolean | null; // For apartment sharing
  readonly advance_payment_months: number | null;
  readonly cancellation_policy: string | null;
  readonly semester_availability: string[] | null; // Available semesters
  
  // Utilities and features
  readonly has_accessibility_features: boolean | null;
  readonly has_bedframes: boolean | null;
  readonly has_fan: boolean | null;
  readonly has_individual_meters: boolean | null;
  readonly has_mattresses: boolean | null;
  readonly has_tiled_room: boolean | null;
  readonly has_wardrobes: boolean | null;
  readonly internet_speed: string | null;
  readonly meter_type: string | null;
  readonly washroom_type: string | null;
  readonly shared_meter_count: number | null;
  readonly shared_washroom_count: number | null;
  
  // Parking and accessibility
  readonly parking_available: boolean | null;
  readonly parking_cost: number | null;
  readonly pet_policy: string | null;
  readonly size: number | null; // Property size in sq meters
  
  // Media and virtual tours
  readonly images: string[] | null;
  readonly virtual_tour_url: string | null;
  
  // Ownership and management
  readonly owner_id: string;
  readonly owner?: User;
  
  // Emergency contacts
  readonly emergency_contact_name: string | null;
  readonly emergency_contact_phone: string | null;
  
  // Availability dates
  readonly available_from: string;
  readonly available_to: string | null;
  
  // Subscription and verification
  readonly subscription_status: string | null;
  readonly subscription_expires_at: string | null;
  readonly verification_status: PropertyVerificationStatus | null;
  
  // Timestamps
  readonly created_at: string;
  readonly updated_at: string;
}

// =====================================================
// BOOKING SYSTEM
// =====================================================

/**
 * Booking status throughout the booking lifecycle
 */
export type BookingStatus = 'pending' | 'confirmed' | 'paid' | 'checked_in' | 'completed' | 'cancelled';

/**
 * Payment status for booking transactions
 */
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

/**
 * Room occupancy types (Ghana hostel standard)
 */
export type RoomOccupancyType = '1_in_a_room' | '2_in_a_room' | '3_in_a_room' | '4_in_a_room';

/**
 * Semester periods for Ghana academic calendar
 */
export type SemesterPeriod = 'first_semester' | 'second_semester' | 'summer_session';

/**
 * Core booking entity representing student accommodation bookings
 */
export interface Booking {
  readonly id: string;
  readonly booking_reference: string; // ROOMI_timestamp_hash format
  
  // Booking parties
  readonly student_id: string;
  readonly property_id: string;
  readonly property_owner_id: string;
  readonly agent_id?: string; // Optional agent involvement
  readonly room_id?: string; // Specific room if applicable
  readonly bed_id?: string; // Specific bed if applicable
  
  // Booking details
  readonly start_date: string; // Semester start
  readonly end_date: string; // Semester end (4 months)
  readonly semester_period: SemesterPeriod;
  readonly room_occupancy_type: RoomOccupancyType;
  readonly special_requests?: string;
  
  // Pricing breakdown (Ghana business model)
  readonly base_property_price: number; // Property rent
  readonly platform_commission: number; // 5% of booking value
  readonly platform_fee: number; // Fixed 100 GHS fee
  readonly agent_commission?: number; // Agent fee if applicable
  readonly paystack_fee: number; // 1.95% payment processing
  readonly total_amount: number; // Total student pays
  
  // Shared payment support (for apartments)
  readonly is_shared_payment: boolean;
  readonly primary_booker_id?: string; // Student who pays platform
  readonly total_roommates: number;
  readonly student_share_amount?: number;
  readonly roommate_collection_status?: 'pending' | 'collected' | 'partial';
  
  // Status tracking
  readonly status: BookingStatus;
  readonly payment_status: PaymentStatus;
  
  // Payment information
  readonly payment_reference?: string;
  readonly paystack_reference?: string;
  readonly payment_method?: string;
  readonly paid_at?: string;
  
  // Student information (for verification)
  readonly student_name: string;
  readonly student_email: string;
  readonly student_phone: string;
  readonly student_id_number?: string;
  readonly university_name: string; // Default: UPSA
  readonly student_level?: string; // Level 100, 200, etc.
  
  // Emergency contact
  readonly emergency_contact_name?: string;
  readonly emergency_contact_phone?: string;
  
  // Timestamps
  readonly created_at: string;
  readonly updated_at: string;
}

// =====================================================
// PAYMENT SYSTEM (PAYSTACK INTEGRATION)
// =====================================================

/**
 * Payment transaction status from Paystack
 */
export type PaymentTransactionStatus = 'success' | 'pending' | 'failed';

/**
 * Ghana mobile money channels supported by Paystack
 */
export type GhanaMobileMoneyChannel = 'mtn' | 'vodafone' | 'airteltigo';

/**
 * Payment channels available in Ghana
 */
export type PaymentChannel = 'card' | 'mobile_money' | 'bank' | 'ussd' | 'qr';

/**
 * Payment transaction entity for Paystack integration
 */
export interface PaymentTransaction {
  readonly id: string;
  readonly reference: string; // Paystack reference
  readonly amount: number; // In pesewas (GHS * 100)
  readonly currency: 'GHS';
  readonly status: PaymentTransactionStatus;
  readonly channel: PaymentChannel;
  readonly mobile_money_channel?: GhanaMobileMoneyChannel;
  readonly transaction_date: string;
  readonly customer_email: string;
  readonly customer_phone?: string;
  readonly metadata?: PaymentMetadata;
  readonly gateway_response?: Record<string, unknown>;
  readonly fees?: number; // Paystack fees
  readonly authorization?: PaymentAuthorization;
}

/**
 * Payment metadata for transaction context
 */
export interface PaymentMetadata {
  readonly type: 'booking' | 'subscription' | 'commission';
  readonly booking_id?: string;
  readonly student_id?: string;
  readonly property_id?: string;
  readonly semester_period?: SemesterPeriod;
  readonly custom_fields?: Record<string, string>;
}

/**
 * Payment authorization for card transactions
 */
export interface PaymentAuthorization {
  readonly authorization_code: string;
  readonly bin: string;
  readonly last4: string;
  readonly exp_month: string;
  readonly exp_year: string;
  readonly channel: PaymentChannel;
  readonly card_type: string;
  readonly bank: string;
  readonly country_code: string;
  readonly brand: string;
  readonly reusable: boolean;
}

// =====================================================
// API RESPONSE TYPES
// =====================================================

/**
 * Standardized API response wrapper
 */
export interface ApiResponse<T> {
  readonly status: 'success' | 'error';
  readonly data?: T;
  readonly error?: ApiError;
  readonly meta?: ResponseMetadata;
}

/**
 * API error structure
 */
export interface ApiError {
  readonly message: string;
  readonly code?: string;
  readonly details?: Record<string, unknown> | string | null;
  readonly field?: string; // For validation errors
}

/**
 * Response metadata for pagination and context
 */
export interface ResponseMetadata {
  readonly total?: number;
  readonly page?: number;
  readonly pageSize?: number;
  readonly totalPages?: number;
  readonly hasMore?: boolean;
}

// =====================================================
// GHANA-SPECIFIC TYPES
// =====================================================

/**
 * Ghana regions for property location
 */
export type GhanaRegion = 
  | 'Greater Accra'
  | 'Ashanti'
  | 'Western'
  | 'Central'
  | 'Eastern'
  | 'Volta'
  | 'Northern'
  | 'Upper East'
  | 'Upper West'
  | 'Brong Ahafo';

/**
 * Ghana universities supported by platform
 */
export type GhanaUniversity = 
  | 'UPSA' // University of Professional Studies, Accra
  | 'University of Ghana'
  | 'KNUST' // Kwame Nkrumah University of Science and Technology
  | 'UCC' // University of Cape Coast
  | 'UEW' // University of Education, Winneba
  | 'GIMPA' // Ghana Institute of Management and Public Administration
  | 'Other';

/**
 * Ghana academic levels
 */
export type GhanaAcademicLevel = 
  | 'Level 100'
  | 'Level 200'
  | 'Level 300'
  | 'Level 400'
  | 'Postgraduate'
  | 'Other';

// =====================================================
// BUSINESS LOGIC TYPES
// =====================================================

/**
 * ROOMi platform commission structure
 */
export interface CommissionStructure {
  readonly platform_commission_rate: 0.05; // 5%
  readonly platform_fixed_fee: 100; // 100 GHS
  readonly agent_commission_rate?: number; // Variable
  readonly paystack_fee_rate: 0.0195; // 1.95%
}

/**
 * Semester pricing calculation
 */
export interface SemesterPricing {
  readonly base_rent: number; // Property rent per semester
  readonly platform_commission: number; // 5% of base_rent
  readonly platform_fee: number; // Fixed 100 GHS
  readonly agent_commission?: number; // If agent involved
  readonly paystack_fee: number; // 1.95% of total
  readonly total_student_payment: number; // Final amount student pays
  readonly property_owner_receives: number; // Amount owner receives
}

/**
 * Property search filters for Ghana market
 */
export interface PropertySearchFilters {
  readonly city?: string;
  readonly region?: GhanaRegion;
  readonly university?: GhanaUniversity;
  readonly price_range?: {
    readonly min: number;
    readonly max: number;
  };
  readonly gender_restriction?: GenderRestriction;
  readonly room_occupancy?: RoomOccupancyType;
  readonly amenities?: string[];
  readonly semester_period?: SemesterPeriod;
  readonly distance_to_campus?: number; // In kilometers
}

// =====================================================
// ALL TYPES EXPORTED ABOVE
// =====================================================

// All types and interfaces in this file are already exported individually
// with the 'export' keyword in their declarations above.
