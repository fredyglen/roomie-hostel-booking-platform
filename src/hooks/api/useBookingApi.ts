import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '@/services/bookingService';
import { Booking } from '@/types/booking';

export function useBookingApi() {
  const queryClient = useQueryClient();

  const bookingsQuery = useQuery({
    queryKey: ['bookings'],
    queryFn: bookingService.getBookings,
  });

  const createBooking = useMutation({
    mutationFn: bookingService.createBooking,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }),
  });

  const updateBooking = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Booking> }) => bookingService.updateBooking(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }),
  });

  const deleteBooking = useMutation({
    mutationFn: bookingService.deleteBooking,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }),
  });

  return {
    bookings: bookingsQuery.data,
    isLoading: bookingsQuery.isLoading,
    error: bookingsQuery.error,
    createBooking: createBooking.mutateAsync,
    updateBooking: updateBooking.mutateAsync,
    deleteBooking: deleteBooking.mutateAsync,
  };
} 