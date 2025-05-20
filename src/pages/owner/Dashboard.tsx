
import React from 'react';
import OwnerLayout from '@/components/layout/OwnerLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock data for dashboard
const dashboardStats = [
  { title: 'Total Properties', value: '12', change: '+2', changeType: 'increase' },
  { title: 'Bookings', value: '48', change: '+5', changeType: 'increase' },
  { title: 'Occupancy Rate', value: '78%', change: '+3%', changeType: 'increase' },
  { title: 'Revenue', value: '$24,500', change: '+$2,100', changeType: 'increase' },
];

const recentBookings = [
  { id: 'BK001', property: 'Cozy Studio Apartment', student: 'John Doe', date: '2025-05-15', status: 'Pending', amount: '$850' },
  { id: 'BK002', property: 'Shared 2-Bedroom Apartment', student: 'Jane Smith', date: '2025-05-14', status: 'Confirmed', amount: '$500' },
  { id: 'BK003', property: 'Premium Single Room', student: 'Michael Johnson', date: '2025-05-12', status: 'Cancelled', amount: '$950' },
  { id: 'BK004', property: 'Cozy Studio Apartment', student: 'Emily Brown', date: '2025-05-10', status: 'Confirmed', amount: '$850' },
];

const Dashboard: React.FC = () => {
  return (
    <OwnerLayout pageTitle="Dashboard">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {dashboardStats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">{stat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-sm mt-1 ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="bookings">
              <TabsList>
                <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
                <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
              </TabsList>
              <TabsContent value="bookings" className="pt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>{booking.id}</TableCell>
                        <TableCell>{booking.property}</TableCell>
                        <TableCell>{booking.student}</TableCell>
                        <TableCell>{booking.date}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {booking.status}
                          </span>
                        </TableCell>
                        <TableCell>{booking.amount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="inquiries" className="pt-4">
                <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No recent inquiries</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Calendar/Upcoming */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-10 text-center">
                    <div className="font-semibold text-roomi-blue">24</div>
                    <div className="text-xs text-gray-500">MAY</div>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium">Property Inspection</h4>
                    <p className="text-sm text-gray-500">Cozy Studio Apartment, 2:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-10 text-center">
                    <div className="font-semibold text-roomi-blue">26</div>
                    <div className="text-xs text-gray-500">MAY</div>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium">Tenant Move-in</h4>
                    <p className="text-sm text-gray-500">Shared 2-Bedroom Apartment, 10:00 AM</p>
                  </div>
                </div>
                <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-10 text-center">
                    <div className="font-semibold text-roomi-blue">30</div>
                    <div className="text-xs text-gray-500">MAY</div>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium">Contract Signing</h4>
                    <p className="text-sm text-gray-500">Premium Single Room, 3:30 PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200"></div>
                  <div className="ml-3">
                    <p className="font-medium">John Doe</p>
                    <p className="text-sm text-gray-500">Is the room still available?</p>
                    <p className="text-xs text-gray-400">10 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200"></div>
                  <div className="ml-3">
                    <p className="font-medium">Jane Smith</p>
                    <p className="text-sm text-gray-500">Can I schedule a viewing this weekend?</p>
                    <p className="text-xs text-gray-400">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200"></div>
                  <div className="ml-3">
                    <p className="font-medium">Michael Johnson</p>
                    <p className="text-sm text-gray-500">I've sent the payment confirmation.</p>
                    <p className="text-xs text-gray-400">Yesterday</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <button className="text-sm text-roomi-blue hover:underline">View all messages</button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </OwnerLayout>
  );
};

export default Dashboard;
