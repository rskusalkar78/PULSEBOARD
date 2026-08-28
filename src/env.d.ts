/// <reference types="vite/client" />

/**
 * Environment Variable Type Definitions
 * Provides TypeScript autocomplete and type checking for environment variables
 */

interface ImportMetaEnv {
  // Application
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_ENV: 'development' | 'staging' | 'production';
  readonly VITE_APP_VERSION: string;

  // API
  readonly VITE_API_BASE_URL: string;

  // Supabase
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;

  // Feature Flags
  readonly VITE_ENABLE_ANALYTICS: string;
  readonly VITE_ENABLE_REALTIME: string;
  readonly VITE_ENABLE_DEBUG: string;

  // Optional: Third-party integrations
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_GOOGLE_ANALYTICS_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
