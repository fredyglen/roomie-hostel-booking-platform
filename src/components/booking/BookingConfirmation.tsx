
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download } from 'lucide-react';
import BookingDetails from './BookingDetails';
import NextStepsCard from './NextStepsCard';

interface BookingData {
  id: string;
  booking_reference: string;
  property_id: string;
  student_id: string;
  check_in_date: string;
  check_out_date: string;
  total_amount: number;
  package_type: string;
  payment_status: string;
  status: string;
  payment_reference?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  special_requests?: string;
}

interface BookingConfirmationProps {
  booking: BookingData;
  onDownloadReceipt?: () => void;
  onContactSupport?: () => void;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  booking,
  onDownloadReceipt,
  onContactSupport
}) => {
  return (
    <div className="space-y-6">
      {/* Success Header */}
      <Card>
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">Booking Confirmed!</CardTitle>
          <p className="text-gray-600">Your accommodation has been successfully booked</p>
        </CardHeader>
      </Card>

      <BookingDetails booking={booking} />
      <NextStepsCard />

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={onDownloadReceipt}
          className="flex-1"
        >
          <Download className="mr-2 h-4 w-4" />
          Download Receipt
        </Button>
        <Button 
          variant="outline" 
          onClick={onContactSupport}
          className="flex-1"
        >
          Contact Support
        </Button>
      </div>
    </div>
  );
};

export default BookingConfirmation;
