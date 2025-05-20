
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/components/common/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

const Index: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [demoUsersCreated, setDemoUsersCreated] = useState(false);
  const [creatingDemoUsers, setCreatingDemoUsers] = useState(false);

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'student') {
        navigate('/student/dashboard');
      } else if (user.role === 'owner' || user.role === 'admin') {
        navigate('/owner/dashboard');
      }
    }
  }, [user, loading, navigate]);

  const createDemoUsers = async () => {
    try {
      setCreatingDemoUsers(true);
      const response = await fetch(`${SUPABASE_URL}/functions/v1/create-demo-users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      
      const data = await response.json();
      console.log('Demo users creation result:', data);
      
      setDemoUsersCreated(true);
    } catch (error) {
      console.error('Error creating demo users:', error);
    } finally {
      setCreatingDemoUsers(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to ROOMi</h1>
          <p className="text-xl text-gray-600">Find your perfect student accommodation</p>
        </header>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Student Portal</CardTitle>
              <CardDescription>Looking for student accommodation</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Browse available properties, view details, and book your perfect student accommodation.</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link to="/student/properties">
                <Button variant="outline">Browse Properties</Button>
              </Link>
              <Link to="/login">
                <Button>Student Login</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Owner Portal</CardTitle>
              <CardDescription>List your properties for students</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Manage your properties, process bookings, and connect with student tenants.</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link to="/register">
                <Button variant="outline">Register</Button>
              </Link>
              <Link to="/login">
                <Button>Owner Login</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">New to ROOMi? Sign up today!</p>
          <div className="flex justify-center gap-4">
            <Link to="/register">
              <Button size="lg">Create Account</Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">Sign In</Button>
            </Link>
          </div>
          
          <div className="mt-8 border-t border-gray-200 pt-6">
            <p className="text-gray-600 mb-4">For demo purposes:</p>
            <Button 
              variant="outline" 
              onClick={createDemoUsers}
              disabled={creatingDemoUsers || demoUsersCreated}
            >
              {creatingDemoUsers ? "Creating Demo Users..." : 
               demoUsersCreated ? "Demo Users Created" : 
               "Create Demo Users"}
            </Button>
            
            {demoUsersCreated && (
              <div className="mt-4 text-sm text-gray-600">
                <p>Demo accounts have been created:</p>
                <ul className="list-disc list-inside">
                  <li>Student: student@roomi.com / password123</li>
                  <li>Owner: owner@roomi.com / password123</li>
                  <li>Admin: admin@roomi.com / password123</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Replace with your actual values
const SUPABASE_URL = "https://ymqnbekeqarjmxftzvks.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltcW5iZWtlcWFyam14ZnR6dmtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MDQzOTgsImV4cCI6MjA2MzI4MDM5OH0.X9FeOLvG4zDQkFyHP7evIXXzAiWnw5UbfwFv1E9UEVY";

export default Index;
