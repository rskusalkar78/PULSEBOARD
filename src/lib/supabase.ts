/**
 * Supabase Client Configuration
 * Secure, type-safe Supabase client initialization
 *
 * SECURITY NOTES:
 * - Only uses anon key (safe for frontend)
 * - RLS policies enforce data access control
 * - Never expose service_role key in frontend code
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

// =====================================================
// ENVIRONMENT VALIDATION
// =====================================================

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file.\n' +
      'Required: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'
  );
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch {
  throw new Error(
    `Invalid VITE_SUPABASE_URL: "${supabaseUrl}". Must be a valid URL.`
  );
}

// =====================================================
// CLIENT CONFIGURATION
// =====================================================

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Enable automatic token refresh
    autoRefreshToken: true,
    // Persist session in localStorage
    persistSession: true,
    // Detect session from URL (for magic links, OAuth)
    detectSessionInUrl: true,
    // Storage key for session
    storageKey: 'pulseboard-auth',
    // Use localStorage for session storage
    storage: window.localStorage,
    // Flow type for OAuth
    flowType: 'pkce',
  },
  db: {
    // Use public schema by default
    schema: 'public',
  },
  global: {
    headers: {
      'x-application-name': 'pulseboard',
    },
  },
  realtime: {
    // Realtime configuration (can be enabled per subscription)
    params: {
      eventsPerSecond: 10,
    },
  },
});

// =====================================================
// HELPER FUNCTIONS
// =====================================================

/**
 * Get the current authenticated user
 * @returns User object or null if not authenticated
 */
export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error('Error getting current user:', error);
    return null;
  }

  return user;
}

/**
 * Get the current session
 * @returns Session object or null if not authenticated
 */
export async function getSession() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error('Error getting session:', error);
    return null;
  }

  return session;
}

/**
 * Check if user is authenticated
 * @returns Boolean indicating authentication status
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session;
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

/**
 * Subscribe to auth state changes
 * @param callback Function to call when auth state changes
 * @returns Unsubscribe function
 */
export function onAuthStateChange(
  callback: (event: string, session: unknown) => void
) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(callback);

  // Return unsubscribe function
  return () => {
    subscription.unsubscribe();
  };
}

// =====================================================
// TYPE-SAFE TABLE HELPERS
// =====================================================

/**
 * Get a type-safe reference to a table
 * Usage: const profiles = getTable('profiles')
 */
export function getTable<T extends keyof Database['public']['Tables']>(
  tableName: T
) {
  return supabase.from(tableName);
}

/**
 * Call a database function with type safety
 * Usage: const result = await callFunction('get_user_teams', { user_uuid: '...' })
 */
export async function callFunction<
  T extends keyof Database['public']['Functions'],
>(functionName: T, args: Database['public']['Functions'][T]['Args']) {
  return supabase.rpc(functionName, args);
}

// =====================================================
// ERROR HANDLING HELPERS
// =====================================================

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: unknown): boolean {
  if (typeof error === 'object' && error !== null && 'status' in error) {
    return (error as { status?: number }).status === 401;
  }
  return false;
}

/**
 * Check if error is a permission error (RLS)
 */
export function isPermissionError(error: unknown): boolean {
  if (typeof error === 'object' && error !== null) {
    const err = error as { code?: string; message?: string };
    return (
      err.code === '42501' || // Insufficient privilege
      err.code === 'PGRST301' || // RLS policy violation
      err.message?.includes('permission denied') ||
      err.message?.includes('policy')
    );
  }
  return false;
}

/**
 * Check if error is a not found error
 */
export function isNotFoundError(error: unknown): boolean {
  if (typeof error === 'object' && error !== null) {
    const err = error as { code?: string; status?: number };
    return err.code === 'PGRST116' || err.status === 404;
  }
  return false;
}

/**
 * Format Supabase error for display
 */
export function formatSupabaseError(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const err = error as { message: string; hint?: string };
    let message = err.message;

    // Add hint if available
    if (err.hint) {
      message += ` (${err.hint})`;
    }

    // Make error messages more user-friendly
    if (isAuthError(error)) {
      return 'Authentication required. Please sign in.';
    }
    if (isPermissionError(error)) {
      return 'You do not have permission to perform this action.';
    }
    if (isNotFoundError(error)) {
      return 'The requested resource was not found.';
    }

    return message;
  }

  return 'An unexpected error occurred.';
}

// =====================================================
// DEVELOPMENT HELPERS
// =====================================================

if (import.meta.env.DEV) {
  // Log Supabase client initialization in development
  console.log('[Supabase] Client initialized', {
    url: supabaseUrl,
    anonKeyPrefix: supabaseAnonKey.substring(0, 20) + '...',
  });

  // Expose supabase client to window for debugging
  if (typeof window !== 'undefined') {
    (window as unknown as { supabase: typeof supabase }).supabase = supabase;
    console.log('[Supabase] Client available as window.supabase');
  }
}

// Export default client
export default supabase;
