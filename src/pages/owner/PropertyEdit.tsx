
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader } from 'lucide-react';
import OwnerLayout from '@/components/layout/OwnerLayout';
import PropertyEditForm from '@/components/owner/PropertyEditForm';
import { usePropertyLoader } from '@/hooks/usePropertyLoader';

const PropertyEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Fetch property details using the custom hook
  const { data: property, isLoading, error } = usePropertyLoader({
    propertyId: id || '',
    enabled: !!id && !!user?.id,
    forOwner: true
  });

  // Prepare form initial data
  const initialData = property ? {
    ...property,
    propertyCategory: property.propertyCategory || property.property_category || 'Hostel',
    amenities: property.amenities?.join('\n') || '',
    house_rules: property.house_rules?.join('\n') || '',
    utilities: property.utilities?.join('\n') || '',
    all_inclusive: property.all_inclusive || false,
    bedrooms: property.bedrooms || 1,
    bathrooms: property.bathrooms || 1,
    city: property.city || 'Accra',
    state: property.state || 'Greater Accra',
    zip: property.zip || '00000',
    price_unit: property.price_unit || 'semester',
    total_rooms: property.total_rooms || 1,
    rooms_available: property.rooms_available || 1,
    beds_per_room: property.beds_per_room || 1,
    beds_available: property.beds_available || 1,
    max_occupants: property.max_occupants || 1,
    has_bedframes: property.has_bedframes || false,
    has_mattresses: property.has_mattresses || false,
    has_wardrobes: property.has_wardrobes || false,
    has_individual_meters: property.has_individual_meters || false,
    advance_payment_months: property.advance_payment_months || 12,
    allow_bill_sharing: property.allow_bill_sharing || false,
    landmark: property.landmark || '',
  } : undefined;

  if (isLoading) {
    return (
      <OwnerLayout pageTitle="Edit Property">
        <div className="flex justify-center items-center h-64">
          <Loader className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      </OwnerLayout>
    );
  }

  if (error || !property) {
    return (
      <OwnerLayout pageTitle="Edit Property">
        <div className="bg-red-50 p-4 rounded-md">
          <h2 className="text-lg font-semibold text-red-800">Error</h2>
          <p className="text-sm text-red-600">
            {error instanceof Error ? error.message : 'Failed to load property. Please try again.'}
          </p>
          <button 
            onClick={() => navigate('/owner/properties')}
            className="mt-4 text-sm text-blue-600 hover:underline"
          >
            Back to Properties
          </button>
        </div>
      </OwnerLayout>
    );
  }

  return (
    <OwnerLayout pageTitle={`Edit Property: ${property?.title}`}>
      <PropertyEditForm propertyId={id || ''} initialData={initialData} />
    </OwnerLayout>
  );
};

export default PropertyEdit;
