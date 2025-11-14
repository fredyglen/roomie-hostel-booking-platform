import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, ArrowLeft, Phone, Mail, MapPin, Calendar, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorDisplay from '@/components/common/ErrorDisplay';

interface BookingDetails {
  id: string;
  booking_reference: string;
  total_amount: number;
  property_rent: number;
  platform_fee: number;
  agent_fee: number;
  check_in_date: string;
  check_out_date: string;
  semester_period: string;
  room_type: string;
  roommates_count: number;
  payment_reference: string;
  payment_method: string;
  payment_status: string;
  status: string;
  student_id_number: string;
  university: string;
  program: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  special_requests: string;
  created_at: string;
  properties: {
    id: string;
    title: string;
    address: string;
    images: string[];
    rent: number;
  };
  profiles: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
}

const BookingConfirmation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get booking ID from URL params or location state
  const bookingId = searchParams.get('id') || location.state?.bookingId;
  
  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) {
        setError("No booking information found.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('bookings_enhanced')
          .select(`
            *,
            properties (
              id,
              title,
              address,
              images,
              rent
            ),
            profiles (
              first_name,
              last_name,
              email,
              phone
            )
          `)
          .eq('id', bookingId)
          .single();

        if (error) {
          console.error('Error fetching booking:', error);
          throw new Error('Booking not found');
        }

        setBooking(data);
      } catch (error) {
        console.error('Error fetching booking:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to load booking details';
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId, toast]);
  
  const handlePrint = () => {
    window.print();
  };
  
  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <LoadingSpinner message="Loading booking details..." />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <ErrorDisplay
          error={error || 'Booking not found'}
          title="Unable to load booking"
          onRetry={() => window.location.reload()}
        />
        <div className="text-center mt-6">
          <Button onClick={() => navigate('/student/properties')}>
            Back to Properties
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <CardTitle className="text-3xl text-green-600 mb-2">Booking Confirmed!</CardTitle>
          <p className="text-lg text-gray-600">Your ROOMi accommodation has been successfully booked</p>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Booking Reference */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl text-center border border-green-200">
            <h4 className="font-semibold text-green-900 mb-2 text-lg">Booking Reference</h4>
            <p className="text-2xl font-mono font-bold text-green-700">{booking.booking_reference || `BK-${booking.id.slice(0, 8).toUpperCase()}`}</p>
            <p className="text-sm text-gray-600 mt-2">Keep this reference for your records</p>
          </div>
          
          {/* Property Details */}
          <div className="space-y-4">
            <h3 className="font-bold text-xl flex items-center text-gray-900">
              <MapPin className="w-6 h-6 mr-3 text-primary" />
              Property Details
            </h3>
            <div className="bg-gray-50 p-6 rounded-xl space-y-4 border">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-gray-900">{booking.properties?.title}</h4>
                  <p className="text-gray-600 mt-1">{booking.properties?.address}</p>
                </div>
                {booking.properties?.images?.[0] && (
                  <img
                    src={booking.properties.images[0]}
                    alt={booking.properties.title}
                    className="w-20 h-20 object-cover rounded-lg ml-4"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center p-3 bg-white rounded-lg">
                  <Users className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <p className="text-sm font-medium">{booking.room_type || 'Standard Room'}</p>
                  <p className="text-xs text-gray-500">Room Type</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <Users className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <p className="text-sm font-medium">{booking.roommates_count} {booking.roommates_count === 1 ? 'Person' : 'People'}</p>
                  <p className="text-xs text-gray-500">Occupancy</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <Calendar className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <p className="text-sm font-medium">{booking.semester_period || 'Semester'}</p>
                  <p className="text-xs text-gray-500">Duration</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Student & Booking Information */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Booking Details */}
            <div className="space-y-4">
              <h3 className="font-bold text-xl text-gray-900">Booking Information</h3>
              <div className="bg-gray-50 p-6 rounded-xl space-y-4 border">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="font-medium text-gray-700">Check-in Date:</span>
                    <span className="font-semibold">{new Date(booking.check_in_date).toLocaleDateString('en-GB')}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="font-medium text-gray-700">Check-out Date:</span>
                    <span className="font-semibold">{new Date(booking.check_out_date).toLocaleDateString('en-GB')}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="font-medium text-gray-700">Booking Status:</span>
                    <span className={`font-semibold px-3 py-1 rounded-full text-sm ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || 'Confirmed'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium text-gray-700">Payment Status:</span>
                    <span className={`font-semibold px-3 py-1 rounded-full text-sm ${
                      booking.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                      booking.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.payment_status?.charAt(0).toUpperCase() + booking.payment_status?.slice(1) || 'Paid'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Student Information */}
            <div className="space-y-4">
              <h3 className="font-bold text-xl text-gray-900">Student Information</h3>
              <div className="bg-gray-50 p-6 rounded-xl space-y-4 border">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="font-medium text-gray-700">Name:</span>
                    <span className="font-semibold">{booking.profiles?.first_name} {booking.profiles?.last_name}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="font-medium text-gray-700">Email:</span>
                    <span className="font-semibold">{booking.profiles?.email}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="font-medium text-gray-700">Phone:</span>
                    <span className="font-semibold">{booking.profiles?.phone}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="font-medium text-gray-700">Student ID:</span>
                    <span className="font-semibold">{booking.student_id_number || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="font-medium text-gray-700">University:</span>
                    <span className="font-semibold">{booking.university || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium text-gray-700">Program:</span>
                    <span className="font-semibold">{booking.program || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Payment Details */}
          <div className="space-y-4">
            <h3 className="font-bold text-xl text-gray-900">Payment Information</h3>
            <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">Property Rent:</span>
                  <span className="font-semibold">₵{booking.property_rent?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">Platform Fee (80 GHS):</span>
                  <span className="font-semibold">₵80.00</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">Processing Fee (20 GHS):</span>
                  <span className="font-semibold">₵20.00</span>
                </div>
                <div className="border-t border-green-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total Paid:</span>
                    <span className="text-2xl font-bold text-green-600">₵{booking.total_amount.toFixed(2)}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-green-200">
                  <p className="text-xs text-gray-600 italic">
                    Note: Property owner pays 10% platform commission separately
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-green-200 space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Payment Method:</span>
                    <p className="text-gray-900">{booking.payment_method || 'Paystack'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Payment Reference:</span>
                    <p className="text-gray-900 font-mono">{booking.payment_reference || 'N/A'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium text-gray-700">Booking Created:</span>
                    <p className="text-gray-900">{new Date(booking.created_at).toLocaleString('en-GB')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          {booking.emergency_contact_name && (
            <div className="space-y-4">
              <h3 className="font-bold text-xl text-gray-900">Emergency Contact</h3>
              <div className="bg-gray-50 p-6 rounded-xl border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-gray-700">Name:</span>
                    <p className="font-semibold">{booking.emergency_contact_name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Phone:</span>
                    <p className="font-semibold">{booking.emergency_contact_phone}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Special Requests */}
          {booking.special_requests && (
            <div className="space-y-4">
              <h3 className="font-bold text-xl text-gray-900">Special Requests</h3>
              <div className="bg-gray-50 p-6 rounded-xl border">
                <p className="text-gray-700">{booking.special_requests}</p>
              </div>
            </div>
          )}

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
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button
              onClick={() => navigate('/student/properties')}
              variant="outline"
              className="flex-1 h-12"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Browse More Properties
            </Button>
            <Button
              onClick={() => navigate('/student/dashboard')}
              className="flex-1 h-12"
            >
              Go to Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={handlePrint}
              className="flex-1 h-12"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Receipt
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingConfirmation;
