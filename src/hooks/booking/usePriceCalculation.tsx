
// Helper function to calculate total price based on different pricing units
export function calculateTotalPrice(
  basePrice: number,
  duration: string,
  durationType: string,
  propertyPriceUnit: string
): number {
  if (!basePrice || !duration) return 0;
  
  const durationNum = parseInt(duration, 10);
  if (isNaN(durationNum) || durationNum <= 0) return 0;
  
  // If durationType matches property's price unit, simple multiplication
  if (durationType === propertyPriceUnit) {
    return basePrice * durationNum;
  }
  
  // Handle conversions between different duration types
  const conversionRates: Record<string, Record<string, number>> = {
    month: {
      semester: 4,   // Semester is approximately 4 months
      year: 12       // Year is 12 months
    },
    semester: {
      month: 1/4,    // Month is 1/4 of a semester
      year: 2        // Year is typically 2 semesters
    },
    year: {
      month: 1/12,   // Month is 1/12 of a year
      semester: 1/2  // Semester is 1/2 of a year
    },
    week: {
      month: 1/4     // Week is 1/4 of a month
    }
  };
  
  const sourceUnit = propertyPriceUnit;
  const targetUnit = durationType;
  
  if (conversionRates[sourceUnit]?.[targetUnit]) {
    return basePrice * conversionRates[sourceUnit][targetUnit] * durationNum;
  } else if (conversionRates[targetUnit]?.[sourceUnit]) {
    return basePrice * (1 / conversionRates[targetUnit][sourceUnit]) * durationNum;
  }
  
  // Default fallback
  return basePrice * durationNum;
}
