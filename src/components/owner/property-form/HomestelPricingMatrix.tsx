import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { PropertyFormValues } from './PropertyFormSchema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HomestelPricingMatrixProps {
  form: UseFormReturn<PropertyFormValues>;
}

// Duration columns exactly as specified by the mock (short keys for storage)
const DURATION_COLUMNS: { key: string; label: string }[] = [
  { key: '1w', label: '1 Week' },
  { key: '2w', label: '2 Weeks' },
  { key: '1m', label: '1 Month' },
  { key: '2m', label: '2 Months' },
  { key: '3m', label: '3 Months' },
  { key: '6m', label: '6 Months' },
  { key: '1y', label: '1 Year' },
  { key: '2y', label: '2+ Years' }
];

// Map room type to friendly label and implied occupants
const ROOM_TYPE_LABELS: Record<string, { label: string; occupants: number }> = {
  '1_in_a_room': { label: '1 in a Room', occupants: 1 },
  '2_in_a_room': { label: '2 in a Room', occupants: 2 },
  '3_in_a_room': { label: '3 in a Room', occupants: 3 },
  '4_in_a_room': { label: '4 in a Room', occupants: 4 },
  '5_in_a_room': { label: '5 in a Room', occupants: 5 },
  '6_in_a_room': { label: '6 in a Room', occupants: 6 }
};

const HomestelPricingMatrix: React.FC<HomestelPricingMatrixProps> = ({ form }) => {
  const roomTypes: string[] = form.watch('room_types') || [];
  const matrix = form.watch('homestel_pricing_matrix') as any || {};

  // Booking duration context and helpers
  const bookingDuration = form.watch('booking_duration') || 'semester';
  const getDurationLabel = () => {
    switch (bookingDuration) {
      case 'week': return 'Week';
      case 'month': return 'Month';
      case 'semester': return 'Semester (4 months)';
      case 'academic_year': return 'Academic Year (8 months)';
      case 'year': return 'Year';
      default: return 'Semester';
    }
  };

  const getOccupantsFromRt = (rt: string): number => {
    const occ = ROOM_TYPE_LABELS[rt]?.occupants;
    if (typeof occ === 'number') return occ;
    const m = rt.match(/(\d+)_in_a_room/);
    return m ? Number(m[1]) : 1;
  };
  const isSingleRoomType = (rt: string) => getOccupantsFromRt(rt) === 1;

  const singleRoomTypes = roomTypes.filter(isSingleRoomType);
  const sharedRoomTypes = roomTypes.filter((rt) => !isSingleRoomType(rt));


  if (!roomTypes.length) return null;

  const setMatrixPrice = (roomType: string, durKey: string, value: number | undefined) => {
    const current = (form.getValues('homestel_pricing_matrix') as any) || {};
    const next = {
      ...current,
      [roomType]: { ...(current[roomType] || {}), [durKey]: value }
    };
    form.setValue('homestel_pricing_matrix', next, { shouldValidate: true });

    // Derive canonical room_type_pricing from 1 Month ONLY for single rooms
    if (durKey === '1m' && isSingleRoomType(roomType)) {
      const currentPricing = form.getValues('room_type_pricing') || {};
      const updatedPricing = { ...currentPricing } as Record<string, number>;
      if (typeof value === 'number' && !Number.isNaN(value)) {
        updatedPricing[roomType] = value;
      } else {
        delete updatedPricing[roomType];
      }
      form.setValue('room_type_pricing', updatedPricing as any);
      // Also keep main price in sync for the first selected room type (single only)
      if (roomTypes[0] === roomType && typeof value === 'number') {
        form.setValue('price', value);
        form.setValue('price_unit', 'month' as any);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">table_chart</span>
          Flexible Duration Pricing (Homestel)
        </CardTitle>
        <p className="text-sm text-gray-600">Enter prices per duration. The 1 Month price will be used as the primary billing amount.</p>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <div className="min-w-[1040px] rounded-lg ring-1 ring-gray-200 bg-white">
            <div className="grid" style={{ gridTemplateColumns: `240px repeat(${DURATION_COLUMNS.length}, 140px)` }}>
              {/* Header row */}
              <div className="py-3 px-4 font-semibold text-sm text-gray-700 sticky top-0 left-0 z-20 bg-white border-b">Room Type</div>
              {DURATION_COLUMNS.map((d) => (
                <div key={d.key} className="py-3 px-4 font-semibold text-sm text-gray-700 text-center sticky top-0 z-10 bg-white border-b">{d.label}</div>
              ))}

              {/* Rows: ONLY single-occupancy room types */}
              {singleRoomTypes.map((rt) => {
                const label = ROOM_TYPE_LABELS[rt]?.label || rt;
                return (
                  <React.Fragment key={rt}>
                    <div className="py-3 px-4 border-t font-medium sticky left-0 z-10 bg-white">{label}</div>
                    {DURATION_COLUMNS.map((d) => (
                      <div key={d.key} className="py-2 px-3 border-t">
                        <FormField
                          control={form.control}
                          name={`homestel_pricing_matrix.${rt}.${d.key}` as any}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="relative">
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">GHS</span>
                                  <Input
                                    className="pl-12 pr-2 text-right tabular-nums"
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    value={field.value ?? ''}
                                    onChange={(e) => {
                                      const raw = e.target.value;
                                      const num = raw === '' ? undefined : Number(raw);
                                      field.onChange(num);
                                      setMatrixPrice(rt, d.key, num);
                                    }}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* Shared rooms: simple semester/year pricing, like Hostel */}
        {sharedRoomTypes.length > 0 && (
          <div className="mt-6">
            <div className="mb-2 text-sm font-semibold text-gray-700">Shared Rooms (simple pricing per {getDurationLabel().toLowerCase()})</div>
            <div className="grid gap-4">
              {sharedRoomTypes.map((rt) => {
                const label = ROOM_TYPE_LABELS[rt]?.label || rt;
                const currentPricing = (form.getValues('room_type_pricing') || {}) as Record<string, number>;
                const value = (currentPricing as any)[rt] ?? '';
                return (
                  <div key={rt} className="border rounded-lg p-4">
                    <div className="mb-2 font-medium">{label}</div>
                    <FormField
                      control={form.control}
                      name={`room_type_pricing.${rt}` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="sr-only">{label} price</FormLabel>
                          <FormControl>
                            <div className="relative max-w-xs">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">GHS</span>
                              <Input
                                className="pl-12 pr-2 text-right tabular-nums"
                                type="number"
                                min="0"
                                placeholder="e.g. 2500"
                                value={value}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  const num = val === '' ? undefined : Number(val);
                                  field.onChange(num as any);
                                  const current = (form.getValues('room_type_pricing') || {}) as Record<string, number>;
                                  const next = { ...current } as any;
                                  if (typeof num === 'number' && !Number.isNaN(num)) next[rt] = num;
                                  else delete next[rt];
                                  form.setValue('room_type_pricing', next);
                                  // For the first selected room type, keep main price and unit in sync with current booking_duration
                                  const rts = form.getValues('room_types') || [];
                                  if (rts[0] === rt && typeof num === 'number') {
                                    form.setValue('price', num);
                                    form.setValue('price_unit', bookingDuration as any);
                                  }
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Advance requirements (optional) */}
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name={`homestel_advance.enabled` as any}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">payments</span>
                  Advance Required?
                </FormLabel>
                <FormControl>
                  <select
                    className="w-full border rounded-md p-2"
                    value={field.value ? 'yes' : 'no'}
                    onChange={(e) => field.onChange(e.target.value === 'yes')}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`homestel_advance.months` as any}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Advance Months (if required)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="e.g. 2"
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                    disabled={!((form.getValues('homestel_advance') as any)?.enabled)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default HomestelPricingMatrix;

