/**
 * useAsync Hook Tests
 */

import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAsync, useAsyncApi } from '../useAsync';
import type { ApiResponse } from '@/types';

describe('useAsync', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with idle state', () => {
    const mockFn = vi.fn().mockResolvedValue('data');
    const { result } = renderHook(() => useAsync(mockFn));

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.isIdle).toBe(true);
  });

  it('initializes with loading state when immediate=true', () => {
    const mockFn = vi.fn().mockResolvedValue('data');
    const { result } = renderHook(() => useAsync(mockFn, { immediate: true }));

    expect(result.current.loading).toBe(true);
    expect(result.current.isIdle).toBe(false);
  });

  it('executes async function and updates state on success', async () => {
    const mockData = { id: 1, name: 'Test' };
    const mockFn = vi.fn().mockResolvedValue(mockData);
    const { result } = renderHook(() => useAsync(mockFn));

    expect(result.current.isIdle).toBe(true);

    act(() => {
      result.current.execute();
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.isIdle).toBe(false);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.error).toBeNull();
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('handles errors correctly', async () => {
    const mockError = new Error('Something went wrong');
    const mockFn = vi.fn().mockRejectedValue(mockError);
    const { result } = renderHook(() => useAsync(mockFn));

    let thrownError: Error | null = null;

    await act(async () => {
      try {
        await result.current.execute();
      } catch (err) {
        thrownError = err as Error;
      }
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toEqual(mockError);
    expect(result.current.isError).toBe(true);
    expect(result.current.isSuccess).toBe(false);
    expect(thrownError).toEqual(mockError);
  });

  it('calls onSuccess callback on successful execution', async () => {
    const mockData = { id: 1, name: 'Test' };
    const mockFn = vi.fn().mockResolvedValue(mockData);
    const onSuccess = vi.fn();

    const { result } = renderHook(() => useAsync(mockFn, { onSuccess }));

    await act(async () => {
      await result.current.execute();
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(mockData);
    });
  });

  it('calls onError callback on error', async () => {
    const mockError = new Error('Failed');
    const mockFn = vi.fn().mockRejectedValue(mockError);
    const onError = vi.fn();

    const { result } = renderHook(() => useAsync(mockFn, { onError }));

    await act(async () => {
      try {
        await result.current.execute();
      } catch {
        // Expected
      }
    });

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(mockError);
    });
  });

  it('executes immediately when immediate=true', async () => {
    const mockData = 'immediate data';
    const mockFn = vi.fn().mockResolvedValue(mockData);

    renderHook(() => useAsync(mockFn, { immediate: true }));

    await waitFor(() => {
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  it('resets state correctly', async () => {
    const mockData = { id: 1 };
    const mockFn = vi.fn().mockResolvedValue(mockData);
    const { result } = renderHook(() => useAsync(mockFn));

    await act(async () => {
      await result.current.execute();
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isIdle).toBe(true);
  });

  it('does not update state after component unmount', async () => {
    const mockFn = vi
      .fn()
      .mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve('data'), 100)));

    const { result, unmount } = renderHook(() => useAsync(mockFn));

    act(() => {
      result.current.execute();
    });

    unmount();

    // Wait for promise to resolve
    await new Promise((resolve) => setTimeout(resolve, 150));

    // State should not have been updated after unmount
    expect(result.current.data).toBeNull();
  });

  it('handles non-Error thrown values', async () => {
    const mockFn = vi.fn().mockRejectedValue('string error');
    const { result } = renderHook(() => useAsync(mockFn));

    await act(async () => {
      try {
        await result.current.execute();
      } catch {
        // Expected
      }
    });

    await waitFor(() => {
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('string error');
    });
  });
});

describe('useAsyncApi', () => {
  it('handles successful API response', async () => {
    const mockData = { id: 1, name: 'Test' };
    const mockResponse: ApiResponse<typeof mockData> = {
      success: true,
      data: mockData,
      error: null,
    };
    const mockFn = vi.fn().mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAsyncApi(mockFn));

    await act(async () => {
      await result.current.execute();
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData);
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it('handles API error response', async () => {
    const mockResponse: ApiResponse<null> = {
      success: false,
      data: null,
      error: { message: 'API Error', code: 'ERR_001' },
    };
    const mockFn = vi.fn().mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAsyncApi(mockFn));

    await act(async () => {
      try {
        await result.current.execute();
      } catch {
        // Expected
      }
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.error?.message).toBe('API Error');
    });
  });

  it('handles API response with success=false and no error object', async () => {
    const mockResponse: ApiResponse<null> = {
      success: false,
      data: null,
      error: null,
    };
    const mockFn = vi.fn().mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAsyncApi(mockFn));

    await act(async () => {
      try {
        await result.current.execute();
      } catch {
        // Expected
      }
    });

    await waitFor(() => {
      expect(result.current.error?.message).toBe('Operation failed');
    });
  });

  it('calls onSuccess with API data', async () => {
    const mockData = { id: 1 };
    const mockResponse: ApiResponse<typeof mockData> = {
      success: true,
      data: mockData,
      error: null,
    };
    const mockFn = vi.fn().mockResolvedValue(mockResponse);
    const onSuccess = vi.fn();

    const { result } = renderHook(() => useAsyncApi(mockFn, { onSuccess }));

    await act(async () => {
      await result.current.execute();
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(mockData);
    });
  });
});
