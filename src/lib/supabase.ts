/**
 * Supabase Client Configuration
 * Secure, type-safe Supabase client initialization
 *
 * SECURITY NOTES:
 * - Only uses anon key (safe for frontend)
 * - RLS policies enforce data access control
 * - Never expose service_role key in frontend code
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import { isSupabaseConfigured } from './supabaseConfig';

// =====================================================
// CLIENT CONFIGURATION
// =====================================================

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? '';

export const supabase: SupabaseClient<Database> | null = isSupabaseConfigured()
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storageKey: 'pulseboard-auth',
        storage: window.localStorage,
        flowType: 'pkce',
      },
      db: {
        schema: 'public',
      },
      global: {
        headers: {
          'x-application-name': 'pulseboard',
        },
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

function requireSupabase(): SupabaseClient<Database> {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Add real VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY values to .env.'
    );
  }
  return supabase;
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

/**
 * Get the current authenticated user
 * @returns User object or null if not authenticated
 */
export async function getCurrentUser() {
  const client = supabase;
  if (!client) return null;

  const {
    data: { user },
    error,
  } = await client.auth.getUser();

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
  const client = supabase;
  if (!client) return null;

  const {
    data: { session },
    error,
  } = await client.auth.getSession();

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
  const { error } = await requireSupabase().auth.signOut();

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
export function onAuthStateChange(callback: (event: string, session: unknown) => void) {
  const {
    data: { subscription },
  } = requireSupabase().auth.onAuthStateChange(callback);

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
export function getTable<T extends keyof Database['public']['Tables']>(tableName: T) {
  return requireSupabase().from(tableName);
}

/**
 * Call a database function with type safety
 * Usage: const result = await callFunction('get_user_teams', { user_uuid: '...' })
 */
export async function callFunction<T extends keyof Database['public']['Functions']>(
  functionName: T,
  args: Database['public']['Functions'][T]['Args']
) {
  return requireSupabase().rpc(functionName, args);
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
      err.code === '42501' ||
      err.code === 'PGRST301' ||
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

    if (err.hint) {
      message += ` (${err.hint})`;
    }

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
  if (supabase) {
    console.log('[Supabase] Client initialized', {
      url: supabaseUrl,
      anonKeyPrefix: supabaseAnonKey.substring(0, 20) + '...',
    });

    if (typeof window !== 'undefined') {
      (window as unknown as { supabase: typeof supabase }).supabase = supabase;
      console.log('[Supabase] Client available as window.supabase');
    }
  } else {
    console.info('[Supabase] No valid credentials found. Running in local demo auth mode.');
  }
}

export default supabase;
