
import { Property, PropertyFormValues, PropertyInsert } from '@/types/property';

export const useFormTransformation = () => {
  const transformDbToFormValues = (property: Property): PropertyFormValues => {
    // Ensure all required fields have proper values, not just defaults
    const formValues: PropertyFormValues = {
      // Required fields - ensure they always have values
      title: property.title || '',
      type: property.type || property.property_type || '',
      propertyCategory: (property.propertyCategory || property.property_category || 'Hostel') as 'Hostel' | 'Homestel' | 'Apartment',
      address: property.address || '',
      city: property.city || '',
      state: property.state || '',
      zip: property.zip || '',
      price: property.price || property.rent || 0,
      price_unit: property.priceUnit || property.price_unit || 'month',
      description: property.description || '',
      status: property.status || 'available',
      bedrooms: property.bedrooms || 1,
      bathrooms: property.bathrooms || 1,
      all_inclusive: property.allInclusive || property.all_inclusive || false,
      
      // Optional fields with defaults
      distance_to_campus: property.distanceToCampus || property.distance_to_campus || '',
      amenities: Array.isArray(property.amenities) 
        ? property.amenities.join('\n') 
        : property.amenities || '',
      house_rules: Array.isArray(property.house_rules) 
        ? property.house_rules.join('\n') 
        : property.house_rules || '',
      occupancy: property.occupancy || '',
      image_url: property.image_url || '',
      images: property.images || [],
      utilities: Array.isArray(property.utilities) 
        ? property.utilities.join('\n') 
        : property.utilities || '',
      location: property.location || '',
      landmark: property.landmark || '',
      total_rooms: property.total_rooms || 0,
      rooms_available: property.rooms_available || 0,
      beds_per_room: property.beds_per_room || 1,
      beds_available: property.beds_available || 0,
      max_occupants: property.max_occupants || 1,
      has_bedframes: property.has_bedframes || false,
      has_mattresses: property.has_mattresses || false,
      has_wardrobes: property.has_wardrobes || false,
      has_individual_meters: property.has_individual_meters || false,
      advance_payment_months: property.advance_payment_months || 1,
      allow_bill_sharing: property.allow_bill_sharing || false,
    };

    return formValues;
  };

  const transformFormToDbFormat = (formData: any, ownerId: string): PropertyInsert => {
    // Create a safe form data object with all required fields
    const safeFormData: PropertyFormValues = {
      title: formData.title || '',
      type: formData.type || '',
      propertyCategory: formData.propertyCategory || 'Hostel',
      address: formData.address || '',
      city: formData.city || '',
      state: formData.state || '',
      zip: formData.zip || '',
      price: Number(formData.price) || 0,
      price_unit: formData.price_unit || 'month',
      description: formData.description || '',
      status: formData.status || 'available',
      bedrooms: Number(formData.bedrooms) || 1,
      bathrooms: Number(formData.bathrooms) || 1,
      all_inclusive: Boolean(formData.all_inclusive),
      distance_to_campus: formData.distance_to_campus || '',
      amenities: formData.amenities || '',
      house_rules: formData.house_rules || '',
      occupancy: formData.occupancy || '',
      image_url: formData.image_url || '',
      images: formData.images || [],
      utilities: formData.utilities || '',
      location: formData.location || '',
      landmark: formData.landmark || '',
      total_rooms: Number(formData.total_rooms) || 0,
      rooms_available: Number(formData.rooms_available) || 0,
      beds_per_room: Number(formData.beds_per_room) || 1,
      beds_available: Number(formData.beds_available) || 0,
      max_occupants: Number(formData.max_occupants) || 1,
      has_bedframes: Boolean(formData.has_bedframes),
      has_mattresses: Boolean(formData.has_mattresses),
      has_wardrobes: Boolean(formData.has_wardrobes),
      has_individual_meters: Boolean(formData.has_individual_meters),
      advance_payment_months: Number(formData.advance_payment_months) || 1,
      allow_bill_sharing: Boolean(formData.allow_bill_sharing),
    };

    const amenitiesArray = safeFormData.amenities 
      ? safeFormData.amenities.split('\n').map(item => item.trim()).filter(Boolean)
      : [];
    
    const houseRulesArray = safeFormData.house_rules 
      ? safeFormData.house_rules.split('\n').map(item => item.trim()).filter(Boolean)
      : [];
    
    const utilitiesArray = safeFormData.utilities 
      ? safeFormData.utilities.split('\n').map(item => item.trim()).filter(Boolean)
      : [];

    return {
      owner_id: ownerId,
      title: safeFormData.title,
      property_type: safeFormData.type,
      property_category: safeFormData.propertyCategory,
      rent: safeFormData.price,
      address: safeFormData.address,
      city: safeFormData.city,
      state: safeFormData.state,
      zip: safeFormData.zip,
      bedrooms: safeFormData.bedrooms,
      bathrooms: safeFormData.bathrooms,
      available_from: new Date().toISOString().split('T')[0],
      description: safeFormData.description,
      amenities: amenitiesArray,
      images: safeFormData.images || [],
      is_available: safeFormData.status === 'available',
      distance_to_campus: safeFormData.distance_to_campus,
      house_rules: houseRulesArray,
      all_inclusive: safeFormData.all_inclusive,
      utilities: utilitiesArray,
      location: safeFormData.location,
      landmark: safeFormData.landmark,
      total_rooms: safeFormData.total_rooms,
      rooms_available: safeFormData.rooms_available,
      beds_per_room: safeFormData.beds_per_room,
      beds_available: safeFormData.beds_available,
      max_occupants: safeFormData.max_occupants,
      has_bedframes: safeFormData.has_bedframes,
      has_mattresses: safeFormData.has_mattresses,
      has_wardrobes: safeFormData.has_wardrobes,
      has_individual_meters: safeFormData.has_individual_meters,
      advance_payment_months: safeFormData.advance_payment_months,
      allow_bill_sharing: safeFormData.allow_bill_sharing,
    };
  };

  return {
    transformDbToFormValues,
    transformFormToDbFormat,
  };
};
