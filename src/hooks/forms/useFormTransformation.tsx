
import { PropertyFormValues } from '@/components/owner/property-form/PropertyFormSchema';

export const useFormTransformation = () => {
  const transformFormToDbFormat = (formData: PropertyFormValues, userId: string) => {
    // Transform the form data to match the database schema
    const propertyData = {
      owner_id: userId,
      title: formData.title || '',
      type: formData.type || '',
      property_category: formData.propertyCategory || 'Hostel',
      address: formData.address || '',
      city: formData.city || '',
      region: formData.region || 'Greater Accra',
      location: formData.location || '',
      landmark: formData.landmark || '',
      distance_to_campus: formData.distance_to_campus || '',
      zip: formData.zip || '',
      price: Number(formData.price) || 0,
      price_unit: formData.price_unit || 'semester',
      description: formData.description || '',
      bedrooms: Number(formData.bedrooms) || 1,
      bathrooms: Number(formData.bathrooms) || 1,
      all_inclusive: Boolean(formData.all_inclusive),
      status: formData.status || 'Available',
      verification_status: formData.verification_status || 'pending',
      gender_restriction: formData.gender_restriction || 'mixed',
      pet_policy: formData.pet_policy || 'not_allowed',
      parking_available: Boolean(formData.parking_available),
      has_accessibility_features: Boolean(formData.has_accessibility_features),
      cancellation_policy: formData.cancellation_policy || 'moderate',
      internet_speed: formData.internet_speed || 'standard',
      
      // Hostel-specific fields
      total_rooms: Number(formData.total_rooms) || null,
      rooms_available: Number(formData.rooms_available) || null,
      beds_per_room: Number(formData.beds_per_room) || null,
      beds_available: Number(formData.beds_available) || null,
      room_type: formData.room_type || null,
      
      // Homestel-specific fields
      max_occupants: Number(formData.max_occupants) || null,
      house_type: formData.house_type || null,
      
      // Common optional fields
      amenities: formData.amenities || [],
      utilities: formData.utilities || [],
      house_rules: formData.house_rules || [],
      images: formData.images || [],
      videos: formData.videos || [],
      virtual_tour_url: formData.virtual_tour_url || '',
      
      // Additional fields with defaults
      furnishing_level: formData.furnishing_level || 'unfurnished',
      kitchen_access: formData.kitchen_access || 'shared',
      laundry_access: formData.laundry_access || 'shared',
      cleaning_service: Boolean(formData.cleaning_service),
      security_features: formData.security_features || [],
      nearby_amenities: formData.nearby_amenities || [],
      transport_access: formData.transport_access || [],
      
      // Timestamps
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Remove null values for cleaner database insertion
    Object.keys(propertyData).forEach(key => {
      if (propertyData[key as keyof typeof propertyData] === null || 
          propertyData[key as keyof typeof propertyData] === undefined) {
        delete propertyData[key as keyof typeof propertyData];
      }
    });

    return propertyData;
  };

  return { transformFormToDbFormat };
};
