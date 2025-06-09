
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
    // Since we can't auto-generate the id in the client, we'll let Supabase handle it
    // by not including the id field at all in the insert
    const userData = {
      email: user.email,
      role: user.role,
      first_name: user.firstName || null,
      last_name: user.lastName || null,
      phone: user.phone || null,
      avatar_url: user.avatarUrl || null
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
    // Map the User type fields to database fields
    const updateData: any = {};
    if (updates.email) updateData.email = updates.email;
    if (updates.role) updateData.role = updates.role;
    if (updates.firstName) updateData.first_name = updates.firstName;
    if (updates.lastName) updateData.last_name = updates.lastName;
    if (updates.phone) updateData.phone = updates.phone;
    if (updates.avatarUrl) updateData.avatar_url = updates.avatarUrl;

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
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
