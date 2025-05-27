import React, { useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Property } from '@/types/property';
import { usePropertyLoader } from '@/hooks/property';
import PropertyDetailView from '@/components/property/PropertyDetailView';
import StudentNavBar from '@/components/navigation/StudentNavBar';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';
import { navigateBack, navigateToStory, navigateToBooking, enhancedNavigate } from '@/utils/navigation';

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Use the property loader hook to fetch property data
  const { data: property, isLoading, error } = usePropertyLoader({ 
    propertyId: id || '', 
    forOwner: false,
    enabled: !!id
  });

  const handleViewStory = () => {
    if (!id) return;
    navigateToStory(navigate, id, { 
      from: location.pathname,
      preserveHistory: true 
    });
  };
  
  const handleBookNow = () => {
    if (!id) return;
    navigateToBooking(navigate, id, { 
      from: location.pathname,
      preserveHistory: true 
    });
  };
  
  const handleBack = () => {
    console.log('Back button clicked from PropertyDetail');
    navigateBack(navigate, '/student/properties', location.state);
  };
  
  useEffect(() => {
    if (error) {
      console.error("Error loading property:", error);
      toast.error("Could not load property details");
    }
  }, [error]);

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
        <StudentNavBar />
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
            <div className="flex gap-4 justify-center">
              <Button onClick={handleBack} variant="outline">
                Go Back
              </Button>
              <Button 
                onClick={() => enhancedNavigate(navigate, '/student/properties')}
                variant="default" 
                className="bg-blue-500 hover:bg-blue-600"
              >
                Browse Properties
              </Button>
            </div>
          </div>
        </div>
        <StudentNavBar />
      </div>
    );
  }
  
  // Ensure property has all required fields with defaults
  const propertyWithDefaults: Property = {
    ...property,
    type: property.type || property.property_type || 'Hostel',
    price: property.price || property.rent || 0,
    priceUnit: (property.priceUnit || property.price_unit || 'semester') as 'month' | 'semester' | 'year' | 'week',
    distanceToCampus: property.distanceToCampus || property.distance_to_campus || '10 min walk',
    images: property.images || [],
    stories: property.stories || [],
    description: property.description || '',
    owner_id: property.owner_id || '',
    amenities: property.amenities || []
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-2">
        <button 
          onClick={handleBack}
          className="flex items-center text-gray-600 hover:text-blue-600 mb-4 transition-colors"
        >
          <Icon icon="solar:arrow-left-linear" className="mr-1" />
          Back
        </button>
      </div>
      <PropertyDetailView 
        property={propertyWithDefaults} 
        onViewStory={handleViewStory}
        onBookNow={handleBookNow}
      />
      <StudentNavBar />
    </div>
  );
};

export default PropertyDetail;
