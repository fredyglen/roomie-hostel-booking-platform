
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Property } from '@/types/property';
import { supabase } from '@/integrations/supabase/client';
import EnhancedBookingForm from './EnhancedBookingForm';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import BookingFormSkeleton from '@/components/booking/BookingFormSkeleton';
import { getPropertyPreview } from '@/utils/propertyPreviewCache';

const BookingStepsContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Property data
  const [property, setProperty] = React.useState<Property | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadProperty = async () => {
      if (!id) {
        setError('Property ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Loading property with ID:', id);

        // Direct Supabase query
        const { data, error: dbError } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single();

        console.log('Supabase query result:', { data, error: dbError });

        if (dbError) {
          console.error('Database error:', dbError);
          setError('Property not found');
          return;
        }

        if (data) {
          console.log('Property data found:', data);
          // Create a simple property object
          const propertyData = ({
            id: data.id,
            name: data.title,
            title: data.title,
            description: data.description,
            address: data.address,
            city: data.city,
            state: data.state,
            rent: data.rent,
            price: data.rent,
            bedrooms: data.bedrooms,
            bathrooms: data.bathrooms,
            images: data.images || [],
            amenities: data.amenities || [],
            is_available: data.is_available,
            owner_id: (data as any).owner_id,
            agent_id: (data as any).agent_id,
            property_category: (data as any).property_category
          } as unknown as Property);
          setProperty(propertyData);
        } else {
          console.error('No property data returned for ID:', id);
          setError('Property not found');
        }
      } catch (err) {
        console.error('Error loading property:', err);
        setError(err instanceof Error ? err.message : 'Failed to load property');
      } finally {
        setLoading(false);
      }
    };
    loadProperty();
  }, [id]);

  const handleBookingSuccess = (bookingId: string) => {
    toast({
      title: "Booking Successful!",
      description: "Your booking has been created successfully.",
    });
    navigate(`/student/booking-confirmation?id=${bookingId}`);
  };

  const handleBookingCancel = () => {
    navigate(`/student/properties`);
  };

  if (loading) {
    // No-flicker booking hydration: if we have a cached preview, show a lightweight skeleton instead of spinner
    const preview = id ? getPropertyPreview(id) : null;
    if (preview) {
      return <BookingFormSkeleton preview={preview} />;
    }
    return <LoadingSpinner message="Loading property details..." />;
  }

  if (error || !property) {
    return <ErrorDisplay error={error || 'Property not found'} title="Unable to load property" />;
  }
  return (
    <div className="w-full min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-4 md:px-6 md:py-8">
        <EnhancedBookingForm
          property={property}
          onSuccess={handleBookingSuccess}
          onCancel={handleBookingCancel}
        />
      </div>
    </div>
  );
};

export default BookingStepsContainer;
