
/**
 * Enhanced Admin Dashboard with Role-Based Access Control
 * Apple-Grade implementation following BE CONSCIOUS standards
 *
 * Business Purpose: Provides comprehensive admin dashboard for ROOMi platform
 * with Supreme and Campus admin role differentiation, Ghana-specific metrics,
 * and real-time platform monitoring
 *
 * Technical Implementation: Integrates with AdminAuthContext for secure access,
 * role-based feature display, and comprehensive error handling
 *
 * @author ROOMi Platform Team
 * @version 2.0.0
 * @compliance BE CONSCIOUS Apple-Grade Standards
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/context/AdminAuthContext';
import AdminLayout from '@/components/layout/AdminLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import CampusAdminDashboard from '@/components/admin/CampusAdminDashboard';
import StudentVerificationSystem from '@/components/admin/StudentVerificationSystem';
import CampusPropertyManagement from '@/components/admin/CampusPropertyManagement';
import CampusAnalytics from '@/components/admin/CampusAnalytics';
import CampusComplianceSupport from '@/components/admin/CampusComplianceSupport';
import UniversityIntegration from '@/components/admin/UniversityIntegration';
import LocalDisputeResolution from '@/components/admin/LocalDisputeResolution';
import GhanaAdminFeatures from '@/components/admin/GhanaAdminFeatures';
import { AdminQueries } from '@/services/database/standardizedQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Users,
  Building,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Crown,
  School,
  Globe,
  Shield,
  FileCheck,
  Activity
} from 'lucide-react';
import {
  AdminRoleType,
  createAdminPermission,
  createCampusJurisdiction,
  createCountryJurisdiction
} from '@/types/auth';
import { formatCurrency } from '@/utils/currency';


/**
 * Enhanced Admin Dashboard Component
 * Provides role-based dashboard with Supreme and Campus admin features
 */
const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');

  // Admin authentication context
  const {
    adminUser,
    getAdminRole,
    hasPermission,
    hasJurisdiction,
    validateAccess
  } = useAdminAuth();

  // Real platform statistics (strictly from database)
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-platform-stats-v2'],
    queryFn: async () => {
      // Users count
      const usersCountPromise = supabase.from('profiles').select('*', { count: 'exact', head: true });
      // Properties count
      const propertiesCountPromise = supabase.from('properties').select('*', { count: 'exact', head: true });
      // Bookings count
      const bookingsCountPromise = supabase.from('bookings_enhanced').select('*', { count: 'exact', head: true });
      // Pending verifications count
      const pendingVerificationsPromise = supabase
        .from('property_verifications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      const [usersRes, propertiesRes, bookingsRes, verificationsRes] = await Promise.all([
        usersCountPromise, propertiesCountPromise, bookingsCountPromise, pendingVerificationsPromise
      ]);

      // Monthly revenue from paid bookings in current month
      const startOfMonth = new Date();
      startOfMonth.setDate(1); startOfMonth.setHours(0,0,0,0);
      const { data: monthlyBookings, error: monthlyErr } = await supabase
        .from('bookings_enhanced')
        .select('total_amount, payment_status, created_at')
        .gte('created_at', startOfMonth.toISOString());
      if (monthlyErr) throw monthlyErr;
      const monthlyRevenue = (monthlyBookings || [])
        .filter(b => (b as any).payment_status === 'paid' || (b as any).payment_status === 'success')
        .reduce((sum, b: any) => sum + (b.total_amount || 0), 0);

      return {
        totalUsers: usersRes.count || 0,
        totalProperties: propertiesRes.count || 0,
        totalBookings: bookingsRes.count || 0,
        monthlyRevenue,
        pendingVerifications: verificationsRes.count || 0
      };
    },
    refetchInterval: 30000
  });

  // Real recent bookings (latest 6)
  const { data: recentBookings } = useQuery({
    queryKey: ['admin-recent-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings_enhanced')
        .select('booking_reference, total_amount, payment_status, created_at, properties(title, city)')
        .order('created_at', { ascending: false })
        .limit(6);
      if (error) throw error;
      return data || [];
    }
  });

  // Real pending verifications preview (latest 6)
  const { data: pendingVerificationsList } = useQuery({
    queryKey: ['admin-pending-verifications-preview'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_verifications')
        .select('id, created_at, verification_type, properties(title)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(6);
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch real data
  const { data: usersCount, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      return count || 0;
    }
  });

  const { data: propertiesCount, isLoading: propertiesLoading } = useQuery({
    queryKey: ['admin-properties-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      return count || 0;
    }
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'registration':
        return <Users className="h-4 w-4 text-blue-600" />;
      case 'verification':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'booking':
        return <Calendar className="h-4 w-4 text-purple-600" />;
      case 'dispute':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (statsLoading) {
    return (
      <AdminLayout pageTitle="Dashboard">
        <LoadingSpinner message="Loading admin dashboard..." />
      </AdminLayout>
    );
  }

  // ============================================================================
  // ROLE-BASED DASHBOARD RENDERING
  // ============================================================================

  // Campus Admin Dashboard
  if (getAdminRole() === 'campus_admin') {
    return (
      <AdminLayout pageTitle="Campus Dashboard">
        <CampusAdminDashboard />
      </AdminLayout>
    );
  }

  // Supreme Admin Dashboard (data-driven)
  return (
    <AdminLayout pageTitle="Supreme Admin Dashboard" showRoleInfo>
      <div className="space-y-6">
        {/* Key Platform Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Properties</p>
                  <p className="text-2xl font-bold">{stats?.totalProperties || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold">{stats?.totalBookings || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats?.monthlyRevenue || 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data-driven panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Verifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(pendingVerificationsList || []).map((v: any) => (
                  <div key={v.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium text-sm">{v.properties?.title || 'Property'}</div>
                      <div className="text-xs text-gray-500">{new Date(v.created_at).toLocaleString()}</div>
                    </div>
                    <Badge variant="secondary">{v.verification_type}</Badge>
                  </div>
                ))}
                {(!pendingVerificationsList || pendingVerificationsList.length === 0) && (
                  <div className="text-sm text-gray-500">No pending verifications</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(recentBookings || []).map((b: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium text-sm">{b.properties?.title || b.booking_reference}</div>
                      <div className="text-xs text-gray-500">{new Date(b.created_at).toLocaleString()}</div>
                    </div>
                    <div className="text-sm font-semibold">{formatCurrency(b.total_amount || 0)}</div>
                  </div>
                ))}
                {(!recentBookings || recentBookings.length === 0) && (
                  <div className="text-sm text-gray-500">No recent bookings</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
