
import { PropertyFormValues } from '@/components/owner/property-form/PropertyFormSchema';
import { PropertyInsert } from '@/types/property';

export const useFormTransformation = () => {
  const transformFormToDbFormat = (formData: PropertyFormValues, ownerId: string): PropertyInsert => {
    return {
      owner_id: ownerId,
      title: formData.title,
      property_type: formData.type,
      property_category: formData.propertyCategory,
      rent: formData.price,
      address: formData.address,
      city: formData.city,
      state: formData.region, // Map region to state field
      zip: formData.zip || '',
      bedrooms: formData.bedrooms,
      bathrooms: formData.bathrooms,
      available_from: new Date().toISOString().split('T')[0], // Today's date
      description: formData.description,
      amenities: formData.amenities ? formData.amenities.split('\n').filter(Boolean) : [],
      images: formData.images || [],
      is_available: formData.status === 'Available',
      distance_to_campus: formData.distance_to_campus,
      house_rules: formData.house_rules ? formData.house_rules.split('\n').filter(Boolean) : [],
      all_inclusive: formData.all_inclusive,
      utilities: formData.utilities ? formData.utilities.split('\n').filter(Boolean) : [],
      location: formData.location,
      landmark: formData.landmark,
      
      // Room management fields
      total_rooms: formData.total_rooms,
      rooms_available: formData.rooms_available,
      beds_per_room: formData.beds_per_room,
      beds_available: formData.beds_available,
      max_occupants: formData.max_occupants,
      
      // Enhanced facility features
      has_bedframes: formData.has_bedframes,
      has_mattresses: formData.has_mattresses,
      has_wardrobes: formData.has_wardrobes,
      has_individual_meters: formData.has_individual_meters,
      
      // Payment and occupancy details
      advance_payment_months: formData.advance_payment_months,
      allow_bill_sharing: formData.allow_bill_sharing
    };
  };

  const transformDbToFormValues = (dbData: any): Partial<PropertyFormValues> => {
    return {
      title: dbData.title || '',
      type: dbData.property_type || '',
      propertyCategory: dbData.property_category || 'Hostel',
      address: dbData.address || '',
      city: dbData.city || '',
      region: dbData.state || 'Greater Accra', // Map state to region
      zip: dbData.zip || '',
      price: dbData.rent || 0,
      price_unit: 'semester', // Default for now
      description: dbData.description || '',
      bedrooms: dbData.bedrooms || 1,
      bathrooms: dbData.bathrooms || 1,
      status: dbData.is_available ? 'Available' : 'Unavailable',
      distance_to_campus: dbData.distance_to_campus,
      amenities: Array.isArray(dbData.amenities) ? dbData.amenities.join('\n') : '',
      house_rules: Array.isArray(dbData.house_rules) ? dbData.house_rules.join('\n') : '',
      all_inclusive: dbData.all_inclusive || false,
      utilities: Array.isArray(dbData.utilities) ? dbData.utilities.join('\n') : '',
      location: dbData.location,
      landmark: dbData.landmark,
      images: dbData.images || [],
      
      // Room management fields
      total_rooms: dbData.total_rooms,
      rooms_available: dbData.rooms_available,
      beds_per_room: dbData.beds_per_room,
      beds_available: dbData.beds_available,
      max_occupants: dbData.max_occupants,
      
      // Enhanced facility features
      has_bedframes: dbData.has_bedframes,
      has_mattresses: dbData.has_mattresses,
      has_wardrobes: dbData.has_wardrobes,
      has_individual_meters: dbData.has_individual_meters,
      
      // Payment and occupancy details
      advance_payment_months: dbData.advance_payment_months,
      allow_bill_sharing: dbData.allow_bill_sharing,
      
      // New enhanced fields
      verification_status: dbData.verification_status || 'pending',
      emergency_contact_name: dbData.emergency_contact_name,
      emergency_contact_phone: dbData.emergency_contact_phone,
      has_accessibility_features: dbData.has_accessibility_features || false,
      pet_policy: dbData.pet_policy || 'not_allowed',
      parking_available: dbData.parking_available || false,
      parking_cost: dbData.parking_cost,
      security_features: dbData.security_features || [],
      internet_speed: dbData.internet_speed || 'standard',
      gender_restriction: dbData.gender_restriction || 'mixed',
      semester_availability: dbData.semester_availability || [],
      cancellation_policy: dbData.cancellation_policy || 'moderate',
      virtual_tour_url: dbData.virtual_tour_url
    };
  };

  return {
    transformFormToDbFormat,
    transformDbToFormValues
  };
};
