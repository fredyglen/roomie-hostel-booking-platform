// Minimal recreation of apple-grade-foundation types
// Only includes types still imported by active code

// Result types
export type Result<T, E = Error> = 
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: E };

export type AsyncResult<T, E = Error> = Promise<Result<T, E>>;

export const success = <T>(data: T): Result<T, never> => ({ success: true, data });
export const failure = <E>(error: E): Result<never, E> => ({ success: false, error });

// Branded types
export type UserId = string & { readonly __brand: 'UserId' };
export type SessionId = string & { readonly __brand: 'SessionId' };
export type EmailAddress = string & { readonly __brand: 'EmailAddress' };
export type UserName = string & { readonly __brand: 'UserName' };
export type Timestamp = string & { readonly __brand: 'Timestamp' };
export type Duration = number & { readonly __brand: 'Duration' };

export const createUserId = (id: string): UserId => id as UserId;
export const createSessionId = (id: string): SessionId => id as SessionId;
export const createEmailAddress = (email: string): EmailAddress => email as EmailAddress;
export const createUserName = (name: string): UserName => name as UserName;
export const createTimestamp = (ts: string): Timestamp => ts as Timestamp;
export const createDuration = (d: number): Duration => d as Duration;

// Property branded types
export type PropertyTitle = string & { readonly __brand: 'PropertyTitle' };
export type PropertyDescription = string & { readonly __brand: 'PropertyDescription' };
export type PropertyPrice = number & { readonly __brand: 'PropertyPrice' };
export type BedroomCount = number & { readonly __brand: 'BedroomCount' };
export type WashroomCount = number & { readonly __brand: 'WashroomCount' };
export type MaxOccupants = number & { readonly __brand: 'MaxOccupants' };

export const createPropertyTitle = (title: string): PropertyTitle => title as PropertyTitle;
export const createPropertyDescription = (desc: string): PropertyDescription => desc as PropertyDescription;
export const createPropertyPrice = (price: number): PropertyPrice => price as PropertyPrice;
export const createBedroomCount = (count: number): BedroomCount => count as BedroomCount;
export const createWashroomCount = (count: number): WashroomCount => count as WashroomCount;
export const createMaxOccupants = (count: number): MaxOccupants => count as MaxOccupants;

// Error types
export class InvalidCredentialsError extends Error {
  constructor(message = 'Invalid credentials') {
    super(message);
    this.name = 'InvalidCredentialsError';
  }
}

export class NetworkError extends Error {
  constructor(message = 'Network error') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ServiceUnavailableError extends Error {
  constructor(message = 'Service unavailable') {
    super(message);
    this.name = 'ServiceUnavailableError';
  }
}

export class ValidationError extends Error {
  constructor(message = 'Validation error') {
    super(message);
    this.name = 'ValidationError';
  }
}

export class DatabaseError extends Error {
  constructor(message = 'Database error') {
    super(message);
    this.name = 'DatabaseError';
  }
}

// Auth result types
export interface SignInResult {
  readonly userId: UserId;
  readonly sessionId: SessionId;
  readonly email: EmailAddress;
}

export interface SignUpResult {
  readonly userId: UserId;
  readonly email: EmailAddress;
}

// User types
export interface UserProfile {
  readonly id: UserId;
  readonly email: EmailAddress;
  readonly firstName?: UserName;
  readonly lastName?: UserName;
  readonly role?: 'student' | 'owner' | 'agent' | 'admin';
}

// Property types
export interface PropertyData {
  readonly id: string;
  readonly title: string;
  readonly ownerId: string;
  readonly status: 'active' | 'inactive' | 'pending';
}
