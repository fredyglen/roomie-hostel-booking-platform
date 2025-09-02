/**
 * ROOMi Platform - Centralized UI Configuration
 * 
 * SINGLE SOURCE OF TRUTH FOR ALL UI CONSTANTS AND CONFIGURATIONS
 * 
 * This file consolidates all scattered UI constants from components
 * into a unified, type-safe configuration system following BE CONSCIOUS standards.
 * 
 * ZERO TOLERANCE POLICY: No UI constants should be defined outside this system.
 * 
 * @author ROOMi Platform Team
 * @version 1.0.0
 * @date 2025-01-09
 * @compliance BE CONSCIOUS Apple-Grade Standards
 */

import React from 'react';
import { Info, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

// ============================================================================
// BRANDED TYPES FOR COMPILE-TIME SAFETY
// ============================================================================

type CategoryId = string & { readonly __brand: 'CategoryId' };
type CategoryName = string & { readonly __brand: 'CategoryName' };
type SeverityLevel = 'info' | 'warning' | 'error' | 'success';

const createCategoryId = (value: string): CategoryId => value as CategoryId;
const createCategoryName = (value: string): CategoryName => value as CategoryName;

// ============================================================================
// UI CONFIGURATION INTERFACES
// ============================================================================

interface AmenityCategory {
  readonly id: CategoryId;
  readonly name: CategoryName;
  readonly description: string;
  readonly displayOrder: number;
  readonly iconName?: string;
}

interface ConsiderationCategory {
  readonly id: CategoryId;
  readonly name: CategoryName;
  readonly description: string;
  readonly iconName: string;
  readonly displayOrder: number;
}

interface SeverityLevelConfig {
  readonly value: SeverityLevel;
  readonly label: string;
  readonly description: string;
  readonly color: string;
  readonly icon: React.ComponentType<{ className?: string }>;
  readonly displayOrder: number;
}

interface UIThemeConfiguration {
  readonly colors: {
    readonly primary: string;
    readonly secondary: string;
    readonly accent: string;
    readonly background: string;
    readonly foreground: string;
  };
  readonly spacing: {
    readonly xs: string;
    readonly sm: string;
    readonly md: string;
    readonly lg: string;
    readonly xl: string;
  };
  readonly borderRadius: {
    readonly sm: string;
    readonly md: string;
    readonly lg: string;
  };
}

interface UIConfiguration {
  readonly amenityCategories: readonly AmenityCategory[];
  readonly considerationCategories: readonly ConsiderationCategory[];
  readonly severityLevels: readonly SeverityLevelConfig[];
  readonly theme: UIThemeConfiguration;
  readonly pagination: {
    readonly defaultPageSize: number;
    readonly maxPageSize: number;
    readonly pageSizeOptions: readonly number[];
  };
  readonly performance: {
    readonly toastDuration: number;
    readonly debounceDelay: number;
    readonly animationDuration: number;
  };
  readonly environment: 'development' | 'staging' | 'production';
  readonly lastUpdated: string;
  readonly version: string;
}

// ============================================================================
// AUTHORITATIVE UI CONFIGURATION
// ============================================================================

/**
 * SINGLE SOURCE OF TRUTH FOR ALL UI CONFIGURATIONS
 * 
 * These configurations are the definitive UI standards for ROOMi Platform.
 * Any changes to UI constants MUST be made here and nowhere else.
 * 
 * UI Standards (as of 2025-01-09):
 * - Amenity Categories: Organized by importance and user workflow
 * - Consideration Categories: Grouped by impact type
 * - Severity Levels: Clear visual hierarchy for user guidance
 * - Theme: Consistent design system across platform
 */
const AUTHORITATIVE_UI_CONFIGURATION: UIConfiguration = {
  amenityCategories: [
    {
      id: createCategoryId('basic-utilities'),
      name: createCategoryName('Basic Utilities'),
      description: 'Essential utilities and services',
      displayOrder: 1,
      iconName: 'solar:home-bold'
    },
    {
      id: createCategoryId('security-safety'),
      name: createCategoryName('Security & Safety'),
      description: 'Security features and safety measures',
      displayOrder: 2,
      iconName: 'solar:shield-check-bold'
    },
    {
      id: createCategoryId('internet-technology'),
      name: createCategoryName('Internet & Technology'),
      description: 'Internet connectivity and technology amenities',
      displayOrder: 3,
      iconName: 'solar:wifi-router-bold'
    },
    {
      id: createCategoryId('study-work'),
      name: createCategoryName('Study & Work'),
      description: 'Study spaces and work facilities',
      displayOrder: 4,
      iconName: 'solar:book-bold'
    },
    {
      id: createCategoryId('kitchen-dining'),
      name: createCategoryName('Kitchen & Dining'),
      description: 'Kitchen facilities and dining areas',
      displayOrder: 5,
      iconName: 'solar:chef-hat-bold'
    },
    {
      id: createCategoryId('recreation-social'),
      name: createCategoryName('Recreation & Social'),
      description: 'Entertainment and social facilities',
      displayOrder: 6,
      iconName: 'solar:gameboy-bold'
    },
    {
      id: createCategoryId('transportation'),
      name: createCategoryName('Transportation'),
      description: 'Transportation and parking facilities',
      displayOrder: 7,
      iconName: 'solar:bus-bold'
    },
    {
      id: createCategoryId('premium-luxury'),
      name: createCategoryName('Premium & Luxury'),
      description: 'Premium and luxury amenities',
      displayOrder: 8,
      iconName: 'solar:crown-bold'
    }
  ],
  considerationCategories: [
    {
      id: createCategoryId('infrastructure'),
      name: createCategoryName('Infrastructure Limitations'),
      description: 'Limitations in infrastructure and utilities',
      iconName: 'solar:settings-bold',
      displayOrder: 1
    },
    {
      id: createCategoryId('location'),
      name: createCategoryName('Location Considerations'),
      description: 'Location-specific factors to consider',
      iconName: 'solar:map-point-bold',
      displayOrder: 2
    },
    {
      id: createCategoryId('social'),
      name: createCategoryName('Social Environment'),
      description: 'Social dynamics and community aspects',
      iconName: 'solar:users-group-rounded-bold',
      displayOrder: 3
    },
    {
      id: createCategoryId('maintenance'),
      name: createCategoryName('Maintenance & Upkeep'),
      description: 'Property maintenance and upkeep considerations',
      iconName: 'solar:hammer-bold',
      displayOrder: 4
    },
    {
      id: createCategoryId('policies'),
      name: createCategoryName('Policies & Restrictions'),
      description: 'Property policies and usage restrictions',
      iconName: 'solar:document-text-bold',
      displayOrder: 5
    }
  ],
  severityLevels: [
    {
      value: 'info',
      label: 'Information',
      description: 'General information students should know',
      color: 'blue',
      icon: Info,
      displayOrder: 1
    },
    {
      value: 'warning',
      label: 'Important Notice',
      description: 'Important considerations that may affect comfort',
      color: 'yellow',
      icon: AlertTriangle,
      displayOrder: 2
    },
    {
      value: 'error',
      label: 'Significant Limitation',
      description: 'Significant limitations that may impact daily life',
      color: 'red',
      icon: AlertCircle,
      displayOrder: 3
    },
    {
      value: 'success',
      label: 'Positive Aspect',
      description: 'Positive aspects worth highlighting',
      color: 'green',
      icon: CheckCircle,
      displayOrder: 4
    }
  ],
  theme: {
    colors: {
      primary: '#3B82F6',      // Blue-500
      secondary: '#6B7280',    // Gray-500
      accent: '#10B981',       // Emerald-500
      background: '#FFFFFF',   // White
      foreground: '#111827'    // Gray-900
    },
    spacing: {
      xs: '0.25rem',          // 4px
      sm: '0.5rem',           // 8px
      md: '1rem',             // 16px
      lg: '1.5rem',           // 24px
      xl: '2rem'              // 32px
    },
    borderRadius: {
      sm: '0.25rem',          // 4px
      md: '0.375rem',         // 6px
      lg: '0.5rem'            // 8px
    }
  },
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
    pageSizeOptions: [10, 20, 50, 100]
  },
  performance: {
    toastDuration: 5000,      // 5 seconds
    debounceDelay: 300,       // 300ms
    animationDuration: 200    // 200ms
  },
  environment: (process.env.NODE_ENV as any) || 'development',
  lastUpdated: '2025-01-09T00:00:00Z',
  version: '1.0.0'
} as const;

// ============================================================================
// UI CONFIGURATION ENGINE
// ============================================================================

class UIConfigurationEngine {
  private readonly config: UIConfiguration;

  constructor() {
    this.config = AUTHORITATIVE_UI_CONFIGURATION;
  }

  /**
   * Get all UI configuration
   */
  public getAllConfig(): UIConfiguration {
    return this.config;
  }

  /**
   * Get amenity categories in display order
   */
  public getAmenityCategories(): readonly AmenityCategory[] {
    return [...this.config.amenityCategories].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  /**
   * Get consideration categories in display order
   */
  public getConsiderationCategories(): readonly ConsiderationCategory[] {
    return [...this.config.considerationCategories].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  /**
   * Get severity levels in display order
   */
  public getSeverityLevels(): readonly SeverityLevelConfig[] {
    return [...this.config.severityLevels].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  /**
   * Get category display order for amenities
   */
  public getAmenityCategoryDisplayOrder(): readonly string[] {
    return this.getAmenityCategories().map(category => category.name);
  }

  /**
   * Get theme configuration
   */
  public getTheme(): UIThemeConfiguration {
    return this.config.theme;
  }

  /**
   * Get pagination configuration
   */
  public getPagination() {
    return this.config.pagination;
  }

  /**
   * Get performance configuration
   */
  public getPerformance() {
    return this.config.performance;
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const uiConfigurationEngine = new UIConfigurationEngine();

// ============================================================================
// LEGACY COMPATIBILITY EXPORTS (DEPRECATED)
// ============================================================================

/**
 * @deprecated Use uiConfigurationEngine.getAmenityCategoryDisplayOrder() instead
 */
export const CATEGORY_DISPLAY_ORDER = uiConfigurationEngine.getAmenityCategoryDisplayOrder();

/**
 * @deprecated Use uiConfigurationEngine.getConsiderationCategories() instead
 */
export const CONSIDERATION_CATEGORIES = uiConfigurationEngine.getConsiderationCategories();

/**
 * @deprecated Use uiConfigurationEngine.getSeverityLevels() instead
 */
export const SEVERITY_LEVELS = uiConfigurationEngine.getSeverityLevels();

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type {
  UIConfiguration,
  AmenityCategory,
  ConsiderationCategory,
  SeverityLevelConfig,
  UIThemeConfiguration,
  SeverityLevel
};
