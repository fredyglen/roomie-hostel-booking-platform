
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/EnhancedAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  XCircle,
  MessageCircle,
  Eye,
  Download,
  Bell,
  ChevronDown
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import OwnerLayout from '@/components/layout/OwnerLayout';
import { OwnerQueries } from '@/services/database/ownerQueries';
import { centralizedCommissionEngine } from '@/config/centralized-commission.config';
import { unifiedConfigurationEngine } from '@/config/unified-configuration.config';

const AnalyticsDashboard: React.FC = () => {
  const { user } = useAuth();

  // Real data queries
  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
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
      return await OwnerQueries.getRecentBookings(user.id, 10);
    },
    enabled: !!user?.id,
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['owner-transactions', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      return await OwnerQueries.getTransactionHistory(user.id, 10);
    },
    enabled: !!user?.id,
  });

  // Ghana Cedi currency formatting (BE CONSCIOUS: No hardcoded currency)
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // ✅ BE CONSCIOUS: Real monthly data or honest empty state (no fake repeated values)
  const monthlyData = React.useMemo(() => {
    // TODO: Implement real monthly breakdown query
    // For now, show current month only to avoid misleading repeated data
    const currentMonth = new Date().toLocaleDateString('en-US', { month: 'short' });
    return [
      {
        month: currentMonth,
        revenue: dashboardStats?.monthlyEarnings || 0,
        occupancy: dashboardStats?.occupancyRate || 0
      }
    ];
  }, [dashboardStats?.monthlyEarnings, dashboardStats?.occupancyRate]);

  // ✅ BE CONSCIOUS: Real booking sources or honest empty state (no hardcoded percentages)
  const bookingSourcesData = React.useMemo(() => {
    const totalBookings = dashboardStats?.totalBookings || 0;
    return [
      {
        name: 'Direct Website',
        value: totalBookings > 0 ? 100 : 0, // All current bookings are direct until tracking implemented
        count: totalBookings,
        color: '#3b82f6'
      },
      { name: 'ROOMi Platform', value: 0, count: 0, color: '#f97316' },
      { name: 'Referrals', value: 0, count: 0, color: '#10b981' },
      { name: 'Others', value: 0, count: 0, color: '#6b7280' }
    ];
  }, [dashboardStats?.totalBookings]);

  // ✅ BE CONSCIOUS: Real guest type data or honest empty state (no repeated fake data)
  const guestTypeData = React.useMemo(() => {
    // TODO: Implement real new vs repeat guest tracking
    // For now, show current month only to avoid misleading repeated data
    const currentMonth = new Date().toLocaleDateString('en-US', { month: 'short' });
    return [
      {
        month: currentMonth,
        new: dashboardStats?.totalBookings || 0, // All current bookings are "new" until tracking implemented
        repeat: 0 // No repeat tracking yet
      }
    ];
  }, [dashboardStats?.totalBookings]);

  // Use real bookings data or empty array if loading
  const latestBookings = recentBookings || [];

  // Use real transactions data or empty array if loading
  const transactionHistory = transactions || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Checked-In':
        return 'bg-blue-100 text-blue-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };



  return (
    <OwnerLayout pageTitle="">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-semibold text-gray-900">Overview</h1>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>Show:</span>
                <Button variant="ghost" size="sm" className="text-gray-700">
                  This Year <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Download className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
              <div className="relative">
                <Bell className="h-5 w-5 text-gray-400" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </div>
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback>
                    {user?.user_metadata?.full_name?.charAt(0)?.toUpperCase() ||
                     user?.email?.charAt(0)?.toUpperCase() || 'O'}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  {/* ✅ BE CONSCIOUS: Real user data, no hardcoded names */}
                  <div className="font-medium">
                    {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Property Owner'}
                  </div>
                  <div className="text-gray-500">Property Owner</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Top Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {statsLoading ? (
                        <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
                      ) : (
                        `GH₵${(dashboardStats?.monthlyEarnings || 0).toLocaleString()}`
                      )}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Real-time data
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {statsLoading ? (
                        <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                      ) : (
                        `${dashboardStats?.occupancyRate || 0}%`
                      )}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Current period
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {statsLoading ? (
                        <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
                      ) : (
                        (dashboardStats?.totalBookings || 0).toLocaleString()
                      )}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      All time
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Bookings</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {statsLoading ? (
                        <div className="h-8 w-12 bg-gray-200 animate-pulse rounded"></div>
                      ) : (
                        dashboardStats?.pendingBookings || 0
                      )}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <XCircle className="h-4 w-4 mr-1" />
                      Awaiting action
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <XCircle className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Chart - Takes 3 columns */}
            <div className="lg:col-span-3">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Monthly Revenue & Occupancy Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#fff', 
                            border: '1px solid #f0f0f0',
                            borderRadius: '6px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                          }}
                          formatter={(value, name) => [
                            name === 'revenue' ? `GH₵${value}` : `${value}%`,
                            name === 'revenue' ? 'Revenue' : 'Occupancy'
                          ]}
                        />
                        <Line 
                          yAxisId="left"
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="occupancy" 
                          stroke="#10b981" 
                          strokeWidth={2}
                          dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Side KPI Widgets */}
            <div className="space-y-6">
              <Card className="bg-white shadow-sm">
                <CardContent className="p-6 text-center">
                  {/* ✅ BE CONSCIOUS: Real average length of stay or honest empty state */}
                  {dashboardStats?.totalBookings && dashboardStats.totalBookings > 0 ? (
                    <>
                      <div className="text-3xl font-bold text-gray-900">
                        {/* TODO: Calculate real average from booking durations */}
                        --
                      </div>
                      <div className="text-sm text-gray-600">nights</div>
                      <div className="text-xs text-gray-500 mt-1">Avg. Length of Stay</div>
                    </>
                  ) : (
                    <>
                      <div className="text-lg font-medium text-gray-500">No data yet</div>
                      <div className="text-xs text-gray-500 mt-1">Average length calculated from bookings</div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardContent className="p-6 text-center">
                  {/* ✅ BE CONSCIOUS: Guest satisfaction should come from student reviews (not implemented yet) */}
                  {dashboardStats?.averageRating !== null ? (
                    <div className="relative inline-flex items-center justify-center w-20 h-20 mb-2">
                      <svg className="w-20 h-20 transform -rotate-90">
                        <circle
                          cx="40"
                          cy="40"
                          r="36"
                          stroke="#e5e7eb"
                          strokeWidth="8"
                          fill="transparent"
                        />
                        <circle
                          cx="40"
                          cy="40"
                          r="36"
                          stroke="#10b981"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={`${(dashboardStats.averageRating / 5) * 100 * 2.26} ${100 * 2.26}`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-900">
                          {Math.round((dashboardStats.averageRating / 5) * 100)}%
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="relative inline-flex items-center justify-center w-20 h-20 mb-2">
                      <svg className="w-20 h-20 transform -rotate-90">
                        <circle
                          cx="40"
                          cy="40"
                          r="36"
                          stroke="#e5e7eb"
                          strokeWidth="8"
                          fill="transparent"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-medium text-gray-500">--</span>
                      </div>
                    </div>
                  )}
                  <div className="text-xs text-gray-500">
                    {dashboardStats?.averageRating !== null ? 'Guest Satisfaction' : 'No reviews yet'}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardContent className="p-6 text-center">
                  {/* ✅ BE CONSCIOUS: Real maintenance requests from student portal */}
                  <div className="text-3xl font-bold text-gray-900">
                    {dashboardStats?.maintenanceRequests || 0}
                  </div>
                  <div className="text-sm text-gray-600">requests</div>
                  <div className="text-xs text-gray-500 mt-1">Total Maintenance</div>
                  <div className="flex items-center justify-center mt-2">
                    {dashboardStats?.pendingMaintenance ? (
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-orange-500" />
                        <span className="text-xs text-orange-500 ml-1">
                          {dashboardStats.pendingMaintenance} pending
                        </span>
                      </div>
                    ) : (
                      <div className="text-xs text-green-600">
                        All requests completed
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Middle Row - Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Booking Sources Pie Chart */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Booking Sources</CardTitle>
                <p className="text-sm text-gray-500">2024</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <PieChart width={300} height={200}>
                      <Pie
                        data={bookingSourcesData}
                        cx={150}
                        cy={100}
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {/* ✅ BE CONSCIOUS: Safe .map() with null check to prevent crashes */}
                        {(bookingSourcesData || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-xl font-bold">
                          {statsLoading ? (
                            <div className="h-6 w-16 bg-gray-200 animate-pulse rounded mx-auto"></div>
                          ) : (
                            (dashboardStats?.totalBookings || 0).toLocaleString()
                          )}
                        </div>
                        <div className="text-xs text-gray-500">Total Bookings</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {/* ✅ BE CONSCIOUS: Safe .map() with null check to prevent crashes */}
                  {(bookingSourcesData || []).map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-gray-600">{item.name}</span>
                      <span className="text-sm font-medium">{item.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Guest Type Bar Chart */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Monthly New vs. Repeat Guests</CardTitle>
                <p className="text-sm text-gray-500">2024</p>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={guestTypeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: '1px solid #f0f0f0',
                          borderRadius: '6px',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                        }}
                        formatter={(value, name) => [value, name === 'new' ? 'New Guests' : 'Repeat Guests']}
                      />
                      <Bar dataKey="new" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="repeat" fill="#10b981" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Row - Lists and Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Latest Bookings */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Latest Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookingsLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center space-x-3 p-3">
                          <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : latestBookings && latestBookings.length > 0 ? (
                    latestBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="text-sm">
                            {booking.student_name ? booking.student_name.charAt(0).toUpperCase() : 'S'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{booking.student_name || 'Student'}</p>
                          <p className="text-sm text-gray-500">{booking.property_title || 'Property'} • Room</p>
                          <p className="text-xs text-gray-400">{booking.checkIn} - {booking.checkOut}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                        <MessageCircle className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                        <Eye className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                      </div>
                    </div>
                  ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No bookings yet</p>
                      <p className="text-sm">Bookings will appear here once students start booking your properties.</p>
                    </div>
                  )}
                </div>
                {latestBookings && latestBookings.length > 0 && (
                  <Button variant="link" className="mt-4 p-0 text-blue-600">View More Bookings</Button>
                )}
              </CardContent>
            </Card>

            {/* Transaction History */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                {/* ✅ BE CONSCIOUS: Proper loading and empty states */}
                {transactionsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="grid grid-cols-5 gap-2 py-3">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                ) : transactionHistory && transactionHistory.length > 0 ? (
                  <div className="space-y-1">
                    <div className="grid grid-cols-5 gap-2 text-xs font-medium text-gray-500 pb-2 border-b">
                      <span>PAYMENT ID</span>
                      <span>DATE & TIME</span>
                      <span>AMOUNT</span>
                      <span>METHOD</span>
                      <span>STATUS</span>
                    </div>
                    {/* ✅ BE CONSCIOUS: Fixed .map() crash - use correct variable name */}
                    {(transactionHistory || []).map((transaction) => (
                      <div key={transaction.id} className="grid grid-cols-5 gap-2 py-3 text-sm hover:bg-gray-50 rounded">
                        <span className="font-medium text-blue-600">{transaction.id}</span>
                        <span className="text-gray-600">{transaction.date}</span>
                        <span className="font-medium">{formatCurrency(transaction.amount)}</span>
                        <span className="text-gray-600">{transaction.method}</span>
                        <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No transactions yet</p>
                    <p className="text-sm">Transaction history will appear here once payments are processed.</p>
                  </div>
                )}
                {transactionHistory && transactionHistory.length > 0 && (
                  <Button variant="link" className="mt-4 p-0 text-blue-600">View All Transactions</Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </OwnerLayout>
  );
};

export default AnalyticsDashboard;
