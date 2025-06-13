/**
 * Centralized error handling utility
 */
export class ErrorHandler {
  /**
   * Handle an error with optional context
   * @param error The error to handle
   * @param context Additional context about where the error occurred
   */
  public static handle(error: unknown, context?: string): void {
    // Extract error message
    const errorMessage = this.getErrorMessage(error);
    
    // Log to console in development
    if (import.meta.env.DEV) {
      console.error(`${context ? `[${context}] ` : ''}Error:`, error);
    }
    
    // In production, we would send to a monitoring service like Sentry
    if (import.meta.env.PROD) {
      // TODO: Implement production error logging
      // sendToErrorMonitoring(error, context);
    }
  }
  
  /**
   * Get a user-friendly error message
   * @param error The error object
   * @returns A string message
   */
  public static getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    
    if (typeof error === 'string') {
      return error;
    }
    
    if (typeof error === 'object' && error !== null) {
      // Handle Supabase error format
      if ('message' in error && typeof error.message === 'string') {
        return error.message;
      }
      
      // Handle API error format
      if ('error' in error && typeof error.error === 'object' && error.error !== null) {
        const apiError = error.error;
        if ('message' in apiError && typeof apiError.message === 'string') {
          return apiError.message;
        }
      }
    }
    
    return 'An unknown error occurred';
  }
  
  /**
   * Format an error for display to the user
   * @param error The error to format
   * @returns A user-friendly error message
   */
  public static formatUserError(error: unknown): string {
    const message = this.getErrorMessage(error);
    
    // Map technical errors to user-friendly messages
    if (message.includes('network') || message.includes('timeout')) {
      return 'There was a network error. Please try again later.';
    }
    
    if (message.includes('404')) {
      return 'The requested resource was not found.';
    }
    
    if (message.includes('403')) {
      return 'You do not have permission to perform this action.';
    }
    
    if (message.includes('401')) {
      return 'You are not authorized to perform this action. Please log in.';
    }
    
    // Add more error mappings as needed
    
    // Fallback to the original error message
    return message;
  }
}
