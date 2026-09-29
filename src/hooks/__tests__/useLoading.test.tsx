/**
 * useLoading Hook Tests
 */

import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useLoading, useDebouncedLoading, useOptimistic } from '../useLoading';

describe('useLoading', () => {
  it('initializes with no loading state', () => {
    const { result } = renderHook(() => useLoading());

    expect(result.current.loading).toBe(false);
    expect(result.current.isLoading()).toBe(false);
    expect(result.current.loadingKeys.size).toBe(0);
  });

  it('initializes with loading state when initialLoading=true', () => {
    const { result } = renderHook(() => useLoading(true));

    expect(result.current.loading).toBe(true);
    expect(result.current.isLoading()).toBe(true);
    expect(result.current.loadingKeys.has('default')).toBe(true);
  });

  it('starts loading with default key', () => {
    const { result } = renderHook(() => useLoading());

    act(() => {
      result.current.startLoading();
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.isLoading()).toBe(true);
    expect(result.current.isLoading('default')).toBe(true);
  });

  it('stops loading with default key', () => {
    const { result } = renderHook(() => useLoading(true));

    act(() => {
      result.current.stopLoading();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.isLoading()).toBe(false);
  });

  it('handles multiple loading keys', () => {
    const { result } = renderHook(() => useLoading());

    act(() => {
      result.current.startLoading('fetch');
      result.current.startLoading('save');
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.isLoading('fetch')).toBe(true);
    expect(result.current.isLoading('save')).toBe(true);
    expect(result.current.loadingKeys.size).toBe(2);
  });

  it('remains loading if one key is still active', () => {
    const { result } = renderHook(() => useLoading());

    act(() => {
      result.current.startLoading('fetch');
      result.current.startLoading('save');
    });

    act(() => {
      result.current.stopLoading('fetch');
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.isLoading('save')).toBe(true);
    expect(result.current.isLoading('fetch')).toBe(false);
  });

  it('stops loading when all keys are cleared', () => {
    const { result } = renderHook(() => useLoading());

    act(() => {
      result.current.startLoading('fetch');
      result.current.startLoading('save');
    });

    act(() => {
      result.current.stopLoading('fetch');
      result.current.stopLoading('save');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.isLoading()).toBe(false);
  });

  it('wraps async function with loading state', async () => {
    const { result } = renderHook(() => useLoading());
    const mockFn = vi.fn().mockResolvedValue('result');

    expect(result.current.loading).toBe(false);

    const promise = act(() => result.current.withLoading(mockFn, 'test'));

    expect(result.current.loading).toBe(true);
    expect(result.current.isLoading('test')).toBe(true);

    const returnValue = await promise;

    expect(result.current.loading).toBe(false);
    expect(result.current.isLoading('test')).toBe(false);
    expect(returnValue).toBe('result');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('clears loading state even if async function throws', async () => {
    const { result } = renderHook(() => useLoading());
    const mockFn = vi.fn().mockRejectedValue(new Error('Failed'));

    let error: Error | null = null;

    try {
      await act(async () => {
        await result.current.withLoading(mockFn, 'test');
      });
    } catch (err) {
      error = err as Error;
    }

    expect(error).toBeInstanceOf(Error);
    expect(result.current.loading).toBe(false);
    expect(result.current.isLoading('test')).toBe(false);
  });

  it('handles concurrent loading operations', async () => {
    const { result } = renderHook(() => useLoading());

    const mockFn1 = vi
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve('result1'), 100))
      );
    const mockFn2 = vi
      .fn()
      .mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve('result2'), 50)));

    const promise1 = act(() => result.current.withLoading(mockFn1, 'op1'));
    const promise2 = act(() => result.current.withLoading(mockFn2, 'op2'));

    expect(result.current.isLoading('op1')).toBe(true);
    expect(result.current.isLoading('op2')).toBe(true);

    await promise2;
    expect(result.current.isLoading('op2')).toBe(false);
    expect(result.current.isLoading('op1')).toBe(true);
    expect(result.current.loading).toBe(true);

    await promise1;
    expect(result.current.isLoading('op1')).toBe(false);
    expect(result.current.loading).toBe(false);
  });
});

describe('useDebouncedLoading', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with no loading state', () => {
    const { result } = renderHook(() => useDebouncedLoading());

    expect(result.current.loading).toBe(false);
  });

  it('shows loading after delay', () => {
    const { result } = renderHook(() => useDebouncedLoading(300));

    act(() => {
      result.current.startLoading();
    });

    expect(result.current.loading).toBe(false);

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.loading).toBe(true);
  });

  it('cancels loading if stopped before delay', () => {
    const { result } = renderHook(() => useDebouncedLoading(300));

    act(() => {
      result.current.startLoading();
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    act(() => {
      result.current.stopLoading();
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.loading).toBe(false);
  });

  it('wraps async function with debounced loading', async () => {
    const { result } = renderHook(() => useDebouncedLoading(300));
    const mockFn = vi.fn().mockResolvedValue('result');

    const promise = act(() => result.current.withLoading(mockFn));

    expect(result.current.loading).toBe(false);

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await promise;
    });

    expect(result.current.loading).toBe(false);
  });
});

describe('useOptimistic', () => {
  it('initializes with initial data', () => {
    const initialData = { count: 0 };
    const updater = vi.fn();

    const { result } = renderHook(() => useOptimistic(initialData, updater));

    expect(result.current.data).toEqual(initialData);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('applies optimistic update immediately', async () => {
    const initialData = { count: 0 };
    const updater = vi.fn().mockImplementation((data) => Promise.resolve(data));

    const { result } = renderHook(() => useOptimistic(initialData, updater));

    const optimisticData = { count: 5 };

    act(() => {
      result.current.update(optimisticData);
    });

    // Data should update immediately (optimistically)
    expect(result.current.data).toEqual(optimisticData);
    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(updater).toHaveBeenCalledWith(optimisticData);
  });

  it('keeps server response when successful', async () => {
    const initialData = { count: 0 };
    const serverData = { count: 10 };
    const updater = vi.fn().mockResolvedValue(serverData);

    const { result } = renderHook(() => useOptimistic(initialData, updater));

    await act(async () => {
      await result.current.update({ count: 5 });
    });

    expect(result.current.data).toEqual(serverData);
    expect(result.current.error).toBeNull();
  });

  it('rolls back optimistic update on error', async () => {
    const initialData = { count: 0 };
    const updater = vi.fn().mockRejectedValue(new Error('Update failed'));

    const { result } = renderHook(() => useOptimistic(initialData, updater));

    const optimisticData = { count: 5 };

    let thrownError: Error | null = null;

    await act(async () => {
      try {
        await result.current.update(optimisticData);
      } catch (err) {
        thrownError = err as Error;
      }
    });

    // Should rollback to initial data
    expect(result.current.data).toEqual(initialData);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(thrownError).toBeInstanceOf(Error);
  });

  it('allows manual data updates', () => {
    const initialData = { count: 0 };
    const updater = vi.fn();

    const { result } = renderHook(() => useOptimistic(initialData, updater));

    act(() => {
      result.current.setData({ count: 100 });
    });

    expect(result.current.data).toEqual({ count: 100 });
  });
});
