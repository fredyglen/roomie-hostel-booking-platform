
import { PropertyFormValues } from '@/components/owner/property-form/PropertyFormSchema';

export const useFormTransformation = () => {
  const transformFormToDbFormat = (formData: PropertyFormValues, userId: string) => {
    // Ensure amenities is always an array
    const amenitiesArray = Array.isArray(formData.amenities) 
      ? formData.amenities 
      : formData.amenities ? [formData.amenities] : [];

    // Ensure utilities is always an array
    const utilitiesArray = Array.isArray(formData.utilities) 
      ? formData.utilities 
      : formData.utilities ? [formData.utilities] : [];

    // Ensure house_rules is always an array
    const houseRulesArray = Array.isArray(formData.house_rules) 
      ? formData.house_rules 
      : formData.house_rules ? [formData.house_rules] : [];

    // Transform the form data to match the database schema
    const propertyData = {
      owner_id: userId,
      title: formData.title || '',
      property_type: formData.type || '',
      property_category: formData.propertyCategory || 'Hostel',
      address: formData.address || '',
      city: formData.city || '',
      state: formData.region || 'Greater Accra', // Map region to state
      zip: formData.zip || '',
      rent: Number(formData.price) || 0,
      description: formData.description || '',
      bedrooms: Number(formData.bedrooms) || 1,
      bathrooms: Number(formData.bathrooms) || 1,
      available_from: new Date().toISOString().split('T')[0], // Default to today
      amenities: amenitiesArray,
      images: formData.images || [],
      is_available: formData.status === 'Available',
      
      // Enhanced property features
      total_rooms: formData.total_rooms || null,
      rooms_available: formData.rooms_available || null,
      beds_per_room: formData.beds_per_room || null,
      beds_available: formData.beds_available || null,
      max_occupants: formData.max_occupants || null,
      
      // Room features
      has_bedframes: formData.has_bedframes || false,
      has_mattresses: formData.has_mattresses || false,
      has_wardrobes: formData.has_wardrobes || false,
      has_fan: formData.has_fan || false,
      has_tiled_room: formData.has_tiled_room || false,
      has_individual_meters: formData.has_individual_meters || false,
      
      // Washroom and meter configurations
      washroom_type: formData.washroom_type || null,
      shared_washroom_count: formData.shared_washroom_count || null,
      meter_type: formData.meter_type || null,
      shared_meter_count: formData.shared_meter_count || null,
      
      // Payment and occupancy details
      advance_payment_months: formData.advance_payment_months || null,
      allow_bill_sharing: formData.allow_bill_sharing || false,
      
      // Enhanced features from EnhancedPropertyFields
      verification_status: formData.verification_status || 'pending',
      emergency_contact_name: formData.emergency_contact_name || null,
      emergency_contact_phone: formData.emergency_contact_phone || null,
      has_accessibility_features: formData.has_accessibility_features || false,
      pet_policy: formData.pet_policy || 'not_allowed',
      parking_available: formData.parking_available || false,
      parking_cost: formData.parking_cost || null,
      security_features: formData.security_features || [],
      internet_speed: formData.internet_speed || 'standard',
      gender_restriction: formData.gender_restriction || 'mixed',
      semester_availability: formData.semester_availability || [],
      cancellation_policy: formData.cancellation_policy || 'moderate',
      virtual_tour_url: formData.virtual_tour_url || null,
      
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

  const transformDbToFormValues = (dbData: any): Partial<PropertyFormValues> => {
    return {
      title: dbData.title || '',
      type: dbData.property_type || '',
      propertyCategory: dbData.property_category || 'Hostel',
      address: dbData.address || '',
      city: dbData.city || '',
      region: dbData.state || 'Greater Accra', // Map state back to region
      zip: dbData.zip || '',
      price: Number(dbData.rent) || 0,
      price_unit: 'semester',
      description: dbData.description || '',
      bedrooms: Number(dbData.bedrooms) || 1,
      bathrooms: Number(dbData.bathrooms) || 1,
      status: dbData.is_available ? 'Available' : 'Unavailable',
      all_inclusive: false,
      amenities: Array.isArray(dbData.amenities) ? dbData.amenities.join(', ') : '',
      images: dbData.images || [],
      
      // Enhanced property features
      total_rooms: dbData.total_rooms || undefined,
      rooms_available: dbData.rooms_available || undefined,
      beds_per_room: dbData.beds_per_room || undefined,
      beds_available: dbData.beds_available || undefined,
      max_occupants: dbData.max_occupants || undefined,
      
      // Room features
      has_bedframes: dbData.has_bedframes || false,
      has_mattresses: dbData.has_mattresses || false,
      has_wardrobes: dbData.has_wardrobes || false,
      has_fan: dbData.has_fan || false,
      has_tiled_room: dbData.has_tiled_room || false,
      has_individual_meters: dbData.has_individual_meters || false,
      
      // Washroom and meter configurations
      washroom_type: dbData.washroom_type || undefined,
      shared_washroom_count: dbData.shared_washroom_count || undefined,
      meter_type: dbData.meter_type || undefined,
      shared_meter_count: dbData.shared_meter_count || undefined,
      
      // Payment and occupancy details
      advance_payment_months: dbData.advance_payment_months || undefined,
      allow_bill_sharing: dbData.allow_bill_sharing || false,
      
      // Enhanced features
      verification_status: dbData.verification_status || 'pending',
      emergency_contact_name: dbData.emergency_contact_name || '',
      emergency_contact_phone: dbData.emergency_contact_phone || '',
      has_accessibility_features: dbData.has_accessibility_features || false,
      pet_policy: dbData.pet_policy || 'not_allowed',
      parking_available: dbData.parking_available || false,
      parking_cost: dbData.parking_cost || undefined,
      security_features: dbData.security_features || [],
      internet_speed: dbData.internet_speed || 'standard',
      gender_restriction: dbData.gender_restriction || 'mixed',
      semester_availability: dbData.semester_availability || [],
      cancellation_policy: dbData.cancellation_policy || 'moderate',
      virtual_tour_url: dbData.virtual_tour_url || '',
    };
  };

  return { transformFormToDbFormat, transformDbToFormValues };
};
