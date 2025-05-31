
// Currency formatting utilities

export const formatCurrency = (amount: number, currency: string = 'GHS'): string => {
  const currencySymbols: Record<string, string> = {
    GHS: '₵',
    USD: '$',
    EUR: '€',
    GBP: '£'
  };

  const symbol = currencySymbols[currency] || currency;
  
  // Format with proper thousand separators
  const formattedAmount = amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return `${symbol}${formattedAmount}`;
};

export const parseCurrencyAmount = (currencyString: string): number => {
  // Remove currency symbols and parse the number
  const numericString = currencyString.replace(/[^\d.-]/g, '');
  return parseFloat(numericString) || 0;
};

export const convertCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  exchangeRate: number
): number => {
  if (fromCurrency === toCurrency) {
    return amount;
  }
  
  return amount * exchangeRate;
};
