export const API_ENDPOINTS = {
  SUPABASE_FUNCTIONS_BASE: import.meta.env.VITE_SUPABASE_URL
    ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`
    : '',
  PAYSTACK_WEBHOOK: import.meta.env.VITE_PAYSTACK_WEBHOOK_URL || 'https://your-project.supabase.co/functions/v1/paystack-webhook',
  // Add more endpoints as needed
}; 