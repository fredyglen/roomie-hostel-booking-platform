
import { supabase } from '@/integrations/supabase/client';
import { Property, PropertyType, PropertyCategory } from '@/types/property';
import { PropertyQueries } from '@/services/database/standardizedQueries';

export const propertyService = {
  async getProperties(): Promise<Property[]> {
    try {
      const result = await PropertyQueries.getAvailableProperties({ limit: 50 });

      // Transform the data to match our Property interface
      return result.properties.map(property => {
        const profileData = Array.isArray(property.profiles) ? property.profiles[0] : property.profiles;
      
      return {
        id: property.id,
        owner_id: property.owner_id,
        name: property.title,
        title: property.title,
        description: property.description,
        address: property.address,
        city: property.city,
        state: property.state,
        zip: property.zip || '00000',
        rent: property.base_price_per_semester,
        price: property.base_price_per_semester,
        type: property.property_type as PropertyType,
        propertyCategory: property.property_category as PropertyCategory,
        verified: property.verification_status === 'verified',
        is_available: property.is_available,
        genderType: property.gender_type,
        maxOccupancy: property.max_occupancy,
        currentOccupancy: property.current_occupancy,
        images: property.images || [],
        amenities: property.amenities || [],
        location: `${property.city}, ${property.state}`,
        verificationStatus: property.verification_status,
        created_at: property.created_at,
        updated_at: property.updated_at,
        owner: profileData ? {
          id: 'unknown',
          name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || 'Property Owner',
          email: profileData.email || 'owner@example.com',
          phone: profileData.phone || '+233 50 123 4567',
          responseRate: '95%',
          verified: true
        } : {
          id: 'unknown',
          name: 'Property Owner',
          email: 'owner@example.com',
          phone: '+233 50 123 4567',
          responseRate: '95%',
          verified: true
        },
        house_rules: '',
        stories: [],
        features: []
      } as Property;
    });
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  },
  
  async getPropertyById(id: string): Promise<Property> {
    const { data, error } = await supabase
      .from('properties')
      .select(`*, profiles!owner_id (first_name, last_name, email, phone)`) 
      .eq('id', id)
      .single();
    if (error) throw error;
    
    const profileData = Array.isArray(data.profiles) ? data.profiles[0] : data.profiles;
    
    return {
      id: data.id,
      owner_id: data.owner_id,
      name: data.title,
      title: data.title,
      description: data.description,
      address: data.address,
      city: data.city,
      state: data.state,
      zip: data.zip || '00000',
      rent: data.rent,
      price: data.rent,
      type: data.property_type as PropertyType,
      propertyCategory: data.property_category as PropertyCategory,
      verified: data.verification_status === 'verified',
      is_available: data.is_available,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      images: data.images || [],
      amenities: data.amenities || [],
      location: `${data.city}, ${data.state}`,
      available_from: data.available_from,
      created_at: data.created_at,
      updated_at: data.updated_at,
      owner: profileData ? {
        id: 'unknown',
        name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || 'Property Owner',
        email: profileData.email || 'owner@example.com',
        phone: profileData.phone || '+233 50 123 4567',
        responseRate: '95%',
        verified: true
      } : {
        id: 'unknown',
        name: 'Property Owner',
        email: 'owner@example.com',
        phone: '+233 50 123 4567',
        responseRate: '95%',
        verified: true
      },
      house_rules: '',
      stories: [],
      features: []
    } as Property;
  },
  
  async createProperty(property: Omit<Property, 'id' | 'created_at' | 'updated_at'>): Promise<Property> {
    // Convert Property to database format
    const dbProperty = {
      title: property.title,
      description: property.description,
      address: property.address,
      city: property.city,
      state: property.state,
      zip: property.zip,
      rent: property.rent,
      property_type: property.type,
      property_category: property.propertyCategory,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      owner_id: property.owner_id,
      is_available: property.is_available,
      available_from: property.available_from,
      amenities: Array.isArray(property.amenities) ? property.amenities as string[] : [],
      images: property.images
    };
    
    const { data, error } = await supabase
      .from('properties')
      .insert([dbProperty])
      .select()
      .single();
    if (error) throw error;
    return data as Property;
  },
  
  async updateProperty(id: string, updates: Partial<Property>): Promise<Property> {
    // Convert Property updates to database format
    const dbUpdates: Record<string, any> = {};
    
    if (updates.title) dbUpdates.title = updates.title;
    if (updates.description) dbUpdates.description = updates.description;
    if (updates.address) dbUpdates.address = updates.address;
    if (updates.city) dbUpdates.city = updates.city;
    if (updates.state) dbUpdates.state = updates.state;
    if (updates.zip) dbUpdates.zip = updates.zip;
    if (updates.rent) dbUpdates.rent = updates.rent;
    if (updates.type) dbUpdates.property_type = updates.type;
    if (updates.propertyCategory) dbUpdates.property_category = updates.propertyCategory;
    if (updates.bedrooms) dbUpdates.bedrooms = updates.bedrooms;
    if (updates.bathrooms) dbUpdates.bathrooms = updates.bathrooms;
    if (updates.is_available !== undefined) dbUpdates.is_available = updates.is_available;
    if (updates.available_from) dbUpdates.available_from = updates.available_from;
    if (updates.amenities) dbUpdates.amenities = Array.isArray(updates.amenities) ? updates.amenities as string[] : [];
    if (updates.images) dbUpdates.images = updates.images;
    
    const { data, error } = await supabase
      .from('properties')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Property;
  },
  
  async deleteProperty(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },
}; 
