/**
 * useToast Hook
 * Hook for displaying toast notifications
 */

import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string | undefined;
  duration?: number | undefined;
  action?:
    | {
        label: string;
        onClick: () => void;
      }
    | undefined;
}

export interface ToastOptions {
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface UseToastReturn {
  toasts: Toast[];
  success: (options: string | ToastOptions) => void;
  error: (options: string | ToastOptions) => void;
  warning: (options: string | ToastOptions) => void;
  info: (options: string | ToastOptions) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const DEFAULT_DURATION = 5000;

/**
 * Hook for managing toast notifications
 */
export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: ToastType, options: string | ToastOptions) => {
    const toast: Toast = {
      id: crypto.randomUUID(),
      type,
      title: typeof options === 'string' ? options : options.title,
      message: typeof options === 'object' ? options.message : undefined,
      duration: typeof options === 'object' ? options.duration : DEFAULT_DURATION,
      action: typeof options === 'object' ? options.action : undefined,
    };

    setToasts((prev) => [...prev, toast]);

    // Auto dismiss after duration
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        dismiss(toast.id);
      }, toast.duration);
    }
  }, []);

  const success = useCallback(
    (options: string | ToastOptions) => {
      addToast('success', options);
    },
    [addToast]
  );

  const error = useCallback(
    (options: string | ToastOptions) => {
      addToast('error', options);
    },
    [addToast]
  );

  const warning = useCallback(
    (options: string | ToastOptions) => {
      addToast('warning', options);
    },
    [addToast]
  );

  const info = useCallback(
    (options: string | ToastOptions) => {
      addToast('info', options);
    },
    [addToast]
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    success,
    error,
    warning,
    info,
    dismiss,
    dismissAll,
  };
}

/**
 * Create a global toast instance (can be called from anywhere)
 * Note: This requires a ToastProvider in your app
 */
let globalToast: UseToastReturn | null = null;

export function setGlobalToast(toast: UseToastReturn) {
  globalToast = toast;
}

export function toast(options: string | ToastOptions) {
  if (!globalToast) {
    console.warn('Toast provider not initialized');
    return;
  }
  globalToast.info(options);
}

toast.success = (options: string | ToastOptions) => {
  if (!globalToast) {
    console.warn('Toast provider not initialized');
    return;
  }
  globalToast.success(options);
};

toast.error = (options: string | ToastOptions) => {
  if (!globalToast) {
    console.warn('Toast provider not initialized');
    return;
  }
  globalToast.error(options);
};

toast.warning = (options: string | ToastOptions) => {
  if (!globalToast) {
    console.warn('Toast provider not initialized');
    return;
  }
  globalToast.warning(options);
};

toast.info = (options: string | ToastOptions) => {
  if (!globalToast) {
    console.warn('Toast provider not initialized');
    return;
  }
  globalToast.info(options);
};

toast.dismiss = (id: string) => {
  if (!globalToast) {
    console.warn('Toast provider not initialized');
    return;
  }
  globalToast.dismiss(id);
};

toast.dismissAll = () => {
  if (!globalToast) {
    console.warn('Toast provider not initialized');
    return;
  }
  globalToast.dismissAll();
};
