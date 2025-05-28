
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
    };
  };

  return { transformFormToDbFormat, transformDbToFormValues };
};
