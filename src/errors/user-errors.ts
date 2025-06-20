/**
 * User-related Error Classes for ROOMi Platform
 */

import { AppError, ErrorContext } from './base';

/**
 * User not found error
 */
export class UserNotFoundError extends AppError {
  readonly code = 'USER_NOT_FOUND';
  readonly statusCode = 404;
  readonly userMessage = 'User account not found';

  constructor(
    message: string,
    public readonly userId?: string,
    context?: ErrorContext
  ) {
    super(message, { ...context, userId });
  }
}

/**
 * Invalid credentials error
 */
export class InvalidCredentialsError extends AppError {
  readonly code = 'INVALID_CREDENTIALS';
  readonly statusCode = 401;
  readonly userMessage = 'Invalid email or password';

  constructor(message: string, context?: ErrorContext) {
    super(message, context);
  }
}

/**
 * Account locked error
 */
export class AccountLockedError extends AppError {
  readonly code = 'ACCOUNT_LOCKED';
  readonly statusCode = 423;
  readonly userMessage = 'Account temporarily locked due to too many failed login attempts';

  constructor(
    message: string,
    public readonly lockoutDuration?: number,
    context?: ErrorContext
  ) {
    super(message, { ...context, lockoutDuration });
  }
}

/**
 * Email already exists error
 */
export class EmailAlreadyExistsError extends AppError {
  readonly code = 'EMAIL_ALREADY_EXISTS';
  readonly statusCode = 409;
  readonly userMessage = 'An account with this email already exists';

  constructor(
    message: string,
    public readonly email?: string,
    context?: ErrorContext
  ) {
    super(message, { ...context, email });
  }
}

/**
 * Email verification required error
 */
export class EmailVerificationRequiredError extends AppError {
  readonly code = 'EMAIL_VERIFICATION_REQUIRED';
  readonly statusCode = 403;
  readonly userMessage = 'Please verify your email address to continue';

  constructor(message: string, context?: ErrorContext) {
    super(message, context);
  }
}

/**
 * Password too weak error
 */
export class WeakPasswordError extends AppError {
  readonly code = 'WEAK_PASSWORD';
  readonly statusCode = 400;
  readonly userMessage = 'Password does not meet security requirements';

  constructor(
    message: string,
    public readonly requirements?: string[],
    context?: ErrorContext
  ) {
    super(message, { ...context, requirements });
  }
}

/**
 * Profile incomplete error
 */
export class IncompleteProfileError extends AppError {
  readonly code = 'INCOMPLETE_PROFILE';
  readonly statusCode = 400;
  readonly userMessage = 'Please complete your profile to continue';

  constructor(
    message: string,
    public readonly missingFields?: string[],
    context?: ErrorContext
  ) {
    super(message, { ...context, missingFields });
  }
}

/**
 * Session expired error
 */
export class SessionExpiredError extends AppError {
  readonly code = 'SESSION_EXPIRED';
  readonly statusCode = 401;
  readonly userMessage = 'Your session has expired. Please log in again';

  constructor(message: string, context?: ErrorContext) {
    super(message, context);
  }
}

/**
 * Invalid role error
 */
export class InvalidRoleError extends AppError {
  readonly code = 'INVALID_ROLE';
  readonly statusCode = 403;
  readonly userMessage = 'You do not have the required role for this action';

  constructor(
    message: string,
    public readonly requiredRole?: string,
    public readonly currentRole?: string,
    context?: ErrorContext
  ) {
    super(message, { ...context, requiredRole, currentRole });
  }
}

/**
 * Account suspended error
 */
export class AccountSuspendedError extends AppError {
  readonly code = 'ACCOUNT_SUSPENDED';
  readonly statusCode = 403;
  readonly userMessage = 'Your account has been suspended. Please contact support';

  constructor(
    message: string,
    public readonly reason?: string,
    context?: ErrorContext
  ) {
    super(message, { ...context, reason });
  }
}
