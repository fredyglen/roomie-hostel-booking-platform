/**
 * Resend Email Test Page
 * 
 * This page provides a UI for testing Resend email integration.
 * Use this to verify that emails are being sent correctly before deploying to production.
 * 
 * IMPORTANT: Remove this page and its route before deploying to production!
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  sendBookingConfirmationEmail, 
  sendPasswordResetEmail,
  sendEmailVerificationEmail,
  sendPropertyApprovalEmail,
  isResendConfigured,
  type BookingConfirmationData,
  type PasswordResetData,
  type EmailVerificationData,
  type PropertyApprovalData,
} from '@/config/resend.config';

export default function ResendTestPage() {
  const [testEmail, setTestEmail] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const [results, setResults] = useState<{ type: string; success: boolean; message: string }[]>([]);

  const isConfigured = isResendConfigured();

  const addResult = (type: string, success: boolean, message: string) => {
    setResults(prev => [...prev, { type, success, message }]);
  };

  const handleTestBookingConfirmation = async () => {
    if (!testEmail) {
      alert('Please enter a test email address');
      return;
    }

    setLoading('booking');
    try {
      const data: BookingConfirmationData = {
        studentName: 'John Doe',
        propertyName: 'Sunshine Hostel',
        checkInDate: 'January 15, 2025',
        checkOutDate: 'May 30, 2025',
        totalAmount: 'GHS 5,000',
        bookingId: 'BK-2025-001',
      };

      const result = await sendBookingConfirmationEmail(testEmail, data);
      
      if (result.success) {
        addResult('Booking Confirmation', true, `Email sent successfully! Message ID: ${result.messageId}`);
      } else {
        addResult('Booking Confirmation', false, `Failed: ${result.error}`);
      }
    } catch (error) {
      addResult('Booking Confirmation', false, `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(null);
    }
  };

  const handleTestPasswordReset = async () => {
    if (!testEmail) {
      alert('Please enter a test email address');
      return;
    }

    setLoading('password');
    try {
      const data: PasswordResetData = {
        userName: 'John Doe',
        resetLink: 'https://roomie.com/reset-password?token=test123',
        expiresIn: '1 hour',
      };

      const result = await sendPasswordResetEmail(testEmail, data);
      
      if (result.success) {
        addResult('Password Reset', true, `Email sent successfully! Message ID: ${result.messageId}`);
      } else {
        addResult('Password Reset', false, `Failed: ${result.error}`);
      }
    } catch (error) {
      addResult('Password Reset', false, `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(null);
    }
  };

  const handleTestEmailVerification = async () => {
    if (!testEmail) {
      alert('Please enter a test email address');
      return;
    }

    setLoading('verification');
    try {
      const data: EmailVerificationData = {
        userName: 'John Doe',
        verificationLink: 'https://roomie.com/verify-email?token=test123',
      };

      const result = await sendEmailVerificationEmail(testEmail, data);
      
      if (result.success) {
        addResult('Email Verification', true, `Email sent successfully! Message ID: ${result.messageId}`);
      } else {
        addResult('Email Verification', false, `Failed: ${result.error}`);
      }
    } catch (error) {
      addResult('Email Verification', false, `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(null);
    }
  };

  const handleTestPropertyApproval = async () => {
    if (!testEmail) {
      alert('Please enter a test email address');
      return;
    }

    setLoading('approval');
    try {
      const data: PropertyApprovalData = {
        ownerName: 'Jane Smith',
        propertyName: 'Sunshine Hostel',
        propertyId: 'PROP-2025-001',
        dashboardLink: 'https://roomie.com/owner/dashboard',
      };

      const result = await sendPropertyApprovalEmail(testEmail, data);
      
      if (result.success) {
        addResult('Property Approval', true, `Email sent successfully! Message ID: ${result.messageId}`);
      } else {
        addResult('Property Approval', false, `Failed: ${result.error}`);
      }
    } catch (error) {
      addResult('Property Approval', false, `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Resend Email Test Page</h1>
      <p className="text-muted-foreground mb-6">
        Test your Resend email integration. Enter your email address and click the buttons below to send test emails.
      </p>

      {!isConfigured && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>
            ⚠️ Resend is not configured! Please add <code>VITE_RESEND_API_KEY</code> to your <code>.env</code> file.
          </AlertDescription>
        </Alert>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Test Email Address</CardTitle>
          <CardDescription>Enter the email address where you want to receive test emails</CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            type="email"
            placeholder="your.email@example.com"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            className="mb-4"
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Booking Confirmation</CardTitle>
            <CardDescription>Test booking confirmation email template</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleTestBookingConfirmation} 
              disabled={!isConfigured || loading === 'booking'}
              className="w-full"
            >
              {loading === 'booking' ? 'Sending...' : 'Send Test Email'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Password Reset</CardTitle>
            <CardDescription>Test password reset email template</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleTestPasswordReset} 
              disabled={!isConfigured || loading === 'password'}
              className="w-full"
            >
              {loading === 'password' ? 'Sending...' : 'Send Test Email'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email Verification</CardTitle>
            <CardDescription>Test email verification template</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleTestEmailVerification} 
              disabled={!isConfigured || loading === 'verification'}
              className="w-full"
            >
              {loading === 'verification' ? 'Sending...' : 'Send Test Email'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Property Approval</CardTitle>
            <CardDescription>Test property approval email template</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleTestPropertyApproval} 
              disabled={!isConfigured || loading === 'approval'}
              className="w-full"
            >
              {loading === 'approval' ? 'Sending...' : 'Send Test Email'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>Results from email sending tests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {results.map((result, index) => (
                <Alert key={index} variant={result.success ? 'default' : 'destructive'}>
                  <AlertDescription>
                    <strong>{result.type}:</strong> {result.message}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Alert className="mt-6">
        <AlertDescription>
          <strong>⚠️ IMPORTANT:</strong> Remember to remove this test page and its route before deploying to production!
        </AlertDescription>
      </Alert>
    </div>
  );
}

