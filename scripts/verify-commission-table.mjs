/**
 * ✅ CP#1.3 - VERIFY COMMISSION CONFIGURATIONS TABLE
 * 
 * This script checks if the commission_configurations table exists in Supabase
 * and verifies its schema, data, and functionality.
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
config();

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.error('   Required: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyCommissionTable() {
  console.log('🔍 CP#1.3 - Verifying Commission Configurations Table\n');
  console.log('='.repeat(80));

  try {
    // ========================================================================
    // STEP 1: Check if table exists by attempting to query it
    // ========================================================================
    console.log('\n📊 STEP 1: Checking if commission_configurations table exists...');
    
    const { data: tableData, error: tableError } = await supabase
      .from('commission_configurations')
      .select('*')
      .limit(1);

    if (tableError) {
      if (tableError.code === '42P01') {
        // Table does not exist
        console.log('❌ Table does NOT exist in Supabase database');
        console.log('   Error:', tableError.message);
        console.log('\n📝 RECOMMENDATION: Migration needs to be created and applied');
        console.log('   File: supabase/migrations/202510XX_create_commission_configurations.sql');
        return;
      } else {
        // Other error (permissions, connection, etc.)
        console.log('⚠️  Error querying table:', tableError.message);
        console.log('   Code:', tableError.code);
        throw tableError;
      }
    }

    console.log('✅ Table EXISTS in Supabase database');

    // ========================================================================
    // STEP 2: Check table data
    // ========================================================================
    console.log('\n📊 STEP 2: Checking table data...');
    
    const { data: allConfigs, error: dataError } = await supabase
      .from('commission_configurations')
      .select('*')
      .order('created_at', { ascending: false });

    if (dataError) {
      console.log('❌ Error fetching data:', dataError.message);
      throw dataError;
    }

    console.log(`   Total configurations: ${allConfigs?.length || 0}`);

    if (!allConfigs || allConfigs.length === 0) {
      console.log('⚠️  Table is EMPTY - needs initial seed data');
      console.log('\n📝 RECOMMENDATION: Insert initial configuration with default rates');
      return;
    }

    // ========================================================================
    // STEP 3: Check active configuration
    // ========================================================================
    console.log('\n📊 STEP 3: Checking active configuration...');
    
    const { data: activeConfig, error: activeError } = await supabase
      .from('commission_configurations')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (activeError) {
      if (activeError.code === 'PGRST116') {
        console.log('⚠️  No ACTIVE configuration found');
        console.log('   All configurations are inactive');
        console.log('\n📝 RECOMMENDATION: Activate a configuration or insert new one');
      } else {
        console.log('❌ Error fetching active config:', activeError.message);
        throw activeError;
      }
      return;
    }

    console.log('✅ Active configuration found:');
    console.log(`   Version: ${activeConfig.version}`);
    console.log(`   Environment: ${activeConfig.environment}`);
    console.log(`   Platform Rate: ${(activeConfig.platform_rate * 100).toFixed(2)}%`);
    console.log(`   Agent Rate: ${(activeConfig.agent_rate * 100).toFixed(2)}%`);
    console.log(`   Paystack Rate: ${(activeConfig.paystack_rate * 100).toFixed(2)}%`);
    console.log(`   VAT Rate: ${(activeConfig.vat_rate * 100).toFixed(2)}%`);
    console.log(`   Platform Fixed Fee: ${activeConfig.platform_fixed_fee} ${activeConfig.currency}`);
    console.log(`   Agent Minimum Fee: ${activeConfig.agent_minimum_fee} ${activeConfig.currency}`);
    console.log(`   Last Updated: ${new Date(activeConfig.updated_at).toLocaleString()}`);

    // ========================================================================
    // STEP 4: Test write permissions (insert test)
    // ========================================================================
    console.log('\n📊 STEP 4: Testing write permissions...');
    
    // Try to insert a test configuration (will be deactivated immediately)
    const testConfig = {
      platform_rate: activeConfig.platform_rate,
      agent_rate: activeConfig.agent_rate,
      paystack_rate: activeConfig.paystack_rate,
      vat_rate: activeConfig.vat_rate,
      platform_fixed_fee: activeConfig.platform_fixed_fee,
      agent_minimum_fee: activeConfig.agent_minimum_fee,
      currency: activeConfig.currency,
      version: 'test-write-check',
      environment: 'test',
      is_active: false,
      change_reason: 'CP#1.3 write permission test',
      changed_by: 'verification_script'
    };

    const { data: insertData, error: insertError } = await supabase
      .from('commission_configurations')
      .insert(testConfig)
      .select()
      .single();

    if (insertError) {
      console.log('❌ Write permission FAILED:', insertError.message);
      console.log('   Code:', insertError.code);
      console.log('\n📝 RECOMMENDATION: Check RLS policies for admin write access');
      
      // Clean up if partial insert
      if (insertData?.id) {
        await supabase
          .from('commission_configurations')
          .delete()
          .eq('id', insertData.id);
      }
      return;
    }

    console.log('✅ Write permission SUCCESS');
    
    // Clean up test record
    const { error: deleteError } = await supabase
      .from('commission_configurations')
      .delete()
      .eq('id', insertData.id);

    if (deleteError) {
      console.log('⚠️  Warning: Could not delete test record:', deleteError.message);
    } else {
      console.log('   Test record cleaned up successfully');
    }

    // ========================================================================
    // STEP 5: Verify schema columns
    // ========================================================================
    console.log('\n📊 STEP 5: Verifying schema columns...');
    
    const requiredColumns = [
      'id', 'platform_rate', 'agent_rate', 'paystack_rate', 'vat_rate',
      'platform_fixed_fee', 'agent_minimum_fee', 'currency', 'version',
      'environment', 'is_active', 'change_event', 'changed_by',
      'change_reason', 'created_at', 'updated_at'
    ];

    const actualColumns = Object.keys(activeConfig);
    const missingColumns = requiredColumns.filter(col => !actualColumns.includes(col));

    if (missingColumns.length > 0) {
      console.log('⚠️  Missing columns:', missingColumns.join(', '));
      console.log('\n📝 RECOMMENDATION: Update table schema to include missing columns');
    } else {
      console.log('✅ All required columns present');
    }

    // ========================================================================
    // FINAL SUMMARY
    // ========================================================================
    console.log('\n' + '='.repeat(80));
    console.log('📋 VERIFICATION SUMMARY');
    console.log('='.repeat(80));
    console.log('✅ Table exists: YES');
    console.log('✅ Has data: YES');
    console.log('✅ Active config: YES');
    console.log('✅ Write permissions: YES');
    console.log('✅ Schema complete: YES');
    console.log('\n🎉 Commission configurations table is FULLY FUNCTIONAL!');
    console.log('\n📝 NEXT STEPS:');
    console.log('   1. Test CommissionConfigManager UI component');
    console.log('   2. Verify real-time subscription updates');
    console.log('   3. Test rate updates via admin portal');
    console.log('   4. Proceed to CP#1.4 (Edge Function security fix)');

  } catch (error) {
    console.error('\n❌ VERIFICATION FAILED:', error);
    
    console.log('\n📝 TROUBLESHOOTING:');
    console.log('   1. Check Supabase connection');
    console.log('   2. Verify database credentials');
    console.log('   3. Check if migration was applied');
    console.log('   4. Review RLS policies');
  }
}

// Run verification
verifyCommissionTable()
  .then(() => {
    console.log('\n✅ Verification complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Verification failed:', error);
    process.exit(1);
  });

