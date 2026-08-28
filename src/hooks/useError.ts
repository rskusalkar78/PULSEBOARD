/**
 * useError Hook
 * Hook for managing error states
 */

import { useState, useCallback } from 'react';
import { toApiError, getUserFriendlyMessage, logError } from '@/lib/errors';
import type { ApiError } from '@/types';

export interface UseErrorReturn {
  error: ApiError | null;
  hasError: boolean;
  setError: (error: unknown) => void;
  clearError: () => void;
  errorMessage: string | null;
}

/**
 * Hook for managing error states
 */
export function useError(): UseErrorReturn {
  const [error, setErrorState] = useState<ApiError | null>(null);

  const setError = useCallback((error: unknown) => {
    if (!error) {
      setErrorState(null);
      return;
    }

    const apiError = toApiError(error);
    setErrorState(apiError);
    logError(error, { context: 'useError' });
  }, []);

  const clearError = useCallback(() => {
    setErrorState(null);
  }, []);

  return {
    error,
    hasError: error !== null,
    setError,
    clearError,
    errorMessage: error ? getUserFriendlyMessage(error) : null,
  };
}

/**
 * Hook for managing field errors (for forms)
 */
export interface FieldError {
  field: string;
  message: string;
}

export interface UseFieldErrorsReturn {
  errors: Record<string, string>;
  hasErrors: boolean;
  hasError: (field: string) => boolean;
  getError: (field: string) => string | undefined;
  setError: (field: string, message: string) => void;
  setErrors: (errors: Record<string, string> | FieldError[]) => void;
  clearError: (field: string) => void;
  clearErrors: () => void;
}

export function useFieldErrors(): UseFieldErrorsReturn {
  const [errors, setErrorsState] = useState<Record<string, string>>({});

  const hasError = useCallback(
    (field: string) => {
      return field in errors;
    },
    [errors]
  );

  const getError = useCallback(
    (field: string) => {
      return errors[field];
    },
    [errors]
  );

  const setError = useCallback((field: string, message: string) => {
    setErrorsState((prev) => ({
      ...prev,
      [field]: message,
    }));
  }, []);

  const setErrors = useCallback((newErrors: Record<string, string> | FieldError[]) => {
    if (Array.isArray(newErrors)) {
      const errorsObj = newErrors.reduce(
        (acc, { field, message }) => {
          acc[field] = message;
          return acc;
        },
        {} as Record<string, string>
      );
      setErrorsState(errorsObj);
    } else {
      setErrorsState(newErrors);
    }
  }, []);

  const clearError = useCallback((field: string) => {
    setErrorsState((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const clearErrors = useCallback(() => {
    setErrorsState({});
  }, []);

  return {
    errors,
    hasErrors: Object.keys(errors).length > 0,
    hasError,
    getError,
    setError,
    setErrors,
    clearError,
    clearErrors,
  };
}

/**
 * Hook for retry logic
 */
export interface UseRetryReturn {
  retrying: boolean;
  retryCount: number;
  canRetry: boolean;
  retry: () => Promise<void>;
  reset: () => void;
}

export function useRetry(fn: () => Promise<void>, maxRetries = 3): UseRetryReturn {
  const [retrying, setRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const retry = useCallback(async () => {
    if (retryCount >= maxRetries) {
      return;
    }

    setRetrying(true);
    setRetryCount((prev) => prev + 1);

    try {
      await fn();
    } catch (error) {
      logError(error, { retryCount, context: 'useRetry' });
    } finally {
      setRetrying(false);
    }
  }, [fn, retryCount, maxRetries]);

  const reset = useCallback(() => {
    setRetrying(false);
    setRetryCount(0);
  }, []);

  return {
    retrying,
    retryCount,
    canRetry: retryCount < maxRetries,
    retry,
    reset,
  };
}
