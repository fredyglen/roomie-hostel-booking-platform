import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Skeleton } from '@/components/ui/skeleton';

interface AdminBookingDisplayData {
  id: string | number;
  studentName: string;
  property: string;
  date: string;
  amount: number;
  status: 'Pending' | 'Confirmed' | 'Cancelled'; // Using literal types based on current usage
}

const AdminBookings: React.FC = () => {
  const isLoading = false; // Replace with actual loading state when data fetching is implemented
  const bookings: AdminBookingDisplayData[] = []; // Replace with actual data when implemented

  if (isLoading) {
    return (
      <AdminLayout pageTitle="Bookings Management">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">All Bookings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="space-y-2 animate-pulse transition-all duration-500">
                <Skeleton className="h-48 w-full mb-4" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (bookings.length === 0) {
    return (
      <AdminLayout pageTitle="Bookings Management">
        <div className="flex flex-col items-center justify-center py-12 transition-all duration-500">
          <img src="/placeholder.svg" alt="No bookings" className="w-32 h-32 mb-4 opacity-80" />
          <p className="text-gray-500 text-lg mb-4">No bookings found</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Bookings Management">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">All Bookings</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{booking.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{booking.studentName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{booking.property}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{booking.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">${booking.amount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                      booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-roomi-blue hover:text-roomi-blue-dark mr-3">View</button>
                    <button className="text-red-600 hover:text-red-900">Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBookings;
