/**
 * Bundle optimization utilities for ROOMi platform
 * Helps identify and optimize large dependencies and imports
 */

import { logger } from '@/utils/enhanced-logger';

// Dynamic import wrapper with error handling
export const dynamicImport = async <T>(
  importFn: () => Promise<T>,
  componentName: string
): Promise<T> => {
  try {
    const startTime = performance.now();
    const module = await importFn();
    const loadTime = performance.now() - startTime;
    
    logger.debug(`Dynamic import loaded: ${componentName}`, { loadTime });
    
    return module;
  } catch (error) {
    logger.error(`Failed to load dynamic import: ${componentName}`, { error });
    throw error;
  }
};

// Preload critical resources
export const preloadCriticalResources = () => {
  // Preload critical CSS
  const criticalCSS = [
    '/src/index.css',
  ];

  criticalCSS.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    document.head.appendChild(link);
  });

  // Preload critical fonts
  const criticalFonts = [
    'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=swap',
  ];

  criticalFonts.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    document.head.appendChild(link);
  });
};

// Lazy load non-critical dependencies
export const lazyLoadDependencies = {
  // Date utilities (using date-fns which is already installed)
  loadDateUtils: async () => {
    try {
      return await dynamicImport(() => import('date-fns/format'), 'date-fns-format');
    } catch {
      return null; // Use native date handling
    }
  },

  // Lodash utilities (for performance optimization)
  loadLodashUtils: async () => {
    try {
      return await dynamicImport(() => import('lodash/debounce'), 'lodash-debounce');
    } catch {
      return null; // Use native debounce
    }
  },

  // Icon utilities (for dynamic icon loading)
  loadIconUtils: async () => {
    try {
      return await dynamicImport(() => import('@iconify/react'), 'iconify-react');
    } catch {
      return null; // Use static icons
    }
  },
};

// Performance monitoring
export const performanceMonitor = {
  // Measure component render time
  measureRenderTime: (componentName: string, renderFn: () => void) => {
    const startTime = performance.now();
    renderFn();
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    if (renderTime > 16) { // More than one frame (60fps)
      logger.warn(`Slow render detected: ${componentName}`, { renderTime });
    }
    
    return renderTime;
  },

  // Measure bundle size impact
  measureBundleImpact: (moduleName: string, size: number) => {
    logger.info(`Bundle impact: ${moduleName}`, { size: `${size}KB` });
    
    if (size > 100) { // Warn for modules larger than 100KB
      logger.warn(`Large module detected: ${moduleName}`, { size: `${size}KB` });
    }
  },

  // Monitor memory usage
  monitorMemoryUsage: () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const memoryInfo = {
        usedJSHeapSize: Math.round(memory.usedJSHeapSize / 1024 / 1024),
        totalJSHeapSize: Math.round(memory.totalJSHeapSize / 1024 / 1024),
        jsHeapSizeLimit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024),
      };
      
      logger.debug('Memory usage', memoryInfo);
      
      // Warn if memory usage is high
      if (memoryInfo.usedJSHeapSize > 50) {
        logger.warn('High memory usage detected', memoryInfo);
      }
      
      return memoryInfo;
    }
    return null;
  },
};

// Tree shaking helpers
export const optimizedImports = {
  // Import only specific lodash functions
  debounce: () => import('lodash/debounce'),
  throttle: () => import('lodash/throttle'),
  
  // Import specific date-fns functions
  formatDate: () => import('date-fns/format'),
  parseDate: () => import('date-fns/parse'),
  
  // Import specific icons
  loadIcon: (iconName: string) => dynamicImport(
    () => import(`@iconify/react`).then(mod => ({ [iconName]: mod.Icon })),
    `icon-${iconName}`
  ),
};

// Resource hints for better loading
export const addResourceHints = () => {
  // DNS prefetch for external domains
  const externalDomains = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'images.unsplash.com',
  ];

  externalDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = `//${domain}`;
    document.head.appendChild(link);
  });

  // Preconnect to critical external resources
  const criticalDomains = [
    'fonts.googleapis.com',
  ];

  criticalDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = `https://${domain}`;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

// Initialize performance optimizations
export const initializePerformanceOptimizations = () => {
  // Add resource hints
  addResourceHints();
  
  // Preload critical resources
  preloadCriticalResources();
  
  // Monitor performance
  if (typeof window !== 'undefined') {
    // Monitor memory usage every 30 seconds in development
    if (import.meta.env.DEV) {
      setInterval(() => {
        performanceMonitor.monitorMemoryUsage();
      }, 30000);
    }
    
    // Log performance metrics on page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        logger.info('Page load performance', {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          totalTime: navigation.loadEventEnd - navigation.fetchStart,
        });
      }, 0);
    });
  }
};

export default {
  dynamicImport,
  lazyLoadDependencies,
  performanceMonitor,
  optimizedImports,
  initializePerformanceOptimizations,
};
