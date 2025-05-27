
export const CURRENCY = {
  symbol: '₵',
  code: 'GHS',
  name: 'Ghana Cedi'
};

export const formatCurrency = (amount: number): string => {
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
  return `${CURRENCY.symbol}${amount.toLocaleString()}`;
};

export const parseCurrency = (currencyString: string): number => {
  return parseFloat(currencyString.replace(/[₵,]/g, '')) || 0;
};
