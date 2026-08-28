/**
 * useLoading Hook
 * Hook for managing loading states with support for multiple operations
 */

import { useState, useCallback, useRef } from 'react';

export interface UseLoadingReturn {
  loading: boolean;
  isLoading: (key?: string) => boolean;
  startLoading: (key?: string) => void;
  stopLoading: (key?: string) => void;
  withLoading: <T>(fn: () => Promise<T>, key?: string) => Promise<T>;
  loadingKeys: Set<string>;
}

/**
 * Hook for managing loading states
 */
export function useLoading(initialLoading = false): UseLoadingReturn {
  const [loadingKeys, setLoadingKeys] = useState<Set<string>>(
    new Set(initialLoading ? ['default'] : [])
  );
  const loadingRef = useRef(loadingKeys);

  // Keep ref in sync
  loadingRef.current = loadingKeys;

  const startLoading = useCallback((key = 'default') => {
    setLoadingKeys((prev) => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
  }, []);

  const stopLoading = useCallback((key = 'default') => {
    setLoadingKeys((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  }, []);

  const isLoading = useCallback((key?: string) => {
    if (key) {
      return loadingRef.current.has(key);
    }
    return loadingRef.current.size > 0;
  }, []);

  const withLoading = useCallback(
    async <T>(fn: () => Promise<T>, key = 'default'): Promise<T> => {
      startLoading(key);
      try {
        const result = await fn();
        return result;
      } finally {
        stopLoading(key);
      }
    },
    [startLoading, stopLoading]
  );

  return {
    loading: loadingKeys.size > 0,
    isLoading,
    startLoading,
    stopLoading,
    withLoading,
    loadingKeys,
  };
}

/**
 * Hook for debounced loading state
 * Shows loading state only if operation takes longer than delay
 */
export function useDebouncedLoading(delay = 300) {
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);

  const startLoading = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setLoading(true);
    }, delay);
  }, [delay]);

  const stopLoading = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setLoading(false);
  }, []);

  const withLoading = useCallback(
    async <T>(fn: () => Promise<T>): Promise<T> => {
      startLoading();
      try {
        const result = await fn();
        return result;
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading]
  );

  return {
    loading,
    startLoading,
    stopLoading,
    withLoading,
  };
}

/**
 * Hook for managing optimistic updates
 */
export function useOptimistic<T>(initialData: T, updater: (data: T) => Promise<T>) {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = useCallback(
    async (optimisticData: T) => {
      // Save current data for rollback
      const previousData = data;

      // Apply optimistic update
      setData(optimisticData);
      setLoading(true);
      setError(null);

      try {
        // Perform actual update
        const result = await updater(optimisticData);
        setData(result);
        return result;
      } catch (err) {
        // Rollback on error
        setData(previousData);
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [data, updater]
  );

  return {
    data,
    loading,
    error,
    update,
    setData,
  };
}
