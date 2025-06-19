import React from 'react';
import { useAuth } from '@/context/EnhancedAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const AuthDebugPanel: React.FC = () => {
  const { user, session, loading, signOut } = useAuth();
  const navigate = useNavigate();

  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show in production
  }

  const handleNavigateToRole = (role: string) => {
    switch (role) {
      case 'student':
        navigate('/student/properties');
        break;
      case 'owner':
      case 'agent':
        navigate('/owner/dashboard');
        break;
      case 'admin':
        navigate('/admin/dashboard');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 bg-white shadow-lg border-2 border-blue-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          🔧 Auth Debug Panel
          <Badge variant={user ? "default" : "secondary"}>
            {loading ? "Loading..." : user ? "Authenticated" : "Not Authenticated"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-xs">
        {/* User Info */}
        {user ? (
          <div className="space-y-2">
            <div>
              <strong>User ID:</strong> {user.id?.substring(0, 8)}...
            </div>
            <div>
              <strong>Email:</strong> {user.email}
            </div>
            <div>
              <strong>Role:</strong> 
              <Badge variant="outline" className="ml-2">
                {user.role || 'No Role'}
              </Badge>
            </div>
            <div>
              <strong>Name:</strong> {user.firstName} {user.lastName}
            </div>
            {user.phone && (
              <div>
                <strong>Phone:</strong> {user.phone}
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-500">
            No user data available
          </div>
        )}

        {/* Session Info */}
        {session ? (
          <div className="border-t pt-2">
            <div>
              <strong>Session:</strong> Active
            </div>
            <div>
              <strong>Expires:</strong> {new Date(session.expires_at! * 1000).toLocaleTimeString()}
            </div>
          </div>
        ) : (
          <div className="border-t pt-2 text-gray-500">
            No active session
          </div>
        )}

        {/* Quick Actions */}
        <div className="border-t pt-2 space-y-2">
          <div className="text-xs font-semibold">Quick Actions:</div>
          
          {user ? (
            <div className="space-y-1">
              <Button
                size="sm"
                variant="outline"
                className="w-full text-xs"
                onClick={() => handleNavigateToRole(user.role || 'student')}
              >
                Go to {user.role || 'student'} Dashboard
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                className="w-full text-xs"
                onClick={() => navigate('/student/properties')}
              >
                Test Property Listings
              </Button>
              
              <Button
                size="sm"
                variant="destructive"
                className="w-full text-xs"
                onClick={signOut}
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="space-y-1">
              <Button
                size="sm"
                variant="outline"
                className="w-full text-xs"
                onClick={() => navigate('/login')}
              >
                Go to Login
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                className="w-full text-xs"
                onClick={() => navigate('/register')}
              >
                Go to Register
              </Button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="border-t pt-2">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
              <span className="text-blue-600">Processing authentication...</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuthDebugPanel;
