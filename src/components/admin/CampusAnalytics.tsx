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
   * Fetch campus analytics data
   */
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ['campus-analytics', selectedCampus, timeRange],
    queryFn: async (): Promise<CampusAnalyticsData> => {
      // Mock data - would integrate with actual analytics API
      const campusData: Record<string, CampusAnalyticsData> = {
        'UPSA-Accra': {
          campusCode: 'UPSA',
          campusName: 'University of Professional Studies, Accra',
          timeRange,
          studentMetrics: {
            totalStudents: 456,
            activeStudents: 423,
            newRegistrations: 28,
            verifiedStudents: 423,
            studentGrowthRate: 15.2,
            averageBookingDuration: 4.2,
            studentSatisfactionScore: 4.6,
            retentionRate: 89.3
          },
          propertyMetrics: {
            totalProperties: 23,
            activeListings: 20,
            occupancyRate: 87.5,
            averageRent: 1150,
            propertyUtilization: 92.1,
            newListings: 3,
            propertyRating: 4.4,
            maintenanceRequests: 5
          },
          revenueMetrics: {
            totalRevenue: 45600,
            monthlyGrowth: 12.8,
            commissionEarned: 2280,
            platformFees: 1200,
            averageBookingValue: 4600,
            revenuePerStudent: 108,
            paymentSuccessRate: 98.2,
            outstandingPayments: 2400
          },
          engagementMetrics: {
            dailyActiveUsers: 156,
            searchActivity: 1240,
            bookingConversionRate: 23.4,
            averageSessionDuration: 8.5,
            pageViews: 5670,
            mobileUsage: 78.9,
            supportTickets: 12,
            responseTime: 2.3
          },
          performanceMetrics: {
            verificationTime: 1.8,
            approvalTime: 2.1,
            disputeResolutionTime: 1.5,
            customerSatisfaction: 4.6,
            systemUptime: 99.2,
            errorRate: 0.8,
            loadTime: 1.2,
            successfulTransactions: 98.7
          },
          trends: [
            { date: '2024-01-01', students: 420, properties: 20, revenue: 42000, bookings: 95 },
            { date: '2024-01-02', students: 425, properties: 21, revenue: 43500, bookings: 98 },
            { date: '2024-01-03', students: 430, properties: 22, revenue: 44200, bookings: 102 },
            { date: '2024-01-04', students: 435, properties: 22, revenue: 45100, bookings: 105 },
            { date: '2024-01-05', students: 440, properties: 23, revenue: 45600, bookings: 108 }
          ]
        },
        'UG-Legon': {
          campusCode: 'UG',
          campusName: 'University of Ghana, Legon',
          timeRange,
          studentMetrics: {
            totalStudents: 678,
            activeStudents: 634,
            newRegistrations: 42,
            verifiedStudents: 634,
            studentGrowthRate: 18.7,
            averageBookingDuration: 4.1,
            studentSatisfactionScore: 4.7,
            retentionRate: 91.2
          },
          propertyMetrics: {
            totalProperties: 34,
            activeListings: 31,
            occupancyRate: 92.3,
            averageRent: 1280,
            propertyUtilization: 94.8,
            newListings: 4,
            propertyRating: 4.5,
            maintenanceRequests: 7
          },
          revenueMetrics: {
            totalRevenue: 67800,
            monthlyGrowth: 16.4,
            commissionEarned: 3390,
            platformFees: 1800,
            averageBookingValue: 5120,
            revenuePerStudent: 107,
            paymentSuccessRate: 98.9,
            outstandingPayments: 3200
          },
          engagementMetrics: {
            dailyActiveUsers: 234,
            searchActivity: 1890,
            bookingConversionRate: 26.1,
            averageSessionDuration: 9.2,
            pageViews: 8450,
            mobileUsage: 82.1,
            supportTickets: 8,
            responseTime: 1.9
          },
          performanceMetrics: {
            verificationTime: 1.6,
            approvalTime: 1.9,
            disputeResolutionTime: 1.3,
            customerSatisfaction: 4.7,
            systemUptime: 99.5,
            errorRate: 0.5,
            loadTime: 1.1,
            successfulTransactions: 99.1
          },
          trends: [
            { date: '2024-01-01', students: 620, properties: 30, revenue: 62000, bookings: 142 },
            { date: '2024-01-02', students: 630, properties: 31, revenue: 64500, bookings: 148 },
            { date: '2024-01-03', students: 640, properties: 32, revenue: 65800, bookings: 152 },
            { date: '2024-01-04', students: 650, properties: 33, revenue: 66900, bookings: 156 },
            { date: '2024-01-05', students: 660, properties: 34, revenue: 67800, bookings: 160 }
          ]
        }
      };

      return campusData[selectedCampus || 'UPSA-Accra'] || campusData['UPSA-Accra'];
    },
    enabled: !!selectedCampus
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
            <option value="current_week">This Week</option>
            <option value="current_month">This Month</option>
            <option value="last_month">Last Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>

          <Badge className="bg-purple-100 text-purple-800 flex items-center gap-2">
            <School className="h-4 w-4" />
            Campus Analytics
          </Badge>
        </div>
      </div>

      {/* Analytics Overview Cards */}
      {analyticsData && (
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
                      <span className="text-sm text-gray-600">Commission Earned (5%)</span>
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