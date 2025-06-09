
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/EnhancedAuthContext';
import { Calendar } from 'lucide-react';
import BookingFilters from './BookingFilters';
import BookingCard from './BookingCard';
import BookingConfirmation from '@/components/booking/BookingConfirmation';
import PaymentStatusTracker from '@/components/payment/PaymentStatusTracker';
import { ErrorHandler } from '@/utils/ErrorHandler';
import { BaseLoading } from '@/components/ui/BaseLoading';
import { BaseError } from '@/components/ui/BaseError';

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

const BookingHistory: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showPaymentTracker, setShowPaymentTracker] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings_enhanced')
        .select('*')
        .eq('student_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      ErrorHandler.handle('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.booking_reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.package_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDownloadReceipt = (booking: Booking) => {
    ErrorHandler.log('Downloading receipt for booking:', booking.id);
  };

  const handleContactSupport = () => {
    ErrorHandler.log('Contacting support');
  };

  if (selectedBooking) {
    return (
      <div className="space-y-4">
        <Button 
          variant="outline" 
          onClick={() => setSelectedBooking(null)}
          className="mb-4"
        >
          ← Back to Bookings
        </Button>
        <BookingConfirmation 
          booking={selectedBooking}
          onDownloadReceipt={() => handleDownloadReceipt(selectedBooking)}
          onContactSupport={handleContactSupport}
        />
      </div>
    );
  }

  if (loading) {
    return <BaseLoading message="Loading your bookings..." />;
  }

  if (!loading && filteredBookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 transition-all duration-500">
        <img src="/empty-state.svg" alt="No bookings" className="w-32 h-32 mb-4 opacity-80" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
        <p className="text-gray-600">
          {searchTerm || statusFilter !== 'all' 
            ? 'Try adjusting your search or filter criteria.'
            : 'You haven\'t made any bookings yet. Start exploring properties!'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BookingFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'You haven\'t made any bookings yet. Start exploring properties!'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onViewDetails={() => setSelectedBooking(booking)}
              onTrackPayment={() => booking.payment_reference && setShowPaymentTracker(booking.payment_reference)}
              onDownloadReceipt={() => handleDownloadReceipt(booking)}
            />
          ))}
        </div>
      )}

      {showPaymentTracker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Payment Status</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPaymentTracker(null)}
                >
                  ×
                </Button>
              </div>
            </div>
            <div className="p-4">
              <PaymentStatusTracker
                transactionReference={showPaymentTracker}
                onStatusUpdate={(status) => {
                  if (status === 'success') {
                    fetchBookings();
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
