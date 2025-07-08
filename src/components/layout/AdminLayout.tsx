
import React from 'react';
import AdminNavbar from './AdminNavbar';

interface AdminLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, pageTitle }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <main className="container mx-auto px-4 py-4">
        {pageTitle && (
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
          </div>
        )}
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
