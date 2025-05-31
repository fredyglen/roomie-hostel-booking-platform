
import { supabase } from '@/lib/supabase';
import { calculatePaymentBreakdown, PaymentBreakdown } from './paymentCalculations';

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

// Updated packages based on new commission structure
export const BOOKING_PACKAGES: Record<string, BookingPackage> = {
  standard: {
    type: 'standard',
    totalPrice: 2700,
    propertyRent: 2700,
    platformFee: 113,  // 4.2% of 2700
    agentFee: 100,     // 3.7% minimum GHS 100
  },
  premium: {
    type: 'premium', 
    totalPrice: 3600,
    propertyRent: 3600,
    platformFee: 151,  // 4.2% of 3600
    agentFee: 133,     // 3.7% of 3600
    additionalServices: 100,
  },
  luxury: {
    type: 'luxury',
    totalPrice: 4000,
    propertyRent: 4000,
    platformFee: 168,  // 4.2% of 4000
    agentFee: 148,     // 3.7% of 4000
    additionalServices: 200,
  }
};

// Calculate payment distribution using new commission structure
export const calculatePaymentDistribution = (
  packageType: string,
  propertyOwnerId: string,
  agentId: string
): PaymentDistribution => {
  const pkg = BOOKING_PACKAGES[packageType];
  if (!pkg) throw new Error('Invalid package type');

  // Use the new payment calculation logic
  const breakdown = calculatePaymentBreakdown(pkg.totalPrice);

  return {
    propertyOwnerId,
    agentId,
    propertyOwnerAmount: breakdown.propertyOwnerAmount,
    agentAmount: breakdown.agentCommission,
    platformAmount: breakdown.platformFee,
    paystackFees: breakdown.paystackFee,
    platformNet: breakdown.platformNet,
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

  // Create booking record using existing schema
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
      check_in_date: bookingData.startDate,
      check_out_date: bookingData.endDate,
      total_amount: pkg.totalPrice,
    })
    .select()
    .single();

  if (bookingError) throw bookingError;

  return { booking, distribution };
};
