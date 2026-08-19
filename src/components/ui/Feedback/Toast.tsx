import React, { createContext, useContext, useState, useCallback } from 'react';
import { cn } from '@/utils/styles';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  title?: string | undefined;
  message: string;
  variant?: ToastVariant | undefined;
  duration?: number | undefined;
}

interface ToastContextValue {
  toast: (options: Omit<ToastItem, 'id'>) => string;
  dismiss: (id: string) => void;
  toasts: ToastItem[];
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, message, variant = 'info', duration = 4000 }: Omit<ToastItem, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { id, title, message, variant, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }

      return id;
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss, toasts }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const toastIconMap: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
  error: <AlertCircle className="h-5 w-5 text-rose-500" />,
  warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
  info: <Info className="h-5 w-5 text-sky-500" />,
};

export const ToastContainer: React.FC<{ toasts: ToastItem[]; onDismiss: (id: string) => void }> = ({
  toasts,
  onDismiss,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-4 right-4 z-[1700] flex max-h-screen w-full max-w-sm flex-col-reverse gap-2 p-4 sm:bottom-4 sm:right-4 pointer-events-none"
    >
      {toasts.map((item) => (
        <div
          key={item.id}
          className={cn(
            'pointer-events-auto flex items-start gap-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-lg transition-all animate-in slide-in-from-right-full fade-in-0',
            item.variant === 'success' && 'border-l-4 border-l-emerald-500',
            item.variant === 'error' && 'border-l-4 border-l-rose-500',
            item.variant === 'warning' && 'border-l-4 border-l-amber-500',
            item.variant === 'info' && 'border-l-4 border-l-sky-500'
          )}
        >
          <div className="shrink-0 mt-0.5">{toastIconMap[item.variant || 'info']}</div>
          <div className="flex-1">
            {item.title && (
              <h5 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {item.title}
              </h5>
            )}
            <p className="text-sm text-slate-600 dark:text-slate-300">{item.message}</p>
          </div>
          <button
            type="button"
            onClick={() => onDismiss(item.id)}
            className="rounded-md p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
