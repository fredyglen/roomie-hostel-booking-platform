
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, CreditCard, Download, Eye } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Booking {
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
  created_at: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  special_requests?: string;
}

interface BookingCardProps {
  booking: Booking;
  onViewDetails: () => void;
  onTrackPayment: () => void;
  onDownloadReceipt: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onViewDetails,
  onTrackPayment,
  onDownloadReceipt
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      case 'completed':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">
            {booking.booking_reference}
          </CardTitle>
          <div className="flex gap-2">
            <Badge className={`${getStatusColor(booking.status)} text-white`}>
              {booking.status}
            </Badge>
            <Badge className={`${getPaymentStatusColor(booking.payment_status)} text-white`}>
              {booking.payment_status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm">
              {formatDate(new Date(booking.check_in_date))} - {formatDate(new Date(booking.check_out_date))}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">
              ₵{booking.total_amount.toLocaleString()}
            </span>
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          <p>Package: {booking.package_type}</p>
          <p>Booked: {formatDate(new Date(booking.created_at))}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={onViewDetails}>
            <Eye className="h-4 w-4 mr-1" />
            View Details
          </Button>
          {booking.payment_reference && (
            <Button variant="outline" size="sm" onClick={onTrackPayment}>
              <CreditCard className="h-4 w-4 mr-1" />
              Track Payment
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={onDownloadReceipt}>
            <Download className="h-4 w-4 mr-1" />
            Receipt
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCard;
