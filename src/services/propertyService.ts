
import { supabase } from '@/lib/supabase';
import { Property, PropertyType, PropertyCategory } from '@/types/property';

export const propertyService = {
  async getProperties(): Promise<Property[]> {
    const { data, error } = await supabase
      .from('properties')
      .select(`*, profiles!owner_id (first_name, last_name, email, phone)`) 
      .eq('is_available', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    
    // Transform the data to match our Property interface
    return (data || []).map(property => {
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
        rent: property.rent,
        price: property.rent,
        type: property.property_type as PropertyType,
        propertyCategory: property.property_category as PropertyCategory,
        verified: property.verification_status === 'verified',
        is_available: property.is_available,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        images: property.images || [],
        amenities: property.amenities || [],
        location: `${property.city}, ${property.state}`,
        available_from: property.available_from,
        created_at: property.created_at,
        updated_at: property.updated_at,
        owner: profileData ? {
          id: profileData.id || 'unknown',
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
        house_rules: property.house_rules || '',
        stories: [],
        features: []
      } as Property;
    });
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
        id: profileData.id || 'unknown',
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
      house_rules: data.house_rules || '',
      stories: [],
      features: []
    } as Property;
  },
  
  async createProperty(property: Partial<Property>): Promise<Property> {
    const { data, error } = await supabase
      .from('properties')
      .insert([property])
      .select()
      .single();
    if (error) throw error;
    return data as Property;
  },
  
  async updateProperty(id: string, updates: Partial<Property>): Promise<Property> {
    const { data, error } = await supabase
      .from('properties')
      .update(updates)
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
