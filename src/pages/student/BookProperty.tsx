
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BookingStepsContainer from '@/components/booking/BookingStepsContainer';
import { usePropertyLoader } from '@/hooks/property/usePropertyLoader';
import { Loader2 } from 'lucide-react';

const BookProperty: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { property, loading, error } = usePropertyLoader(id);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading property...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error || 'Property not found'}</p>
            <button 
              onClick={() => window.history.back()} 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <BookingStepsContainer />
      </main>
      <Footer />
    </div>
  );
};

export default BookProperty;
