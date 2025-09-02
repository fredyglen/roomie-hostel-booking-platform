/**
 * Business Rules Engine Test
 * Test the centralized business rules engine
 */

import { centralizedBusinessRulesEngine } from '@/config/centralized-business-rules.config';

async function testBusinessRulesEngine() {
  console.log('🔍 Testing Centralized Business Rules Engine...');
  
  try {
    // Test 1: Basic configuration
    const bookingRules = centralizedBusinessRulesEngine.getBookingRules();
    const propertyRules = centralizedBusinessRulesEngine.getPropertyRules();
    const userRules = centralizedBusinessRulesEngine.getUserRules();
    const fileUploadRules = centralizedBusinessRulesEngine.getFileUploadRules();
    const validationRules = centralizedBusinessRulesEngine.getValidationRules();
    
    console.log('✅ Booking Rules:');
    console.log(`   Semester Duration: ${bookingRules.semesterDurationMonths} months`);
    console.log(`   Max Advance Booking: ${bookingRules.maxBookingAdvanceDays} days`);
    console.log(`   Min Advance Booking: ${bookingRules.minBookingAdvanceDays} days`);
    console.log(`   Cancellation Deadline: ${bookingRules.cancellationDeadlineDays} days`);
    
    console.log('\n✅ Property Rules:');
    console.log(`   Max Images: ${propertyRules.maxImagesPerProperty}`);
    console.log(`   Max Videos: ${propertyRules.maxVideosPerProperty}`);
    console.log(`   Max Title Length: ${propertyRules.maxPropertyTitleLength} chars`);
    console.log(`   Min Description: ${propertyRules.minPropertyDescriptionLength} chars`);
    console.log(`   Max Description: ${propertyRules.maxPropertyDescriptionLength} chars`);
    
    console.log('\n✅ User Rules:');
    console.log(`   Min Password Length: ${userRules.minPasswordLength} chars`);
    console.log(`   Max Login Attempts: ${userRules.maxLoginAttempts}`);
    console.log(`   Session Timeout: ${userRules.sessionTimeoutMinutes} minutes`);
    
    console.log('\n✅ File Upload Rules:');
    console.log(`   Max Image Size: ${fileUploadRules.maxImageSizeMB} MB`);
    console.log(`   Max Video Size: ${fileUploadRules.maxVideoSizeMB} MB`);
    console.log(`   Allowed Image Types: ${fileUploadRules.allowedImageTypes.join(', ')}`);
    
    // Test 2: Booking validation
    console.log('\n🔍 Testing Booking Validation:');
    
    // Valid booking
    const validBooking = {
      checkInDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      specialRequests: 'Ground floor room please',
      documents: ['student_id_document']
    };
    
    const validResult = centralizedBusinessRulesEngine.validateBookingCreation(validBooking);
    console.log(`   Valid Booking: ${validResult.isValid ? '✅ VALID' : '❌ INVALID'}`);
    if (!validResult.isValid) {
      console.log(`   Errors: ${validResult.errors.join(', ')}`);
    }
    
    // Invalid booking (too far in advance)
    const invalidBooking = {
      checkInDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(), // 120 days from now
      specialRequests: 'A'.repeat(600), // Too long
      documents: [] // Missing required documents
    };
    
    const invalidResult = centralizedBusinessRulesEngine.validateBookingCreation(invalidBooking);
    console.log(`   Invalid Booking: ${invalidResult.isValid ? '✅ VALID' : '❌ INVALID (Expected)'}`);
    console.log(`   Errors: ${invalidResult.errors.join(', ')}`);
    
    // Test 3: Property validation
    console.log('\n🔍 Testing Property Validation:');
    
    // Valid property
    const validProperty = {
      title: 'Beautiful Student Hostel',
      description: 'A wonderful place for students to stay during their academic journey.',
      images: ['img1.jpg', 'img2.jpg'],
      videos: ['video1.mp4'],
      amenities: ['bed', 'mattress', 'wifi', 'kitchen'],
      rooms: 10,
      bedsPerRoom: 2
    };
    
    const validPropertyResult = centralizedBusinessRulesEngine.validatePropertyCreation(validProperty);
    console.log(`   Valid Property: ${validPropertyResult.isValid ? '✅ VALID' : '❌ INVALID'}`);
    if (validPropertyResult.warnings.length > 0) {
      console.log(`   Warnings: ${validPropertyResult.warnings.join(', ')}`);
    }
    
    // Invalid property
    const invalidProperty = {
      title: 'A'.repeat(150), // Too long
      description: 'Short', // Too short
      images: Array(15).fill('img.jpg'), // Too many images
      videos: Array(5).fill('video.mp4'), // Too many videos
      amenities: Array(25).fill('amenity'), // Too many amenities
      rooms: 60, // Too many rooms
      bedsPerRoom: 6 // Too many beds per room
    };
    
    const invalidPropertyResult = centralizedBusinessRulesEngine.validatePropertyCreation(invalidProperty);
    console.log(`   Invalid Property: ${invalidPropertyResult.isValid ? '✅ VALID' : '❌ INVALID (Expected)'}`);
    console.log(`   Errors: ${invalidPropertyResult.errors.slice(0, 3).join(', ')}...`);
    
    // Test 4: Configuration info
    const configInfo = centralizedBusinessRulesEngine.getConfigurationInfo();
    console.log('\n✅ Configuration Info:');
    console.log(`   Version: ${configInfo.version}`);
    console.log(`   Environment: ${configInfo.environment}`);
    console.log(`   Last Updated: ${configInfo.lastUpdated}`);
    
    console.log('\n🎉 Business Rules Engine Test Completed Successfully!');
    return true;

  } catch (error) {
    console.error('❌ Business Rules Engine Test Failed:', error);
    return false;
  }
}

// Run the test
testBusinessRulesEngine().then(success => {
  process.exit(success ? 0 : 1);
});
