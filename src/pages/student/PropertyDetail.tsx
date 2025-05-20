
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Property } from '@/types/property';
import { usePropertyLoader } from '@/hooks/usePropertyLoader';
import PropertyDetailView from '@/components/property/PropertyDetailView';
import { Icon } from '@iconify/react';

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Use the property loader hook to fetch property data
  const { data: property, isLoading, error } = usePropertyLoader({ 
    propertyId: id || '', 
    forOwner: false 
  });

  const handleViewStory = () => {
    navigate(`/student/property/${id}/story`);
  };
  
  const handleBookNow = () => {
    navigate(`/student/property/${id}/book`);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (error || !property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
            <p className="mb-6">The property you're looking for doesn't exist or has been removed.</p>
            <Link to="/student/properties">
              <Button variant="default">Browse Properties</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <PropertyDetailView 
        property={property} 
        onViewStory={handleViewStory}
        onBookNow={handleBookNow}
      />
      <Footer />
    </div>
  );
};

export default PropertyDetail;
