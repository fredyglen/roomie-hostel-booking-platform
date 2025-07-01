/**
 * Development Environment Error Types
 * Apple-Level error handling for development components
 *
 * @fileoverview Comprehensive error types for development environment features
 * @author ROOMi Development Team
 * @version 1.0.0
 * @since 2025-06-21
 */

/**
 * Base development environment error
 */
export class DevEnvironmentError extends Error {
  readonly code: string;
  readonly timestamp: Date;
  readonly context: Record<string, unknown>;

  constructor(
    message: string,
    code: string = 'DEV_ENVIRONMENT_ERROR',
    context: Record<string, unknown> = {}
  ) {
    super(message);
    this.name = 'DevEnvironmentError';
    this.code = code;
    this.timestamp = new Date();
    this.context = context;

    // Maintain proper stack trace for V8
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DevEnvironmentError);
    }
  }
}

/**
 * Invalid environment configuration error
 */
export class InvalidEnvironmentError extends DevEnvironmentError {
  constructor(
    message: string,
    context: Record<string, unknown> = {}
  ) {
    super(message, 'INVALID_ENVIRONMENT', context);
    this.name = 'InvalidEnvironmentError';
  }
}

/**
 * Security violation in development environment
 */
export class SecurityViolationError extends DevEnvironmentError {
  readonly severity: 'low' | 'medium' | 'high';
  readonly violationType: string;

  constructor(
    message: string,
    severity: 'low' | 'medium' | 'high' = 'medium',
    violationType: string = 'UNAUTHORIZED_ACCESS',
    context: Record<string, unknown> = {}
  ) {
    super(message, 'SECURITY_VIOLATION', context);
    this.name = 'SecurityViolationError';
    this.severity = severity;
    this.violationType = violationType;
  }
}

/**
 * Development feature not available error
 */
export class DevFeatureUnavailableError extends DevEnvironmentError {
  readonly featureName: string;
  readonly reason: string;

  constructor(
    featureName: string,
    reason: string,
    context: Record<string, unknown> = {}
  ) {
    super(`Development feature '${featureName}' is not available: ${reason}`, 'DEV_FEATURE_UNAVAILABLE', context);
    this.name = 'DevFeatureUnavailableError';
    this.featureName = featureName;
    this.reason = reason;
  }
}

/**
 * Environment configuration validation error
 */
export class EnvironmentConfigError extends DevEnvironmentError {
  readonly configField: string;
  readonly expectedType: string;
  readonly actualValue: unknown;

  constructor(
    configField: string,
    expectedType: string,
    actualValue: unknown,
    context: Record<string, unknown> = {}
  ) {
    super(
      `Invalid environment configuration for '${configField}': expected ${expectedType}, got ${typeof actualValue}`,
      'ENVIRONMENT_CONFIG_ERROR',
      { ...context, configField, expectedType, actualValue }
    );
    this.name = 'EnvironmentConfigError';
    this.configField = configField;
    this.expectedType = expectedType;
    this.actualValue = actualValue;
  }
}

/**
 * Development session error
 */
export class DevSessionError extends DevEnvironmentError {
  readonly sessionId: string;
  readonly sessionState: string;

  constructor(
    message: string,
    sessionId: string,
    sessionState: string,
    context: Record<string, unknown> = {}
  ) {
    super(message, 'DEV_SESSION_ERROR', { ...context, sessionId, sessionState });
    this.name = 'DevSessionError';
    this.sessionId = sessionId;
    this.sessionState = sessionState;
  }
}

/**
 * Type guard to check if error is a development environment error
 */
export function isDevEnvironmentError(error: unknown): error is DevEnvironmentError {
  return error instanceof DevEnvironmentError;
}

/**
 * Type guard to check if error is a security violation
 */
export function isSecurityViolationError(error: unknown): error is SecurityViolationError {
  return error instanceof SecurityViolationError;
}

/**
 * Error handler for development environment errors
 */
export class DevErrorHandler {
  /**
   * Handle development environment error
   */
  static handle(error: DevEnvironmentError): void {
    // Log error with appropriate level based on type
    if (error instanceof SecurityViolationError) {
      console.error('🚨 Security Violation:', {
        message: error.message,
        severity: error.severity,
        violationType: error.violationType,
        timestamp: error.timestamp,
        context: error.context
      });
    } else if (error instanceof InvalidEnvironmentError) {
      console.error('⚠️ Environment Error:', {
        message: error.message,
        code: error.code,
        timestamp: error.timestamp,
        context: error.context
      });
    } else {
      console.error('🔧 Development Error:', {
        message: error.message,
        code: error.code,
        timestamp: error.timestamp,
        context: error.context
      });
    }

    // In production, these errors should never occur
    if (process.env.NODE_ENV === 'production') {
      console.error('🚨 CRITICAL: Development error in production environment', error);
    }
  }

  /**
   * Create user-friendly error message
   */
  static createUserMessage(error: DevEnvironmentError): string {
    if (error instanceof SecurityViolationError) {
      return 'Access denied: Security violation detected';
    }
    
    if (error instanceof InvalidEnvironmentError) {
      return 'Environment configuration error';
    }
    
    if (error instanceof DevFeatureUnavailableError) {
      return `Feature '${error.featureName}' is not available`;
    }
    
    return 'Development environment error occurred';
  }
}
