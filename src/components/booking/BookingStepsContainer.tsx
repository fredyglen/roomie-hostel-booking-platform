
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Property } from '@/types/property';
import { supabase } from '@/integrations/supabase/client';
import EnhancedBookingForm from './EnhancedBookingForm';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorDisplay from '@/components/common/ErrorDisplay';

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
          const propertyData = {
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
            is_available: data.is_available
          };
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
    return <LoadingSpinner message="Loading property details..." />;
  }

  if (error || !property) {
    return <ErrorDisplay error={error || 'Property not found'} title="Unable to load property" />;
  }
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6">
        <button
          onClick={() => navigate('/student/properties')}
          className="text-primary hover:text-primary/80 flex items-center gap-2 mb-4"
        >
          ← Back to Properties
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Book Property</h1>
        <p className="text-gray-600 mt-1">Complete your booking for {property.name}</p>
      </div>

      <EnhancedBookingForm
        property={property}
        onSuccess={handleBookingSuccess}
        onCancel={handleBookingCancel}
      />
    </div>
  );
};

export default BookingStepsContainer;
