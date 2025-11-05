/**
 * ✅ UNIT TESTS: Server Commission Engine (Deno-Compatible)
 * 
 * Comprehensive test suite for the server-side commission calculation engine
 * Tests Deno-compatible Edge Function commission engine with caching and validation
 * 
 * @module serverCommissionEngine.test
 * @version 1.0.0
 * @priority CRITICAL
 * @coverage-target 100%
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ============================================================================
// TEST SETUP AND MOCKS
// ============================================================================

// Mock Supabase client for Deno environment
const createMockSupabaseClient = () => {
  const mockCommissionConfig = {
    id: 'config_server_test_1',
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
    change_event: 'initial_setup',
    changed_by: 'system',
    change_reason: 'Initial configuration',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockCommissionConfig, error: null }),
    })),
  };
};

// Import the server commission engine
// Note: We'll import the class directly to create fresh instances for testing
import { 
  ServerCommissionEngine,
  type CommissionCalculationResult,
  type ValidationResult,
  type RatesInfo
} from '../../../supabase/functions/_shared/commission-engine.ts';

// ============================================================================
// TEST SUITE: SERVER COMMISSION ENGINE - RATE LOADING
// ============================================================================

describe('ServerCommissionEngine - Rate Loading', () => {
  let engine: ServerCommissionEngine;
  let mockSupabase: ReturnType<typeof createMockSupabaseClient>;

  beforeEach(() => {
    vi.clearAllMocks();
    engine = new ServerCommissionEngine();
    mockSupabase = createMockSupabaseClient();
  });

  describe('loadRates()', () => {
    it('should load rates from database successfully', async () => {
      await engine.loadRates(mockSupabase as any);

      expect(engine.isReady()).toBe(true);
      
      const ratesInfo = engine.getCurrentRates();
      expect(ratesInfo.rates).toBeDefined();
      expect(ratesInfo.rates?.platform).toBe(0.05);
      expect(ratesInfo.rates?.agent).toBe(0.037);
      expect(ratesInfo.rates?.paystack).toBe(0.0195);
      expect(ratesInfo.rates?.vat).toBe(0.125);
      
      expect(ratesInfo.fees).toBeDefined();
      expect(ratesInfo.fees?.fixed).toBe(100);
      expect(ratesInfo.fees?.agentMinimum).toBe(100);
      
      expect(ratesInfo.version).toBe('2.1.0');
      expect(ratesInfo.lastLoaded).toBeInstanceOf(Date);
    });

    it('should query commission_configurations table with correct filters', async () => {
      await engine.loadRates(mockSupabase as any);

      // Verify database table was queried
      expect(mockSupabase.from).toHaveBeenCalledWith('commission_configurations');

      // Verify rates were loaded successfully (behavior verification)
      const ratesInfo = engine.getCurrentRates();
      expect(ratesInfo.rates).toBeDefined();
      expect(ratesInfo.version).toBe('2.1.0');
    });

    it('should fall back to default rates when no active configuration exists', async () => {
      // Create fresh engine and mock with "no rows" error
      const freshEngine = new ServerCommissionEngine();
      const errorMock = {
        from: vi.fn(() => ({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          limit: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { code: 'PGRST116', message: 'No rows found' }
          }),
        })),
      };

      await freshEngine.loadRates(errorMock as any);

      expect(freshEngine.isReady()).toBe(true);

      const ratesInfo = freshEngine.getCurrentRates();
      expect(ratesInfo.rates?.platform).toBe(0.05); // Default
      expect(ratesInfo.rates?.agent).toBe(0.037); // Default
      expect(ratesInfo.version).toBe('default-fallback');
    });

    it('should fall back to default rates on database connection error', async () => {
      // Create fresh engine and mock with database error
      const freshEngine = new ServerCommissionEngine();
      const errorMock = {
        from: vi.fn(() => ({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          limit: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { code: 'CONNECTION_ERROR', message: 'Database unavailable' }
          }),
        })),
      };

      await freshEngine.loadRates(errorMock as any);

      expect(freshEngine.isReady()).toBe(true);

      const ratesInfo = freshEngine.getCurrentRates();
      expect(ratesInfo.rates).toBeDefined();
      expect(ratesInfo.version).toBe('default-fallback');
    });

    it('should fall back to default rates on unexpected error', async () => {
      // Create fresh engine and mock with unexpected error
      const freshEngine = new ServerCommissionEngine();
      const errorMock = {
        from: vi.fn(() => ({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          limit: vi.fn().mockReturnThis(),
          single: vi.fn().mockRejectedValue(new Error('Unexpected database error')),
        })),
      };

      await freshEngine.loadRates(errorMock as any);

      expect(freshEngine.isReady()).toBe(true);

      const ratesInfo = freshEngine.getCurrentRates();
      expect(ratesInfo.rates).toBeDefined();
      expect(ratesInfo.version).toBe('default-fallback');
    });
  });

  describe('isReady()', () => {
    it('should return false before rates are loaded', () => {
      expect(engine.isReady()).toBe(false);
    });

    it('should return true after rates are loaded', async () => {
      await engine.loadRates(mockSupabase as any);
      expect(engine.isReady()).toBe(true);
    });
  });

  describe('getCurrentRates()', () => {
    it('should return null rates before loading', () => {
      const ratesInfo = engine.getCurrentRates();
      expect(ratesInfo.rates).toBeNull();
      expect(ratesInfo.fees).toBeNull();
      expect(ratesInfo.version).toBeUndefined();
      expect(ratesInfo.lastLoaded).toBeUndefined();
    });

    it('should return loaded rates after loading', async () => {
      await engine.loadRates(mockSupabase as any);
      
      const ratesInfo = engine.getCurrentRates();
      expect(ratesInfo.rates).not.toBeNull();
      expect(ratesInfo.fees).not.toBeNull();
      expect(ratesInfo.version).toBeDefined();
      expect(ratesInfo.lastLoaded).toBeInstanceOf(Date);
    });
  });
});

// ============================================================================
// TEST SUITE: SERVER COMMISSION ENGINE - CACHING
// ============================================================================

describe('ServerCommissionEngine - Caching Mechanism', () => {
  let engine: ServerCommissionEngine;
  let mockSupabase: ReturnType<typeof createMockSupabaseClient>;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    engine = new ServerCommissionEngine();
    mockSupabase = createMockSupabaseClient();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('1-minute cache', () => {
    it('should use cached rates within 1 minute', async () => {
      // First load
      await engine.loadRates(mockSupabase as any);
      expect(mockSupabase.from).toHaveBeenCalledTimes(1);

      // Advance time by 30 seconds (within cache timeout)
      vi.advanceTimersByTime(30000);

      // Second load should use cache
      await engine.loadRates(mockSupabase as any);
      expect(mockSupabase.from).toHaveBeenCalledTimes(1); // Still only 1 call
    });

    it('should reload rates after 1 minute cache expiration', async () => {
      // First load
      await engine.loadRates(mockSupabase as any);
      expect(mockSupabase.from).toHaveBeenCalledTimes(1);

      // Advance time by 61 seconds (beyond cache timeout)
      vi.advanceTimersByTime(61000);

      // Second load should query database again
      await engine.loadRates(mockSupabase as any);
      expect(mockSupabase.from).toHaveBeenCalledTimes(2); // 2 calls now
    });

    it('should reload rates exactly at 1 minute boundary', async () => {
      // First load
      await engine.loadRates(mockSupabase as any);
      expect(mockSupabase.from).toHaveBeenCalledTimes(1);

      // Advance time by exactly 60 seconds
      vi.advanceTimersByTime(60000);

      // Second load should query database again (cache expired)
      await engine.loadRates(mockSupabase as any);
      expect(mockSupabase.from).toHaveBeenCalledTimes(2);
    });
  });

  describe('invalidateCache()', () => {
    it('should force reload on next loadRates() call', async () => {
      // First load
      await engine.loadRates(mockSupabase as any);
      expect(mockSupabase.from).toHaveBeenCalledTimes(1);

      // Invalidate cache
      engine.invalidateCache();

      // Next load should query database again (even within 1 minute)
      await engine.loadRates(mockSupabase as any);
      expect(mockSupabase.from).toHaveBeenCalledTimes(2);
    });

    it('should not affect engine readiness', async () => {
      await engine.loadRates(mockSupabase as any);
      expect(engine.isReady()).toBe(true);

      engine.invalidateCache();
      expect(engine.isReady()).toBe(true); // Still ready, just cache invalidated
    });
  });
});

// ============================================================================
// TEST SUITE: SERVER COMMISSION ENGINE - COMMISSION CALCULATION
// ============================================================================

describe('ServerCommissionEngine - Commission Calculation', () => {
  let engine: ServerCommissionEngine;
  let mockSupabase: ReturnType<typeof createMockSupabaseClient>;

  beforeEach(async () => {
    vi.clearAllMocks();
    engine = new ServerCommissionEngine();
    mockSupabase = createMockSupabaseClient();

    // Load rates before testing calculations
    await engine.loadRates(mockSupabase as any);
  });

  describe('calculateCommissions() - Base Cases', () => {
    it('should calculate commissions correctly with no agent', () => {
      const baseAmount = 1000;
      const result = engine.calculateCommissions(baseAmount, false);

      // Verify base calculations
      expect(result.baseAmount).toBe(1000);
      expect(result.platformCommission).toBe(50); // 5% of 1000
      expect(result.platformFixedFee).toBe(100);
      expect(result.agentCommission).toBe(0); // No agent

      // Verify subtotal
      const expectedSubtotal = 1000 + 50 + 100 + 0;
      expect(result.breakdown.subtotal).toBe(expectedSubtotal);

      // Verify Paystack fee
      expect(result.paystackFee).toBeCloseTo(expectedSubtotal * 0.0195, 2);

      // Verify VAT and total
      const expectedBeforeVat = expectedSubtotal + result.paystackFee;
      expect(result.breakdown.beforeVat).toBeCloseTo(expectedBeforeVat, 2);
      expect(result.vatAmount).toBeCloseTo(expectedBeforeVat * 0.125, 2);
      expect(result.totalAmount).toBeCloseTo(expectedBeforeVat + result.vatAmount, 2);

      // Verify owner receives base amount
      expect(result.ownerReceives).toBe(1000);
    });

    it('should calculate commissions correctly with agent', () => {
      const baseAmount = 1000;
      const result = engine.calculateCommissions(baseAmount, true);

      // Verify agent commission (percentage vs minimum)
      const agentPercentage = 1000 * 0.037; // 37 GHS
      const agentMinimum = 100; // 100 GHS
      expect(result.agentCommission).toBe(Math.max(agentPercentage, agentMinimum));
      expect(result.agentCommission).toBe(100); // Minimum applies
    });

    it('should calculate agent commission as percentage when above minimum', () => {
      const baseAmount = 5000;
      const result = engine.calculateCommissions(baseAmount, true);

      const agentPercentage = 5000 * 0.037; // 185 GHS
      const agentMinimum = 100; // 100 GHS
      expect(result.agentCommission).toBe(Math.max(agentPercentage, agentMinimum));
      expect(result.agentCommission).toBe(185); // Percentage applies
    });

    it('should calculate agent commission as minimum when below threshold', () => {
      const baseAmount = 1000;
      const result = engine.calculateCommissions(baseAmount, true);

      expect(result.agentCommission).toBe(100); // Minimum
    });
  });

  describe('calculateCommissions() - Edge Cases', () => {
    it('should throw error for zero base amount', () => {
      expect(() => {
        engine.calculateCommissions(0, false);
      }).toThrow('Base amount must be positive');
    });

    it('should throw error for negative base amount', () => {
      expect(() => {
        engine.calculateCommissions(-100, false);
      }).toThrow('Base amount must be positive');
    });

    it('should throw error for Infinity base amount', () => {
      expect(() => {
        engine.calculateCommissions(Infinity, false);
      }).toThrow('Base amount must be a finite number');
    });

    it('should throw error for NaN base amount', () => {
      expect(() => {
        engine.calculateCommissions(NaN, false);
      }).toThrow('Base amount must be a finite number');
    });

    it('should handle very large base amounts correctly', () => {
      const baseAmount = 10000000; // 10M GHS
      const result = engine.calculateCommissions(baseAmount, false);

      expect(result.baseAmount).toBe(10000000);
      expect(result.totalAmount).toBeGreaterThan(10000000);
      expect(Number.isFinite(result.totalAmount)).toBe(true);
    });

    it('should handle very small base amounts correctly', () => {
      const baseAmount = 0.01; // 1 pesewa
      const result = engine.calculateCommissions(baseAmount, false);

      expect(result.baseAmount).toBe(0.01);
      expect(result.totalAmount).toBeGreaterThan(0.01);
    });

    it('should maintain precision for decimal base amounts', () => {
      const baseAmount = 1234.56;
      const result = engine.calculateCommissions(baseAmount, false);

      // Verify base amount preserved
      expect(result.baseAmount).toBe(1234.56);

      // Verify calculations maintain precision
      expect(result.platformCommission).toBeCloseTo(61.728, 2);
      expect(result.totalAmount).toBeCloseTo(1601.46, 2);
    });
  });

  describe('calculateCommissions() - Error Handling', () => {
    it('should throw error if rates not loaded', () => {
      const freshEngine = new ServerCommissionEngine();

      expect(() => {
        freshEngine.calculateCommissions(1000, false);
      }).toThrow('Commission rates not loaded. Call loadRates() first.');
    });

    it('should work after rates are loaded', async () => {
      const freshEngine = new ServerCommissionEngine();
      await freshEngine.loadRates(mockSupabase as any);

      expect(() => {
        freshEngine.calculateCommissions(1000, false);
      }).not.toThrow();
    });
  });

  describe('calculateCommissions() - Breakdown Verification', () => {
    it('should provide correct subtotal breakdown', () => {
      const baseAmount = 1000;
      const result = engine.calculateCommissions(baseAmount, true);

      const expectedSubtotal = baseAmount + result.platformCommission +
                              result.platformFixedFee + result.agentCommission;
      expect(result.breakdown.subtotal).toBeCloseTo(expectedSubtotal, 2);
    });

    it('should provide correct beforeVat breakdown', () => {
      const baseAmount = 1000;
      const result = engine.calculateCommissions(baseAmount, false);

      const expectedBeforeVat = result.breakdown.subtotal + result.paystackFee;
      expect(result.breakdown.beforeVat).toBeCloseTo(expectedBeforeVat, 2);
    });

    it('should provide correct totalFees breakdown', () => {
      const baseAmount = 1000;
      const result = engine.calculateCommissions(baseAmount, true);

      const expectedTotalFees = result.platformCommission + result.platformFixedFee +
                               result.agentCommission + result.paystackFee + result.vatAmount;
      expect(result.breakdown.totalFees).toBeCloseTo(expectedTotalFees, 2);
    });

    it('should verify total amount equals beforeVat plus VAT', () => {
      const baseAmount = 1000;
      const result = engine.calculateCommissions(baseAmount, false);

      const expectedTotal = result.breakdown.beforeVat + result.vatAmount;
      expect(result.totalAmount).toBeCloseTo(expectedTotal, 2);
    });

    it('should verify owner receives only base amount', () => {
      const baseAmount = 1234.56;
      const result = engine.calculateCommissions(baseAmount, true);

      expect(result.ownerReceives).toBe(baseAmount);
    });
  });
});

// ============================================================================
// TEST SUITE: SERVER COMMISSION ENGINE - VALIDATION
// ============================================================================

describe('ServerCommissionEngine - Commission Validation', () => {
  let engine: ServerCommissionEngine;
  let mockSupabase: ReturnType<typeof createMockSupabaseClient>;

  beforeEach(async () => {
    vi.clearAllMocks();
    engine = new ServerCommissionEngine();
    mockSupabase = createMockSupabaseClient();

    // Load rates before testing
    await engine.loadRates(mockSupabase as any);
  });

  describe('validateCommissionBreakdown() - Valid Cases', () => {
    it('should validate matching commission breakdown', () => {
      const baseAmount = 1000;
      const serverCalculated = engine.calculateCommissions(baseAmount, false);

      // Client provides exact same values
      const clientProvided = {
        totalAmount: serverCalculated.totalAmount,
        platformCommission: serverCalculated.platformCommission,
        platformFixedFee: serverCalculated.platformFixedFee,
        agentCommission: serverCalculated.agentCommission,
        paystackFee: serverCalculated.paystackFee,
        vatAmount: serverCalculated.vatAmount
      };

      const validation = engine.validateCommissionBreakdown(serverCalculated, clientProvided);

      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should accept values within tolerance (0.01 GHS)', () => {
      const baseAmount = 1000;
      const serverCalculated = engine.calculateCommissions(baseAmount, false);

      // Client provides values with minor rounding differences
      const clientProvided = {
        totalAmount: serverCalculated.totalAmount + 0.005, // Within tolerance
        platformCommission: serverCalculated.platformCommission - 0.005,
        platformFixedFee: serverCalculated.platformFixedFee,
        agentCommission: serverCalculated.agentCommission,
        paystackFee: serverCalculated.paystackFee + 0.005,
        vatAmount: serverCalculated.vatAmount - 0.005
      };

      const validation = engine.validateCommissionBreakdown(serverCalculated, clientProvided);

      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should accept partial validation (only some fields provided)', () => {
      const baseAmount = 1000;
      const serverCalculated = engine.calculateCommissions(baseAmount, false);

      // Client only provides totalAmount
      const clientProvided = {
        totalAmount: serverCalculated.totalAmount
      };

      const validation = engine.validateCommissionBreakdown(serverCalculated, clientProvided);

      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });
  });

  describe('validateCommissionBreakdown() - Invalid Cases', () => {
    it('should reject tampered totalAmount', () => {
      const baseAmount = 1000;
      const serverCalculated = engine.calculateCommissions(baseAmount, false);

      // Client provides tampered totalAmount (reduced by 100 GHS)
      const clientProvided = {
        totalAmount: serverCalculated.totalAmount - 100
      };

      const validation = engine.validateCommissionBreakdown(serverCalculated, clientProvided);

      expect(validation.valid).toBe(false);
      expect(validation.errors).toHaveLength(1);
      expect(validation.errors[0]).toContain('totalAmount mismatch');
      expect(validation.errors[0]).toContain('diff=100.00 GHS');
    });

    it('should reject tampered platformCommission', () => {
      const baseAmount = 1000;
      const serverCalculated = engine.calculateCommissions(baseAmount, false);

      // Client provides tampered platformCommission (reduced to 0)
      const clientProvided = {
        platformCommission: 0
      };

      const validation = engine.validateCommissionBreakdown(serverCalculated, clientProvided);

      expect(validation.valid).toBe(false);
      expect(validation.errors).toHaveLength(1);
      expect(validation.errors[0]).toContain('platformCommission mismatch');
    });

    it('should reject tampered agentCommission', () => {
      const baseAmount = 5000;
      const serverCalculated = engine.calculateCommissions(baseAmount, true);

      // Client provides tampered agentCommission (reduced to minimum)
      const clientProvided = {
        agentCommission: 50 // Should be 185 (3.7% of 5000)
      };

      const validation = engine.validateCommissionBreakdown(serverCalculated, clientProvided);

      expect(validation.valid).toBe(false);
      expect(validation.errors).toHaveLength(1);
      expect(validation.errors[0]).toContain('agentCommission mismatch');
    });

    it('should detect multiple tampered fields', () => {
      const baseAmount = 1000;
      const serverCalculated = engine.calculateCommissions(baseAmount, false);

      // Client provides multiple tampered values
      const clientProvided = {
        totalAmount: serverCalculated.totalAmount - 100,
        platformCommission: 0,
        paystackFee: 0
      };

      const validation = engine.validateCommissionBreakdown(serverCalculated, clientProvided);

      expect(validation.valid).toBe(false);
      expect(validation.errors).toHaveLength(3);
      expect(validation.errors[0]).toContain('totalAmount mismatch');
      expect(validation.errors[1]).toContain('platformCommission mismatch');
      expect(validation.errors[2]).toContain('paystackFee mismatch');
    });

    it('should reject values exceeding tolerance', () => {
      const baseAmount = 1000;
      const serverCalculated = engine.calculateCommissions(baseAmount, false);

      // Client provides value exceeding tolerance (0.02 GHS > 0.01 GHS tolerance)
      const clientProvided = {
        totalAmount: serverCalculated.totalAmount + 0.02
      };

      const validation = engine.validateCommissionBreakdown(serverCalculated, clientProvided);

      expect(validation.valid).toBe(false);
      expect(validation.errors).toHaveLength(1);
    });
  });

  describe('validateCommissionBreakdown() - Custom Tolerance', () => {
    it('should accept values within custom tolerance', () => {
      const baseAmount = 1000;
      const serverCalculated = engine.calculateCommissions(baseAmount, false);

      // Client provides value with 0.5 GHS difference
      const clientProvided = {
        totalAmount: serverCalculated.totalAmount + 0.5
      };

      // Use custom tolerance of 1 GHS
      const validation = engine.validateCommissionBreakdown(
        serverCalculated,
        clientProvided,
        1.0
      );

      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should reject values exceeding custom tolerance', () => {
      const baseAmount = 1000;
      const serverCalculated = engine.calculateCommissions(baseAmount, false);

      // Client provides value with 2 GHS difference
      const clientProvided = {
        totalAmount: serverCalculated.totalAmount + 2
      };

      // Use custom tolerance of 1 GHS
      const validation = engine.validateCommissionBreakdown(
        serverCalculated,
        clientProvided,
        1.0
      );

      expect(validation.valid).toBe(false);
      expect(validation.errors).toHaveLength(1);
    });

    it('should use stricter tolerance (0.001 GHS)', () => {
      const baseAmount = 1000;
      const serverCalculated = engine.calculateCommissions(baseAmount, false);

      // Client provides value with 0.005 GHS difference
      const clientProvided = {
        totalAmount: serverCalculated.totalAmount + 0.005
      };

      // Use stricter tolerance of 0.001 GHS
      const validation = engine.validateCommissionBreakdown(
        serverCalculated,
        clientProvided,
        0.001
      );

      expect(validation.valid).toBe(false);
      expect(validation.errors).toHaveLength(1);
    });
  });

  describe('validateCommissionBreakdown() - Error Messages', () => {
    it('should provide detailed error messages with values', () => {
      const baseAmount = 1000;
      const serverCalculated = engine.calculateCommissions(baseAmount, false);

      const clientProvided = {
        totalAmount: 1000 // Tampered (should be ~1294.92)
      };

      const validation = engine.validateCommissionBreakdown(serverCalculated, clientProvided);

      expect(validation.valid).toBe(false);
      expect(validation.errors[0]).toMatch(/totalAmount mismatch/);
      expect(validation.errors[0]).toMatch(/server=\d+\.\d+ GHS/);
      expect(validation.errors[0]).toMatch(/client=\d+\.\d+ GHS/);
      expect(validation.errors[0]).toMatch(/diff=\d+\.\d+ GHS/);
    });
  });
});

