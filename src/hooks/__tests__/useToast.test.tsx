/**
 * useToast Hook Tests
 */

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useToast } from '../useToast';

describe('useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with no toasts', () => {
    const { result } = renderHook(() => useToast());

    expect(result.current.toasts).toEqual([]);
  });

  it('adds success toast with string', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.success('Operation successful');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].type).toBe('success');
    expect(result.current.toasts[0].title).toBe('Operation successful');
    expect(result.current.toasts[0].message).toBeUndefined();
  });

  it('adds success toast with options', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.success({
        title: 'Success',
        message: 'Your changes have been saved',
        duration: 3000,
      });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].type).toBe('success');
    expect(result.current.toasts[0].title).toBe('Success');
    expect(result.current.toasts[0].message).toBe('Your changes have been saved');
    expect(result.current.toasts[0].duration).toBe(3000);
  });

  it('adds error toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.error('An error occurred');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].type).toBe('error');
    expect(result.current.toasts[0].title).toBe('An error occurred');
  });

  it('adds warning toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.warning('Please be careful');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].type).toBe('warning');
  });

  it('adds info toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.info('Here is some information');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].type).toBe('info');
  });

  it('assigns unique IDs to toasts', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.success('Toast 1');
      result.current.error('Toast 2');
      result.current.warning('Toast 3');
    });

    expect(result.current.toasts).toHaveLength(3);

    const ids = result.current.toasts.map((t) => t.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(3);
  });

  it('dismisses specific toast by ID', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.success('Toast 1');
      result.current.error('Toast 2');
      result.current.warning('Toast 3');
    });

    const toastId = result.current.toasts[1].id;

    act(() => {
      result.current.dismiss(toastId);
    });

    expect(result.current.toasts).toHaveLength(2);
    expect(result.current.toasts.find((t) => t.id === toastId)).toBeUndefined();
  });

  it('dismisses all toasts', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.success('Toast 1');
      result.current.error('Toast 2');
      result.current.warning('Toast 3');
    });

    expect(result.current.toasts).toHaveLength(3);

    act(() => {
      result.current.dismissAll();
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it('auto-dismisses toast after default duration', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.success('Auto dismiss');
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it('auto-dismisses toast after custom duration', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.success({
        title: 'Quick toast',
        duration: 2000,
      });
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it('does not auto-dismiss if duration is 0', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.success({
        title: 'Persistent',
        duration: 0,
      });
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(result.current.toasts).toHaveLength(1);
  });

  it('includes action in toast', () => {
    const { result } = renderHook(() => useToast());
    const onClick = vi.fn();

    act(() => {
      result.current.info({
        title: 'Action toast',
        action: {
          label: 'Undo',
          onClick,
        },
      });
    });

    expect(result.current.toasts[0].action).toBeDefined();
    expect(result.current.toasts[0].action?.label).toBe('Undo');

    act(() => {
      result.current.toasts[0].action?.onClick();
    });

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('maintains toast order (FIFO)', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.success('First');
      result.current.error('Second');
      result.current.warning('Third');
    });

    expect(result.current.toasts[0].title).toBe('First');
    expect(result.current.toasts[1].title).toBe('Second');
    expect(result.current.toasts[2].title).toBe('Third');
  });

  it('handles multiple toasts with different durations', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.success({ title: 'Short', duration: 1000 });
      result.current.error({ title: 'Long', duration: 5000 });
    });

    expect(result.current.toasts).toHaveLength(2);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe('Long');

    act(() => {
      vi.advanceTimersByTime(4000);
    });

    expect(result.current.toasts).toHaveLength(0);
  });
});
