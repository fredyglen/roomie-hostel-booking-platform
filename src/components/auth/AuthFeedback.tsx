/**
 * Authentication Feedback System
 * Apple-Level user experience with comprehensive feedback
 *
 * @fileoverview Professional authentication feedback with success/error states
 * @author ROOMi Development Team
 * @version 1.0.0
 * @since 2025-06-21
 */

import React from 'react';
import { toast } from '@/components/ui/use-toast';

export type FeedbackType = 'success' | 'error' | 'warning' | 'info';

/**
 * Apple-Level Authentication Toast System
 * Uses the existing toast infrastructure with proper Apple-level styling
 */
export const AuthToast = {
  /**
   * Show success toast with Apple-level design
   */
  success: (title: string, description?: string) => {
    toast({
      variant: "success",
      title,
      description,
      duration: 4000,
    });
  },

  /**
   * Show error toast with Apple-level design
   */
  error: (title: string, description?: string) => {
    toast({
      variant: "destructive",
      title,
      description,
      duration: 5000,
    });
  },

  /**
   * Show warning toast with Apple-level design
   */
  warning: (title: string, description?: string) => {
    toast({
      variant: "warning",
      title,
      description,
      duration: 4000,
    });
  },

  /**
   * Show info toast with Apple-level design
   */
  info: (title: string, description?: string) => {
    toast({
      variant: "default",
      title,
      description,
      duration: 3000,
    });
  },
};

/**
 * Authentication Success Feedback
 */
export const showAuthSuccess = (userName?: string, userRole?: string) => {
  AuthToast.success(
    "Welcome Back!",
    `Successfully signed in${userName ? ` as ${userName}` : ''}${userRole ? ` (${userRole})` : ''}. Redirecting to your dashboard...`
  );
};

/**
 * Authentication Error Feedback
 */
export const showAuthError = (error: string) => {
  AuthToast.error(
    "Sign In Failed",
    error || "Please check your credentials and try again."
  );
};

/**
 * Authentication Loading Feedback
 */
export const showAuthLoading = (message: string = "Authenticating...") => {
  AuthToast.info(
    "Signing In",
    message
  );
};

/**
 * Registration Success Feedback
 */
export const showRegistrationSuccess = (email?: string) => {
  AuthToast.success(
    "Registration Successful!",
    `Account created successfully${email ? ` for ${email}` : ''}. Please check your email to verify your account.`
  );
};

/**
 * Registration Error Feedback
 */
export const showRegistrationError = (error: string) => {
  AuthToast.error(
    "Registration Failed",
    error || "Please check your information and try again."
  );
};

/**
 * Hook for managing authentication feedback state
 */
export const useAuthFeedback = () => {
  return {
    showSuccess: showAuthSuccess,
    showError: showAuthError,
    showLoading: showAuthLoading,
    showRegistrationSuccess,
    showRegistrationError,
  };
};

export default AuthToast;
