/**
 * Sentry Configuration for ROOMie
 * 
 * This file contains centralized Sentry configuration including:
 * - Error filtering rules
 * - Performance monitoring settings
 * - Session replay configuration
 * - Custom error handling
 */

import * as Sentry from '@sentry/react';

/**
 * Initialize Sentry with ROOMie-specific configuration
 */
export function initializeSentry() {
  // Only initialize in production with valid DSN
  if (!import.meta.env.PROD || !import.meta.env.VITE_SENTRY_DSN) {
    console.log('[Sentry] Skipping initialization (not production or DSN missing)');
    return;
  }

  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    
    // Release tracking (update this with your actual version)
    release: `roomie@${import.meta.env.VITE_APP_VERSION || '1.0.0'}`,
    
    // Performance Monitoring
    integrations: [
      // Browser tracing for performance monitoring
      Sentry.browserTracingIntegration({
        // Track navigation timing
        tracingOrigins: ['localhost', /^\//],
        // Track fetch/XHR requests
        traceFetch: true,
        traceXHR: true,
      }),
      
      // Session Replay for debugging
      Sentry.replayIntegration({
        // Privacy settings
        maskAllText: true,
        blockAllMedia: true,
        // Network recording
        networkDetailAllowUrls: [window.location.origin],
        networkCaptureBodies: false,
      }),
    ],
    
    // Performance Monitoring Sample Rates
    // 1.0 = 100% of transactions (reduce in high-traffic production)
    tracesSampleRate: 1.0,
    
    // Session Replay Sample Rates
    replaysSessionSampleRate: 0.1,  // 10% of normal sessions
    replaysOnErrorSampleRate: 1.0,   // 100% of error sessions
    
    // Error Filtering
    beforeSend(event, hint) {
      return filterError(event, hint);
    },
    
    // Breadcrumb Filtering
    beforeBreadcrumb(breadcrumb) {
      return filterBreadcrumb(breadcrumb);
    },
    
    // Initial Scope Configuration
    initialScope: {
      tags: {
        app_name: 'ROOMie',
        app_version: import.meta.env.VITE_APP_VERSION || '1.0.0',
        deployment: 'production',
      },
    },
    
    // Ignore specific errors
    ignoreErrors: [
      // Browser extensions
      'top.GLOBALS',
      'chrome-extension://',
      'moz-extension://',
      // Random plugins/extensions
      'Can\'t find variable: ZiteReader',
      'jigsaw is not defined',
      'ComboSearch is not defined',
      // Network errors that are expected
      'NetworkError',
      'Failed to fetch',
      // ResizeObserver errors (non-critical)
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
    ],
    
    // Deny URLs (don't report errors from these sources)
    denyUrls: [
      // Browser extensions
      /extensions\//i,
      /^chrome:\/\//i,
      /^moz-extension:\/\//i,
      // Ad blockers
      /adblock/i,
      /ublock/i,
    ],
  });

  console.log('[Sentry] Initialized successfully');
}

/**
 * Filter errors before sending to Sentry
 */
function filterError(
  event: Sentry.ErrorEvent,
  hint: Sentry.EventHint
): Sentry.ErrorEvent | null {
  const error = hint.originalException;
  
  // Filter out browser extension errors
  if (event.exception?.values?.[0]?.value?.includes('chrome-extension://')) {
    return null;
  }
  
  if (event.exception?.values?.[0]?.value?.includes('moz-extension://')) {
    return null;
  }
  
  // Filter out ad blocker errors
  if (event.exception?.values?.[0]?.value?.match(/adblock|ublock/i)) {
    return null;
  }
  
  // Filter out ResizeObserver errors (non-critical)
  if (event.exception?.values?.[0]?.value?.includes('ResizeObserver')) {
    return null;
  }
  
  // Filter out expected network errors in development
  if (import.meta.env.DEV && error instanceof Error) {
    if (error.message.includes('Failed to fetch')) {
      return null;
    }
  }
  
  return event;
}

/**
 * Filter breadcrumbs before adding to Sentry
 */
function filterBreadcrumb(breadcrumb: Sentry.Breadcrumb): Sentry.Breadcrumb | null {
  // Don't log console.log breadcrumbs (too noisy)
  if (breadcrumb.category === 'console' && breadcrumb.level === 'log') {
    return null;
  }
  
  // Filter out sensitive data from network requests
  if (breadcrumb.category === 'fetch' || breadcrumb.category === 'xhr') {
    // Remove sensitive headers
    if (breadcrumb.data?.headers) {
      delete breadcrumb.data.headers['Authorization'];
      delete breadcrumb.data.headers['Cookie'];
    }
    
    // Remove sensitive query parameters
    if (breadcrumb.data?.url) {
      const url = new URL(breadcrumb.data.url, window.location.origin);
      url.searchParams.delete('token');
      url.searchParams.delete('api_key');
      url.searchParams.delete('password');
      breadcrumb.data.url = url.toString();
    }
  }
  
  return breadcrumb;
}

/**
 * Set user context for Sentry
 * Call this after user logs in
 */
export function setSentryUser(user: {
  id: string;
  email?: string;
  role?: string;
  university?: string;
}) {
  if (!import.meta.env.PROD || !import.meta.env.VITE_SENTRY_DSN) {
    return;
  }
  
  Sentry.setUser({
    id: user.id,
    email: user.email,
    role: user.role,
    university: user.university,
  });
}

/**
 * Clear user context from Sentry
 * Call this after user logs out
 */
export function clearSentryUser() {
  if (!import.meta.env.PROD || !import.meta.env.VITE_SENTRY_DSN) {
    return;
  }
  
  Sentry.setUser(null);
}

/**
 * Add custom context to Sentry
 */
export function setSentryContext(key: string, context: Record<string, unknown>) {
  if (!import.meta.env.PROD || !import.meta.env.VITE_SENTRY_DSN) {
    return;
  }
  
  Sentry.setContext(key, context);
}

/**
 * Manually capture an exception
 */
export function captureSentryException(error: Error, context?: Record<string, unknown>) {
  if (!import.meta.env.PROD || !import.meta.env.VITE_SENTRY_DSN) {
    console.error('[Sentry] Would capture:', error, context);
    return;
  }
  
  Sentry.captureException(error, {
    extra: context,
  });
}

/**
 * Manually capture a message
 */
export function captureSentryMessage(message: string, level: Sentry.SeverityLevel = 'info') {
  if (!import.meta.env.PROD || !import.meta.env.VITE_SENTRY_DSN) {
    console.log('[Sentry] Would capture message:', message, level);
    return;
  }
  
  Sentry.captureMessage(message, level);
}

