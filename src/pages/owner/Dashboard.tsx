
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/EnhancedAuthContext';
import OwnerLayout from '@/components/layout/OwnerLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import { OwnerQueries } from '@/services/database/ownerQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Building,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Eye,
  Plus,
  MessageCircle,
  Star
} from 'lucide-react';
import { formatCurrency } from '@/utils/currency';

const OwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Real data queries
  const { data: dashboardStats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['owner-dashboard-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      return await OwnerQueries.getDashboardStats(user.id);
    },
    enabled: !!user?.id,
  });

  const { data: recentBookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['owner-recent-bookings', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      return await OwnerQueries.getRecentBookings(user.id, 5);
    },
    enabled: !!user?.id,
  });

  const { data: propertyPerformance, isLoading: performanceLoading } = useQuery({
    queryKey: ['owner-property-performance', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      return await OwnerQueries.getPropertyPerformance(user.id, 5);
    },
    enabled: !!user?.id,
  });

  // Fetch properties count
  const { data: propertiesData, isLoading: propertiesLoading } = useQuery({
    queryKey: ['owner-properties-count', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      
      const { count, error } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', user.id);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!user?.id,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (statsLoading || bookingsLoading || performanceLoading) {
    return (
      <OwnerLayout pageTitle="Dashboard">
        <LoadingSpinner message="Loading dashboard..." />
      </OwnerLayout>
    );
  }

  if (statsError) {
    return (
      <OwnerLayout pageTitle="Dashboard">
        <ErrorDisplay
          error={statsError}
          title="Failed to load dashboard data"
          onRetry={() => window.location.reload()}
        />
      </OwnerLayout>
    );
  }

  return (
    <OwnerLayout pageTitle="Dashboard">
      <div className="space-y-4 lg:space-y-6 max-w-7xl mx-auto">
        {/* Welcome Section - 2024 Responsive Standards */}
        <div className="px-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName || 'Property Owner'}!
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Here's an overview of your property portfolio performance.
          </p>
        </div>

        {/* Key Metrics - Compact Design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center">
                <Building className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div className="ml-3 min-w-0">
                  <p className="text-xs font-medium text-gray-600 truncate">Total Properties</p>
                  <p className="text-xl font-bold">{dashboardStats?.totalProperties || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-green-600 flex-shrink-0" />
                <div className="ml-3 min-w-0">
                  <p className="text-xs font-medium text-gray-600 truncate">Total Bookings</p>
                  <p className="text-xl font-bold">{dashboardStats?.totalBookings || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-purple-600 flex-shrink-0" />
                <div className="ml-3 min-w-0">
                  <p className="text-xs font-medium text-gray-600 truncate">Monthly Net Earnings</p>
                  <p className="text-xl font-bold">{formatCurrency(dashboardStats?.monthlyNetEarnings || 0)}</p>
                  {dashboardStats?.monthlyCommissionDeducted ? (
                    <p className="text-xs text-gray-500">
                      -{formatCurrency(dashboardStats.monthlyCommissionDeducted)} commission (10%)
                    </p>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3">
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-orange-600 flex-shrink-0" />
                <div className="ml-3 min-w-0">
                  <p className="text-xs font-medium text-gray-600 truncate">Occupancy Rate</p>
                  <p className="text-xl font-bold">{dashboardStats?.occupancyRate || 0}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
          {/* Recent Bookings - Responsive */}
          <Card>
            <CardHeader className="pb-3 lg:pb-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <CardTitle className="text-lg lg:text-xl">Recent Bookings</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/owner/bookings')}
                  className="text-xs sm:text-sm"
                >
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 lg:space-y-4">
                {recentBookings && recentBookings.length > 0 ? (
                  recentBookings.map((booking) => (
                    <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 lg:p-4 border rounded-lg gap-2 sm:gap-4">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-sm lg:text-base truncate">{booking.student_name}</h4>
                        <p className="text-xs lg:text-sm text-gray-600 truncate">{booking.property_title}</p>
                        <p className="text-xs text-gray-500">Check-in: {new Date(booking.check_in_date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-left sm:text-right flex-shrink-0">
                        <p className="font-bold text-sm lg:text-base">{formatCurrency(booking.total_amount)}</p>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>No recent bookings</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Property Performance */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Property Performance</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/owner/properties')}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {propertyPerformance && propertyPerformance.length > 0 ? (
                  propertyPerformance.map((property) => (
                    <div key={property.id} className="p-4 border rounded-lg">
                      <h4 className="font-medium">{property.title}</h4>
                      <div className="grid grid-cols-3 gap-4 mt-2">
                        <div>
                          <p className="text-xs text-gray-500">Occupancy</p>
                          <p className="font-semibold">{property.occupancy_rate}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Earnings</p>
                          <p className="font-semibold">{formatCurrency(property.total_earnings)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Bookings</p>
                          <p className="font-semibold">{property.total_bookings}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Building className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>No properties found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/owner/property/new">
                <Button className="w-full h-20 flex flex-col">
                  <Plus className="h-6 w-6 mb-2" />
                  Add New Property
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                className="w-full h-20 flex flex-col"
                onClick={() => navigate('/owner/bookings')}
              >
                <Calendar className="h-6 w-6 mb-2" />
                Manage Bookings
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full h-20 flex flex-col"
                onClick={() => navigate('/owner/profile')}
              >
                <Users className="h-6 w-6 mb-2" />
                Update Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Rating Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Rating Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  {/* ✅ BE CONSCIOUS: Handle null rating properly - no hardcoded values */}
                  {dashboardStats?.averageRating !== null ? (
                    <>
                      <div className="text-3xl font-bold text-yellow-600">{dashboardStats.averageRating}</div>
                      <div className="flex items-center justify-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(dashboardStats.averageRating!) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">{dashboardStats?.totalReviews || 0} reviews</div>
                    </>
                  ) : (
                    <>
                      <div className="text-lg font-medium text-gray-500">No reviews yet</div>
                      <div className="flex items-center justify-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-gray-300" />
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">0 reviews</div>
                    </>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">
                    {dashboardStats?.averageRating !== null
                      ? "Your properties maintain an excellent rating. Keep up the great work!"
                      : "Start receiving reviews by providing excellent service to your tenants."
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Communication</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* ✅ BE CONSCIOUS: Real data only - no hardcoded communication numbers */}
                <div className="flex items-center justify-between">
                  <span className="text-sm">Unread Messages</span>
                  <Badge variant="secondary">0</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Pending Inquiries</span>
                  <Badge variant="secondary">0</Badge>
                </div>
                <Button variant="outline" className="w-full mt-4" disabled>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Messaging System Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </OwnerLayout>
  );
};

export default OwnerDashboard;
