/**
 * @deprecated Use unifiedConfigurationEngine for image configuration
 *
 * MIGRATION COMPLETED: Image URLs now managed through unified configuration system
 * This object is maintained for backward compatibility only.
 *
 * @version 2.0.0 (Unified International System)
 */

export const IMAGE_URLS = {
  // ⚠️ Deprecated: kept only so legacy imports don't crash.
  // ROOMie rule: do NOT use these in new code. All fallbacks must use local /placeholder.svg.
  DEFAULT: '/placeholder.svg',
  PLACEHOLDER: '/placeholder.svg',
  SAMPLE_1: '/placeholder.svg',
  SAMPLE_2: '/placeholder.svg',
  SAMPLE_3: '/placeholder.svg',
  SAMPLE_4: '/placeholder.svg',
  SAMPLE_5: '/placeholder.svg',
};