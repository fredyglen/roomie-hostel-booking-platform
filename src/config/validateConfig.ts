export function validateConfig() {
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_PAYSTACK_PUBLIC_KEY', // Only public key should be in frontend
    'VITE_APP_BASE_URL',
  ];

  const missing = requiredVars.filter((key) => !import.meta.env[key]);
  if (missing.length > 0) {
    // Use proper logging instead of console
    const message = `Missing required environment variables: ${missing.join(', ')}`;
    if (import.meta.env.DEV) {
      console.warn(message);
    }
    // Don't throw in development to allow testing with sample data
    if (import.meta.env.PROD) {
      throw new Error(message);
    }
  }
}