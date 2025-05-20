
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

// Mock bookings data
const bookingsData = [
  { 
    id: 'BK001', 
    property: 'Cozy Studio Apartment Near UPSA', 
    propertyId: '1',
    student: 'John Doe', 
    studentId: 'ST001',
    checkIn: '2025-06-01', 
    checkOut: '2025-12-01', 
    status: 'Pending',
    paymentStatus: 'Awaiting Payment',
    amount: 850,
    duration: '6 months',
    date: '2025-05-15'
  },
  { 
    id: 'BK002', 
    property: 'Shared 2-Bedroom Apartment', 
    propertyId: '2',
    student: 'Jane Smith', 
    studentId: 'ST002',
    checkIn: '2025-05-20', 
    checkOut: '2025-11-20', 
    status: 'Confirmed',
    paymentStatus: 'Paid',
    amount: 500 * 6,
    duration: '6 months',
    date: '2025-05-14'
  },
  { 
    id: 'BK003', 
    property: 'Premium Single Room in Hostel', 
    propertyId: '3',
    student: 'Michael Johnson', 
    studentId: 'ST003',
    checkIn: '2025-05-30', 
    checkOut: '2025-12-15', 
    status: 'Cancelled',
    paymentStatus: 'Refunded',
    amount: 950,
    duration: '1 semester',
    date: '2025-05-12'
  },
  { 
    id: 'BK004', 
    property: 'Cozy Studio Apartment Near UPSA', 
    propertyId: '1',
    student: 'Emily Brown', 
    studentId: 'ST004',
    checkIn: '2025-06-15', 
    checkOut: '2025-12-15', 
    status: 'Confirmed',
    paymentStatus: 'Paid',
    amount: 850 * 6,
    duration: '6 months',
    date: '2025-05-10'
  }
];

const Bookings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");
  
  const filteredBookings = activeTab === "all" 
    ? bookingsData 
    : bookingsData.filter(booking => booking.status.toLowerCase() === activeTab);
  
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
                          <TableCell>{booking.id}</TableCell>
                          <TableCell>{booking.property}</TableCell>
                          <TableCell>{booking.student}</TableCell>
                          <TableCell>{booking.date}</TableCell>
                          <TableCell>{booking.checkIn}</TableCell>
                          <TableCell>{booking.duration}</TableCell>
                          <TableCell>${booking.amount}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {booking.status === 'Confirmed' && (
                                <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                              )}
                              {booking.status === 'Pending' && (
                                <Clock className="w-4 h-4 mr-1 text-yellow-600" />
                              )}
                              {booking.status === 'Cancelled' && (
                                <XCircle className="w-4 h-4 mr-1 text-red-600" />
                              )}
                              <span className={`
                                ${booking.status === 'Confirmed' && 'text-green-600'}
                                ${booking.status === 'Pending' && 'text-yellow-600'}
                                ${booking.status === 'Cancelled' && 'text-red-600'}
                              `}>
                                {booking.status}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              booking.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                              booking.paymentStatus === 'Awaiting Payment' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {booking.paymentStatus}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {booking.status === 'Pending' && (
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
                              {booking.status === 'Confirmed' && (
                                <Button variant="outline" size="sm">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  Schedule
                                </Button>
                              )}
                              {booking.status === 'Cancelled' && (
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
