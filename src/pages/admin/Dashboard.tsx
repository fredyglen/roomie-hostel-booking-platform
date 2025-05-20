
import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';

const AdminDashboard: React.FC = () => {
  return (
    <AdminLayout pageTitle="Admin Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-roomi-blue">452</p>
          <p className="text-sm text-gray-500 mt-2">+12% from last month</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Properties</h3>
          <p className="text-3xl font-bold text-roomi-blue">87</p>
          <p className="text-sm text-gray-500 mt-2">+5% from last month</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Bookings</h3>
          <p className="text-3xl font-bold text-roomi-blue">215</p>
          <p className="text-sm text-gray-500 mt-2">+18% from last month</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex items-center py-2 border-b border-gray-100">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="ml-4">
                <p className="text-sm font-medium">User registered</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
