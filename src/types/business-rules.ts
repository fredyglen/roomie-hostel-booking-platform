/**
 * ROOMi Platform Business Rules & Validation
 * Apple-Grade TypeScript definitions for business logic and validation rules
 * 
 * This file defines all business rules, validation logic, and workflow
 * constraints for the ROOMi platform with complete type safety.
 * 
 * @version 1.0.0
 * @author ROOMi Platform Team
 */

import {
  BookingStatus,
  PaymentStatus,
  UserRole,
  PropertyType,
  Currency,
  SemesterPeriod,
  PLATFORM_RULES
} from './platform-core';

import {
  Booking,
  Property,
  User,
  PaymentTransaction
} from './platform-entities';

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

  // Check booking dates
  if (booking.check_in_date) {
    const checkInDate = new Date(booking.check_in_date);
    const today = new Date();
    const daysUntilCheckIn = Math.ceil((checkInDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilCheckIn < PLATFORM_RULES.MIN_BOOKING_ADVANCE_DAYS) {
      errors.push(`Booking must be made at least ${PLATFORM_RULES.MIN_BOOKING_ADVANCE_DAYS} day(s) in advance`);
    }

    if (daysUntilCheckIn > PLATFORM_RULES.MAX_BOOKING_ADVANCE_DAYS) {
      errors.push(`Booking cannot be made more than ${PLATFORM_RULES.MAX_BOOKING_ADVANCE_DAYS} days in advance`);
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

  // Title validation
  if (property.title) {
    if (property.title.length < 5) {
      errors.push('Property title must be at least 5 characters long');
    }
    if (property.title.length > PLATFORM_RULES.MAX_PROPERTY_TITLE_LENGTH) {
      errors.push(`Property title cannot exceed ${PLATFORM_RULES.MAX_PROPERTY_TITLE_LENGTH} characters`);
    }
  }

  // Description validation
  if (property.description) {
    if (property.description.length < PLATFORM_RULES.MIN_PROPERTY_DESCRIPTION_LENGTH) {
      errors.push(`Property description must be at least ${PLATFORM_RULES.MIN_PROPERTY_DESCRIPTION_LENGTH} characters long`);
    }
  }

  // Images validation
  if (property.media?.images) {
    if (property.media.images.length > PLATFORM_RULES.MAX_IMAGES_PER_PROPERTY) {
      errors.push(`Cannot upload more than ${PLATFORM_RULES.MAX_IMAGES_PER_PROPERTY} images`);
    }
    if (property.media.images.length === 0) {
      warnings.push('Property should have at least one image');
    }
  }

  // Videos validation
  if (property.media?.videos && property.media.videos.length > PLATFORM_RULES.MAX_VIDEOS_PER_PROPERTY) {
    errors.push(`Cannot upload more than ${PLATFORM_RULES.MAX_VIDEOS_PER_PROPERTY} videos`);
  }

  // Pricing validation
  if (property.pricing?.base_price_per_semester) {
    const currencyLimits = PLATFORM_RULES.CURRENCY_LIMITS[property.pricing.currency];
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
 * Default commission rules for Ghana market
 */
export const DEFAULT_COMMISSION_RULES: CommissionRules = {
  platform_commission_rate: PLATFORM_RULES.PLATFORM_COMMISSION_RATE,
  agent_commission_rate: PLATFORM_RULES.AGENT_COMMISSION_RATE,
  agent_minimum_fee: PLATFORM_RULES.AGENT_MINIMUM_FEE,
  paystack_fee_rate: PLATFORM_RULES.PAYSTACK_FEE_RATE,
  vat_rate: 0.125, // 12.5% VAT in Ghana
  currency: Currency.GHS
} as const;

/**
 * Default booking validation rules
 */
export const DEFAULT_BOOKING_RULES: BookingValidationRules = {
  min_advance_booking_days: PLATFORM_RULES.MIN_BOOKING_ADVANCE_DAYS,
  max_advance_booking_days: PLATFORM_RULES.MAX_BOOKING_ADVANCE_DAYS,
  semester_duration_months: PLATFORM_RULES.SEMESTER_DURATION_MONTHS,
  cancellation_deadline_days: 7,
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
 * Default property validation rules
 */
export const DEFAULT_PROPERTY_RULES: PropertyValidationRules = {
  min_title_length: 5,
  max_title_length: PLATFORM_RULES.MAX_PROPERTY_TITLE_LENGTH,
  min_description_length: PLATFORM_RULES.MIN_PROPERTY_DESCRIPTION_LENGTH,
  max_description_length: 2000,
  max_images_count: PLATFORM_RULES.MAX_IMAGES_PER_PROPERTY,
  max_videos_count: PLATFORM_RULES.MAX_VIDEOS_PER_PROPERTY,
  max_amenities_count: 20,
  required_amenities: ['bed', 'mattress'],
  max_rooms_per_property: 50,
  max_beds_per_room: 4
} as const;
