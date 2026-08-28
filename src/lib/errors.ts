/**
 * Error Handling Utilities
 * Custom error classes and error handling helpers
 */

import type { ApiError } from '@/types';

// =====================================================
// CUSTOM ERROR CLASSES
// =====================================================

/**
 * Base application error
 */
export class AppError extends Error {
  public readonly code?: string | undefined;
  public readonly status?: number | undefined;
  public readonly details?: Record<string, unknown> | undefined;

  constructor(
    message: string,
    code?: string | undefined,
    status?: number | undefined,
    details?: Record<string, unknown> | undefined
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.details = details;

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

/**
 * Authentication error
 */
export class AuthenticationError extends AppError {
  constructor(message = 'Authentication required', details?: Record<string, unknown>) {
    super(message, 'AUTH_ERROR', 401, details);
    this.name = 'AuthenticationError';
  }
}

/**
 * Authorization/Permission error
 */
export class AuthorizationError extends AppError {
  constructor(
    message = 'You do not have permission to perform this action',
    details?: Record<string, unknown>
  ) {
    super(message, 'PERMISSION_ERROR', 403, details);
    this.name = 'AuthorizationError';
  }
}

/**
 * Not found error
 */
export class NotFoundError extends AppError {
  constructor(resource = 'Resource', details?: Record<string, unknown>) {
    super(`${resource} not found`, 'NOT_FOUND', 404, details);
    this.name = 'NotFoundError';
  }
}

/**
 * Validation error
 */
export class ValidationError extends AppError {
  constructor(message = 'Validation failed', details?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

/**
 * Network error
 */
export class NetworkError extends AppError {
  constructor(message = 'Network request failed', details?: Record<string, unknown>) {
    super(message, 'NETWORK_ERROR', 0, details);
    this.name = 'NetworkError';
  }
}

/**
 * Database error
 */
export class DatabaseError extends AppError {
  constructor(message = 'Database operation failed', details?: Record<string, unknown>) {
    super(message, 'DATABASE_ERROR', 500, details);
    this.name = 'DatabaseError';
  }
}

/**
 * Rate limit error
 */
export class RateLimitError extends AppError {
  constructor(message = 'Too many requests', details?: Record<string, unknown>) {
    super(message, 'RATE_LIMIT', 429, details);
    this.name = 'RateLimitError';
  }
}

// =====================================================
// ERROR CLASSIFICATION
// =====================================================

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: unknown): boolean {
  if (error instanceof AuthenticationError) return true;

  if (typeof error === 'object' && error !== null) {
    const err = error as { status?: number; code?: string };
    return err.status === 401 || err.code === 'AUTH_ERROR';
  }

  return false;
}

/**
 * Check if error is an authorization error
 */
export function isAuthorizationError(error: unknown): boolean {
  if (error instanceof AuthorizationError) return true;

  if (typeof error === 'object' && error !== null) {
    const err = error as { status?: number; code?: string; message?: string };
    return (
      err.status === 403 ||
      err.code === 'PERMISSION_ERROR' ||
      err.code === '42501' ||
      err.code === 'PGRST301' ||
      err.message?.toLowerCase().includes('permission denied') ||
      err.message?.toLowerCase().includes('policy')
    );
  }

  return false;
}

/**
 * Check if error is a not found error
 */
export function isNotFoundError(error: unknown): boolean {
  if (error instanceof NotFoundError) return true;

  if (typeof error === 'object' && error !== null) {
    const err = error as { status?: number; code?: string };
    return err.status === 404 || err.code === 'PGRST116' || err.code === 'NOT_FOUND';
  }

  return false;
}

/**
 * Check if error is a validation error
 */
export function isValidationError(error: unknown): boolean {
  if (error instanceof ValidationError) return true;

  if (typeof error === 'object' && error !== null) {
    const err = error as { status?: number; code?: string };
    return err.status === 400 || err.code === 'VALIDATION_ERROR';
  }

  return false;
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof NetworkError) return true;

  if (typeof error === 'object' && error !== null) {
    const err = error as { message?: string; code?: string };
    return (
      err.code === 'NETWORK_ERROR' ||
      err.message?.toLowerCase().includes('network') ||
      err.message?.toLowerCase().includes('fetch failed')
    );
  }

  return false;
}

/**
 * Check if error is a rate limit error
 */
export function isRateLimitError(error: unknown): boolean {
  if (error instanceof RateLimitError) return true;

  if (typeof error === 'object' && error !== null) {
    const err = error as { status?: number; code?: string };
    return err.status === 429 || err.code === 'RATE_LIMIT';
  }

  return false;
}

// =====================================================
// ERROR TRANSFORMATION
// =====================================================

/**
 * Transform any error to ApiError format
 */
export function toApiError(error: unknown): ApiError {
  // Already an ApiError
  if (typeof error === 'object' && error !== null && 'message' in error && 'code' in error) {
    const err = error as ApiError;
    return {
      message: err.message,
      code: err.code,
      status: err.status,
      details: err.details,
    };
  }

  // AppError or custom error classes
  if (error instanceof AppError) {
    return {
      message: error.message,
      code: error.code,
      status: error.status,
      details: error.details,
    };
  }

  // Standard Error
  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'ERROR',
      status: 500,
    };
  }

  // Unknown error type
  return {
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
    status: 500,
  };
}

/**
 * Format error message for display
 */
export function formatErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof AppError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    const err = error as { message: string; hint?: string };
    let message = err.message;

    // Add hint if available
    if (err.hint) {
      message += ` (${err.hint})`;
    }

    return message;
  }

  return 'An unexpected error occurred';
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: unknown): string {
  if (isAuthError(error)) {
    return 'Please sign in to continue';
  }

  if (isAuthorizationError(error)) {
    return "You don't have permission to perform this action";
  }

  if (isNotFoundError(error)) {
    return 'The requested item was not found';
  }

  if (isValidationError(error)) {
    return formatErrorMessage(error);
  }

  if (isNetworkError(error)) {
    return 'Network connection failed. Please check your internet connection';
  }

  if (isRateLimitError(error)) {
    return 'Too many requests. Please try again later';
  }

  // Database errors
  if (typeof error === 'object' && error !== null) {
    const err = error as { code?: string; message?: string };

    // Unique constraint violation
    if (err.code === '23505') {
      return 'This item already exists';
    }

    // Foreign key violation
    if (err.code === '23503') {
      return 'Cannot perform this action due to related items';
    }

    // Check violation
    if (err.code === '23514') {
      return 'Invalid data provided';
    }
  }

  return formatErrorMessage(error);
}

// =====================================================
// ERROR LOGGING
// =====================================================

/**
 * Log error to console (can be extended to external service)
 */
export function logError(error: unknown, context?: Record<string, unknown>): void {
  const errorInfo = {
    error: toApiError(error),
    context,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
  };

  console.error('[Error]', errorInfo);

  // TODO: Send to error tracking service (e.g., Sentry)
  // if (config.thirdParty.sentryDsn) {
  //   Sentry.captureException(error, { contexts: { custom: context } });
  // }
}

// =====================================================
// ERROR RETRY UTILITIES
// =====================================================

/**
 * Check if error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  return (
    isNetworkError(error) ||
    isRateLimitError(error) ||
    (typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      [408, 429, 500, 502, 503, 504].includes((error as { status: number }).status))
  );
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry if error is not retryable or max retries reached
      if (!isRetryableError(error) || attempt === maxRetries) {
        throw error;
      }

      // Exponential backoff
      const delay = delayMs * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

// =====================================================
// ERROR BOUNDARY HELPER
// =====================================================

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: { componentStack?: string } | null;
}

/**
 * Get initial error boundary state
 */
export function getInitialErrorState(): ErrorBoundaryState {
  return {
    hasError: false,
    error: null,
    errorInfo: null,
  };
}

/**
 * Handle error in error boundary
 */
export function handleErrorBoundary(
  error: Error,
  errorInfo: { componentStack?: string }
): ErrorBoundaryState {
  logError(error, { componentStack: errorInfo.componentStack });

  return {
    hasError: true,
    error,
    errorInfo,
  };
}
