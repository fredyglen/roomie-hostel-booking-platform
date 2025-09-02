import React, { useState } from 'react';
import OwnerLayout from '@/components/layout/OwnerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Check,
  CheckCircle,
  Clock,
  Download,
  Filter,
  X,
  XCircle,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { BaseLoading } from '@/components/ui/BaseLoading';
import { BaseError } from '@/components/ui/BaseError';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/EnhancedAuthContext';
import { OwnerQueries } from '@/services/database/ownerQueries';

// BE CONSCIOUS: NO HARDCODED DATA - Use real database queries only

const Bookings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");

  // Real data queries (BE CONSCIOUS: No hardcoded data)
  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ['owner-bookings', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      return await OwnerQueries.getRecentBookings(user.id, 50); // Get more bookings for full list
    },
    enabled: !!user?.id,
  });

  const filteredBookings = activeTab === "all"
    ? (bookingsData || [])
    : (bookingsData || []).filter(booking => booking.status.toLowerCase() === activeTab);

  const handleApproveBooking = (bookingId: string) => {
    toast({
      title: "Booking Approved",
      description: `Booking #${bookingId} has been approved`,
    });
  };

  const handleRejectBooking = (bookingId: string) => {
    toast({
      variant: "destructive",
      title: "Booking Rejected",
      description: `Booking #${bookingId} has been rejected`,
    });
  };

  const bookings = bookingsData || [];

  if (isLoading) {
    return <BaseLoading message="Loading bookings..." />;
  }

  if (!isLoading && bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 transition-all duration-500">
        <img src="/empty-state.svg" alt="No bookings" className="w-32 h-32 mb-4 opacity-80" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
        <p className="text-gray-600">No bookings have been made yet.</p>
      </div>
    );
  }
  
  return (
    <OwnerLayout pageTitle="Bookings">
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookingsData.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookingsData.filter(b => b.status === 'Pending').length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Confirmed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookingsData.filter(b => b.status === 'Confirmed').length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Cancelled</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookingsData.filter(b => b.status === 'Cancelled').length}</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Bookings</CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>
              
              <div className="mt-4 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Check-in</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.length > 0 ? (
                      filteredBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>{booking.booking_reference || booking.id}</TableCell>
                          <TableCell>{booking.property_title}</TableCell>
                          <TableCell>{booking.student_name}</TableCell>
                          <TableCell>{new Date(booking.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date(booking.check_in_date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {Math.ceil((new Date(booking.check_out_date).getTime() - new Date(booking.check_in_date).getTime()) / (1000 * 60 * 60 * 24 * 30))} months
                          </TableCell>
                          <TableCell>GH₵{booking.total_amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {booking.status === 'confirmed' && (
                                <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                              )}
                              {booking.status === 'pending' && (
                                <Clock className="w-4 h-4 mr-1 text-yellow-600" />
                              )}
                              {booking.status === 'cancelled' && (
                                <XCircle className="w-4 h-4 mr-1 text-red-600" />
                              )}
                              <span className={`
                                ${booking.status === 'confirmed' && 'text-green-600'}
                                ${booking.status === 'pending' && 'text-yellow-600'}
                                ${booking.status === 'cancelled' && 'text-red-600'}
                              `}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              booking.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                              booking.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {booking.status === 'pending' && (
                                <>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleApproveBooking(booking.id)}
                                  >
                                    <Check className="w-4 h-4 mr-1 text-green-600" />
                                    Approve
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleRejectBooking(booking.id)}
                                  >
                                    <X className="w-4 h-4 mr-1 text-red-600" />
                                    Reject
                                  </Button>
                                </>
                              )}
                              {booking.status === 'confirmed' && (
                                <Button variant="outline" size="sm">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  Schedule
                                </Button>
                              )}
                              {booking.status === 'cancelled' && (
                                <Button variant="outline" size="sm">
                                  View Details
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={10} className="h-24 text-center">
                          No bookings found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Upcoming Move-ins */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Move-ins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookingsData
                  .filter(b => b.status === 'Confirmed')
                  .slice(0, 3)
                  .map(booking => (
                    <div key={booking.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 w-10 text-center">
                        <div className="font-semibold text-roomi-blue">
                          {booking.checkIn.split('-')[2]}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(booking.checkIn).toLocaleString('default', { month: 'short' })}
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="font-medium">{booking.student}</h4>
                        <p className="text-sm text-gray-500">
                          {booking.property}, {booking.duration}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Booking Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookingsData.slice(0, 4).map(booking => (
                  <div key={booking.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div>
                      <div className="font-medium">{booking.student}</div>
                      <div className="text-sm text-gray-500">
                        {booking.status === 'Confirmed' ? 'Booked' : 
                         booking.status === 'Pending' ? 'Requested' : 'Cancelled'} {booking.property}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">{booking.date}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </OwnerLayout>
  );
};

export default Bookings;
