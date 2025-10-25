import React, { useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { PropertyFormValues } from './PropertyFormSchema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, Users, DollarSign } from 'lucide-react';

interface DynamicPricingMatrixProps {
  form: UseFormReturn<PropertyFormValues>;
  propertyCategory: 'Hostel' | 'Homestel' | 'Apartment';
}

/**
 * BE CONSCIOUS: Dynamic Pricing Matrix Component
 * 
 * Implements Ghana hostel pricing standards:
 * - Room type-based pricing (1_in_a_room, 2_in_a_room, etc.)
 * - Smart max occupants calculation
 * - Duration-aware pricing display
 * - Removes redundant "Beds Per Room" selector
 */
const DynamicPricingMatrix: React.FC<DynamicPricingMatrixProps> = ({ 
  form, 
  propertyCategory 
}) => {
  const roomTypes = form.watch('room_types') || [];
  const bookingDuration = form.watch('booking_duration') || 'semester';
  const roomTypePricing = form.watch('room_type_pricing') || {};

  // BE CONSCIOUS: Room type configurations for all property categories
  const getRoomTypeConfig = (roomType: string) => {
    const configs = {
      // Hostel room types - Ghana standard "X in a room" system
      '1_in_a_room': {
        label: '1 in a Room',
        occupants: 1,
        description: 'Single occupancy - premium pricing',
        icon: '🏠'
      },
      '2_in_a_room': {
        label: '2 in a Room',
        occupants: 2,
        description: 'Double occupancy - popular choice',
        icon: '👥'
      },
      '3_in_a_room': {
        label: '3 in a Room',
        occupants: 3,
        description: 'Triple occupancy - affordable option',
        icon: '👨‍👩‍👧'
      },
      '4_in_a_room': {
        label: '4 in a Room',
        occupants: 4,
        description: 'Quad occupancy - budget-friendly',
        icon: '👨‍👩‍👧‍👦'
      },
      '5_in_a_room': {
        label: '5 in a Room',
        occupants: 5,
        description: 'Five occupancy - very affordable',
        icon: '👨‍👩‍👧‍👦‍👶'
      },
      '6_in_a_room': {
        label: '6 in a Room',
        occupants: 6,
        description: 'Six occupancy - most affordable',
        icon: '👨‍👩‍👧‍👦‍👶‍👧'
      },
      // Homestel room types
      'single_room': {
        label: 'Single Room',
        occupants: 1,
        description: 'Private room in family home',
        icon: '🏡'
      },
      'shared_room': {
        label: 'Shared Room',
        occupants: 2,
        description: 'Shared room in family home',
        icon: '👫'
      },
      // Apartment room types - owner decides occupancy
      '1_bedroom_apartment': {
        label: '1 Bedroom Apartment',
        occupants: 0, // No fixed occupancy - owner decides
        description: 'One bedroom unit - owner sets occupancy',
        icon: '🏠'
      },
      '2_bedroom_apartment': {
        label: '2 Bedroom Apartment',
        occupants: 0, // No fixed occupancy - owner decides
        description: 'Two bedroom unit - owner sets occupancy',
        icon: '🏘️'
      },
      '3_bedroom_apartment': {
        label: '3 Bedroom Apartment',
        occupants: 0, // No fixed occupancy - owner decides
        description: 'Three bedroom unit - owner sets occupancy',
        icon: '🏰'
      }
    };
    return configs[roomType as keyof typeof configs];
  };

  // BE CONSCIOUS: Smart max occupants calculation
  useEffect(() => {
    if (roomTypes.length > 0) {
      const totalRooms = form.getValues('bedrooms') || 1;
      
      // Calculate max occupants based on room types
      const maxOccupantsPerRoom = Math.max(...roomTypes.map(type => {
        const config = getRoomTypeConfig(type);
        return config ? config.occupants : 1;
      }));
      
      const calculatedMaxOccupants = totalRooms * maxOccupantsPerRoom;
      
      // Auto-update max occupants
      form.setValue('max_occupants', calculatedMaxOccupants);
    }
  }, [roomTypes, form]);

  // BE CONSCIOUS: Duration display for pricing context
  const getDurationLabel = () => {
    switch (bookingDuration) {
      case 'week': return 'Week';
      case 'month': return 'Month';
      case 'semester': return 'Semester (4 months)';
      case 'academic_year': return 'Academic Year (8 months)';
      case 'year': return 'Year';
      case 'custom': return 'Custom Period';
      default: return 'Semester';
    }
  };

  // BE CONSCIOUS: Handle pricing updates
  const updateRoomTypePrice = (roomType: string, price: number) => {
    const currentPricing = form.getValues('room_type_pricing') || {};
    const updatedPricing = {
      ...currentPricing,
      [roomType]: price
    };
    form.setValue('room_type_pricing', updatedPricing);
    
    // Update main price field with the first room type price for compatibility
    if (roomTypes[0] === roomType) {
      form.setValue('price', price);
    }
  };

  if (roomTypes.length === 0) {
    return null; // Don't show pricing matrix until room types are selected
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Pricing Matrix - {getDurationLabel()}
          </CardTitle>
          <p className="text-sm text-gray-600">
            Set prices per room type and duration.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {roomTypes.map((roomType) => {
              const config = getRoomTypeConfig(roomType);
              if (!config) return null;

              return (
                <div key={roomType} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{config.icon}</span>
                      <div>
                        <h4 className="font-medium">{config.label}</h4>
                        <p className="text-sm text-gray-600">{config.description}</p>
                      </div>
                    </div>
                    {/* Only show max students for Hostel and Homestel, NOT for Apartments */}
                    {propertyCategory !== 'Apartment' && (
                      <Badge variant="outline">
                        Max {config.occupants} student{config.occupants > 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name={`room_type_pricing.${roomType}` as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Price per {getDurationLabel()} <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            placeholder={`e.g. ${config.occupants === 1 ? '3000' : config.occupants === 2 ? '2500' : config.occupants === 3 ? '2000' : '1500'}`}
                            value={roomTypePricing[roomType] ?? ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === '') {
                                updateRoomTypePrice(roomType, undefined as any);
                                field.onChange(undefined);
                              } else {
                                const price = Number(val);
                                updateRoomTypePrice(roomType, price);
                                field.onChange(price);
                              }
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Price in Ghana Cedis (GH₵) for {config.label.toLowerCase()} per {getDurationLabel().toLowerCase()}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              );
            })}
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default DynamicPricingMatrix;
