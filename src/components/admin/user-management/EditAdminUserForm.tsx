/**
 * Edit Admin User Form Component
 * Apple-Grade implementation following BE CONSCIOUS standards
 * 
 * Business Purpose: Provides comprehensive form interface for editing existing
 * admin users with role updates, jurisdiction management, and validation
 * for the ROOMi platform admin portal
 * 
 * Technical Implementation: Uses react-hook-form with Zod validation,
 * pre-populates form with existing data, and maintains zero 'any' types
 * 
 * @author ROOMi Platform Team
 * @version 1.0.0
 * @compliance BE CONSCIOUS Apple-Grade Standards
 */

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
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
  Shield, 
  School,
  Crown,
  MapPin,
  AlertTriangle,
  Info,
  UserCheck,
  UserX
} from 'lucide-react';
import { 
  editAdminUserSchema, 
  EditAdminUserFormValues,
  GHANA_UNIVERSITIES,
  GhanaUniversityCode
} from '@/schemas/admin-user-schemas';
import { AdminUserProfile } from '@/services/admin/adminUserService';
import { AdminRoleType } from '@/types/auth';
import { logger } from '@/utils/enhanced-logger';

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface EditAdminUserFormProps {
  readonly user: AdminUserProfile;
  readonly onSubmit: (data: EditAdminUserFormValues) => void;
  readonly onCancel: () => void;
  readonly isSubmitting: boolean;
}

// ============================================================================
// EDIT ADMIN USER FORM COMPONENT
// ============================================================================

/**
 * Edit Admin User Form Component
 * Provides comprehensive form for editing existing admin users
 */
const EditAdminUserForm: React.FC<EditAdminUserFormProps> = ({
  user,
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  
  // Form setup with validation and pre-populated data
  const form = useForm<EditAdminUserFormValues>({
    resolver: zodResolver(editAdminUserSchema),
    defaultValues: {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      campusJurisdictions: user.jurisdictions
        .filter(j => j.type === 'campus')
        .map(j => j.code as GhanaUniversityCode),
      metadata: {
        access_level: user.role === 'supreme_admin' ? 'global' : 'campus',
        setup_type: 'production'
      },
      notes: '',
      isActive: user.isActive
    },
    mode: 'onChange'
  });

  // Watch role to conditionally show jurisdiction fields
  const selectedRole = form.watch('role');
  const selectedJurisdictions = form.watch('campusJurisdictions') || [];
  const isActive = form.watch('isActive');

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    // Update form when user prop changes
    form.reset({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      campusJurisdictions: user.jurisdictions
        .filter(j => j.type === 'campus')
        .map(j => j.code as GhanaUniversityCode),
      metadata: {
        access_level: user.role === 'supreme_admin' ? 'global' : 'campus',
        setup_type: 'production'
      },
      notes: '',
      isActive: user.isActive
    });
  }, [user, form]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleSubmit = (data: EditAdminUserFormValues) => {
    try {
      logger.info('Submitting admin user edit form', {
        userId: user.id,
        email: data.email,
        role: data.role,
        jurisdictionCount: data.campusJurisdictions?.length || 0
      });
      
      onSubmit(data);
    } catch (error) {
      logger.error('Error submitting admin user edit form', { error });
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

  const renderUserHeader = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Edit Admin User</span>
          </div>
          <div className="flex items-center space-x-2">
            {user.role === 'supreme_admin' ? (
              <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                <Crown className="h-3 w-3 mr-1" />
                Supreme Admin
              </Badge>
            ) : (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <School className="h-3 w-3 mr-1" />
                Campus Admin
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-purple-600 font-medium">
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-sm text-gray-600">{user.email}</p>
            <p className="text-xs text-gray-500">
              Created {user.createdAt.toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
                    placeholder="John"
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
                    placeholder="Doe"
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

  const renderRoleAndStatus = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5" />
          <span>Role & Status</span>
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
              <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
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

        {/* Active Status */}
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Account Status
                </FormLabel>
                <FormDescription>
                  {isActive ? 'User can sign in and access the admin portal' : 'User account is disabled and cannot sign in'}
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isSubmitting}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Status Badge */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Current Status:</span>
          {isActive ? (
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <UserCheck className="h-3 w-3 mr-1" />
              Active
            </Badge>
          ) : (
            <Badge className="bg-red-100 text-red-800 border-red-200">
              <UserX className="h-3 w-3 mr-1" />
              Inactive
            </Badge>
          )}
        </div>
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
                  placeholder="Optional notes about this admin user update..."
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
        {isSubmitting ? 'Updating...' : 'Update Admin User'}
      </Button>
    </div>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {renderUserHeader()}
        {renderBasicInformation()}
        {renderRoleAndStatus()}
        {renderJurisdictionAssignment()}
        {renderAdditionalInformation()}
        {renderFormActions()}
      </form>
    </Form>
  );
};

export default EditAdminUserForm;
