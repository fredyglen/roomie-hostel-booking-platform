import { describe, it, expect } from 'vitest';
import { getFallbackRoomTypes } from '@/services/roomTypesService';

describe('roomTypesService.getFallbackRoomTypes', () => {
  it('returns hostel fallback types (case-insensitive)', () => {
    const types1 = getFallbackRoomTypes('Hostel');
    const types2 = getFallbackRoomTypes('HOSTEL');
    expect(types1.length).toBeGreaterThan(0);
    expect(types2.length).toBeGreaterThan(0);
    expect(types1[0]).toHaveProperty('value');
    expect(types1[0]).toHaveProperty('price');
  });

  it('returns homestel fallback types', () => {
    const types = getFallbackRoomTypes('Homestel');
    expect(types.length).toBeGreaterThan(0);
  });

  it('returns apartment fallback types', () => {
    const types = getFallbackRoomTypes('Apartment');
    expect(types.length).toBeGreaterThan(0);
  });

  it('returns empty list for unknown category', () => {
    const types = getFallbackRoomTypes('UnknownCategory');
    expect(types.length).toBe(0);
  });
});

