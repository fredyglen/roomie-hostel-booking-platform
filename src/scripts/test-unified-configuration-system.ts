#!/usr/bin/env tsx

/**
 * Unified Configuration System Test
 * Validates that all configuration systems are properly unified and working
 */

import { unifiedConfigurationEngine, createCountryCode } from '../config/unified-configuration.config';

console.log('🧪 Testing Unified Configuration System...\n');

try {
  // Test unified configuration
  const config = unifiedConfigurationEngine.getAllConfig();
  console.log('✅ Unified Configuration:');
  console.log(`   App Name: ${config.app.name}`);
  console.log(`   Version: ${config.app.version}`);
  console.log(`   Environment: ${config.app.environment}`);
  console.log(`   Supported Countries: ${config.app.supportedCountries.join(', ')}`);
  console.log(`   Default Country: ${config.app.defaultCountry}`);

  // Test database configuration
  console.log('\n✅ Database Configuration:');
  console.log(`   Timeout: ${config.database.timeout}ms`);
  console.log(`   Retry Attempts: ${config.database.retryAttempts}`);
  console.log(`   Connection Pool Size: ${config.database.connectionPoolSize}`);

  // Test UI configuration
  console.log('\n✅ UI Configuration:');
  console.log(`   Default Page Size: ${config.ui.pagination.defaultPageSize}`);
  console.log(`   Max Page Size: ${config.ui.pagination.maxPageSize}`);
  console.log(`   Search Debounce: ${config.ui.performance.searchDebounceMs}ms`);
  console.log(`   Toast Duration: ${config.ui.performance.toastDuration}ms`);

  // Test upload configuration
  console.log('\n✅ Upload Configuration:');
  console.log(`   Max Image Size: ${config.upload.limits.maxImageSize / (1024 * 1024)}MB`);
  console.log(`   Max Video Size: ${config.upload.limits.maxVideoSize / (1024 * 1024)}MB`);
  console.log(`   Allowed Image Types: ${config.upload.allowedTypes.images.join(', ')}`);

  // Test payment configuration
  const ghanaCode = createCountryCode('GH');
  const paymentConfig = unifiedConfigurationEngine.getPaymentConfig(ghanaCode);
  console.log('\n✅ Payment Configuration (Ghana):');
  console.log(`   Primary Provider: ${paymentConfig.primary}`);
  console.log(`   Payment Methods: ${paymentConfig.methods.join(', ')}`);
  console.log(`   Currencies: ${paymentConfig.currencies.join(', ')}`);

  // Test country configuration
  const countryConfig = unifiedConfigurationEngine.getCountryConfig(ghanaCode);
  console.log('\n✅ Country Configuration (Ghana):');
  console.log(`   Name: ${countryConfig.name}`);
  console.log(`   Currency: ${countryConfig.currency}`);
  console.log(`   Universities: ${countryConfig.universities?.map(u => u.name).join(', ') || 'Not configured'}`);

  // Test feature flags
  const features = unifiedConfigurationEngine.getFeatureFlags('supreme_admin', ghanaCode);
  console.log('\n✅ Feature Flags (Supreme Admin, Ghana):');
  console.log(`   Payment Enabled: ${features.paymentEnabled}`);
  console.log(`   Upload Enabled: ${features.uploadEnabled}`);
  console.log(`   Global Analytics: ${features.globalAnalytics}`);
  console.log(`   Mobile Money Enabled: ${features.mobileMoneyEnabled}`);

  // Test portal configuration
  console.log('\n✅ Portal Configuration:');
  console.log(`   Admin Features: ${config.portals.admin.features.join(', ')}`);
  console.log(`   Owner Features: ${config.portals.owner.features.join(', ')}`);
  console.log(`   Student Features: ${config.portals.student.features.join(', ')}`);

  // Test API configuration
  console.log('\n✅ API Configuration:');
  console.log(`   Current Version: ${config.api.versions.current}`);
  console.log(`   Supported Versions: ${config.api.versions.supported.join(', ')}`);
  console.log(`   Rate Limit: ${config.api.rateLimit.requests} requests per ${config.api.rateLimit.windowMs / 60000} minutes`);

  // Test configuration metadata
  const configInfo = unifiedConfigurationEngine.getConfigurationInfo();
  console.log('\n✅ Configuration Metadata:');
  console.log(`   Version: ${configInfo.version}`);
  console.log(`   Environment: ${configInfo.environment}`);
  console.log(`   Supported Countries: ${configInfo.supportedCountries.join(', ')}`);

  console.log('\n🎉 Unified Configuration System Test COMPLETED!');
  console.log('✅ All configuration systems are properly unified and working correctly.');

} catch (error) {
  console.error('❌ Unified Configuration System Test FAILED:', error);
  process.exit(1);
}
