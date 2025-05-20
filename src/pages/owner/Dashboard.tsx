
import React from 'react';
import OwnerLayout from '@/components/layout/OwnerLayout';
import { Card } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const OwnerDashboard: React.FC = () => {
  // Sample data for charts
  const bookingData = [
    { month: 'Jan', bookings: 8 },
    { month: 'Feb', bookings: 12 },
    { month: 'Mar', bookings: 10 },
    { month: 'Apr', bookings: 15 },
    { month: 'May', bookings: 18 },
    { month: 'Jun', bookings: 14 },
  ];

  // Sample KPI data
  const kpiData = [
    {
      title: 'Total Properties',
      value: '3',
      change: '+1',
      isPositive: true
    },
    {
      title: 'Total Bookings',
      value: '12',
      change: '+3',
      isPositive: true
    },
    {
      title: 'Available Units',
      value: '8',
      change: '-2',
      isPositive: false
    },
    {
      title: 'Revenue',
      value: '₵5,800',
      change: '+₵1,200',
      isPositive: true
    }
  ];

  // Sample recent bookings
  const recentBookings = [
    { id: 'BK00123', propertyName: 'Cozy Studio Near UPSA', student: 'John Doe', date: '2023-05-15', status: 'Confirmed' },
    { id: 'BK00124', propertyName: '3-in-a-room Hostel', student: 'Jane Smith', date: '2023-05-14', status: 'Pending' },
  ];

  return (
    <OwnerLayout pageTitle="Dashboard">
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
      
      {/* Bookings Chart */}
      <Card className="p-6 mb-8">
        <h3 className="text-lg font-medium mb-4">Bookings Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={bookingData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="bookings" fill="#3b82f6" name="Bookings" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
      
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
    </OwnerLayout>
  );
};

export default OwnerDashboard;
