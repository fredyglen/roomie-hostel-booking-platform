
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import UniversitySelector from '@/components/UniversitySelector';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/EnhancedAuthContext';

const Landing: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header transparent={false} />
      <div className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Find Your Perfect Student Accommodation
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              ROOMi connects students with quality housing near campus. 
              Browse available properties, compare options, and book your ideal accommodation.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link to="/register">
                <Button size="lg">Sign Up</Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">Log In</Button>
              </Link>
            </div>
          </div>
          
          <UniversitySelector />
          
          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
                <h3 className="text-xl font-semibold mb-2">Create Your Account</h3>
                <p className="text-gray-600">Sign up as a student looking for accommodation or as a property owner.</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
                <h3 className="text-xl font-semibold mb-2">Browse Properties</h3>
                <p className="text-gray-600">Search through available properties near your university.</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
                <h3 className="text-xl font-semibold mb-2">Book Your Stay</h3>
                <p className="text-gray-600">Select your preferred accommodation and complete your booking.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Landing;
