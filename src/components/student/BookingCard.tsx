
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Eye, Download } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';

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
}

interface BookingCardProps {
  booking: Booking;
  onViewDetails: () => void;
  onTrackPayment: () => void;
  onDownloadReceipt: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'pending':
    case 'pending_payment':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'completed':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onViewDetails,
  onTrackPayment,
  onDownloadReceipt
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold">{booking.booking_reference}</h3>
              <Badge className={getStatusColor(booking.status)}>
                {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
              </Badge>
              <Badge className={getPaymentStatusColor(booking.payment_status)}>
                {booking.payment_status?.charAt(0).toUpperCase() + booking.payment_status?.slice(1)}
              </Badge>
            </div>
            
            <div className="flex items-center text-sm text-gray-600 space-x-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(booking.check_in_date).toLocaleDateString()} - {new Date(booking.check_out_date).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {booking.package_type} Package
              </div>
            </div>
            
            <div className="text-lg font-semibold text-green-600">
              {formatCurrency(booking.total_amount)}
            </div>
            
            <div className="text-xs text-gray-500">
              Booked on {new Date(booking.created_at).toLocaleDateString()}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onViewDetails}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
            
            {booking.payment_reference && (
              <Button
                variant="outline"
                size="sm"
                onClick={onTrackPayment}
              >
                Track Payment
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={onDownloadReceipt}
            >
              <Download className="h-4 w-4 mr-2" />
              Receipt
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCard;
