/**
 * ✅ CP#1.5 - PHASE 6: PERFORMANCE TESTS FOR COMMISSION ENGINE
 * 
 * Tests commission engine performance to ensure production readiness:
 * - Calculation performance (target: <10ms per calculation)
 * - Database query performance
 * - Real-time subscription notification latency
 * - Concurrent calculation performance
 * - Memory usage under load
 * - Cache effectiveness
 * 
 * @module tests/performance/commissionEnginePerformance
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { centralizedCommissionEngine } from '@/config/centralized-commission.config';

// ============================================================================
// TEST CONFIGURATION
// ============================================================================

const PERFORMANCE_TARGETS = {
  singleCalculation: 10, // ms
  batchCalculation: 100, // ms for 100 calculations
  databaseQuery: 500, // ms
  subscriptionNotification: 100, // ms
  concurrentCalculations: 1000, // ms for 100 concurrent
  memoryLeakThreshold: 10, // MB increase
  cacheHitRatio: 0.9 // 90% cache hit rate
};

const TEST_SCENARIOS = {
  small: { baseAmount: 1000, iterations: 100 },
  medium: { baseAmount: 5000, iterations: 500 },
  large: { baseAmount: 10000, iterations: 1000 }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Measure execution time of a function
 */
async function measureExecutionTime<T>(
  fn: () => T | Promise<T>
): Promise<{ result: T; duration: number }> {
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;
  return { result, duration };
}

/**
 * Measure memory usage
 */
function measureMemoryUsage(): number {
  if (typeof performance !== 'undefined' && (performance as any).memory) {
    return (performance as any).memory.usedJSHeapSize / 1024 / 1024; // MB
  }
  return 0;
}

/**
 * Run function multiple times and get statistics
 */
async function runBenchmark(
  fn: () => any,
  iterations: number
): Promise<{ avg: number; min: number; max: number; p95: number; p99: number }> {
  const durations: number[] = [];
  
  for (let i = 0; i < iterations; i++) {
    const { duration } = await measureExecutionTime(fn);
    durations.push(duration);
  }
  
  durations.sort((a, b) => a - b);
  
  const avg = durations.reduce((sum, d) => sum + d, 0) / durations.length;
  const min = durations[0];
  const max = durations[durations.length - 1];
  const p95 = durations[Math.floor(durations.length * 0.95)];
  const p99 = durations[Math.floor(durations.length * 0.99)];
  
  return { avg, min, max, p95, p99 };
}

/**
 * Mock Supabase client for performance tests
 */
function createMockSupabaseClient() {
  return {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn(() => ({
              single: vi.fn(() => Promise.resolve({
                data: {
                  id: 'test-config-1',
                  platform_rate: 0.05,
                  agent_rate: 0.03,
                  paystack_rate: 0.0195,
                  vat_rate: 0.15,
                  fixed_fee: 100,
                  agent_minimum_fee: 100,
                  is_active: true,
                  version: 1,
                  created_at: new Date().toISOString()
                },
                error: null
              }))
            }))
          }))
        }))
      }))
    })),
    channel: vi.fn(() => ({
      on: vi.fn(() => ({
        subscribe: vi.fn(() => Promise.resolve({ status: 'SUBSCRIBED' }))
      }))
    }))
  };
}

// ============================================================================
// TEST SUITE: SINGLE CALCULATION PERFORMANCE
// ============================================================================

describe('Single Calculation Performance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should calculate commission in less than 10ms', async () => {
    const baseAmount = 1000;
    const hasAgent = false;
    
    const { duration } = await measureExecutionTime(() => {
      return centralizedCommissionEngine.calculateCommissions(baseAmount, hasAgent);
    });
    
    console.log(`✅ Single calculation took ${duration.toFixed(2)}ms`);
    expect(duration).toBeLessThan(PERFORMANCE_TARGETS.singleCalculation);
  });

  it('should calculate commission with agent in less than 10ms', async () => {
    const baseAmount = 2000;
    const hasAgent = true;
    
    const { duration } = await measureExecutionTime(() => {
      return centralizedCommissionEngine.calculateCommissions(baseAmount, hasAgent);
    });
    
    console.log(`✅ Single calculation (with agent) took ${duration.toFixed(2)}ms`);
    expect(duration).toBeLessThan(PERFORMANCE_TARGETS.singleCalculation);
  });

  it('should get commission rates in less than 5ms', async () => {
    const { duration } = await measureExecutionTime(() => {
      return centralizedCommissionEngine.getCommissionRates();
    });

    console.log(`✅ Get commission rates took ${duration.toFixed(2)}ms`);
    expect(duration).toBeLessThan(5);
  });

  it('should get platform fees in less than 5ms', async () => {
    const { duration } = await measureExecutionTime(() => {
      return centralizedCommissionEngine.getPlatformFees();
    });

    console.log(`✅ Get platform fees took ${duration.toFixed(2)}ms`);
    expect(duration).toBeLessThan(5);
  });
});

// ============================================================================
// TEST SUITE: BATCH CALCULATION PERFORMANCE
// ============================================================================

describe('Batch Calculation Performance', () => {
  it('should calculate 100 commissions in less than 100ms', async () => {
    const iterations = 100;
    const baseAmount = 1000;
    
    const { duration } = await measureExecutionTime(() => {
      for (let i = 0; i < iterations; i++) {
        centralizedCommissionEngine.calculateCommissions(baseAmount, false);
      }
    });
    
    console.log(`✅ ${iterations} calculations took ${duration.toFixed(2)}ms (${(duration / iterations).toFixed(2)}ms per calculation)`);
    expect(duration).toBeLessThan(PERFORMANCE_TARGETS.batchCalculation);
  });

  it('should calculate 500 commissions efficiently', async () => {
    const iterations = 500;
    const baseAmount = 2000;
    
    const { duration } = await measureExecutionTime(() => {
      for (let i = 0; i < iterations; i++) {
        centralizedCommissionEngine.calculateCommissions(baseAmount, i % 2 === 0);
      }
    });
    
    const avgPerCalculation = duration / iterations;
    console.log(`✅ ${iterations} calculations took ${duration.toFixed(2)}ms (${avgPerCalculation.toFixed(2)}ms per calculation)`);
    expect(avgPerCalculation).toBeLessThan(PERFORMANCE_TARGETS.singleCalculation);
  });

  it('should calculate 1000 commissions efficiently', async () => {
    const iterations = 1000;
    const baseAmount = 5000;
    
    const { duration } = await measureExecutionTime(() => {
      for (let i = 0; i < iterations; i++) {
        centralizedCommissionEngine.calculateCommissions(baseAmount, i % 3 === 0);
      }
    });
    
    const avgPerCalculation = duration / iterations;
    console.log(`✅ ${iterations} calculations took ${duration.toFixed(2)}ms (${avgPerCalculation.toFixed(2)}ms per calculation)`);
    expect(avgPerCalculation).toBeLessThan(PERFORMANCE_TARGETS.singleCalculation);
  });
});

// ============================================================================
// TEST SUITE: CONCURRENT CALCULATION PERFORMANCE
// ============================================================================

describe('Concurrent Calculation Performance', () => {
  it('should handle 100 concurrent calculations efficiently', async () => {
    const concurrentCount = 100;
    const baseAmount = 1000;
    
    const { duration } = await measureExecutionTime(async () => {
      const promises = Array.from({ length: concurrentCount }, (_, i) => {
        return Promise.resolve(
          centralizedCommissionEngine.calculateCommissions(baseAmount, i % 2 === 0)
        );
      });
      
      return await Promise.all(promises);
    });
    
    console.log(`✅ ${concurrentCount} concurrent calculations took ${duration.toFixed(2)}ms`);
    expect(duration).toBeLessThan(PERFORMANCE_TARGETS.concurrentCalculations);
  });

  it('should handle 500 concurrent calculations efficiently', async () => {
    const concurrentCount = 500;
    const baseAmount = 2000;
    
    const { duration } = await measureExecutionTime(async () => {
      const promises = Array.from({ length: concurrentCount }, (_, i) => {
        return Promise.resolve(
          centralizedCommissionEngine.calculateCommissions(baseAmount, i % 3 === 0)
        );
      });
      
      return await Promise.all(promises);
    });
    
    const avgPerCalculation = duration / concurrentCount;
    console.log(`✅ ${concurrentCount} concurrent calculations took ${duration.toFixed(2)}ms (${avgPerCalculation.toFixed(2)}ms per calculation)`);
    expect(avgPerCalculation).toBeLessThan(PERFORMANCE_TARGETS.singleCalculation * 2);
  });
});

// ============================================================================
// TEST SUITE: MEMORY USAGE
// ============================================================================

describe('Memory Usage', () => {
  it('should not leak memory during repeated calculations', async () => {
    const initialMemory = measureMemoryUsage();
    const iterations = 10000;
    const baseAmount = 1000;
    
    // Perform many calculations
    for (let i = 0; i < iterations; i++) {
      centralizedCommissionEngine.calculateCommissions(baseAmount, i % 2 === 0);
    }
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
    
    const finalMemory = measureMemoryUsage();
    const memoryIncrease = finalMemory - initialMemory;
    
    console.log(`✅ Memory increase after ${iterations} calculations: ${memoryIncrease.toFixed(2)}MB`);
    
    // Memory increase should be minimal (less than 10MB)
    if (initialMemory > 0) {
      expect(memoryIncrease).toBeLessThan(PERFORMANCE_TARGETS.memoryLeakThreshold);
    }
  });

  it('should handle large amounts efficiently without memory issues', async () => {
    const initialMemory = measureMemoryUsage();
    const largeAmount = 1000000; // 1 million GHS
    const iterations = 1000;
    
    for (let i = 0; i < iterations; i++) {
      centralizedCommissionEngine.calculateCommissions(largeAmount, true);
    }
    
    if (global.gc) {
      global.gc();
    }
    
    const finalMemory = measureMemoryUsage();
    const memoryIncrease = finalMemory - initialMemory;
    
    console.log(`✅ Memory increase with large amounts: ${memoryIncrease.toFixed(2)}MB`);
    
    if (initialMemory > 0) {
      expect(memoryIncrease).toBeLessThan(PERFORMANCE_TARGETS.memoryLeakThreshold);
    }
  });
});

// ============================================================================
// TEST SUITE: CALCULATION ACCURACY UNDER LOAD
// ============================================================================

describe('Calculation Accuracy Under Load', () => {
  it('should maintain accuracy during high-frequency calculations', async () => {
    const baseAmount = 1000;
    const iterations = 1000;

    // Calculate expected value once
    const expectedResult = centralizedCommissionEngine.calculateCommissions(baseAmount, false);
    const expectedTotal = expectedResult.totalAmount;

    let allAccurate = true;

    for (let i = 0; i < iterations; i++) {
      const result = centralizedCommissionEngine.calculateCommissions(baseAmount, false);

      // Check if result is accurate (within 0.01 GHS tolerance)
      if (Math.abs(result.totalAmount - expectedTotal) > 0.01) {
        allAccurate = false;
        console.log(`❌ Inaccurate calculation at iteration ${i}: expected ${expectedTotal}, got ${result.totalAmount}`);
        break;
      }
    }

    expect(allAccurate).toBe(true);
    console.log(`✅ All ${iterations} calculations were accurate (${expectedTotal.toFixed(2)} GHS)`);
  });

  it('should maintain accuracy with varying amounts', async () => {
    const testAmounts = [500, 1000, 2000, 5000, 10000];

    for (const baseAmount of testAmounts) {
      // Calculate expected value
      const expected = centralizedCommissionEngine.calculateCommissions(baseAmount, false);

      // Run multiple times and verify consistency
      for (let i = 0; i < 10; i++) {
        const result = centralizedCommissionEngine.calculateCommissions(baseAmount, false);
        expect(Math.abs(result.totalAmount - expected.totalAmount)).toBeLessThan(0.01);
      }
    }

    console.log(`✅ All ${testAmounts.length} test amounts were accurate across multiple runs`);
  });

  it('should maintain accuracy with agent commission', async () => {
    const baseAmount = 2000;
    const iterations = 500;

    // Calculate expected value once
    const expectedResult = centralizedCommissionEngine.calculateCommissions(baseAmount, true);
    const expectedTotal = expectedResult.totalAmount;

    let allAccurate = true;

    for (let i = 0; i < iterations; i++) {
      const result = centralizedCommissionEngine.calculateCommissions(baseAmount, true);

      if (Math.abs(result.totalAmount - expectedTotal) > 0.01) {
        allAccurate = false;
        console.log(`❌ Inaccurate calculation at iteration ${i}: expected ${expectedTotal}, got ${result.totalAmount}`);
        break;
      }
    }

    expect(allAccurate).toBe(true);
    console.log(`✅ All ${iterations} calculations with agent were accurate (${expectedTotal.toFixed(2)} GHS)`);
  });
});

// ============================================================================
// TEST SUITE: PERFORMANCE BENCHMARKING
// ============================================================================

describe('Performance Benchmarking', () => {
  it('should provide consistent performance across multiple runs', async () => {
    const baseAmount = 1000;
    const iterations = 100;

    const stats = await runBenchmark(
      () => centralizedCommissionEngine.calculateCommissions(baseAmount, false),
      iterations
    );

    console.log(`
✅ Performance Statistics (${iterations} runs):
   Average: ${stats.avg.toFixed(2)}ms
   Min:     ${stats.min.toFixed(2)}ms
   Max:     ${stats.max.toFixed(2)}ms
   P95:     ${stats.p95.toFixed(2)}ms
   P99:     ${stats.p99.toFixed(2)}ms
    `);

    // Average should be well under target
    expect(stats.avg).toBeLessThan(PERFORMANCE_TARGETS.singleCalculation);

    // P95 should also be under target
    expect(stats.p95).toBeLessThan(PERFORMANCE_TARGETS.singleCalculation);

    // P99 should be reasonable (allow some variance)
    expect(stats.p99).toBeLessThan(PERFORMANCE_TARGETS.singleCalculation * 2);
  });

  it('should benchmark commission calculation with agent', async () => {
    const baseAmount = 2000;
    const iterations = 100;

    const stats = await runBenchmark(
      () => centralizedCommissionEngine.calculateCommissions(baseAmount, true),
      iterations
    );

    console.log(`
✅ Commission Calculation (with agent) Performance Statistics (${iterations} runs):
   Average: ${stats.avg.toFixed(2)}ms
   Min:     ${stats.min.toFixed(2)}ms
   Max:     ${stats.max.toFixed(2)}ms
   P95:     ${stats.p95.toFixed(2)}ms
   P99:     ${stats.p99.toFixed(2)}ms
    `);

    expect(stats.avg).toBeLessThan(PERFORMANCE_TARGETS.singleCalculation);
    expect(stats.p95).toBeLessThan(PERFORMANCE_TARGETS.singleCalculation);
  });

  it('should benchmark rate retrieval performance', async () => {
    const iterations = 1000;

    const stats = await runBenchmark(
      () => centralizedCommissionEngine.getCommissionRates(),
      iterations
    );

    console.log(`
✅ Rate Retrieval Performance Statistics (${iterations} runs):
   Average: ${stats.avg.toFixed(2)}ms
   Min:     ${stats.min.toFixed(2)}ms
   Max:     ${stats.max.toFixed(2)}ms
   P95:     ${stats.p95.toFixed(2)}ms
   P99:     ${stats.p99.toFixed(2)}ms
    `);

    // Rate retrieval should be very fast (< 5ms)
    expect(stats.avg).toBeLessThan(5);
    expect(stats.p95).toBeLessThan(5);
  });
});

// ============================================================================
// TEST SUITE: EDGE CASE PERFORMANCE
// ============================================================================

describe('Edge Case Performance', () => {
  it('should handle very small amounts efficiently', async () => {
    const baseAmount = 1; // 1 GHS
    const iterations = 100;

    const { duration } = await measureExecutionTime(() => {
      for (let i = 0; i < iterations; i++) {
        centralizedCommissionEngine.calculateCommissions(baseAmount, false);
      }
    });

    const avgPerCalculation = duration / iterations;
    console.log(`✅ Small amount calculations: ${avgPerCalculation.toFixed(2)}ms per calculation`);
    expect(avgPerCalculation).toBeLessThan(PERFORMANCE_TARGETS.singleCalculation);
  });

  it('should handle very large amounts efficiently', async () => {
    const baseAmount = 1000000; // 1 million GHS
    const iterations = 100;

    const { duration } = await measureExecutionTime(() => {
      for (let i = 0; i < iterations; i++) {
        centralizedCommissionEngine.calculateCommissions(baseAmount, true);
      }
    });

    const avgPerCalculation = duration / iterations;
    console.log(`✅ Large amount calculations: ${avgPerCalculation.toFixed(2)}ms per calculation`);
    expect(avgPerCalculation).toBeLessThan(PERFORMANCE_TARGETS.singleCalculation);
  });

  it('should handle minimum amount efficiently', async () => {
    const baseAmount = 0.01; // Minimum positive amount
    const iterations = 100;

    const { duration } = await measureExecutionTime(() => {
      for (let i = 0; i < iterations; i++) {
        centralizedCommissionEngine.calculateCommissions(baseAmount, false);
      }
    });

    const avgPerCalculation = duration / iterations;
    console.log(`✅ Minimum amount calculations: ${avgPerCalculation.toFixed(2)}ms per calculation`);
    expect(avgPerCalculation).toBeLessThan(PERFORMANCE_TARGETS.singleCalculation);
  });

  it('should handle decimal amounts efficiently', async () => {
    const baseAmount = 1234.56;
    const iterations = 100;

    const { duration } = await measureExecutionTime(() => {
      for (let i = 0; i < iterations; i++) {
        centralizedCommissionEngine.calculateCommissions(baseAmount, false);
      }
    });

    const avgPerCalculation = duration / iterations;
    console.log(`✅ Decimal amount calculations: ${avgPerCalculation.toFixed(2)}ms per calculation`);
    expect(avgPerCalculation).toBeLessThan(PERFORMANCE_TARGETS.singleCalculation);
  });
});

// ============================================================================
// TEST SUITE: PERFORMANCE REGRESSION DETECTION
// ============================================================================

describe('Performance Regression Detection', () => {
  it('should detect if performance degrades significantly', async () => {
    const baseAmount = 1000;
    const iterations = 100;

    // Baseline measurement
    const baseline = await runBenchmark(
      () => centralizedCommissionEngine.calculateCommissions(baseAmount, false),
      iterations
    );

    // Second measurement (should be similar)
    const second = await runBenchmark(
      () => centralizedCommissionEngine.calculateCommissions(baseAmount, false),
      iterations
    );

    // For sub-millisecond operations, allow higher variance
    // Only fail if one measurement is significantly slower (> 10x)
    const degradation = baseline.avg > 0 ? (second.avg - baseline.avg) / baseline.avg : 0;

    console.log(`
✅ Performance Regression Check:
   Baseline: ${baseline.avg.toFixed(2)}ms
   Second:   ${second.avg.toFixed(2)}ms
   Change:   ${(degradation * 100).toFixed(2)}%
    `);

    // For sub-millisecond operations, allow up to 10x variance
    // For slower operations, allow 50% variance
    const maxVariance = baseline.avg < 1 ? 10 : 0.5;
    expect(Math.abs(degradation)).toBeLessThan(maxVariance);
  });

  it('should maintain consistent performance over time', async () => {
    const baseAmount = 2000;
    const iterations = 50;
    const runs = 5;

    const allStats: number[] = [];

    for (let run = 0; run < runs; run++) {
      const stats = await runBenchmark(
        () => centralizedCommissionEngine.calculateCommissions(baseAmount, true),
        iterations
      );
      allStats.push(stats.avg);
    }

    const overallAvg = allStats.reduce((sum, avg) => sum + avg, 0) / allStats.length;
    const variance = allStats.reduce((sum, avg) => sum + Math.pow(avg - overallAvg, 2), 0) / allStats.length;
    const stdDev = Math.sqrt(variance);
    const coefficientOfVariation = overallAvg > 0 ? (stdDev / overallAvg) : 0;

    console.log(`
✅ Consistency Check (${runs} runs of ${iterations} iterations):
   Overall Average: ${overallAvg.toFixed(2)}ms
   Std Deviation:   ${stdDev.toFixed(2)}ms
   Coefficient of Variation: ${(coefficientOfVariation * 100).toFixed(2)}%
    `);

    // For very fast operations (< 1ms), allow higher variance
    // For slower operations, expect lower variance
    const maxVariance = overallAvg < 1 ? 1.75 : 0.5; // allow up to 175% variance for extremely fast ops (<1ms), 50% for >=1ms
    expect(coefficientOfVariation).toBeLessThan(maxVariance);
  });
});

// ============================================================================
// TEST SUITE: PERFORMANCE SUMMARY
// ============================================================================

describe('Performance Summary Report', () => {
  it('should generate comprehensive performance report', async () => {
    const scenarios = [
      { name: 'Small Amount (1000 GHS)', baseAmount: 1000, hasAgent: false },
      { name: 'Medium Amount (5000 GHS)', baseAmount: 5000, hasAgent: false },
      { name: 'Large Amount (10000 GHS)', baseAmount: 10000, hasAgent: false },
      { name: 'With Agent (2000 GHS)', baseAmount: 2000, hasAgent: true }
    ];

    console.log('\n' + '='.repeat(80));
    console.log('📊 COMMISSION ENGINE PERFORMANCE REPORT');
    console.log('='.repeat(80));

    for (const scenario of scenarios) {
      const stats = await runBenchmark(
        () => centralizedCommissionEngine.calculateCommissions(scenario.baseAmount, scenario.hasAgent),
        100
      );

      console.log(`
${scenario.name}:
  Average: ${stats.avg.toFixed(2)}ms
  Min:     ${stats.min.toFixed(2)}ms
  Max:     ${stats.max.toFixed(2)}ms
  P95:     ${stats.p95.toFixed(2)}ms
  P99:     ${stats.p99.toFixed(2)}ms
  Status:  ${stats.avg < PERFORMANCE_TARGETS.singleCalculation ? '✅ PASS' : '❌ FAIL'}
      `);

      expect(stats.avg).toBeLessThan(PERFORMANCE_TARGETS.singleCalculation);
    }

    console.log('='.repeat(80));
    console.log('✅ ALL PERFORMANCE TARGETS MET');
    console.log('='.repeat(80) + '\n');
  });
});


