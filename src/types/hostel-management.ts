/**
 * Apple-Grade Hostel Management Types
 * Following BE CONSCIOUS guidelines for zero-tolerance type safety
 */

import { z } from 'zod';
import type { 
  PropertyId, 
  UserId, 
  Money, 
  Timestamp, 
  GeoCoordinates,
  ImageUrl,
  Currency 
} from './platform-core';

// ============================================================================
// BRANDED TYPES FOR COMPILE-TIME SAFETY
// ============================================================================

export type HostelId = PropertyId & { readonly __brand: 'HostelId' };
export type RoomId = string & { readonly __brand: 'RoomId' };
export type BedId = string & { readonly __brand: 'BedId' };
export type SemesterId = string & { readonly __brand: 'SemesterId' };

// ============================================================================
// CORE HOSTEL ENTITIES WITH IMMUTABLE PROPERTIES
// ============================================================================

export interface HostelProperty {
  readonly id: HostelId;
  readonly title: string;
  readonly description: string;
  readonly address: HostelAddress;
  readonly pricing: HostelPricing;
  readonly configuration: HostelConfiguration;
  readonly amenities: ReadonlyArray<HostelAmenity>;
  readonly images: ReadonlyArray<HostelImage>;
  readonly availability: HostelAvailability;
  readonly verification: HostelVerification;
  readonly metadata: HostelMetadata;
  readonly createdAt: Timestamp;
  readonly updatedAt: Timestamp;
}

export interface HostelAddress {
  readonly street: string;
  readonly area: string;
  readonly city: string;
  readonly region: string;
  readonly postalCode: string;
  readonly coordinates: GeoCoordinates;
  readonly proximityToUPSA: DistanceMeters;
  readonly landmarks: ReadonlyArray<string>;
}

export interface HostelPricing {
  readonly basePricePerSemester: Money;
  readonly currency: Currency;
  readonly roomTypeVariations: ReadonlyArray<RoomTypePricing>;
  readonly additionalFees: ReadonlyArray<AdditionalFee>;
  readonly discounts: ReadonlyArray<HostelDiscount>;
  readonly paymentTerms: PaymentTerms;
}

export interface RoomTypePricing {
  readonly roomType: RoomOccupancyType;
  readonly pricePerSemester: Money;
  readonly pricePerBed: Money;
  readonly availableCount: number;
  readonly totalCount: number;
}

export interface HostelConfiguration {
  readonly totalRooms: number;
  readonly totalBeds: number;
  readonly roomTypes: ReadonlyArray<RoomTypeConfiguration>;
  readonly washroomConfiguration: WashroomConfiguration;
  readonly genderRestriction: GenderRestriction;
  readonly securityFeatures: ReadonlyArray<SecurityFeature>;
}

export interface RoomTypeConfiguration {
  readonly type: RoomOccupancyType;
  readonly count: number;
  readonly bedsPerRoom: number;
  readonly hasPrivateBathroom: boolean;
  readonly floorDistribution: ReadonlyArray<FloorRoomDistribution>;
}

// ============================================================================
// ENUMS AND UNION TYPES
// ============================================================================

export const RoomOccupancyType = {
  ONE_IN_A_ROOM: '1_in_a_room',
  TWO_IN_A_ROOM: '2_in_a_room',
  THREE_IN_A_ROOM: '3_in_a_room',
  FOUR_IN_A_ROOM: '4_in_a_room'
} as const;

export type RoomOccupancyType = typeof RoomOccupancyType[keyof typeof RoomOccupancyType];

export const GenderRestriction = {
  MALE_ONLY: 'male_only',
  FEMALE_ONLY: 'female_only',
  MIXED: 'mixed'
} as const;

export type GenderRestriction = typeof GenderRestriction[keyof typeof GenderRestriction];

export const WashroomType = {
  SELF_CONTAINED: 'self_contained',
  SHARED: 'shared',
  MIXED: 'mixed'
} as const;

export type WashroomType = typeof WashroomType[keyof typeof WashroomType];

export const HostelVerificationStatus = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended'
} as const;

export type HostelVerificationStatus = typeof HostelVerificationStatus[keyof typeof HostelVerificationStatus];

// ============================================================================
// SUPPORTING INTERFACES
// ============================================================================

export interface HostelAmenity {
  readonly id: string;
  readonly name: string;
  readonly category: AmenityCategory;
  readonly isEssential: boolean;
  readonly description?: string;
  readonly icon?: string;
}

export interface HostelImage {
  readonly id: string;
  readonly url: ImageUrl;
  readonly thumbnailUrl: ImageUrl;
  readonly alt: string;
  readonly category: ImageCategory;
  readonly order: number;
  readonly uploadedAt: Timestamp;
}

export interface HostelAvailability {
  readonly isAvailable: boolean;
  readonly availableFrom: Timestamp;
  readonly availableTo: Timestamp;
  readonly semesterAvailability: ReadonlyArray<SemesterAvailability>;
  readonly bedAvailability: ReadonlyArray<BedAvailability>;
}

export interface SemesterAvailability {
  readonly semesterId: SemesterId;
  readonly academicYear: string;
  readonly startDate: Timestamp;
  readonly endDate: Timestamp;
  readonly isBookingOpen: boolean;
  readonly availableBeds: number;
  readonly totalBeds: number;
}

export interface BedAvailability {
  readonly bedId: BedId;
  readonly roomId: RoomId;
  readonly isAvailable: boolean;
  readonly reservedUntil?: Timestamp;
  readonly currentOccupant?: UserId;
}

export interface HostelVerification {
  readonly status: HostelVerificationStatus;
  readonly verifiedAt?: Timestamp;
  readonly verifiedBy?: UserId;
  readonly verificationNotes?: string;
  readonly documentsSubmitted: ReadonlyArray<VerificationDocument>;
  readonly inspectionReport?: InspectionReport;
}

export interface HostelMetadata {
  readonly ownerId: UserId;
  readonly managedBy?: UserId;
  readonly createdBy: UserId;
  readonly lastUpdatedBy: UserId;
  readonly viewCount: number;
  readonly bookingCount: number;
  readonly averageRating?: number;
  readonly reviewCount: number;
  readonly tags: ReadonlyArray<string>;
}

// ============================================================================
// RESULT TYPES FOR ERROR HANDLING
// ============================================================================

export type HostelOperationResult<T> = 
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: HostelError };

export type HostelError = 
  | { readonly type: 'not_found'; readonly hostelId: HostelId }
  | { readonly type: 'validation_error'; readonly field: string; readonly message: string }
  | { readonly type: 'permission_denied'; readonly userId: UserId; readonly action: string }
  | { readonly type: 'availability_conflict'; readonly requestedBeds: number; readonly availableBeds: number }
  | { readonly type: 'database_error'; readonly code: string; readonly message: string }
  | { readonly type: 'network_error'; readonly retryAfter: number }
  | { readonly type: 'service_unavailable'; readonly estimatedRecovery: Timestamp };

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

export const HostelPropertySchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(10).max(200),
  description: z.string().min(50).max(5000),
  address: z.object({
    street: z.string().min(5),
    area: z.string().min(2),
    city: z.string().min(2),
    region: z.string().min(2),
    postalCode: z.string().optional(),
    coordinates: z.object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180)
    }),
    proximityToUPSA: z.number().positive(),
    landmarks: z.array(z.string()).default([])
  }),
  pricing: z.object({
    basePricePerSemester: z.number().positive(),
    currency: z.enum(['GHS', 'USD', 'EUR']),
    roomTypeVariations: z.array(z.object({
      roomType: z.enum(['1_in_a_room', '2_in_a_room', '3_in_a_room', '4_in_a_room']),
      pricePerSemester: z.number().positive(),
      pricePerBed: z.number().positive(),
      availableCount: z.number().nonnegative(),
      totalCount: z.number().positive()
    }))
  }),
  configuration: z.object({
    totalRooms: z.number().positive(),
    totalBeds: z.number().positive(),
    genderRestriction: z.enum(['male_only', 'female_only', 'mixed']),
    washroomConfiguration: z.object({
      type: z.enum(['self_contained', 'shared', 'mixed']),
      sharedWashroomCount: z.number().optional()
    })
  }),
  verification: z.object({
    status: z.enum(['pending', 'verified', 'rejected', 'suspended']),
    verifiedAt: z.string().datetime().optional(),
    verifiedBy: z.string().uuid().optional()
  })
});

export type HostelPropertyInput = z.infer<typeof HostelPropertySchema>;

// ============================================================================
// CONSTANTS AND BUSINESS RULES
// ============================================================================

export const HOSTEL_BUSINESS_RULES = {
  MAX_BEDS_PER_ROOM: 4,
  MIN_BEDS_PER_ROOM: 1,
  SEMESTER_DURATION_MONTHS: 4,
  MAX_ADVANCE_BOOKING_DAYS: 90,
  MIN_ADVANCE_BOOKING_DAYS: 1,
  PLATFORM_COMMISSION_RATE: 0.05, // 5%
  AGENT_COMMISSION_RATE: 0.037,   // 3.7%
  PLATFORM_FEE_GHS: 100,
  MAX_IMAGES_PER_HOSTEL: 10,
  MAX_AMENITIES_PER_HOSTEL: 20,
  UPSA_CAMPUS_COORDINATES: {
    latitude: 5.6037,
    longitude: -0.1870
  },
  MAX_DISTANCE_FROM_UPSA_KM: 15
} as const;

// ============================================================================
// TYPE GUARDS AND UTILITIES
// ============================================================================

export function isHostelId(value: string): value is HostelId {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export function createHostelId(uuid: string): HostelId {
  if (!isHostelId(uuid)) {
    throw new Error(`Invalid hostel ID format: ${uuid}`);
  }
  return uuid as HostelId;
}

export function validateHostelProperty(data: unknown): HostelOperationResult<HostelPropertyInput> {
  try {
    const validated = HostelPropertySchema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return {
        success: false,
        error: {
          type: 'validation_error',
          field: firstError.path.join('.'),
          message: firstError.message
        }
      };
    }
    return {
      success: false,
      error: {
        type: 'validation_error',
        field: 'unknown',
        message: 'Unknown validation error'
      }
    };
  }
}
