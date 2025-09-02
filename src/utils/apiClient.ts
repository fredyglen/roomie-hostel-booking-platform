import { apiRequestWithRetry } from './apiErrorInterceptor';
import { config } from '@/config';

export const apiClient = {
  async get<T>(fetcher: () => Promise<T>, context?: string) {
    return apiRequestWithRetry(fetcher, config.supabase.retryAttempts, context);
  },
  async post<T>(fetcher: () => Promise<T>, context?: string) {
    return apiRequestWithRetry(fetcher, config.supabase.retryAttempts, context);
  },
  async put<T>(fetcher: () => Promise<T>, context?: string) {
    return apiRequestWithRetry(fetcher, config.supabase.retryAttempts, context);
  },
  async delete<T>(fetcher: () => Promise<T>, context?: string) {
    return apiRequestWithRetry(fetcher, config.supabase.retryAttempts, context);
  },
};