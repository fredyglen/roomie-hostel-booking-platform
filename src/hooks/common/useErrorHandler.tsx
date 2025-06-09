import { useCallback } from 'react';
import { ErrorHandler } from '@/utils/ErrorHandler';
import { notifyUser } from '@/utils/userNotification';

export function useErrorHandler() {
  return useCallback((error: unknown, context?: string) => {
    ErrorHandler.handle(error, context);
    notifyUser(ErrorHandler.getUserFriendlyMessage(error), 'error');
  }, []);
}
