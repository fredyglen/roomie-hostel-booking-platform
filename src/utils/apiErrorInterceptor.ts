import { ErrorHandler } from './ErrorHandler';

export async function apiRequestWithRetry<T>(
  fetcher: () => Promise<T>,
  retries = 2,
  context = 'API Request'
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fetcher();
    } catch (error) {
      lastError = error;
      ErrorHandler.log(error, `${context} (attempt ${attempt + 1})`);
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
      }
    }
  }
  ErrorHandler.handle(lastError, context);
  throw lastError;
} 