
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/EnhancedAuthContext';
import BusinessPaymentModal from '@/components/payment/BusinessPaymentModal';
import { Calendar, MapPin } from 'lucide-react';
import { ErrorHandler } from '@/utils/ErrorHandler';
import { ConfirmedBookingData } from '@/types/booking';

interface BookingButtonProps {
  propertyId: string;
  propertyOwnerId: string;
  agentId: string;
  startDate?: string;
  endDate?: string;
  className?: string;
}

const BookingButton: React.FC<BookingButtonProps> = ({
  propertyId,
  propertyOwnerId,
  agentId,
  startDate,
  endDate,
  className
}) => {
  const { user } = useAuth();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const handleBookingClick = () => {
    if (!user) {
      // Redirect to login
      window.location.href = '/login';
      return;
    }

    setPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (booking: ConfirmedBookingData) => {
    setPaymentModalOpen(false);
    // Redirect to booking confirmation or success page
    window.location.href = `/payment-success?reference=${booking.payment_reference}`;
  };

  // Default dates if not provided
  const defaultStartDate = startDate || new Date().toISOString().split('T')[0];
  const defaultEndDate = endDate || new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 4 months

  return (
    <>
      <Button 
        onClick={handleBookingClick}
        className={`bg-[#9b87f5] hover:bg-[#8b77f0] text-white ${className}`}
        size="lg"
      >
        <Calendar className="mr-2 h-4 w-4" />
        Book Now
      </Button>

      {user && (
        <BusinessPaymentModal
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          onSuccess={handlePaymentSuccess}
          propertyId={propertyId}
          studentId={user.id}
          studentEmail={user.email || ''}
          propertyOwnerId={propertyOwnerId}
          agentId={agentId}
          startDate={defaultStartDate}
          endDate={defaultEndDate}
          metadata={{
            booking_source: 'property_listing',
            user_agent: navigator.userAgent
          }}
        />
      )}
    </>
  );
};

export default BookingButton;
