
import { supabase } from '@/lib/supabase';

// Define a simplified booking interface that matches our database
interface SimpleBooking {
  id: string;
  property_id: string;
  student_id: string;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const bookingService = {
  async getBookings(): Promise<SimpleBooking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*');
    if (error) throw error;
    return data as SimpleBooking[];
  },
  
  async getBookingById(id: string): Promise<SimpleBooking> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as SimpleBooking;
  },
  
  async createBooking(booking: Partial<SimpleBooking>): Promise<SimpleBooking> {
    const { data, error } = await supabase
      .from('bookings')
      .insert([booking])
      .select()
      .single();
    if (error) throw error;
    return data as SimpleBooking;
  },
  
  async updateBooking(id: string, updates: Partial<SimpleBooking>): Promise<SimpleBooking> {
    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as SimpleBooking;
  },
  
  async deleteBooking(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },
}; 
