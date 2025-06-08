import { useCallback } from 'react';
import { ErrorHandler } from '@/utils/ErrorHandler';
import { useToast } from '@/hooks/use-toast';

export function useStandardizedErrorHandler() {
  const { toast } = useToast();

  const handleError = useCallback((error: unknown, context?: string) => {
    // Log the error using the centralized ErrorHandler
    ErrorHandler.log(error, context);

    // Show a user-friendly toast notification
    const userMessage = ErrorHandler.getUserFriendlyMessage(error);
    toast({
      title: "Error",
      description: userMessage,
      variant: "destructive",
    });
  }, [toast]);

  return { handleError };
} 