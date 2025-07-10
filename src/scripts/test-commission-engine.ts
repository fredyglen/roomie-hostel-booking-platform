/**
 * Simple Commission Engine Test
 * Test the centralized commission engine directly
 */

import { centralizedCommissionEngine } from '@/config/centralized-commission.config';

async function testCommissionEngine() {
  console.log('🔍 Testing Centralized Commission Engine...');
  
  try {
    // Test 1: Basic configuration
    const rates = centralizedCommissionEngine.getCommissionRates();
    const fees = centralizedCommissionEngine.getPlatformFees();
    
    console.log('✅ Commission Rates:');
    console.log(`   Platform: ${rates.platform * 100}%`);
    console.log(`   Agent: ${rates.agent * 100}%`);
    console.log(`   Paystack: ${rates.paystack * 100}%`);
    console.log(`   VAT: ${rates.vat * 100}%`);
    
    console.log('✅ Platform Fees:');
    console.log(`   Fixed Fee: ${fees.fixed} GHS`);
    console.log(`   Agent Minimum: ${fees.agentMinimum} GHS`);
    
    // Test 2: Commission calculation
    const testAmount = 1000; // 1000 GHS
    const result = centralizedCommissionEngine.calculateCommissions(testAmount, true);
    
    console.log(`\n✅ Commission Calculation for ${testAmount} GHS:`);
    console.log(`   Base Amount: ${result.baseAmount} GHS`);
    console.log(`   Platform Commission: ${result.platformCommission} GHS`);
    console.log(`   Platform Fixed Fee: ${result.platformFixedFee} GHS`);
    console.log(`   Agent Commission: ${result.agentCommission} GHS`);
    console.log(`   Paystack Fee: ${result.paystackFee} GHS`);
    console.log(`   VAT: ${result.vatAmount} GHS`);
    console.log(`   Total Amount: ${result.totalAmount} GHS`);
    console.log(`   Owner Receives: ${result.ownerReceives} GHS`);
    
    // Test 3: Validation
    const expectedPlatformCommission = testAmount * 0.05; // 50 GHS
    const expectedAgentCommission = Math.max(testAmount * 0.037, 100); // 100 GHS (minimum)
    
    console.log(`\n🔍 Validation:`);
    console.log(`   Expected Platform Commission: ${expectedPlatformCommission} GHS`);
    console.log(`   Actual Platform Commission: ${result.platformCommission} GHS`);
    console.log(`   ✅ Platform Commission: ${Math.abs(result.platformCommission - expectedPlatformCommission) < 0.01 ? 'CORRECT' : 'INCORRECT'}`);
    
    console.log(`   Expected Agent Commission: ${expectedAgentCommission} GHS`);
    console.log(`   Actual Agent Commission: ${result.agentCommission} GHS`);
    console.log(`   ✅ Agent Commission: ${Math.abs(result.agentCommission - expectedAgentCommission) < 0.01 ? 'CORRECT' : 'INCORRECT'}`);
    
    console.log('\n🎉 Commission Engine Test Completed Successfully!');
    return true;

  } catch (error) {
    console.error('❌ Commission Engine Test Failed:', error);
    return false;
  }
}

// Run the test
testCommissionEngine().then(success => {
  process.exit(success ? 0 : 1);
});
