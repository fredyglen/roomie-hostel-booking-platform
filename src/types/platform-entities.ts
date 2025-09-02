/**
 * ROOMi Platform Entity Definitions
 * Apple-Grade TypeScript interfaces for core business entities
 * 
 * This file defines the main business entities with complete type safety
 * and comprehensive domain modeling for the ROOMi platform.
 * 
 * @version 1.0.0
 * @author ROOMi Platform Team
 */

import {
  UserId,
  PropertyId,
  BookingId,
  RoomId,
  BedId,
  PaymentId,
  TransactionId,
  AgentId,
  // UniversityId, // Commented out as not used in current implementation
  UserRole,
  VerificationStatus,
  PropertyType,
  PropertyCategory,
  GenderType,
  RoomOccupancyType,
  BookingStatus,
  PaymentStatus,
  SemesterPeriod,
  PaymentChannel,
  Currency,
  GhanaUniversity,
  GhanaRegion,
  StudentLevel
} from './platform-core';

// =====================================================
// BASE ENTITY INTERFACE
// =====================================================

/**
 * Base interface for all platform entities
 */
export interface BaseEntity {
  readonly id: string;
  readonly created_at: string;
  readonly updated_at: string;
}

// =====================================================
// USER ENTITIES
// =====================================================

/**
 * Core user profile information
 */
export interface UserProfile {
  readonly first_name: string;
  readonly last_name: string;
  readonly phone?: string;
  readonly avatar_url?: string;
  readonly bio?: string;
  readonly date_of_birth?: string;
  readonly nationality?: string;
  readonly emergency_contact_name?: string;
  readonly emergency_contact_phone?: string;
}

/**
 * Student-specific profile information
 */
export interface StudentProfile extends UserProfile {
  readonly university: GhanaUniversity;
  readonly student_id: string;
  readonly student_level: StudentLevel;
  readonly graduation_year: number;
  readonly program_of_study?: string;
  readonly parent_guardian_name?: string;
  readonly parent_guardian_phone?: string;
}

/**
 * Property owner profile information
 */
export interface OwnerProfile extends UserProfile {
  readonly business_name?: string;
  readonly business_registration_number?: string;
  readonly tax_identification_number?: string;
  readonly bank_account_name?: string;
  readonly bank_account_number?: string;
  readonly bank_name?: string;
  readonly years_in_business?: number;
}

/**
 * Agent profile information
 */
export interface AgentProfile extends UserProfile {
  readonly agent_license_number?: string;
  readonly commission_rate: number;
  readonly assigned_properties: readonly PropertyId[];
  readonly territory_regions: readonly GhanaRegion[];
}

/**
 * Complete user entity
 */
export interface User extends BaseEntity {
  readonly id: UserId;
  readonly email: string;
  readonly role: UserRole;
  readonly verification_status: VerificationStatus;
  readonly is_active: boolean;
  readonly last_login?: string;
  readonly profile: UserProfile | StudentProfile | OwnerProfile | AgentProfile;
}

// =====================================================
// PROPERTY ENTITIES
// =====================================================

/**
 * Property location information
 */
export interface PropertyLocation {
  readonly address: string;
  readonly city: string;
  readonly region: GhanaRegion;
  readonly country: string;
  readonly postal_code?: string;
  readonly latitude?: number;
  readonly longitude?: number;
  readonly landmark?: string;
  readonly distance_to_university?: number; // in kilometers
  readonly transportation_options?: readonly string[];
}

/**
 * Property pricing information
 */
export interface PropertyPricing {
  readonly base_price_per_semester: number;
  readonly currency: Currency;
  readonly utilities_included: boolean;
  readonly security_deposit_required: boolean;
  readonly security_deposit_amount?: number;
  readonly cleaning_fee?: number;
  readonly maintenance_fee?: number;
  readonly late_payment_penalty_rate?: number;
}

/**
 * Property features and amenities
 */
export interface PropertyFeatures {
  readonly amenities: readonly string[];
  readonly house_rules: readonly string[];
  readonly challenges?: readonly string[]; // Negative aspects for transparency
  readonly utilities_included: readonly string[];
  readonly security_features: readonly string[];
  readonly internet_speed?: string;
  readonly parking_available: boolean;
  readonly pet_friendly: boolean;
  readonly smoking_allowed: boolean;
}

/**
 * Property media content
 */
export interface PropertyMedia {
  readonly cover_image_url: string;
  readonly images: readonly string[];
  readonly videos?: readonly string[];
  readonly environment_video_url?: string; // Property surroundings
  readonly virtual_tour_url?: string;
}

/**
 * Room entity within a property
 */
export interface Room extends BaseEntity {
  readonly id: RoomId;
  readonly property_id: PropertyId;
  readonly room_number: string;
  readonly room_type: RoomOccupancyType;
  readonly beds_count: number;
  readonly available_beds: number;
  readonly occupied_beds: number;
  readonly price_per_bed_per_semester: number;
  readonly has_ensuite: boolean;
  readonly has_ac: boolean;
  readonly has_wardrobe: boolean;
  readonly room_amenities: readonly string[];
  readonly room_images: readonly string[];
  readonly is_room_available: boolean;
}

/**
 * Individual bed entity within a room
 */
export interface Bed extends BaseEntity {
  readonly id: BedId;
  readonly room_id: RoomId;
  readonly bed_number: string;
  readonly is_available: boolean;
  readonly current_occupant_id?: UserId;
  readonly bed_type: 'single' | 'double' | 'bunk_top' | 'bunk_bottom';
  readonly has_mattress: boolean;
  readonly has_bedding: boolean;
}

/**
 * Complete property entity
 *
 * NOTE: This interface has been unified into src/types/property.ts
 * Import Property from '@/types/property' instead of using this interface
 * This is kept for reference and platform-entities documentation purposes only
 */
export interface PlatformProperty extends BaseEntity {
  readonly id: PropertyId;
  readonly owner_id: UserId;
  readonly agent_id?: AgentId;
  readonly title: string;
  readonly description: string;
  readonly property_type: PropertyType;
  readonly property_category: PropertyCategory;
  readonly gender_type: GenderType;
  readonly max_occupancy: number;
  readonly current_occupancy: number;
  readonly verification_status: VerificationStatus;
  readonly is_available: boolean;
  readonly available_from: string;
  readonly available_to?: string;
  readonly location: PropertyLocation;
  readonly pricing: PropertyPricing;
  readonly features: PropertyFeatures;
  readonly media: PropertyMedia;
  readonly rooms: readonly Room[];
  readonly total_beds: number;
  readonly available_beds: number;
  readonly view_count: number;
  readonly booking_count: number;
  readonly rating_average?: number;
  readonly rating_count: number;
}

// =====================================================
// BOOKING ENTITIES
// =====================================================

/**
 * Emergency contact information for booking
 */
export interface EmergencyContact {
  readonly name: string;
  readonly phone: string;
  readonly relationship: string;
  readonly email?: string;
}

/**
 * Roommate preference for booking
 */
export interface RoommatePreference {
  readonly preferred_roommate_id?: UserId;
  readonly roommate_gender_preference?: GenderType;
  readonly roommate_study_level_preference?: StudentLevel;
  readonly roommate_lifestyle_preferences?: readonly string[];
  readonly allow_random_assignment: boolean;
}

/**
 * Booking verification documents
 */
export interface BookingVerification {
  readonly student_id_document_url: string;
  readonly admission_letter_url?: string;
  readonly parent_guardian_id_url?: string;
  readonly verification_status: VerificationStatus;
  readonly verified_at?: string;
  readonly verified_by?: UserId;
  readonly rejection_reason?: string;
}

/**
 * Complete booking entity
 */
export interface Booking extends BaseEntity {
  readonly id: BookingId;
  readonly property_id: PropertyId;
  readonly room_id: RoomId;
  readonly bed_id: BedId;
  readonly student_id: UserId;
  readonly booking_reference: string;
  readonly status: BookingStatus;
  readonly payment_status: PaymentStatus;
  readonly semester_period: SemesterPeriod;
  readonly academic_year: string;
  readonly check_in_date: string;
  readonly check_out_date: string;
  readonly total_amount: number;
  readonly currency: Currency;
  readonly platform_commission: number;
  readonly agent_commission?: number;
  readonly student_name: string;
  readonly student_email: string;
  readonly student_phone: string;
  readonly university_name: GhanaUniversity;
  readonly student_level: StudentLevel;
  readonly emergency_contact: EmergencyContact;
  readonly roommate_preference?: RoommatePreference;
  readonly verification: BookingVerification;
  readonly special_requests?: string;
  readonly booking_notes?: string;
  readonly payment_reference?: string;
  readonly paystack_reference?: string;
  readonly paid_at?: string;
  readonly confirmed_at?: string;
  readonly cancelled_at?: string;
  readonly cancellation_reason?: string;
}

// =====================================================
// PAYMENT ENTITIES
// =====================================================

/**
 * Payment breakdown for transparency
 */
export interface PaymentBreakdown {
  readonly base_amount: number;
  readonly platform_commission: number;
  readonly agent_commission: number;
  readonly paystack_fee: number;
  readonly total_amount: number;
  readonly owner_receives: number;
  readonly currency: Currency;
}

/**
 * Payment transaction entity
 */
export interface PaymentTransaction extends BaseEntity {
  readonly id: PaymentId;
  readonly booking_id: BookingId;
  readonly transaction_id: TransactionId;
  readonly amount: number;
  readonly currency: Currency;
  readonly payment_method: PaymentChannel;
  readonly status: PaymentStatus;
  readonly paystack_reference: string;
  readonly authorization_code?: string;
  readonly payment_breakdown: PaymentBreakdown;
  readonly metadata: Record<string, unknown>;
  readonly paid_at?: string;
  readonly failed_at?: string;
  readonly failure_reason?: string;
}

// =====================================================
// UTILITY TYPES
// =====================================================

/**
 * Create types for database operations
 */
export type UserInsert = Omit<User, keyof BaseEntity>;
export type UserUpdate = Partial<Omit<User, 'id' | 'email' | keyof BaseEntity>>;

export type PlatformPropertyInsert = Omit<PlatformProperty, keyof BaseEntity>;
export type PlatformPropertyUpdate = Partial<Omit<PlatformProperty, 'id' | 'owner_id' | keyof BaseEntity>>;

export type BookingInsert = Omit<Booking, keyof BaseEntity>;
export type BookingUpdate = Partial<Omit<Booking, 'id' | 'booking_reference' | keyof BaseEntity>>;

/**
 * Search and filter types
 */
export interface PropertySearchFilters {
  readonly property_type?: PropertyType;
  readonly gender_type?: GenderType;
  readonly city?: string;
  readonly region?: GhanaRegion;
  readonly min_price?: number;
  readonly max_price?: number;
  readonly university?: GhanaUniversity;
  readonly amenities?: readonly string[];
  readonly room_type?: RoomOccupancyType;
  readonly available_from?: string;
}

export interface BookingSearchFilters {
  readonly status?: BookingStatus;
  readonly payment_status?: PaymentStatus;
  readonly semester_period?: SemesterPeriod;
  readonly university?: GhanaUniversity;
  readonly date_from?: string;
  readonly date_to?: string;
}
