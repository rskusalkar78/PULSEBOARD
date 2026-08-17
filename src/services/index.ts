import { APP_CONFIG } from '@/constants';

export const apiService = {
  getBaseUrl(): string {
    return APP_CONFIG.apiBaseUrl;
  },
};
