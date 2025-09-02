/**
 * Unified Configuration System Test
 * Test the centralized configuration engine
 */

import { unifiedConfigurationEngine, createCountryCode } from '@/config/unified-configuration.config';

async function testUnifiedConfiguration() {
  console.log('🔍 Testing Unified Configuration System...');
  
  try {
    // Test 1: Basic configuration
    const config = unifiedConfigurationEngine.getAllConfig();
    
    console.log('✅ App Configuration:');
    console.log(`   Name: ${config.app.name}`);
    console.log(`   Version: ${config.app.version}`);
    console.log(`   Environment: ${config.app.environment}`);
    console.log(`   Supported Countries: ${config.app.supportedCountries.join(', ')}`);
    console.log(`   Default Country: ${config.app.defaultCountry}`);

    // Test 2: Ghana-specific configuration
    console.log('\n✅ Ghana Configuration:');
    const ghanaConfig = unifiedConfigurationEngine.getCountryConfig(createCountryCode('GH'));
    console.log(`   Ghana Currency: ${ghanaConfig.currency}`);
    console.log(`   Ghana Languages: ${ghanaConfig.languages.join(', ')}`);
    console.log(`   Ghana Payment Methods: ${ghanaConfig.paymentMethods.join(', ')}`);
    console.log(`   Ghana Timezone: ${ghanaConfig.timezone}`);
    console.log(`   Ghana Compliance: ${ghanaConfig.compliance.dataProtection.join(', ')}`);
    
    // Test 3: Admin role configuration
    console.log('\n✅ Admin Role Configurations:');
    const supremeAdminRole = unifiedConfigurationEngine.getAdminRoleConfig('supreme');
    console.log(`   Supreme Admin Permissions: ${supremeAdminRole.permissions.slice(0, 3).join(', ')}...`);
    console.log(`   Supreme Admin Features: ${supremeAdminRole.features.slice(0, 3).join(', ')}...`);
    console.log(`   International Access: ${supremeAdminRole.internationalAccess}`);
    
    const campusAdminRole = unifiedConfigurationEngine.getAdminRoleConfig('campus');
    console.log(`   Campus Admin Permissions: ${campusAdminRole.permissions.slice(0, 3).join(', ')}...`);
    console.log(`   Campus Admin Jurisdiction: ${campusAdminRole.jurisdictionScope}`);
    
    // Test 4: Payment configuration
    console.log('\n✅ Payment Configurations:');
    const ghanaPayment = unifiedConfigurationEngine.getPaymentConfig(createCountryCode('GH'));
    console.log(`   Ghana Primary Provider: ${ghanaPayment.primary}`);
    console.log(`   Ghana Payment Methods: ${ghanaPayment.methods.join(', ')}`);
    console.log(`   Payment Timeout: ${ghanaPayment.globalSettings.timeout}ms`);
    
    // Test 5: Feature flags
    console.log('\n✅ Feature Flags:');
    const globalFeatures = unifiedConfigurationEngine.getFeatureFlags();
    console.log(`   Payment Enabled: ${globalFeatures.paymentEnabled}`);
    console.log(`   Upload Enabled: ${globalFeatures.uploadEnabled}`);
    console.log(`   Maintenance Mode: ${globalFeatures.maintenanceMode}`);
    
    const supremeAdminFeatures = unifiedConfigurationEngine.getFeatureFlags('supreme_admin');
    console.log(`   Supreme Admin Global Analytics: ${supremeAdminFeatures.globalAnalytics}`);
    
    const ghanaFeatures = unifiedConfigurationEngine.getFeatureFlags(undefined, createCountryCode('GH'));
    console.log(`   Ghana Mobile Money: ${ghanaFeatures.mobileMoneyEnabled}`);
    
    // Test 6: UI configuration
    console.log('\n✅ UI Configuration:');
    console.log(`   Default Page Size: ${config.ui.pagination.defaultPageSize}`);
    console.log(`   Max Image Size: ${config.upload.limits.maxImageSize / (1024 * 1024)}MB`);
    console.log(`   Session Timeout: ${config.security.authentication.sessionTimeout / 60000} minutes`);
    console.log(`   Mobile First: ${config.ui.responsive.mobileFirst}`);
    
    // Test 7: Security configuration
    console.log('\n✅ Security Configuration:');
    console.log(`   Max Login Attempts: ${config.security.authentication.maxLoginAttempts}`);
    console.log(`   MFA Required Roles: ${config.security.authentication.mfaRequired.join(', ')}`);
    console.log(`   Audit Retention: ${config.security.audit.retentionDays} days`);
    
    // Test 8: Configuration metadata
    const configInfo = unifiedConfigurationEngine.getConfigurationInfo();
    console.log('\n✅ Configuration Metadata:');
    console.log(`   Version: ${configInfo.version}`);
    console.log(`   Environment: ${configInfo.environment}`);
    console.log(`   Supported Countries: ${configInfo.supportedCountries.join(', ')}`);
    console.log(`   Last Validated: ${configInfo.lastValidated}`);
    
    console.log('\n🎉 Unified Configuration System Test Completed Successfully!');
    return true;

  } catch (error) {
    console.error('❌ Unified Configuration System Test Failed:', error);
    return false;
  }
}

// Run the test
testUnifiedConfiguration().then(success => {
  process.exit(success ? 0 : 1);
});
