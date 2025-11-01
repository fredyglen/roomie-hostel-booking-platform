/**
 * Room Types Service - Dynamic Loading from Owner Configuration
 * 
 * Loads room types and pricing from owner-configured data instead of hardcoded values.
 * Follows Ghana hostel standards and BE CONSCIOUS principles.
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/enhanced-logger';

export interface RoomTypeOption {
  readonly value: string;
  readonly label: string;
  readonly price: number;
  readonly bedsAvailable: number;
  readonly totalBeds: number;
  readonly occupants: number;
}

export interface PropertyRoomTypes {
  readonly propertyId: string;
  readonly roomTypes: readonly RoomTypeOption[];
  readonly hasRoomTypes: boolean;
}

/**
 * ✅ PRODUCTION-GRADE: Fetch room types from owner configuration
 */
export async function fetchPropertyRoomTypes(propertyId: string): Promise<PropertyRoomTypes> {
  try {
    logger.info('Fetching room types for property', { propertyId });

    // Fetch property record (select all to avoid 400s from non-existent columns on some deployments)
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single();

    if (propertyError) {
      logger.error('Failed to fetch property room types', { propertyId, error: propertyError });
      return {
        propertyId,
        roomTypes: [],
        hasRoomTypes: false
      };
    }

    // Fetch rooms data for availability and pricing (via buildings -> floors -> rooms)
    let rooms: any[] = [];
    try {
      const { data: buildings, error: buildingsError } = await supabase
        .from('buildings')
        .select('id')
        .eq('property_id', propertyId);

      if (buildingsError) {
        logger.warn('Failed to fetch buildings for property', { propertyId, error: buildingsError });
      }

      const buildingIds = (buildings || []).map((b: any) => b.id);
      if (buildingIds.length > 0) {
        const { data: floors, error: floorsError } = await supabase
          .from('floors')
          .select('id')
          .in('building_id', buildingIds);

        if (floorsError) {
          logger.warn('Failed to fetch floors for buildings', { propertyId, error: floorsError });
        }

        const floorIds = (floors || []).map((f: any) => f.id);
        if (floorIds.length > 0) {
          const { data: roomsRes, error: roomsErr } = await supabase
            .from('rooms')
            .select('id, room_type, bed_count, rent_amount, beds_available, floor_id')
            .in('floor_id', floorIds);

          if (roomsErr) {
            logger.warn('Failed to fetch rooms via floor_id, using property-level data', { propertyId, error: roomsErr });
          } else {
            rooms = roomsRes || [];
          }
        }
      }
    } catch (e) {
      logger.error('Error fetching rooms hierarchy for property', { propertyId, error: e });
    }

    // Transform to room type options
    const roomTypes = transformToRoomTypeOptions(property, rooms || []);

    return {
      propertyId,
      roomTypes,
      hasRoomTypes: roomTypes.length > 0
    };

  } catch (error) {
    logger.error('Error fetching property room types', { propertyId, error });
    return {
      propertyId,
      roomTypes: [],
      hasRoomTypes: false
    };
  }
}

/**
 * ✅ PRODUCTION-GRADE: Transform database data to room type options
 */
function transformToRoomTypeOptions(property: any, rooms: any[]): RoomTypeOption[] {
  const roomTypes: RoomTypeOption[] = [];

  // If we have rooms data, use it for accurate pricing and availability
  if (rooms.length > 0) {
    const roomTypeGroups = groupRoomsByType(rooms);
    
    for (const [roomType, roomGroup] of Object.entries(roomTypeGroups)) {
      const totalBeds = roomGroup.reduce((sum: number, room: any) => sum + (room.bed_count || 0), 0);
      const availableBeds = roomGroup.reduce((sum: number, room: any) => sum + (room.beds_available || 0), 0);
      const avgPrice = roomGroup.reduce((sum: number, room: any) => sum + (room.rent_amount || 0), 0) / Math.max(1, roomGroup.length);

      // Normalize labels to strict "X in a Room" regardless of upstream naming like "Single Room"/"Shared Room"
      const occupants = Math.max(1, Number(roomGroup[0]?.bed_count) || extractOccupantsFromRoomType(String(roomType)) || 1);
      const normalizedValue = `${occupants}_in_a_room`;
      const normalizedLabel = `${occupants} in a Room`;

      roomTypes.push({
        value: normalizedValue,
        label: normalizedLabel,
        price: avgPrice,
        bedsAvailable: availableBeds,
        totalBeds: totalBeds,
        occupants
      });
    }
  } 
  // Fallback to property-level room types (explicit array)
  else if (property.room_types && Array.isArray(property.room_types)) {
    for (const roomType of property.room_types) {
      const price = property.room_type_pricing?.[roomType] || property.base_price_per_semester || 0;
      const occupants = extractOccupantsFromRoomType(roomType);

      roomTypes.push({
        value: roomType,
        label: formatRoomTypeLabel(roomType),
        price: price,
        bedsAvailable: 0, // Unknown without rooms data
        totalBeds: 0, // Unknown without rooms data
        occupants: occupants
      });
    }
  }
  // Fallback to property-level pricing object keys if room_types array is missing
  else if (property.room_type_pricing && typeof property.room_type_pricing === 'object') {
    const keys = Object.keys(property.room_type_pricing);
    for (const roomType of keys) {
      const price = property.room_type_pricing?.[roomType] || property.base_price_per_semester || 0;
      const occupants = extractOccupantsFromRoomType(roomType);

      roomTypes.push({
        value: roomType,
        label: formatRoomTypeLabel(roomType),
        price: price,
        bedsAvailable: 0,
        totalBeds: 0,
        occupants
      });
    }
  }

  return roomTypes.sort((a, b) => a.occupants - b.occupants); // Sort by occupancy
}

/**
 * ✅ HELPER: Group rooms by type
 */
function groupRoomsByType(rooms: any[]): Record<string, any[]> {
  return rooms.reduce((groups, room) => {
    const type = room.room_type || 'Unknown';
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(room);
    return groups;
  }, {});
}

/**
 * ✅ HELPER: Extract occupants number from room type string
 */
function extractOccupantsFromRoomType(roomType: string): number {
  const match = roomType.match(/(\d+)_in_a_room/);
  if (match) {
    return parseInt(match[1], 10);
  }
  
  // Handle other formats
  if (roomType.includes('single')) return 1;
  if (roomType.includes('shared')) return 2;
  if (roomType.includes('1_bedroom')) return 2;
  if (roomType.includes('2_bedroom')) return 4;
  if (roomType.includes('3_bedroom')) return 6;
  
  return 1; // Default
}

/**
 * ✅ HELPER: Format room type for display
 */
function formatRoomTypeLabel(roomType: string): string {
  // Prefer strict "X in a Room" where we can infer occupants
  const match = roomType.match(/(\d+)_in_a_room/);
  if (match) {
    return `${match[1]} in a Room`;
  }
  const occ = extractOccupantsFromRoomType(roomType);
  if (occ && /single|shared|room/i.test(roomType)) {
    return `${occ} in a Room`;
  }
  // Fallback: title-case
  return roomType
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .replace('In A Room', 'in a Room')
    .replace('Bedroom Apartment', 'Bedroom Apartment');
}

/**
 * ✅ PRODUCTION-GRADE: Get fallback room types for property category
 */
export function getFallbackRoomTypes(propertyCategory: string): RoomTypeOption[] {
  const basePrice = 3000; // Fallback price

  switch (propertyCategory?.toLowerCase()) {
    case 'hostel':
      return [
        { value: '1_in_a_room', label: '1 in a Room', price: basePrice * 1.5, bedsAvailable: 0, totalBeds: 0, occupants: 1 },
        { value: '2_in_a_room', label: '2 in a Room', price: basePrice * 1.2, bedsAvailable: 0, totalBeds: 0, occupants: 2 },
        { value: '3_in_a_room', label: '3 in a Room', price: basePrice, bedsAvailable: 0, totalBeds: 0, occupants: 3 },
        { value: '4_in_a_room', label: '4 in a Room', price: basePrice * 0.8, bedsAvailable: 0, totalBeds: 0, occupants: 4 }
      ];
    case 'homestel':
      return [
        { value: '1_in_a_room', label: '1 in a Room', price: basePrice * 1.3, bedsAvailable: 0, totalBeds: 0, occupants: 1 },
        { value: '2_in_a_room', label: '2 in a Room', price: basePrice, bedsAvailable: 0, totalBeds: 0, occupants: 2 }
      ];
    case 'apartment':
      return [
        { value: '1_bedroom_apartment', label: '1 Bedroom Apartment', price: basePrice * 2, bedsAvailable: 0, totalBeds: 0, occupants: 2 },
        { value: '2_bedroom_apartment', label: '2 Bedroom Apartment', price: basePrice * 3, bedsAvailable: 0, totalBeds: 0, occupants: 4 }
      ];
    default:
      return [];
  }
}
