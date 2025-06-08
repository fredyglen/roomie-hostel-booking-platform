import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Skeleton } from '@/components/ui/skeleton';

interface AdminPropertyDisplayData {
  id: string | number;
  title: string;
  location: string;
  ownerName: string;
  type: string;
  price: number;
  status: string; // Or more specific union type if known
}

const AdminProperties: React.FC = () => {
  const isLoading = false; // Replace with actual loading state when data fetching is implemented
  const properties: AdminPropertyDisplayData[] = []; // Replace with actual data when implemented

  if (isLoading) {
    return (
      <AdminLayout pageTitle="Properties Management">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">All Properties</h3>
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

  if (properties.length === 0) {
    return (
      <AdminLayout pageTitle="Properties Management">
        <div className="flex flex-col items-center justify-center py-12 transition-all duration-500">
          <img src="/empty-state.svg" alt="No properties" className="w-32 h-32 mb-4 opacity-80" />
          <p className="text-gray-500 text-lg mb-4">No properties found</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Properties Management">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">All Properties</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {properties.map((property) => (
                <tr key={property.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded bg-gray-200"></div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{property.title}</div>
                        <div className="text-xs text-gray-500">{property.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{property.ownerName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{property.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">${(property.price * 100) + 400}/month</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      property.status === 'Pending Review' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {property.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-roomi-blue hover:text-roomi-blue-dark mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
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

export default AdminProperties;
