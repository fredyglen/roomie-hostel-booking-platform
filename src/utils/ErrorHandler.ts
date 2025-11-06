import { logger } from './enhanced-logger';
import * as Sentry from '@sentry/react';

interface ErrorOptions {
  showUser?: boolean;
  context?: Record<string, unknown>;
  reportToService?: boolean;
}

export class ErrorHandler {
  static handle(error: unknown, message?: string, options: ErrorOptions = {}) {
    const { showUser = false, context = {}, reportToService = true } = options;
    
    // Normalize the error
    const normalizedError = this.normalizeError(error);
    
    // Add custom message if provided
    if (message) {
      normalizedError.message = `${message}: ${normalizedError.message}`;
    }
    
    // Log the error
    logger.error(normalizedError.message, {
      error: normalizedError,
      context,
      stack: normalizedError.stack
    });
    
    // Report to error service in production
    if (reportToService && import.meta.env.PROD) {
      this.reportToErrorService(normalizedError, context);
    }
    
    // Return user-friendly message if needed
    if (showUser) {
      return this.getUserFriendlyMessage(normalizedError);
    }
    
    return normalizedError;
  }
  
  private static normalizeError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }
    
    if (typeof error === 'string') {
      return new Error(error);
    }
    
    return new Error(JSON.stringify(error));
  }
  
  private static reportToErrorService(error: Error, context: Record<string, unknown>) {
    // Report to Sentry in production
    if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
      Sentry.captureException(error, {
        extra: context,
        level: 'error',
      });
    } else if (import.meta.env.DEV) {
      console.error('[Error Service] Would report to Sentry:', error, context);
    }
  }
  
  static getUserFriendlyMessage(error: unknown): string {
    const normalizedError = this.normalizeError(error);

    // You could have specific user-friendly messages for known error types
    if (normalizedError.message.includes('network')) {
      return 'There was a problem connecting to the server. Please check your internet connection and try again.';
    }

    if (normalizedError.message.includes('permission')) {
      return 'You don\'t have permission to perform this action.';
    }

    if (normalizedError.message.includes('not found')) {
      return 'The requested resource could not be found.';
    }

    // Default message
    return 'Something went wrong. Please try again later.';
  }
  
  static async tryOrThrow<T>(
    fn: () => Promise<T>,
    errorMessage = 'Operation failed'
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      throw this.handle(error, errorMessage);
    }
  }

  // Static method for simple logging (used throughout codebase)
  static log(message: string | unknown, context?: string) {
    if (typeof message === 'string') {
      logger.info(context ? `${context}: ${message}` : message);
    } else {
      logger.info(context || 'Log entry', message);
    }
  }


}
