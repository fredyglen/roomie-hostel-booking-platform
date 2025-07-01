import { uiConfig, uploadConfig } from '@/config/environment';

export const UI_CONSTANTS = {
  TOAST_LIMIT: 1,
  TOAST_REMOVE_DELAY: uiConfig.toastDuration,
  DEFAULT_PAGE_SIZE: uiConfig.itemsPerPage,
  MAX_PAGE_SIZE: 100,
  MAX_IMAGE_SIZE: uploadConfig.maxFileSize,
  DEFAULT_IMAGE_URL: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800&h=600',
};