import { apiRequestWithRetry } from './apiErrorInterceptor';

export const apiClient = {
  async get<T>(fetcher: () => Promise<T>, context?: string) {
    return apiRequestWithRetry(fetcher, 2, context);
  },
  async post<T>(fetcher: () => Promise<T>, context?: string) {
    return apiRequestWithRetry(fetcher, 2, context);
  },
  async put<T>(fetcher: () => Promise<T>, context?: string) {
    return apiRequestWithRetry(fetcher, 2, context);
  },
  async delete<T>(fetcher: () => Promise<T>, context?: string) {
    return apiRequestWithRetry(fetcher, 2, context);
  },
}; 