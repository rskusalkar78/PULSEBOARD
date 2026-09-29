/**
 * useError Hook Tests
 */

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useError, useFieldErrors, useRetry } from '../useError';

// Mock the error utilities
vi.mock('@/lib/errors', () => ({
  toApiError: vi.fn((error: { message?: string; code?: string } | null | undefined) => ({
    message: error?.message || 'Unknown error',
    code: error?.code || 'UNKNOWN',
  })),
  getUserFriendlyMessage: vi.fn(
    (error: { message?: string } | null | undefined) => error?.message || 'An error occurred'
  ),
  logError: vi.fn(),
}));

describe('useError', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with no error', () => {
    const { result } = renderHook(() => useError());

    expect(result.current.error).toBeNull();
    expect(result.current.hasError).toBe(false);
    expect(result.current.errorMessage).toBeNull();
  });

  it('sets error correctly', () => {
    const { result } = renderHook(() => useError());

    act(() => {
      result.current.setError(new Error('Test error'));
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.hasError).toBe(true);
    expect(result.current.errorMessage).toBe('Test error');
  });

  it('clears error', () => {
    const { result } = renderHook(() => useError());

    act(() => {
      result.current.setError(new Error('Test error'));
    });

    expect(result.current.hasError).toBe(true);

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.hasError).toBe(false);
    expect(result.current.errorMessage).toBeNull();
  });

  it('handles null or undefined error', () => {
    const { result } = renderHook(() => useError());

    act(() => {
      result.current.setError(null);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.hasError).toBe(false);
  });

  it('converts non-Error objects to ApiError', () => {
    const { result } = renderHook(() => useError());

    act(() => {
      result.current.setError({ message: 'Custom error', code: 'CUSTOM' });
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.hasError).toBe(true);
  });
});

describe('useFieldErrors', () => {
  it('initializes with no errors', () => {
    const { result } = renderHook(() => useFieldErrors());

    expect(result.current.errors).toEqual({});
    expect(result.current.hasErrors).toBe(false);
  });

  it('sets individual field error', () => {
    const { result } = renderHook(() => useFieldErrors());

    act(() => {
      result.current.setError('email', 'Invalid email');
    });

    expect(result.current.errors.email).toBe('Invalid email');
    expect(result.current.hasErrors).toBe(true);
    expect(result.current.hasError('email')).toBe(true);
    expect(result.current.getError('email')).toBe('Invalid email');
  });

  it('sets multiple errors as object', () => {
    const { result } = renderHook(() => useFieldErrors());

    act(() => {
      result.current.setErrors({
        email: 'Invalid email',
        password: 'Password too short',
      });
    });

    expect(result.current.errors).toEqual({
      email: 'Invalid email',
      password: 'Password too short',
    });
    expect(result.current.hasErrors).toBe(true);
  });

  it('sets multiple errors as array', () => {
    const { result } = renderHook(() => useFieldErrors());

    act(() => {
      result.current.setErrors([
        { field: 'email', message: 'Invalid email' },
        { field: 'password', message: 'Password required' },
      ]);
    });

    expect(result.current.errors.email).toBe('Invalid email');
    expect(result.current.errors.password).toBe('Password required');
  });

  it('clears individual field error', () => {
    const { result } = renderHook(() => useFieldErrors());

    act(() => {
      result.current.setErrors({
        email: 'Invalid email',
        password: 'Password too short',
      });
    });

    act(() => {
      result.current.clearError('email');
    });

    expect(result.current.errors.email).toBeUndefined();
    expect(result.current.errors.password).toBe('Password too short');
    expect(result.current.hasError('email')).toBe(false);
  });

  it('clears all errors', () => {
    const { result } = renderHook(() => useFieldErrors());

    act(() => {
      result.current.setErrors({
        email: 'Invalid email',
        password: 'Password too short',
      });
    });

    expect(result.current.hasErrors).toBe(true);

    act(() => {
      result.current.clearErrors();
    });

    expect(result.current.errors).toEqual({});
    expect(result.current.hasErrors).toBe(false);
  });

  it('checks if specific field has error', () => {
    const { result } = renderHook(() => useFieldErrors());

    act(() => {
      result.current.setError('email', 'Invalid email');
    });

    expect(result.current.hasError('email')).toBe(true);
    expect(result.current.hasError('password')).toBe(false);
  });

  it('gets error for specific field', () => {
    const { result } = renderHook(() => useFieldErrors());

    act(() => {
      result.current.setError('email', 'Invalid email');
    });

    expect(result.current.getError('email')).toBe('Invalid email');
    expect(result.current.getError('password')).toBeUndefined();
  });
});

describe('useRetry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with zero retry count', () => {
    const mockFn = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useRetry(mockFn));

    expect(result.current.retrying).toBe(false);
    expect(result.current.retryCount).toBe(0);
    expect(result.current.canRetry).toBe(true);
  });

  it('executes retry function', async () => {
    const mockFn = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useRetry(mockFn));

    await act(async () => {
      await result.current.retry();
    });

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(result.current.retryCount).toBe(1);
    expect(result.current.retrying).toBe(false);
  });

  it('increments retry count on each retry', async () => {
    const mockFn = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useRetry(mockFn));

    await act(async () => {
      await result.current.retry();
    });

    expect(result.current.retryCount).toBe(1);

    await act(async () => {
      await result.current.retry();
    });

    expect(result.current.retryCount).toBe(2);
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('respects max retries limit', async () => {
    const mockFn = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useRetry(mockFn, 2));

    await act(async () => {
      await result.current.retry();
    });
    await act(async () => {
      await result.current.retry();
    });

    expect(result.current.canRetry).toBe(false);

    await act(async () => {
      await result.current.retry();
    });

    // Should not execute after max retries
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('handles errors during retry', async () => {
    const mockFn = vi.fn().mockRejectedValue(new Error('Retry failed'));
    const { result } = renderHook(() => useRetry(mockFn));

    await act(async () => {
      await result.current.retry();
    });

    expect(result.current.retryCount).toBe(1);
    expect(result.current.retrying).toBe(false);
  });

  it('resets state correctly', async () => {
    const mockFn = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useRetry(mockFn));

    await act(async () => {
      await result.current.retry();
    });

    expect(result.current.retryCount).toBe(1);

    act(() => {
      result.current.reset();
    });

    expect(result.current.retryCount).toBe(0);
    expect(result.current.retrying).toBe(false);
    expect(result.current.canRetry).toBe(true);
  });

  it('sets retrying state during execution', async () => {
    let resolvePromise: () => void;
    const promise = new Promise<void>((resolve) => {
      resolvePromise = resolve;
    });
    const mockFn = vi.fn().mockReturnValue(promise);
    const { result } = renderHook(() => useRetry(mockFn));

    act(() => {
      result.current.retry();
    });

    expect(result.current.retrying).toBe(true);

    await act(async () => {
      resolvePromise();
      await promise;
    });

    expect(result.current.retrying).toBe(false);
  });
});
