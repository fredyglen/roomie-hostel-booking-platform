import { useState, useCallback } from 'react';
import { ErrorHandler } from '@/utils/ErrorHandler';

interface UseAsyncReturn<T, E = Error> {
  execute: (...args: any[]) => Promise<T | null>;
  status: 'idle' | 'pending' | 'success' | 'error';
  value: T | null;
  error: E | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  reset: () => void;
}

/**
 * Hook for handling async operations with loading, success, and error states
 */
export function useAsync<T, E = Error>(
  asyncFunction: (...args: any[]) => Promise<T>,
  immediate = false,
  context = 'useAsync'
): UseAsyncReturn<T, E> {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  // The execute function wraps asyncFunction and handles state changes
  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      setStatus('pending');
      setValue(null);
      setError(null);

      try {
        const result = await asyncFunction(...args);
        setValue(result);
        setStatus('success');
        return result;
      } catch (error) {
        const typedError = error as E;
        setError(typedError);
        setStatus('error');
        ErrorHandler.handle(error, context);
        return null;
      }
    },
    [asyncFunction, context]
  );

  // Reset the state
  const reset = useCallback(() => {
    setStatus('idle');
    setValue(null);
    setError(null);
  }, []);

  // Execute the async function if immediate is true
  useState(() => {
    if (immediate) {
      execute();
    }
  });

  return {
    execute,
    status,
    value,
    error,
    isLoading: status === 'pending',
    isSuccess: status === 'success',
    isError: status === 'error',
    reset,
  };
}