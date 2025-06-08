export class ErrorHandler {
  static log(error: Error | unknown, context?: string) {
    // Log to external service or console as fallback
    if (import.meta.env.MODE === 'production') {
      // TODO: Integrate with external logging service
    } else {
      // eslint-disable-next-line no-console
      console.error(`[ErrorHandler]${context ? ' [' + context + ']' : ''}`, error);
    }
  }

  static notifyUser(message: string) {
    // Integrate with a notification/toast system
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('error-notification', { detail: { message } }));
    }
  }

  static handle(error: Error | unknown, context?: string) {
    this.log(error, context);
    this.notifyUser(this.getUserFriendlyMessage(error));
  }

  static getUserFriendlyMessage(error: Error | unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'An unexpected error occurred. Please try again.';
  }
} 