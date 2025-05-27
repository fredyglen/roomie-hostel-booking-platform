
export const CURRENCY = {
  symbol: '₵',
  code: 'GHS',
  name: 'Ghana Cedi'
};

export const formatCurrency = (amount: number): string => {
  return `${CURRENCY.symbol}${amount.toLocaleString('en-GH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })}`;
};

export const formatCurrencyWithDecimals = (amount: number): string => {
  return `${CURRENCY.symbol}${amount.toLocaleString('en-GH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

export const formatCurrencyCompact = (amount: number): string => {
  if (amount >= 1000000) {
    return `${CURRENCY.symbol}${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `${CURRENCY.symbol}${(amount / 1000).toFixed(1)}K`;
  }
  return `${CURRENCY.symbol}${amount.toLocaleString('en-GH')}`;
};

export const parseCurrency = (currencyString: string): number => {
  return parseFloat(currencyString.replace(/[₵,]/g, '')) || 0;
};

// Convert other currencies to Ghana Cedi (updated exchange rates)
export const convertToGhanaCedi = (amount: number, fromCurrency: string): number => {
  const exchangeRates: Record<string, number> = {
    'USD': 12.50, // 1 USD = 12.50 GHS (approximate)
    'EUR': 13.80, // 1 EUR = 13.80 GHS (approximate)
    'GBP': 15.90, // 1 GBP = 15.90 GHS (approximate)
    'NGN': 0.025, // 1 NGN = 0.025 GHS (approximate)
    'GHS': 1.00   // 1 GHS = 1 GHS
  };
  
  const rate = exchangeRates[fromCurrency.toUpperCase()] || 1;
  return amount * rate;
};

// Format currency with automatic conversion
export const formatCurrencyWithConversion = (amount: number, fromCurrency: string = 'GHS'): string => {
  const ghsAmount = convertToGhanaCedi(amount, fromCurrency);
  return formatCurrency(ghsAmount);
};
