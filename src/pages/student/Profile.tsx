
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/EnhancedAuthContext';
import StudentNavBar from '@/components/navigation/StudentNavBar';
import { Icon } from '@iconify/react';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };
  
  return (
    <div className="min-h-screen flex flex-col font-space-grotesk pb-16">
      <Header />
      <main className="flex-grow py-6 px-4">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Your Profile</h1>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader className="text-center pb-2">
                  <div className="w-24 h-24 rounded-full bg-blue-100 mx-auto mb-4 flex items-center justify-center">
                    <Icon icon="solar:user-rounded-linear" className="text-blue-500" width={48} height={48} />
                  </div>
                  <CardTitle>{user?.firstName} {user?.lastName || ''}</CardTitle>
                  <p className="text-gray-500 text-sm">{user?.email}</p>
                </CardHeader>
                <CardContent className="pt-4">
                  <Button 
                    onClick={handleLogout}
                    variant="outline" 
                    className="w-full"
                  >
                    <Icon icon="solar:logout-3-linear" className="mr-2" />
                    Logout
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Icon icon="solar:bookmark-linear" className="mr-2 text-blue-500" />
                    Your Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 text-sm">You have no active bookings</p>
                  <Button 
                    variant="link" 
                    className="p-0 mt-2"
                    onClick={() => navigate('/student/properties')}
                  >
                    Browse properties
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Icon icon="solar:settings-linear" className="mr-2 text-blue-500" />
                    Account Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b">
                      <div>
                        <h3 className="font-medium">Notifications</h3>
                        <p className="text-sm text-gray-500">Get alerts about property updates</p>
                      </div>
                      <Button variant="outline" size="sm">Manage</Button>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <div>
                        <h3 className="font-medium">Personal Information</h3>
                        <p className="text-sm text-gray-500">Update your contact details</p>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <div>
                        <h3 className="font-medium">Password</h3>
                        <p className="text-sm text-gray-500">Change your password</p>
                      </div>
                      <Button variant="outline" size="sm">Update</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <StudentNavBar />
    </div>
  );
};

export default Profile;
