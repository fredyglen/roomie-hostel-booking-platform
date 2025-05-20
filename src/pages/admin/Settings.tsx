
import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';

const AdminSettings: React.FC = () => {
  return (
    <AdminLayout pageTitle="Platform Settings">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Platform Name
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                defaultValue="ROOMi"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Support Email
              </label>
              <input
                type="email"
                className="w-full p-2 border border-gray-300 rounded-md"
                defaultValue="support@roomi.com"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Platform Description
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
              defaultValue="ROOMi is a platform connecting students with affordable housing options near their campuses."
            />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div>
              <p className="font-medium">Service Fee</p>
              <p className="text-sm text-gray-500">Fee charged on each booking</p>
            </div>
            <div className="flex items-center">
              <input
                type="number"
                className="w-20 p-2 border border-gray-300 rounded-md"
                defaultValue="5"
              />
              <span className="ml-2">%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div>
              <p className="font-medium">Paystack Integration</p>
              <p className="text-sm text-gray-500">Enable payment via Paystack</p>
            </div>
            <div>
              <input type="checkbox" className="h-5 w-5 text-roomi-blue" defaultChecked />
            </div>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div>
              <p className="font-medium">Mobile Money Integration</p>
              <p className="text-sm text-gray-500">Enable mobile money payments</p>
            </div>
            <div>
              <input type="checkbox" className="h-5 w-5 text-roomi-blue" defaultChecked />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button className="bg-roomi-blue text-white px-4 py-2 rounded-md hover:bg-roomi-blue-dark transition-colors">
          Save Settings
        </button>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
