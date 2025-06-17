/**
 * CSRF Protection utilities for ROOMi platform
 * Provides client-side CSRF token management
 */

import { logger } from './enhanced-logger';

const CSRF_TOKEN_KEY = 'roomi_csrf_token';
const CSRF_HEADER_NAME = 'X-CSRF-Token';

export class CSRFProtection {
  private static instance: CSRFProtection;
  private token: string | null = null;
  private tokenExpiry: number | null = null;

  private constructor() {
    this.loadTokenFromStorage();
  }

  static getInstance(): CSRFProtection {
    if (!CSRFProtection.instance) {
      CSRFProtection.instance = new CSRFProtection();
    }
    return CSRFProtection.instance;
  }

  /**
   * Generate a cryptographically secure CSRF token
   */
  private generateToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Load token from sessionStorage
   */
  private loadTokenFromStorage(): void {
    try {
      const stored = sessionStorage.getItem(CSRF_TOKEN_KEY);
      if (stored) {
        const { token, expiry } = JSON.parse(stored);
        if (expiry > Date.now()) {
          this.token = token;
          this.tokenExpiry = expiry;
        } else {
          this.clearToken();
        }
      }
    } catch (error) {
      logger.warn('Failed to load CSRF token from storage', error);
      this.clearToken();
    }
  }

  /**
   * Save token to sessionStorage
   */
  private saveTokenToStorage(): void {
    if (this.token && this.tokenExpiry) {
      try {
        sessionStorage.setItem(CSRF_TOKEN_KEY, JSON.stringify({
          token: this.token,
          expiry: this.tokenExpiry
        }));
      } catch (error) {
        logger.warn('Failed to save CSRF token to storage', error);
      }
    }
  }

  /**
   * Get current CSRF token, generating one if needed
   */
  getToken(): string {
    if (!this.token || !this.tokenExpiry || this.tokenExpiry <= Date.now()) {
      this.refreshToken();
    }
    return this.token!;
  }

  /**
   * Generate a new CSRF token
   */
  refreshToken(): void {
    this.token = this.generateToken();
    // Token expires in 1 hour
    this.tokenExpiry = Date.now() + (60 * 60 * 1000);
    this.saveTokenToStorage();
    
    logger.debug('CSRF token refreshed');
  }

  /**
   * Clear the current token
   */
  clearToken(): void {
    this.token = null;
    this.tokenExpiry = null;
    try {
      sessionStorage.removeItem(CSRF_TOKEN_KEY);
    } catch (error) {
      logger.warn('Failed to clear CSRF token from storage', error);
    }
  }

  /**
   * Get headers object with CSRF token
   */
  getHeaders(): Record<string, string> {
    return {
      [CSRF_HEADER_NAME]: this.getToken()
    };
  }

  /**
   * Validate a token (for server-side validation simulation)
   */
  validateToken(token: string): boolean {
    return token === this.token && this.tokenExpiry !== null && this.tokenExpiry > Date.now();
  }
}

/**
 * Enhanced fetch wrapper with automatic CSRF protection
 */
export async function secureApiCall(
  url: string, 
  options: RequestInit = {}
): Promise<Response> {
  const csrf = CSRFProtection.getInstance();
  
  // Add CSRF headers to the request
  const headers = {
    'Content-Type': 'application/json',
    ...csrf.getHeaders(),
    ...options.headers,
  };

  // Add request timestamp for replay attack prevention
  const timestamp = Date.now().toString();
  headers['X-Request-Timestamp'] = timestamp;

  const enhancedOptions: RequestInit = {
    ...options,
    headers,
    credentials: 'same-origin', // Include cookies for session management
  };

  try {
    const response = await fetch(url, enhancedOptions);
    
    // Check if server indicates token refresh is needed
    if (response.headers.get('X-CSRF-Token-Refresh') === 'true') {
      csrf.refreshToken();
      logger.info('CSRF token refreshed by server request');
    }

    return response;
  } catch (error) {
    logger.error('Secure API call failed', { url, error });
    throw error;
  }
}

/**
 * Form submission with CSRF protection
 */
export function addCSRFToForm(form: HTMLFormElement): void {
  const csrf = CSRFProtection.getInstance();
  
  // Remove existing CSRF input if present
  const existingInput = form.querySelector('input[name="csrf_token"]');
  if (existingInput) {
    existingInput.remove();
  }

  // Add new CSRF token input
  const csrfInput = document.createElement('input');
  csrfInput.type = 'hidden';
  csrfInput.name = 'csrf_token';
  csrfInput.value = csrf.getToken();
  
  form.appendChild(csrfInput);
}

/**
 * React hook for CSRF protection
 */
export function useCSRFProtection() {
  const csrf = CSRFProtection.getInstance();
  
  return {
    token: csrf.getToken(),
    headers: csrf.getHeaders(),
    refreshToken: () => csrf.refreshToken(),
    secureApiCall,
    addToForm: addCSRFToForm,
  };
}

/**
 * Middleware for Supabase client to add CSRF protection
 */
export function createCSRFMiddleware() {
  const csrf = CSRFProtection.getInstance();
  
  return {
    beforeRequest: (request: any) => {
      // Add CSRF headers to Supabase requests
      if (request.headers) {
        Object.assign(request.headers, csrf.getHeaders());
      } else {
        request.headers = csrf.getHeaders();
      }
      return request;
    }
  };
}

// Initialize CSRF protection
const csrfProtection = CSRFProtection.getInstance();

export { csrfProtection };
export default CSRFProtection;
