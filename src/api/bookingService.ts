import { supabase } from '@/integrations/supabase/client';
import { TABLE_NAMES } from '@/services/database/standardizedQueries';
import {
  Booking,
  BookingInsert,
  BookingUpdate,
  BookingStatus,
  PaymentStatus
} from '@/types/BookingTypes';
import { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/CommonTypes';
import { logger } from '@/utils/enhanced-logger';

// Get all bookings with pagination
export async function getBookings(
  params: PaginationParams & { 
    status?: BookingStatus;
    propertyId?: string;
    studentId?: string;
  } = { page: 1, pageSize: 10 }
): Promise<ApiResponse<PaginatedResponse<Booking>>> {
  try {
    const { page = 1, pageSize = 10, status, propertyId, studentId } = params;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from(TABLE_NAMES.BOOKINGS)
      .select('*, property:property_id(*), student:student_id(*)', { count: 'exact' });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    if (propertyId) {
      query = query.eq('property_id', propertyId);
    }
    if (studentId) {
      query = query.eq('student_id', studentId);
    }

    const { data, error, count } = await query
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return {
      status: 'success',
      data: {
        data: data as Booking[],
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize)
      }
    };
  } catch (error) {
    return {
      status: 'error',
      error: {
        message: 'Failed to fetch bookings',
        details: error
      }
    };
  }
}

// Get a single booking by ID
export async function getBookingById(id: string): Promise<ApiResponse<Booking>> {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAMES.BOOKINGS)
      .select('*, property:property_id(*), student:student_id(*)')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return {
      status: 'success',
      data: data as Booking
    };
  } catch (error) {
    return {
      status: 'error',
      error: {
        message: 'Failed to fetch booking',
        details: error
      }
    };
  }
}

// Create a new booking
export async function createBooking(booking: BookingInsert): Promise<ApiResponse<Booking>> {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAMES.BOOKINGS)
      .insert(booking)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      status: 'success',
      data: data as Booking
    };
  } catch (error) {
    return {
      status: 'error',
      error: {
        message: 'Failed to create booking',
        details: error
      }
    };
  }
}

// Update an existing booking
export async function updateBooking(
  id: string, 
  booking: BookingUpdate
): Promise<ApiResponse<Booking>> {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAMES.BOOKINGS)
      .update(booking)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      status: 'success',
      data: data as Booking
    };
  } catch (error) {
    return {
      status: 'error',
      error: {
        message: 'Failed to update booking',
        details: error
      }
    };
  }
}

// Cancel a booking
export async function cancelBooking(id: string, reason?: string): Promise<ApiResponse<Booking>> {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAMES.BOOKINGS)
      .update({
        status: 'CANCELLED',
        notes: reason ? `Cancelled: ${reason}` : 'Cancelled by user'
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      status: 'success',
      data: data as Booking
    };
  } catch (error) {
    return {
      status: 'error',
      error: {
        message: 'Failed to cancel booking',
        details: error
      }
    };
  }
}

// Update booking payment status
export async function updateBookingPaymentStatus(
  id: string, 
  paymentStatus: PaymentStatus,
  paymentDetails?: Record<string, unknown>
): Promise<ApiResponse<Booking>> {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAMES.BOOKINGS)
      .update({
        payment_status: paymentStatus,
        payment_details: paymentDetails
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      status: 'success',
      data: data as Booking
    };
  } catch (error) {
    return {
      status: 'error',
      error: {
        message: 'Failed to update booking payment status',
        details: error
      }
    };
  }
}

// Get bookings by student ID
export async function getBookingsByStudentId(
  studentId: string,
  params: PaginationParams = { page: 1, pageSize: 10 }
): Promise<ApiResponse<PaginatedResponse<Booking>>> {
  try {
    const { page = 1, pageSize = 10 } = params;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from(TABLE_NAMES.BOOKINGS)
      .select('*, property:property_id(*)', { count: 'exact' })
      .eq('student_id', studentId)
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return {
      status: 'success',
      data: {
        data: data as Booking[],
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize)
      }
    };
  } catch (error) {
    return {
      status: 'error',
      error: {
        message: 'Failed to fetch bookings by student',
        details: error
      }
    };
  }
}

// Get bookings by property ID
export async function getBookingsByPropertyId(
  propertyId: string,
  params: PaginationParams = { page: 1, pageSize: 10 }
): Promise<ApiResponse<PaginatedResponse<Booking>>> {
  try {
    const { page = 1, pageSize = 10 } = params;
    const offset = (page - 1) * pageSize;

    const { data, error, count } = await supabase
      .from(TABLE_NAMES.BOOKINGS)
      .select('*', { count: 'exact' })
      .eq('property_id', propertyId)
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (error) {
      logger.error('Error fetching bookings by property ID', { error, propertyId });
      return {
        status: 'error',
        error: {
          message: error.message,
          details: error
        }
      };
    }

    return {
      status: 'success',
      data: {
        data: (data || []) as Booking[],
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize)
      }
    };
  } catch (error) {
    logger.error('Unexpected error fetching bookings by property ID', { error, propertyId });
    return {
      status: 'error',
      error: {
        message: 'An unexpected error occurred while fetching bookings',
        details: error
      }
    };
  }
}