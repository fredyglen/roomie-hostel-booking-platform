/**
 * ROOMi Platform Core Type Definitions
 * Apple-Grade TypeScript definitions for the ROOMi student accommodation platform
 * 
 * This file establishes the foundational type system following Apple-level standards:
 * - Zero tolerance for 'any' types
 * - Branded types for type safety
 * - Comprehensive domain modeling
 * - Ghana market specifics
 * 
 * @version 1.0.0
 * @author ROOMi Platform Team
 */

// =====================================================
// BRANDED TYPES FOR TYPE SAFETY
// =====================================================

/**
 * Branded type utility for creating unique types
 */
type Brand<T, B> = T & { readonly __brand: B };

/**
 * Unique identifiers with compile-time type safety
 */
export type UserId = Brand<string, 'UserId'>;
export type PropertyId = Brand<string, 'PropertyId'>;
export type BookingId = Brand<string, 'BookingId'>;
export type RoomId = Brand<string, 'RoomId'>;
export type BedId = Brand<string, 'BedId'>;
export type PaymentId = Brand<string, 'PaymentId'>;
export type TransactionId = Brand<string, 'TransactionId'>;
export type AgentId = Brand<string, 'AgentId'>;
export type UniversityId = Brand<string, 'UniversityId'>;

// =====================================================
// MISSING BRANDED TYPES FOR TECHNICAL DEBT ELIMINATION
// =====================================================

/**
 * Financial and measurement types
 */
export type Money = Brand<number, 'Money'>;
export type DistanceMeters = Brand<number, 'DistanceMeters'>;

/**
 * Time and date types
 */
export type Timestamp = Brand<string, 'Timestamp'>;

/**
 * Media and location types
 */
export type ImageUrl = Brand<string, 'ImageUrl'>;
export type GeoCoordinates = Brand<{ lat: number; lng: number }, 'GeoCoordinates'>;

/**
 * Business logic types
 */
export type AdditionalFee = Brand<{ name: string; amount: Money; description?: string }, 'AdditionalFee'>;
export type HostelDiscount = Brand<{ type: 'percentage' | 'fixed'; value: number; description: string }, 'HostelDiscount'>;
export type PaymentTerms = Brand<{ method: string; schedule: string; penalties?: string }, 'PaymentTerms'>;
export type SecurityFeature = Brand<{ name: string; description: string; active: boolean }, 'SecurityFeature'>;
export type FloorRoomDistribution = Brand<{ floor: number; rooms: number; capacity: number }, 'FloorRoomDistribution'>;
export type AmenityCategory = Brand<string, 'AmenityCategory'>;
export type ImageCategory = Brand<string, 'ImageCategory'>;
export type VerificationDocument = Brand<{ type: string; url: string; verified: boolean }, 'VerificationDocument'>;
export type InspectionReport = Brand<{ date: Timestamp; inspector: string; status: string; notes: string }, 'InspectionReport'>;

/**
 * Configuration types
 */
export type WashroomConfiguration = Brand<{
  type: 'shared' | 'private' | 'ensuite';
  count: number;
  features: string[]
}, 'WashroomConfiguration'>;

export type RoomTypeConfiguration = Brand<{
  type: string;
  capacity: number;
  features: string[];
  price: Money;
}, 'RoomTypeConfiguration'>;

/**
 * Helper functions to create branded types
 */
export const createUserId = (id: string): UserId => id as UserId;
export const createPropertyId = (id: string): PropertyId => id as PropertyId;
export const createBookingId = (id: string): BookingId => id as BookingId;
export const createRoomId = (id: string): RoomId => id as RoomId;
export const createBedId = (id: string): BedId => id as BedId;
export const createPaymentId = (id: string): PaymentId => id as PaymentId;
export const createTransactionId = (id: string): TransactionId => id as TransactionId;
export const createAgentId = (id: string): AgentId => id as AgentId;
export const createUniversityId = (id: string): UniversityId => id as UniversityId;

// =====================================================
// CORE PLATFORM ENUMS
// =====================================================

/**
 * User roles in the ROOMi ecosystem
 */
export enum UserRole {
  STUDENT = 'student',
  OWNER = 'owner', 
  AGENT = 'agent',
  ADMIN = 'admin'
}

/**
 * User verification status for platform security
 */
export enum VerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended'
}

/**
 * Property types in Ghana hostel market
 */
export enum PropertyType {
  HOSTEL = 'hostel',
  APARTMENT = 'apartment',
  HOMESTEL = 'homestel'
}

/**
 * Property categories for classification
 */
export enum PropertyCategory {
  HOSTEL = 'Hostel',
  APARTMENT = 'Apartment', 
  HOMESTEL = 'Homestel',
  SINGLE_ROOM = 'Single Room'
}

/**
 * Gender restrictions for properties
 */
export enum GenderType {
  MALE = 'male',
  FEMALE = 'female',
  MIXED = 'mixed'
}

/**
 * Room occupancy types (Ghana hostel standard)
 */
export enum RoomOccupancyType {
  ONE_IN_A_ROOM = '1_in_a_room',
  TWO_IN_A_ROOM = '2_in_a_room',
  THREE_IN_A_ROOM = '3_in_a_room',
  FOUR_IN_A_ROOM = '4_in_a_room',
  FIVE_IN_A_ROOM = '5_in_a_room',
  SIX_IN_A_ROOM = '6_in_a_room'
}

/**
 * Booking status throughout the booking lifecycle
 */
export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PAID = 'paid',
  CHECKED_IN = 'checked_in',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

/**
 * Payment status for booking transactions
 */
export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

/**
 * Semester periods for Ghana academic calendar
 */
export enum SemesterPeriod {
  FIRST_SEMESTER = 'first_semester',
  SECOND_SEMESTER = 'second_semester',
  SUMMER_SESSION = 'summer_session'
}

/**
 * Ghana mobile money channels supported by Paystack
 */
export enum GhanaMobileMoneyChannel {
  MTN = 'mtn',
  VODAFONE = 'vodafone',
  AIRTELTIGO = 'airteltigo'
}

/**
 * Payment channels available in Ghana
 */
export enum PaymentChannel {
  CARD = 'card',
  MOBILE_MONEY = 'mobile_money',
  BANK = 'bank',
  USSD = 'ussd',
  QR = 'qr'
}

/**
 * Ghana currency (primary market)
 */
export enum Currency {
  GHS = 'GHS',
  NGN = 'NGN',
  USD = 'USD',
  ZAR = 'ZAR',
  KES = 'KES'
}

// =====================================================
// GHANA MARKET SPECIFICS
// =====================================================

/**
 * Ghana universities supported by the platform
 */
export enum GhanaUniversity {
  UPSA = 'University of Professional Studies, Accra',
  UG = 'University of Ghana',
  KNUST = 'Kwame Nkrumah University of Science and Technology',
  UCC = 'University of Cape Coast',
  UEW = 'University of Education, Winneba',
  GIMPA = 'Ghana Institute of Management and Public Administration'
}

/**
 * Ghana regions for property location
 */
export enum GhanaRegion {
  GREATER_ACCRA = 'Greater Accra',
  ASHANTI = 'Ashanti',
  CENTRAL = 'Central',
  EASTERN = 'Eastern',
  NORTHERN = 'Northern',
  UPPER_EAST = 'Upper East',
  UPPER_WEST = 'Upper West',
  VOLTA = 'Volta',
  WESTERN = 'Western',
  WESTERN_NORTH = 'Western North',
  BONO = 'Bono',
  BONO_EAST = 'Bono East',
  AHAFO = 'Ahafo',
  SAVANNAH = 'Savannah',
  NORTH_EAST = 'North East',
  OTI = 'Oti'
}

/**
 * Student academic levels in Ghana
 */
export enum StudentLevel {
  LEVEL_100 = 'Level 100',
  LEVEL_200 = 'Level 200',
  LEVEL_300 = 'Level 300',
  LEVEL_400 = 'Level 400',
  POSTGRADUATE = 'Postgraduate'
}

// =====================================================
// BUSINESS RULES CONSTANTS
// =====================================================

/**
 * @deprecated Use centralizedCommissionEngine and centralizedBusinessRulesEngine instead
 *
 * MIGRATION COMPLETED: All platform rules now come from centralized systems
 * - Commission rates: Use centralizedCommissionEngine from @/config/centralized-commission.config
 * - Business rules: Use centralizedBusinessRulesEngine from @/config/centralized-business-rules.config
 *
 * This object is maintained for backward compatibility only.
 */
export const PLATFORM_RULES = {
  // ✅ CENTRALIZED COMMISSION SYSTEM - Values from single source of truth
  PLATFORM_COMMISSION_RATE: 0.05, // 5% - DEFINITIVE (from centralized commission engine)
  PLATFORM_FIXED_FEE: 100,        // GHS 100 - DEFINITIVE (from centralized commission engine)
  AGENT_COMMISSION_RATE: 0.037,   // 3.7% - DEFINITIVE (from centralized commission engine)
  AGENT_MINIMUM_FEE: 100,         // GHS 100 - DEFINITIVE (from centralized commission engine)
  PAYSTACK_FEE_RATE: 0.0195,      // 1.95% - DEFINITIVE (from centralized commission engine)

  // ✅ CENTRALIZED BUSINESS RULES - Values from single source of truth
  SEMESTER_DURATION_MONTHS: 4,    // From centralized business rules engine
  MAX_BOOKING_ADVANCE_DAYS: 90,   // From centralized business rules engine
  MIN_BOOKING_ADVANCE_DAYS: 1,    // From centralized business rules engine

  // ✅ CENTRALIZED PROPERTY RULES - Values from single source of truth
  MAX_IMAGES_PER_PROPERTY: 10,    // From centralized business rules engine
  MAX_VIDEOS_PER_PROPERTY: 3,     // From centralized business rules engine
  MAX_PROPERTY_TITLE_LENGTH: 100, // From centralized business rules engine
  MIN_PROPERTY_DESCRIPTION_LENGTH: 20, // From centralized business rules engine

  // ✅ CENTRALIZED FILE UPLOAD RULES - Values from single source of truth
  MAX_IMAGE_SIZE_MB: 5,            // From centralized business rules engine
  MAX_VIDEO_SIZE_MB: 50,           // From centralized business rules engine
  
  // Search and pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  SEARCH_DEBOUNCE_MS: 300,
  
  // Currency limits for Ghana
  CURRENCY_LIMITS: {
    [Currency.GHS]: { min: 0.10, max: 50000 },
    [Currency.NGN]: { min: 50, max: 10000000 },
    [Currency.USD]: { min: 2, max: 100000 },
    [Currency.ZAR]: { min: 1, max: 100000 },
    [Currency.KES]: { min: 1, max: 1000000 }
  }
} as const;

// =====================================================
// TYPE GUARDS AND UTILITIES
// =====================================================

/**
 * Type guard for UserRole
 */
export const isUserRole = (value: string): value is UserRole => {
  return Object.values(UserRole).includes(value as UserRole);
};

/**
 * Type guard for PropertyType
 */
export const isPropertyType = (value: string): value is PropertyType => {
  return Object.values(PropertyType).includes(value as PropertyType);
};

/**
 * Type guard for BookingStatus
 */
export const isBookingStatus = (value: string): value is BookingStatus => {
  return Object.values(BookingStatus).includes(value as BookingStatus);
};

/**
 * Type guard for PaymentStatus
 */
export const isPaymentStatus = (value: string): value is PaymentStatus => {
  return Object.values(PaymentStatus).includes(value as PaymentStatus);
};

/**
 * Type guard for Currency
 */
export const isCurrency = (value: string): value is Currency => {
  return Object.values(Currency).includes(value as Currency);
};
