import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UseFormReturn } from 'react-hook-form';
import { PropertyFormValues } from './PropertyFormSchema';
import { Shield, Wifi, Car, Users, Calendar, AlertTriangle } from 'lucide-react';
import { IMAGE_URLS } from '@/constants/images';

interface EnhancedPropertyFieldsProps {
  form: UseFormReturn<PropertyFormValues>;
  propertyCategory: string;
}

const EnhancedPropertyFields: React.FC<EnhancedPropertyFieldsProps> = ({ form, propertyCategory }) => {
  const securityFeatures = [
    'CCTV Surveillance',
    '24/7 Security Guard',
    'Access Control System',
    'Security Lighting',
    'Emergency Alarms',
    'Gated Compound',
    'Intercom System',
    'Motion Sensors'
  ];

  const handleSecurityFeatureToggle = (feature: string) => {
    const currentFeatures = form.getValues('security_features') || [];
    const updatedFeatures = currentFeatures.includes(feature)
      ? currentFeatures.filter(f => f !== feature)
      : [...currentFeatures, feature];
    
    form.setValue('security_features', updatedFeatures);
  };

  const handleSemesterAvailabilityToggle = (semester: 'semester_1' | 'semester_2' | 'year_round') => {
    const currentAvailability = form.getValues('semester_availability') || [];
    const updatedAvailability = currentAvailability.includes(semester)
      ? currentAvailability.filter(s => s !== semester)
      : [...currentAvailability, semester];
    
    form.setValue('semester_availability', updatedAvailability);
  };

  return (
    <div className="space-y-6">
      {/* Verification & Emergency Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Verification & Emergency Contact</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="verification_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select verification status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center space-x-3">
              <FormField
                control={form.control}
                name="has_accessibility_features"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Accessibility Features</FormLabel>
                      <FormDescription>
                        Property has wheelchair access, ramps, etc.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="emergency_contact_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emergency Contact Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Hansel Adu Gyan" {...field} />
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
                    <Input placeholder="+233 24 123 4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Policies & Restrictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Policies & Restrictions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="pet_policy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pet Policy</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pet policy" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="not_allowed">Not Allowed</SelectItem>
                      <SelectItem value="allowed">Allowed</SelectItem>
                      <SelectItem value="cats_only">Cats Only</SelectItem>
                      <SelectItem value="small_pets">Small Pets Only</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender_restriction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender Restriction</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender policy" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="mixed">Mixed Gender</SelectItem>
                      <SelectItem value="male">Male Only</SelectItem>
                      <SelectItem value="female">Female Only</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select cancellation policy" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="flexible">Flexible</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="strict">Strict</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    How strict are your cancellation terms?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Parking & Transportation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Car className="h-5 w-5" />
            <span>Parking & Transportation</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="parking_available"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Parking Available</FormLabel>
                  <FormDescription>
                    Property has parking spaces available
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {form.watch('parking_available') && (
            <FormField
              control={form.control}
              name="parking_cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parking Cost (GH₵ per month)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="50" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    Leave blank if parking is free
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </CardContent>
      </Card>

      {/* Internet & Technology */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wifi className="h-5 w-5" />
            <span>Internet & Technology</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="internet_speed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Internet Speed</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select internet speed" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="basic">Basic (up to 10 Mbps)</SelectItem>
                    <SelectItem value="standard">Standard (10-50 Mbps)</SelectItem>
                    <SelectItem value="high_speed">High Speed (50-100 Mbps)</SelectItem>
                    <SelectItem value="fiber">Fiber (100+ Mbps)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="virtual_tour_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Virtual Tour URL</FormLabel>
                <FormControl>
                  <Input 
                    placeholder={IMAGE_URLS.PLACEHOLDER} 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Link to 360° tour or video walkthrough
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Security Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Security Features</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="security_features"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Available Security Features</FormLabel>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {securityFeatures.map((feature) => (
                    <div 
                      key={feature}
                      className="flex items-center space-x-2 border rounded p-3 cursor-pointer hover:bg-slate-50"
                      onClick={() => handleSecurityFeatureToggle(feature)}
                    >
                      <Checkbox
                        checked={(field.value || []).includes(feature)}
                        onChange={() => {}} // Handled by parent onClick
                        id={`security-${feature}`}
                      />
                      <label htmlFor={`security-${feature}`} className="text-sm cursor-pointer">
                        {feature}
                      </label>
                    </div>
                  ))}
                </div>
                <FormDescription>
                  Select all security features available at the property
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Availability & Booking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Availability & Booking</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="semester_availability"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Semester Availability</FormLabel>
                <div className="flex flex-wrap gap-3">
                  {[
                    { value: 'semester_1' as const, label: 'First Semester' },
                    { value: 'semester_2' as const, label: 'Second Semester' },
                    { value: 'year_round' as const, label: 'Year Round' }
                  ].map((semester) => (
                    <div 
                      key={semester.value}
                      className="flex items-center space-x-2 border rounded p-3 cursor-pointer hover:bg-slate-50"
                      onClick={() => handleSemesterAvailabilityToggle(semester.value)}
                    >
                      <Checkbox
                        checked={(field.value || []).includes(semester.value)}
                        onChange={() => {}} // Handled by parent onClick
                        id={`semester-${semester.value}`}
                      />
                      <label htmlFor={`semester-${semester.value}`} className="text-sm cursor-pointer">
                        {semester.label}
                      </label>
                    </div>
                  ))}
                </div>
                <FormDescription>
                  Select when the property is available for booking
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedPropertyFields;
