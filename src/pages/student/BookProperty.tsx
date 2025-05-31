
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StudentNavBar from '@/components/navigation/StudentNavBar';
import BookingWizard from '@/components/booking/BookingWizard';
import { usePropertyLoader } from '@/hooks/property/usePropertyLoader';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BookProperty: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: property, isLoading, error } = usePropertyLoader({
    propertyId: id || '',
    enabled: !!id,
    forOwner: false
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </main>
        <Footer />
        <StudentNavBar />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error?.message || 'Property not found. The property may have been removed or the URL is incorrect.'}
              </AlertDescription>
            </Alert>
            <Button 
              onClick={() => navigate('/student/properties')}
              variant="outline"
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Properties
            </Button>
          </div>
        </main>
        <Footer />
        <StudentNavBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button 
              onClick={() => navigate(`/student/property/${id}`)}
              variant="ghost"
              className="flex items-center mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Property Details
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Property</h1>
            <p className="text-gray-600">{property.title}</p>
          </div>
          
          <BookingWizard property={property} />
        </div>
      </main>
      <Footer />
      <StudentNavBar />
    </div>
  );
};

export default BookProperty;
