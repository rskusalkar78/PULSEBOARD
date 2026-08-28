/**
 * Toast Context
 * Global toast notification provider
 */

import { createContext, useContext, type ReactNode } from 'react';
import { useToast, setGlobalToast, type UseToastReturn } from '@/hooks/useToast';

const ToastContext = createContext<UseToastReturn | null>(null);

export interface ToastProviderProps {
  children: ReactNode;
}

/**
 * Toast Provider Component
 */
export function ToastProvider({ children }: ToastProviderProps) {
  const toastMethods = useToast();

  // Set global toast instance
  setGlobalToast(toastMethods);

  return <ToastContext.Provider value={toastMethods}>{children}</ToastContext.Provider>;
}

/**
 * Hook to use toast context
 */
export function useToastContext(): UseToastReturn {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToastContext must be used within ToastProvider');
  }

  return context;
}
