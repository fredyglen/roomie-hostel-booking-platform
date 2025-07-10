/**
 * Unified Configuration Management System
 * Apple-Grade International Configuration with Role-Based Support
 * 
 * Purpose: Single source of truth for all platform configuration
 * Compliance: BE CONSCIOUS zero tolerance for scattered configuration
 * Architecture: International-ready, role-based, environment-aware
 */

import { logger as enhancedLogger } from '@/utils/enhanced-logger';
import { centralizedCommissionEngine } from './centralized-commission.config';
import { centralizedBusinessRulesEngine } from './centralized-business-rules.config';

// ============================================================================
// BRANDED TYPES FOR COMPILE-TIME SAFETY
// ============================================================================

type CountryCode = string & { readonly __brand: 'CountryCode' };
type CurrencyCode = string & { readonly __brand: 'CurrencyCode' };
type LanguageCode = string & { readonly __brand: 'LanguageCode' };
type EnvironmentType = 'development' | 'staging' | 'production';

const createCountryCode = (code: string): CountryCode => {
  if (!/^[A-Z]{2}$/.test(code)) {
    throw new Error(`Invalid country code format: ${code}. Must be 2-letter ISO code.`);
  }
  return code as CountryCode;
};

const createCurrencyCode = (code: string): CurrencyCode => {
  if (!/^[A-Z]{3}$/.test(code)) {
    throw new Error(`Invalid currency code format: ${code}. Must be 3-letter ISO code.`);
  }
  return code as CurrencyCode;
};

const createLanguageCode = (code: string): LanguageCode => {
  if (!/^[a-z]{2}(-[A-Z]{2})?$/.test(code)) {
    throw new Error(`Invalid language code format: ${code}. Must be ISO 639-1 format.`);
  }
  return code as LanguageCode;
};

// ============================================================================
// INTERNATIONAL CONFIGURATION INTERFACES
// ============================================================================

interface CountryConfiguration {
  readonly code: CountryCode;
  readonly name: string;
  readonly currency: CurrencyCode;
  readonly languages: readonly LanguageCode[];
  readonly timezone: string;
  readonly dateFormat: string;
  readonly phoneFormat: RegExp;
  readonly paymentMethods: readonly string[];
  readonly compliance: {
    readonly dataProtection: string[];
    readonly financialRegulations: string[];
    readonly educationLaws: string[];
  };
}

interface AdminRoleConfiguration {
  readonly type: 'supreme' | 'country' | 'campus';
  readonly permissions: readonly string[];
  readonly features: readonly string[];
  readonly jurisdictionScope: 'global' | 'country' | 'campus';
  readonly internationalAccess: boolean;
}

interface PortalConfiguration {
  readonly admin: {
    readonly roles: Record<string, AdminRoleConfiguration>;
    readonly features: readonly string[];
    readonly analytics: readonly string[];
  };
  readonly owner: {
    readonly features: readonly string[];
    readonly propertyLimits: Record<string, number>;
  };
  readonly student: {
    readonly features: readonly string[];
    readonly bookingLimits: Record<string, number>;
  };
}

interface UnifiedConfiguration {
  readonly app: {
    readonly name: string;
    readonly version: string;
    readonly environment: EnvironmentType;
    readonly baseUrl: string;
    readonly supportedCountries: readonly CountryCode[];
    readonly defaultCountry: CountryCode;
    readonly defaultLanguage: LanguageCode;
  };
  readonly database: {
    readonly url: string;
    readonly anonKey: string;
    readonly timeout: number;
    readonly retryAttempts: number;
    readonly connectionPoolSize: number;
  };
  readonly payment: {
    readonly providers: Record<CountryCode, {
      readonly primary: string;
      readonly methods: readonly string[];
      readonly currencies: readonly CurrencyCode[];
    }>;
    readonly globalSettings: {
      readonly timeout: number;
      readonly retryAttempts: number;
      readonly webhookSecret: string;
    };
  };
  readonly ui: {
    readonly theme: {
      readonly defaultTheme: 'light' | 'dark' | 'system';
      readonly supportedThemes: readonly string[];
    };
    readonly pagination: {
      readonly defaultPageSize: number;
      readonly maxPageSize: number;
      readonly pageSizeOptions: readonly number[];
    };
    readonly performance: {
      readonly searchDebounceMs: number;
      readonly toastDuration: number;
      readonly animationDuration: number;
    };
    readonly responsive: {
      readonly breakpoints: Record<string, number>;
      readonly mobileFirst: boolean;
    };
  };
  readonly upload: {
    readonly limits: {
      readonly maxImageSize: number;
      readonly maxVideoSize: number;
      readonly maxDocumentSize: number;
    };
    readonly allowedTypes: {
      readonly images: readonly string[];
      readonly videos: readonly string[];
      readonly documents: readonly string[];
    };
    readonly processing: {
      readonly compressionQuality: number;
      readonly thumbnailSizes: readonly number[];
    };
  };
  readonly security: {
    readonly authentication: {
      readonly sessionTimeout: number;
      readonly anonymousTimeLimit: number;
      readonly maxLoginAttempts: number;
      readonly mfaRequired: readonly string[]; // Roles requiring MFA
    };
    readonly encryption: {
      readonly algorithm: string;
      readonly keyRotationDays: number;
    };
    readonly audit: {
      readonly retentionDays: number;
      readonly sensitiveActions: readonly string[];
    };
  };
  readonly features: {
    readonly global: Record<string, boolean>;
    readonly byCountry: Record<CountryCode, Record<string, boolean>>;
    readonly byRole: Record<string, Record<string, boolean>>;
  };
  readonly countries: Record<CountryCode, CountryConfiguration>;
  readonly portals: PortalConfiguration;
  readonly api: {
    readonly endpoints: Record<string, string>;
    readonly versions: {
      readonly current: string;
      readonly supported: readonly string[];
    };
    readonly rateLimit: {
      readonly requests: number;
      readonly windowMs: number;
    };
  };
}

// ============================================================================
// COUNTRY CONFIGURATIONS
// ============================================================================

const GHANA_CONFIG: CountryConfiguration = {
  code: createCountryCode('GH'),
  name: 'Ghana',
  currency: createCurrencyCode('GHS'),
  languages: [createLanguageCode('en'), createLanguageCode('tw')], // English, Twi
  timezone: 'Africa/Accra',
  dateFormat: 'DD/MM/YYYY',
  phoneFormat: /^(\+233|0)[2-9]\d{8}$/,
  paymentMethods: ['mtn_momo', 'airtel_money', 'vodafone_cash', 'paystack', 'bank_transfer'],
  compliance: {
    dataProtection: ['Ghana Data Protection Act 2012'],
    financialRegulations: ['Bank of Ghana Payment Systems Act'],
    educationLaws: ['Education Act 2008']
  }
};

// ROOMi is focused on Ghana market - removing international configurations

// ============================================================================
// ADMIN ROLE CONFIGURATIONS
// ============================================================================

const SUPREME_ADMIN_ROLE: AdminRoleConfiguration = {
  type: 'supreme',
  permissions: [
    'global.read', 'global.write', 'global.delete',
    'countries.manage', 'campuses.manage', 'users.manage',
    'settings.global', 'analytics.global', 'audit.access'
  ],
  features: [
    'global_dashboard', 'country_management', 'campus_oversight',
    'financial_reporting', 'system_configuration', 'user_management'
  ],
  jurisdictionScope: 'global',
  internationalAccess: true
};

const COUNTRY_ADMIN_ROLE: AdminRoleConfiguration = {
  type: 'country',
  permissions: [
    'country.read', 'country.write', 'campuses.manage',
    'users.country', 'analytics.country', 'settings.country'
  ],
  features: [
    'country_dashboard', 'campus_management', 'local_compliance',
    'country_analytics', 'local_settings', 'regional_support'
  ],
  jurisdictionScope: 'country',
  internationalAccess: false
};

const CAMPUS_ADMIN_ROLE: AdminRoleConfiguration = {
  type: 'campus',
  permissions: [
    'campus.read', 'campus.write', 'properties.approve',
    'students.verify', 'analytics.campus', 'disputes.resolve'
  ],
  features: [
    'campus_dashboard', 'property_approval', 'student_verification',
    'campus_analytics', 'local_disputes', 'campus_settings'
  ],
  jurisdictionScope: 'campus',
  internationalAccess: false
};

// ============================================================================
// AUTHORITATIVE UNIFIED CONFIGURATION
// ============================================================================

// Safe environment variable access
const getEnvVar = (key: string, defaultValue: string = ''): string => {
  try {
    return (typeof import.meta !== 'undefined' && import.meta.env?.[key]) || process.env?.[key] || defaultValue;
  } catch {
    return defaultValue;
  }
};

const UNIFIED_CONFIGURATION: UnifiedConfiguration = {
  app: {
    name: getEnvVar('VITE_APP_NAME', 'ROOMi International'),
    version: getEnvVar('VITE_APP_VERSION', '2.0.0'),
    environment: (getEnvVar('MODE', 'development') as EnvironmentType) || 'development',
    baseUrl: getEnvVar('VITE_APP_BASE_URL', 'http://localhost:5173'),
    supportedCountries: [createCountryCode('GH')], // Ghana-focused platform
    defaultCountry: createCountryCode('GH'),
    defaultLanguage: createLanguageCode('en')
  },
  database: {
    url: getEnvVar('VITE_SUPABASE_URL', ''),
    anonKey: getEnvVar('VITE_SUPABASE_ANON_KEY', ''),
    timeout: Number(getEnvVar('VITE_DB_TIMEOUT', '30000')) || 30000,
    retryAttempts: Number(getEnvVar('VITE_DB_RETRY_ATTEMPTS', '3')) || 3,
    connectionPoolSize: Number(getEnvVar('VITE_DB_POOL_SIZE', '10')) || 10
  },
  payment: {
    providers: {
      [createCountryCode('GH')]: {
        primary: 'paystack',
        methods: ['mtn_mobile_money', 'airteltigo_money', 'vodafone_cash', 'paystack', 'bank_transfer'],
        currencies: [createCurrencyCode('GHS')]
      }
    },
    globalSettings: {
      timeout: Number(getEnvVar('VITE_PAYMENT_TIMEOUT', '60000')) || 60000,
      retryAttempts: Number(getEnvVar('VITE_PAYMENT_RETRY', '3')) || 3,
      webhookSecret: getEnvVar('VITE_PAYMENT_WEBHOOK_SECRET', '')
    }
  },
  ui: {
    theme: {
      defaultTheme: 'light',
      supportedThemes: ['light', 'dark', 'system']
    },
    pagination: {
      defaultPageSize: centralizedBusinessRulesEngine.getUserRules().maxLoginAttempts || 20,
      maxPageSize: 100,
      pageSizeOptions: [10, 20, 50, 100]
    },
    performance: {
      searchDebounceMs: 300,
      toastDuration: 5000,
      animationDuration: 200
    },
    responsive: {
      breakpoints: {
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
        '2xl': 1536
      },
      mobileFirst: true
    }
  },
  upload: {
    limits: {
      maxImageSize: centralizedBusinessRulesEngine.getFileUploadRules().maxImageSizeMB * 1024 * 1024,
      maxVideoSize: centralizedBusinessRulesEngine.getFileUploadRules().maxVideoSizeMB * 1024 * 1024,
      maxDocumentSize: 10 * 1024 * 1024 // 10MB
    },
    allowedTypes: {
      images: centralizedBusinessRulesEngine.getFileUploadRules().allowedImageTypes,
      videos: centralizedBusinessRulesEngine.getFileUploadRules().allowedVideoTypes,
      documents: centralizedBusinessRulesEngine.getFileUploadRules().allowedDocumentTypes
    },
    processing: {
      compressionQuality: 0.8,
      thumbnailSizes: [150, 300, 600]
    }
  },
  security: {
    authentication: {
      sessionTimeout: centralizedBusinessRulesEngine.getUserRules().sessionTimeoutMinutes * 60 * 1000,
      anonymousTimeLimit: centralizedBusinessRulesEngine.getUserRules().anonymousTimeLimitMinutes * 60,
      maxLoginAttempts: centralizedBusinessRulesEngine.getUserRules().maxLoginAttempts,
      mfaRequired: ['supreme_admin', 'country_admin']
    },
    encryption: {
      algorithm: 'AES-256-GCM',
      keyRotationDays: 90
    },
    audit: {
      retentionDays: 2555, // 7 years
      sensitiveActions: ['user.delete', 'property.approve', 'payment.process', 'settings.change']
    }
  },
  features: {
    global: {
      paymentEnabled: getEnvVar('VITE_PAYMENT_ENABLED', 'true') !== 'false',
      uploadEnabled: getEnvVar('VITE_UPLOAD_ENABLED', 'true') !== 'false',
      notificationsEnabled: getEnvVar('VITE_NOTIFICATIONS_ENABLED', 'false') === 'true',
      analyticsEnabled: getEnvVar('VITE_ANALYTICS_ENABLED', 'false') === 'true',
      maintenanceMode: getEnvVar('VITE_MAINTENANCE_MODE', 'false') === 'true'
    },
    byCountry: {
      [createCountryCode('GH')]: {
        mobileMoneyEnabled: true,
        localLanguageSupport: true, // Twi, Ga, Ewe support
        campusVerificationRequired: true,
        ghanaSpecificFeatures: true
      }
    },
    byRole: {
      supreme_admin: {
        globalAnalytics: true,
        systemConfiguration: true,
        countryManagement: true
      },
      country_admin: {
        countryAnalytics: true,
        campusManagement: true,
        localCompliance: true
      },
      campus_admin: {
        campusAnalytics: true,
        propertyApproval: true,
        studentVerification: true
      }
    }
  },
  countries: {
    [createCountryCode('GH')]: GHANA_CONFIG
  },
  portals: {
    admin: {
      roles: {
        supreme: SUPREME_ADMIN_ROLE,
        country: COUNTRY_ADMIN_ROLE,
        campus: CAMPUS_ADMIN_ROLE
      },
      features: ['dashboard', 'analytics', 'user_management', 'settings'],
      analytics: ['revenue', 'growth', 'performance', 'compliance']
    },
    owner: {
      features: ['property_management', 'booking_overview', 'analytics', 'payments'],
      propertyLimits: {
        maxProperties: 50,
        maxImagesPerProperty: centralizedBusinessRulesEngine.getPropertyRules().maxImagesPerProperty,
        maxVideosPerProperty: centralizedBusinessRulesEngine.getPropertyRules().maxVideosPerProperty
      }
    },
    student: {
      features: ['property_search', 'booking_management', 'payments', 'support'],
      bookingLimits: {
        maxActiveBookings: 1,
        maxBookingAdvanceDays: centralizedBusinessRulesEngine.getBookingRules().maxBookingAdvanceDays
      }
    }
  },
  api: {
    endpoints: {
      supabase: getEnvVar('VITE_SUPABASE_URL', ''),
      paystackGhana: 'https://api.paystack.co',
      paystackNigeria: 'https://api.paystack.co',
      mpesaKenya: 'https://sandbox.safaricom.co.ke',
      webhooks: getEnvVar('VITE_WEBHOOK_BASE_URL', '')
    },
    versions: {
      current: 'v2',
      supported: ['v1', 'v2']
    },
    rateLimit: {
      requests: 1000,
      windowMs: 15 * 60 * 1000 // 15 minutes
    }
  }
} as const;

// ============================================================================
// UNIFIED CONFIGURATION ENGINE
// ============================================================================

class UnifiedConfigurationEngine {
  private readonly config: UnifiedConfiguration;

  constructor() {
    this.config = UNIFIED_CONFIGURATION;
    this.validateConfiguration();
    enhancedLogger.info('Unified Configuration Engine initialized', {
      version: this.config.app.version,
      environment: this.config.app.environment,
      supportedCountries: this.config.app.supportedCountries,
      defaultCountry: this.config.app.defaultCountry
    });
  }

  /**
   * Get configuration for specific country
   */
  getCountryConfig(countryCode: CountryCode): CountryConfiguration {
    const country = this.config.countries[countryCode];
    if (!country) {
      throw new Error(`Unsupported country: ${countryCode}`);
    }
    return country;
  }

  /**
   * Get admin role configuration
   */
  getAdminRoleConfig(roleType: string): AdminRoleConfiguration {
    const role = this.config.portals.admin.roles[roleType];
    if (!role) {
      throw new Error(`Unknown admin role: ${roleType}`);
    }
    return role;
  }

  /**
   * Get payment configuration for country
   */
  getPaymentConfig(countryCode: CountryCode) {
    const paymentConfig = this.config.payment.providers[countryCode];
    if (!paymentConfig) {
      throw new Error(`No payment configuration for country: ${countryCode}`);
    }
    return {
      ...paymentConfig,
      globalSettings: this.config.payment.globalSettings
    };
  }

  /**
   * Get feature flags for role and country
   */
  getFeatureFlags(roleType?: string, countryCode?: CountryCode) {
    const global = this.config.features.global;
    const byRole = roleType ? this.config.features.byRole[roleType] || {} : {};
    const byCountry = countryCode ? this.config.features.byCountry[countryCode] || {} : {};

    return {
      ...global,
      ...byCountry,
      ...byRole
    };
  }

  /**
   * Get UI configuration
   */
  getUIConfig() {
    return this.config.ui;
  }

  /**
   * Get all configuration
   */
  getAllConfig(): UnifiedConfiguration {
    return { ...this.config };
  }

  /**
   * Validate configuration integrity
   */
  private validateConfiguration(): void {
    // Validate required environment variables
    const requiredVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
    const missing = requiredVars.filter(key => !getEnvVar(key));

    if (missing.length > 0 && this.config.app.environment === 'production') {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    // Validate country configurations
    for (const [code, country] of Object.entries(this.config.countries)) {
      if (country.code !== code) {
        throw new Error(`Country code mismatch: ${code} !== ${country.code}`);
      }
    }

    enhancedLogger.info('Unified configuration validated successfully');
  }

  /**
   * Get configuration metadata
   */
  getConfigurationInfo() {
    return {
      version: this.config.app.version,
      environment: this.config.app.environment,
      supportedCountries: this.config.app.supportedCountries,
      lastValidated: new Date().toISOString()
    };
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const unifiedConfigurationEngine = new UnifiedConfigurationEngine();

// Export types for external use
export type {
  CountryCode,
  CurrencyCode,
  LanguageCode,
  EnvironmentType,
  CountryConfiguration,
  AdminRoleConfiguration,
  PortalConfiguration,
  UnifiedConfiguration
};

export {
  createCountryCode,
  createCurrencyCode,
  createLanguageCode
};

// Export configuration for read-only access
export const UNIFIED_CONFIG = UNIFIED_CONFIGURATION;
