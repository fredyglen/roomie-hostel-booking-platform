export interface ApiResponse<T> {
  data: T;
  error: null;
}

export interface ApiError {
  data: null;
  error: {
    message: string;
    code: string;
    details?: unknown;
  };
}

export type ApiResult<T> = ApiResponse<T> | ApiError; 