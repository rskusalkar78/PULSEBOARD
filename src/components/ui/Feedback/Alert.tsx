import React from 'react';
import { cn } from '@/utils/styles';
import { Info, CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-react';

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  onClose?: () => void;
  icon?: React.ReactNode;
}

const variantStyles: Record<AlertVariant, { container: string; icon: string }> = {
  info: {
    container:
      'bg-sky-50 dark:bg-sky-950/50 border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-200',
    icon: 'text-sky-500 dark:text-sky-400',
  },
  success: {
    container:
      'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200',
    icon: 'text-emerald-500 dark:text-emerald-400',
  },
  warning: {
    container:
      'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200',
    icon: 'text-amber-500 dark:text-amber-400',
  },
  danger: {
    container:
      'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200',
    icon: 'text-rose-500 dark:text-rose-400',
  },
};

const defaultIcons: Record<AlertVariant, React.ReactNode> = {
  info: <Info className="h-5 w-5" />,
  success: <CheckCircle2 className="h-5 w-5" />,
  warning: <AlertTriangle className="h-5 w-5" />,
  danger: <AlertCircle className="h-5 w-5" />,
};

export const Alert: React.FC<AlertProps> = ({
  className,
  variant = 'info',
  onClose,
  icon,
  children,
  ...props
}) => {
  const styles = variantStyles[variant];

  return (
    <div
      role="alert"
      className={cn(
        'relative flex items-start gap-3 rounded-lg border p-4 text-sm transition-all',
        styles.container,
        className
      )}
      {...props}
    >
      <div className={cn('shrink-0 mt-0.5', styles.icon)}>{icon || defaultIcons[variant]}</div>
      <div className="flex-1 pr-6">{children}</div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-md p-1 opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-current"
          aria-label="Dismiss alert"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export const AlertTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => (
  <h5 className={cn('font-semibold leading-none tracking-tight mb-1', className)} {...props}>
    {children}
  </h5>
);

export const AlertDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn('text-sm opacity-90', className)} {...props}>
    {children}
  </div>
);
