
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/EnhancedAuthContext';
import { useDemoProperties } from '@/hooks/property/useDemoProperties';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Bed, Bath, Users, Search, Heart, Calendar } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: properties, isLoading, error } = useDemoProperties();

  // Recent activity data (mock)
  const [recentActivity] = useState([
    { id: 1, type: 'viewed', property: 'Modern Studio near UPSA', date: '2 hours ago' },
    { id: 2, type: 'favorited', property: 'Shared Apartment in Legon', date: '1 day ago' },
    { id: 3, type: 'inquiry', property: 'Premium Hostel Room', date: '3 days ago' },
  ]);

  const [quickStats] = useState({
    totalViewed: 12,
    totalFavorites: 5,
    activeInquiries: 3,
    upcomingBookings: 1
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <LoadingSpinner message="Loading your dashboard..." />
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <ErrorDisplay 
            error={error} 
            title="Failed to load dashboard"
            onRetry={() => window.location.reload()}
          />
        </main>
        <Footer />
      </div>
    );
  }

  const featuredProperties = properties?.slice(0, 3) || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName || 'Student'}!
          </h1>
          <p className="text-gray-600">
            Find your perfect accommodation in Ghana's top universities.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Search className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Properties Viewed</p>
                  <p className="text-2xl font-bold">{quickStats.totalViewed}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Favorites</p>
                  <p className="text-2xl font-bold">{quickStats.totalFavorites}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Inquiries</p>
                  <p className="text-2xl font-bold">{quickStats.activeInquiries}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Bed className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Upcoming Bookings</p>
                  <p className="text-2xl font-bold">{quickStats.upcomingBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Properties */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Featured Properties</CardTitle>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/student/properties')}
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {featuredProperties.map((property) => (
                    <div 
                      key={property.id} 
                      className="flex items-center space-x-4 p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => navigate(`/student/property/${property.id}`)}
                    >
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0">
                        {property.images && property.images.length > 0 ? (
                          <img
                            src={property.images[0]}
                            alt={property.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Bed className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-semibold text-lg">{property.title}</h3>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {property.city}, {property.state}
                        </div>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center text-sm">
                            <Bed className="h-4 w-4 mr-1" />
                            {property.bedrooms} bed
                          </div>
                          <div className="flex items-center text-sm">
                            <Bath className="h-4 w-4 mr-1" />
                            {property.bathrooms} bath
                          </div>
                          <div className="flex items-center text-sm">
                            <Users className="h-4 w-4 mr-1" />
                            {property.max_occupants || 1} max
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{formatCurrency(property.rent || 0)}</p>
                        <p className="text-sm text-gray-500">per month</p>
                        <Badge variant="outline" className="mt-1">
                          {property.property_category}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm">
                          <span className="capitalize">{activity.type}</span> {activity.property}
                        </p>
                        <p className="text-xs text-gray-500">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => navigate('/student/booking-history')}
                >
                  View All Activity
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full" 
                  onClick={() => navigate('/student/properties')}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search Properties
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/student/favorites')}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  View Favorites
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/student/booking-history')}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Booking History
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StudentDashboard;
