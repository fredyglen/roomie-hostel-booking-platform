// Anonymous User Time Limit Hook
// Enforces 30-second time limit for anonymous users on the platform

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/EnhancedAuthContext';

export interface TimeLimitStatus {
  timeRemaining: number;
  isExpired: boolean;
  isActive: boolean;
  startTime: number;
  expiryTime: number;
}

// Randomize time limit between 15-30 seconds
const getRandomTimeLimit = () => {
  return Math.floor(Math.random() * (30 - 15 + 1)) + 15;
};
const STORAGE_KEY = 'roomi_anonymous_session';

// Generate a unique session ID that can't be easily cleared
const generateSessionId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  const userAgent = navigator.userAgent;
  const screen = `${screen.width}x${screen.height}`;
  return btoa(`${timestamp}-${random}-${userAgent}-${screen}`).substr(0, 32);
};

// Store session data in multiple locations to prevent easy clearing
const storeSessionData = (data: any) => {
  const serialized = JSON.stringify(data);
  
  // Store in localStorage
  localStorage.setItem(STORAGE_KEY, serialized);
  
  // Store in sessionStorage as backup
  sessionStorage.setItem(STORAGE_KEY, serialized);
  
  // Store in a hidden element (harder to find and clear)
  const hiddenElement = document.getElementById('roomi-session-data') || document.createElement('div');
  hiddenElement.id = 'roomi-session-data';
  hiddenElement.style.display = 'none';
  hiddenElement.setAttribute('data-session', serialized);
  if (!document.getElementById('roomi-session-data')) {
    document.body.appendChild(hiddenElement);
  }
};

// Retrieve session data from multiple sources
const getSessionData = () => {
  // Try localStorage first
  let data = localStorage.getItem(STORAGE_KEY);
  
  // Fallback to sessionStorage
  if (!data) {
    data = sessionStorage.getItem(STORAGE_KEY);
  }
  
  // Fallback to hidden element
  if (!data) {
    const hiddenElement = document.getElementById('roomi-session-data');
    if (hiddenElement) {
      data = hiddenElement.getAttribute('data-session');
    }
  }
  
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
  
  return null;
};

export const useAnonymousTimeLimit = () => {
  const { user } = useAuth();
  const [timeLimitStatus, setTimeLimitStatus] = useState<TimeLimitStatus>(() => {
    // If user is logged in, no time limit applies
    if (user) {
      return {
        timeRemaining: Infinity,
        isExpired: false,
        isActive: false,
        startTime: 0,
        expiryTime: 0
      };
    }

    // Check for existing session
    const existingSession = getSessionData();
    const now = Date.now();

    if (existingSession && existingSession.expiryTime > now) {
      // Valid existing session
      const timeRemaining = Math.max(0, Math.floor((existingSession.expiryTime - now) / 1000));
      return {
        timeRemaining,
        isExpired: timeRemaining === 0,
        isActive: true,
        startTime: existingSession.startTime,
        expiryTime: existingSession.expiryTime
      };
    } else {
      // Create new session with randomized time limit
      const timeLimitSeconds = getRandomTimeLimit();
      const startTime = now;
      const expiryTime = startTime + (timeLimitSeconds * 1000);
      const sessionData = {
        sessionId: generateSessionId(),
        startTime,
        expiryTime,
        timeLimitSeconds,
        userAgent: navigator.userAgent,
        screenResolution: `${screen.width}x${screen.height}`
      };

      storeSessionData(sessionData);

      return {
        timeRemaining: timeLimitSeconds,
        isExpired: false,
        isActive: true,
        startTime,
        expiryTime
      };
    }
  });

  // Update timer every second for anonymous users
  useEffect(() => {
    if (user || !timeLimitStatus.isActive) {
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const timeRemaining = Math.max(0, Math.floor((timeLimitStatus.expiryTime - now) / 1000));
      
      setTimeLimitStatus(prev => ({
        ...prev,
        timeRemaining,
        isExpired: timeRemaining === 0
      }));

      // Stop the timer when expired
      if (timeRemaining === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [user, timeLimitStatus.isActive, timeLimitStatus.expiryTime]);

  // Reset timer when user logs in
  useEffect(() => {
    if (user) {
      setTimeLimitStatus({
        timeRemaining: Infinity,
        isExpired: false,
        isActive: false,
        startTime: 0,
        expiryTime: 0
      });
      
      // Clear stored session data
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
      const hiddenElement = document.getElementById('roomi-session-data');
      if (hiddenElement) {
        hiddenElement.remove();
      }
    }
  }, [user]);

  // Check if user is trying to manipulate the session
  const detectManipulation = useCallback(() => {
    if (user) return false;

    const storedData = getSessionData();
    if (!storedData) return true; // Session data missing

    // Check if user agent or screen resolution changed (indicates potential manipulation)
    const currentUserAgent = navigator.userAgent;
    const currentScreen = `${screen.width}x${screen.height}`;
    
    if (storedData.userAgent !== currentUserAgent || storedData.screenResolution !== currentScreen) {
      return true;
    }

    return false;
  }, [user]);

  // Force expiry (for testing or admin purposes)
  const forceExpiry = useCallback(() => {
    if (!user) {
      setTimeLimitStatus(prev => ({
        ...prev,
        timeRemaining: 0,
        isExpired: true
      }));
    }
  }, [user]);

  // Get formatted time remaining
  const getFormattedTimeRemaining = useCallback(() => {
    if (user || !timeLimitStatus.isActive) {
      return '';
    }

    const minutes = Math.floor(timeLimitStatus.timeRemaining / 60);
    const seconds = timeLimitStatus.timeRemaining % 60;
    
    if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${seconds}s`;
    }
  }, [user, timeLimitStatus.isActive, timeLimitStatus.timeRemaining]);

  // Check if action should be blocked
  const shouldBlockAction = useCallback((action: 'navigation' | 'property_view' | 'search' | 'filter') => {
    if (user) return false; // Logged in users have no restrictions
    
    if (detectManipulation()) {
      return true; // Block if manipulation detected
    }
    
    return timeLimitStatus.isExpired;
  }, [user, timeLimitStatus.isExpired, detectManipulation]);

  // Get restriction message based on action
  const getRestrictionMessage = useCallback((action: 'navigation' | 'property_view' | 'search' | 'filter') => {
    if (!shouldBlockAction(action)) return '';

    const messages = {
      navigation: 'Your 30-second preview has expired. Please register to continue browsing properties.',
      property_view: 'Time limit reached. Register now to view property details and continue browsing.',
      search: 'Search functionality requires registration. Create your free account to search properties.',
      filter: 'Property filtering requires registration. Sign up to access advanced search features.'
    };

    return messages[action] || 'Please register to continue using the platform.';
  }, [shouldBlockAction]);

  return {
    timeLimitStatus,
    shouldBlockAction,
    getRestrictionMessage,
    getFormattedTimeRemaining,
    forceExpiry,
    isAnonymous: !user,
    hasTimeLimit: !user && timeLimitStatus.isActive,
    manipulationDetected: detectManipulation()
  };
};

export default useAnonymousTimeLimit;
