
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StudentNavBar from '@/components/navigation/StudentNavBar';
import PropertyDetailView from '@/components/property/PropertyDetailView';
import { usePropertyData } from '@/hooks/property/usePropertyData';
import { navigateToBooking, navigateBack } from '@/utils/navigation';
import { Property } from '@/types/property';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { getPropertyById } = usePropertyData();
  
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // No-flicker booking hydration: cache minimal preview for booking route
  // We import lazily to avoid SSR/lint issues when localStorage is unavailable
  useEffect(() => {
    const loadProperty = async () => {
      if (!id) {
        setError('Property ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const propertyData = await getPropertyById(id);

        if (!propertyData) {
          setError('Property not found');
        } else {
          setProperty(propertyData);
          // Cache preview for instant booking hydration
          try {
            const { setPropertyPreviewFromProperty } = await import('@/utils/propertyPreviewCache');
            setPropertyPreviewFromProperty(propertyData);
          } catch (e) {
            // non-fatal
            console.warn('Preview cache set failed', e);
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load property';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [id, getPropertyById]);

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

  if (loading) {
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

  if (error || !property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'Property not found'}</p>
            <Button onClick={handleGoBack} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
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
