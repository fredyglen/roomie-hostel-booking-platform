/**
 * Real-Time Bed Availability Service
 * 
 * PRODUCTION-GRADE real-time bed availability tracking system.
 * Provides accurate, live updates on bed occupancy status.
 * Critical for preventing overbooking and providing accurate availability.
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/enhanced-logger';

export interface BedAvailabilityStatus {
  readonly propertyId: string;
  readonly totalBeds: number;
  readonly availableBeds: number;
  readonly occupiedBeds: number;
  readonly pendingBookings: number;
  readonly occupancyRate: number;
  readonly status: 'free' | 'moderate' | 'filling_up' | 'full';
  readonly lastUpdated: Date;
}

export interface RoomTypeBedAvailability {
  readonly roomType: string;
  readonly totalBeds: number;
  readonly availableBeds: number;
  readonly occupiedBeds: number;
  readonly pendingBookings: number;
  readonly occupancyRate: number;
  readonly status: 'free' | 'moderate' | 'filling_up' | 'full';
}

export interface PropertyBedAvailability {
  readonly propertyId: string;
  readonly overall: BedAvailabilityStatus;
  readonly byRoomType: readonly RoomTypeBedAvailability[];
  readonly lastUpdated: Date;
}

/**
 * ✅ PRODUCTION-GRADE: Get real-time bed availability for a property
 */
export async function getRealTimeBedAvailability(propertyId: string): Promise<PropertyBedAvailability> {
  try {
    logger.info('Fetching real-time bed availability', { propertyId });

    // Fetch rooms with bed counts and current occupancy
    const { data: rooms, error: roomsError } = await supabase
      .from('rooms')
      .select(`
        id,
        room_type,
        bed_count,
        beds_available
      `)
      .eq('property_id', propertyId);

    if (roomsError) {
      logger.error('Failed to fetch rooms data', { propertyId, error: roomsError });
      throw new Error(`Failed to fetch rooms data: ${roomsError.message}`);
    }

    // Fetch pending bookings that affect availability
    const { data: pendingBookings, error: bookingsError } = await supabase
      .from('bookings')
      .select(`
        id,
        room_type,
        status
      `)
      .eq('property_id', propertyId)
      .in('status', ['pending', 'confirmed', 'checked_in']);

    if (bookingsError) {
      logger.warn('Failed to fetch pending bookings', { propertyId, error: bookingsError });
    }

    // Calculate overall availability
    const totalBeds = rooms.reduce((sum, room) => sum + room.bed_count, 0);
    const availableBeds = rooms.reduce((sum, room) => sum + room.beds_available, 0);
    const occupiedBeds = totalBeds - availableBeds; // Calculate occupied beds
    const pendingCount = pendingBookings?.length || 0;

    const occupancyRate = totalBeds > 0 ? occupiedBeds / totalBeds : 0;
    const overallStatus = calculateAvailabilityStatus(occupancyRate, availableBeds);

    // Calculate by room type
    const roomTypeMap = new Map<string, {
      totalBeds: number;
      availableBeds: number;
      occupiedBeds: number;
      pendingBookings: number;
    }>();

    // Group rooms by type
    rooms.forEach(room => {
      const existing = roomTypeMap.get(room.room_type) || {
        totalBeds: 0,
        availableBeds: 0,
        occupiedBeds: 0,
        pendingBookings: 0
      };

      const roomOccupiedBeds = room.bed_count - room.beds_available;

      roomTypeMap.set(room.room_type, {
        totalBeds: existing.totalBeds + room.bed_count,
        availableBeds: existing.availableBeds + room.beds_available,
        occupiedBeds: existing.occupiedBeds + roomOccupiedBeds,
        pendingBookings: existing.pendingBookings
      });
    });

    // Add pending bookings by room type
    pendingBookings?.forEach(booking => {
      if (booking.room_type) {
        const existing = roomTypeMap.get(booking.room_type);
        if (existing) {
          existing.pendingBookings += 1;
        }
      }
    });

    // Convert to room type availability array
    const byRoomType: RoomTypeBedAvailability[] = Array.from(roomTypeMap.entries()).map(([roomType, data]) => {
      const roomOccupancyRate = data.totalBeds > 0 ? data.occupiedBeds / data.totalBeds : 0;
      const roomStatus = calculateAvailabilityStatus(roomOccupancyRate, data.availableBeds);

      return {
        roomType,
        totalBeds: data.totalBeds,
        availableBeds: data.availableBeds,
        occupiedBeds: data.occupiedBeds,
        pendingBookings: data.pendingBookings,
        occupancyRate: roomOccupancyRate,
        status: roomStatus
      };
    });

    const result: PropertyBedAvailability = {
      propertyId,
      overall: {
        propertyId,
        totalBeds,
        availableBeds,
        occupiedBeds,
        pendingBookings: pendingCount,
        occupancyRate,
        status: overallStatus,
        lastUpdated: new Date()
      },
      byRoomType,
      lastUpdated: new Date()
    };

    logger.info('Successfully calculated bed availability', {
      propertyId,
      totalBeds,
      availableBeds,
      occupancyRate: Math.round(occupancyRate * 100),
      status: overallStatus
    });

    return result;

  } catch (error) {
    logger.error('Error fetching real-time bed availability', { propertyId, error });
    
    // Return fallback data
    return {
      propertyId,
      overall: {
        propertyId,
        totalBeds: 0,
        availableBeds: 0,
        occupiedBeds: 0,
        pendingBookings: 0,
        occupancyRate: 0,
        status: 'full',
        lastUpdated: new Date()
      },
      byRoomType: [],
      lastUpdated: new Date()
    };
  }
}

/**
 * ✅ PRODUCTION-GRADE: Calculate availability status based on occupancy
 */
function calculateAvailabilityStatus(
  occupancyRate: number, 
  availableBeds: number
): 'free' | 'moderate' | 'filling_up' | 'full' {
  if (availableBeds === 0) return 'full';
  if (occupancyRate < 0.3) return 'free';
  if (occupancyRate < 0.7) return 'moderate';
  return 'filling_up';
}

/**
 * ✅ PRODUCTION-GRADE: Get availability status display properties
 */
export function getAvailabilityStatusDisplay(status: 'free' | 'moderate' | 'filling_up' | 'full') {
  switch (status) {
    case 'free':
      return {
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        borderColor: 'border-green-200',
        text: 'Available',
        description: 'Plenty of beds available',
        priority: 1
      };
    case 'moderate':
      return {
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        borderColor: 'border-yellow-200',
        text: 'Moderate',
        description: 'Limited beds available',
        priority: 2
      };
    case 'filling_up':
      return {
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
        borderColor: 'border-orange-200',
        text: 'Filling Up',
        description: 'Few beds remaining',
        priority: 3
      };
    case 'full':
      return {
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        borderColor: 'border-red-200',
        text: 'Full',
        description: 'No beds available',
        priority: 4
      };
  }
}

/**
 * ✅ PRODUCTION-GRADE: Subscribe to real-time bed availability updates
 */
export function subscribeToRealTimeBedAvailability(
  propertyId: string,
  onUpdate: (availability: PropertyBedAvailability) => void
): () => void {
  logger.info('Setting up real-time bed availability subscription', { propertyId });

  // Subscribe to rooms table changes
  const roomsSubscription = supabase
    .channel(`rooms_${propertyId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'rooms',
        filter: `property_id=eq.${propertyId}`
      },
      async () => {
        logger.info('Rooms data changed, updating availability', { propertyId });
        const updatedAvailability = await getRealTimeBedAvailability(propertyId);
        onUpdate(updatedAvailability);
      }
    )
    .subscribe();

  // Subscribe to bookings table changes
  const bookingsSubscription = supabase
    .channel(`bookings_${propertyId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'bookings',
        filter: `property_id=eq.${propertyId}`
      },
      async () => {
        logger.info('Bookings data changed, updating availability', { propertyId });
        const updatedAvailability = await getRealTimeBedAvailability(propertyId);
        onUpdate(updatedAvailability);
      }
    )
    .subscribe();

  // Return cleanup function
  return () => {
    logger.info('Cleaning up real-time bed availability subscription', { propertyId });
    supabase.removeChannel(roomsSubscription);
    supabase.removeChannel(bookingsSubscription);
  };
}

/**
 * ✅ HELPER: Format availability message for display
 */
export function formatAvailabilityMessage(availability: BedAvailabilityStatus): string {
  const { availableBeds, totalBeds, status } = availability;
  
  switch (status) {
    case 'free':
      return `${availableBeds} of ${totalBeds} beds available`;
    case 'moderate':
      return `${availableBeds} beds remaining`;
    case 'filling_up':
      return `Only ${availableBeds} beds left!`;
    case 'full':
      return 'Fully booked';
  }
}
