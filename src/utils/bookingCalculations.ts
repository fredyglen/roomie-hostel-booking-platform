
// Booking calculation utilities based on BOOKING_RULES.md

export interface BookingValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface BookingMetrics {
  totalBookings: number;
  occupancyRate: number;
  averageBookingValue: number;
  conversionRate: number;
}

export interface RefundCalculation {
  refundAmount: number;
  refundPercentage: number;
  processingFee: number;
  netRefund: number;
}

/**
 * Validate booking requirements
 */
export const validateBooking = (bookingData: {
  studentId: string;
  propertyId: string;
  checkInDate: string;
  checkOutDate: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}): BookingValidation => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required fields
  if (!bookingData.studentId) errors.push('Student ID is required');
  if (!bookingData.propertyId) errors.push('Property ID is required');
  if (!bookingData.checkInDate) errors.push('Check-in date is required');
  if (!bookingData.checkOutDate) errors.push('Check-out date is required');

  // Validate dates
  const checkIn = new Date(bookingData.checkInDate);
  const checkOut = new Date(bookingData.checkOutDate);
  const now = new Date();

  if (checkIn < now) errors.push('Check-in date cannot be in the past');
  if (checkOut <= checkIn) errors.push('Check-out date must be after check-in date');

  // Check booking duration (minimum 1 week, maximum 1 year)
  const durationDays = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24);
  if (durationDays < 7) warnings.push('Booking duration is less than minimum recommended (1 week)');
  if (durationDays > 365) errors.push('Booking duration cannot exceed 1 year');

  // Emergency contact validation
  if (!bookingData.emergencyContact) {
    warnings.push('Emergency contact information is recommended');
  } else {
    const { name, phone, relationship } = bookingData.emergencyContact;
    if (!name) warnings.push('Emergency contact name is missing');
    if (!phone) warnings.push('Emergency contact phone is missing');
    if (!relationship) warnings.push('Emergency contact relationship is missing');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Calculate refund amount based on cancellation timing
 */
export const calculateRefund = (
  originalAmount: number,
  checkInDate: string,
  cancellationDate: string = new Date().toISOString()
): RefundCalculation => {
  const checkIn = new Date(checkInDate);
  const cancellation = new Date(cancellationDate);
  
  const daysUntilCheckIn = Math.ceil(
    (checkIn.getTime() - cancellation.getTime()) / (1000 * 60 * 60 * 24)
  );

  let refundPercentage = 0;

  // Apply refund policy based on timing
  if (daysUntilCheckIn >= 30) {
    refundPercentage = 0.90; // 90% refund
  } else if (daysUntilCheckIn >= 15) {
    refundPercentage = 0.70; // 70% refund
  } else if (daysUntilCheckIn >= 7) {
    refundPercentage = 0.50; // 50% refund
  } else if (daysUntilCheckIn >= 1) {
    refundPercentage = 0.25; // 25% refund
  } else {
    refundPercentage = 0; // No refund after check-in
  }

  const refundAmount = originalAmount * refundPercentage;
  const processingFee = Math.min(refundAmount * 0.05, 50); // 5% processing fee, max GHS 50
  const netRefund = refundAmount - processingFee;

  return {
    refundAmount: Math.round(refundAmount * 100) / 100,
    refundPercentage,
    processingFee: Math.round(processingFee * 100) / 100,
    netRefund: Math.round(netRefund * 100) / 100
  };
};

/**
 * Calculate booking metrics for analytics
 */
export const calculateBookingMetrics = (bookings: any[]): BookingMetrics => {
  const totalBookings = bookings.length;
  const completedBookings = bookings.filter(b => b.status === 'COMPLETED');
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.total_amount || 0), 0);
  
  return {
    totalBookings,
    occupancyRate: totalBookings > 0 ? completedBookings.length / totalBookings : 0,
    averageBookingValue: totalBookings > 0 ? totalRevenue / totalBookings : 0,
    conversionRate: 0.85 // This would be calculated based on actual conversion data
  };
};

/**
 * Generate booking reference number
 */
export const generateBookingReference = (propertyId: string): string => {
  const now = new Date();
  const year = now.getFullYear();
  const dayOfYear = Math.floor((now.getTime() - new Date(year, 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const hour = now.getHours().toString().padStart(2, '0');
  const minute = now.getMinutes().toString().padStart(2, '0');
  const propertyCode = propertyId.substring(0, 4).toUpperCase();
  
  return `BK-${year}-${dayOfYear.toString().padStart(3, '0')}-${hour}${minute}-${propertyCode}`;
};

/**
 * Check property availability for booking dates
 */
export const checkPropertyAvailability = (
  existingBookings: any[],
  checkInDate: string,
  checkOutDate: string,
  maxOccupancy: number
): boolean => {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  
  // Count overlapping bookings
  const overlappingBookings = existingBookings.filter(booking => {
    const bookingCheckIn = new Date(booking.check_in_date);
    const bookingCheckOut = new Date(booking.check_out_date);
    
    // Check for date overlap
    return (checkIn < bookingCheckOut && checkOut > bookingCheckIn) &&
           (booking.status === 'ACTIVE' || booking.status === 'PAYMENT_CONFIRMED');
  });
  
  return overlappingBookings.length < maxOccupancy;
};

/**
 * Calculate seasonal pricing adjustment
 */
export const calculateSeasonalPricing = (
  basePrice: number,
  checkInDate: string
): number => {
  const checkIn = new Date(checkInDate);
  const month = checkIn.getMonth();
  
  // Define seasonal multipliers
  const seasonalMultipliers = {
    peak: 1.2,      // August-October (new academic year)
    high: 1.1,      // November-January
    normal: 1.0,    // February-May
    low: 0.9        // June-July (vacation period)
  };
  
  let multiplier = seasonalMultipliers.normal;
  
  if (month >= 7 && month <= 9) { // Aug-Oct
    multiplier = seasonalMultipliers.peak;
  } else if (month >= 10 || month <= 0) { // Nov-Jan
    multiplier = seasonalMultipliers.high;
  } else if (month >= 5 && month <= 6) { // Jun-Jul
    multiplier = seasonalMultipliers.low;
  }
  
  return Math.round(basePrice * multiplier * 100) / 100;
};
