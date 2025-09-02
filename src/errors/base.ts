/**
 * Base Error Classes for ROOMi Platform
 * Provides consistent error handling with proper typing and context
 */

export interface ErrorContext {
  readonly [key: string]: unknown;
}

export interface ErrorResponse {
  readonly success: false;
  readonly error: {
    readonly code: string;
    readonly message: string;
    readonly details?: string;
    readonly context?: ErrorContext;
  };
}

export interface SuccessResponse<T> {
  readonly success: true;
  readonly data: T;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

/**
 * Base application error class
 * All custom errors should extend this class
 */
export abstract class AppError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;
  abstract readonly userMessage: string;
  
  constructor(
    message: string,
    public readonly context?: ErrorContext
  ) {
    super(message);
    this.name = this.constructor.name;
    
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Convert error to API response format
   */
  toResponse(): ErrorResponse {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.userMessage,
        details: this.message,
        context: this.context
      }
    };
  }

  /**
   * Convert error to JSON for logging
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      userMessage: this.userMessage,
      statusCode: this.statusCode,
      context: this.context,
      stack: this.stack
    };
  }
}

/**
 * Validation error for input validation failures
 */
export class ValidationError extends AppError {
  readonly code = 'VALIDATION_ERROR';
  readonly statusCode = 400;
  readonly userMessage = 'Please check your input and try again';

  constructor(
    message: string,
    public readonly field?: string,
    context?: ErrorContext
  ) {
    super(message, { ...context, field });
  }
}

/**
 * Authentication error for login/auth failures
 */
export class AuthenticationError extends AppError {
  readonly code = 'AUTHENTICATION_ERROR';
  readonly statusCode = 401;
  readonly userMessage = 'Authentication required';

  constructor(message: string, context?: ErrorContext) {
    super(message, context);
  }
}

/**
 * Authorization error for permission failures
 */
export class AuthorizationError extends AppError {
  readonly code = 'AUTHORIZATION_ERROR';
  readonly statusCode = 403;
  readonly userMessage = 'You do not have permission to perform this action';

  constructor(message: string, context?: ErrorContext) {
    super(message, context);
  }
}

/**
 * Not found error for missing resources
 */
export class NotFoundError extends AppError {
  readonly code = 'NOT_FOUND';
  readonly statusCode = 404;
  readonly userMessage = 'The requested resource was not found';

  constructor(
    message: string,
    public readonly resource?: string,
    context?: ErrorContext
  ) {
    super(message, { ...context, resource });
  }
}

/**
 * Conflict error for resource conflicts
 */
export class ConflictError extends AppError {
  readonly code = 'CONFLICT';
  readonly statusCode = 409;
  readonly userMessage = 'This action conflicts with existing data';

  constructor(message: string, context?: ErrorContext) {
    super(message, context);
  }
}

/**
 * Rate limit error for too many requests
 */
export class RateLimitError extends AppError {
  readonly code = 'RATE_LIMIT_EXCEEDED';
  readonly statusCode = 429;
  readonly userMessage = 'Too many requests. Please try again later';

  constructor(
    message: string,
    public readonly retryAfter?: number,
    context?: ErrorContext
  ) {
    super(message, { ...context, retryAfter });
  }
}

/**
 * Internal server error for unexpected failures
 */
export class InternalServerError extends AppError {
  readonly code = 'INTERNAL_SERVER_ERROR';
  readonly statusCode = 500;
  readonly userMessage = 'An unexpected error occurred. Please try again later';

  constructor(message: string, context?: ErrorContext) {
    super(message, context);
  }
}

/**
 * Service unavailable error for external service failures
 */
export class ServiceUnavailableError extends AppError {
  readonly code = 'SERVICE_UNAVAILABLE';
  readonly statusCode = 503;
  readonly userMessage = 'Service temporarily unavailable. Please try again later';

  constructor(
    message: string,
    public readonly service?: string,
    context?: ErrorContext
  ) {
    super(message, { ...context, service });
  }
}

/**
 * Network error for connection failures
 */
export class NetworkError extends AppError {
  readonly code = 'NETWORK_ERROR';
  readonly statusCode = 0;
  readonly userMessage = 'Network connection failed. Please check your internet connection';

  constructor(message: string, context?: ErrorContext) {
    super(message, context);
  }
}

/**
 * Timeout error for request timeouts
 */
export class TimeoutError extends AppError {
  readonly code = 'TIMEOUT_ERROR';
  readonly statusCode = 408;
  readonly userMessage = 'Request timed out. Please try again';

  constructor(
    message: string,
    public readonly timeout?: number,
    context?: ErrorContext
  ) {
    super(message, { ...context, timeout });
  }
}

/**
 * Type guard to check if error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Type guard to check if response is an error response
 */
export function isErrorResponse<T>(response: ApiResponse<T>): response is ErrorResponse {
  return !response.success;
}

/**
 * Type guard to check if response is a success response
 */
export function isSuccessResponse<T>(response: ApiResponse<T>): response is SuccessResponse<T> {
  return response.success;
}

/**
 * Create success response
 */
export function createSuccessResponse<T>(data: T): SuccessResponse<T> {
  return {
    success: true,
    data
  };
}

/**
 * Create error response from error
 */
export function createErrorResponse(error: AppError): ErrorResponse {
  return error.toResponse();
}
