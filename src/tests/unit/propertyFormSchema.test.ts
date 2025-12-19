import { describe, it, expect } from 'vitest';

import { propertyFormSchema } from '@/components/owner/property-form/PropertyFormSchema';

// Helper to build a minimal-but-valid base form payload
const createBaseForm = (overrides: Partial<any> = {}) => ({
  name: 'Test Property',
  title: 'Test Property',
  type: 'hostel',
  propertyCategory: 'Hostel',
  address: 'Near University of Ghana',
  city: 'Accra',
  region: 'Greater Accra',
  state: 'Greater Accra',
  zip: '00000',
  nearest_university: 'University of Ghana',
  booking_duration: 'semester',
  price: 1000,
  description: 'Nice student accommodation',
  bedrooms: 10,
  bathrooms: 5,
  room_types: ['1_in_a_room'],
  status: 'available',
  gender_restriction: 'mixed',
  semester_availability: ['semester_1', 'semester_2'],
  ...overrides,
});

describe('propertyFormSchema – category semantics', () => {
  it('accepts a valid Hostel configuration', () => {
    const result = propertyFormSchema.safeParse(
      createBaseForm({
        type: 'hostel',
        propertyCategory: 'Hostel',
        booking_duration: 'semester',
        room_types: ['1_in_a_room', '4_in_a_room'],
      })
    );

    expect(result.success).toBe(true);
  });

  it('rejects a Hostel with apartment-style room types or monthly pricing', () => {
    const result = propertyFormSchema.safeParse(
      createBaseForm({
        type: 'hostel',
        propertyCategory: 'Hostel',
        booking_duration: 'month',
        room_types: ['1_bedroom_apartment'],
      })
    );

    expect(result.success).toBe(false);
    const messages = result.success ? [] : result.error.issues.map((i) => i.message);
    expect(messages.some((m) => m.includes('Hostels can only use'))).toBe(true);
    expect(messages.some((m) => m.includes('Hostels must be priced per semester or academic year'))).toBe(true);
  });

  it('rejects Homestel configuration that uses apartment-style room types', () => {
    const result = propertyFormSchema.safeParse(
      createBaseForm({
        type: 'homestel',
        propertyCategory: 'Homestel',
        booking_duration: 'month',
        room_types: ['1_bedroom_apartment'],
      })
    );

    expect(result.success).toBe(false);
    const messages = result.success ? [] : result.error.issues.map((i) => i.message);
    expect(messages.some((m) => m.includes('Homestels must use the standard'))).toBe(true);
  });

  it('rejects Apartment configuration that uses hostel-style room types', () => {
    const result = propertyFormSchema.safeParse(
      createBaseForm({
        type: 'apartment',
        propertyCategory: 'Apartment',
        booking_duration: 'month',
        room_types: ['1_in_a_room'],
      })
    );

    expect(result.success).toBe(false);
    const messages = result.success ? [] : result.error.issues.map((i) => i.message);
    expect(messages.some((m) => m.includes('Apartments must use apartment room types'))).toBe(true);
  });

  it('rejects mismatched propertyCategory and type (enforced via typeToCategory)', () => {
    const result = propertyFormSchema.safeParse(
      createBaseForm({
        type: 'hostel',
        propertyCategory: 'Apartment',
      })
    );

    expect(result.success).toBe(false);
    const messages = result.success ? [] : result.error.issues.map((i) => i.message);
    expect(messages.some((m) => m.includes('Property category must match property type'))).toBe(true);
  });
});
