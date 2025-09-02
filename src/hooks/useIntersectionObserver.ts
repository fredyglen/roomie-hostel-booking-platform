/**
 * useIntersectionObserver Hook
 * Apple-grade performance monitoring for element visibility
 * 
 * @fileoverview Custom hook for intersection observer with performance optimization
 * @author ROOMi Development Team - Apple Standards Implementation
 * @version 2.0.0
 * @since 2025-06-21
 */

import { useEffect, useRef, useState, useCallback } from 'react';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

interface UseIntersectionObserverOptions {
  readonly threshold?: number | number[];
  readonly root?: Element | null;
  readonly rootMargin?: string;
  readonly freezeOnceVisible?: boolean;
  readonly initialIsIntersecting?: boolean;
}

interface IntersectionObserverResult {
  readonly isIntersecting: boolean;
  readonly entry: IntersectionObserverEntry | null;
  readonly ref: (node: Element | null) => void;
}

// ============================================================================
// APPLE-GRADE INTERSECTION OBSERVER HOOK
// ============================================================================

export const useIntersectionObserver = (
  options: UseIntersectionObserverOptions = {}
): IntersectionObserverResult => {
  const {
    threshold = 0,
    root = null,
    rootMargin = '0%',
    freezeOnceVisible = false,
    initialIsIntersecting = false
  } = options;

  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [isIntersecting, setIsIntersecting] = useState<boolean>(initialIsIntersecting);
  const [node, setNode] = useState<Element | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  // Memoized callback to set the node reference
  const ref = useCallback((node: Element | null) => {
    setNode(node);
  }, []);

  // Effect to manage the intersection observer
  useEffect(() => {
    // Clean up previous observer
    if (observer.current) {
      observer.current.disconnect();
      observer.current = null;
    }

    // Early return if no node or if frozen and already visible
    if (!node) return;
    if (freezeOnceVisible && isIntersecting) return;

    // Create new intersection observer
    const observerInstance = new IntersectionObserver(
      ([entry]: IntersectionObserverEntry[]) => {
        const isElementIntersecting = entry.isIntersecting;
        
        setEntry(entry);
        setIsIntersecting(isElementIntersecting);

        // Disconnect if frozen once visible and now intersecting
        if (freezeOnceVisible && isElementIntersecting && observer.current) {
          observer.current.disconnect();
          observer.current = null;
        }
      },
      {
        threshold,
        root,
        rootMargin
      }
    );

    observer.current = observerInstance;
    observerInstance.observe(node);

    // Cleanup function
    return () => {
      if (observer.current) {
        observer.current.disconnect();
        observer.current = null;
      }
    };
  }, [node, threshold, root, rootMargin, freezeOnceVisible, isIntersecting]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return {
    isIntersecting,
    entry,
    ref
  };
};

// ============================================================================
// SPECIALIZED HOOKS FOR COMMON USE CASES
// ============================================================================

/**
 * Hook for lazy loading with Apple-grade performance
 */
export const useLazyLoading = (options: Omit<UseIntersectionObserverOptions, 'freezeOnceVisible'> = {}) => {
  return useIntersectionObserver({
    ...options,
    freezeOnceVisible: true,
    threshold: 0.1
  });
};

/**
 * Hook for viewport tracking with performance metrics
 */
export const useViewportTracking = (options: UseIntersectionObserverOptions = {}) => {
  const result = useIntersectionObserver({
    threshold: [0, 0.25, 0.5, 0.75, 1],
    ...options
  });

  const visibilityPercentage = result.entry?.intersectionRatio || 0;

  return {
    ...result,
    visibilityPercentage: Math.round(visibilityPercentage * 100)
  };
};

/**
 * Hook for infinite scroll implementation
 */
export const useInfiniteScroll = (
  onIntersect: () => void,
  options: UseIntersectionObserverOptions = {}
) => {
  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 0.1,
    ...options
  });

  useEffect(() => {
    if (isIntersecting) {
      onIntersect();
    }
  }, [isIntersecting, onIntersect]);

  return { ref, isIntersecting };
};

// ============================================================================
// PERFORMANCE MONITORING UTILITIES
// ============================================================================

/**
 * Hook for measuring intersection performance
 */
export const useIntersectionPerformance = (
  elementName: string,
  options: UseIntersectionObserverOptions = {}
) => {
  const [performanceMetrics, setPerformanceMetrics] = useState({
    observerCreationTime: 0,
    firstIntersectionTime: 0,
    totalIntersections: 0
  });

  const startTime = useRef<number>(Date.now());
  const firstIntersectionRecorded = useRef<boolean>(false);

  const result = useIntersectionObserver(options);

  useEffect(() => {
    if (result.isIntersecting && !firstIntersectionRecorded.current) {
      const firstIntersectionTime = Date.now() - startTime.current;
      firstIntersectionRecorded.current = true;

      setPerformanceMetrics(prev => ({
        ...prev,
        firstIntersectionTime,
        totalIntersections: prev.totalIntersections + 1
      }));

      // Log performance metrics in development
      if (import.meta.env.DEV) {
        console.log(`🍎 Intersection Performance [${elementName}]:`, {
          firstIntersectionTime: `${firstIntersectionTime}ms`,
          threshold: options.threshold,
          rootMargin: options.rootMargin
        });
      }
    } else if (result.isIntersecting) {
      setPerformanceMetrics(prev => ({
        ...prev,
        totalIntersections: prev.totalIntersections + 1
      }));
    }
  }, [result.isIntersecting, elementName, options.threshold, options.rootMargin]);

  return {
    ...result,
    performanceMetrics
  };
};

export default useIntersectionObserver;
