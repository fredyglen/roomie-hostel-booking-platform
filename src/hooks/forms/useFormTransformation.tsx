import { PropertyFormValues } from '@/components/owner/property-form/PropertyFormSchema';
import { useCallback } from 'react';
import { ErrorHandler } from '@/utils/ErrorHandler';

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

  const transformDbToFormValues = (dbData: Record<string, unknown>): Partial<PropertyFormValues> => {
    return {
      title: typeof dbData.title === 'string' ? dbData.title : '',
      type: typeof dbData.property_type === 'string' ? dbData.property_type : '',
      propertyCategory: typeof dbData.property_category === 'string' ? dbData.property_category as 'Hostel' | 'Homestel' | 'Apartment' : 'Hostel',
      address: typeof dbData.address === 'string' ? dbData.address : '',
      city: typeof dbData.city === 'string' ? dbData.city : '',
      region: typeof dbData.state === 'string' ? dbData.state as any : 'Greater Accra',
      zip: typeof dbData.zip === 'string' ? dbData.zip : '',
      price: typeof dbData.rent === 'number' ? dbData.rent : 0,
      price_unit: 'semester',
      description: typeof dbData.description === 'string' ? dbData.description : '',
      bedrooms: typeof dbData.bedrooms === 'number' ? dbData.bedrooms : 1,
      bathrooms: typeof dbData.bathrooms === 'number' ? dbData.bathrooms : 1,
      status: dbData.is_available ? 'Available' : 'Unavailable',
      all_inclusive: false,
      amenities: Array.isArray(dbData.amenities) ? dbData.amenities.join(', ') : '',
      images: Array.isArray(dbData.images) ? dbData.images as string[] : [],
      
      // Enhanced property features
      total_rooms: typeof dbData.total_rooms === 'number' ? dbData.total_rooms : undefined,
      rooms_available: typeof dbData.rooms_available === 'number' ? dbData.rooms_available : undefined,
      beds_per_room: typeof dbData.beds_per_room === 'number' ? dbData.beds_per_room : undefined,
      beds_available: typeof dbData.beds_available === 'number' ? dbData.beds_available : undefined,
      max_occupants: typeof dbData.max_occupants === 'number' ? dbData.max_occupants : undefined,
      
      // Room features
      has_bedframes: typeof dbData.has_bedframes === 'boolean' ? dbData.has_bedframes : false,
      has_mattresses: typeof dbData.has_mattresses === 'boolean' ? dbData.has_mattresses : false,
      has_wardrobes: typeof dbData.has_wardrobes === 'boolean' ? dbData.has_wardrobes : false,
      has_fan: typeof dbData.has_fan === 'boolean' ? dbData.has_fan : false,
      has_tiled_room: typeof dbData.has_tiled_room === 'boolean' ? dbData.has_tiled_room : false,
      has_individual_meters: typeof dbData.has_individual_meters === 'boolean' ? dbData.has_individual_meters : false,
      
      // Washroom and meter configurations
      washroom_type: typeof dbData.washroom_type === 'string' && isWashroomType(dbData.washroom_type) ? dbData.washroom_type : undefined,
      shared_washroom_count: typeof dbData.shared_washroom_count === 'number' ? dbData.shared_washroom_count : undefined,
      meter_type: typeof dbData.meter_type === 'string' && isMeterType(dbData.meter_type) ? dbData.meter_type : undefined,
      shared_meter_count: typeof dbData.shared_meter_count === 'number' ? dbData.shared_meter_count : undefined,
      
      // Payment and occupancy details
      advance_payment_months: typeof dbData.advance_payment_months === 'number' ? dbData.advance_payment_months : undefined,
      allow_bill_sharing: typeof dbData.allow_bill_sharing === 'boolean' ? dbData.allow_bill_sharing : false,
      
      // Enhanced features
      verification_status: typeof dbData.verification_status === 'string' && isVerificationStatus(dbData.verification_status) ? dbData.verification_status : 'pending',
      emergency_contact_name: typeof dbData.emergency_contact_name === 'string' ? dbData.emergency_contact_name : '',
      emergency_contact_phone: typeof dbData.emergency_contact_phone === 'string' ? dbData.emergency_contact_phone : '',
      has_accessibility_features: typeof dbData.has_accessibility_features === 'boolean' ? dbData.has_accessibility_features : false,
      pet_policy: typeof dbData.pet_policy === 'string' && isPetPolicy(dbData.pet_policy) ? dbData.pet_policy : 'not_allowed',
      parking_available: typeof dbData.parking_available === 'boolean' ? dbData.parking_available : false,
      parking_cost: typeof dbData.parking_cost === 'number' ? dbData.parking_cost : undefined,
      security_features: Array.isArray(dbData.security_features) ? dbData.security_features as string[] : [],
      internet_speed: typeof dbData.internet_speed === 'string' && isInternetSpeed(dbData.internet_speed) ? dbData.internet_speed : 'standard',
      gender_restriction: typeof dbData.gender_restriction === 'string' && isGenderRestriction(dbData.gender_restriction) ? dbData.gender_restriction : 'mixed',
      semester_availability: Array.isArray(dbData.semester_availability)
        ? (dbData.semester_availability as unknown[]).filter(isSemesterAvailability)
        : [],
      cancellation_policy: typeof dbData.cancellation_policy === 'string' && isCancellationPolicy(dbData.cancellation_policy) ? dbData.cancellation_policy : 'moderate',
      virtual_tour_url: typeof dbData.virtual_tour_url === 'string' ? dbData.virtual_tour_url : '',
    };
  };

  const transformFormData = useCallback((formData: Record<string, unknown>) => {
    try {
      // ... transformation logic ...
      // logger.info('Form data', formData);
      return formData;
    } catch (error) {
      // logger.error('Form transformation error:', error);
      ErrorHandler.handle(error, 'useFormTransformation.transformFormData');
      return {};
    }
  }, []);

  return { transformFormToDbFormat, transformDbToFormValues, transformFormData };
};

// Type guards for string literal unions
const isWashroomType = (val: unknown): val is 'inside' | 'outside' | 'shared' =>
  val === 'inside' || val === 'outside' || val === 'shared';
const isMeterType = (val: unknown): val is 'shared' | 'self' =>
  val === 'shared' || val === 'self';
const isVerificationStatus = (val: unknown): val is 'pending' | 'verified' | 'rejected' =>
  val === 'pending' || val === 'verified' || val === 'rejected';
const isPetPolicy = (val: unknown): val is 'not_allowed' | 'allowed' | 'cats_only' | 'small_pets' =>
  val === 'not_allowed' || val === 'allowed' || val === 'cats_only' || val === 'small_pets';
const isInternetSpeed = (val: unknown): val is 'basic' | 'standard' | 'high_speed' | 'fiber' =>
  val === 'basic' || val === 'standard' || val === 'high_speed' || val === 'fiber';
const isGenderRestriction = (val: unknown): val is 'male' | 'female' | 'mixed' =>
  val === 'male' || val === 'female' || val === 'mixed';
const isSemesterAvailability = (val: unknown): val is 'semester_1' | 'semester_2' | 'year_round' =>
  val === 'semester_1' || val === 'semester_2' || val === 'year_round';
const isCancellationPolicy = (val: unknown): val is 'flexible' | 'moderate' | 'strict' =>
  val === 'flexible' || val === 'moderate' || val === 'strict';
