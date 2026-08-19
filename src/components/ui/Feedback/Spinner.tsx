import React from 'react';
import { cn } from '@/utils/styles';

export type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerVariant = 'primary' | 'white' | 'slate';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  label?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-3',
  xl: 'h-12 w-12 border-4',
};

const variantClasses: Record<SpinnerVariant, string> = {
  primary:
    'border-t-[#7c3aed] border-r-transparent border-b-[#7c3aed] border-l-transparent dark:border-t-[#8b5cf6] dark:border-b-[#8b5cf6]',
  white: 'border-t-white border-r-transparent border-b-white border-l-transparent',
  slate:
    'border-t-slate-600 border-r-transparent border-b-slate-600 border-l-transparent dark:border-t-slate-400 dark:border-b-slate-400',
};

export const Spinner: React.FC<SpinnerProps> = ({
  className,
  size = 'md',
  variant = 'primary',
  label = 'Loading...',
  ...props
}) => {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn(
        'inline-block animate-spin rounded-full shrink-0',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      <span className="sr-only">{label}</span>
    </div>
  );
};
