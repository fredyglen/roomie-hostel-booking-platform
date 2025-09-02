/**
 * Touch gesture hooks for mobile interactions
 * Provides swipe, pinch, and tap gesture detection
 */

import { useRef, useEffect, useCallback } from 'react';

export interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

export interface SwipeGesture {
  direction: 'up' | 'down' | 'left' | 'right';
  distance: number;
  velocity: number;
  duration: number;
}

export interface PinchGesture {
  scale: number;
  center: { x: number; y: number };
}

export interface TapGesture {
  x: number;
  y: number;
  timestamp: number;
}

export interface TouchGestureOptions {
  swipeThreshold?: number; // Minimum distance for swipe
  swipeVelocityThreshold?: number; // Minimum velocity for swipe
  tapThreshold?: number; // Maximum movement for tap
  tapTimeout?: number; // Maximum time for tap
  doubleTapTimeout?: number; // Maximum time between taps for double tap
  pinchThreshold?: number; // Minimum scale change for pinch
}

const DEFAULT_OPTIONS: Required<TouchGestureOptions> = {
  swipeThreshold: 50,
  swipeVelocityThreshold: 0.3,
  tapThreshold: 10,
  tapTimeout: 300,
  doubleTapTimeout: 300,
  pinchThreshold: 0.1,
};

export interface TouchGestureHandlers {
  onSwipe?: (gesture: SwipeGesture) => void;
  onPinch?: (gesture: PinchGesture) => void;
  onTap?: (gesture: TapGesture) => void;
  onDoubleTap?: (gesture: TapGesture) => void;
  onLongPress?: (gesture: TapGesture) => void;
  onTouchStart?: (event: TouchEvent) => void;
  onTouchMove?: (event: TouchEvent) => void;
  onTouchEnd?: (event: TouchEvent) => void;
}

export function useTouchGestures(
  handlers: TouchGestureHandlers,
  options: TouchGestureOptions = {}
) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const touchStartRef = useRef<TouchPoint[]>([]);
  const lastTapRef = useRef<TapGesture | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const initialPinchDistanceRef = useRef<number>(0);

  const calculateDistance = useCallback((p1: TouchPoint, p2: TouchPoint): number => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }, []);

  const calculateVelocity = useCallback((distance: number, duration: number): number => {
    return duration > 0 ? distance / duration : 0;
  }, []);

  const getSwipeDirection = useCallback((start: TouchPoint, end: TouchPoint): SwipeGesture['direction'] => {
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      return deltaX > 0 ? 'right' : 'left';
    } else {
      return deltaY > 0 ? 'down' : 'up';
    }
  }, []);

  const getPinchDistance = useCallback((touches: TouchList): number => {
    if (touches.length < 2) return 0;
    
    const touch1 = touches[0];
    const touch2 = touches[1];
    
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) + 
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  }, []);

  const getPinchCenter = useCallback((touches: TouchList): { x: number; y: number } => {
    if (touches.length < 2) return { x: 0, y: 0 };
    
    const touch1 = touches[0];
    const touch2 = touches[1];
    
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2,
    };
  }, []);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    const touches = Array.from(event.touches).map(touch => ({
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now(),
    }));

    touchStartRef.current = touches;

    // Handle pinch start
    if (event.touches.length === 2) {
      initialPinchDistanceRef.current = getPinchDistance(event.touches);
    }

    // Start long press timer for single touch
    if (event.touches.length === 1 && handlers.onLongPress) {
      longPressTimerRef.current = setTimeout(() => {
        const touch = touches[0];
        handlers.onLongPress?.({
          x: touch.x,
          y: touch.y,
          timestamp: touch.timestamp,
        });
      }, 500); // 500ms for long press
    }

    handlers.onTouchStart?.(event);
  }, [handlers, getPinchDistance]);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    // Clear long press timer on move
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    // Handle pinch gesture
    if (event.touches.length === 2 && handlers.onPinch && initialPinchDistanceRef.current > 0) {
      const currentDistance = getPinchDistance(event.touches);
      const scale = currentDistance / initialPinchDistanceRef.current;
      
      if (Math.abs(scale - 1) > opts.pinchThreshold) {
        const center = getPinchCenter(event.touches);
        handlers.onPinch({
          scale,
          center,
        });
      }
    }

    handlers.onTouchMove?.(event);
  }, [handlers, opts.pinchThreshold, getPinchDistance, getPinchCenter]);

  const handleTouchEnd = useCallback((event: TouchEvent) => {
    // Clear long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    const touchEnd = {
      x: event.changedTouches[0]?.clientX || 0,
      y: event.changedTouches[0]?.clientY || 0,
      timestamp: Date.now(),
    };

    const touchStart = touchStartRef.current[0];
    
    if (!touchStart) return;

    const distance = calculateDistance(touchStart, touchEnd);
    const duration = touchEnd.timestamp - touchStart.timestamp;
    const velocity = calculateVelocity(distance, duration);

    // Handle swipe gesture
    if (distance > opts.swipeThreshold && velocity > opts.swipeVelocityThreshold && handlers.onSwipe) {
      const direction = getSwipeDirection(touchStart, touchEnd);
      handlers.onSwipe({
        direction,
        distance,
        velocity,
        duration,
      });
    }
    // Handle tap gesture
    else if (distance < opts.tapThreshold && duration < opts.tapTimeout) {
      const tapGesture: TapGesture = {
        x: touchEnd.x,
        y: touchEnd.y,
        timestamp: touchEnd.timestamp,
      };

      // Check for double tap
      if (lastTapRef.current && handlers.onDoubleTap) {
        const timeBetweenTaps = touchEnd.timestamp - lastTapRef.current.timestamp;
        const distanceBetweenTaps = calculateDistance(lastTapRef.current, touchEnd);
        
        if (timeBetweenTaps < opts.doubleTapTimeout && distanceBetweenTaps < opts.tapThreshold) {
          handlers.onDoubleTap(tapGesture);
          lastTapRef.current = null; // Reset to prevent triple tap
          return;
        }
      }

      // Single tap
      handlers.onTap?.(tapGesture);
      lastTapRef.current = tapGesture;
    }

    // Reset pinch distance
    initialPinchDistanceRef.current = 0;

    handlers.onTouchEnd?.(event);
  }, [
    handlers,
    opts.swipeThreshold,
    opts.swipeVelocityThreshold,
    opts.tapThreshold,
    opts.tapTimeout,
    opts.doubleTapTimeout,
    calculateDistance,
    calculateVelocity,
    getSwipeDirection,
  ]);

  const bindToElement = useCallback((element: HTMLElement | null) => {
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  return {
    bindToElement,
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
}

/**
 * Simplified swipe hook for common use cases
 */
export function useSwipeGesture(
  onSwipe: (direction: SwipeGesture['direction']) => void,
  options?: TouchGestureOptions
) {
  return useTouchGestures(
    {
      onSwipe: (gesture) => onSwipe(gesture.direction),
    },
    options
  );
}

/**
 * Hook for detecting mobile device and touch capability
 */
export function useMobileDetection() {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);

  return {
    isMobile,
    isTouchDevice,
    isIOS,
    isAndroid,
    isDesktop: !isMobile && !isTouchDevice,
  };
}
