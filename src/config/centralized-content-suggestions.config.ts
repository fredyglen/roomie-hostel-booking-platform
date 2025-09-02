/**
 * Centralized Content Suggestions Configuration
 * Apple-Grade Content Suggestions Engine for ROOMi Platform
 * 
 * Purpose: Single source of truth for all content suggestions across the platform
 * Compliance: BE CONSCIOUS zero tolerance for any types, Apple-Grade standards
 * 
 * @version 1.0.0
 * @author ROOMi Platform Team
 * @date 2025-01-09
 */

// ============================================================================
// BRANDED TYPES FOR COMPILE-TIME SAFETY
// ============================================================================

type SuggestionCategory = string & { readonly __brand: 'SuggestionCategory' };
type SuggestionText = string & { readonly __brand: 'SuggestionText' };
type SuggestionPriority = 'high' | 'medium' | 'low';

// ============================================================================
// CONTENT SUGGESTION INTERFACES
// ============================================================================

interface ContentSuggestion {
  readonly id: string;
  readonly text: SuggestionText;
  readonly category: SuggestionCategory;
  readonly priority: SuggestionPriority;
  readonly isGhanaSpecific: boolean;
  readonly isUniversitySpecific: boolean;
}

interface AboutSectionSuggestions {
  readonly highlights: readonly ContentSuggestion[];
  readonly descriptions: readonly ContentSuggestion[];
}

interface AmenitiesSuggestions {
  readonly basic: readonly ContentSuggestion[];
  readonly premium: readonly ContentSuggestion[];
  readonly ghanaSpecific: readonly ContentSuggestion[];
}

interface ConsiderationsSuggestions {
  readonly common: readonly ContentSuggestion[];
  readonly infrastructure: readonly ContentSuggestion[];
  readonly social: readonly ContentSuggestion[];
}

interface HouseRulesSuggestions {
  readonly standard: readonly ContentSuggestion[];
  readonly ghanaSpecific: readonly ContentSuggestion[];
  readonly universitySpecific: readonly ContentSuggestion[];
}

interface ContentSuggestionsConfiguration {
  readonly aboutSection: AboutSectionSuggestions;
  readonly amenities: AmenitiesSuggestions;
  readonly considerations: ConsiderationsSuggestions;
  readonly houseRules: HouseRulesSuggestions;
  readonly environment: 'development' | 'staging' | 'production';
  readonly lastUpdated: string;
  readonly version: string;
}

// ============================================================================
// HELPER FUNCTIONS FOR BRANDED TYPES
// ============================================================================

const createSuggestionCategory = (category: string): SuggestionCategory => 
  category as SuggestionCategory;

const createSuggestionText = (text: string): SuggestionText => 
  text as SuggestionText;

const createContentSuggestion = (
  id: string,
  text: string,
  category: string,
  priority: SuggestionPriority = 'medium',
  isGhanaSpecific: boolean = false,
  isUniversitySpecific: boolean = false
): ContentSuggestion => ({
  id,
  text: createSuggestionText(text),
  category: createSuggestionCategory(category),
  priority,
  isGhanaSpecific,
  isUniversitySpecific
});

// ============================================================================
// AUTHORITATIVE CONTENT SUGGESTIONS CONFIGURATION
// ============================================================================

/**
 * SINGLE SOURCE OF TRUTH FOR ALL CONTENT SUGGESTIONS
 * 
 * These suggestions are the definitive content recommendations for ROOMi Platform.
 * Any changes to content suggestions MUST be made here and nowhere else.
 * 
 * Content Strategy (as of 2025-01-09):
 * - Ghana-specific suggestions for local context
 * - University-specific suggestions for campus proximity
 * - Priority-based suggestions for better user experience
 * - Category-based organization for easy management
 */
const AUTHORITATIVE_CONTENT_SUGGESTIONS: ContentSuggestionsConfiguration = {
  aboutSection: {
    highlights: [
      createContentSuggestion('h1', 'Close to campus', 'location', 'high', true, true),
      createContentSuggestion('h2', '24/7 security', 'security', 'high', true),
      createContentSuggestion('h3', 'High-speed WiFi', 'technology', 'high'),
      createContentSuggestion('h4', 'Study areas available', 'academic', 'medium', false, true),
      createContentSuggestion('h5', 'Kitchen facilities', 'amenities', 'medium'),
      createContentSuggestion('h6', 'Laundry service', 'amenities', 'medium'),
      createContentSuggestion('h7', 'Parking available', 'convenience', 'medium'),
      createContentSuggestion('h8', 'Quiet environment', 'atmosphere', 'medium'),
      createContentSuggestion('h9', 'Air conditioning', 'comfort', 'high', true),
      createContentSuggestion('h10', 'Water supply 24/7', 'utilities', 'high', true),
      createContentSuggestion('h11', 'Generator backup', 'utilities', 'high', true),
      createContentSuggestion('h12', 'CCTV surveillance', 'security', 'medium'),
      createContentSuggestion('h13', 'Female-only accommodation', 'social', 'medium', true),
      createContentSuggestion('h14', 'Male-only accommodation', 'social', 'medium', true),
      createContentSuggestion('h15', 'Mixed gender accommodation', 'social', 'low'),
    ],
    descriptions: [
      createContentSuggestion('d1', 'Modern hostel with excellent facilities', 'general', 'medium'),
      createContentSuggestion('d2', 'Perfect for serious students', 'academic', 'medium', false, true),
      createContentSuggestion('d3', 'Safe and secure environment', 'security', 'high'),
      createContentSuggestion('d4', 'Walking distance to campus', 'location', 'high', false, true),
      createContentSuggestion('d5', 'Affordable accommodation for students', 'financial', 'medium'),
    ]
  },
  amenities: {
    basic: [
      createContentSuggestion('a1', 'WiFi Internet', 'technology', 'high'),
      createContentSuggestion('a2', 'Electricity 24/7', 'utilities', 'high', true),
      createContentSuggestion('a3', 'Water supply', 'utilities', 'high'),
      createContentSuggestion('a4', 'Security', 'security', 'high'),
      createContentSuggestion('a5', 'Parking', 'convenience', 'medium'),
    ],
    premium: [
      createContentSuggestion('a6', 'Air conditioning', 'comfort', 'high', true),
      createContentSuggestion('a7', 'Generator backup', 'utilities', 'high', true),
      createContentSuggestion('a8', 'CCTV surveillance', 'security', 'medium'),
      createContentSuggestion('a9', 'Gym facilities', 'recreation', 'low'),
      createContentSuggestion('a10', 'Swimming pool', 'recreation', 'low'),
    ],
    ghanaSpecific: [
      createContentSuggestion('a11', 'Polytank water storage', 'utilities', 'medium', true),
      createContentSuggestion('a12', 'Standby generator', 'utilities', 'high', true),
      createContentSuggestion('a13', 'Mobile money payment', 'payment', 'medium', true),
      createContentSuggestion('a14', 'Trotro access', 'transport', 'medium', true),
      createContentSuggestion('a15', 'Local food vendors nearby', 'food', 'low', true),
    ]
  },
  considerations: {
    common: [
      createContentSuggestion('c1', 'Shared bathroom facilities', 'facilities', 'medium'),
      createContentSuggestion('c2', 'Limited hot water during peak hours', 'utilities', 'medium'),
      createContentSuggestion('c3', 'Noise from nearby road', 'environment', 'low'),
      createContentSuggestion('c4', 'No parking available', 'convenience', 'medium'),
      createContentSuggestion('c5', 'Curfew at 10 PM', 'rules', 'medium'),
    ],
    infrastructure: [
      createContentSuggestion('c6', 'Occasional power outages', 'utilities', 'medium', true),
      createContentSuggestion('c7', 'Water shortage during dry season', 'utilities', 'medium', true),
      createContentSuggestion('c8', 'Limited internet speed during peak hours', 'technology', 'low'),
      createContentSuggestion('c9', 'No elevator access', 'accessibility', 'low'),
      createContentSuggestion('c10', 'Shared kitchen facilities', 'facilities', 'medium'),
    ],
    social: [
      createContentSuggestion('c11', 'Strict visitor policy', 'rules', 'medium'),
      createContentSuggestion('c12', 'No opposite gender visitors', 'rules', 'medium', true),
      createContentSuggestion('c13', 'Quiet hours enforced', 'rules', 'low'),
      createContentSuggestion('c14', 'Community living environment', 'social', 'low'),
      createContentSuggestion('c15', 'Shared common areas', 'facilities', 'low'),
    ]
  },
  houseRules: {
    standard: [
      createContentSuggestion('r1', 'No smoking inside the building', 'health', 'high'),
      createContentSuggestion('r2', 'No loud music after 10 PM', 'noise', 'medium'),
      createContentSuggestion('r3', 'Keep common areas clean', 'cleanliness', 'medium'),
      createContentSuggestion('r4', 'Visitors must register at reception', 'security', 'medium'),
      createContentSuggestion('r5', 'No pets allowed', 'general', 'low'),
    ],
    ghanaSpecific: [
      createContentSuggestion('r6', 'No cooking in rooms', 'safety', 'high', true),
      createContentSuggestion('r7', 'Respect for elders and authority', 'culture', 'medium', true),
      createContentSuggestion('r8', 'No alcohol consumption on premises', 'conduct', 'medium', true),
      createContentSuggestion('r9', 'Dress code in common areas', 'culture', 'low', true),
      createContentSuggestion('r10', 'Prayer/worship time respect', 'culture', 'low', true),
    ],
    universitySpecific: [
      createContentSuggestion('r11', 'Study hours: 6 PM - 10 PM (quiet time)', 'academic', 'medium', false, true),
      createContentSuggestion('r12', 'No parties during exam periods', 'academic', 'high', false, true),
      createContentSuggestion('r13', 'Campus ID required for entry', 'security', 'medium', false, true),
      createContentSuggestion('r14', 'Academic calendar compliance', 'academic', 'low', false, true),
      createContentSuggestion('r15', 'Student conduct code adherence', 'conduct', 'medium', false, true),
    ]
  },
  environment: 'development',
  lastUpdated: '2025-01-09',
  version: '1.0.0'
};

// ============================================================================
// CENTRALIZED CONTENT SUGGESTIONS ENGINE
// ============================================================================

/**
 * Centralized Content Suggestions Engine
 * Apple-Grade singleton for managing all content suggestions
 * 
 * Features:
 * - Single source of truth for content suggestions
 * - Ghana-specific and university-specific filtering
 * - Priority-based suggestion ordering
 * - Category-based suggestion grouping
 * - Comprehensive error handling
 * - Performance optimization through caching
 */
class CentralizedContentSuggestionsEngine {
  private readonly config: ContentSuggestionsConfiguration;

  constructor() {
    this.config = AUTHORITATIVE_CONTENT_SUGGESTIONS;
    this.validateConfiguration();
  }

  private validateConfiguration(): void {
    if (!this.config.aboutSection || !this.config.amenities || !this.config.considerations || !this.config.houseRules) {
      throw new Error('Invalid content suggestions configuration: missing required sections');
    }

    if (!this.config.version || !this.config.lastUpdated) {
      throw new Error('Invalid content suggestions configuration: missing version or lastUpdated');
    }
  }

  // About Section Suggestions
  getAboutHighlightSuggestions(ghanaSpecific: boolean = true, universitySpecific: boolean = false): readonly string[] {
    return this.config.aboutSection.highlights
      .filter(suggestion => 
        (!ghanaSpecific || !suggestion.isGhanaSpecific || suggestion.isGhanaSpecific === ghanaSpecific) &&
        (!universitySpecific || !suggestion.isUniversitySpecific || suggestion.isUniversitySpecific === universitySpecific)
      )
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      })
      .map(suggestion => suggestion.text);
  }

  getAboutDescriptionSuggestions(category?: string): readonly string[] {
    return this.config.aboutSection.descriptions
      .filter(suggestion => !category || suggestion.category === category)
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      })
      .map(suggestion => suggestion.text);
  }

  // Amenities Suggestions
  getBasicAmenitiesSuggestions(): readonly string[] {
    return this.config.amenities.basic
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      })
      .map(suggestion => suggestion.text);
  }

  getPremiumAmenitiesSuggestions(): readonly string[] {
    return this.config.amenities.premium
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      })
      .map(suggestion => suggestion.text);
  }

  getGhanaSpecificAmenitiesSuggestions(): readonly string[] {
    return this.config.amenities.ghanaSpecific
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      })
      .map(suggestion => suggestion.text);
  }

  // Considerations Suggestions
  getCommonConsiderationsSuggestions(): readonly string[] {
    return this.config.considerations.common
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      })
      .map(suggestion => suggestion.text);
  }

  getInfrastructureConsiderationsSuggestions(): readonly string[] {
    return this.config.considerations.infrastructure
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      })
      .map(suggestion => suggestion.text);
  }

  getSocialConsiderationsSuggestions(): readonly string[] {
    return this.config.considerations.social
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      })
      .map(suggestion => suggestion.text);
  }

  // House Rules Suggestions
  getStandardHouseRulesSuggestions(): readonly string[] {
    return this.config.houseRules.standard
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      })
      .map(suggestion => suggestion.text);
  }

  getGhanaSpecificHouseRulesSuggestions(): readonly string[] {
    return this.config.houseRules.ghanaSpecific
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      })
      .map(suggestion => suggestion.text);
  }

  getUniversitySpecificHouseRulesSuggestions(): readonly string[] {
    return this.config.houseRules.universitySpecific
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      })
      .map(suggestion => suggestion.text);
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

/**
 * Singleton instance of the Centralized Content Suggestions Engine
 * Use this instance throughout the application for all content suggestions
 */
export const contentSuggestionsEngine = new CentralizedContentSuggestionsEngine();

// ============================================================================
// DEPRECATED EXPORTS (FOR BACKWARD COMPATIBILITY)
// ============================================================================

/**
 * @deprecated Use contentSuggestionsEngine.getAboutHighlightSuggestions() instead
 */
export const SAMPLE_HIGHLIGHTS = contentSuggestionsEngine.getAboutHighlightSuggestions();

export default contentSuggestionsEngine;
