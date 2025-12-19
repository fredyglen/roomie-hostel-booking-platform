
import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StudentNavBar from '@/components/navigation/StudentNavBar';
import PropertyDetailView from '@/components/property/PropertyDetailView';
import { navigateToBooking, navigateBack } from '@/utils/navigation';
import { createPropertyId, Property } from '@/types/property';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePropertyById } from '@/hooks/property/useDynamicProperties';
import ErrorDisplay from '@/components/common/ErrorDisplay';

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const propertyId = React.useMemo(() => {
    if (!id) return null;
    try {
      return createPropertyId(id);
    } catch (e) {
      console.error('Invalid property id param:', id, e);
      return null;
    }
  }, [id]);

  const {
    property,
    isLoading,
    isError,
    error,
    refetch
  } = usePropertyById(propertyId, { enabled: !!propertyId });

  // No-flicker booking hydration: cache minimal preview for booking route
  // We import lazily to avoid SSR/lint issues when localStorage is unavailable
  React.useEffect(() => {
    if (!property) return;

    // Cache preview for instant booking hydration whenever we have a
    // successfully loaded property.
    (async () => {
      try {
        const { setPropertyPreviewFromProperty } = await import('@/utils/propertyPreviewCache');
        setPropertyPreviewFromProperty(property as Property);
      } catch (e) {
        console.warn('Preview cache set failed', e);
      }
    })();
  }, [property]);

  const handleBookNow = () => {
    if (property?.id) {
      navigateToBooking(navigate, property.id, {
        from: location.pathname,
        preserveHistory: true
      });
    }
  };

  const handleGoBack = () => {
    navigateBack(navigate, '/student/properties', location.state);
  };

  const handleViewStory = () => {
    if (property?.id) {
      navigate(`/student/property/${property.id}/story`);
    }
  };

  if (!propertyId) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <ErrorDisplay
            title="Invalid property reference"
            error="Property ID is missing or invalid."
            showRetry={false}
          />
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading property details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !property) {
    const displayError = error || new Error('Property not found');

    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center gap-4">
          <ErrorDisplay
            title="Unable to load property"
            error={displayError}
            onRetry={refetch}
          />
          <Button onClick={handleGoBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{property?.title || 'Property Details'} - ROOMi</title>
        <meta name="description" content={property?.description || 'View property details on ROOMi'} />
      </Helmet>
      
      <div className="min-h-screen flex flex-col pb-32">
        <Header />
        <main className="flex-grow">
          {property ? (
            <PropertyDetailView
              property={property}
              onBookNow={handleBookNow}
              onGoBack={handleGoBack}
              onViewStory={handleViewStory}
            />
          ) : (
            <div className="max-w-6xl mx-auto p-3 sm:p-4">
              <div className="text-center py-8">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
              </div>
            </div>
          )}
        </main>


        {/* ✅ REMOVED: Footer removed from property detail page as requested */}
        <StudentNavBar />
      </div>
    </>
  );
};

export default PropertyDetail;
