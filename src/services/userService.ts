
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
    // For creating users, we rely on Supabase auth trigger to handle profile creation
    // This method is primarily for direct profile updates if needed
    const { data: { user: authUser }, error: authError } = await supabase.auth.signUp({
      email: user.email,
      password: 'temp-password', // This should be handled properly in a real auth flow
      options: {
        data: {
          first_name: user.firstName,
          last_name: user.lastName,
          phone: user.phone,
          role: user.role
        }
      }
    });

    if (authError) throw authError;
    if (!authUser) throw new Error('Failed to create user');

    // Return the created user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (profileError) throw profileError;
    return profile as User;
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
