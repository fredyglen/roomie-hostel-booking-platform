/**
 * Resend Email Configuration for ROOMie
 * 
 * This file contains centralized Resend email service configuration including:
 * - Email client initialization
 * - Email template helpers
 * - Email sending utilities
 * - Error handling for email operations
 */

import { Resend } from 'resend';
import { ErrorHandler } from '@/utils/ErrorHandler';

/**
 * Email configuration interface
 */
export interface EmailConfig {
  from: string;
  replyTo?: string;
}

/**
 * Email template data interfaces
 */
export interface BookingConfirmationData {
  studentName: string;
  propertyName: string;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: string;
  bookingId: string;
}

export interface PasswordResetData {
  userName: string;
  resetLink: string;
  expiresIn: string;
}

export interface EmailVerificationData {
  userName: string;
  verificationLink: string;
}

export interface PropertyApprovalData {
  ownerName: string;
  propertyName: string;
  propertyId: string;
  dashboardLink: string;
}

/**
 * Initialize Resend client
 */
function initializeResend(): Resend | null {
  const apiKey = import.meta.env.VITE_RESEND_API_KEY;
  
  if (!apiKey) {
    if (import.meta.env.DEV) {
      console.warn('[Resend] API key not configured. Email sending disabled.');
    }
    return null;
  }

  try {
    return new Resend(apiKey);
  } catch (error) {
    ErrorHandler.handle(error, 'Failed to initialize Resend client', {
      showUser: false,
    });
    return null;
  }
}

// Initialize Resend client
const resend = initializeResend();

/**
 * Default email configuration
 */
const DEFAULT_FROM_EMAIL = 'ROOMie <noreply@yourdomain.com>'; // Update with your verified domain
const DEFAULT_REPLY_TO = 'support@yourdomain.com'; // Update with your support email

/**
 * Check if Resend is configured and ready
 */
export function isResendConfigured(): boolean {
  return resend !== null;
}

/**
 * Send a generic email
 */
export async function sendEmail(params: {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
  tags?: { name: string; value: string }[];
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!resend) {
    const error = 'Resend is not configured. Please add VITE_RESEND_API_KEY to your environment variables.';
    console.error('[Resend]', error);
    return { success: false, error };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: params.from || DEFAULT_FROM_EMAIL,
      to: Array.isArray(params.to) ? params.to : [params.to],
      subject: params.subject,
      html: params.html,
      reply_to: params.replyTo || DEFAULT_REPLY_TO,
      tags: params.tags,
    });

    if (error) {
      ErrorHandler.handle(error, 'Failed to send email', {
        showUser: false,
        context: { to: params.to, subject: params.subject },
      });
      return { success: false, error: error.message };
    }

    console.log('[Resend] Email sent successfully:', data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    ErrorHandler.handle(error, 'Unexpected error sending email', {
      showUser: false,
      context: { to: params.to, subject: params.subject },
    });
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Send booking confirmation email
 */
export async function sendBookingConfirmationEmail(
  to: string,
  data: BookingConfirmationData
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Booking Confirmed! 🎉</h1>
        </div>
        
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px; margin-bottom: 20px;">Hi ${data.studentName},</p>
          
          <p style="font-size: 16px; margin-bottom: 20px;">Great news! Your booking has been confirmed.</p>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <h2 style="margin-top: 0; color: #1f2937; font-size: 20px;">Booking Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Property:</td>
                <td style="padding: 8px 0; font-weight: 600;">${data.propertyName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Check-in:</td>
                <td style="padding: 8px 0; font-weight: 600;">${data.checkInDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Check-out:</td>
                <td style="padding: 8px 0; font-weight: 600;">${data.checkOutDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Total Amount:</td>
                <td style="padding: 8px 0; font-weight: 600; color: #3B82F6;">${data.totalAmount}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Booking ID:</td>
                <td style="padding: 8px 0; font-family: monospace; font-size: 14px;">${data.bookingId}</td>
              </tr>
            </table>
          </div>
          
          <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">If you have any questions, please don't hesitate to contact us.</p>
          
          <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
            Best regards,<br>
            <strong>The ROOMie Team</strong>
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; padding: 20px; color: #9ca3af; font-size: 12px;">
          <p>© 2025 ROOMie Campus Nest. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: `Booking Confirmed - ${data.propertyName}`,
    html,
    tags: [
      { name: 'category', value: 'booking_confirmation' },
      { name: 'booking_id', value: data.bookingId },
    ],
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  to: string,
  data: PasswordResetData
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Request</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h1 style="color: #1f2937; margin-top: 0; font-size: 24px;">Password Reset Request</h1>

          <p style="font-size: 16px; margin-bottom: 20px;">Hi ${data.userName},</p>

          <p style="font-size: 16px; margin-bottom: 20px;">We received a request to reset your password. Click the button below to create a new password:</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.resetLink}" style="display: inline-block; background: #3B82F6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Reset Password</a>
          </div>

          <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">This link will expire in ${data.expiresIn}.</p>

          <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>

          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin-top: 20px; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px; color: #92400e;">
              <strong>Security tip:</strong> Never share your password reset link with anyone.
            </p>
          </div>

          <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
            Best regards,<br>
            <strong>The ROOMie Team</strong>
          </p>
        </div>

        <div style="text-align: center; margin-top: 20px; padding: 20px; color: #9ca3af; font-size: 12px;">
          <p>© 2025 ROOMie Campus Nest. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: 'Reset Your Password - ROOMie',
    html,
    tags: [{ name: 'category', value: 'password_reset' }],
  });
}

/**
 * Send email verification email
 */
export async function sendEmailVerificationEmail(
  to: string,
  data: EmailVerificationData
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h1 style="color: #1f2937; margin-top: 0; font-size: 24px;">Verify Your Email Address</h1>

          <p style="font-size: 16px; margin-bottom: 20px;">Hi ${data.userName},</p>

          <p style="font-size: 16px; margin-bottom: 20px;">Welcome to ROOMie! Please verify your email address to complete your registration.</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.verificationLink}" style="display: inline-block; background: #3B82F6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Verify Email</a>
          </div>

          <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">If you didn't create an account with ROOMie, you can safely ignore this email.</p>

          <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
            Best regards,<br>
            <strong>The ROOMie Team</strong>
          </p>
        </div>

        <div style="text-align: center; margin-top: 20px; padding: 20px; color: #9ca3af; font-size: 12px;">
          <p>© 2025 ROOMie Campus Nest. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: 'Verify Your Email - ROOMie',
    html,
    tags: [{ name: 'category', value: 'email_verification' }],
  });
}

/**
 * Send property approval notification email
 */
export async function sendPropertyApprovalEmail(
  to: string,
  data: PropertyApprovalData
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Property Approved</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Property Approved! ✅</h1>
        </div>

        <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px; margin-bottom: 20px;">Hi ${data.ownerName},</p>

          <p style="font-size: 16px; margin-bottom: 20px;">Great news! Your property <strong>${data.propertyName}</strong> has been approved and is now live on ROOMie.</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.dashboardLink}" style="display: inline-block; background: #3B82F6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">View in Dashboard</a>
          </div>

          <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">Students can now discover and book your property. You'll receive notifications when bookings are made.</p>

          <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
            Best regards,<br>
            <strong>The ROOMie Team</strong>
          </p>
        </div>

        <div style="text-align: center; margin-top: 20px; padding: 20px; color: #9ca3af; font-size: 12px;">
          <p>© 2025 ROOMie Campus Nest. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: `Property Approved - ${data.propertyName}`,
    html,
    tags: [
      { name: 'category', value: 'property_approval' },
      { name: 'property_id', value: data.propertyId },
    ],
  });
}

