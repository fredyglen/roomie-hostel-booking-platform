
import React from 'react';
import Header from '@/components/layout/Header';
import StudentNavBar from '@/components/navigation/StudentNavBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

const StudentDashboard: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col font-space-grotesk pb-16">
      <Header />
      <main className="flex-grow py-6 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's your student portal overview.</p>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <Link to="/student/properties" className="block">
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Browse Properties</CardTitle>
                  <Icon icon="solar:home-2-linear" className="h-4 w-4 ml-auto text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">View All</div>
                  <p className="text-xs text-gray-600">Find your perfect accommodation</p>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <Link to="/student/explore" className="block">
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Explore Area</CardTitle>
                  <Icon icon="solar:map-point-linear" className="h-4 w-4 ml-auto text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">Discover</div>
                  <p className="text-xs text-gray-600">Explore neighborhoods</p>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <Link to="/student/favorites" className="block">
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Favorites</CardTitle>
                  <Icon icon="solar:heart-linear" className="h-4 w-4 ml-auto text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">Saved</div>
                  <p className="text-xs text-gray-600">Your liked properties</p>
                </CardContent>
              </Link>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Icon icon="solar:clock-circle-linear" className="h-5 w-5 mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Icon icon="solar:eye-linear" className="h-4 w-4 mr-3 text-blue-500" />
                    <span className="text-sm">Viewed Modern Studio Apartment</span>
                  </div>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Icon icon="solar:heart-linear" className="h-4 w-4 mr-3 text-red-500" />
                    <span className="text-sm">Added City Center Hostel to favorites</span>
                  </div>
                  <span className="text-xs text-gray-500">1 day ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Icon icon="solar:map-point-linear" className="h-4 w-4 mr-3 text-green-500" />
                    <span className="text-sm">Explored Downtown area</span>
                  </div>
                  <span className="text-xs text-gray-500">3 days ago</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">24</div>
                <p className="text-xs text-gray-600">Properties Viewed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">5</div>
                <p className="text-xs text-gray-600">Favorites</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">3</div>
                <p className="text-xs text-gray-600">Areas Explored</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">12</div>
                <p className="text-xs text-gray-600">Stories Watched</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <StudentNavBar />
    </div>
  );
};

export default StudentDashboard;
