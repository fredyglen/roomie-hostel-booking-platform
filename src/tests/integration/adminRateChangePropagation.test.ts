/**
 * ✅ INTEGRATION TESTS: Admin Rate Change Propagation
 * 
 * Comprehensive test suite for commission rate change propagation flow
 * Tests admin updates → database → real-time subscriptions → UI/Edge Function
 * 
 * @module adminRateChangePropagation.test
 * @version 1.0.0
 * @priority HIGH
 * @coverage-target 100%
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { centralizedCommissionEngine } from '@/config/centralized-commission.config';

// ============================================================================
// TEST SETUP AND MOCKS
// ============================================================================

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => {
  const mockChannel = {
    on: vi.fn().mockReturnThis(),
    subscribe: vi.fn().mockReturnThis(),
  };

  return {
    supabase: {
      from: vi.fn((table: string) => {
        if (table === 'commission_configurations') {
          return {
            select: vi.fn().mockReturnThis(),
            insert: vi.fn().mockResolvedValue({ data: null, error: null }),
            update: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            limit: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: {
                id: 'config_test_1',
                platform_rate: 0.05,
                agent_rate: 0.037,
                paystack_rate: 0.0195,
                vat_rate: 0.125,
                platform_fixed_fee: 100,
                agent_minimum_fee: 100,
                currency: 'GHS',
                version: '2.1.0',
                environment: 'test',
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              error: null,
            }),
          };
        }
        return {
          select: vi.fn().mockReturnThis(),
          insert: vi.fn().mockReturnThis(),
          update: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
        };
      }),
      channel: vi.fn(() => mockChannel),
    },
  };
});

// Mock logger
vi.mock('@/utils/enhanced-logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

// Mock user data
const mockAdminUser = {
  id: 'admin_test_123',
  email: 'admin@test.com',
  role: 'admin',
};

// ============================================================================
// TEST SUITE: ADMIN RATE UPDATE OPERATIONS
// ============================================================================

describe('Admin Rate Change Propagation - Rate Update Operations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Commission Rate Updates', () => {
    it('should update platform commission rate', async () => {
      const oldRates = centralizedCommissionEngine.getCommissionRates();
      const oldPlatformRate = oldRates.platform * 100;
      const newPlatformRate = 6; // 6%

      await centralizedCommissionEngine.updateCommissionRate(
        'platform',
        newPlatformRate,
        mockAdminUser.id,
        'Test rate update'
      );

      const updatedRates = centralizedCommissionEngine.getCommissionRates();
      expect(updatedRates.platform).toBeCloseTo(0.06, 4);
      expect(updatedRates.platform * 100).toBe(newPlatformRate);
    });

    it('should update agent commission rate', async () => {
      const newAgentRate = 4; // 4%

      await centralizedCommissionEngine.updateCommissionRate(
        'agent',
        newAgentRate,
        mockAdminUser.id,
        'Increase agent commission'
      );

      const updatedRates = centralizedCommissionEngine.getCommissionRates();
      expect(updatedRates.agent).toBeCloseTo(0.04, 4);
    });

    it('should update paystack fee rate', async () => {
      const newPaystackRate = 2; // 2%

      await centralizedCommissionEngine.updateCommissionRate(
        'paystack',
        newPaystackRate,
        mockAdminUser.id,
        'Update Paystack rate'
      );

      const updatedRates = centralizedCommissionEngine.getCommissionRates();
      expect(updatedRates.paystack).toBeCloseTo(0.02, 4);
    });

    it('should update VAT rate', async () => {
      const newVatRate = 15; // 15%

      await centralizedCommissionEngine.updateCommissionRate(
        'vat',
        newVatRate,
        mockAdminUser.id,
        'VAT rate adjustment'
      );

      const updatedRates = centralizedCommissionEngine.getCommissionRates();
      expect(updatedRates.vat).toBeCloseTo(0.15, 4);
    });

    it('should update configuration version after rate update', async () => {
      const configBefore = centralizedCommissionEngine.getConfigurationInfo();
      const versionBefore = configBefore.version;

      await centralizedCommissionEngine.updateCommissionRate(
        'platform',
        5.5,
        mockAdminUser.id,
        'Version tracking test'
      );

      const configAfter = centralizedCommissionEngine.getConfigurationInfo();
      const versionAfter = configAfter.version;

      expect(versionAfter).not.toBe(versionBefore);
    });
  });

  describe('Platform Fee Updates', () => {
    it('should update platform fixed fee', async () => {
      const newFixedFee = 150; // 150 GHS

      await centralizedCommissionEngine.updatePlatformFee(
        'fixed',
        newFixedFee,
        mockAdminUser.id,
        'Increase fixed fee'
      );

      const updatedFees = centralizedCommissionEngine.getPlatformFees();
      expect(updatedFees.fixed).toBe(newFixedFee);
    });

    it('should update agent minimum fee', async () => {
      const newMinimumFee = 120; // 120 GHS

      await centralizedCommissionEngine.updatePlatformFee(
        'agentMinimum',
        newMinimumFee,
        mockAdminUser.id,
        'Adjust agent minimum'
      );

      const updatedFees = centralizedCommissionEngine.getPlatformFees();
      expect(updatedFees.agentMinimum).toBe(newMinimumFee);
    });

    it('should update configuration version after fee update', async () => {
      const configBefore = centralizedCommissionEngine.getConfigurationInfo();
      const versionBefore = configBefore.version;

      await centralizedCommissionEngine.updatePlatformFee(
        'fixed',
        200,
        mockAdminUser.id,
        'Fee update version test'
      );

      const configAfter = centralizedCommissionEngine.getConfigurationInfo();
      const versionAfter = configAfter.version;

      expect(versionAfter).not.toBe(versionBefore);
    });
  });

  describe('Version Tracking', () => {
    it('should increment version after rate update', async () => {
      const configBefore = centralizedCommissionEngine.getConfigurationInfo();
      const versionBefore = configBefore.version;

      await centralizedCommissionEngine.updateCommissionRate(
        'platform',
        5.5,
        mockAdminUser.id,
        'Version increment test'
      );

      const configAfter = centralizedCommissionEngine.getConfigurationInfo();
      const versionAfter = configAfter.version;

      expect(versionAfter).not.toBe(versionBefore);
    });

    it('should update lastUpdated timestamp after change', async () => {
      const configBefore = centralizedCommissionEngine.getConfigurationInfo();
      const timestampBefore = new Date(configBefore.lastUpdated).getTime();

      // Wait 10ms to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 10));

      await centralizedCommissionEngine.updateCommissionRate(
        'agent',
        4,
        mockAdminUser.id,
        'Timestamp test'
      );

      const configAfter = centralizedCommissionEngine.getConfigurationInfo();
      const timestampAfter = new Date(configAfter.lastUpdated).getTime();

      expect(timestampAfter).toBeGreaterThan(timestampBefore);
    });
  });
});

// ============================================================================
// TEST SUITE: REAL-TIME SUBSCRIPTION CALLBACKS
// ============================================================================

describe('Admin Rate Change Propagation - Real-Time Subscriptions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Subscription Management', () => {
    it('should allow portals to subscribe to config changes', () => {
      const callback = vi.fn();
      const portalId = 'student_portal_test_1';

      const unsubscribe = centralizedCommissionEngine.subscribeToConfigChanges(
        portalId,
        'student',
        callback
      );

      expect(typeof unsubscribe).toBe('function');

      const configInfo = centralizedCommissionEngine.getConfigurationInfo();
      expect(configInfo.subscriberCount).toBeGreaterThan(0);
    });

    it('should allow multiple portals to subscribe', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const callback3 = vi.fn();

      const unsubscribe1 = centralizedCommissionEngine.subscribeToConfigChanges(
        'student_portal_1',
        'student',
        callback1
      );

      const unsubscribe2 = centralizedCommissionEngine.subscribeToConfigChanges(
        'owner_portal_1',
        'owner',
        callback2
      );

      const unsubscribe3 = centralizedCommissionEngine.subscribeToConfigChanges(
        'admin_portal_1',
        'admin',
        callback3
      );

      const configInfo = centralizedCommissionEngine.getConfigurationInfo();
      expect(configInfo.subscriberCount).toBeGreaterThanOrEqual(3);

      // Cleanup
      unsubscribe1();
      unsubscribe2();
      unsubscribe3();
    });

    it('should allow portals to unsubscribe', () => {
      const callback = vi.fn();
      const portalId = 'test_portal_unsubscribe';

      const unsubscribe = centralizedCommissionEngine.subscribeToConfigChanges(
        portalId,
        'student',
        callback
      );

      const configBefore = centralizedCommissionEngine.getConfigurationInfo();
      const subscribersBefore = configBefore.subscriberCount;

      unsubscribe();

      const configAfter = centralizedCommissionEngine.getConfigurationInfo();
      const subscribersAfter = configAfter.subscriberCount;

      expect(subscribersAfter).toBeLessThan(subscribersBefore);
    });
  });

  describe('Subscriber Notifications', () => {
    it('should notify subscribers when rate changes', async () => {
      const callback = vi.fn();
      const portalId = 'test_notification_portal';

      centralizedCommissionEngine.subscribeToConfigChanges(
        portalId,
        'student',
        callback
      );

      // Clear any previous calls
      callback.mockClear();

      // Update rate
      await centralizedCommissionEngine.updateCommissionRate(
        'platform',
        6,
        mockAdminUser.id,
        'Notification test'
      );

      // Callback should be called with updated config
      expect(callback).toHaveBeenCalled();
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          rates: expect.objectContaining({
            platform: expect.any(Number)
          })
        })
      );
    });

    it('should notify all subscribers when rate changes', async () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const callback3 = vi.fn();

      centralizedCommissionEngine.subscribeToConfigChanges('portal_1', 'student', callback1);
      centralizedCommissionEngine.subscribeToConfigChanges('portal_2', 'owner', callback2);
      centralizedCommissionEngine.subscribeToConfigChanges('portal_3', 'admin', callback3);

      // Clear previous calls
      callback1.mockClear();
      callback2.mockClear();
      callback3.mockClear();

      // Update rate
      await centralizedCommissionEngine.updateCommissionRate(
        'agent',
        4.5,
        mockAdminUser.id,
        'Multi-subscriber test'
      );

      // All callbacks should be called
      expect(callback1).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
      expect(callback3).toHaveBeenCalled();
    });

    it('should not notify unsubscribed portals', async () => {
      const callback = vi.fn();
      const portalId = 'test_unsubscribe_notification';

      const unsubscribe = centralizedCommissionEngine.subscribeToConfigChanges(
        portalId,
        'student',
        callback
      );

      // Unsubscribe immediately
      unsubscribe();

      // Clear any previous calls
      callback.mockClear();

      // Update rate
      await centralizedCommissionEngine.updateCommissionRate(
        'platform',
        5.5,
        mockAdminUser.id,
        'Unsubscribed notification test'
      );

      // Callback should NOT be called
      expect(callback).not.toHaveBeenCalled();
    });

    it('should provide updated config in notification callback', async () => {
      const callback = vi.fn();
      const newRate = 7; // 7%

      centralizedCommissionEngine.subscribeToConfigChanges(
        'test_config_portal',
        'student',
        callback
      );

      callback.mockClear();

      await centralizedCommissionEngine.updateCommissionRate(
        'platform',
        newRate,
        mockAdminUser.id,
        'Config verification test'
      );

      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          rates: expect.objectContaining({
            platform: expect.closeTo(0.07, 4)
          })
        })
      );
    });
  });
});

// ============================================================================
// TEST SUITE: COMMISSION CALCULATION WITH UPDATED RATES
// ============================================================================

describe('Admin Rate Change Propagation - Commission Calculations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Calculation Accuracy After Rate Changes', () => {
    it('should use new platform rate in calculations', async () => {
      const baseAmount = 1000;
      const newPlatformRate = 6; // 6%

      // Update rate
      await centralizedCommissionEngine.updateCommissionRate(
        'platform',
        newPlatformRate,
        mockAdminUser.id,
        'Platform rate calculation test'
      );

      // Calculate commissions
      const result = centralizedCommissionEngine.calculateCommissions(baseAmount, false);

      // Platform commission should be 6% of 1000 = 60 GHS
      expect(result.platformCommission).toBeCloseTo(60, 2);
    });

    it('should use new agent rate in calculations', async () => {
      const baseAmount = 5000;
      const newAgentRate = 5; // 5%

      // Update rate
      await centralizedCommissionEngine.updateCommissionRate(
        'agent',
        newAgentRate,
        mockAdminUser.id,
        'Agent rate calculation test'
      );

      // Calculate commissions with agent
      const result = centralizedCommissionEngine.calculateCommissions(baseAmount, true);

      // Agent commission should be 5% of 5000 = 250 GHS
      expect(result.agentCommission).toBeCloseTo(250, 2);
    });

    it('should use new VAT rate in calculations', async () => {
      const baseAmount = 1000;
      const newVatRate = 15; // 15%

      // Update rate
      await centralizedCommissionEngine.updateCommissionRate(
        'vat',
        newVatRate,
        mockAdminUser.id,
        'VAT rate calculation test'
      );

      // Calculate commissions
      const result = centralizedCommissionEngine.calculateCommissions(baseAmount, false);

      // VAT should be 15% of beforeVat amount
      const expectedVat = result.breakdown.beforeVat * 0.15;
      expect(result.vatAmount).toBeCloseTo(expectedVat, 2);
    });

    it('should use new fixed fee in calculations', async () => {
      const baseAmount = 1000;
      const newFixedFee = 150; // 150 GHS

      // Update fee
      await centralizedCommissionEngine.updatePlatformFee(
        'fixed',
        newFixedFee,
        mockAdminUser.id,
        'Fixed fee calculation test'
      );

      // Calculate commissions
      const result = centralizedCommissionEngine.calculateCommissions(baseAmount, false);

      // Platform fixed fee should be 150 GHS
      expect(result.platformFixedFee).toBe(newFixedFee);
    });

    it('should recalculate total amount after rate changes', async () => {
      const baseAmount = 1000;

      // Calculate with original rates
      const resultBefore = centralizedCommissionEngine.calculateCommissions(baseAmount, false);
      const totalBefore = resultBefore.totalAmount;

      // Update platform rate (increase)
      await centralizedCommissionEngine.updateCommissionRate(
        'platform',
        10, // 10% (doubled from 5%)
        mockAdminUser.id,
        'Total recalculation test'
      );

      // Calculate with new rates
      const resultAfter = centralizedCommissionEngine.calculateCommissions(baseAmount, false);
      const totalAfter = resultAfter.totalAmount;

      // Total should be higher after rate increase
      expect(totalAfter).toBeGreaterThan(totalBefore);
    });
  });

  describe('Breakdown Accuracy After Rate Changes', () => {
    it('should provide accurate breakdown with new rates', async () => {
      const baseAmount = 3000;
      const newPlatformRate = 7; // 7%
      const newAgentRate = 5; // 5%

      // Update rates
      await centralizedCommissionEngine.updateCommissionRate(
        'platform',
        newPlatformRate,
        mockAdminUser.id,
        'Breakdown test'
      );

      await centralizedCommissionEngine.updateCommissionRate(
        'agent',
        newAgentRate,
        mockAdminUser.id,
        'Breakdown test'
      );

      // Calculate with agent
      const result = centralizedCommissionEngine.calculateCommissions(baseAmount, true);

      // Verify breakdown
      expect(result.baseAmount).toBe(baseAmount);
      expect(result.platformCommission).toBeCloseTo(210, 2); // 7% of 3000
      expect(result.agentCommission).toBeCloseTo(150, 2); // 5% of 3000 = 150 (above minimum)
      expect(result.ownerReceives).toBe(baseAmount);
    });

    it('should include breakdown details in result', async () => {
      const baseAmount = 1000;

      await centralizedCommissionEngine.updateCommissionRate(
        'platform',
        8,
        mockAdminUser.id,
        'Breakdown details test'
      );

      const result = centralizedCommissionEngine.calculateCommissions(baseAmount, false);

      expect(result.breakdown).toBeDefined();
      expect(result.breakdown.subtotal).toBeGreaterThan(baseAmount);
      expect(result.breakdown.beforeVat).toBeGreaterThan(result.breakdown.subtotal);
      expect(result.breakdown.totalFees).toBeGreaterThan(0);
    });
  });
});

// ============================================================================
// TEST SUITE: RATE CHANGE AUDIT TRAIL
// ============================================================================

describe('Admin Rate Change Propagation - Audit Trail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rate Change Tracking via Configuration Info', () => {
    it('should update version after multiple rate changes', async () => {
      const configBefore = centralizedCommissionEngine.getConfigurationInfo();
      const versionBefore = configBefore.version;

      await centralizedCommissionEngine.updateCommissionRate(
        'platform',
        6,
        mockAdminUser.id,
        'First change'
      );

      const configMiddle = centralizedCommissionEngine.getConfigurationInfo();
      const versionMiddle = configMiddle.version;

      await centralizedCommissionEngine.updateCommissionRate(
        'agent',
        4,
        mockAdminUser.id,
        'Second change'
      );

      const configAfter = centralizedCommissionEngine.getConfigurationInfo();
      const versionAfter = configAfter.version;

      expect(versionMiddle).not.toBe(versionBefore);
      expect(versionAfter).not.toBe(versionMiddle);
    });

    it('should update lastUpdated timestamp after each change', async () => {
      const configBefore = centralizedCommissionEngine.getConfigurationInfo();
      const timestampBefore = new Date(configBefore.lastUpdated).getTime();

      // Wait 10ms to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 10));

      await centralizedCommissionEngine.updateCommissionRate(
        'platform',
        5.5,
        mockAdminUser.id,
        'Timestamp test'
      );

      const configAfter = centralizedCommissionEngine.getConfigurationInfo();
      const timestampAfter = new Date(configAfter.lastUpdated).getTime();

      expect(timestampAfter).toBeGreaterThan(timestampBefore);
    });

    it('should track rate changes through configuration updates', async () => {
      const ratesBefore = centralizedCommissionEngine.getCommissionRates();
      const oldPlatformRate = ratesBefore.platform;
      const newPlatformRate = 6.5;

      await centralizedCommissionEngine.updateCommissionRate(
        'platform',
        newPlatformRate,
        mockAdminUser.id,
        'Rate tracking test'
      );

      const ratesAfter = centralizedCommissionEngine.getCommissionRates();
      const updatedPlatformRate = ratesAfter.platform;

      expect(updatedPlatformRate).not.toBe(oldPlatformRate);
      expect(updatedPlatformRate).toBeCloseTo(0.065, 4);
    });
  });

  describe('Configuration Info Tracking', () => {
    it('should provide current configuration info', () => {
      const configInfo = centralizedCommissionEngine.getConfigurationInfo();

      expect(configInfo).toHaveProperty('version');
      expect(configInfo).toHaveProperty('lastUpdated');
      expect(configInfo).toHaveProperty('environment');
      expect(configInfo).toHaveProperty('subscriberCount');
      expect(configInfo).toHaveProperty('isRealTimeEnabled');
    });

    it('should update configuration info after changes', async () => {
      const configBefore = centralizedCommissionEngine.getConfigurationInfo();

      await centralizedCommissionEngine.updateCommissionRate(
        'platform',
        6,
        mockAdminUser.id,
        'Config info update test'
      );

      const configAfter = centralizedCommissionEngine.getConfigurationInfo();

      expect(configAfter.version).not.toBe(configBefore.version);
      expect(new Date(configAfter.lastUpdated).getTime()).toBeGreaterThanOrEqual(
        new Date(configBefore.lastUpdated).getTime()
      );
    });
  });

  describe('Rate Change Validation', () => {
    it('should validate platform rate within allowed range', async () => {
      // Valid rate (within 1-15%)
      await expect(
        centralizedCommissionEngine.updateCommissionRate(
          'platform',
          10,
          mockAdminUser.id,
          'Valid rate test'
        )
      ).resolves.not.toThrow();
    });

    it('should reject platform rate below minimum', async () => {
      // Invalid rate (below 1%)
      await expect(
        centralizedCommissionEngine.updateCommissionRate(
          'platform',
          0.5,
          mockAdminUser.id,
          'Invalid rate test'
        )
      ).rejects.toThrow();
    });

    it('should reject platform rate above maximum', async () => {
      // Invalid rate (above 15%)
      await expect(
        centralizedCommissionEngine.updateCommissionRate(
          'platform',
          20,
          mockAdminUser.id,
          'Invalid rate test'
        )
      ).rejects.toThrow();
    });

    it('should validate agent rate within allowed range', async () => {
      // Valid rate (within 0-10%)
      await expect(
        centralizedCommissionEngine.updateCommissionRate(
          'agent',
          5,
          mockAdminUser.id,
          'Valid agent rate test'
        )
      ).resolves.not.toThrow();
    });

    it('should reject agent rate above maximum', async () => {
      // Invalid rate (above 10%)
      await expect(
        centralizedCommissionEngine.updateCommissionRate(
          'agent',
          15,
          mockAdminUser.id,
          'Invalid agent rate test'
        )
      ).rejects.toThrow();
    });

    it('should validate fixed fee within allowed range', async () => {
      // Valid fee (within 0-1000 GHS)
      await expect(
        centralizedCommissionEngine.updatePlatformFee(
          'fixed',
          500,
          mockAdminUser.id,
          'Valid fee test'
        )
      ).resolves.not.toThrow();
    });

    it('should reject fixed fee above maximum', async () => {
      // Invalid fee (above 1000 GHS)
      await expect(
        centralizedCommissionEngine.updatePlatformFee(
          'fixed',
          1500,
          mockAdminUser.id,
          'Invalid fee test'
        )
      ).rejects.toThrow();
    });
  });
});
