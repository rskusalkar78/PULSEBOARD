/**
 * Application Configuration
 * Centralized configuration management with type safety and validation
 */

// =====================================================
// CONFIGURATION INTERFACE
// =====================================================

export interface AppConfig {
  app: {
    title: string;
    env: 'development' | 'staging' | 'production';
    version: string;
    isDevelopment: boolean;
    isProduction: boolean;
  };
  api: {
    baseUrl: string;
  };
  supabase: {
    url: string;
    anonKey: string;
  };
  features: {
    analytics: boolean;
    realtime: boolean;
    debug: boolean;
  };
  thirdParty: {
    sentryDsn?: string | undefined;
    googleAnalyticsId?: string | undefined;
  };
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

/**
 * Get environment variable with validation
 */
function getEnvVar(key: string, required = true): string {
  const value = import.meta.env[key];

  if (required && !value) {
    throw new Error(
      `Missing required environment variable: ${key}\n` +
        'Please check your .env file and ensure all required variables are set.'
    );
  }

  return value || '';
}

/**
 * Get boolean environment variable
 */
function getEnvBool(key: string, defaultValue = false): boolean {
  const value = import.meta.env[key];

  if (!value) {
    return defaultValue;
  }

  return value.toLowerCase() === 'true' || value === '1';
}

/**
 * Get optional environment variable
 */
function getEnvOptional(key: string): string | undefined {
  return import.meta.env[key] || undefined;
}

// =====================================================
// CONFIGURATION OBJECT
// =====================================================

export const config: AppConfig = {
  app: {
    title: getEnvVar('VITE_APP_TITLE', false) || 'PulseBoard',
    env: (getEnvVar('VITE_APP_ENV', false) as AppConfig['app']['env']) || 'development',
    version: getEnvVar('VITE_APP_VERSION', false) || '0.1.0',
    get isDevelopment() {
      return this.env === 'development';
    },
    get isProduction() {
      return this.env === 'production';
    },
  },
  api: {
    baseUrl: getEnvVar('VITE_API_BASE_URL', false) || 'http://localhost:3000/api',
  },
  supabase: {
    url: getEnvVar('VITE_SUPABASE_URL'),
    anonKey: getEnvVar('VITE_SUPABASE_ANON_KEY'),
  },
  features: {
    analytics: getEnvBool('VITE_ENABLE_ANALYTICS', true),
    realtime: getEnvBool('VITE_ENABLE_REALTIME', true),
    debug: getEnvBool('VITE_ENABLE_DEBUG', false),
  },
  thirdParty: {
    sentryDsn: getEnvOptional('VITE_SENTRY_DSN'),
    googleAnalyticsId: getEnvOptional('VITE_GOOGLE_ANALYTICS_ID'),
  },
};

// =====================================================
// VALIDATION
// =====================================================

/**
 * Validate configuration on startup
 */
export function validateConfig(): void {
  const errors: string[] = [];

  // Validate Supabase URL
  try {
    new URL(config.supabase.url);
  } catch {
    errors.push(`Invalid VITE_SUPABASE_URL: "${config.supabase.url}"`);
  }

  // Validate Supabase anon key format
  if (config.supabase.anonKey.length < 20) {
    errors.push('Invalid VITE_SUPABASE_ANON_KEY: key appears to be too short');
  }

  // Validate environment
  if (!['development', 'staging', 'production'].includes(config.app.env)) {
    errors.push(
      `Invalid VITE_APP_ENV: "${config.app.env}". Must be "development", "staging", or "production"`
    );
  }

  if (errors.length > 0) {
    throw new Error(
      'Configuration validation failed:\n' + errors.map((e) => `  - ${e}`).join('\n')
    );
  }
}

// =====================================================
// RUNTIME UTILITIES
// =====================================================

/**
 * Check if running in development mode
 */
export const isDevelopment = config.app.isDevelopment;

/**
 * Check if running in production mode
 */
export const isProduction = config.app.isProduction;

/**
 * Check if debug mode is enabled
 */
export const isDebugEnabled = config.features.debug;

/**
 * Log configuration in development
 */
if (isDevelopment && isDebugEnabled) {
  console.group('[Config] Application Configuration');
  console.log('Environment:', config.app.env);
  console.log('Version:', config.app.version);
  console.log('API Base URL:', config.api.baseUrl);
  console.log('Supabase URL:', config.supabase.url);
  console.log('Features:', config.features);
  console.groupEnd();
}

// Validate configuration on module load
try {
  validateConfig();
} catch (error) {
  console.error('[Config] Validation failed:', error);
  if (isProduction) {
    // In production, fail fast
    throw error;
  }
}

export default config;
