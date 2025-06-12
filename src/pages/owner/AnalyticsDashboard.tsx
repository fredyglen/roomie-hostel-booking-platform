
import React from 'react';
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

const AnalyticsDashboard: React.FC = () => {
  // Sample data for charts
  const monthlyData = [
    { month: 'Jan', revenue: 6800, occupancy: 72 },
    { month: 'Feb', revenue: 7200, occupancy: 75 },
    { month: 'Mar', revenue: 6900, occupancy: 71 },
    { month: 'Apr', revenue: 7800, occupancy: 82 },
    { month: 'May', revenue: 8200, occupancy: 85 },
    { month: 'Jun', revenue: 7900, occupancy: 79 },
    { month: 'Jul', revenue: 8500, occupancy: 88 },
    { month: 'Aug', revenue: 7020, occupancy: 82 },
    { month: 'Sep', revenue: 7600, occupancy: 78 },
    { month: 'Oct', revenue: 7100, occupancy: 74 },
    { month: 'Nov', revenue: 6800, occupancy: 71 },
    { month: 'Dec', revenue: 7300, occupancy: 76 }
  ];

  const bookingSourcesData = [
    { name: 'Direct Website', value: 52, count: 5213, color: '#3b82f6' },
    { name: 'Airbnb', value: 28, count: 2804, color: '#f97316' },
    { name: 'Booking.com', value: 14, count: 1402, color: '#10b981' },
    { name: 'Others', value: 6, count: 601, color: '#6b7280' }
  ];

  const guestTypeData = [
    { month: 'Jan', new: 180, repeat: 65 },
    { month: 'Feb', new: 195, repeat: 72 },
    { month: 'Mar', new: 210, repeat: 85 },
    { month: 'Apr', new: 225, repeat: 95 },
    { month: 'May', new: 240, repeat: 88 },
    { month: 'Jun', new: 220, repeat: 92 }
  ];

  const latestBookings = [
    {
      id: 1,
      guestName: 'Kwame Asante',
      property: 'Legon Heights A',
      room: 'Room 24',
      checkIn: '2024-06-15',
      checkOut: '2024-08-15',
      status: 'Confirmed',
      avatar: 'KA'
    },
    {
      id: 2,
      guestName: 'Ama Serwaa',
      property: 'Campus View B',
      room: 'Room 12',
      checkIn: '2024-06-20',
      checkOut: '2024-12-20',
      status: 'Pending',
      avatar: 'AS'
    },
    {
      id: 3,
      guestName: 'Kofi Mensah',
      property: 'Tech Hostel',
      room: 'Room 8',
      checkIn: '2024-06-25',
      checkOut: '2024-06-30',
      status: 'Checked-In',
      avatar: 'KM'
    },
    {
      id: 4,
      guestName: 'Akosua Boateng',
      property: 'Legon Heights B',
      room: 'Room 15',
      checkIn: '2024-07-01',
      checkOut: '2024-12-15',
      status: 'Confirmed',
      avatar: 'AB'
    }
  ];

  const transactions = [
    {
      id: 'PAY001321',
      date: 'Jun 21, 2024, 3:30pm',
      amount: 1200,
      method: 'Mobile Money',
      status: 'Completed'
    },
    {
      id: 'PAY001320',
      date: 'Jun 21, 2024, 2:45pm',
      amount: 800,
      method: 'Bank Transfer',
      status: 'Completed'
    },
    {
      id: 'PAY001319',
      date: 'Jun 21, 2024, 1:15pm',
      amount: 950,
      method: 'Mobile Money',
      status: 'Failed'
    },
    {
      id: 'PAY001318',
      date: 'Jun 21, 2024, 11:30am',
      amount: 1500,
      method: 'Card',
      status: 'Completed'
    },
    {
      id: 'PAY001317',
      date: 'Jun 21, 2024, 9:20am',
      amount: 750,
      method: 'Mobile Money',
      status: 'Pending'
    }
  ];

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0
    }).format(amount);
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
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback>AR</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <div className="font-medium">Austin Robertson</div>
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
                    <p className="text-2xl font-bold text-gray-900">$84,240</p>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +18.2% vs. last year
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
                    <p className="text-2xl font-bold text-gray-900">78%</p>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +4.5% vs. last year
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
                    <p className="text-sm font-medium text-gray-600">New Bookings</p>
                    <p className="text-2xl font-bold text-gray-900">1,240</p>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +12.6% vs. last year
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
                    <p className="text-sm font-medium text-gray-600">Cancellations</p>
                    <p className="text-2xl font-bold text-gray-900">42</p>
                    <p className="text-sm text-red-600 flex items-center mt-1">
                      <TrendingDown className="h-4 w-4 mr-1" />
                      -3.7% vs. last year
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                    <XCircle className="h-6 w-6 text-red-600" />
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
                            name === 'revenue' ? `$${value}` : `${value}%`,
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
                  <div className="text-3xl font-bold text-gray-900">4.2</div>
                  <div className="text-sm text-gray-600">nights</div>
                  <div className="text-xs text-gray-500 mt-1">Avg. Length of Stay</div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardContent className="p-6 text-center">
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
                        strokeDasharray={`${93 * 2.26} ${100 * 2.26}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-900">93%</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">Guest Satisfaction</div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-gray-900">18</div>
                  <div className="text-sm text-gray-600">tickets</div>
                  <div className="text-xs text-gray-500 mt-1">Pending Maintenance</div>
                  <div className="flex items-center justify-center mt-2">
                    <TrendingUp className="h-4 w-4 text-red-500" />
                    <span className="text-xs text-red-500 ml-1">+2 today</span>
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
                        {bookingSourcesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-xl font-bold">10,020</div>
                        <div className="text-xs text-gray-500">Total Bookings</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {bookingSourcesData.map((item, index) => (
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
                  {latestBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="text-sm">{booking.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{booking.guestName}</p>
                          <p className="text-sm text-gray-500">{booking.property} • {booking.room}</p>
                          <p className="text-xs text-gray-400">{booking.checkIn} - {booking.checkOut}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                        <MessageCircle className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                        <Eye className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="link" className="mt-4 p-0 text-blue-600">View More Bookings</Button>
              </CardContent>
            </Card>

            {/* Transaction History */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="grid grid-cols-5 gap-2 text-xs font-medium text-gray-500 pb-2 border-b">
                    <span>PAYMENT ID</span>
                    <span>DATE & TIME</span>
                    <span>AMOUNT</span>
                    <span>METHOD</span>
                    <span>STATUS</span>
                  </div>
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="grid grid-cols-5 gap-2 py-3 text-sm hover:bg-gray-50 rounded">
                      <span className="font-medium text-blue-600">{transaction.id}</span>
                      <span className="text-gray-600">{transaction.date}</span>
                      <span className="font-medium">{formatCurrency(transaction.amount)}</span>
                      <span className="text-gray-600">{transaction.method}</span>
                      <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                    </div>
                  ))}
                </div>
                <Button variant="link" className="mt-4 p-0 text-blue-600">View All Transactions</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </OwnerLayout>
  );
};

export default AnalyticsDashboard;
