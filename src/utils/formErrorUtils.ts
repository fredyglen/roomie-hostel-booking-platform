export function getFormErrorMessage(error: unknown): string {
  if (!error) return '';
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as { message?: unknown }).message === 'string') {
    return (error as { message: string }).message;
  }
  return 'An unknown error occurred.';
}

export function mapFieldErrors(errors: Record<string, unknown>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key in errors) {
    result[key] = getFormErrorMessage(errors[key]);
  }
  return result;
} 