import React, { forwardRef } from 'react';
import { cva, type VariantConfig } from '@/utils/styles';
import { Spinner } from '../Feedback/Spinner';

export type IconButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  isLoading?: boolean;
  icon: React.ReactNode;
}

const iconButtonVariantConfig: VariantConfig<{
  variant: Record<IconButtonVariant, string>;
  size: Record<IconButtonSize, string>;
}> = {
  base: 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#8b5cf6] disabled:opacity-50 disabled:pointer-events-none cursor-pointer rounded-md shrink-0 select-none',
  variants: {
    variant: {
      primary:
        'bg-[#7c3aed] text-white hover:bg-[#6d28d9] active:bg-[#5b21b6] dark:bg-[#8b5cf6] dark:hover:bg-[#7c3aed] shadow-sm',
      secondary:
        'bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700',
      outline:
        'border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800',
      ghost: 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
      danger: 'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-sm',
    },
    size: {
      sm: 'h-8 w-8 text-sm',
      md: 'h-10 w-10 text-base',
      lg: 'h-12 w-12 text-lg',
    },
  },
  defaultVariants: {
    variant: 'ghost',
    size: 'md',
  },
};

export const iconButtonVariants = cva(iconButtonVariantConfig);

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant = 'ghost',
      size = 'md',
      isLoading = false,
      icon,
      disabled,
      'aria-label': ariaLabel,
      type = 'button',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        aria-label={ariaLabel}
        disabled={disabled || isLoading}
        className={iconButtonVariants({ variant, size, className })}
        {...props}
      >
        {isLoading ? (
          <Spinner
            size="sm"
            variant={variant === 'primary' || variant === 'danger' ? 'white' : 'primary'}
          />
        ) : (
          icon
        )}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
