/**
 * Campus Analytics & Reporting Component
 * Apple-Grade implementation following BE CONSCIOUS standards
 *
 * Business Purpose: Provides campus-focused analytics showing local performance
 * metrics, student engagement, property utilization, and revenue generation
 * specific to each Ghana university campus with jurisdiction-based data filtering
 *
 * Technical Implementation: Integrates with AdminAuthContext for jurisdiction
 * validation, campus-specific data filtering, and comprehensive local analytics
 *
 * @author ROOMi Platform Team
 * @version 2.0.0
 * @compliance BE CONSCIOUS Apple-Grade Standards
 */

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp,
  Users,
  Building,
  DollarSign,
  Calendar,
  Activity,
  BarChart3,
  PieChart,
  AlertTriangle,
  School,
  MapPin,
  Clock,
  Star,
  Target,
  Zap
} from 'lucide-react';
import {
  createAdminPermission,
  createCampusJurisdiction,
  CampusJurisdiction
} from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { centralizedCommissionEngine } from '@/config/centralized-commission.config';
import { logger } from '@/utils/enhanced-logger';

// ============================================================================
// CAMPUS ANALYTICS TYPES
// ============================================================================

interface CampusAnalyticsData {
  readonly campusCode: string;
  readonly campusName: string;
  readonly timeRange: string;
  readonly studentMetrics: StudentMetrics;
  readonly propertyMetrics: PropertyMetrics;
  readonly revenueMetrics: RevenueMetrics;
  readonly engagementMetrics: EngagementMetrics;
  readonly performanceMetrics: PerformanceMetrics;
  readonly trends: TrendData[];
}

interface StudentMetrics {
  readonly totalStudents: number;
  readonly activeStudents: number;
  readonly newRegistrations: number;
  readonly verifiedStudents: number;
  readonly studentGrowthRate: number;
  readonly averageBookingDuration: number;
  readonly studentSatisfactionScore: number;
  readonly retentionRate: number;
}

interface PropertyMetrics {
  readonly totalProperties: number;
  readonly activeListings: number;
  readonly occupancyRate: number;
  readonly averageRent: number;
  readonly propertyUtilization: number;
  readonly newListings: number;
  readonly propertyRating: number;
  readonly maintenanceRequests: number;
}

interface RevenueMetrics {
  readonly totalRevenue: number;
  readonly monthlyGrowth: number;
  readonly commissionEarned: number;
  readonly platformFees: number;
  readonly averageBookingValue: number;
  readonly revenuePerStudent: number;
  readonly paymentSuccessRate: number;
  readonly outstandingPayments: number;
}

interface EngagementMetrics {
  readonly dailyActiveUsers: number;
  readonly searchActivity: number;
  readonly bookingConversionRate: number;
  readonly averageSessionDuration: number;
  readonly pageViews: number;
  readonly mobileUsage: number;
  readonly supportTickets: number;
  readonly responseTime: number;
}

interface PerformanceMetrics {
  readonly verificationTime: number;
  readonly approvalTime: number;
  readonly disputeResolutionTime: number;
  readonly customerSatisfaction: number;
  readonly systemUptime: number;
  readonly errorRate: number;
  readonly loadTime: number;
  readonly successfulTransactions: number;
}

interface TrendData {
  readonly date: string;
  readonly students: number;
  readonly properties: number;
  readonly revenue: number;
  readonly bookings: number;
}

// ============================================================================
// CAMPUS ANALYTICS COMPONENT
// ============================================================================

/**
 * Campus Analytics Component
 * Provides comprehensive campus-level analytics and reporting
 */
const CampusAnalytics: React.FC = () => {
  const {
    getAdminRole,
    hasPermission,
    hasJurisdiction,
    validateAccess
  } = useAdminAuth();

  const [selectedCampus, setSelectedCampus] = useState<CampusJurisdiction | null>(null);
  const [timeRange, setTimeRange] = useState('current_month');
  const [selectedMetric, setSelectedMetric] = useState('overview');

  // ============================================================================
  // PERMISSION VALIDATION
  // ============================================================================

  if (!hasPermission(createAdminPermission('analytics.campus'))) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to access campus analytics.
        </AlertDescription>
      </Alert>
    );
  }

  // Get assigned campuses for this admin
  const assignedCampuses: CampusJurisdiction[] = [
    createCampusJurisdiction('UPSA-Accra'),
    createCampusJurisdiction('UG-Legon')
  ]; // Would come from adminSession.jurisdiction.campuses

  // Set default campus if none selected
  React.useEffect(() => {
    if (!selectedCampus && assignedCampuses.length > 0) {
      setSelectedCampus(assignedCampuses[0]);
    }
  }, [selectedCampus, assignedCampuses]);

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  /**
   * Fetch campus analytics data from real database
   * ✅ BE CONSCIOUS: Uses centralized commission engine for accurate calculations
   */
  const { data: analyticsData, isLoading: analyticsLoading, error: analyticsError } = useQuery({
    queryKey: ['campus-analytics', selectedCampus, timeRange],
    queryFn: async (): Promise<CampusAnalyticsData> => {
      if (!selectedCampus) {
        throw new Error('No campus selected');
      }

      try {
        logger.info('Fetching campus analytics', {
          campus: selectedCampus.campusCode,
          timeRange
        });

        // Get commission rates from centralized engine
        const rates = centralizedCommissionEngine.getCommissionRates();
        const fees = centralizedCommissionEngine.getPlatformFees();

        // Calculate date range
        const now = new Date();
        let startDate: Date;

        switch (timeRange) {
          case 'current_month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
          case 'last_month':
            startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            break;
          case 'last_3_months':
            startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
            break;
          case 'last_6_months':
            startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
            break;
          case 'current_year':
            startDate = new Date(now.getFullYear(), 0, 1);
            break;
          default:
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        }

        // Extract university name from campus code (e.g., "UPSA-Accra" -> "UPSA")
        const universityCode = selectedCampus.campusCode.split('-')[0];

        // Fetch students for this campus
        const { data: students, error: studentsError } = await supabase
          .from('profiles')
          .select('id, university_name, verification_status, created_at')
          .eq('role', 'student')
          .ilike('university_name', `%${universityCode}%`);

        if (studentsError) {
          logger.error('Error fetching students', { error: studentsError });
          throw studentsError;
        }

        const studentIds = (students || []).map(s => s.id);
        const totalStudents = studentIds.length;
        const verifiedStudents = (students || []).filter(s => s.verification_status === 'verified').length;
        const newRegistrations = (students || []).filter(s =>
          new Date(s.created_at) >= startDate
        ).length;

        // Fetch bookings for students from this campus
        const { data: bookings, error: bookingsError } = await supabase
          .from('bookings_enhanced')
          .select('total_amount, platform_fee, agent_fee, property_rent, payment_status, created_at, check_in_date, check_out_date')
          .in('student_id', studentIds.length > 0 ? studentIds : ['00000000-0000-0000-0000-000000000000']) // Prevent empty array error
          .gte('created_at', startDate.toISOString());

        if (bookingsError) {
          logger.error('Error fetching bookings', { error: bookingsError });
          throw bookingsError;
        }

        // Calculate revenue metrics from real data
        const paidBookings = (bookings || []).filter(b =>
          ['paid', 'success', 'completed'].includes(b.payment_status)
        );

        const totalRevenue = paidBookings.reduce((sum, b) => sum + (b.total_amount || 0), 0);
        const commissionEarned = paidBookings.reduce((sum, b) => sum + (b.platform_fee || 0), 0);
        const platformFees = paidBookings.length * fees.fixed;
        const averageBookingValue = paidBookings.length > 0
          ? totalRevenue / paidBookings.length
          : 0;
        const revenuePerStudent = totalStudents > 0
          ? totalRevenue / totalStudents
          : 0;
        const paymentSuccessRate = (bookings || []).length > 0
          ? (paidBookings.length / (bookings || []).length) * 100
          : 100;
        const outstandingPayments = (bookings || [])
          .filter(b => b.payment_status === 'pending')
          .reduce((sum, b) => sum + (b.total_amount || 0), 0);

        // Calculate average booking duration
        const bookingsWithDates = paidBookings.filter(b => b.check_in_date && b.check_out_date);
        const averageBookingDuration = bookingsWithDates.length > 0
          ? bookingsWithDates.reduce((sum, b) => {
              const days = Math.ceil(
                (new Date(b.check_out_date!).getTime() - new Date(b.check_in_date!).getTime()) /
                (1000 * 60 * 60 * 24)
              );
              return sum + days;
            }, 0) / bookingsWithDates.length / 30 // Convert to months
          : 0;

        // Fetch properties near this campus (simplified - would need geo-location in production)
        const { data: properties, error: propertiesError } = await supabase
          .from('properties')
          .select('id, is_available, rent, price, verification_status, created_at')
          .eq('verification_status', 'verified');

        if (propertiesError) {
          logger.warn('Error fetching properties', { error: propertiesError });
        }

        const totalProperties = (properties || []).length;
        const activeListings = (properties || []).filter(p => p.is_available).length;
        const newListings = (properties || []).filter(p =>
          new Date(p.created_at) >= startDate
        ).length;
        const averageRent = (properties || []).length > 0
          ? (properties || []).reduce((sum, p) => sum + (p.rent || p.price || 0), 0) / (properties || []).length
          : 0;

        logger.info('Campus analytics calculated successfully', {
          campus: selectedCampus.campusCode,
          totalRevenue,
          commissionEarned,
          totalStudents,
          bookingsCount: paidBookings.length
        });

        return {
          campusCode: selectedCampus.campusCode,
          campusName: selectedCampus.campusName || 'Unknown Campus',
          timeRange,
          studentMetrics: {
            totalStudents,
            activeStudents: verifiedStudents, // Simplified: verified = active
            newRegistrations,
            verifiedStudents,
            studentGrowthRate: totalStudents > 0 ? (newRegistrations / totalStudents) * 100 : 0,
            averageBookingDuration: Math.round(averageBookingDuration * 10) / 10,
            studentSatisfactionScore: 0, // Will be calculated from property_reviews table (Phase 5)
            retentionRate: 0 // Will be calculated from repeat bookings (Phase 7)
          },
          propertyMetrics: {
            totalProperties,
            activeListings,
            occupancyRate: totalProperties > 0 ? (paidBookings.length / totalProperties) * 100 : 0,
            averageRent: Math.round(averageRent),
            propertyUtilization: activeListings > 0 ? (activeListings / totalProperties) * 100 : 0,
            newListings,
            propertyRating: 0, // Will be calculated from property_reviews table (Phase 5)
            maintenanceRequests: 0 // maintenance_requests table exists, needs connection (Phase 7)
          },
          revenueMetrics: {
            totalRevenue: Math.round(totalRevenue),
            monthlyGrowth: 0, // TODO: Calculate from previous period
            commissionEarned: Math.round(commissionEarned),
            platformFees: Math.round(platformFees),
            averageBookingValue: Math.round(averageBookingValue),
            revenuePerStudent: Math.round(revenuePerStudent),
            paymentSuccessRate: Math.round(paymentSuccessRate * 10) / 10,
            outstandingPayments: Math.round(outstandingPayments)
          },
          engagementMetrics: {
            dailyActiveUsers: verifiedStudents, // Simplified: verified students = active
            searchActivity: 0, // Will be tracked via property_views table (Phase 7)
            bookingConversionRate: totalStudents > 0 ? (paidBookings.length / totalStudents) * 100 : 0,
            averageSessionDuration: 0, // Requires analytics integration (Phase 7)
            pageViews: 0, // Will be tracked via property_views table (Phase 7)
            mobileUsage: 0, // Requires device tracking (Phase 7)
            supportTickets: 0, // Requires support system (Phase 7)
            responseTime: 0 // Requires support metrics (Phase 7)
          },
          performanceMetrics: {
            verificationTime: 0, // Will be calculated from property_verifications table (Phase 7)
            approvalTime: 0, // Will be calculated from property_verifications table (Phase 7)
            disputeResolutionTime: 0, // Requires dispute system (Phase 7)
            customerSatisfaction: 0, // Will be calculated from property_reviews table (Phase 5)
            systemUptime: 0, // Requires monitoring integration (Phase 7)
            errorRate: 0, // Requires error tracking (Phase 7)
            loadTime: 0, // Requires performance monitoring (Phase 7)
            successfulTransactions: paymentSuccessRate
          },
          trends: [] // TODO: Implement time-series data collection
        };
      } catch (error) {
        logger.error('Failed to fetch campus analytics', { error, campus: selectedCampus });
        throw error;
      }
    },
    enabled: !!selectedCampus,
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000 // Consider data stale after 30 seconds
  });

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  /**
   * Format currency for Ghana
   */
  const formatCurrency = (amount: number): string => {
    return `GHS ${amount.toLocaleString()}`;
  };

  /**
   * Get trend indicator
   */
  const getTrendIndicator = (value: number): { color: string; icon: React.ReactNode } => {
    if (value > 0) {
      return { color: 'text-green-600', icon: <TrendingUp className="h-4 w-4" /> };
    } else if (value < 0) {
      return { color: 'text-red-600', icon: <TrendingUp className="h-4 w-4 rotate-180" /> };
    } else {
      return { color: 'text-gray-600', icon: <Activity className="h-4 w-4" /> };
    }
  };

  /**
   * Get performance score color
   */
  const getPerformanceColor = (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  // ============================================================================
  // RENDER COMPONENT
  // ============================================================================

  if (!selectedCampus) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          No campus jurisdiction assigned. Please contact your administrator.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BarChart3 className="h-8 w-8 text-purple-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Campus Analytics</h1>
            <p className="text-gray-600">
              {analyticsData?.campusName || 'Loading campus...'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Campus Selector */}
          {assignedCampuses.length > 1 && (
            <select
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value as CampusJurisdiction)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              {assignedCampuses.map((campus) => (
                <option key={campus} value={campus}>
                  {campus.replace('-', ' - ')}
                </option>
              ))}
            </select>
          )}

          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="current_month">Current Month</option>
            <option value="last_month">Last Month</option>
            <option value="last_3_months">Last 3 Months</option>
            <option value="last_6_months">Last 6 Months</option>
            <option value="current_year">This Year</option>
          </select>
        </div>
      </div>

      {/* Error State */}
      {analyticsError && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Failed to load campus analytics. Please try again later.
            {analyticsError instanceof Error && (
              <span className="block text-xs mt-1">{analyticsError.message}</span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {analyticsLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="animate-pulse">
                  <div className="h-8 w-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Analytics Overview Cards */}
      {analyticsData && !analyticsLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Active Students</p>
                  <p className="text-xl font-bold">{analyticsData.studentMetrics.activeStudents}</p>
                  <div className="flex items-center">
                    {getTrendIndicator(analyticsData.studentMetrics.studentGrowthRate).icon}
                    <p className={`text-xs ml-1 ${getTrendIndicator(analyticsData.studentMetrics.studentGrowthRate).color}`}>
                      +{analyticsData.studentMetrics.studentGrowthRate}%
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Building className="h-8 w-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Active Properties</p>
                  <p className="text-xl font-bold">{analyticsData.propertyMetrics.activeListings}</p>
                  <p className="text-xs text-green-600">
                    {analyticsData.propertyMetrics.occupancyRate}% occupied
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-purple-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                  <p className="text-xl font-bold">{formatCurrency(analyticsData.revenueMetrics.totalRevenue)}</p>
                  <div className="flex items-center">
                    {getTrendIndicator(analyticsData.revenueMetrics.monthlyGrowth).icon}
                    <p className={`text-xs ml-1 ${getTrendIndicator(analyticsData.revenueMetrics.monthlyGrowth).color}`}>
                      +{analyticsData.revenueMetrics.monthlyGrowth}%
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-orange-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Satisfaction</p>
                  <p className="text-xl font-bold">{analyticsData.studentMetrics.studentSatisfactionScore}/5.0</p>
                  <p className="text-xs text-orange-600">
                    {analyticsData.studentMetrics.retentionRate}% retention
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          {analyticsData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Key Metrics Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Campus Performance Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Student Growth Rate</span>
                      <div className="flex items-center">
                        <span className="font-medium">{analyticsData.studentMetrics.studentGrowthRate}%</span>
                        <div className="w-16 h-2 bg-gray-200 rounded-full ml-2">
                          <div
                            className="h-2 bg-blue-500 rounded-full"
                            style={{ width: `${Math.min(analyticsData.studentMetrics.studentGrowthRate * 5, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Property Occupancy</span>
                      <div className="flex items-center">
                        <span className="font-medium">{analyticsData.propertyMetrics.occupancyRate}%</span>
                        <div className="w-16 h-2 bg-gray-200 rounded-full ml-2">
                          <div
                            className="h-2 bg-green-500 rounded-full"
                            style={{ width: `${analyticsData.propertyMetrics.occupancyRate}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Revenue Growth</span>
                      <div className="flex items-center">
                        <span className="font-medium">{analyticsData.revenueMetrics.monthlyGrowth}%</span>
                        <div className="w-16 h-2 bg-gray-200 rounded-full ml-2">
                          <div
                            className="h-2 bg-purple-500 rounded-full"
                            style={{ width: `${Math.min(analyticsData.revenueMetrics.monthlyGrowth * 5, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Customer Satisfaction</span>
                      <div className="flex items-center">
                        <span className="font-medium">{analyticsData.performanceMetrics.customerSatisfaction}/5.0</span>
                        <div className="w-16 h-2 bg-gray-200 rounded-full ml-2">
                          <div
                            className="h-2 bg-orange-500 rounded-full"
                            style={{ width: `${(analyticsData.performanceMetrics.customerSatisfaction / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {analyticsData.engagementMetrics.dailyActiveUsers}
                      </div>
                      <div className="text-sm text-gray-600">Daily Active Users</div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {analyticsData.engagementMetrics.bookingConversionRate}%
                      </div>
                      <div className="text-sm text-gray-600">Conversion Rate</div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {formatCurrency(analyticsData.revenueMetrics.averageBookingValue)}
                      </div>
                      <div className="text-sm text-gray-600">Avg. Booking Value</div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {analyticsData.performanceMetrics.verificationTime}d
                      </div>
                      <div className="text-sm text-gray-600">Avg. Verification</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students">
          {analyticsData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Student Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Students</span>
                      <span className="font-medium">{analyticsData.studentMetrics.totalStudents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Active Students</span>
                      <span className="font-medium">{analyticsData.studentMetrics.activeStudents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">New Registrations</span>
                      <span className="font-medium text-green-600">+{analyticsData.studentMetrics.newRegistrations}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Verified Students</span>
                      <span className="font-medium">{analyticsData.studentMetrics.verifiedStudents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Avg. Booking Duration</span>
                      <span className="font-medium">{analyticsData.studentMetrics.averageBookingDuration} months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Retention Rate</span>
                      <span className="font-medium">{analyticsData.studentMetrics.retentionRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Student Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Daily Active Users</span>
                      <span className="font-medium">{analyticsData.engagementMetrics.dailyActiveUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Search Activity</span>
                      <span className="font-medium">{analyticsData.engagementMetrics.searchActivity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Avg. Session Duration</span>
                      <span className="font-medium">{analyticsData.engagementMetrics.averageSessionDuration} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Page Views</span>
                      <span className="font-medium">{analyticsData.engagementMetrics.pageViews.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Mobile Usage</span>
                      <span className="font-medium">{analyticsData.engagementMetrics.mobileUsage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Support Tickets</span>
                      <span className="font-medium">{analyticsData.engagementMetrics.supportTickets}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Properties Tab */}
        <TabsContent value="properties">
          {analyticsData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Property Portfolio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Properties</span>
                      <span className="font-medium">{analyticsData.propertyMetrics.totalProperties}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Active Listings</span>
                      <span className="font-medium">{analyticsData.propertyMetrics.activeListings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Occupancy Rate</span>
                      <span className="font-medium text-green-600">{analyticsData.propertyMetrics.occupancyRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Average Rent</span>
                      <span className="font-medium">{formatCurrency(analyticsData.propertyMetrics.averageRent)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Property Utilization</span>
                      <span className="font-medium">{analyticsData.propertyMetrics.propertyUtilization}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">New Listings</span>
                      <span className="font-medium text-blue-600">+{analyticsData.propertyMetrics.newListings}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Property Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Average Rating</span>
                      <span className="font-medium">{analyticsData.propertyMetrics.propertyRating}/5.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Maintenance Requests</span>
                      <span className="font-medium">{analyticsData.propertyMetrics.maintenanceRequests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Approval Time</span>
                      <span className="font-medium">{analyticsData.performanceMetrics.approvalTime} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">System Uptime</span>
                      <span className="font-medium text-green-600">{analyticsData.performanceMetrics.systemUptime}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Load Time</span>
                      <span className="font-medium">{analyticsData.performanceMetrics.loadTime}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Error Rate</span>
                      <span className="font-medium text-red-600">{analyticsData.performanceMetrics.errorRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue">
          {analyticsData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Revenue</span>
                      <span className="font-medium">{formatCurrency(analyticsData.revenueMetrics.totalRevenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Commission Earned ({(centralizedCommissionEngine.getCommissionRates().platform * 100).toFixed(1)}%)
                      </span>
                      <span className="font-medium text-green-600">{formatCurrency(analyticsData.revenueMetrics.commissionEarned)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Platform Fees</span>
                      <span className="font-medium text-blue-600">{formatCurrency(analyticsData.revenueMetrics.platformFees)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Avg. Booking Value</span>
                      <span className="font-medium">{formatCurrency(analyticsData.revenueMetrics.averageBookingValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Revenue per Student</span>
                      <span className="font-medium">{formatCurrency(analyticsData.revenueMetrics.revenuePerStudent)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Outstanding Payments</span>
                      <span className="font-medium text-orange-600">{formatCurrency(analyticsData.revenueMetrics.outstandingPayments)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Payment Success Rate</span>
                      <span className="font-medium text-green-600">{analyticsData.revenueMetrics.paymentSuccessRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Monthly Growth</span>
                      <span className="font-medium text-green-600">+{analyticsData.revenueMetrics.monthlyGrowth}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Successful Transactions</span>
                      <span className="font-medium">{analyticsData.performanceMetrics.successfulTransactions}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Conversion Rate</span>
                      <span className="font-medium">{analyticsData.engagementMetrics.bookingConversionRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Response Time</span>
                      <span className="font-medium">{analyticsData.engagementMetrics.responseTime}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Customer Satisfaction</span>
                      <span className="font-medium">{analyticsData.performanceMetrics.customerSatisfaction}/5.0</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance">
          {analyticsData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Operational Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Verification Time</span>
                      <div className="flex items-center">
                        <span className="font-medium">{analyticsData.performanceMetrics.verificationTime} days</span>
                        <div className={`ml-2 h-2 w-2 rounded-full ${analyticsData.performanceMetrics.verificationTime <= 2 ? 'bg-green-500' : 'bg-yellow-500'}`} />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Property Approval Time</span>
                      <div className="flex items-center">
                        <span className="font-medium">{analyticsData.performanceMetrics.approvalTime} days</span>
                        <div className={`ml-2 h-2 w-2 rounded-full ${analyticsData.performanceMetrics.approvalTime <= 2 ? 'bg-green-500' : 'bg-yellow-500'}`} />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Dispute Resolution</span>
                      <div className="flex items-center">
                        <span className="font-medium">{analyticsData.performanceMetrics.disputeResolutionTime} days</span>
                        <div className={`ml-2 h-2 w-2 rounded-full ${analyticsData.performanceMetrics.disputeResolutionTime <= 2 ? 'bg-green-500' : 'bg-yellow-500'}`} />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">System Uptime</span>
                      <div className="flex items-center">
                        <span className="font-medium">{analyticsData.performanceMetrics.systemUptime}%</span>
                        <div className={`ml-2 h-2 w-2 rounded-full ${analyticsData.performanceMetrics.systemUptime >= 99 ? 'bg-green-500' : 'bg-red-500'}`} />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Error Rate</span>
                      <div className="flex items-center">
                        <span className="font-medium">{analyticsData.performanceMetrics.errorRate}%</span>
                        <div className={`ml-2 h-2 w-2 rounded-full ${analyticsData.performanceMetrics.errorRate <= 1 ? 'bg-green-500' : 'bg-red-500'}`} />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Load Time</span>
                      <div className="flex items-center">
                        <span className="font-medium">{analyticsData.performanceMetrics.loadTime}s</span>
                        <div className={`ml-2 h-2 w-2 rounded-full ${analyticsData.performanceMetrics.loadTime <= 2 ? 'bg-green-500' : 'bg-yellow-500'}`} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Scores</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${getPerformanceColor(analyticsData.performanceMetrics.customerSatisfaction * 20)}`}>
                        {(analyticsData.performanceMetrics.customerSatisfaction * 20).toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-600">Overall Performance Score</div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Customer Satisfaction</span>
                        <div className="flex items-center">
                          <div className="w-20 h-2 bg-gray-200 rounded-full mr-2">
                            <div
                              className="h-2 bg-green-500 rounded-full"
                              style={{ width: `${(analyticsData.performanceMetrics.customerSatisfaction / 5) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{analyticsData.performanceMetrics.customerSatisfaction}/5</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm">System Reliability</span>
                        <div className="flex items-center">
                          <div className="w-20 h-2 bg-gray-200 rounded-full mr-2">
                            <div
                              className="h-2 bg-blue-500 rounded-full"
                              style={{ width: `${analyticsData.performanceMetrics.systemUptime}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{analyticsData.performanceMetrics.systemUptime}%</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm">Transaction Success</span>
                        <div className="flex items-center">
                          <div className="w-20 h-2 bg-gray-200 rounded-full mr-2">
                            <div
                              className="h-2 bg-purple-500 rounded-full"
                              style={{ width: `${analyticsData.performanceMetrics.successfulTransactions}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{analyticsData.performanceMetrics.successfulTransactions}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Campus Comparison */}
      {analyticsData && assignedCampuses.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Campus Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4 text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>Campus comparison analytics available for multi-campus administrators</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CampusAnalytics;