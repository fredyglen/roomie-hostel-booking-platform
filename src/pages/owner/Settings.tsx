
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import OwnerLayout from '@/components/layout/OwnerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Building, CreditCard, Bell, Shield, Clock, Users } from 'lucide-react';

const ownerSettingsSchema = z.object({
  business_name: z.string().optional(),
  business_phone: z.string().optional(),
  business_email: z.string().email().optional().or(z.literal('')),
  business_address: z.string().optional(),
  terms_and_conditions: z.string().optional(),
  privacy_policy: z.string().optional(),
  refund_policy: z.string().optional(),
  cancellation_policy: z.string().optional(),
  check_in_time: z.string().default('14:00'),
  check_out_time: z.string().default('11:00'),
  booking_advance_notice: z.number().min(1).max(168).default(24),
  minimum_stay_days: z.number().min(1).default(1),
  maximum_stay_days: z.number().min(1).default(365),
  security_deposit_amount: z.number().min(0).default(0),
  late_payment_fee: z.number().min(0).default(0),
  cleaning_fee: z.number().min(0).default(0),
  utilities_included: z.boolean().default(true),
  wifi_included: z.boolean().default(true),
  maintenance_contact_name: z.string().optional(),
  maintenance_contact_phone: z.string().optional(),
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
  preferred_payment_method: z.string().default('mobile_money'),
  auto_accept_bookings: z.boolean().default(false),
  require_deposit: z.boolean().default(false),
  allow_pets: z.boolean().default(false),
  smoking_allowed: z.boolean().default(false),
  notifications_enabled: z.boolean().default(true),
  email_notifications: z.boolean().default(true),
  sms_notifications: z.boolean().default(false),
});

type OwnerSettingsFormValues = z.infer<typeof ownerSettingsSchema>;

const OwnerSettings: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<OwnerSettingsFormValues>({
    resolver: zodResolver(ownerSettingsSchema),
  });

  const { data: settings, isLoading } = useQuery({
    queryKey: ['owner-settings', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('owner_settings')
        .select('*')
        .eq('owner_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  React.useEffect(() => {
    if (settings) {
      form.reset({
        business_name: settings.business_name || '',
        business_phone: settings.business_phone || '',
        business_email: settings.business_email || '',
        business_address: settings.business_address || '',
        terms_and_conditions: settings.terms_and_conditions || '',
        privacy_policy: settings.privacy_policy || '',
        refund_policy: settings.refund_policy || '',
        cancellation_policy: settings.cancellation_policy || '',
        check_in_time: settings.check_in_time || '14:00',
        check_out_time: settings.check_out_time || '11:00',
        booking_advance_notice: settings.booking_advance_notice || 24,
        minimum_stay_days: settings.minimum_stay_days || 1,
        maximum_stay_days: settings.maximum_stay_days || 365,
        security_deposit_amount: settings.security_deposit_amount || 0,
        late_payment_fee: settings.late_payment_fee || 0,
        cleaning_fee: settings.cleaning_fee || 0,
        utilities_included: settings.utilities_included ?? true,
        wifi_included: settings.wifi_included ?? true,
        maintenance_contact_name: settings.maintenance_contact_name || '',
        maintenance_contact_phone: settings.maintenance_contact_phone || '',
        emergency_contact_name: settings.emergency_contact_name || '',
        emergency_contact_phone: settings.emergency_contact_phone || '',
        preferred_payment_method: settings.preferred_payment_method || 'mobile_money',
        auto_accept_bookings: settings.auto_accept_bookings ?? false,
        require_deposit: settings.require_deposit ?? false,
        allow_pets: settings.allow_pets ?? false,
        smoking_allowed: settings.smoking_allowed ?? false,
        notifications_enabled: settings.notifications_enabled ?? true,
        email_notifications: settings.email_notifications ?? true,
        sms_notifications: settings.sms_notifications ?? false,
      });
    }
  }, [settings, form]);

  const updateSettingsMutation = useMutation({
    mutationFn: async (values: OwnerSettingsFormValues) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('owner_settings')
        .upsert({
          owner_id: user.id,
          ...values,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Settings Updated',
        description: 'Your settings have been saved successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['owner-settings', user?.id] });
    },
    onError: (error) => {
      toast({
        title: 'Update Failed',
        description: `Failed to update settings: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (values: OwnerSettingsFormValues) => {
    updateSettingsMutation.mutate(values);
  };

  if (isLoading) {
    return (
      <OwnerLayout pageTitle="Settings">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </OwnerLayout>
    );
  }

  return (
    <OwnerLayout pageTitle="Settings">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-gray-600">Manage your property business settings and preferences</p>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            {settings ? 'Configured' : 'Setup Required'}
          </Badge>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="business" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="business" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Business
                </TabsTrigger>
                <TabsTrigger value="policies" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Policies
                </TabsTrigger>
                <TabsTrigger value="booking" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Booking
                </TabsTrigger>
                <TabsTrigger value="payments" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Payments
                </TabsTrigger>
                <TabsTrigger value="contacts" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Contacts
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications
                </TabsTrigger>
              </TabsList>

              <TabsContent value="business" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Business Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="business_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your business name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="business_phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="+233 XX XXX XXXX" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="business_email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="business@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="business_address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Address</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Full business address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="policies" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Terms & Policies</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="terms_and_conditions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Terms and Conditions</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Define your terms and conditions for property rentals..."
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="privacy_policy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Privacy Policy</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Your privacy policy for tenant data..."
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="refund_policy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Refund Policy</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Define your refund policy..."
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cancellation_policy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cancellation Policy</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Define your cancellation policy..."
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="booking" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Booking Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="check_in_time"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Check-in Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="check_out_time"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Check-out Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="booking_advance_notice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Advance Notice (hours)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="1" 
                                max="168"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 24)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="minimum_stay_days"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Minimum Stay (days)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="1"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="maximum_stay_days"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Maximum Stay (days)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="1"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 365)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="auto_accept_bookings"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <FormLabel>Auto-accept Bookings</FormLabel>
                              <p className="text-sm text-gray-600">Automatically accept bookings without manual review</p>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="allow_pets"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <FormLabel>Allow Pets</FormLabel>
                              <p className="text-sm text-gray-600">Allow tenants to bring pets</p>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="smoking_allowed"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <FormLabel>Smoking Allowed</FormLabel>
                              <p className="text-sm text-gray-600">Allow smoking in the property</p>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payments" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="security_deposit_amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Security Deposit (₵)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="0"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="late_payment_fee"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Late Payment Fee (₵)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="0"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cleaning_fee"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cleaning Fee (₵)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="0"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="preferred_payment_method"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Payment Method</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select payment method" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="mobile_money">Mobile Money</SelectItem>
                                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                <SelectItem value="cash">Cash</SelectItem>
                                <SelectItem value="credit_card">Credit Card</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="require_deposit"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <FormLabel>Require Security Deposit</FormLabel>
                              <p className="text-sm text-gray-600">Require tenants to pay security deposit</p>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="utilities_included"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <FormLabel>Utilities Included</FormLabel>
                              <p className="text-sm text-gray-600">Utilities are included in rent</p>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="wifi_included"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <FormLabel>WiFi Included</FormLabel>
                              <p className="text-sm text-gray-600">WiFi is included in rent</p>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contacts" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Emergency & Maintenance Contacts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="emergency_contact_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Emergency Contact Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Full name" {...field} />
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
                            <FormLabel>Emergency Contact Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="+233 XX XXX XXXX" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="maintenance_contact_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Maintenance Contact Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="maintenance_contact_phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Maintenance Contact Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="+233 XX XXX XXXX" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="notifications_enabled"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <FormLabel>Enable Notifications</FormLabel>
                            <p className="text-sm text-gray-600">Receive notifications about bookings and messages</p>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email_notifications"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <FormLabel>Email Notifications</FormLabel>
                            <p className="text-sm text-gray-600">Receive notifications via email</p>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sms_notifications"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <FormLabel>SMS Notifications</FormLabel>
                            <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={updateSettingsMutation.isPending}
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={updateSettingsMutation.isPending}
                className="min-w-[120px]"
              >
                {updateSettingsMutation.isPending ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  'Save Settings'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </OwnerLayout>
  );
};

export default OwnerSettings;
