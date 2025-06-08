import { supabase } from '@/lib/supabase';
import { Property } from '@/types/property';

export const propertyService = {
  async getProperties() {
    const { data, error } = await supabase
      .from('properties')
      .select(`*, profiles!owner_id (first_name, last_name, email, phone)`) 
      .eq('is_available', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Property[];
  },
  async getPropertyById(id: string) {
    const { data, error } = await supabase
      .from('properties')
      .select(`*, profiles!owner_id (first_name, last_name, email, phone)`) 
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as Property;
  },
  async createProperty(property: Partial<Property>) {
    const { data, error } = await supabase
      .from('properties')
      .insert([property])
      .single();
    if (error) throw error;
    return data as Property;
  },
  async updateProperty(id: string, updates: Partial<Property>) {
    const { data, error } = await supabase
      .from('properties')
      .update(updates)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as Property;
  },
  async deleteProperty(id: string) {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },
}; 