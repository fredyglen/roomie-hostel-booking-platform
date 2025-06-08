import { supabase } from '@/lib/supabase';
import { User } from '@/types/common';

export const userService = {
  async getUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');
    if (error) throw error;
    return data as User[];
  },
  async getUserById(id: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as User;
  },
  async createUser(user: Partial<User>) {
    const { data, error } = await supabase
      .from('profiles')
      .insert([user])
      .single();
    if (error) throw error;
    return data as User;
  },
  async updateUser(id: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as User;
  },
  async deleteUser(id: string) {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },
}; 