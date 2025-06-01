
export const handlePaystackError = (error: any): string => {
  console.error('Paystack Error:', error);
  
  // Common error scenarios
  if (error.message?.includes('Invalid key') || error.message?.includes('publicKey')) {
    return 'Invalid Paystack API key. Please check your configuration.';
  }
  
  if (error.message?.includes('Network') || error.message?.includes('fetch')) {
    return 'Network error. Please check your internet connection and try again.';
  }
  
  if (error.message?.includes('amount')) {
    return 'Invalid payment amount. Please check the amount and try again.';
  }
  
  if (error.message?.includes('email')) {
    return 'Invalid email address. Please provide a valid email.';
  }
  
  if (error.message?.includes('VITE_PAYSTACK_PUBLIC_KEY')) {
    return 'Payment system not configured. Please contact support.';
  }
  
  return 'Payment failed. Please try again or contact support.';
};

export const debugPaystackConfig = () => {
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
  
  console.log('=== Paystack Debug Info ===');
  console.log('Public Key Present:', !!publicKey);
  console.log('Key Format:', publicKey ? publicKey.substring(0, 10) + '...' : 'None');
  console.log('Environment:', import.meta.env.MODE);
  console.log('Is Test Mode:', publicKey?.startsWith('pk_test_'));
  console.log('========================');
};
