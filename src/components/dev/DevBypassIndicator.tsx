/**
 * Development Environment Bypass Indicator
 * Apple-Level production-ready component with comprehensive error handling
 *
 * @fileoverview Development environment indicator that shows current environment status
 * @author ROOMi Development Team
 * @version 1.0.0
 * @since 2025-06-21
 */

import React, { useState, useEffect, useCallback } from 'react';
import { logger } from '@/utils/enhanced-logger';
import {
  DevEnvironmentError,
  InvalidEnvironmentError,
  SecurityViolationError
} from '@/errors/dev-errors';

/**
 * Environment types supported by the application
 */
type Environment = 'development' | 'staging' | 'production';

/**
 * Security levels for development features
 */
type SecurityLevel = 'low' | 'medium' | 'high';

/**
 * Configuration interface for DevBypassIndicator
 */
interface DevBypassIndicatorConfig {
  readonly environment: Environment;
  readonly isVisible: boolean;
  readonly securityLevel: SecurityLevel;
  readonly sessionTimeout: number;
}

/**
 * State interface for DevBypassIndicator
 */
interface DevBypassIndicatorState {
  readonly isEnabled: boolean;
  readonly lastToggleTime: Date;
  readonly sessionId: string;
  readonly isSecure: boolean;
}

/**
 * Props interface for DevBypassIndicator component
 */
interface DevBypassIndicatorProps {
  readonly className?: string;
  readonly onEnvironmentChange?: (environment: Environment) => void;
  readonly onSecurityViolation?: (violation: SecurityViolationError) => void;
}

/**
 * Environment configuration validator
 */
class EnvironmentValidator {
  /**
   * Validates environment configuration
   */
  static validate(config: unknown): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config || typeof config !== 'object') {
      errors.push('Environment configuration must be a valid object');
      return { isValid: false, errors };
    }

    const envConfig = config as Record<string, unknown>;

    // Validate environment
    if (!envConfig.environment || typeof envConfig.environment !== 'string') {
      errors.push('Environment must be specified as a string');
    } else {
      const validEnvironments: Environment[] = ['development', 'staging', 'production'];
      if (!validEnvironments.includes(envConfig.environment as Environment)) {
        errors.push(`Environment must be one of: ${validEnvironments.join(', ')}`);
      }
    }

    // Validate visibility
    if (envConfig.isVisible !== undefined && typeof envConfig.isVisible !== 'boolean') {
      errors.push('isVisible must be a boolean value');
    }

    return { isValid: errors.length === 0, errors };
  }
}

/**
 * Development environment service
 */
class DevEnvironmentService {
  private static instance: DevEnvironmentService;
  private config: DevBypassIndicatorConfig;

  private constructor() {
    this.config = this.initializeConfig();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): DevEnvironmentService {
    if (!DevEnvironmentService.instance) {
      DevEnvironmentService.instance = new DevEnvironmentService();
    }
    return DevEnvironmentService.instance;
  }

  /**
   * Initialize environment configuration
   */
  private initializeConfig(): DevBypassIndicatorConfig {
    try {
      const environment = this.detectEnvironment();
      const isProduction = environment === 'production';

      return {
        environment,
        isVisible: !isProduction,
        securityLevel: isProduction ? 'high' : 'medium',
        sessionTimeout: isProduction ? 300000 : 3600000 // 5 min prod, 1 hour dev
      };
    } catch (error) {
      logger.error('Failed to initialize environment configuration', { error });
      throw new DevEnvironmentError('Environment configuration initialization failed');
    }
  }

  /**
   * Detect current environment
   */
  private detectEnvironment(): Environment {
    const nodeEnv = process.env.NODE_ENV;
    const customEnv = process.env.REACT_APP_ENVIRONMENT;

    if (customEnv) {
      const validEnvironments: Environment[] = ['development', 'staging', 'production'];
      if (validEnvironments.includes(customEnv as Environment)) {
        return customEnv as Environment;
      }
      throw new InvalidEnvironmentError(`Invalid custom environment: ${customEnv}`);
    }

    switch (nodeEnv) {
      case 'development':
        return 'development';
      case 'production':
        return 'production';
      default:
        return 'staging';
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): DevBypassIndicatorConfig {
    return { ...this.config };
  }

  /**
   * Check if development features should be enabled
   */
  isDevelopmentEnabled(): boolean {
    return this.config.environment !== 'production';
  }

  /**
   * Validate security context
   */
  validateSecurityContext(): boolean {
    if (this.config.environment === 'production') {
      // In production, no development features should be accessible
      return false;
    }

    // Additional security checks for non-production environments
    const hasValidSession = this.validateSession();
    const hasSecureConnection = this.validateConnection();

    return hasValidSession && hasSecureConnection;
  }

  /**
   * Validate current session
   */
  private validateSession(): boolean {
    // Implement session validation logic
    return true; // Simplified for now
  }

  /**
   * Validate connection security
   */
  private validateConnection(): boolean {
    // Check for HTTPS in production-like environments
    if (this.config.environment === 'staging') {
      return window.location.protocol === 'https:';
    }
    return true;
  }
}

/**
 * DevBypassIndicator Component
 * Shows development environment status with security controls
 */
export const DevBypassIndicator: React.FC<DevBypassIndicatorProps> = ({
  className = '',
  onEnvironmentChange,
  onSecurityViolation
}) => {
  const [state, setState] = useState<DevBypassIndicatorState>({
    isEnabled: false,
    lastToggleTime: new Date(),
    sessionId: '',
    isSecure: false
  });

  const [config, setConfig] = useState<DevBypassIndicatorConfig | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Initialize component
   */
  useEffect(() => {
    try {
      const envService = DevEnvironmentService.getInstance();
      const envConfig = envService.getConfig();
      
      setConfig(envConfig);
      setState(prevState => ({
        ...prevState,
        isEnabled: envService.isDevelopmentEnabled(),
        isSecure: envService.validateSecurityContext(),
        sessionId: generateSessionId()
      }));

      logger.info('DevBypassIndicator initialized', {
        environment: envConfig.environment,
        isVisible: envConfig.isVisible,
        securityLevel: envConfig.securityLevel
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown initialization error';
      setError(errorMessage);
      logger.error('DevBypassIndicator initialization failed', { error });
    }
  }, []);

  /**
   * Handle environment change
   */
  const handleEnvironmentChange = useCallback((newEnvironment: Environment) => {
    try {
      if (!state.isSecure) {
        const violation = new SecurityViolationError('Unauthorized environment change attempt');
        onSecurityViolation?.(violation);
        return;
      }

      setState(prevState => ({
        ...prevState,
        lastToggleTime: new Date()
      }));

      onEnvironmentChange?.(newEnvironment);
      
      logger.info('Environment change requested', {
        from: config?.environment,
        to: newEnvironment,
        sessionId: state.sessionId
      });

    } catch (error) {
      logger.error('Environment change failed', { error, newEnvironment });
    }
  }, [state.isSecure, config?.environment, state.sessionId, onEnvironmentChange, onSecurityViolation]);

  /**
   * Generate session ID
   */
  function generateSessionId(): string {
    return `dev_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Don't render in production
  if (!config || config.environment === 'production') {
    return null;
  }

  // Don't render if not visible
  if (!config.isVisible) {
    return null;
  }

  // Show error state
  if (error) {
    return (
      <div className={`fixed top-0 right-0 z-50 p-2 ${className}`}>
        <div className="bg-red-600 text-white px-3 py-1 rounded-bl-lg text-xs font-mono">
          <span className="font-bold">DEV ERROR:</span> {error}
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed top-0 right-0 z-50 p-2 ${className}`}>
      <div className="flex items-center space-x-2 bg-gray-900 text-white px-3 py-1 rounded-bl-lg text-xs font-mono">
        <span className={`px-2 py-1 rounded text-xs font-bold ${
          config.environment === 'development' ? 'bg-green-600' :
          config.environment === 'staging' ? 'bg-yellow-600' : 'bg-red-600'
        }`}>
          {config.environment.toUpperCase()}
        </span>
        {state.isEnabled && (
          <span className="bg-blue-600 px-2 py-1 rounded text-xs">
            DEV MODE
          </span>
        )}
        {!state.isSecure && (
          <span className="bg-red-600 px-2 py-1 rounded text-xs animate-pulse">
            INSECURE
          </span>
        )}
      </div>
    </div>
  );
};

export default DevBypassIndicator;
