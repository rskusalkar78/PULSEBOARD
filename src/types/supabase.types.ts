/**
 * Supabase Client Types
 * Type definitions for Supabase client responses and utilities
 */

import type { PostgrestError } from '@supabase/supabase-js';
import type { Database } from './database.types';

// =====================================================
// SUPABASE CLIENT TYPES
// =====================================================

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

export type Functions<T extends keyof Database['public']['Functions']> =
  Database['public']['Functions'][T];

// =====================================================
// API RESPONSE TYPES
// =====================================================

export interface ApiResponse<T = unknown> {
  data: T | null;
  error: ApiError | null;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string | undefined;
  status?: number | undefined;
  details?: Record<string, unknown> | undefined;
}

export interface SupabaseResponse<T> {
  data: T | null;
  error: PostgrestError | null;
}

// =====================================================
// AUTH TYPES
// =====================================================

export interface SignUpData {
  email: string;
  password: string;
  full_name?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role?: string;
  created_at: string;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
  user: AuthUser;
}

// =====================================================
// REALTIME TYPES
// =====================================================

export type RealtimeChannel = 'notifications' | 'activities' | 'tasks';

export interface RealtimePayload<T = unknown> {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: T;
  old: T;
  schema: string;
  table: string;
  commit_timestamp: string;
}

export type RealtimeCallback<T = unknown> = (payload: RealtimePayload<T>) => void;

// =====================================================
// QUERY BUILDER TYPES
// =====================================================

export interface QueryOptions {
  select?: string;
  limit?: number;
  offset?: number;
  order?: {
    column: string;
    ascending?: boolean;
  };
  filters?: Record<string, unknown>;
}

export interface CountOptions {
  count: 'exact' | 'planned' | 'estimated';
}

// =====================================================
// STORAGE TYPES
// =====================================================

export interface StorageBucket {
  id: string;
  name: string;
  public: boolean;
  created_at: string;
  updated_at: string;
}

export interface FileObject {
  name: string;
  bucket_id: string;
  owner: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: Record<string, unknown>;
}

export interface UploadOptions {
  cacheControl?: string;
  contentType?: string;
  upsert?: boolean;
}

export interface SignedUrlOptions {
  expiresIn?: number;
  download?: boolean | string;
  transform?: {
    width?: number;
    height?: number;
    quality?: number;
  };
}

// =====================================================
// HELPER UTILITY TYPES
// =====================================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>>;
  }[Keys];

// =====================================================
// SERVICE METHOD TYPES
// =====================================================

export interface ServiceOptions {
  abortSignal?: AbortSignal;
  skipCache?: boolean;
}

export interface CreateOptions extends ServiceOptions {
  returnData?: boolean;
}

export interface UpdateOptions extends ServiceOptions {
  returnData?: boolean;
}

export interface DeleteOptions extends ServiceOptions {
  cascade?: boolean;
}

export interface ListOptions extends ServiceOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, unknown>;
}

// =====================================================
// VALIDATION TYPES
// =====================================================

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

// =====================================================
// WEBHOOK TYPES
// =====================================================

export interface WebhookPayload<T = unknown> {
  type: string;
  table: string;
  record: T;
  schema: string;
  old_record: T | null;
}

// =====================================================
// BATCH OPERATION TYPES
// =====================================================

export interface BatchOperation<T> {
  operation: 'create' | 'update' | 'delete';
  data: T;
  id?: string;
}

export interface BatchResult<T> {
  success: T[];
  failed: Array<{
    data: T;
    error: ApiError;
  }>;
}
