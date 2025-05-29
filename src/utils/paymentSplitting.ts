
import { supabase } from '@/lib/supabase';

export interface BookingPackage {
  type: 'standard' | 'premium' | 'luxury';
  totalPrice: number;
  propertyRent: number;
  platformFee: number;
  agentFee: number;
  additionalServices?: number;
}

export interface PaymentDistribution {
  propertyOwnerId: string;
  agentId: string;
  propertyOwnerAmount: number;
  agentAmount: number;
  platformAmount: number;
  paystackFees: number;
  platformNet: number;
}

export const BOOKING_PACKAGES: Record<string, BookingPackage> = {
  standard: {
    type: 'standard',
    totalPrice: 2900,
    propertyRent: 2700,
    platformFee: 100,
    agentFee: 100,
  },
  premium: {
    type: 'premium',
    totalPrice: 3100,
    propertyRent: 2700,
    platformFee: 200,
    agentFee: 150,
    additionalServices: 50,
  },
  luxury: {
    type: 'luxury',
    totalPrice: 3400,
    propertyRent: 2700,
    platformFee: 300,
    agentFee: 200,
    additionalServices: 200,
  }
};

// Calculate Paystack fees (1.95% for Ghana)
export const calculatePaystackFees = (amount: number): number => {
  return Math.round(amount * 0.0195);
};

// Calculate payment distribution
export const calculatePaymentDistribution = (
  packageType: string,
  propertyOwnerId: string,
  agentId: string
): PaymentDistribution => {
  const pkg = BOOKING_PACKAGES[packageType];
  if (!pkg) throw new Error('Invalid package type');

  const paystackFees = calculatePaystackFees(pkg.totalPrice);
  const platformNet = pkg.platformFee - paystackFees;

  return {
    propertyOwnerId,
    agentId,
    propertyOwnerAmount: pkg.propertyRent,
    agentAmount: pkg.agentFee,
    platformAmount: pkg.platformFee,
    paystackFees,
    platformNet: Math.max(0, platformNet), // Ensure non-negative
  };
};

// Create booking with payment details
export const createBookingWithPayment = async (bookingData: {
  propertyId: string;
  studentId: string;
  propertyOwnerId: string;
  agentId: string;
  packageType: string;
  startDate: string;
  endDate: string;
  metadata?: any;
}) => {
  const distribution = calculatePaymentDistribution(
    bookingData.packageType,
    bookingData.propertyOwnerId,
    bookingData.agentId
  );

  const pkg = BOOKING_PACKAGES[bookingData.packageType];

  // Create booking record
  const { data: booking, error: bookingError } = await supabase
    .from('bookings_enhanced')
    .insert({
      property_id: bookingData.propertyId,
      student_id: bookingData.studentId,
      property_owner_id: bookingData.propertyOwnerId,
      agent_id: bookingData.agentId,
      start_date: bookingData.startDate,
      end_date: bookingData.endDate,
      total_price: pkg.totalPrice,
      property_rent: pkg.propertyRent,
      platform_fee: pkg.platformFee,
      agent_fee: pkg.agentFee,
      package_type: bookingData.packageType,
      payment_status: 'pending',
      status: 'pending_payment',
      metadata: bookingData.metadata,
    })
    .select()
    .single();

  if (bookingError) throw bookingError;

  return { booking, distribution };
};
