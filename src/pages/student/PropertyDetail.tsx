
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PropertyDetailsView from '@/components/properties/PropertyDetailsView';
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
        <title>{property.name} - ROOMi</title>
        <meta name="description" content={property.description} />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <PropertyDetailsView 
            property={property}
            onBookNow={handleBookNow}
            onGoBack={handleGoBack}
          />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default PropertyDetail;
