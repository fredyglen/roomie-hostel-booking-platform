/**
 * 🍎 APPLE-GRADE TYPE FOUNDATION
 * BE CONSCIOUS Standards Compliance - Zero Tolerance Implementation
 * 
 * This file establishes the foundational branded types and Result patterns
 * required for Apple-grade development standards across the ROOMi platform.
 * 
 * @version 1.0.0
 * @compliance BE_CONSCIOUS_APPLE_GRADE
 */

// ============================================================================
// BRANDED TYPES FOR COMPILE-TIME SAFETY
// ============================================================================

// Core Entity IDs - Prevents mixing different ID types
export type UserId = string & { readonly __brand: 'UserId' };
export type PropertyId = string & { readonly __brand: 'PropertyId' };
export type BookingId = string & { readonly __brand: 'BookingId' };
export type PaymentId = string & { readonly __brand: 'PaymentId' };
export type SessionId = string & { readonly __brand: 'SessionId' };

// Property-Specific Branded Types
export type PropertyTitle = string & { readonly __brand: 'PropertyTitle' };
export type PropertyDescription = string & { readonly __brand: 'PropertyDescription' };
export type PropertyPrice = number & { readonly __brand: 'PropertyPrice' };
export type BedroomCount = number & { readonly __brand: 'BedroomCount' };
export type WashroomCount = number & { readonly __brand: 'WashroomCount' };
export type MaxOccupants = number & { readonly __brand: 'MaxOccupants' };

// User-Specific Branded Types
export type EmailAddress = string & { readonly __brand: 'EmailAddress' };
export type PhoneNumber = string & { readonly __brand: 'PhoneNumber' };
export type UserName = string & { readonly __brand: 'UserName' };

// Financial Branded Types
export type Amount = number & { readonly __brand: 'Amount' };
export type CommissionRate = number & { readonly __brand: 'CommissionRate' };
export type PlatformFee = number & { readonly __brand: 'PlatformFee' };

// Time-Based Branded Types
export type Timestamp = string & { readonly __brand: 'Timestamp' };
export type Duration = number & { readonly __brand: 'Duration' };

// ============================================================================
// BRANDED TYPE CONSTRUCTORS
// ============================================================================

export const createUserId = (id: string): UserId => id as UserId;
export const createPropertyId = (id: string): PropertyId => id as PropertyId;
export const createBookingId = (id: string): BookingId => id as BookingId;
export const createPaymentId = (id: string): PaymentId => id as PaymentId;
export const createSessionId = (id: string): SessionId => id as SessionId;

export const createPropertyTitle = (title: string): PropertyTitle => title as PropertyTitle;
export const createPropertyDescription = (desc: string): PropertyDescription => desc as PropertyDescription;
export const createPropertyPrice = (price: number): PropertyPrice => price as PropertyPrice;
export const createBedroomCount = (count: number): BedroomCount => count as BedroomCount;
export const createWashroomCount = (count: number): WashroomCount => count as WashroomCount;
export const createMaxOccupants = (count: number): MaxOccupants => count as MaxOccupants;

export const createEmailAddress = (email: string): EmailAddress => email as EmailAddress;
export const createPhoneNumber = (phone: string): PhoneNumber => phone as PhoneNumber;
export const createUserName = (name: string): UserName => name as UserName;

export const createAmount = (amount: number): Amount => amount as Amount;
export const createCommissionRate = (rate: number): CommissionRate => rate as CommissionRate;
export const createPlatformFee = (fee: number): PlatformFee => fee as PlatformFee;

export const createTimestamp = (timestamp: string): Timestamp => timestamp as Timestamp;
export const createDuration = (duration: number): Duration => duration as Duration;

// ============================================================================
// RESULT TYPES FOR COMPREHENSIVE ERROR HANDLING
// ============================================================================

/**
 * Base Result type - Apple standard for error handling
 * Replaces all try-catch blocks with explicit error handling
 */
export type Result<T, E = Error> = 
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: E };

/**
 * Async Result type for Promise-based operations
 */
export type AsyncResult<T, E = Error> = Promise<Result<T, E>>;

// ============================================================================
// DOMAIN-SPECIFIC ERROR TYPES
// ============================================================================

// Authentication Errors
export interface InvalidCredentialsError {
  readonly type: 'INVALID_CREDENTIALS';
  readonly message: string;
  readonly field?: 'email' | 'password';
}

export interface NetworkError {
  readonly type: 'NETWORK_ERROR';
  readonly message: string;
  readonly retryable: boolean;
  readonly retryAfter?: Duration;
}

export interface ServiceUnavailableError {
  readonly type: 'SERVICE_UNAVAILABLE';
  readonly message: string;
  readonly estimatedRecovery?: Timestamp;
}

// Property Errors
export interface PropertyNotFoundError {
  readonly type: 'PROPERTY_NOT_FOUND';
  readonly propertyId: PropertyId;
  readonly message: string;
}

export interface PropertyValidationError {
  readonly type: 'PROPERTY_VALIDATION_ERROR';
  readonly field: string;
  readonly message: string;
  readonly userFriendlyMessage: string;
}

// Database Errors
export interface DatabaseError {
  readonly type: 'DATABASE_ERROR';
  readonly operation: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
  readonly message: string;
  readonly retryable: boolean;
}

// ============================================================================
// APPLE-GRADE RESULT TYPE ALIASES
// ============================================================================

// Authentication Results
export type SignInResult = Result<
  { readonly user: UserId; readonly session: SessionId },
  InvalidCredentialsError | NetworkError | ServiceUnavailableError
>;

export type SignUpResult = Result<
  { readonly user: UserId; readonly requiresVerification: boolean },
  ValidationError | NetworkError | ServiceUnavailableError
>;

// Property Results
export type PropertyCreationResult = Result<
  { readonly propertyId: PropertyId; readonly status: 'DRAFT' | 'PENDING_REVIEW' },
  PropertyValidationError | DatabaseError
>;

export type PropertyFetchResult = Result<
  PropertyData,
  PropertyNotFoundError | DatabaseError
>;

// ============================================================================
// VALIDATION ERROR TYPE
// ============================================================================

export interface ValidationError {
  readonly type: 'VALIDATION_ERROR';
  readonly field: string;
  readonly message: string;
  readonly userFriendlyMessage: string;
  readonly code: string;
}

// ============================================================================
// PROPERTY DATA INTERFACE (APPLE-GRADE)
// ============================================================================

export interface PropertyData {
  readonly id: PropertyId;
  readonly title: PropertyTitle;
  readonly description: PropertyDescription;
  readonly price: PropertyPrice;
  readonly bedrooms: BedroomCount;
  readonly washrooms: WashroomCount;
  readonly maxOccupants: MaxOccupants;
  readonly ownerId: UserId;
  readonly createdAt: Timestamp;
  readonly updatedAt: Timestamp;
}

export interface UserProfile {
  readonly id: UserId;
  readonly email: EmailAddress;
  readonly firstName: UserName;
  readonly lastName: UserName;
  readonly role: 'student' | 'owner' | 'agent' | 'admin';
  readonly createdAt: Timestamp;
  readonly updatedAt: Timestamp;
}

// ============================================================================
// TYPE GUARDS FOR RUNTIME VALIDATION
// ============================================================================

export const isUserId = (value: unknown): value is UserId => {
  return typeof value === 'string' && value.length > 0;
};

export const isPropertyId = (value: unknown): value is PropertyId => {
  return typeof value === 'string' && value.length > 0;
};

export const isEmailAddress = (value: unknown): value is EmailAddress => {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

export const isPropertyPrice = (value: unknown): value is PropertyPrice => {
  return typeof value === 'number' && value > 0;
};

// ============================================================================
// RESULT HELPER FUNCTIONS
// ============================================================================

export const success = <T>(data: T): Result<T, never> => ({
  success: true,
  data
});

export const failure = <E>(error: E): Result<never, E> => ({
  success: false,
  error
});

export const isSuccess = <T, E>(result: Result<T, E>): result is { success: true; data: T } => {
  return result.success;
};

export const isFailure = <T, E>(result: Result<T, E>): result is { success: false; error: E } => {
  return !result.success;
};
