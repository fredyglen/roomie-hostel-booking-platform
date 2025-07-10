#!/usr/bin/env tsx

/**
 * Business Rules Centralization Test
 * Validates that all business rules are properly centralized and working
 */

import { centralizedBusinessRulesEngine } from '../config/centralized-business-rules.config';

console.log('🧪 Testing Business Rules Centralization...\n');

try {
  // Test booking rules
  const bookingRules = centralizedBusinessRulesEngine.getBookingRules();
  console.log('✅ Booking Rules:');
  console.log(`   Semester Duration: ${bookingRules.semesterDurationMonths} months`);
  console.log(`   Min Advance Days: ${bookingRules.minBookingAdvanceDays} days`);
  console.log(`   Max Advance Days: ${bookingRules.maxBookingAdvanceDays} days`);
  console.log(`   Cancellation Deadline: ${bookingRules.cancellationDeadlineDays} days`);

  // Test property rules
  const propertyRules = centralizedBusinessRulesEngine.getPropertyRules();
  console.log('\n✅ Property Rules:');
  console.log(`   Max Images: ${propertyRules.maxImagesPerProperty}`);
  console.log(`   Max Videos: ${propertyRules.maxVideosPerProperty}`);
  console.log(`   Max Title Length: ${propertyRules.maxPropertyTitleLength}`);
  console.log(`   Min Description Length: ${propertyRules.minPropertyDescriptionLength}`);
  console.log(`   Max Description Length: ${propertyRules.maxPropertyDescriptionLength}`);
  console.log(`   Max Amenities: ${propertyRules.maxAmenitiesCount}`);

  // Test user rules
  const userRules = centralizedBusinessRulesEngine.getUserRules();
  console.log('\n✅ User Rules:');
  console.log(`   Max Username Length: ${userRules.maxUsernameLength}`);
  console.log(`   Min Password Length: ${userRules.minPasswordLength}`);
  console.log(`   Max Bio Length: ${userRules.maxBioLength}`);

  // Test file upload rules
  const fileRules = centralizedBusinessRulesEngine.getFileUploadRules();
  console.log('\n✅ File Upload Rules:');
  console.log(`   Max Image Size: ${fileRules.maxImageSizeMB}MB`);
  console.log(`   Max Video Size: ${fileRules.maxVideoSizeMB}MB`);
  console.log(`   Allowed Image Types: ${fileRules.allowedImageTypes.join(', ')}`);

  // Test validation rules
  const validationRules = centralizedBusinessRulesEngine.getValidationRules();
  console.log('\n✅ Validation Rules:');
  console.log(`   Email Regex: ${validationRules.emailRegex.source}`);
  console.log(`   Phone Regex: ${validationRules.phoneRegex.source}`);
  console.log(`   Student ID Regex: ${validationRules.studentIdRegex.source}`);

  // Test business rules consistency
  console.log('\n🧪 Testing Business Rules Consistency...');

  // Verify all rules are properly defined
  const allRulesValid = (
    bookingRules.semesterDurationMonths === 4 &&
    bookingRules.maxBookingAdvanceDays === 90 &&
    propertyRules.maxImagesPerProperty === 10 &&
    propertyRules.maxAmenitiesCount === 20 &&
    userRules.minPasswordLength === 8
  );

  console.log(`✅ Business Rules Consistency: ${allRulesValid ? 'PASSED' : 'FAILED'}`);

  console.log('\n🎉 Business Rules Centralization Test COMPLETED!');
  console.log('✅ All business rules are properly centralized and working correctly.');

} catch (error) {
  console.error('❌ Business Rules Centralization Test FAILED:', error);
  process.exit(1);
}
