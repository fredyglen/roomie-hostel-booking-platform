import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, ArrowLeft, Phone, Mail, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BookingDetails {
  id: string;
  booking_reference: string;
  total_amount: number;
  base_property_price: number;
  platform_commission: number;
  platform_fee: number;
  check_in_date: string;
  check_out_date: string;
  student_name: string;
  student_email: string;
  student_phone: string;
  payment_reference: string;
  payment_method: string;
  paid_at: string;
  status: string;
  properties: {
    title: string;
    address: string;
    images: string[];
    user_id: string;
  };
  rooms?: {
    room_number: string;
    beds_count: number;
  };
}

const BookingConfirmation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { bookingId, paymentReference } = location.state || {};
  
  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) {
        toast({
          title: "Error",
          description: "No booking information found. Redirecting to dashboard.",
          variant: "destructive"
        });
        navigate('/student/dashboard');
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            properties (
              title,
              address,
              images,
              user_id
            ),
            rooms (
              room_number,
              beds_count
            )
          `)
          .eq('id', bookingId)
          .single();
        
        if (error) {
          console.error('Error fetching booking:', error);
          throw error;
        }
        
        setBooking(data);
      } catch (error) {
        console.error('Error fetching booking:', error);
        toast({
          title: "Error",
          description: "Failed to load booking details. Please contact support.",
          variant: "destructive"
        });
        navigate('/student/dashboard');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookingDetails();
  }, [bookingId, navigate, toast]);
  
  const handlePrint = () => {
    window.print();
  };
  
  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-2">Loading booking details...</span>
        </div>
      </div>
    );
  }
  
  if (!booking) {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <Card>
          <CardContent className="text-center p-8">
            <h2 className="text-xl font-semibold mb-4">Booking Not Found</h2>
            <p className="text-gray-600 mb-4">We couldn't find your booking details.</p>
            <Button onClick={() => navigate('/student/dashboard')}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">Booking Confirmed!</CardTitle>
          <p className="text-gray-600">Your accommodation has been successfully booked</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Booking Reference */}
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <h4 className="font-medium text-green-900 mb-1">Booking Reference</h4>
            <p className="text-lg font-mono font-bold text-green-700">{booking.booking_reference}</p>
          </div>
          
          {/* Property Details */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Property Details
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h4 className="font-medium">{booking.properties?.title}</h4>
              <p className="text-gray-600">{booking.properties?.address}</p>
              {booking.rooms && (
                <p className="text-sm text-gray-500">
                  Room: {booking.rooms.room_number} • {booking.rooms.beds_count} beds
                </p>
              )}
            </div>
          </div>
          
          {/* Booking Details */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Booking Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Check-in Date:</span>
                <p>{new Date(booking.check_in_date).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="font-medium">Check-out Date:</span>
                <p>{new Date(booking.check_out_date).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="font-medium">Guest Name:</span>
                <p>{booking.student_name}</p>
              </div>
              <div>
                <span className="font-medium">Contact:</span>
                <p>{booking.student_phone}</p>
              </div>
            </div>
          </div>
          
          {/* Payment Details */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Payment Information</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Property Rent:</span>
                <span>GH₵{booking.base_property_price?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Platform Commission (5%):</span>
                <span>GH₵{booking.platform_commission?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Platform Fee:</span>
                <span>GH₵{booking.platform_fee?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-2">
                <span>Total Paid:</span>
                <span>GH₵{booking.total_amount.toFixed(2)}</span>
              </div>
              <div className="text-xs text-gray-500 space-y-1 mt-2">
                <p>Payment Method: {booking.payment_method}</p>
                <p>Payment Reference: {booking.payment_reference}</p>
                <p>Paid At: {new Date(booking.paid_at).toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          {/* Next Steps */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">What's Next?</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• You'll receive a confirmation email shortly</li>
              <li>• Property owner will contact you within 24 hours</li>
              <li>• Prepare your documents for check-in</li>
              <li>• Contact support if you have any questions</li>
            </ul>
          </div>
          
          {/* Contact Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Need Help?</h4>
            <div className="flex flex-col sm:flex-row gap-2 text-sm">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-1" />
                <span>+233 XX XXX XXXX</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-1" />
                <span>support@roomi.com</span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              onClick={() => navigate('/student/dashboard')}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <Button 
              variant="outline" 
              onClick={handlePrint}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Receipt
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingConfirmation;
