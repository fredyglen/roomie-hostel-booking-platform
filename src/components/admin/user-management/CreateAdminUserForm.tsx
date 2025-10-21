/**
 * Create Admin User Form Component
 * Apple-Grade implementation following BE CONSCIOUS standards
 * 
 * Business Purpose: Provides comprehensive form interface for creating new
 * admin users with role assignment, jurisdiction management, and validation
 * for the ROOMi platform admin portal
 * 
 * Technical Implementation: Uses react-hook-form with Zod validation,
 * implements real-time validation, and maintains zero 'any' types throughout
 * 
 * @author ROOMi Platform Team
 * @version 1.0.0
 * @compliance BE CONSCIOUS Apple-Grade Standards
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Shield, 
  School,
  Crown,
  MapPin,
  AlertTriangle,
  Info,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  createAdminUserSchema, 
  CreateAdminUserFormValues,
  getUniversityOptions,
  GHANA_UNIVERSITIES,
  GhanaUniversityCode
} from '@/schemas/admin-user-schemas';
import { AdminRoleType } from '@/types/auth';
import { logger } from '@/utils/enhanced-logger';

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface CreateAdminUserFormProps {
  readonly onSubmit: (data: CreateAdminUserFormValues) => void;
  readonly onCancel: () => void;
  readonly isSubmitting: boolean;
}

// ============================================================================
// CREATE ADMIN USER FORM COMPONENT
// ============================================================================

/**
 * Create Admin User Form Component
 * Provides comprehensive form for creating new admin users
 */
const CreateAdminUserForm: React.FC<CreateAdminUserFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  // Component state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form setup with validation
  const form = useForm<CreateAdminUserFormValues>({
    resolver: zodResolver(createAdminUserSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
      role: 'campus_admin',
      campusJurisdictions: [],
      metadata: {
        access_level: 'campus',
        setup_type: 'production'
      },
      notes: ''
    },
    mode: 'onChange'
  });

  // Watch role to conditionally show jurisdiction fields
  const selectedRole = form.watch('role');
  const selectedJurisdictions = form.watch('campusJurisdictions') || [];

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleSubmit = (data: CreateAdminUserFormValues) => {
    try {
      logger.info('Submitting admin user creation form', {
        email: data.email,
        role: data.role,
        jurisdictionCount: data.campusJurisdictions?.length || 0
      });
      
      onSubmit(data);
    } catch (error) {
      logger.error('Error submitting admin user form', { error });
    }
  };

  const handleJurisdictionToggle = (universityCode: GhanaUniversityCode, checked: boolean) => {
    const currentJurisdictions = form.getValues('campusJurisdictions') || [];
    
    if (checked) {
      form.setValue('campusJurisdictions', [...currentJurisdictions, universityCode]);
    } else {
      form.setValue('campusJurisdictions', 
        currentJurisdictions.filter(code => code !== universityCode)
      );
    }
    
    // Trigger validation
    form.trigger('campusJurisdictions');
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderBasicInformation = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span>Basic Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Gladys"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Kyei Baffour"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    {...field}
                    type="email"
                    placeholder="admin@roomi.com"
                    className="pl-10"
                    disabled={isSubmitting}
                  />
                </div>
              </FormControl>
              <FormDescription>
                Must be from an authorized domain (roomi.com or university domain)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone Field */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    {...field}
                    type="tel"
                    placeholder="+233200000000"
                    className="pl-10"
                    disabled={isSubmitting}
                  />
                </div>
              </FormControl>
              <FormDescription>
                Ghana phone number format (+233XXXXXXXXX or 0XXXXXXXXX)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );

  const renderSecurityInformation = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Lock className="h-5 w-5" />
          <span>Security Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Password Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormDescription>
                  Minimum 8 characters with uppercase, lowercase, number, and special character
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      {...field}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderRoleAndPermissions = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5" />
          <span>Role & Permissions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Role Selection */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Admin Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select admin role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="supreme_admin">
                    <div className="flex items-center space-x-2">
                      <Crown className="h-4 w-4 text-purple-600" />
                      <span>Supreme Admin</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="campus_admin">
                    <div className="flex items-center space-x-2">
                      <School className="h-4 w-4 text-green-600" />
                      <span>Campus Admin</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                {selectedRole === 'supreme_admin' 
                  ? 'Global platform administrator with full access to all features and data'
                  : 'Campus-specific administrator for property approval and student verification'
                }
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Role Information */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            {selectedRole === 'supreme_admin' ? (
              <div>
                <strong>Supreme Admin Permissions:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  <li>Global platform management</li>
                  <li>User and admin management</li>
                  <li>System configuration</li>
                  <li>Financial reporting and analytics</li>
                  <li>Audit access and compliance monitoring</li>
                </ul>
              </div>
            ) : (
              <div>
                <strong>Campus Admin Permissions:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  <li>Campus-specific property approval</li>
                  <li>Student verification for assigned universities</li>
                  <li>Local analytics and reporting</li>
                  <li>Campus dispute resolution</li>
                  <li>University integration management</li>
                </ul>
              </div>
            )}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );

  const renderJurisdictionAssignment = () => {
    if (selectedRole !== 'campus_admin') return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>University Assignment</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="campusJurisdictions"
            render={() => (
              <FormItem>
                <FormLabel>Assigned Universities</FormLabel>
                <FormDescription>
                  Select the Ghana universities this campus admin will manage
                </FormDescription>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {Object.entries(GHANA_UNIVERSITIES).map(([code, university]) => (
                    <div key={code} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Checkbox
                        id={code}
                        checked={selectedJurisdictions.includes(code as GhanaUniversityCode)}
                        onCheckedChange={(checked) => 
                          handleJurisdictionToggle(code as GhanaUniversityCode, checked as boolean)
                        }
                        disabled={isSubmitting}
                      />
                      <div className="flex-1">
                        <Label htmlFor={code} className="font-medium cursor-pointer">
                          {university.code}
                        </Label>
                        <p className="text-sm text-gray-600">{university.name}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {university.location}, {university.region}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    );
  };

  const renderAdditionalInformation = () => (
    <Card>
      <CardHeader>
        <CardTitle>Additional Information</CardTitle>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Administrative Notes</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Optional notes about this admin user..."
                  className="min-h-[100px]"
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                Internal notes for administrative purposes (max 1000 characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );

  const renderFormActions = () => (
    <div className="flex items-center justify-end space-x-4 pt-6 border-t">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={isSubmitting || !form.formState.isValid}
        className="bg-purple-600 hover:bg-purple-700"
      >
        {isSubmitting ? 'Creating...' : 'Create Admin User'}
      </Button>
    </div>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {renderBasicInformation()}
        {renderSecurityInformation()}
        {renderRoleAndPermissions()}
        {renderJurisdictionAssignment()}
        {renderAdditionalInformation()}
        {renderFormActions()}
      </form>
    </Form>
  );
};

export default CreateAdminUserForm;
