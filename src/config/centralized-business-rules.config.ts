/**
 * Centralized Business Rules Engine
 * Single source of truth for all business logic
 */

import { logger as enhancedLogger } from '@/utils/enhanced-logger';

type DurationMonths = number;
type AdvanceDays = number;
type MaxCount = number;
type MinLength = number;
type MaxLength = number;

const createDurationMonths = (months: number): DurationMonths => {
  if (months < 1 || months > 12) {
    throw new Error(`Duration months must be between 1 and 12, got: ${months}`);
  }
  return months as DurationMonths;
};

const createAdvanceDays = (days: number): AdvanceDays => {
  if (days < 0 || days > 365) {
    throw new Error(`Advance days must be between 0 and 365, got: ${days}`);
  }
  return days as AdvanceDays;
};

const createMaxCount = (count: number): MaxCount => {
  if (count < 1 || count > 1000) {
    throw new Error(`Max count must be between 1 and 1000, got: ${count}`);
  }
  return count as MaxCount;
};

const createMinLength = (length: number): MinLength => {
  if (length < 0) {
    throw new Error(`Min length must be non-negative, got: ${length}`);
  }
  return length as MinLength;
};

const createMaxLength = (length: number): MaxLength => {
  if (length < 1) {
    throw new Error(`Max length must be positive, got: ${length}`);
  }
  return length as MaxLength;
};

// ============================================================================
// BUSINESS RULES INTERFACES
// ============================================================================

interface BookingRules {
  readonly semesterDurationMonths: DurationMonths;
  readonly maxBookingAdvanceDays: AdvanceDays;
  readonly minBookingAdvanceDays: AdvanceDays;
  readonly cancellationDeadlineDays: AdvanceDays;
  readonly maxSpecialRequestsLength: MaxLength;
  readonly requiredDocuments: readonly string[];
  readonly refundPolicy: readonly {
    readonly daysBefore: number;
    readonly refundPercentage: number;
  }[];
}

interface PropertyRules {
  readonly maxImagesPerProperty: MaxCount;
  readonly maxVideosPerProperty: MaxCount;
  readonly maxPropertyTitleLength: MaxLength;
  readonly minPropertyDescriptionLength: MinLength;
  readonly maxPropertyDescriptionLength: MaxLength;
  readonly maxAmenitiesCount: MaxCount;
  readonly maxRoomsPerProperty: MaxCount;
  readonly maxBedsPerRoom: MaxCount;
  readonly minBedsPerRoom: MaxCount;
  readonly requiredAmenities: readonly string[];
}

interface UserRules {
  readonly minPasswordLength: MinLength;
  readonly maxLoginAttempts: MaxCount;
  readonly sessionTimeoutMinutes: number;
  readonly anonymousTimeLimitMinutes: number;
  readonly maxNameLength: MaxLength;
  readonly minNameLength: MinLength;
}

interface FileUploadRules {
  readonly maxImageSizeMB: number;
  readonly maxVideoSizeMB: number;
  readonly allowedImageTypes: readonly string[];
  readonly allowedVideoTypes: readonly string[];
  readonly allowedDocumentTypes: readonly string[];
}

interface ValidationRules {
  readonly emailRegex: RegExp;
  readonly phoneRegex: RegExp;
  readonly passwordRegex: RegExp;
  readonly nameRegex: RegExp;
  readonly studentIdRegex: RegExp;
}

interface BusinessRulesConfiguration {
  readonly booking: BookingRules;
  readonly property: PropertyRules;
  readonly user: UserRules;
  readonly fileUpload: FileUploadRules;
  readonly validation: ValidationRules;
  readonly environment: 'development' | 'staging' | 'production';
  readonly lastUpdated: string;
  readonly version: string;
}

// ============================================================================
// AUTHORITATIVE BUSINESS RULES CONFIGURATION
// ============================================================================

/**
 * SINGLE SOURCE OF TRUTH FOR ALL BUSINESS RULES
 * 
 * These rules are the definitive business logic for ROOMi Platform.
 * Any changes to business rules MUST be made here and nowhere else.
 * 
 * Business Rules (as of 2025-01-08):
 * - Semester Duration: 4 months (Ghana academic calendar)
 * - Booking Advance: 1-90 days (operational requirements)
 * - Property Limits: Based on platform capacity and UX research
 * - User Security: Following industry best practices
 * - File Uploads: Optimized for Ghana internet speeds
 */
const AUTHORITATIVE_BUSINESS_RULES: BusinessRulesConfiguration = {
  booking: {
    semesterDurationMonths: createDurationMonths(4),     // 4 months - Ghana standard
    maxBookingAdvanceDays: createAdvanceDays(90),        // 90 days maximum advance
    minBookingAdvanceDays: createAdvanceDays(1),         // 1 day minimum advance
    cancellationDeadlineDays: createAdvanceDays(7),      // 7 days cancellation deadline
    maxSpecialRequestsLength: createMaxLength(500),      // 500 characters max
    requiredDocuments: ['student_id_document'],          // Required documents
    refundPolicy: [
      { daysBefore: 30, refundPercentage: 100 },
      { daysBefore: 14, refundPercentage: 75 },
      { daysBefore: 7, refundPercentage: 50 },
      { daysBefore: 1, refundPercentage: 25 },
      { daysBefore: 0, refundPercentage: 0 }
    ]
  },
  property: {
    maxImagesPerProperty: createMaxCount(10),            // 10 images max
    maxVideosPerProperty: createMaxCount(3),             // 3 videos max
    maxPropertyTitleLength: createMaxLength(100),        // 100 characters max
    minPropertyDescriptionLength: createMinLength(20),   // 20 characters min
    maxPropertyDescriptionLength: createMaxLength(2000), // 2000 characters max
    maxAmenitiesCount: createMaxCount(20),               // 20 amenities max
    maxRoomsPerProperty: createMaxCount(50),             // 50 rooms max
    maxBedsPerRoom: createMaxCount(4),                   // 4 beds per room max
    minBedsPerRoom: createMaxCount(1),                   // 1 bed per room min
    requiredAmenities: ['bed', 'mattress']               // Required amenities
  },
  user: {
    minPasswordLength: createMinLength(8),               // 8 characters minimum
    maxLoginAttempts: createMaxCount(5),                 // 5 attempts before lockout
    sessionTimeoutMinutes: 30,                           // 30 minutes session timeout
    anonymousTimeLimitMinutes: 15,                       // 15 minutes anonymous browsing
    maxNameLength: createMaxLength(50),                  // 50 characters max name
    minNameLength: createMinLength(2)                    // 2 characters min name
  },
  fileUpload: {
    maxImageSizeMB: 5,                                   // 5MB max image size
    maxVideoSizeMB: 50,                                  // 50MB max video size
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
    allowedVideoTypes: ['video/mp4', 'video/webm'],
    allowedDocumentTypes: ['application/pdf', 'image/jpeg', 'image/png']
  },
  validation: {
    emailRegex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phoneRegex: /^(\+233|0)[2-9]\d{8}$/,                // Ghana phone format
    passwordRegex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    nameRegex: /^[a-zA-Z\s'-]+$/,
    studentIdRegex: /^[A-Z0-9]{6,15}$/                   // Student ID format
  },
  environment: (process.env.NODE_ENV as any) || 'development',
  lastUpdated: '2025-01-08T00:00:00Z',
  version: '2.1.0'
} as const;

// ============================================================================
// BUSINESS RULES ENGINE
// ============================================================================

interface ValidationResult {
  readonly isValid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}

class CentralizedBusinessRulesEngine {
  private readonly config: BusinessRulesConfiguration;

  constructor() {
    this.config = AUTHORITATIVE_BUSINESS_RULES;
    this.validateConfiguration();
    enhancedLogger.info('Centralized Business Rules Engine initialized', {
      version: this.config.version,
      environment: this.config.environment,
      semesterDuration: this.config.booking.semesterDurationMonths,
      maxAdvanceDays: this.config.booking.maxBookingAdvanceDays
    });
  }

  /**
   * Get booking rules
   */
  getBookingRules(): BookingRules {
    return { ...this.config.booking };
  }

  /**
   * Get property rules
   */
  getPropertyRules(): PropertyRules {
    return { ...this.config.property };
  }

  /**
   * Get user rules
   */
  getUserRules(): UserRules {
    return { ...this.config.user };
  }

  /**
   * Get file upload rules
   */
  getFileUploadRules(): FileUploadRules {
    return { ...this.config.fileUpload };
  }

  /**
   * Get validation rules
   */
  getValidationRules(): ValidationRules {
    return { ...this.config.validation };
  }

  /**
   * Validate booking creation
   */
  validateBookingCreation(bookingData: {
    checkInDate: string;
    specialRequests?: string;
    documents: string[];
  }): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check advance booking days
    const checkInDate = new Date(bookingData.checkInDate);
    const today = new Date();
    const daysUntilCheckIn = Math.ceil((checkInDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilCheckIn < this.config.booking.minBookingAdvanceDays) {
      errors.push(`Booking must be made at least ${this.config.booking.minBookingAdvanceDays} day(s) in advance`);
    }

    if (daysUntilCheckIn > this.config.booking.maxBookingAdvanceDays) {
      errors.push(`Booking cannot be made more than ${this.config.booking.maxBookingAdvanceDays} days in advance`);
    }

    // Check special requests length
    if (bookingData.specialRequests && bookingData.specialRequests.length > this.config.booking.maxSpecialRequestsLength) {
      errors.push(`Special requests cannot exceed ${this.config.booking.maxSpecialRequestsLength} characters`);
    }

    // Check required documents
    const missingDocuments = this.config.booking.requiredDocuments.filter(
      doc => !bookingData.documents.includes(doc)
    );
    if (missingDocuments.length > 0) {
      errors.push(`Missing required documents: ${missingDocuments.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate property creation
   */
  validatePropertyCreation(propertyData: {
    title: string;
    description: string;
    images: string[];
    videos: string[];
    amenities: string[];
    rooms: number;
    bedsPerRoom: number;
  }): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate title length
    if (propertyData.title.length > this.config.property.maxPropertyTitleLength) {
      errors.push(`Property title cannot exceed ${this.config.property.maxPropertyTitleLength} characters`);
    }

    // Validate description length
    if (propertyData.description.length < this.config.property.minPropertyDescriptionLength) {
      errors.push(`Property description must be at least ${this.config.property.minPropertyDescriptionLength} characters`);
    }

    if (propertyData.description.length > this.config.property.maxPropertyDescriptionLength) {
      errors.push(`Property description cannot exceed ${this.config.property.maxPropertyDescriptionLength} characters`);
    }

    // Validate media counts
    if (propertyData.images.length > this.config.property.maxImagesPerProperty) {
      errors.push(`Cannot upload more than ${this.config.property.maxImagesPerProperty} images`);
    }

    if (propertyData.videos.length > this.config.property.maxVideosPerProperty) {
      errors.push(`Cannot upload more than ${this.config.property.maxVideosPerProperty} videos`);
    }

    // Validate amenities count
    if (propertyData.amenities.length > this.config.property.maxAmenitiesCount) {
      errors.push(`Cannot have more than ${this.config.property.maxAmenitiesCount} amenities`);
    }

    // Check required amenities
    const missingAmenities = this.config.property.requiredAmenities.filter(
      amenity => !propertyData.amenities.includes(amenity)
    );
    if (missingAmenities.length > 0) {
      warnings.push(`Consider adding required amenities: ${missingAmenities.join(', ')}`);
    }

    // Validate room and bed counts
    if (propertyData.rooms > this.config.property.maxRoomsPerProperty) {
      errors.push(`Cannot have more than ${this.config.property.maxRoomsPerProperty} rooms`);
    }

    if (propertyData.bedsPerRoom > this.config.property.maxBedsPerRoom) {
      errors.push(`Cannot have more than ${this.config.property.maxBedsPerRoom} beds per room`);
    }

    if (propertyData.bedsPerRoom < this.config.property.minBedsPerRoom) {
      errors.push(`Must have at least ${this.config.property.minBedsPerRoom} bed per room`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate configuration integrity
   */
  private validateConfiguration(): void {
    const { booking, property, user } = this.config;

    // Validate booking rules
    if (booking.semesterDurationMonths < 1 || booking.semesterDurationMonths > 12) {
      throw new Error(`Invalid semester duration: ${booking.semesterDurationMonths}`);
    }

    if (booking.minBookingAdvanceDays >= booking.maxBookingAdvanceDays) {
      throw new Error('Min booking advance days must be less than max booking advance days');
    }

    // Validate property rules
    if (property.minPropertyDescriptionLength >= property.maxPropertyDescriptionLength) {
      throw new Error('Min description length must be less than max description length');
    }

    // Validate user rules
    if (user.minPasswordLength < 6) {
      throw new Error('Minimum password length must be at least 6 characters');
    }

    enhancedLogger.info('Business rules configuration validated successfully');
  }

  /**
   * Get configuration metadata
   */
  getConfigurationInfo(): {
    version: string;
    lastUpdated: string;
    environment: string;
  } {
    return {
      version: this.config.version,
      lastUpdated: this.config.lastUpdated,
      environment: this.config.environment
    };
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const centralizedBusinessRulesEngine = new CentralizedBusinessRulesEngine();

// Export types for external use
export type {
  DurationMonths,
  AdvanceDays,
  MaxCount,
  MinLength,
  MaxLength,
  BookingRules,
  PropertyRules,
  UserRules,
  FileUploadRules,
  ValidationRules,
  BusinessRulesConfiguration,
  ValidationResult
};

export {
  createDurationMonths,
  createAdvanceDays,
  createMaxCount,
  createMinLength,
  createMaxLength
};

// Export configuration for read-only access
export const BUSINESS_RULES_CONFIG = AUTHORITATIVE_BUSINESS_RULES;
