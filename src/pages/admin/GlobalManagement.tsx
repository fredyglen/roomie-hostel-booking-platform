/**
 * Supreme Admin Global Management Page
 * Apple-Grade implementation following BE CONSCIOUS standards
 * 
 * Business Purpose: Provides global platform management for Supreme Admins
 * including country oversight, campus management, and international operations
 * 
 * Technical Implementation: Integrates with AdminAuthContext for secure access,
 * Ghana-specific features, and comprehensive global platform monitoring
 * 
 * @author ROOMi Platform Team
 * @version 2.0.0
 * @compliance BE CONSCIOUS Apple-Grade Standards
 */

import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import GhanaAdminFeatures from '@/components/admin/GhanaAdminFeatures';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Globe, 
  Crown, 
  TrendingUp, 
  Users, 
  Building, 
  DollarSign,
  Settings,
  Shield,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { createAdminPermission } from '@/types/auth';

/**
 * Supreme Admin Global Management Component
 */
const AdminGlobalManagement: React.FC = () => {
  const { getAdminRole, hasPermission, validateAccess } = useAdminAuth();

  // Verify Supreme Admin access
  if (getAdminRole() !== 'supreme_admin') {
    return (
      <AdminLayout pageTitle="Access Denied">
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Global Management is only available to Supreme Administrators.
          </AlertDescription>
        </Alert>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      pageTitle="Global Management" 
      showRoleInfo={true}
      requiredPermission={createAdminPermission('global.write')}
    >
      <div className="space-y-6">
        {/* Supreme Admin Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Crown className="h-8 w-8 text-purple-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Global Platform Management</h1>
              <p className="text-gray-600">Supreme Administrator Control Center</p>
            </div>
          </div>
          <Badge className="bg-purple-100 text-purple-800 flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Supreme Admin Access
          </Badge>
        </div>

        {/* Global Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Globe className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Countries</p>
                  <p className="text-2xl font-bold">1</p>
                  <p className="text-xs text-blue-600">Ghana Active</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Campuses</p>
                  <p className="text-2xl font-bold">8</p>
                  <p className="text-xs text-green-600">Universities</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Global Users</p>
                  <p className="text-2xl font-bold">12,456</p>
                  <p className="text-xs text-purple-600">Active Students</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Global Revenue</p>
                  <p className="text-2xl font-bold">GHS 456K</p>
                  <p className="text-xs text-orange-600">This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Global Management Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Country Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Manage country-specific settings, regulations, and operations.
              </p>
              <Button className="w-full">
                Manage Countries
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Campus Oversight
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Monitor and manage all university campuses across regions.
              </p>
              <Button className="w-full">
                Campus Dashboard
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Admin Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Create and manage Campus Admin accounts and permissions.
              </p>
              <Button className="w-full">
                Manage Admins
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Configure global platform settings and business rules.
              </p>
              <Button className="w-full">
                System Settings
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Global Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                View comprehensive analytics across all markets and regions.
              </p>
              <Button className="w-full">
                View Analytics
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security & Audit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Monitor security events and access comprehensive audit logs.
              </p>
              <Button className="w-full">
                Security Center
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Ghana-Specific Features */}
        <div className="mt-8">
          <GhanaAdminFeatures />
        </div>

        {/* System Health Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Global System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">98.5%</div>
                <div className="text-sm text-gray-600">System Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">1.2s</div>
                <div className="text-sm text-gray-600">Avg Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">99.8%</div>
                <div className="text-sm text-gray-600">Transaction Success</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminGlobalManagement;
