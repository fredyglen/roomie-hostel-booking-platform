
import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import FeatureManagement from '@/components/admin/FeatureManagement';

const AdminFeatureManagement: React.FC = () => {
  return (
    <AdminLayout pageTitle="Feature Management">
      <FeatureManagement />
    </AdminLayout>
  );
};

export default AdminFeatureManagement;
