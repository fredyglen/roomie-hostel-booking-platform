
import React, { useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BookingStepsContainer from '@/components/booking/BookingStepsContainer';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { navigateBack } from '@/utils/navigation';

const BookProperty: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const handleBack = () => {
    // Navigate back to property detail or fallback to properties list
    const fallbackPath = id ? `/student/property/${id}` : '/student/properties';
    navigateBack(navigate, fallbackPath, location.state);
  };

  // Prevent accidental navigation away
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-2">
        <button 
          onClick={handleBack}
          className="flex items-center text-gray-600 hover:text-blue-600 mb-4 transition-colors"
        >
          <Icon icon="solar:arrow-left-linear" className="mr-1" />
          Back to Property
        </button>
      </div>
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <BookingStepsContainer />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookProperty;
