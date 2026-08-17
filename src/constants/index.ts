import type { AppConfig, Environment } from '@/types';

export const APP_CONFIG: AppConfig = {
  title: import.meta.env.VITE_APP_TITLE || 'PulseBoard',
  env: (import.meta.env.VITE_APP_ENV as Environment) || 'development',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
};
