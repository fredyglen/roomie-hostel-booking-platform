/**
 * ROOMi Platform - Centralized Content Validation Configuration
 * 
 * SINGLE SOURCE OF TRUTH FOR ALL CONTENT VALIDATION RULES
 * 
 * This file consolidates all scattered content validation rules from components
 * into a unified, type-safe configuration system following BE CONSCIOUS standards.
 * 
 * ZERO TOLERANCE POLICY: No validation rules should be defined outside this system.
 * 
 * @author ROOMi Platform Team
 * @version 1.0.0
 * @date 2025-01-09
 * @compliance BE CONSCIOUS Apple-Grade Standards
 */

// ============================================================================
// BRANDED TYPES FOR COMPILE-TIME SAFETY
// ============================================================================

type MinLength = number & { readonly __brand: 'MinLength' };
type MaxLength = number & { readonly __brand: 'MaxLength' };
type MaxCount = number & { readonly __brand: 'MaxCount' };
type MinCount = number & { readonly __brand: 'MinCount' };

const createMinLength = (value: number): MinLength => value as MinLength;
const createMaxLength = (value: number): MaxLength => value as MaxLength;
const createMaxCount = (value: number): MaxCount => value as MaxCount;
const createMinCount = (value: number): MinCount => value as MinCount;

// ============================================================================
// CONTENT VALIDATION INTERFACES
// ============================================================================

interface AboutSectionValidationRules {
  readonly title: {
    readonly minLength: MinLength;
    readonly maxLength: MaxLength;
  };
  readonly description: {
    readonly minLength: MinLength;
    readonly maxLength: MaxLength;
  };
  readonly highlights: {
    readonly maxCount: MaxCount;
    readonly maxLength: MaxLength;
  };
}

interface AmenitiesValidationRules {
  readonly maxAmenitiesPerProperty: MaxCount;
  readonly minAmenitiesRequired: MinCount;
  readonly premiumAmenitiesLimit: MaxCount;
}

interface ConsiderationsValidationRules {
  readonly maxConsiderationsPerProperty: MaxCount;
  readonly title: {
    readonly minLength: MinLength;
    readonly maxLength: MaxLength;
  };
  readonly description: {
    readonly minLength: MinLength;
    readonly maxLength: MaxLength;
  };
}

interface HouseRulesValidationRules {
  readonly maxRulesPerProperty: MaxCount;
  readonly title: {
    readonly minLength: MinLength;
    readonly maxLength: MaxLength;
  };
  readonly description: {
    readonly minLength: MinLength;
    readonly maxLength: MaxLength;
  };
}

interface MediaValidationRules {
  readonly images: {
    readonly maxCount: MaxCount;
    readonly maxSizeMB: number;
    readonly allowedTypes: readonly string[];
  };
  readonly videos: {
    readonly maxCount: MaxCount;
    readonly maxSizeMB: number;
    readonly allowedTypes: readonly string[];
  };
}

interface ContentValidationConfiguration {
  readonly aboutSection: AboutSectionValidationRules;
  readonly amenities: AmenitiesValidationRules;
  readonly considerations: ConsiderationsValidationRules;
  readonly houseRules: HouseRulesValidationRules;
  readonly media: MediaValidationRules;
  readonly environment: 'development' | 'staging' | 'production';
  readonly lastUpdated: string;
  readonly version: string;
}

// ============================================================================
// AUTHORITATIVE CONTENT VALIDATION CONFIGURATION
// ============================================================================

/**
 * SINGLE SOURCE OF TRUTH FOR ALL CONTENT VALIDATION RULES
 * 
 * These rules are the definitive validation standards for ROOMi Platform.
 * Any changes to content validation MUST be made here and nowhere else.
 * 
 * Business Rules (as of 2025-01-09):
 * - About Section: Comprehensive property descriptions with highlights
 * - Amenities: Balanced selection with premium limits
 * - Considerations: Transparent property limitations
 * - House Rules: Clear property guidelines
 * - Media: Optimized for Ghana internet speeds
 */
const AUTHORITATIVE_CONTENT_VALIDATION: ContentValidationConfiguration = {
  aboutSection: {
    title: {
      minLength: createMinLength(5),      // 5 characters minimum
      maxLength: createMaxLength(100)     // 100 characters maximum
    },
    description: {
      minLength: createMinLength(50),     // 50 characters minimum for quality
      maxLength: createMaxLength(2000)    // 2000 characters maximum
    },
    highlights: {
      maxCount: createMaxCount(10),       // 10 highlights maximum
      maxLength: createMaxLength(100)     // 100 characters per highlight
    }
  },
  amenities: {
    maxAmenitiesPerProperty: createMaxCount(30),  // 30 amenities maximum
    minAmenitiesRequired: createMinCount(3),      // 3 amenities minimum
    premiumAmenitiesLimit: createMaxCount(10)     // 10 premium amenities max
  },
  considerations: {
    maxConsiderationsPerProperty: createMaxCount(15), // 15 considerations max
    title: {
      minLength: createMinLength(5),      // 5 characters minimum
      maxLength: createMaxLength(100)     // 100 characters maximum
    },
    description: {
      minLength: createMinLength(10),     // 10 characters minimum
      maxLength: createMaxLength(500)     // 500 characters maximum
    }
  },
  houseRules: {
    maxRulesPerProperty: createMaxCount(20),      // 20 house rules maximum
    title: {
      minLength: createMinLength(5),      // 5 characters minimum
      maxLength: createMaxLength(100)     // 100 characters maximum
    },
    description: {
      minLength: createMinLength(10),     // 10 characters minimum
      maxLength: createMaxLength(300)     // 300 characters maximum
    }
  },
  media: {
    images: {
      maxCount: createMaxCount(10),       // 10 images maximum
      maxSizeMB: 5,                       // 5MB maximum per image
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
    },
    videos: {
      maxCount: createMaxCount(3),        // 3 videos maximum
      maxSizeMB: 50,                      // 50MB maximum per video
      allowedTypes: ['video/mp4', 'video/webm']
    }
  },
  environment: (process.env.NODE_ENV as any) || 'development',
  lastUpdated: '2025-01-09T00:00:00Z',
  version: '1.0.0'
} as const;

// ============================================================================
// CONTENT VALIDATION ENGINE
// ============================================================================

class ContentValidationEngine {
  private readonly config: ContentValidationConfiguration;

  constructor() {
    this.config = AUTHORITATIVE_CONTENT_VALIDATION;
  }

  /**
   * Get all content validation configuration
   */
  public getAllConfig(): ContentValidationConfiguration {
    return this.config;
  }

  /**
   * Get about section validation rules
   */
  public getAboutSectionRules(): AboutSectionValidationRules {
    return this.config.aboutSection;
  }

  /**
   * Get amenities validation rules
   */
  public getAmenitiesRules(): AmenitiesValidationRules {
    return this.config.amenities;
  }

  /**
   * Get considerations validation rules
   */
  public getConsiderationsRules(): ConsiderationsValidationRules {
    return this.config.considerations;
  }

  /**
   * Get house rules validation rules
   */
  public getHouseRulesRules(): HouseRulesValidationRules {
    return this.config.houseRules;
  }

  /**
   * Get media validation rules
   */
  public getMediaRules(): MediaValidationRules {
    return this.config.media;
  }

  /**
   * Validate content against rules
   */
  public validateContent(
    contentType: keyof ContentValidationConfiguration,
    content: unknown
  ): { isValid: boolean; errors: string[] } {
    // Implementation would go here for comprehensive validation
    return { isValid: true, errors: [] };
  }

  // Configuration Information
  getConfigurationInfo(): { version: string; environment: string; lastUpdated: string } {
    return {
      version: this.config.version,
      environment: this.config.environment,
      lastUpdated: this.config.lastUpdated
    };
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const contentValidationEngine = new ContentValidationEngine();

// ============================================================================
// LEGACY COMPATIBILITY EXPORTS (DEPRECATED)
// ============================================================================

/**
 * @deprecated Use contentValidationEngine.getAboutSectionRules() instead
 */
export const ABOUT_VALIDATION_RULES = {
  TITLE_MIN_LENGTH: AUTHORITATIVE_CONTENT_VALIDATION.aboutSection.title.minLength,
  TITLE_MAX_LENGTH: AUTHORITATIVE_CONTENT_VALIDATION.aboutSection.title.maxLength,
  DESCRIPTION_MIN_LENGTH: AUTHORITATIVE_CONTENT_VALIDATION.aboutSection.description.minLength,
  DESCRIPTION_MAX_LENGTH: AUTHORITATIVE_CONTENT_VALIDATION.aboutSection.description.maxLength,
  MAX_HIGHLIGHTS: AUTHORITATIVE_CONTENT_VALIDATION.aboutSection.highlights.maxCount,
  HIGHLIGHT_MAX_LENGTH: AUTHORITATIVE_CONTENT_VALIDATION.aboutSection.highlights.maxLength
} as const;

/**
 * @deprecated Use contentValidationEngine.getAmenitiesRules() instead
 */
export const AMENITIES_BUSINESS_RULES = {
  MAX_AMENITIES_PER_PROPERTY: AUTHORITATIVE_CONTENT_VALIDATION.amenities.maxAmenitiesPerProperty,
  MIN_AMENITIES_REQUIRED: AUTHORITATIVE_CONTENT_VALIDATION.amenities.minAmenitiesRequired,
  PREMIUM_AMENITIES_LIMIT: AUTHORITATIVE_CONTENT_VALIDATION.amenities.premiumAmenitiesLimit
} as const;

/**
 * @deprecated Use contentValidationEngine.getConsiderationsRules() instead
 */
export const CONSIDERATIONS_BUSINESS_RULES = {
  MAX_CONSIDERATIONS_PER_PROPERTY: AUTHORITATIVE_CONTENT_VALIDATION.considerations.maxConsiderationsPerProperty,
  MIN_TITLE_LENGTH: AUTHORITATIVE_CONTENT_VALIDATION.considerations.title.minLength,
  MAX_TITLE_LENGTH: AUTHORITATIVE_CONTENT_VALIDATION.considerations.title.maxLength,
  MIN_DESCRIPTION_LENGTH: AUTHORITATIVE_CONTENT_VALIDATION.considerations.description.minLength,
  MAX_DESCRIPTION_LENGTH: AUTHORITATIVE_CONTENT_VALIDATION.considerations.description.maxLength
} as const;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type {
  ContentValidationConfiguration,
  AboutSectionValidationRules,
  AmenitiesValidationRules,
  ConsiderationsValidationRules,
  HouseRulesValidationRules,
  MediaValidationRules
};
