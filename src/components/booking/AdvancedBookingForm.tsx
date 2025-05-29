
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/EnhancedAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, User, Phone, CreditCard } from 'lucide-react';

const bookingSchema = z.object({
  check_in_date: z.string().min(1, 'Check-in date is required'),
  check_out_date: z.string().min(1, 'Check-out date is required'),
  special_requests: z.string().optional(),
  emergency_contact_name: z.string().min(1, 'Emergency contact name is required'),
  emergency_contact_phone: z.string().min(1, 'Emergency contact phone is required'),
  emergency_contact_relationship: z.string().min(1, 'Relationship is required'),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface AdvancedBookingFormProps {
  propertyId: string;
  propertyTitle: string;
  rentAmount: number;
  onSuccess?: () => void;
}

const AdvancedBookingForm: React.FC<AdvancedBookingFormProps> = ({
  propertyId,
  propertyTitle,
  rentAmount,
  onSuccess
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      check_in_date: '',
      check_out_date: '',
      special_requests: '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      emergency_contact_relationship: '',
    },
  });

  const createBookingMutation = useMutation({
    mutationFn: async (data: BookingFormValues) => {
      if (!user?.id) throw new Error('User not authenticated');

      const checkInDate = new Date(data.check_in_date);
      const checkOutDate = new Date(data.check_out_date);
      const months = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
      const totalAmount = rentAmount * months;

      const bookingData = {
        property_id: propertyId,
        student_id: user.id,
        check_in_date: data.check_in_date,
        check_out_date: data.check_out_date,
        total_amount: totalAmount,
        special_requests: data.special_requests || null,
        emergency_contact_name: data.emergency_contact_name,
        emergency_contact_phone: data.emergency_contact_phone,
        emergency_contact_relationship: data.emergency_contact_relationship,
        status: 'pending',
        payment_status: 'pending',
      };

      const { data: result, error } = await supabase
        .from('bookings_enhanced')
        .insert(bookingData)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: (data) => {
      toast({
        title: 'Booking Created',
        description: `Your booking ${data.booking_reference} has been created successfully.`,
      });
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: 'Booking Failed',
        description: `Failed to create booking: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (data: BookingFormValues) => {
    createBookingMutation.mutate(data);
  };

  const calculateTotal = () => {
    const checkIn = form.watch('check_in_date');
    const checkOut = form.watch('check_out_date');
    
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const months = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
      return rentAmount * months;
    }
    return 0;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Book {propertyTitle}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Booking Details</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="check_in_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Check-in Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="check_out_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Check-out Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="special_requests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Requests (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any special requirements or requests..."
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {calculateTotal() > 0 && (
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="text-lg font-semibold">
                        Total Amount: GH₵{calculateTotal().toLocaleString()}
                      </p>
                    </div>
                  )}

                  <Button type="button" onClick={() => setStep(2)} className="w-full">
                    Continue to Emergency Contact
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Emergency Contact</span>
                  </h3>
                  
                  <FormField
                    control={form.control}
                    name="emergency_contact_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Full name of emergency contact" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="emergency_contact_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+233 24 123 4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="emergency_contact_relationship"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relationship</FormLabel>
                        <FormControl>
                          <Input placeholder="Parent, Guardian, Sibling, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex space-x-3">
                    <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createBookingMutation.isPending}
                      className="flex-1"
                    >
                      {createBookingMutation.isPending ? 'Creating Booking...' : 'Create Booking'}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedBookingForm;
