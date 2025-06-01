
import { useCallback } from 'react';
import { toast } from 'sonner';
import { logger } from '@/utils/enhanced-logger';

interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  fallbackMessage?: string;
}

export const useErrorHandler = () => {
  const handleError = useCallback((
    error: Error | string | unknown,
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showToast = true,
      logError = true,
      fallbackMessage = 'An unexpected error occurred'
    } = options;

    let errorMessage: string;
    let errorContext: Record<string, unknown> = {};

    if (error instanceof Error) {
      errorMessage = error.message;
      errorContext = {
        name: error.name,
        stack: error.stack
      };
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else {
      errorMessage = fallbackMessage;
      errorContext = { originalError: error };
    }

    if (logError) {
      logger.error(errorMessage, errorContext);
    }

    if (showToast) {
      toast.error(errorMessage);
    }

    return errorMessage;
  }, []);

  const handleAsyncError = useCallback(async <T>(
    asyncOperation: () => Promise<T>,
    options: ErrorHandlerOptions = {}
  ): Promise<T | null> => {
    try {
      return await asyncOperation();
    } catch (error) {
      handleError(error, options);
      return null;
    }
  }, [handleError]);

  return { handleError, handleAsyncError };
};
