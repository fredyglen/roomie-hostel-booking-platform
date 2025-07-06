/**
 * usePerformanceMonitor Hook
 * Apple-grade performance monitoring and metrics collection
 * 
 * @fileoverview Custom hook for comprehensive performance monitoring
 * @author ROOMi Development Team - Apple Standards Implementation
 * @version 2.0.0
 * @since 2025-06-21
 */

import { useCallback, useRef, useState, useEffect } from 'react';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

interface PerformanceMetric {
  readonly name: string;
  readonly value: number;
  readonly timestamp: number;
  readonly type: 'timing' | 'counter' | 'gauge';
  readonly unit?: string;
}

interface PerformanceMeasurement {
  readonly name: string;
  readonly startTime: number;
  readonly endTime?: number;
  readonly duration?: number;
}

interface PerformanceMonitorResult {
  readonly startMeasure: (name: string) => void;
  readonly endMeasure: (name: string) => number | null;
  readonly recordMetric: (name: string, value: number, type?: 'timing' | 'counter' | 'gauge') => void;
  readonly getMetrics: () => ReadonlyArray<PerformanceMetric>;
  readonly clearMetrics: () => void;
  readonly getAverageTime: (name: string) => number | null;
  readonly getTotalCount: (name: string) => number;
}

// ============================================================================
// APPLE-GRADE PERFORMANCE MONITOR HOOK
// ============================================================================

export const usePerformanceMonitor = (componentName: string): PerformanceMonitorResult => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const measurements = useRef<Map<string, PerformanceMeasurement>>(new Map());
  const metricHistory = useRef<Map<string, number[]>>(new Map());

  // Start a performance measurement
  const startMeasure = useCallback((name: string) => {
    const fullName = `${componentName}.${name}`;
    const startTime = performance.now();
    
    measurements.current.set(fullName, {
      name: fullName,
      startTime
    });

    // Log in development mode
    if (import.meta.env.DEV) {
      console.log(`🍎 Performance Start [${fullName}]:`, startTime);
    }
  }, [componentName]);

  // End a performance measurement and return duration
  const endMeasure = useCallback((name: string): number | null => {
    const fullName = `${componentName}.${name}`;
    const measurement = measurements.current.get(fullName);
    
    if (!measurement) {
      console.warn(`🍎 Performance Warning: No measurement found for ${fullName}`);
      return null;
    }

    const endTime = performance.now();
    const duration = endTime - measurement.startTime;

    // Update measurement
    const completedMeasurement: PerformanceMeasurement = {
      ...measurement,
      endTime,
      duration
    };

    measurements.current.set(fullName, completedMeasurement);

    // Record as metric
    recordMetric(name, duration, 'timing');

    // Store in history for averaging
    const history = metricHistory.current.get(fullName) || [];
    history.push(duration);
    metricHistory.current.set(fullName, history);

    // Log in development mode
    if (import.meta.env.DEV) {
      console.log(`🍎 Performance End [${fullName}]:`, {
        duration: `${duration.toFixed(2)}ms`,
        startTime: measurement.startTime,
        endTime
      });

      // Warn if performance is below Apple standards
      if (duration > 100) {
        console.warn(`🍎 Performance Warning [${fullName}]: Duration ${duration.toFixed(2)}ms exceeds 100ms threshold`);
      }
    }

    return duration;
  }, [componentName]);

  // Record a custom metric
  const recordMetric = useCallback((
    name: string, 
    value: number, 
    type: 'timing' | 'counter' | 'gauge' = 'gauge'
  ) => {
    const fullName = `${componentName}.${name}`;
    const metric: PerformanceMetric = {
      name: fullName,
      value,
      timestamp: Date.now(),
      type,
      unit: type === 'timing' ? 'ms' : undefined
    };

    setMetrics(prev => [...prev, metric]);

    // Log significant metrics in development
    if (import.meta.env.DEV && (type === 'timing' || value > 1)) {
      console.log(`🍎 Performance Metric [${fullName}]:`, {
        value: type === 'timing' ? `${value.toFixed(2)}ms` : value,
        type
      });
    }
  }, [componentName]);

  // Get all metrics
  const getMetrics = useCallback((): ReadonlyArray<PerformanceMetric> => {
    return [...metrics];
  }, [metrics]);

  // Clear all metrics
  const clearMetrics = useCallback(() => {
    setMetrics([]);
    measurements.current.clear();
    metricHistory.current.clear();
  }, []);

  // Get average time for a specific measurement
  const getAverageTime = useCallback((name: string): number | null => {
    const fullName = `${componentName}.${name}`;
    const history = metricHistory.current.get(fullName);
    
    if (!history || history.length === 0) {
      return null;
    }

    const sum = history.reduce((acc, val) => acc + val, 0);
    return sum / history.length;
  }, [componentName]);

  // Get total count for a specific metric
  const getTotalCount = useCallback((name: string): number => {
    const fullName = `${componentName}.${name}`;
    return metrics.filter(metric => metric.name === fullName && metric.type === 'counter').length;
  }, [metrics, componentName]);

  // Auto-cleanup on unmount
  useEffect(() => {
    return () => {
      measurements.current.clear();
      metricHistory.current.clear();
    };
  }, []);

  return {
    startMeasure,
    endMeasure,
    recordMetric,
    getMetrics,
    clearMetrics,
    getAverageTime,
    getTotalCount
  };
};

// ============================================================================
// SPECIALIZED PERFORMANCE HOOKS
// ============================================================================

/**
 * Hook for monitoring render performance
 */
export const useRenderPerformance = (componentName: string) => {
  const monitor = usePerformanceMonitor(componentName);
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    monitor.recordMetric('render.count', renderCount.current, 'counter');
    
    const renderStart = performance.now();
    
    // Measure render time using requestAnimationFrame
    requestAnimationFrame(() => {
      const renderEnd = performance.now();
      const renderTime = renderEnd - renderStart;
      monitor.recordMetric('render.time', renderTime, 'timing');
    });
  });

  return {
    ...monitor,
    renderCount: renderCount.current
  };
};

/**
 * Hook for monitoring API call performance
 */
export const useApiPerformance = (apiName: string) => {
  const monitor = usePerformanceMonitor(`api.${apiName}`);

  const measureApiCall = useCallback(async <T>(
    apiCall: () => Promise<T>,
    operationName: string = 'request'
  ): Promise<T> => {
    monitor.startMeasure(operationName);
    
    try {
      const result = await apiCall();
      monitor.endMeasure(operationName);
      monitor.recordMetric(`${operationName}.success`, 1, 'counter');
      return result;
    } catch (error) {
      monitor.endMeasure(operationName);
      monitor.recordMetric(`${operationName}.error`, 1, 'counter');
      throw error;
    }
  }, [monitor]);

  return {
    ...monitor,
    measureApiCall
  };
};

/**
 * Hook for monitoring memory usage
 */
export const useMemoryMonitor = (componentName: string) => {
  const monitor = usePerformanceMonitor(componentName);

  const recordMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      monitor.recordMetric('memory.used', memory.usedJSHeapSize / 1024 / 1024, 'gauge');
      monitor.recordMetric('memory.total', memory.totalJSHeapSize / 1024 / 1024, 'gauge');
      monitor.recordMetric('memory.limit', memory.jsHeapSizeLimit / 1024 / 1024, 'gauge');
    }
  }, [monitor]);

  // Record memory usage periodically
  useEffect(() => {
    recordMemoryUsage();
    const interval = setInterval(recordMemoryUsage, 5000); // Every 5 seconds
    
    return () => clearInterval(interval);
  }, [recordMemoryUsage]);

  return {
    ...monitor,
    recordMemoryUsage
  };
};

// ============================================================================
// PERFORMANCE UTILITIES
// ============================================================================

/**
 * Utility to check if performance meets Apple standards
 */
export const checkAppleStandards = (metrics: ReadonlyArray<PerformanceMetric>) => {
  const standards = {
    'render.time': 16.67, // 60fps = 16.67ms per frame
    'api.request': 100,   // API calls should be under 100ms
    'component.mount': 50, // Component mounting under 50ms
    'page.load': 1500     // Page load under 1.5s
  };

  const violations: Array<{ metric: string; value: number; threshold: number }> = [];

  metrics.forEach(metric => {
    if (metric.type === 'timing') {
      const threshold = standards[metric.name as keyof typeof standards];
      if (threshold && metric.value > threshold) {
        violations.push({
          metric: metric.name,
          value: metric.value,
          threshold
        });
      }
    }
  });

  return {
    meetsStandards: violations.length === 0,
    violations
  };
};

export default usePerformanceMonitor;
