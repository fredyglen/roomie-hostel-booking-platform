
import { PropertyFormValues, PropertyInsert } from '@/types/property';

// Function to transform form values to database format
export const useFormTransformation = () => {
  // Transform form values to database format
  const transformFormToDbFormat = (formValues: PropertyFormValues, ownerId: string): PropertyInsert => {
    // Parse string arrays from newline-separated text
    const amenitiesArray = formValues.amenities ? 
      formValues.amenities.split('\n').filter(item => item.trim() !== '') : 
      [];
      
    const houseRulesArray = formValues.house_rules ? 
      formValues.house_rules.split('\n').filter(item => item.trim() !== '') : 
      [];
      
    const utilitiesArray = formValues.utilities ? 
      formValues.utilities.split('\n').filter(item => item.trim() !== '') : 
      [];

    // Create date string for available_from
    const availableFrom = new Date().toISOString().split('T')[0];

    return {
      owner_id: ownerId,
      title: formValues.title,
      property_type: formValues.type,
      property_category: formValues.propertyCategory,
      rent: formValues.price,
      address: formValues.address,
      city: formValues.city,
      state: formValues.state,
      zip: formValues.zip,
      bedrooms: formValues.bedrooms,
      bathrooms: formValues.bathrooms,
      available_from: availableFrom,
      is_available: formValues.status === 'Available',
      description: formValues.description,
      amenities: amenitiesArray,
      house_rules: houseRulesArray,
      utilities: utilitiesArray,
      distance_to_campus: formValues.distance_to_campus,
      all_inclusive: formValues.all_inclusive,
      location: formValues.location,
      landmark: formValues.landmark,
      total_rooms: formValues.total_rooms,
      rooms_available: formValues.rooms_available,
      beds_per_room: formValues.beds_per_room,
      beds_available: formValues.beds_available,
      max_occupants: formValues.max_occupants,
      has_bedframes: formValues.has_bedframes,
      has_mattresses: formValues.has_mattresses,
      has_wardrobes: formValues.has_wardrobes,
      has_individual_meters: formValues.has_individual_meters,
      advance_payment_months: formValues.advance_payment_months,
      allow_bill_sharing: formValues.allow_bill_sharing,
    };
  };

  // Transform database format to form values
  const transformDbToFormValues = (dbData: any): PropertyFormValues => {
    return {
      title: dbData.title || '',
      type: dbData.property_type || '',
      propertyCategory: dbData.property_category || 'Hostel',
      address: dbData.address || '',
      city: dbData.city || 'Accra',
      state: dbData.state || 'Greater Accra',
      zip: dbData.zip || '00000',
      price: dbData.rent || 0,
      price_unit: 'semester',
      description: dbData.description || '',
      status: dbData.is_available ? 'Available' : 'Fully Occupied',
      amenities: dbData.amenities?.join('\n') || '',
      house_rules: dbData.house_rules?.join('\n') || '',
      utilities: dbData.utilities?.join('\n') || '',
      all_inclusive: dbData.all_inclusive || false,
      bedrooms: dbData.bedrooms || 1,
      bathrooms: dbData.bathrooms || 1,
      total_rooms: dbData.total_rooms || 1,
      rooms_available: dbData.rooms_available || 1,
      beds_per_room: dbData.beds_per_room || 1,
      beds_available: dbData.beds_available || 1,
      max_occupants: dbData.max_occupants || 1,
      has_bedframes: dbData.has_bedframes || false,
      has_mattresses: dbData.has_mattresses || false,
      has_wardrobes: dbData.has_wardrobes || false,
      has_individual_meters: dbData.has_individual_meters || false,
      advance_payment_months: dbData.advance_payment_months || 12,
      allow_bill_sharing: dbData.allow_bill_sharing || false,
      landmark: dbData.landmark || '',
      location: dbData.location || '',
      distance_to_campus: dbData.distance_to_campus || '',
      image_url: dbData.image_url || (dbData.images && dbData.images.length > 0 ? dbData.images[0] : ''),
      occupancy: dbData.occupancy || '0/1',
    };
  };

  return {
    transformFormToDbFormat,
    transformDbToFormValues
  };
};
