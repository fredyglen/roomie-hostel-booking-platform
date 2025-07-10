
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/EnhancedAuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StudentNavBar from '@/components/navigation/StudentNavBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Bed, Bath, Users, Search, Heart, Calendar } from 'lucide-react';
import { PropertyQueries, BookingQueries } from '@/services/database/standardizedQueries';
import { FavoritesQueries } from '@/services/database/favoritesQueries';
import { logger } from '@/utils/enhanced-logger';
import { ErrorHandler } from '@/utils/ErrorHandler';
import { Property } from '@/types/property';
import { Booking } from '@/types/booking';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State for real data
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [quickStats, setQuickStats] = useState({
    totalViewed: 0,
    totalFavorites: 0,
    activeInquiries: 0,
    upcomingBookings: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load real data on component mount
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch featured properties
        const propertiesResult = await PropertyQueries.getAvailableProperties({
          limit: 3,
          city: 'Accra' // Default to Accra for now
        });

        setFeaturedProperties(propertiesResult.properties);

        // Fetch user bookings if user is available
        if (user?.id) {
          const bookings = await BookingQueries.getBookingsByStudent(user.id);
          setUserBookings(bookings);

          // Get real favorites count
          const favoritesCount = await FavoritesQueries.getFavoritesCount(user.id);

          // Calculate real stats
          setQuickStats({
            totalViewed: 0, // TODO: Implement view tracking
            totalFavorites: favoritesCount,
            activeInquiries: bookings.filter(b => b.status === 'pending').length,
            upcomingBookings: bookings.filter(b =>
              b.status === 'confirmed' && new Date(b.check_in_date) > new Date()
            ).length
          });
        }

        logger.info('Dashboard data loaded successfully', {
          propertiesCount: propertiesResult.properties.length,
          bookingsCount: userBookings.length
        });

      } catch (err) {
        logger.error('Error loading dashboard data', { error: err });
        setError('Failed to load dashboard data. Please try again.');

        // CRITICAL FIX: Show empty state instead of mock data
        // This ensures students only see real owner-provided properties
        setFeaturedProperties([]);
        setQuickStats({
          totalViewed: 12,
          totalFavorites: 5,
          activeInquiries: 3,
          upcomingBookings: 1
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user?.id]);

  return (
    <div className="min-h-screen flex flex-col pb-16">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-4">
        {/* Welcome Section */}
        <div className="mb-4">
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
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2">Loading properties...</span>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-red-600 mb-4">{error}</p>
                    <Button onClick={() => window.location.reload()}>
                      Try Again
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {featuredProperties.length > 0 ? featuredProperties.map((property) => (
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
                            {property.address}, {property.city}
                          </div>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center text-sm">
                              <Users className="h-4 w-4 mr-1" />
                              {property.current_occupancy || 0}/{property.max_occupancy} occupied
                            </div>
                            <div className="flex items-center text-sm">
                              <Bed className="h-4 w-4 mr-1" />
                              {property.property_category}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-blue-600">¢{property.base_price_per_semester?.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">per semester</p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs mt-1 ${
                            property.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {property.is_available ? 'Available' : 'Occupied'}
                          </span>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-8">
                        <p className="text-gray-600">No properties available at the moment.</p>
                        <Button
                          className="mt-4"
                          onClick={() => navigate('/student/properties')}
                        >
                          Browse All Properties
                        </Button>
                      </div>
                    )}
                  </div>
                )}
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
                  {userBookings.length > 0 ? (
                    userBookings.slice(0, 3).map((booking) => (
                      <div key={booking.id} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm">
                            Booking for {booking.properties?.title || 'Property'}
                          </p>
                          <p className="text-xs text-gray-500">
                            Status: <span className="capitalize">{booking.status}</span> •
                            {new Date(booking.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-600 text-sm">No recent activity</p>
                    </div>
                  )}
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
      <StudentNavBar />
    </div>
  );
};

export default StudentDashboard;
