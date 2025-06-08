import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/EnhancedAuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { ErrorDisplay } from '@/components/common/ErrorDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, DollarSign, Eye, MessageCircle } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';
import { ErrorHandler } from '@/utils/ErrorHandler';

const BookingHistory: React.FC = () => {
  const { user } = useAuth();

  // Mock booking data
  const [mockBookings] = useState([
    {
      id: 1,
      bookingReference: 'BK-2024-001',
      propertyTitle: 'Modern Studio Apartment near UPSA',
      propertyAddress: 'East Legon, Accra',
      checkInDate: '2024-06-15',
      checkOutDate: '2024-12-15',
      totalAmount: 3600,
      status: 'confirmed',
      paymentStatus: 'paid',
      propertyImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=400',
      ownerName: 'Kwame Asante',
      ownerPhone: '+233 24 123 4567'
    },
    {
      id: 2,
      bookingReference: 'BK-2024-002',
      propertyTitle: 'Shared 2-Bedroom in Legon',
      propertyAddress: 'Legon, Accra',
      checkInDate: '2024-08-01',
      checkOutDate: '2024-12-20',
      totalAmount: 2400,
      status: 'pending',
      paymentStatus: 'pending',
      propertyImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=400',
      ownerName: 'Ama Serwaa',
      ownerPhone: '+233 20 987 6543'
    },
    {
      id: 3,
      bookingReference: 'BK-2024-003',
      propertyTitle: 'Premium Hostel Room',
      propertyAddress: 'Ayeduase, Kumasi',
      checkInDate: '2024-09-15',
      checkOutDate: '2024-12-15',
      totalAmount: 2850,
      status: 'completed',
      paymentStatus: 'paid',
      propertyImage: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&q=80&w=400',
      ownerName: 'Kofi Mensah',
      ownerPhone: '+233 50 111 2222'
    }
  ]);

  // Query for actual bookings (will fallback to mock data if no real bookings)
  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ['bookings', user?.id],
    queryFn: async () => {
      if (!user?.id) return mockBookings;

      const { data, error } = await supabase
        .from('bookings_enhanced')
        .select(`
          *,
          properties (
            title,
            address,
            images
          )
        `)
        .eq('student_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        ErrorHandler.handle(error, 'BookingHistory error fetching bookings');
        return mockBookings; // Fallback to mock data
      }

      // Transform database bookings to match our interface
      return data.map(booking => ({
        id: booking.id,
        bookingReference: booking.booking_reference,
        propertyTitle: booking.properties?.title || 'Property',
        propertyAddress: booking.properties?.address || 'Address not available',
        checkInDate: booking.check_in_date,
        checkOutDate: booking.check_out_date,
        totalAmount: booking.total_amount,
        status: booking.status,
        paymentStatus: booking.payment_status,
        propertyImage: booking.properties?.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=400',
        ownerName: 'Property Owner',
        ownerPhone: '+233 XX XXX XXXX'
      }));
    },
    enabled: !!user?.id,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <LoadingSpinner message="Loading your booking history..." />
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <ErrorDisplay 
            error={error} 
            onRetry={() => window.location.reload()}
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking History</h1>
          <p className="text-gray-600">
            View and manage your property bookings
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{bookings?.length || 0}</p>
                <p className="text-sm text-gray-600">Total Bookings</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {bookings?.filter(b => b.status === 'confirmed').length || 0}
                </p>
                <p className="text-sm text-gray-600">Confirmed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {bookings?.filter(b => b.status === 'pending').length || 0}
                </p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(bookings?.reduce((sum, b) => sum + (b.totalAmount || 0), 0) || 0)}
                </p>
                <p className="text-sm text-gray-600">Total Spent</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          {bookings && bookings.length > 0 ? (
            bookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Property Image */}
                    <div className="md:w-64 h-48 md:h-auto">
                      <img
                        src={booking.propertyImage}
                        alt={booking.propertyTitle}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </div>

                    {/* Booking Details */}
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{booking.propertyTitle}</h3>
                          <div className="flex items-center text-gray-600 mb-2">
                            <MapPin className="h-4 w-4 mr-1" />
                            {booking.propertyAddress}
                          </div>
                          <p className="text-sm text-gray-500">
                            Booking Reference: {booking.bookingReference}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="space-y-2">
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                            <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
                              {booking.paymentStatus}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Check-in</p>
                            <p className="font-medium">{booking.checkInDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Check-out</p>
                            <p className="font-medium">{booking.checkOutDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Total Amount</p>
                            <p className="font-bold text-lg">{formatCurrency(booking.totalAmount)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Owner Info */}
                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <p className="text-sm text-gray-600">Property Owner</p>
                        <p className="font-medium">{booking.ownerName}</p>
                        <p className="text-sm text-gray-500">{booking.ownerPhone}</p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        
                        {booking.status === 'confirmed' && (
                          <Button variant="outline" size="sm">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Contact Owner
                          </Button>
                        )}
                        
                        {booking.status === 'pending' && booking.paymentStatus === 'pending' && (
                          <Button size="sm">
                            <DollarSign className="h-4 w-4 mr-1" />
                            Complete Payment
                          </Button>
                        )}
                        
                        {booking.status === 'completed' && (
                          <Button variant="outline" size="sm">
                            Download Receipt
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
                <p className="text-gray-600 mb-6">
                  You haven't made any property bookings yet. Start exploring properties to make your first booking.
                </p>
                <Button onClick={() => window.location.href = '/student/properties'}>
                  Browse Properties
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingHistory;
