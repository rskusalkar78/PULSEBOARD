import { APP_CONFIG } from '@/constants';

export * from './authService';

export const apiService = {
  getBaseUrl(): string {
    return APP_CONFIG.apiBaseUrl;
  },
};
