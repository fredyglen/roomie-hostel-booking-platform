/**
 * @deprecated Use unifiedConfigurationEngine.getAllConfig().api instead
 *
 * MIGRATION COMPLETED: All API endpoints now come from unified configuration system
 * This object is maintained for backward compatibility only.
 */
import { unifiedConfigurationEngine } from '@/config/unified-configuration.config';

export const API_ENDPOINTS = {
  // ✅ UNIFIED CONFIGURATION SYSTEM - Values from single source of truth
  SUPABASE_FUNCTIONS_BASE: unifiedConfigurationEngine.getAllConfig().database.url
    ? `${unifiedConfigurationEngine.getAllConfig().database.url}/functions/v1`
    : '',
  PAYSTACK_WEBHOOK: unifiedConfigurationEngine.getAllConfig().api.endpoints.webhooks || 'https://your-project.supabase.co/functions/v1/paystack-webhook',
  // All endpoints now managed through unified configuration
};