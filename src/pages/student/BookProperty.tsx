
import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BookingWizard from '@/components/booking/BookingWizard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import { createPropertyId, Property } from '@/types/property';
import { usePropertyById } from '@/hooks/property/useDynamicProperties';

const BookProperty: React.FC = () => {
  const { id } = useParams<{ id: string }>();

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

  React.useEffect(() => {
    const loadPropertyPreview = async () => {
      if (!property) return;

      try {
        const { setPropertyPreviewFromProperty } = await import('@/utils/propertyPreviewCache');
        setPropertyPreviewFromProperty(property as Property);
      } catch (e) {
        console.warn('Preview cache set failed for booking page', e);
      }
    };

    loadPropertyPreview();
  }, [property]);

  if (!propertyId) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
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
        <main className="flex-grow">
          <LoadingSpinner message="Loading property details..." />
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <ErrorDisplay
            error={error || 'Property not found'}
            title="Unable to load property"
            onRetry={refetch}
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Book {property.title} - ROOMi</title>
        <meta name="description" content={`Book ${property.title} - ${property.description}`} />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <BookingWizard property={property} />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default BookProperty;
