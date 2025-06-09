export function validateConfig() {
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_PAYSTACK_PUBLIC_KEY',
    'VITE_PAYSTACK_SECRET_KEY',
    'VITE_APP_BASE_URL',
  ];
  const missing = requiredVars.filter((key) => !import.meta.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
} 