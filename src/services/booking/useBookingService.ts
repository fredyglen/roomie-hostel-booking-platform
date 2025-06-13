
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Booking } from '@/types/booking';
import { ErrorHandler } from '@/utils/ErrorHandler';

interface CreateBookingData {
  property_id: string;
  start_date: string;
  end_date: string;
  guest_count: number;
  special_requests?: string;
  total_amount: number;
}

export const useBookingService = () => {
  const queryClient = useQueryClient();

  const createBooking = useMutation({
    mutationFn: async (bookingData: CreateBookingData): Promise<Booking> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('bookings_enhanced')
        .insert({
          student_id: user.id,
          property_id: bookingData.property_id,
          check_in_date: bookingData.start_date,
          check_out_date: bookingData.end_date,
          total_amount: bookingData.total_amount,
          special_requests: bookingData.special_requests,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return data as unknown as Booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error) => {
      ErrorHandler.handle(error, 'Failed to create booking');
    }
  });

  const getBookings = useQuery({
    queryKey: ['bookings'],
    queryFn: async (): Promise<Booking[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('bookings_enhanced')
        .select('*')
        .eq('student_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as unknown as Booking[];
    }
  });

  return {
    createBooking,
    getBookings,
    isLoading: createBooking.isPending || getBookings.isLoading,
    error: createBooking.error || getBookings.error
  };
};
