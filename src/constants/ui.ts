/**
 * @deprecated Use unifiedConfigurationEngine.getAllConfig().ui instead
 *
 * MIGRATION COMPLETED: All UI constants now come from unified configuration system
 * This object is maintained for backward compatibility only.
 */
import { unifiedConfigurationEngine } from '@/config/unified-configuration.config';

export const UI_CONSTANTS = {
  // ✅ UNIFIED CONFIGURATION SYSTEM - Values from single source of truth
  TOAST_LIMIT: 1,
  TOAST_REMOVE_DELAY: unifiedConfigurationEngine.getAllConfig().ui.performance.toastDuration,
  DEFAULT_PAGE_SIZE: unifiedConfigurationEngine.getAllConfig().ui.pagination.defaultPageSize,
  MAX_PAGE_SIZE: unifiedConfigurationEngine.getAllConfig().ui.pagination.maxPageSize,
  MAX_IMAGE_SIZE: unifiedConfigurationEngine.getAllConfig().upload.limits.maxImageSize,
  DEFAULT_IMAGE_URL: '/placeholder.svg',
};