
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/layout/AdminLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Building, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye
} from 'lucide-react';
import { formatCurrency } from '@/utils/currency';
import DatabaseSeeder from '@/components/admin/DatabaseSeeder';
import PropertyVisibilityMonitor from '@/components/admin/PropertyVisibilityMonitor';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Mock platform statistics
  const [platformStats] = useState({
    totalUsers: 1247,
    totalProperties: 89,
    totalBookings: 342,
    monthlyRevenue: 45600,
    pendingVerifications: 12,
    activeDisputes: 3,
    newRegistrations: 28,
    platformGrowth: 15.3
  });

  const [recentActivities] = useState([
    {
      id: 1,
      type: 'registration',
      description: 'New property owner registered: Kwame Properties Ltd',
      timestamp: '2 hours ago',
      status: 'new'
    },
    {
      id: 2,
      type: 'verification',
      description: 'Property verification completed: Modern Student Apartment',
      timestamp: '4 hours ago',
      status: 'completed'
    },
    {
      id: 3,
      type: 'booking',
      description: 'High-value booking: GH₵3,500 for Premium Suite',
      timestamp: '6 hours ago',
      status: 'success'
    },
    {
      id: 4,
      type: 'dispute',
      description: 'New dispute opened: Booking #BK-2024-156',
      timestamp: '1 day ago',
      status: 'pending'
    }
  ]);

  const [pendingActions] = useState([
    {
      id: 1,
      title: 'Property Verifications',
      count: 12,
      priority: 'high',
      action: 'verify',
      route: '/admin/verification'
    },
    {
      id: 2,
      title: 'User Reports',
      count: 5,
      priority: 'medium',
      action: 'review',
      route: '/admin/users'
    },
    {
      id: 3,
      title: 'Payment Disputes',
      count: 3,
      priority: 'high',
      action: 'resolve',
      route: '/admin/bookings'
    },
    {
      id: 4,
      title: 'Content Reviews',
      count: 8,
      priority: 'low',
      action: 'moderate',
      route: '/admin/properties'
    }
  ]);

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

  if (usersLoading || propertiesLoading) {
    return (
      <AdminLayout pageTitle="Dashboard">
        <LoadingSpinner message="Loading admin dashboard..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">
            Platform overview and administrative controls for ROOMi.
          </p>
        </div>

        {/* Key Platform Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold">{usersCount || platformStats.totalUsers}</p>
                  <p className="text-xs text-green-600">+{platformStats.newRegistrations} this month</p>
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
                  <p className="text-2xl font-bold">{propertiesCount || platformStats.totalProperties}</p>
                  <p className="text-xs text-yellow-600">{platformStats.pendingVerifications} pending</p>
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
                  <p className="text-2xl font-bold">{platformStats.totalBookings}</p>
                  <p className="text-xs text-red-600">{platformStats.activeDisputes} disputes</p>
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
                  <p className="text-2xl font-bold">{formatCurrency(platformStats.monthlyRevenue)}</p>
                  <p className="text-xs text-green-600">+{platformStats.platformGrowth}% growth</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingActions.map((action) => (
                  <div 
                    key={action.id} 
                    className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(action.route)}
                  >
                    <div>
                      <h4 className="font-medium">{action.title}</h4>
                      <p className="text-sm text-gray-600 capitalize">{action.action} required</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{action.count}</p>
                      <Badge className={getPriorityColor(action.priority)}>
                        {action.priority} priority
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Platform Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <p className="text-sm">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.timestamp}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                <Eye className="h-4 w-4 mr-2" />
                View All Activity
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Admin Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Button
                    className="h-20 flex flex-col"
                    onClick={() => navigate('/admin/verification')}
                  >
                    <CheckCircle className="h-6 w-6 mb-2" />
                    Verify Properties
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex flex-col"
                    onClick={() => navigate('/admin/users')}
                  >
                    <Users className="h-6 w-6 mb-2" />
                    Manage Users
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex flex-col"
                    onClick={() => navigate('/admin/properties')}
                  >
                    <Building className="h-6 w-6 mb-2" />
                    Review Properties
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex flex-col"
                    onClick={() => navigate('/admin/settings')}
                  >
                    <TrendingUp className="h-6 w-6 mb-2" />
                    Platform Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <DatabaseSeeder />
          </div>
        </div>

        {/* Property Visibility Monitor */}
        <PropertyVisibilityMonitor />

        {/* System Health */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Database Status</span>
                  <Badge className="bg-green-100 text-green-800">Online</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Payment Gateway</span>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Email Service</span>
                  <Badge className="bg-green-100 text-green-800">Running</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Response Time</span>
                  <span className="text-sm font-medium">245ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Uptime</span>
                  <span className="text-sm font-medium">99.9%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Error Rate</span>
                  <span className="text-sm font-medium">0.1%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Storage & Bandwidth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Storage Used</span>
                  <span className="text-sm font-medium">2.3 GB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Bandwidth</span>
                  <span className="text-sm font-medium">45.2 GB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">API Calls</span>
                  <span className="text-sm font-medium">12.4K</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
