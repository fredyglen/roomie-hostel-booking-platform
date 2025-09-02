/**
 * 🍎 APPLE-GRADE AUTHENTICATION SERVICE
 * BE CONSCIOUS Standards Compliance - Zero Tolerance Implementation
 * 
 * Replaces basic try-catch error handling with comprehensive Result types
 * and branded type safety throughout authentication flows.
 * 
 * @version 1.0.0
 * @compliance BE_CONSCIOUS_APPLE_GRADE
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/enhanced-logger';
import {
  Result,
  AsyncResult,
  success,
  failure,
  UserId,
  SessionId,
  EmailAddress,
  UserName,
  Timestamp,
  Duration,
  createUserId,
  createSessionId,
  createEmailAddress,
  createUserName,
  createTimestamp,
  createDuration,
  SignInResult,
  SignUpResult,
  InvalidCredentialsError,
  NetworkError,
  ServiceUnavailableError,
  ValidationError,
  UserProfile,
  DatabaseError
} from '@/types/apple-grade-foundation';

// ============================================================================
// AUTHENTICATION REQUEST TYPES
// ============================================================================

export interface AuthCredentials {
  readonly email: EmailAddress;
  readonly password: string;
}

export interface SignUpData {
  readonly email: EmailAddress;
  readonly password: string;
  readonly firstName: UserName;
  readonly lastName: UserName;
  readonly role: 'student' | 'owner' | 'agent';
}

export interface AuthSession {
  readonly userId: UserId;
  readonly sessionId: SessionId;
  readonly email: EmailAddress;
  readonly role: string;
  readonly expiresAt: Timestamp;
}

// ============================================================================
// APPLE-GRADE AUTHENTICATION SERVICE
// ============================================================================

export class AppleGradeAuthService {
  
  /**
   * Sign in user with comprehensive error handling
   * Replaces basic try-catch with Result types
   */
  static async signIn(credentials: AuthCredentials): Promise<SignInResult> {
    logger.info('Authentication attempt initiated', { 
      email: credentials.email,
      timestamp: new Date().toISOString()
    });

    // Validate credentials format
    const validationResult = this.validateCredentials(credentials);
    if (!validationResult.success) {
      return failure(validationResult.error);
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        logger.error('Authentication failed', { 
          error: error.message,
          email: credentials.email 
        });

        // Categorize authentication errors
        return failure(this.categorizeAuthError(error));
      }

      if (!data.user || !data.session) {
        logger.error('Authentication returned incomplete data', { 
          hasUser: !!data.user,
          hasSession: !!data.session 
        });

        return failure({
          type: 'SERVICE_UNAVAILABLE',
          message: 'Authentication service returned incomplete data',
          estimatedRecovery: createTimestamp(
            new Date(Date.now() + 5 * 60 * 1000).toISOString()
          )
        } as ServiceUnavailableError);
      }

      // Fetch user profile with error handling
      const profileResult = await this.fetchUserProfile(createUserId(data.user.id));
      if (!profileResult.success) {
        logger.warn('Authentication succeeded but profile fetch failed', {
          userId: data.user.id,
          error: profileResult.error
        });
        // Continue with basic user data
      }

      logger.info('Authentication successful', { 
        userId: data.user.id,
        sessionId: data.session.access_token.substring(0, 10) + '...'
      });

      return success({
        user: createUserId(data.user.id),
        session: createSessionId(data.session.access_token)
      });

    } catch (error) {
      logger.error('Unexpected authentication error', { error });
      
      return failure({
        type: 'NETWORK_ERROR',
        message: 'Network error during authentication',
        retryable: true,
        retryAfter: createDuration(5000) // 5 seconds
      } as NetworkError);
    }
  }

  /**
   * Sign up user with comprehensive validation and error handling
   */
  static async signUp(signUpData: SignUpData): Promise<SignUpResult> {
    logger.info('User registration initiated', { 
      email: signUpData.email,
      role: signUpData.role 
    });

    // Validate sign up data
    const validationResult = this.validateSignUpData(signUpData);
    if (!validationResult.success) {
      return failure(validationResult.error);
    }

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: signUpData.email,
        password: signUpData.password,
      });

      if (authError) {
        logger.error('User registration failed', { 
          error: authError.message,
          email: signUpData.email 
        });

        return failure(this.categorizeAuthError(authError));
      }

      if (!authData.user) {
        logger.error('Registration returned no user');
        return failure({
          type: 'SERVICE_UNAVAILABLE',
          message: 'Registration service unavailable',
          estimatedRecovery: createTimestamp(
            new Date(Date.now() + 10 * 60 * 1000).toISOString()
          )
        } as ServiceUnavailableError);
      }

      // Create user profile
      const profileResult = await this.createUserProfile(
        createUserId(authData.user.id),
        signUpData
      );

      if (!profileResult.success) {
        logger.error('Profile creation failed after successful auth', {
          userId: authData.user.id,
          error: profileResult.error
        });
        // Note: User auth account exists but profile creation failed
        // This requires manual cleanup or retry mechanism
      }

      logger.info('User registration successful', { 
        userId: authData.user.id,
        requiresVerification: !authData.user.email_confirmed_at
      });

      return success({
        user: createUserId(authData.user.id),
        requiresVerification: !authData.user.email_confirmed_at
      });

    } catch (error) {
      logger.error('Unexpected registration error', { error });
      
      return failure({
        type: 'NETWORK_ERROR',
        message: 'Network error during registration',
        retryable: true,
        retryAfter: createDuration(5000)
      } as NetworkError);
    }
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private static validateCredentials(credentials: AuthCredentials): Result<void, ValidationError> {
    if (!credentials.email || credentials.email.length === 0) {
      return failure({
        type: 'VALIDATION_ERROR',
        field: 'email',
        message: 'Email is required',
        userFriendlyMessage: 'Please enter your email address',
        code: 'EMAIL_REQUIRED'
      });
    }

    if (!credentials.password || credentials.password.length < 6) {
      return failure({
        type: 'VALIDATION_ERROR',
        field: 'password',
        message: 'Password must be at least 6 characters',
        userFriendlyMessage: 'Password must be at least 6 characters long',
        code: 'PASSWORD_TOO_SHORT'
      });
    }

    return success(undefined);
  }

  private static validateSignUpData(signUpData: SignUpData): Result<void, ValidationError> {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signUpData.email)) {
      return failure({
        type: 'VALIDATION_ERROR',
        field: 'email',
        message: 'Invalid email format',
        userFriendlyMessage: 'Please enter a valid email address',
        code: 'INVALID_EMAIL_FORMAT'
      });
    }

    // Name validation
    if (!signUpData.firstName || signUpData.firstName.length < 2) {
      return failure({
        type: 'VALIDATION_ERROR',
        field: 'firstName',
        message: 'First name must be at least 2 characters',
        userFriendlyMessage: 'Please enter your first name',
        code: 'FIRST_NAME_TOO_SHORT'
      });
    }

    return success(undefined);
  }

  private static categorizeAuthError(error: unknown): InvalidCredentialsError | NetworkError | ServiceUnavailableError {
    const errorMessage = (error && typeof error === 'object' && 'message' in error)
      ? String((error as { message: unknown }).message).toLowerCase()
      : '';

    if (errorMessage.includes('invalid') || errorMessage.includes('credentials')) {
      return {
        type: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password',
        field: errorMessage.includes('email') ? 'email' : 'password'
      };
    }

    if (errorMessage.includes('network') || errorMessage.includes('timeout')) {
      return {
        type: 'NETWORK_ERROR',
        message: 'Network connection error',
        retryable: true,
        retryAfter: createDuration(3000)
      };
    }

    return {
      type: 'SERVICE_UNAVAILABLE',
      message: 'Authentication service temporarily unavailable',
      estimatedRecovery: createTimestamp(
        new Date(Date.now() + 5 * 60 * 1000).toISOString()
      )
    };
  }

  private static async fetchUserProfile(userId: UserId): AsyncResult<UserProfile, DatabaseError> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        return failure(error);
      }

      return success(data);
    } catch (error) {
      return failure(error);
    }
  }

  private static async createUserProfile(userId: UserId, signUpData: SignUpData): AsyncResult<void, DatabaseError> {
    try {
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          first_name: signUpData.firstName,
          last_name: signUpData.lastName,
          role: signUpData.role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        return failure(error);
      }

      return success(undefined);
    } catch (error) {
      return failure(error);
    }
  }
}
