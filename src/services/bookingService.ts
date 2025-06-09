import { supabase } from '@/lib/supabase';
import { Booking } from '@/types/booking';

export const bookingService = {
  async getBookings() {
    const { data, error } = await supabase
      .from('bookings')
      .select('*');
    if (error) throw error;
    return data as Booking[];
  },
  async getBookingById(id: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as Booking;
  },
  async createBooking(booking: Partial<Booking>) {
    const { data, error } = await supabase
      .from('bookings')
      .insert([booking])
      .single();
    if (error) throw error;
    return data as Booking;
  },
  async updateBooking(id: string, updates: Partial<Booking>) {
    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as Booking;
  },
  async deleteBooking(id: string) {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },
}; 