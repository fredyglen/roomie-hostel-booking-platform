
export const formatDate = (date: Date | string): string => {
  if (!date) return '';
  
  const dateObject = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObject.getTime())) {
    return '';
  }
  
  return dateObject.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDateShort = (date: Date | string): string => {
  if (!date) return '';
  
  const dateObject = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObject.getTime())) {
    return '';
  }
  
  return dateObject.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};
