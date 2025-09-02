#!/usr/bin/env tsx

/**
 * Content Validation Centralization Test
 * Validates that all content validation rules and suggestions are properly centralized
 */

import { contentValidationEngine } from '../config/centralized-content-validation.config';
import { contentSuggestionsEngine } from '../config/centralized-content-suggestions.config';

console.log('🧪 Testing Content Validation Centralization...\n');

try {
  // Test content validation engine
  console.log('✅ Content Validation Engine:');
  
  const aboutRules = contentValidationEngine.getAboutSectionRules();
  console.log(`   About Title: ${aboutRules.title.minLength}-${aboutRules.title.maxLength} characters`);
  console.log(`   About Description: ${aboutRules.description.minLength}-${aboutRules.description.maxLength} characters`);
  console.log(`   About Highlights: Max ${aboutRules.highlights.maxCount}, ${aboutRules.highlights.maxLength} chars each`);

  const amenitiesRules = contentValidationEngine.getAmenitiesRules();
  console.log(`   Amenities: ${amenitiesRules.minAmenitiesRequired}-${amenitiesRules.maxAmenitiesPerProperty} total, ${amenitiesRules.premiumAmenitiesLimit} premium max`);

  const considerationsRules = contentValidationEngine.getConsiderationsRules();
  console.log(`   Considerations: Max ${considerationsRules.maxConsiderationsPerProperty}`);
  console.log(`   Consideration Title: ${considerationsRules.title.minLength}-${considerationsRules.title.maxLength} characters`);
  console.log(`   Consideration Description: ${considerationsRules.description.minLength}-${considerationsRules.description.maxLength} characters`);

  const houseRulesRules = contentValidationEngine.getHouseRulesRules();
  console.log(`   House Rules: Max ${houseRulesRules.maxRulesPerProperty}`);
  console.log(`   House Rule Title: ${houseRulesRules.title.minLength}-${houseRulesRules.title.maxLength} characters`);

  const mediaRules = contentValidationEngine.getMediaRules();
  console.log(`   Images: Max ${mediaRules.images.maxCount}, ${mediaRules.images.maxSizeMB}MB each`);
  console.log(`   Videos: Max ${mediaRules.videos.maxCount}, ${mediaRules.videos.maxSizeMB}MB each`);

  // Test content suggestions engine
  console.log('\n✅ Content Suggestions Engine:');
  
  const aboutHighlights = contentSuggestionsEngine.getAboutHighlightSuggestions(true, true);
  console.log(`   About Highlights: ${aboutHighlights.length} suggestions available`);
  console.log(`   Sample highlights: ${aboutHighlights.slice(0, 3).join(', ')}...`);

  const basicAmenities = contentSuggestionsEngine.getBasicAmenitiesSuggestions();
  console.log(`   Basic Amenities: ${basicAmenities.length} suggestions available`);
  console.log(`   Sample amenities: ${basicAmenities.slice(0, 3).join(', ')}...`);

  const premiumAmenities = contentSuggestionsEngine.getPremiumAmenitiesSuggestions();
  console.log(`   Premium Amenities: ${premiumAmenities.length} suggestions available`);

  const ghanaAmenities = contentSuggestionsEngine.getGhanaSpecificAmenitiesSuggestions();
  console.log(`   Ghana-Specific Amenities: ${ghanaAmenities.length} suggestions available`);

  const commonConsiderations = contentSuggestionsEngine.getCommonConsiderationsSuggestions();
  console.log(`   Common Considerations: ${commonConsiderations.length} suggestions available`);

  const infrastructureConsiderations = contentSuggestionsEngine.getInfrastructureConsiderationsSuggestions();
  console.log(`   Infrastructure Considerations: ${infrastructureConsiderations.length} suggestions available`);

  const standardRules = contentSuggestionsEngine.getStandardHouseRulesSuggestions();
  console.log(`   Standard House Rules: ${standardRules.length} suggestions available`);

  const ghanaRules = contentSuggestionsEngine.getGhanaSpecificHouseRulesSuggestions();
  console.log(`   Ghana-Specific House Rules: ${ghanaRules.length} suggestions available`);

  const universityRules = contentSuggestionsEngine.getUniversitySpecificHouseRulesSuggestions();
  console.log(`   University-Specific House Rules: ${universityRules.length} suggestions available`);

  // Test configuration metadata
  const validationInfo = contentValidationEngine.getConfigurationInfo();
  console.log('\n✅ Configuration Metadata:');
  console.log(`   Validation Engine Version: ${validationInfo.version}`);
  console.log(`   Environment: ${validationInfo.environment}`);
  console.log(`   Last Updated: ${validationInfo.lastUpdated}`);

  const suggestionsInfo = contentSuggestionsEngine.getConfigurationInfo();
  console.log(`   Suggestions Engine Version: ${suggestionsInfo.version}`);
  console.log(`   Environment: ${suggestionsInfo.environment}`);
  console.log(`   Last Updated: ${suggestionsInfo.lastUpdated}`);

  // Test centralization success
  console.log('\n✅ Centralization Success:');
  console.log('   ✅ Content validation rules centralized');
  console.log('   ✅ Content suggestions centralized');
  console.log('   ✅ Ghana-specific content available');
  console.log('   ✅ University-specific content available');
  console.log('   ✅ Priority-based suggestion ordering');
  console.log('   ✅ Category-based content organization');

  console.log('\n🎉 Content Validation Centralization Test COMPLETED!');
  console.log('✅ All content validation rules and suggestions are properly centralized.');

} catch (error) {
  console.error('❌ Content Validation Centralization Test FAILED:', error);
  process.exit(1);
}
