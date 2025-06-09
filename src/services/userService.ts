
import { supabase } from '@/lib/supabase';
import { User } from '@/types/common';

export const userService = {
  async getUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');
    if (error) throw error;
    return data as User[];
  },
  
  async getUserById(id: string): Promise<User> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as User;
  },
  
  async createUser(user: Omit<User, 'id' | 'created_at'>): Promise<User> {
    // Ensure all required fields are present for the database
    const userData = {
      email: user.email,
      role: user.role,
      first_name: user.first_name || null,
      last_name: user.last_name || null,
      phone: user.phone || null,
      avatar_url: user.avatar_url || null
    };

    const { data, error } = await supabase
      .from('profiles')
      .insert([userData])
      .select()
      .single();
    if (error) throw error;
    return data as User;
  },
  
  async updateUser(id: string, updates: Partial<Omit<User, 'id' | 'created_at'>>): Promise<User> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as User;
  },
  
  async deleteUser(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },
};
