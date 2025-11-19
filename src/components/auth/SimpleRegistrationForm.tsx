// Simple Registration Form Component
// Single-step registration without document verification

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader } from 'lucide-react';

interface RegisterFormValues {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'student' | 'owner';
}

interface SimpleRegistrationFormProps {
  form: UseFormReturn<RegisterFormValues>;
  onSubmit: (values: RegisterFormValues) => Promise<void>;
  isSubmitting: boolean;
}

const SimpleRegistrationForm: React.FC<SimpleRegistrationFormProps> = ({
  form,
  onSubmit,
  isSubmitting
}) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} style={{ marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel style={{
                  color: '#202124',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '6px',
                  display: 'block'
                }}>First Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Bismark"
                    style={{
                      width: '100%',
                      height: '44px',
                      border: '1px solid #dadce0',
                      borderRadius: '8px',
                      padding: '0 14px',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                    {...field}
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
                <FormLabel style={{
                  color: '#202124',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '6px',
                  display: 'block'
                }}>Last Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Agyiri"
                    style={{
                      width: '100%',
                      height: '44px',
                      border: '1px solid #dadce0',
                      borderRadius: '8px',
                      padding: '0 14px',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem style={{ marginBottom: '16px' }}>
              <FormLabel style={{
                color: '#202124',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '6px',
                display: 'block'
              }}>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="you@university.edu"
                  style={{
                    width: '100%',
                    height: '44px',
                    border: '1px solid #dadce0',
                    borderRadius: '8px',
                    padding: '0 14px',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem style={{ marginBottom: '16px' }}>
              <FormLabel style={{
                color: '#202124',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '6px',
                display: 'block'
              }}>Phone (optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="+233 50 123 4567"
                  style={{
                    width: '100%',
                    height: '44px',
                    border: '1px solid #dadce0',
                    borderRadius: '8px',
                    padding: '0 14px',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem style={{ marginBottom: '16px' }}>
              <FormLabel style={{
                color: '#202124',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '6px',
                display: 'block'
              }}>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="new-password"
                  style={{
                    width: '100%',
                    height: '44px',
                    border: '1px solid #dadce0',
                    borderRadius: '8px',
                    padding: '0 14px',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem style={{ marginBottom: '16px' }}>
              <FormLabel style={{
                color: '#202124',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '6px',
                display: 'block'
              }}>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="new-password"
                  style={{
                    width: '100%',
                    height: '44px',
                    border: '1px solid #dadce0',
                    borderRadius: '8px',
                    padding: '0 14px',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem style={{ marginBottom: '20px' }}>
              <FormLabel style={{
                color: '#202124',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '8px',
                display: 'block'
              }}>I am a:</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
                >
                  <FormItem style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                    <FormControl>
                      <RadioGroupItem value="student" />
                    </FormControl>
                    <FormLabel style={{
                      fontWeight: 'normal',
                      fontSize: '14px',
                      color: '#5f6368',
                      margin: 0,
                      cursor: 'pointer'
                    }}>Student looking for accommodation</FormLabel>
                  </FormItem>
                  <FormItem style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                    <FormControl>
                      <RadioGroupItem value="owner" />
                    </FormControl>
                    <FormLabel style={{
                      fontWeight: 'normal',
                      fontSize: '14px',
                      color: '#5f6368',
                      margin: 0,
                      cursor: 'pointer'
                    }}>Property owner/agent</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          style={{
            width: '100%',
            height: '44px',
            background: isSubmitting ? '#6b7280' : '#0f68fd',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          disabled={isSubmitting}
        >
          {isSubmitting && (
            <Loader className="animate-spin" size={16} />
          )}
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </Form>
  );
};

export default SimpleRegistrationForm;
