
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Logo from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search, HelpCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Determine where to redirect the user based on their role
  const getRedirectPath = () => {
    if (!user) return "/";
    
    switch (user.role) {
      case "student":
        return "/student/dashboard";
      case "owner":
      case "admin":
        return "/owner/dashboard";
      default:
        return "/";
    }
  };

  const redirectPath = getRedirectPath();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="container mx-auto px-4 py-16 flex-grow flex flex-col items-center justify-center text-center">
        <Link to="/" className="mb-8">
          <Logo />
        </Link>
        
        <h1 className="text-9xl font-extrabold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-600 max-w-md mb-8">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Link to={redirectPath} className="flex-1">
            <Button variant="default" className="w-full" size="lg">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Button
            variant="outline"
            className="flex-1"
            size="lg"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
        
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md w-full">
          <Link to="/student/properties" className="flex gap-3 items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <Search className="h-6 w-6 text-blue-600" />
            <div className="text-left">
              <h3 className="font-medium">Find Properties</h3>
              <p className="text-sm text-gray-500">Search for accommodations</p>
            </div>
          </Link>
          
          <Link to="/login" className="flex gap-3 items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <HelpCircle className="h-6 w-6 text-blue-600" />
            <div className="text-left">
              <h3 className="font-medium">Account Help</h3>
              <p className="text-sm text-gray-500">Sign in or create account</p>
            </div>
          </Link>
        </div>
      </div>
      
      <footer className="py-6 border-t border-gray-200 text-center text-gray-600 text-sm">
        <p>&copy; {new Date().getFullYear()} ROOMi. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default NotFound;
