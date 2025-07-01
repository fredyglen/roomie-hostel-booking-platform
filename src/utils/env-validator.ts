/**
 * Validates required environment variables
 * @returns Array of missing environment variables
 */
export function validateEnvironmentVariables(): string[] {
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_PAYSTACK_PUBLIC_KEY'
  ];
  
  const missingVars = requiredVars.filter(
    varName => !import.meta.env[varName]
  );
  
  if (missingVars.length > 0) {
    // Use logger instead of console in production
    import('@/utils/enhanced-logger').then(({ logger }) => {
      logger.error('Missing required environment variables', { missingVars });
    });
  }
  
  return missingVars;
}

/**
 * Validates environment variables on application startup
 * Should be called early in the application lifecycle
 */
export function validateEnvironment(): void {
  const missingVars = validateEnvironmentVariables();
  
  if (missingVars.length > 0) {
    throw new Error(
      `Application cannot start: Missing required environment variables: ${missingVars.join(', ')}`
    );
  }
}