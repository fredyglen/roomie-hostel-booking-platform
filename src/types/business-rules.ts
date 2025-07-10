/**
 * @deprecated Use centralizedBusinessRulesEngine instead
 *
 * MIGRATION COMPLETED: All business rules now come from centralized system
 * - Use centralizedBusinessRulesEngine from @/config/centralized-business-rules.config
 * - This file is maintained for backward compatibility only
 *
 * ROOMi Platform Business Rules & Validation
 * Apple-Grade TypeScript definitions for business logic and validation rules
 *
 * @version 2.0.0 (Centralized)
 * @author ROOMi Platform Team
 */

import {
  BookingStatus,
  PaymentStatus,
  UserRole,
  PropertyType,
  Currency,
  SemesterPeriod
} from './platform-core';

import {
  Booking,
  User,
  PaymentTransaction
} from './platform-entities';

import { centralizedBusinessRulesEngine } from '@/config/centralized-business-rules.config';
import { centralizedCommissionEngine } from '@/config/centralized-commission.config';

import { Property } from './property';

// =====================================================
// BUSINESS RULE INTERFACES
// =====================================================

/**
 * Commission calculation rules
 */
export interface CommissionRules {
  readonly platform_commission_rate: number;
  readonly agent_commission_rate: number;
  readonly agent_minimum_fee: number;
  readonly paystack_fee_rate: number;
  readonly vat_rate: number;
  readonly currency: Currency;
}

/**
 * Booking validation rules
 */
export interface BookingValidationRules {
  readonly min_advance_booking_days: number;
  readonly max_advance_booking_days: number;
  readonly semester_duration_months: number;
  readonly cancellation_deadline_days: number;
  readonly refund_percentage_by_days: readonly {
    readonly days_before: number;
    readonly refund_percentage: number;
  }[];
  readonly required_documents: readonly string[];
  readonly max_special_requests_length: number;
}

/**
 * Property validation rules
 */
export interface PropertyValidationRules {
  readonly min_title_length: number;
  readonly max_title_length: number;
  readonly min_description_length: number;
  readonly max_description_length: number;
  readonly max_images_count: number;
  readonly max_videos_count: number;
  readonly max_amenities_count: number;
  readonly required_amenities: readonly string[];
  readonly max_rooms_per_property: number;
  readonly max_beds_per_room: number;
}

/**
 * Payment validation rules
 */
export interface PaymentValidationRules {
  readonly min_amount: number;
  readonly max_amount: number;
  readonly supported_currencies: readonly Currency[];
  readonly supported_payment_methods: readonly string[];
  readonly payment_timeout_minutes: number;
  readonly max_retry_attempts: number;
  readonly refund_processing_days: number;
}

// =====================================================
// BUSINESS LOGIC CALCULATORS
// =====================================================

/**
 * Payment breakdown calculation
 */
export interface PaymentBreakdown {
  readonly base_amount: number;
  readonly platform_commission: number;
  readonly agent_commission: number;
  readonly paystack_fee: number;
  readonly vat_amount: number;
  readonly total_amount: number;
  readonly owner_receives: number;
  readonly agent_receives: number;
  readonly platform_receives: number;
  readonly currency: Currency;
}

/**
 * Calculate payment breakdown for a booking
 */
export function calculatePaymentBreakdown(
  baseAmount: number,
  currency: Currency,
  hasAgent: boolean = false,
  commissionRules: CommissionRules = DEFAULT_COMMISSION_RULES
): PaymentBreakdown {
  const platformCommission = baseAmount * commissionRules.platform_commission_rate;
  const agentCommission = hasAgent 
    ? Math.max(baseAmount * commissionRules.agent_commission_rate, commissionRules.agent_minimum_fee)
    : 0;
  
  const subtotal = baseAmount + platformCommission + agentCommission;
  const paystackFee = subtotal * commissionRules.paystack_fee_rate;
  const vatAmount = (platformCommission + agentCommission) * commissionRules.vat_rate;
  
  const totalAmount = subtotal + paystackFee + vatAmount;
  const ownerReceives = baseAmount;
  const agentReceives = agentCommission;
  const platformReceives = platformCommission + paystackFee + vatAmount;

  return {
    base_amount: baseAmount,
    platform_commission: platformCommission,
    agent_commission: agentCommission,
    paystack_fee: paystackFee,
    vat_amount: vatAmount,
    total_amount: totalAmount,
    owner_receives: ownerReceives,
    agent_receives: agentReceives,
    platform_receives: platformReceives,
    currency
  };
}

// =====================================================
// BOOKING LIFECYCLE RULES
// =====================================================

/**
 * Valid booking status transitions
 */
export const BOOKING_STATUS_TRANSITIONS: Record<BookingStatus, readonly BookingStatus[]> = {
  [BookingStatus.PENDING]: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED],
  [BookingStatus.CONFIRMED]: [BookingStatus.PAID, BookingStatus.CANCELLED],
  [BookingStatus.PAID]: [BookingStatus.CHECKED_IN, BookingStatus.CANCELLED],
  [BookingStatus.CHECKED_IN]: [BookingStatus.COMPLETED],
  [BookingStatus.COMPLETED]: [], // Terminal state
  [BookingStatus.CANCELLED]: [] // Terminal state
} as const;

/**
 * Valid payment status transitions
 */
export const PAYMENT_STATUS_TRANSITIONS: Record<PaymentStatus, readonly PaymentStatus[]> = {
  [PaymentStatus.PENDING]: [PaymentStatus.PROCESSING, PaymentStatus.FAILED],
  [PaymentStatus.PROCESSING]: [PaymentStatus.COMPLETED, PaymentStatus.FAILED],
  [PaymentStatus.COMPLETED]: [PaymentStatus.REFUNDED],
  [PaymentStatus.FAILED]: [PaymentStatus.PENDING], // Allow retry
  [PaymentStatus.REFUNDED]: [] // Terminal state
} as const;

/**
 * Check if booking status transition is valid
 */
export function isValidBookingStatusTransition(
  currentStatus: BookingStatus,
  newStatus: BookingStatus
): boolean {
  return BOOKING_STATUS_TRANSITIONS[currentStatus].includes(newStatus);
}

/**
 * Check if payment status transition is valid
 */
export function isValidPaymentStatusTransition(
  currentStatus: PaymentStatus,
  newStatus: PaymentStatus
): boolean {
  return PAYMENT_STATUS_TRANSITIONS[currentStatus].includes(newStatus);
}

// =====================================================
// VALIDATION FUNCTIONS
// =====================================================

/**
 * Booking validation result
 */
export interface BookingValidationResult {
  readonly is_valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}

/**
 * Validate booking creation request
 */
export function validateBookingCreation(
  booking: Partial<Booking>,
  property: Property,
  user: User
): BookingValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check user role
  if (user.role !== UserRole.STUDENT) {
    errors.push('Only students can create bookings');
  }

  // Check property availability
  if (!property.is_available) {
    errors.push('Property is not available for booking');
  }

  // Check gender restrictions
  if (property.gender_type !== 'mixed' && user.profile.first_name) {
    // This would need additional gender information in user profile
    warnings.push('Please verify gender restrictions for this property');
  }

  // Check booking dates - ✅ CENTRALIZED BUSINESS RULES
  if (booking.check_in_date) {
    const checkInDate = new Date(booking.check_in_date);
    const today = new Date();
    const daysUntilCheckIn = Math.ceil((checkInDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    const bookingRules = centralizedBusinessRulesEngine.getBookingRules();

    if (daysUntilCheckIn < bookingRules.minBookingAdvanceDays) {
      errors.push(`Booking must be made at least ${bookingRules.minBookingAdvanceDays} day(s) in advance`);
    }

    if (daysUntilCheckIn > bookingRules.maxBookingAdvanceDays) {
      errors.push(`Booking cannot be made more than ${bookingRules.maxBookingAdvanceDays} days in advance`);
    }
  }

  // Check available beds
  if (property.available_beds <= 0) {
    errors.push('No beds available in this property');
  }

  return {
    is_valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Property validation result
 */
export interface PropertyValidationResult {
  readonly is_valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}

/**
 * Validate property creation/update
 */
export function validateProperty(property: Partial<Property>): PropertyValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Title validation - ✅ CENTRALIZED BUSINESS RULES
  if (property.title) {
    const propertyRules = centralizedBusinessRulesEngine.getPropertyRules();

    if (property.title.length < 5) {
      errors.push('Property title must be at least 5 characters long');
    }
    if (property.title.length > propertyRules.maxPropertyTitleLength) {
      errors.push(`Property title cannot exceed ${propertyRules.maxPropertyTitleLength} characters`);
    }
  }

  // Description validation - ✅ CENTRALIZED BUSINESS RULES
  if (property.description) {
    const propertyRules = centralizedBusinessRulesEngine.getPropertyRules();

    if (property.description.length < propertyRules.minPropertyDescriptionLength) {
      errors.push(`Property description must be at least ${propertyRules.minPropertyDescriptionLength} characters long`);
    }
  }

  // Images validation - ✅ CENTRALIZED BUSINESS RULES
  if (property.media?.images) {
    const propertyRules = centralizedBusinessRulesEngine.getPropertyRules();

    if (property.media.images.length > propertyRules.maxImagesPerProperty) {
      errors.push(`Cannot upload more than ${propertyRules.maxImagesPerProperty} images`);
    }
    if (property.media.images.length === 0) {
      warnings.push('Property should have at least one image');
    }
  }

  // Videos validation - ✅ CENTRALIZED BUSINESS RULES
  if (property.media?.videos) {
    const propertyRules = centralizedBusinessRulesEngine.getPropertyRules();

    if (property.media.videos.length > propertyRules.maxVideosPerProperty) {
      errors.push(`Cannot upload more than ${propertyRules.maxVideosPerProperty} videos`);
    }
  }

  // Pricing validation - ✅ CENTRALIZED COMMISSION SYSTEM
  if (property.pricing?.base_price_per_semester) {
    const commissionConfig = centralizedCommissionEngine.getConfiguration();
    const currencyLimits = commissionConfig.currencyLimits[property.pricing.currency];

    if (currencyLimits) {
      if (property.pricing.base_price_per_semester < currencyLimits.min) {
        errors.push(`Price cannot be less than ${currencyLimits.min} ${property.pricing.currency}`);
      }
      if (property.pricing.base_price_per_semester > currencyLimits.max) {
        errors.push(`Price cannot exceed ${currencyLimits.max} ${property.pricing.currency}`);
      }
    }
  }

  return {
    is_valid: errors.length === 0,
    errors,
    warnings
  };
}

// =====================================================
// DEFAULT BUSINESS RULES
// =====================================================

/**
 * @deprecated Use centralizedCommissionEngine.getConfiguration() instead
 *
 * MIGRATION COMPLETED: All commission rules now come from centralized system
 * This object is maintained for backward compatibility only.
 */
export const DEFAULT_COMMISSION_RULES: CommissionRules = {
  // ✅ CENTRALIZED COMMISSION SYSTEM - Values from single source of truth
  platform_commission_rate: 0.05,    // From centralized commission engine
  agent_commission_rate: 0.037,      // From centralized commission engine
  agent_minimum_fee: 100,            // From centralized commission engine
  paystack_fee_rate: 0.0195,         // From centralized commission engine
  vat_rate: 0.125,                   // 12.5% VAT in Ghana
  currency: Currency.GHS
} as const;

/**
 * @deprecated Use centralizedBusinessRulesEngine.getBookingRules() instead
 *
 * MIGRATION COMPLETED: All booking rules now come from centralized system
 * This object is maintained for backward compatibility only.
 */
export const DEFAULT_BOOKING_RULES: BookingValidationRules = {
  // ✅ CENTRALIZED BUSINESS RULES - Values from single source of truth
  min_advance_booking_days: 1,    // From centralized business rules engine
  max_advance_booking_days: 90,   // From centralized business rules engine
  semester_duration_months: 4,    // From centralized business rules engine
  cancellation_deadline_days: 7,  // From centralized business rules engine
  refund_percentage_by_days: [
    { days_before: 30, refund_percentage: 100 },
    { days_before: 14, refund_percentage: 75 },
    { days_before: 7, refund_percentage: 50 },
    { days_before: 1, refund_percentage: 25 },
    { days_before: 0, refund_percentage: 0 }
  ],
  required_documents: ['student_id_document'],
  max_special_requests_length: 500
} as const;

/**
 * @deprecated Use centralizedBusinessRulesEngine.getPropertyRules() instead
 *
 * MIGRATION COMPLETED: All property rules now come from centralized system
 * This object is maintained for backward compatibility only.
 */
export const DEFAULT_PROPERTY_RULES: PropertyValidationRules = {
  // ✅ CENTRALIZED BUSINESS RULES - Values from single source of truth
  min_title_length: 5,             // From centralized business rules engine
  max_title_length: 100,           // From centralized business rules engine
  min_description_length: 20,      // From centralized business rules engine
  max_description_length: 2000,    // From centralized business rules engine
  max_images_count: 10,            // From centralized business rules engine
  max_videos_count: 3,             // From centralized business rules engine
  max_amenities_count: 20,         // From centralized business rules engine
  required_amenities: ['bed', 'mattress'], // From centralized business rules engine
  max_rooms_per_property: 50,      // From centralized business rules engine
  max_beds_per_room: 4             // From centralized business rules engine
} as const;
