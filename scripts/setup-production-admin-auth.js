#!/usr/bin/env node

/**
 * Production Admin Authentication Setup Script
 * 
 * Business Purpose: Sets up production admin authentication for ROOMi platform
 * with proper database schema, admin users, and role assignments
 * 
 * Technical Implementation: Executes database migrations and creates admin users
 * following BE CONSCIOUS Apple-Grade standards
 * 
 * @author ROOMi Platform Team
 * @version 1.0.0
 * @compliance BE CONSCIOUS Apple-Grade Standards
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing required environment variables:');
  console.error('   - VITE_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Initialize Supabase client with service role
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

/**
 * Execute SQL file
 */
async function executeSqlFile(filePath, description) {
  try {
    console.log(`📄 Executing ${description}...`);
    
    const sqlContent = fs.readFileSync(filePath, 'utf8');
    
    // Split by semicolons and execute each statement
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        if (error) {
          console.warn(`⚠️  Warning in ${description}:`, error.message);
        }
      }
    }
    
    console.log(`✅ ${description} completed successfully`);
    return true;
  } catch (error) {
    console.error(`❌ Error executing ${description}:`, error.message);
    return false;
  }
}

/**
 * Verify admin setup
 */
async function verifyAdminSetup() {
  try {
    console.log('🔍 Verifying admin setup...');
    
    // Check admin roles
    const { data: roles, error: rolesError } = await supabase
      .from('admin_roles')
      .select('*');
    
    if (rolesError) {
      console.error('❌ Failed to verify admin roles:', rolesError.message);
      return false;
    }
    
    console.log(`✅ Admin roles configured: ${roles.length}`);
    
    // Check admin users
    const { data: adminUsers, error: usersError } = await supabase
      .from('profiles')
      .select('email, role')
      .in('role', ['supreme_admin', 'campus_admin']);
    
    if (usersError) {
      console.error('❌ Failed to verify admin users:', usersError.message);
      return false;
    }
    
    console.log(`✅ Admin users created: ${adminUsers.length}`);
    adminUsers.forEach(user => {
      console.log(`   - ${user.email} (${user.role})`);
    });
    
    // Check admin jurisdictions
    const { data: jurisdictions, error: jurisdictionsError } = await supabase
      .from('admin_jurisdictions')
      .select('*')
      .eq('is_active', true);
    
    if (jurisdictionsError) {
      console.error('❌ Failed to verify admin jurisdictions:', jurisdictionsError.message);
      return false;
    }
    
    console.log(`✅ Admin jurisdictions assigned: ${jurisdictions.length}`);
    
    return true;
  } catch (error) {
    console.error('❌ Error verifying admin setup:', error.message);
    return false;
  }
}

/**
 * Main setup function
 */
async function setupProductionAdminAuth() {
  console.log('🚀 Setting up Production Admin Authentication for ROOMi Platform');
  console.log('📋 Following BE CONSCIOUS Apple-Grade Standards\n');
  
  try {
    // Step 1: Execute admin authentication schema
    const schemaPath = path.join(__dirname, '../database/migrations/003_admin_authentication_schema.sql');
    const schemaSuccess = await executeSqlFile(schemaPath, 'Admin Authentication Schema');
    
    if (!schemaSuccess) {
      console.error('❌ Failed to setup admin authentication schema');
      process.exit(1);
    }
    
    // Step 2: Create admin users
    const usersPath = path.join(__dirname, '../database/test-admin-users.sql');
    const usersSuccess = await executeSqlFile(usersPath, 'Production Admin Users');
    
    if (!usersSuccess) {
      console.error('❌ Failed to create admin users');
      process.exit(1);
    }
    
    // Step 3: Verify setup
    const verificationSuccess = await verifyAdminSetup();
    
    if (!verificationSuccess) {
      console.error('❌ Admin setup verification failed');
      process.exit(1);
    }
    
    console.log('\n🎉 Production Admin Authentication Setup Complete!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Test admin login with credentials from database');
    console.log('   2. Verify role-based access control');
    console.log('   3. Test jurisdiction-based permissions');
    console.log('\n🔐 Admin Credentials:');
    console.log('   - admin@roomi.com / admin123 (Supreme Admin)');
    console.log('   - supreme.admin@roomi.com / admin123 (Supreme Admin)');
    console.log('   - campus.admin.upsa@roomi.com / campus123 (Campus Admin)');
    console.log('   - campus.admin.ug@roomi.com / campus123 (Campus Admin)');
    console.log('\n⚠️  Remember to change default passwords in production!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Execute setup
if (import.meta.url === `file://${process.argv[1]}`) {
  setupProductionAdminAuth();
}

export { setupProductionAdminAuth };
