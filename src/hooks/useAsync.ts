/**
 * useAsync Hook
 * Generic hook for handling async operations with loading and error states
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { logError } from '@/lib/errors';
import type { ApiResponse } from '@/types';

export interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  isSuccess: boolean;
  isError: boolean;
  isIdle: boolean;
}

export interface UseAsyncOptions {
  immediate?: boolean;
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for handling async operations
 */
export function useAsync<T = unknown>(
  asyncFunction: () => Promise<T>,
  options: UseAsyncOptions = {}
) {
  const { immediate = false, onSuccess, onError } = options;

  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: immediate,
    error: null,
    isSuccess: false,
    isError: false,
    isIdle: !immediate,
  });

  // Track if component is mounted
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const execute = useCallback(async () => {
    setState({
      data: null,
      loading: true,
      error: null,
      isSuccess: false,
      isError: false,
      isIdle: false,
    });

    try {
      const result = await asyncFunction();

      if (isMounted.current) {
        setState({
          data: result,
          loading: false,
          error: null,
          isSuccess: true,
          isError: false,
          isIdle: false,
        });

        onSuccess?.(result);
      }

      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));

      if (isMounted.current) {
        setState({
          data: null,
          loading: false,
          error: err,
          isSuccess: false,
          isError: true,
          isIdle: false,
        });

        onError?.(err);
        logError(err, { context: 'useAsync' });
      }

      throw err;
    }
  }, [asyncFunction, onSuccess, onError]);

  // Execute immediately if requested
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      isSuccess: false,
      isError: false,
      isIdle: true,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

/**
 * Hook for handling async operations with ApiResponse format
 */
export function useAsyncApi<T = unknown>(
  asyncFunction: () => Promise<ApiResponse<T>>,
  options: UseAsyncOptions = {}
) {
  const { immediate = false, onSuccess, onError } = options;

  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: immediate,
    error: null,
    isSuccess: false,
    isError: false,
    isIdle: !immediate,
  });

  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const execute = useCallback(async () => {
    setState({
      data: null,
      loading: true,
      error: null,
      isSuccess: false,
      isError: false,
      isIdle: false,
    });

    try {
      const response = await asyncFunction();

      if (!response.success || response.error) {
        const err = new Error(response.error?.message || 'Operation failed');
        throw err;
      }

      if (isMounted.current) {
        setState({
          data: response.data,
          loading: false,
          error: null,
          isSuccess: true,
          isError: false,
          isIdle: false,
        });

        onSuccess?.(response.data);
      }

      return response.data;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));

      if (isMounted.current) {
        setState({
          data: null,
          loading: false,
          error: err,
          isSuccess: false,
          isError: true,
          isIdle: false,
        });

        onError?.(err);
        logError(err, { context: 'useAsyncApi' });
      }

      throw err;
    }
  }, [asyncFunction, onSuccess, onError]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      isSuccess: false,
      isError: false,
      isIdle: true,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}
