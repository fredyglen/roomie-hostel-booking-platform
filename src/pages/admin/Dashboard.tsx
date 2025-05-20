
import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard: React.FC = () => {
  // Sample data for charts
  const bookingData = [
    { month: 'Jan', bookings: 12 },
    { month: 'Feb', bookings: 19 },
    { month: 'Mar', bookings: 15 },
    { month: 'Apr', bookings: 23 },
    { month: 'May', bookings: 28 },
    { month: 'Jun', bookings: 32 },
  ];

  const propertyTypeData = [
    { name: 'Hostel', value: 45 },
    { name: 'Homestel', value: 30 },
    { name: 'Apartment', value: 25 },
  ];

  const locationData = [
    { name: 'East Legon', value: 28 },
    { name: 'Madina', value: 22 },
    { name: 'Atomic', value: 18 },
    { name: 'Legon', value: 32 },
  ];

  const COLORS = ['#7E69AB', '#6E59A5', '#9b87f5', '#8B5CF6'];

  // Sample KPI data
  const kpiData = [
    {
      title: 'Total Properties',
      value: '124',
      change: '+12%',
      isPositive: true
    },
    {
      title: 'Total Bookings',
      value: '342',
      change: '+18%',
      isPositive: true
    },
    {
      title: 'Active Users',
      value: '1,248',
      change: '+24%',
      isPositive: true
    },
    {
      title: 'Revenue',
      value: '₵82,500',
      change: '+15%',
      isPositive: true
    }
  ];

  // Sample recent bookings
  const recentBookings = [
    { id: 'BK00123', propertyName: 'Cozy Studio Near UPSA', student: 'John Doe', date: '2023-05-15', status: 'Confirmed' },
    { id: 'BK00124', propertyName: '3-in-a-room Hostel', student: 'Jane Smith', date: '2023-05-14', status: 'Pending' },
    { id: 'BK00125', propertyName: 'Premium Apartment', student: 'Michael Johnson', date: '2023-05-12', status: 'Confirmed' },
    { id: 'BK00126', propertyName: 'Chamber & Hall', student: 'Sarah Williams', date: '2023-05-10', status: 'Cancelled' }
  ];

  return (
    <AdminLayout pageTitle="Admin Dashboard">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="p-6">
            <p className="text-sm text-gray-500">{kpi.title}</p>
            <div className="flex justify-between items-end mt-2">
              <p className="text-2xl font-bold">{kpi.value}</p>
              <span className={`text-sm ${kpi.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {kpi.change}
              </span>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Tabs for different charts */}
      <Tabs defaultValue="bookings" className="mb-8">
        <TabsList className="bg-[#9b87f5]/10">
          <TabsTrigger value="bookings" className="data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white">Bookings</TabsTrigger>
          <TabsTrigger value="properties" className="data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white">Properties</TabsTrigger>
          <TabsTrigger value="locations" className="data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white">Locations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bookings" className="pt-4">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Bookings per Month</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bookingData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="bookings" fill="#9b87f5" name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>
        
        <TabsContent value="properties" className="pt-4">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Property Types</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={propertyTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {propertyTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>
        
        <TabsContent value="locations" className="pt-4">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Properties by Location</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={locationData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {locationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Recent Bookings */}
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Recent Bookings</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4">Booking ID</th>
                <th className="text-left py-2 px-4">Property</th>
                <th className="text-left py-2 px-4">Student</th>
                <th className="text-left py-2 px-4">Date</th>
                <th className="text-left py-2 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking, index) => (
                <tr key={index} className={index < recentBookings.length - 1 ? "border-b" : ""}>
                  <td className="py-2 px-4">{booking.id}</td>
                  <td className="py-2 px-4">{booking.propertyName}</td>
                  <td className="py-2 px-4">{booking.student}</td>
                  <td className="py-2 px-4">{booking.date}</td>
                  <td className="py-2 px-4">
                    <span className={`inline-block px-2 py-1 rounded text-xs ${
                      booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AdminLayout>
  );
};

export default AdminDashboard;
