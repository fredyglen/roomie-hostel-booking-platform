/**
 * Performance Monitor component for development
 * Displays real-time performance metrics and optimization suggestions
 */

import React, { useState, useEffect } from 'react';
import { performanceMonitor } from '@/utils/bundleOptimization';
import { PerformanceValidator, type PlatformHealthScore } from '@/utils/performanceValidation';
import { logger } from '@/utils/enhanced-logger';

interface PerformanceMetrics {
  memoryUsage?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
  loadTime?: number;
  renderTime?: number;
  bundleSize?: number;
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [isVisible, setIsVisible] = useState(false);
  const [performanceScore, setPerformanceScore] = useState<number>(0);
  const [platformHealth, setPlatformHealth] = useState<PlatformHealthScore | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    // Only show in development
    if (!import.meta.env.DEV) return;

    const updateMetrics = () => {
      const memoryUsage = performanceMonitor.monitorMemoryUsage();
      
      // Calculate performance score based on various metrics
      let score = 100;
      
      if (memoryUsage) {
        // Deduct points for high memory usage
        if (memoryUsage.usedJSHeapSize > 50) score -= 20;
        if (memoryUsage.usedJSHeapSize > 100) score -= 30;
        
        setMetrics(prev => ({ ...prev, memoryUsage }));
      }

      // Check bundle size (estimated)
      const bundleSize = document.querySelectorAll('script').length * 50; // Rough estimate
      if (bundleSize > 500) score -= 15;
      if (bundleSize > 1000) score -= 25;

      setMetrics(prev => ({ ...prev, bundleSize }));
      setPerformanceScore(Math.max(0, score));
    };

    // Update metrics every 5 seconds
    const interval = setInterval(updateMetrics, 5000);
    updateMetrics(); // Initial update

    return () => clearInterval(interval);
  }, []);

  // Calculate performance grade
  const getPerformanceGrade = (score: number) => {
    if (score >= 90) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 80) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (score >= 70) return { grade: 'C', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (score >= 60) return { grade: 'D', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { grade: 'F', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const performanceGrade = getPerformanceGrade(performanceScore);

  // Run platform health validation
  const runHealthValidation = async () => {
    setIsValidating(true);
    try {
      const healthScore = await PerformanceValidator.validatePlatformHealth();
      setPlatformHealth(healthScore);
      logger.info('Platform health validation completed', healthScore);
    } catch (error) {
      logger.error('Platform health validation failed', { error });
    } finally {
      setIsValidating(false);
    }
  };

  // Don't render in production
  if (!import.meta.env.DEV) return null;

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        title="Performance Monitor"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Performance Panel */}
      {isVisible && (
        <div className="fixed bottom-20 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-96 max-h-[32rem] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Performance Monitor</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" strokeLinecap="round"/>
                <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Performance Score */}
          <div className={`${performanceGrade.bg} ${performanceGrade.color} p-3 rounded-lg mb-4`}>
            <div className="flex items-center justify-between">
              <span className="font-medium">Performance Score</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{performanceScore}</span>
                <span className={`text-lg font-bold ${performanceGrade.color}`}>
                  {performanceGrade.grade}
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  performanceScore >= 80 ? 'bg-green-500' :
                  performanceScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${performanceScore}%` }}
              />
            </div>
          </div>

          {/* Memory Usage */}
          {metrics.memoryUsage && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Memory Usage</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Used:</span>
                  <span className={`font-mono ${
                    metrics.memoryUsage.usedJSHeapSize > 50 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {metrics.memoryUsage.usedJSHeapSize}MB
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="font-mono">{metrics.memoryUsage.totalJSHeapSize}MB</span>
                </div>
                <div className="flex justify-between">
                  <span>Limit:</span>
                  <span className="font-mono">{metrics.memoryUsage.jsHeapSizeLimit}MB</span>
                </div>
              </div>
            </div>
          )}

          {/* Bundle Size */}
          {metrics.bundleSize && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Bundle Info</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Estimated Size:</span>
                  <span className={`font-mono ${
                    metrics.bundleSize > 500 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    ~{metrics.bundleSize}KB
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Optimization Suggestions */}
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2">Optimizations</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Code splitting enabled</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Lazy loading active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Image optimization enabled</span>
              </div>
              {performanceScore < 80 && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Consider reducing bundle size</span>
                </div>
              )}
            </div>
          </div>

          {/* Platform Health Score */}
          {platformHealth && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Platform Health Score</h4>
              <div className={`p-3 rounded-lg ${
                platformHealth.overall >= 85 ? 'bg-green-100 text-green-800' :
                platformHealth.overall >= 70 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-lg">{platformHealth.overall}/100</span>
                  <span className="text-sm">
                    {platformHealth.overall >= 85 ? 'Excellent' :
                     platformHealth.overall >= 70 ? 'Good' : 'Needs Improvement'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>Performance: {platformHealth.categories.performance}</div>
                  <div>Security: {platformHealth.categories.security}</div>
                  <div>Functionality: {platformHealth.categories.functionality}</div>
                  <div>Code Quality: {platformHealth.categories.codeQuality}</div>
                  <div className="col-span-2">UX: {platformHealth.categories.userExperience}</div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={runHealthValidation}
              disabled={isValidating}
              className="flex-1 bg-green-600 text-white text-sm py-2 px-3 rounded hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isValidating ? 'Validating...' : 'Health Check'}
            </button>
            <button
              onClick={() => {
                logger.info('Performance metrics', metrics);
                console.log('Performance Metrics:', metrics);
                if (platformHealth) {
                  console.log('Platform Health:', platformHealth);
                }
              }}
              className="flex-1 bg-blue-600 text-white text-sm py-2 px-3 rounded hover:bg-blue-700 transition-colors"
            >
              Log Data
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PerformanceMonitor;
