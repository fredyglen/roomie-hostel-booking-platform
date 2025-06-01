
/**
 * Format currency values for display
 * Defaults to Ghana Cedis (GH₵) formatting
 */
export const formatCurrency = (amount: number, currency: string = 'GHS'): string => {
  if (isNaN(amount)) return 'GH₵0.00';
  
  const formatter = new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: currency === 'GHS' ? 'GHS' : currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  // For Ghana Cedis, we'll customize the symbol
  if (currency === 'GHS') {
    const formatted = formatter.format(amount);
    return formatted.replace('GH₵', 'GH₵').replace('GHS', 'GH₵');
  }

  return formatter.format(amount);
};

/**
 * Parse currency string back to number
 */
export const parseCurrency = (currencyString: string): number => {
  if (!currencyString) return 0;
  
  // Remove currency symbols and whitespace
  const cleanString = currencyString
    .replace(/[GH₵$€£¥]/g, '')
    .replace(/,/g, '')
    .trim();
  
  const parsed = parseFloat(cleanString);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Format currency for input fields (no symbols)
 */
export const formatCurrencyInput = (amount: number): string => {
  if (isNaN(amount)) return '0';
  return amount.toLocaleString('en-GH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};
