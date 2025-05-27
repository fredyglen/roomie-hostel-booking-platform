
import { Property, PropertyFormValues, PropertyInsert } from '@/types/property';

export const useFormTransformation = () => {
  const transformDbToFormValues = (property: Property): PropertyFormValues => {
    return {
      // Required fields with proper defaults
      title: property.title || '',
      type: property.type || property.property_type || '',
      propertyCategory: property.propertyCategory || property.property_category || 'Hostel',
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
      
      // Optional fields
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
  };

  const transformFormToDbFormat = (formData: PropertyFormValues, ownerId: string): PropertyInsert => {
    const amenitiesArray = formData.amenities 
      ? formData.amenities.split('\n').map(item => item.trim()).filter(Boolean)
      : [];
    
    const houseRulesArray = formData.house_rules 
      ? formData.house_rules.split('\n').map(item => item.trim()).filter(Boolean)
      : [];
    
    const utilitiesArray = formData.utilities 
      ? formData.utilities.split('\n').map(item => item.trim()).filter(Boolean)
      : [];

    return {
      owner_id: ownerId,
      title: formData.title,
      property_type: formData.type,
      property_category: formData.propertyCategory,
      rent: formData.price,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      bedrooms: formData.bedrooms,
      bathrooms: formData.bathrooms,
      available_from: new Date().toISOString().split('T')[0],
      description: formData.description,
      amenities: amenitiesArray,
      images: formData.images || [],
      is_available: formData.status === 'available',
      distance_to_campus: formData.distance_to_campus,
      house_rules: houseRulesArray,
      all_inclusive: formData.all_inclusive,
      utilities: utilitiesArray,
      location: formData.location,
      landmark: formData.landmark,
      total_rooms: formData.total_rooms,
      rooms_available: formData.rooms_available,
      beds_per_room: formData.beds_per_room,
      beds_available: formData.beds_available,
      max_occupants: formData.max_occupants,
      has_bedframes: formData.has_bedframes,
      has_mattresses: formData.has_mattresses,
      has_wardrobes: formData.has_wardrobes,
      has_individual_meters: formData.has_individual_meters,
      advance_payment_months: formData.advance_payment_months,
      allow_bill_sharing: formData.allow_bill_sharing,
    };
  };

  return {
    transformDbToFormValues,
    transformFormToDbFormat,
  };
};
