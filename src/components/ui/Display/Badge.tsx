import React from 'react';
import { cva, type VariantConfig } from '@/utils/styles';
import { X } from 'lucide-react';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'outline';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  onDismiss?: () => void;
}

const badgeVariantConfig: VariantConfig<{
  variant: Record<BadgeVariant, string>;
  size: Record<BadgeSize, string>;
}> = {
  base: 'inline-flex items-center font-medium rounded-full transition-colors select-none',
  variants: {
    variant: {
      default: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
      primary:
        'bg-violet-100 text-violet-800 dark:bg-violet-950/70 dark:text-violet-300 border border-violet-200 dark:border-violet-800',
      success:
        'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
      warning:
        'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
      danger:
        'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-200 dark:border-rose-800',
      outline: 'border border-slate-300 text-slate-700 dark:border-slate-700 dark:text-slate-300',
    },
    size: {
      sm: 'px-2 py-0.5 text-xs gap-1',
      md: 'px-2.5 py-1 text-xs gap-1.5',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'sm',
  },
};

export const badgeVariants = cva(badgeVariantConfig);

const dotColorMap: Record<BadgeVariant, string> = {
  default: 'bg-slate-500',
  primary: 'bg-violet-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-rose-500',
  outline: 'bg-slate-400',
};

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'sm',
  dot = false,
  onDismiss,
  children,
  ...props
}) => {
  return (
    <span className={badgeVariants({ variant, size, className })} {...props}>
      {dot && (
        <span className={`h-1.5 w-1.5 rounded-full ${dotColorMap[variant]}`} aria-hidden="true" />
      )}
      {children}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="ml-0.5 rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10 focus:outline-none"
          aria-label="Dismiss badge"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
};
