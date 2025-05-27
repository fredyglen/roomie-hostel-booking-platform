
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { PropertyFormValues } from './PropertyFormSchema';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Shield, Car, Wifi, Users, FileText, Phone } from 'lucide-react';

interface EnhancedPropertyFieldsProps {
  form: UseFormReturn<PropertyFormValues>;
  propertyCategory: 'Hostel' | 'Homestel' | 'Apartment';
}

const EnhancedPropertyFields: React.FC<EnhancedPropertyFieldsProps> = ({ form, propertyCategory }) => {
  const verificationOptions = [
    { value: 'pending', label: 'Pending Verification' },
    { value: 'verified', label: 'Verified' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const genderOptions = [
    { value: 'mixed', label: 'Mixed (All Genders)' },
    { value: 'male', label: 'Male Only' },
    { value: 'female', label: 'Female Only' }
  ];

  const semesterOptions = [
    { value: 'semester_1', label: 'First Semester' },
    { value: 'semester_2', label: 'Second Semester' },
    { value: 'year_round', label: 'Year Round' }
  ];

  const cancellationPolicyOptions = [
    { value: 'flexible', label: 'Flexible - Free cancellation' },
    { value: 'moderate', label: 'Moderate - Partial refund' },
    { value: 'strict', label: 'Strict - No refund' }
  ];

  const petPolicyOptions = [
    { value: 'not_allowed', label: 'Pets Not Allowed' },
    { value: 'allowed', label: 'Pets Allowed' },
    { value: 'cats_only', label: 'Cats Only' },
    { value: 'small_pets', label: 'Small Pets Only' }
  ];

  const securityFeatures = [
    'CCTV Surveillance',
    '24/7 Security Guards',
    'Electronic Gate Access',
    'Visitor Registration',
    'Emergency Alarm System',
    'Biometric Access',
    'Security Lighting',
    'Perimeter Fencing'
  ];

  const internetSpeeds = [
    { value: 'basic', label: 'Basic (1-10 Mbps)' },
    { value: 'standard', label: 'Standard (10-50 Mbps)' },
    { value: 'high_speed', label: 'High Speed (50+ Mbps)' },
    { value: 'fiber', label: 'Fiber Optic' }
  ];

  return (
    <div className="space-y-6">
      {/* Verification & Contact Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Verification & Emergency Contact
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
                  <Select onValueChange={field.onChange} defaultValue={field.value || 'pending'}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select verification status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {verificationOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
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
                  <Select onValueChange={field.onChange} defaultValue={field.value || 'mixed'}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender restriction" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {genderOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="emergency_contact_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emergency Contact Name</FormLabel>
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
                  <FormLabel>Emergency Contact Phone</FormLabel>
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

      {/* Accessibility & Policies Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Accessibility & Policies
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      Property has wheelchair access, ramps, or other accessibility features
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pet_policy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pet Policy</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value || 'not_allowed'}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pet policy" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {petPolicyOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="cancellation_policy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cancellation Policy</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || 'moderate'}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select cancellation policy" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {cancellationPolicyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Define the terms for booking cancellations and refunds
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Parking & Security Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="w-5 h-5" />
            Parking & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="parking_available"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Parking Available</FormLabel>
                    <FormDescription>
                      Property has parking facilities
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
                    <FormLabel>Parking Cost (₵/month)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="e.g. 100" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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
                      {internetSpeeds.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="security_features"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Security Features</FormLabel>
                <FormDescription>
                  Select all security features available at the property
                </FormDescription>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                  {securityFeatures.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <Checkbox
                        id={feature}
                        checked={(field.value || []).includes(feature)}
                        onCheckedChange={(checked) => {
                          const currentFeatures = field.value || [];
                          if (checked) {
                            field.onChange([...currentFeatures, feature]);
                          } else {
                            field.onChange(currentFeatures.filter(f => f !== feature));
                          }
                        }}
                      />
                      <label htmlFor={feature} className="text-sm font-medium">
                        {feature}
                      </label>
                    </div>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Academic & Availability Section */}
      {propertyCategory === 'Hostel' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Academic Availability
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="semester_availability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Semester Availability</FormLabel>
                  <FormDescription>
                    Select which semesters this hostel is available for booking
                  </FormDescription>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    {semesterOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={option.value}
                          checked={(field.value || []).includes(option.value)}
                          onCheckedChange={(checked) => {
                            const currentAvailability = field.value || [];
                            if (checked) {
                              field.onChange([...currentAvailability, option.value]);
                            } else {
                              field.onChange(currentAvailability.filter(s => s !== option.value));
                            }
                          }}
                        />
                        <label htmlFor={option.value} className="text-sm font-medium">
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      )}

      {/* Virtual Tour Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="w-5 h-5" />
            Virtual Tour (Premium Feature)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="virtual_tour_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Virtual Tour URL</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://yourvirtualtour.com/property"
                    disabled
                    className="bg-gray-100"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Virtual tour feature coming soon! This will be available for premium subscribers.
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
