/**
 * Formatting utilities for currency, dates, and numbers
 */

/**
 * Format a number as currency (GHS)
 * @param amount - The amount to format
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Format a date to a human-readable string
 * @param date - Date to format
 * @param format - Optional format style
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date | string | number,
  format: 'short' | 'medium' | 'long' = 'medium'
): string => {
  const dateObj = date instanceof Date ? date : new Date(date);
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: format === 'short' ? 'short' : 'long',
    day: 'numeric',
  };
  
  if (format === 'long') {
    options.weekday = 'long';
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return new Intl.DateTimeFormat('en-GH', options).format(dateObj);
};