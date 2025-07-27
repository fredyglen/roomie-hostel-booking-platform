/**
 * Admin Setup Utility for ROOMi Platform
 * Ensures demo admin user exists with correct permissions
 * Following BE CONSCIOUS zero tolerance for missing admin access
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from './enhanced-logger';

export interface AdminSetupResult {
  readonly success: boolean;
  readonly message: string;
  readonly adminExists: boolean;
  readonly roleCorrect: boolean;
}

/**
 * Ensure demo admin user exists with correct role
 * Apple-grade error handling with comprehensive validation
 */
export async function ensureDemoAdminExists(): Promise<AdminSetupResult> {
  const adminEmail = 'admin@roomi.com';
  const adminPassword = 'password123';

  try {
    logger.info('Starting admin setup verification...');

    // Step 1: Check if admin profile exists
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from('profiles')
      .select('id, email, role')
      .eq('email', adminEmail)
      .single();

    if (profileCheckError && profileCheckError.code !== 'PGRST116') {
      logger.error('Database error checking admin profile', profileCheckError);
      return {
        success: false,
        message: `Database error: ${profileCheckError.message}`,
        adminExists: false,
        roleCorrect: false
      };
    }

    // Step 2: If profile exists, verify role
    if (existingProfile) {
      if (existingProfile.role === 'admin') {
        logger.info('Demo admin user exists with correct role');
        return {
          success: true,
          message: 'Demo admin user is properly configured',
          adminExists: true,
          roleCorrect: true
        };
      } else {
        // Fix incorrect role
        logger.warn('Admin user exists but has wrong role, updating...', { 
          currentRole: existingProfile.role 
        });
        
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', existingProfile.id);

        if (updateError) {
          logger.error('Failed to update admin role', updateError);
          return {
            success: false,
            message: `Failed to update admin role: ${updateError.message}`,
            adminExists: true,
            roleCorrect: false
          };
        }
        
        logger.info('Admin user role updated successfully');
        return {
          success: true,
          message: 'Admin role corrected successfully',
          adminExists: true,
          roleCorrect: true
        };
      }
    }

    // Step 3: Create admin user if doesn't exist
    logger.info('Creating demo admin user...');

    // Try to create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
      options: {
        data: {
          first_name: 'Demo',
          last_name: 'Admin',
          role: 'admin',
        }
      }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        logger.warn('Admin auth user exists but profile missing, attempting to create profile...');
        
        // Try to sign in to get user ID
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: adminEmail,
          password: adminPassword
        });

        if (signInError || !signInData.user) {
          logger.error('Failed to sign in existing admin user', signInError);
          return {
            success: false,
            message: `Failed to access existing admin user: ${signInError?.message}`,
            adminExists: false,
            roleCorrect: false
          };
        }

        // Create missing profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: signInData.user.id,
            email: adminEmail,
            first_name: 'Mary',
            last_name: 'Kwarteng',
            role: 'admin',
            phone: '+233 50 000 0000',
          });

        if (profileError) {
          logger.error('Failed to create admin profile', profileError);
          return {
            success: false,
            message: `Failed to create admin profile: ${profileError.message}`,
            adminExists: false,
            roleCorrect: false
          };
        }

        logger.info('Created missing admin profile for existing auth user');
        return {
          success: true,
          message: 'Admin profile created for existing auth user',
          adminExists: true,
          roleCorrect: true
        };
      }

      logger.error('Failed to create admin auth user', authError);
      return {
        success: false,
        message: `Failed to create admin user: ${authError.message}`,
        adminExists: false,
        roleCorrect: false
      };
    }

    // Step 4: Create admin profile
    if (!authData.user) {
      logger.error('Auth user creation succeeded but no user data returned');
      return {
        success: false,
        message: 'Auth user creation failed - no user data',
        adminExists: false,
        roleCorrect: false
      };
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: adminEmail,
        first_name: 'Demo',
        last_name: 'Admin',
        role: 'admin',
        phone: '+233 50 000 0000',
      });

    if (profileError) {
      logger.error('Failed to create admin profile', profileError);
      return {
        success: false,
        message: `Failed to create admin profile: ${profileError.message}`,
        adminExists: false,
        roleCorrect: false
      };
    }

    logger.info('Successfully created demo admin user');
    return {
      success: true,
      message: 'Demo admin user created successfully',
      adminExists: true,
      roleCorrect: true
    };

  } catch (error) {
    logger.error('Unexpected error in admin setup', error);
    return {
      success: false,
      message: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      adminExists: false,
      roleCorrect: false
    };
  }
}

/**
 * Quick admin access verification
 * Returns true if admin can access the system
 */
export async function verifyAdminAccess(): Promise<boolean> {
  try {
    const result = await ensureDemoAdminExists();
    return result.success && result.adminExists && result.roleCorrect;
  } catch (error) {
    logger.error('Error verifying admin access', error);
    return false;
  }
}
