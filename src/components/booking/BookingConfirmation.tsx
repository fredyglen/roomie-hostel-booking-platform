
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, MapPin, Calendar, User, Phone } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';

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
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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

      {/* Booking Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Booking Details
            <Badge className={getStatusColor(booking.status)}>
              {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-2" />
                Booking Reference
              </div>
              <p className="font-mono text-sm font-semibold">{booking.booking_reference}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                Check-in Date
              </div>
              <p className="font-semibold">{new Date(booking.check_in_date).toLocaleDateString()}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                Check-out Date
              </div>
              <p className="font-semibold">{new Date(booking.check_out_date).toLocaleDateString()}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                Package Type
              </div>
              <Badge variant="secondary" className="capitalize">
                {booking.package_type} Package
              </Badge>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Amount Paid:</span>
              <span className="text-xl font-bold text-green-600">
                {formatCurrency(booking.total_amount)}
              </span>
            </div>
          </div>

          {booking.payment_reference && (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Payment Reference:</span>
                <span className="font-mono">{booking.payment_reference}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      {booking.emergency_contact_name && (
        <Card>
          <CardHeader>
            <CardTitle>Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Phone className="h-4 w-4 text-gray-600" />
              <div>
                <p className="font-semibold">{booking.emergency_contact_name}</p>
                <p className="text-sm text-gray-600">{booking.emergency_contact_phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Special Requests */}
      {booking.special_requests && (
        <Card>
          <CardHeader>
            <CardTitle>Special Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{booking.special_requests}</p>
          </CardContent>
        </Card>
      )}

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>What's Next?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p className="text-sm">You'll receive a confirmation email with detailed instructions</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p className="text-sm">The property owner will contact you within 24 hours</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p className="text-sm">Your agent will coordinate move-in details</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p className="text-sm">Keep your booking reference for all communications</p>
            </div>
          </div>
        </CardContent>
      </Card>

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
