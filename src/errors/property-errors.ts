/**
 * Property-related Error Classes for ROOMi Platform
 */

import { AppError, ErrorContext } from './base';

/**
 * Property not found error
 */
export class PropertyNotFoundError extends AppError {
  readonly code = 'PROPERTY_NOT_FOUND';
  readonly statusCode = 404;
  readonly userMessage = 'Property not found';

  constructor(
    message: string,
    public readonly propertyId?: string,
    context?: ErrorContext
  ) {
    super(message, { ...context, propertyId });
  }
}

/**
 * Property not available error
 */
export class PropertyNotAvailableError extends AppError {
  readonly code = 'PROPERTY_NOT_AVAILABLE';
  readonly statusCode = 409;
  readonly userMessage = 'This property is no longer available';

  constructor(
    message: string,
    public readonly propertyId?: string,
    context?: ErrorContext
  ) {
    super(message, { ...context, propertyId });
  }
}

/**
 * Property upload error
 */
export class PropertyUploadError extends AppError {
  readonly code = 'PROPERTY_UPLOAD_FAILED';
  readonly statusCode = 400;
  readonly userMessage = 'Failed to upload property images';

  constructor(
    message: string,
    public readonly uploadType?: 'image' | 'video' | 'document',
    context?: ErrorContext
  ) {
    super(message, { ...context, uploadType });
  }
}

/**
 * Property verification failed error
 */
export class PropertyVerificationFailedError extends AppError {
  readonly code = 'PROPERTY_VERIFICATION_FAILED';
  readonly statusCode = 400;
  readonly userMessage = 'Property verification failed';

  constructor(
    message: string,
    public readonly verificationIssues?: string[],
    context?: ErrorContext
  ) {
    super(message, { ...context, verificationIssues });
  }
}

/**
 * Property ownership error
 */
export class PropertyOwnershipError extends AppError {
  readonly code = 'PROPERTY_OWNERSHIP_ERROR';
  readonly statusCode = 403;
  readonly userMessage = 'You do not have permission to modify this property';

  constructor(
    message: string,
    public readonly propertyId?: string,
    public readonly ownerId?: string,
    context?: ErrorContext
  ) {
    super(message, { ...context, propertyId, ownerId });
  }
}

/**
 * Property limit exceeded error
 */
export class PropertyLimitExceededError extends AppError {
  readonly code = 'PROPERTY_LIMIT_EXCEEDED';
  readonly statusCode = 429;
  readonly userMessage = 'You have reached the maximum number of properties allowed';

  constructor(
    message: string,
    public readonly currentCount?: number,
    public readonly maxAllowed?: number,
    context?: ErrorContext
  ) {
    super(message, { ...context, currentCount, maxAllowed });
  }
}

/**
 * Invalid property data error
 */
export class InvalidPropertyDataError extends AppError {
  readonly code = 'INVALID_PROPERTY_DATA';
  readonly statusCode = 400;
  readonly userMessage = 'Property information is invalid or incomplete';

  constructor(
    message: string,
    public readonly invalidFields?: string[],
    context?: ErrorContext
  ) {
    super(message, { ...context, invalidFields });
  }
}

/**
 * Property image error
 */
export class PropertyImageError extends AppError {
  readonly code = 'PROPERTY_IMAGE_ERROR';
  readonly statusCode = 400;
  readonly userMessage = 'Error processing property images';

  constructor(
    message: string,
    public readonly imageIssue?: 'size' | 'format' | 'count' | 'quality',
    context?: ErrorContext
  ) {
    super(message, { ...context, imageIssue });
  }
}

/**
 * Property booking conflict error
 */
export class PropertyBookingConflictError extends AppError {
  readonly code = 'PROPERTY_BOOKING_CONFLICT';
  readonly statusCode = 409;
  readonly userMessage = 'This property has conflicting bookings';

  constructor(
    message: string,
    public readonly conflictingBookings?: string[],
    context?: ErrorContext
  ) {
    super(message, { ...context, conflictingBookings });
  }
}

/**
 * Property maintenance error
 */
export class PropertyMaintenanceError extends AppError {
  readonly code = 'PROPERTY_MAINTENANCE';
  readonly statusCode = 503;
  readonly userMessage = 'Property is temporarily unavailable for maintenance';

  constructor(
    message: string,
    public readonly maintenanceEnd?: string,
    context?: ErrorContext
  ) {
    super(message, { ...context, maintenanceEnd });
  }
}

/**
 * Property transformation error
 */
export class PropertyTransformError extends AppError {
  readonly code = 'PROPERTY_TRANSFORM_ERROR';
  readonly statusCode = 500;
  readonly userMessage = 'Error processing property data';

  constructor(
    message: string,
    public readonly transformStep?: string,
    context?: ErrorContext
  ) {
    super(message, { ...context, transformStep });
  }
}

/**
 * Missing price error
 */
export class MissingPriceError extends AppError {
  readonly code = 'MISSING_PROPERTY_PRICE';
  readonly statusCode = 400;
  readonly userMessage = 'Property price information is required';

  constructor(
    message: string,
    public readonly propertyId?: string,
    context?: ErrorContext
  ) {
    super(message, { ...context, propertyId });
  }
}

/**
 * Invalid price error
 */
export class InvalidPriceError extends AppError {
  readonly code = 'INVALID_PROPERTY_PRICE';
  readonly statusCode = 400;
  readonly userMessage = 'Property price is invalid';

  constructor(
    message: string,
    public readonly price?: number,
    public readonly currency?: string,
    context?: ErrorContext
  ) {
    super(message, { ...context, price, currency });
  }
}
