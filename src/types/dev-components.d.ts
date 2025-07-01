/**
 * Development Components Type Declarations
 * Apple-Level type safety for development environment components
 *
 * @fileoverview Comprehensive type definitions for development components
 * @author ROOMi Development Team
 * @version 1.0.0
 * @since 2025-06-21
 */

declare module '@/components/dev/DevBypassIndicator' {
  import { FC } from 'react';
  
  /**
   * Environment types supported by the application
   */
  export type Environment = 'development' | 'staging' | 'production';
  
  /**
   * Security levels for development features
   */
  export type SecurityLevel = 'low' | 'medium' | 'high';
  
  /**
   * Security violation error for development environment
   */
  export interface SecurityViolationError extends Error {
    readonly severity: SecurityLevel;
    readonly violationType: string;
    readonly timestamp: Date;
    readonly context: Record<string, unknown>;
  }
  
  /**
   * Props interface for DevBypassIndicator component
   */
  export interface DevBypassIndicatorProps {
    readonly className?: string;
    readonly onEnvironmentChange?: (environment: Environment) => void;
    readonly onSecurityViolation?: (violation: SecurityViolationError) => void;
  }
  
  /**
   * DevBypassIndicator Component
   * Shows development environment status with security controls
   */
  export const DevBypassIndicator: FC<DevBypassIndicatorProps>;
  
  /**
   * Default export for DevBypassIndicator
   */
  const DevBypassIndicatorDefault: FC<DevBypassIndicatorProps>;
  export default DevBypassIndicatorDefault;
}

/**
 * Global development environment types
 */
declare global {
  namespace DevEnvironment {
    interface Config {
      readonly environment: Environment;
      readonly isVisible: boolean;
      readonly securityLevel: SecurityLevel;
      readonly sessionTimeout: number;
    }
    
    interface State {
      readonly isEnabled: boolean;
      readonly lastToggleTime: Date;
      readonly sessionId: string;
      readonly isSecure: boolean;
    }
  }
}

export {};
