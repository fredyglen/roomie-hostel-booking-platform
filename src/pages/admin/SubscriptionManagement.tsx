
import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import SubscriptionManagement from '@/components/admin/SubscriptionManagement';

const AdminSubscriptionManagement: React.FC = () => {
  return (
    <AdminLayout pageTitle="Subscription Management">
      <SubscriptionManagement />
    </AdminLayout>
  );
};

export default AdminSubscriptionManagement;
