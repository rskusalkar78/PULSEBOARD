import React, { forwardRef } from 'react';
import { cva, type VariantConfig } from '@/utils/styles';
import { cn } from '@/utils/styles';
import { Spinner } from '../Feedback/Spinner';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const buttonVariantConfig: VariantConfig<{
  variant: Record<ButtonVariant, string>;
  size: Record<ButtonSize, string>;
}> = {
  base: 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#8b5cf6] disabled:opacity-50 disabled:pointer-events-none cursor-pointer rounded-md select-none',
  variants: {
    variant: {
      primary:
        'bg-[#7c3aed] text-white hover:bg-[#6d28d9] active:bg-[#5b21b6] dark:bg-[#8b5cf6] dark:hover:bg-[#7c3aed] shadow-sm',
      secondary:
        'bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
      outline:
        'border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800',
      ghost: 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
      danger: 'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-sm',
      link: 'text-[#7c3aed] dark:text-[#a78bfa] underline-offset-4 hover:underline p-0 h-auto',
    },
    size: {
      sm: 'h-8 px-3 text-xs gap-1.5',
      md: 'h-10 px-4 text-sm gap-2',
      lg: 'h-12 px-6 text-base gap-2.5',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
};

export const buttonVariants = cva(buttonVariantConfig);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={buttonVariants({
          variant,
          size: variant === 'link' ? undefined : size,
          className: cn(fullWidth && 'w-full', className),
        })}
        {...props}
      >
        {isLoading ? (
          <Spinner
            size={size === 'lg' ? 'md' : 'sm'}
            variant={variant === 'primary' || variant === 'danger' ? 'white' : 'primary'}
          />
        ) : (
          leftIcon
        )}
        {children && <span>{children}</span>}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
