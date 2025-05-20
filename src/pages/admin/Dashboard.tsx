
import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { CircleCheck, Building, UserCheck, DollarSign, Calendar, Users } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  return (
    <AdminLayout pageTitle="Admin Dashboard">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-700">Total Users</h3>
              <div className="p-3 bg-blue-50 rounded-full">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">452</p>
            <div className="flex items-center text-sm">
              <span className="text-green-500 font-medium">+12%</span>
              <span className="text-gray-500 ml-2">from last month</span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-700">Total Properties</h3>
              <div className="p-3 bg-purple-50 rounded-full">
                <Building className="h-6 w-6 text-purple-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">87</p>
            <div className="flex items-center text-sm">
              <span className="text-green-500 font-medium">+5%</span>
              <span className="text-gray-500 ml-2">from last month</span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-700">Total Bookings</h3>
              <div className="p-3 bg-green-50 rounded-full">
                <Calendar className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">215</p>
            <div className="flex items-center text-sm">
              <span className="text-green-500 font-medium">+18%</span>
              <span className="text-gray-500 ml-2">from last month</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Revenue Overview</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                <p className="text-gray-500">Revenue chart will be displayed here</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-700">Recent Bookings</h3>
                <button className="text-sm text-blue-600 hover:underline">View all</button>
              </div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex items-center py-2 border-b border-gray-100">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                      <CircleCheck className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Booking #{1000 + item}</p>
                      <p className="text-xs text-gray-500">Single Room • UPSA Campus</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-blue-600">GH₵ {850 * item}</p>
                      <p className="text-xs text-gray-500">{item} days ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Top Performing Properties</h3>
              <div className="space-y-4">
                {[
                  { name: "UPSA Premium Hostels", bookings: 45, revenue: 38250 },
                  { name: "University Studios", bookings: 38, revenue: 28500 },
                  { name: "Campus View Apartments", bookings: 32, revenue: 24000 },
                  { name: "Legon Heights", bookings: 28, revenue: 21000 }
                ].map((property, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div>
                      <p className="font-medium">{property.name}</p>
                      <p className="text-xs text-gray-500">{property.bookings} bookings</p>
                    </div>
                    <p className="font-medium text-green-600">GH₵ {property.revenue}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-700">ROOMi Platform Stats</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">New Users (This Month)</p>
                  <p className="font-medium">47</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">Active Properties</p>
                  <p className="font-medium">65</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">Booking Conversion Rate</p>
                  <p className="font-medium">24%</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">Average Booking Value</p>
                  <p className="font-medium">GH₵ 750</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">Customer Satisfaction</p>
                  <p className="font-medium">4.7/5</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
