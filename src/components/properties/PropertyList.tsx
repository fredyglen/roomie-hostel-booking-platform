
import React from 'react';
import PropertyCard from './PropertyCard';
import { useNavigate } from 'react-router-dom';
import { Property } from '@/lib/supabase';

interface PropertyListProps {
  properties: Property[];
  isLoading?: boolean;
  emptyMessage?: string;
  onResetFilters?: () => void;
}

const PropertyList: React.FC<PropertyListProps> = ({ 
  properties, 
  isLoading = false, 
  emptyMessage = "No properties match your search criteria.", 
  onResetFilters 
}) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-0 mx-0">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-80"></div>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">{emptyMessage}</p>
        {onResetFilters && (
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded" onClick={onResetFilters}>
            Reset Filters
          </button>
        )}
      </div>
    );
  }

  const handleViewProperty = (id: string) => {
    if (!id) {
      console.error("Cannot navigate to property without ID");
      return;
    }
    
    console.log("Navigating to property:", id);
    navigate(`/student/property/${id}`);
  };

  const handleViewStory = (id: string) => {
    if (!id) {
      console.error("Cannot navigate to story without property ID");
      return;
    }
    
    console.log("Navigating to story:", id);
    navigate(`/student/property/${id}/story`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-0 mx-0">
      {properties.map(property => (
        <PropertyCard 
          key={property.id}
          property={{
            id: property.id,
            title: property.title,
            type: property.type || property.property_type || 'Hostel',
            price: property.price || property.rent || 0,
            priceUnit: (property.priceUnit || property.price_unit || 'semester') as 'month' | 'semester' | 'year' | 'week',
            address: property.address,
            distanceToCampus: property.distanceToCampus || property.distance_to_campus || '10 min walk',
            images: property.images || [],
            rating: property.rating,
            reviewCount: property.reviewCount,
            verified: property.verified,
            propertyCategory: property.propertyCategory || property.property_category,
            genderType: property.genderType || (property.gender_type as any),
            onViewStory: () => handleViewStory(property.id),
            onViewDetails: () => handleViewProperty(property.id),
            owner_id: property.owner_id || '', // Add default empty string for owner_id
            city: property.city || '', // Add default value
            state: property.state || '', // Add default value
            zip: property.zip || '', // Add default value
            bedrooms: property.bedrooms || 0, // Add default value
            bathrooms: property.bathrooms || 0, // Add default value
            available_from: property.available_from || '', // Add default value
            created_at: property.created_at || '', // Add default value
            updated_at: property.updated_at || '' // Add default value
          }}
        />
      ))}
    </div>
  );
};

export default PropertyList;
