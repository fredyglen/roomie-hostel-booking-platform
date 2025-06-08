import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Skeleton } from '@/components/ui/skeleton';

interface AdminUserDisplayData {
  name: string;
  email: string;
  role: string;
  status: string;
}

const AdminUsers: React.FC = () => {
  const isLoading = false; // Replace with actual loading state when data fetching is implemented
  const users: AdminUserDisplayData[] = []; // Replace with actual data when implemented

  if (isLoading) {
    return (
      <AdminLayout pageTitle="Users Management">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">All Users</h3>
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

  if (users.length === 0) {
    return (
      <AdminLayout pageTitle="Users Management">
        <div className="flex flex-col items-center justify-center py-12 transition-all duration-500">
          <img src="/empty-state.svg" alt="No users" className="w-32 h-32 mb-4 opacity-80" />
          <p className="text-gray-500 text-lg mb-4">No users found</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Users Management">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">All Users</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[1, 2, 3, 4, 5].map((user) => (
                <tr key={user}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200"></div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">User Name {user}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">user{user}@example.com</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user % 2 === 0 ? 'Student' : 'Owner'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user % 3 === 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {user % 3 === 0 ? 'Inactive' : 'Active'}
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

export default AdminUsers;
