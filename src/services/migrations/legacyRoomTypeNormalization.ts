import { PropertyFormValues } from '@/components/owner/property-form/PropertyFormSchema';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/enhanced-logger';

// Normalize a single room type value to the canonical X_in_a_room taxonomy
export function normalizeRoomTypeValue(value: string): string {
  if (!value) return value;
  const v = String(value).toLowerCase();
  if (v === 'single_room' || v === 'single room') return '1_in_a_room';
  if (v === 'shared_room' || v === 'shared room') return '2_in_a_room';
  const m = v.match(/(\d+)_in_a_room/);
  if (m) return `${m[1]}_in_a_room`;
  return value;
}

export function normalizeRoomTypesArray(arr?: string[]): string[] | undefined {
  if (!Array.isArray(arr)) return arr;
  return arr.map(normalizeRoomTypeValue);
}

export function normalizeRoomTypePricing(pricing?: Record<string, number> | null): Record<string, number> | undefined {
  if (!pricing || typeof pricing !== 'object') return pricing || undefined;
  const result: Record<string, number> = {};
  for (const [k, v] of Object.entries(pricing)) {
    result[normalizeRoomTypeValue(k)] = v as number;
  }
  return result;
}

// Non-destructive form-level normalization for new/edited submissions
export function normalizeLegacyRoomTypesInForm(form: PropertyFormValues): PropertyFormValues {
  const copy: any = { ...form };
  copy.room_types = normalizeRoomTypesArray(copy.room_types) as any;
  copy.room_type_pricing = normalizeRoomTypePricing(copy.room_type_pricing) as any;

  // Normalize simple-room repeater or structure rooms if present
  if (Array.isArray(copy.buildings)) {
    copy.buildings = copy.buildings.map((b: any) => ({
      ...b,
      floors: (b.floors || []).map((f: any) => ({
        ...f,
        rooms: (f.rooms || []).map((r: any) => ({
          ...r,
          roomType: normalizeRoomTypeValue(r.roomType)
        }))
      }))
    }));
  }
  return copy as PropertyFormValues;
}

// Optional: one-property normalization to run as a maintenance utility in Admin tools
export async function normalizeLegacyRoomTypesForProperty(propertyId: string): Promise<{ success: boolean; updatedRooms: number }>{
  try {
    logger.info('Normalizing legacy room types for property', { propertyId });

    // Fetch property
    const { data: property, error: propErr } = await supabase
      .from('properties')
      .select('id, room_types, room_type_pricing')
      .eq('id', propertyId)
      .single();

    if (propErr || !property) {
      logger.warn('Property not found for normalization', { propertyId, error: propErr });
      return { success: false, updatedRooms: 0 };
    }

    const nextRoomTypes = normalizeRoomTypesArray(property.room_types || undefined) || [];
    const nextPricing = normalizeRoomTypePricing(property.room_type_pricing || undefined) || {};

    // Update properties table
    const { error: updatePropErr } = await supabase
      .from('properties')
      .update({ room_types: nextRoomTypes, room_type_pricing: nextPricing })
      .eq('id', propertyId);

    if (updatePropErr) {
      logger.warn('Failed to update property room types/pricing during normalization', { propertyId, error: updatePropErr });
    }

    // Normalize existing rooms rows
    const { data: rooms, error: roomsErr } = await supabase
      .from('rooms')
      .select('id, room_type')
      .eq('property_id', propertyId);

    if (roomsErr) {
      logger.warn('Failed to select rooms for normalization', { propertyId, error: roomsErr });
      return { success: false, updatedRooms: 0 };
    }

    let updated = 0;
    for (const r of rooms || []) {
      const normalized = normalizeRoomTypeValue(r.room_type as any);
      if (normalized !== r.room_type) {
        const { error: updErr } = await supabase
          .from('rooms')
          .update({ room_type: normalized })
          .eq('id', r.id as any);
        if (!updErr) updated++;
      }
    }

    return { success: true, updatedRooms: updated };
  } catch (e) {
    logger.error('normalizeLegacyRoomTypesForProperty failed', { propertyId, error: e });
    return { success: false, updatedRooms: 0 };
  }
}

