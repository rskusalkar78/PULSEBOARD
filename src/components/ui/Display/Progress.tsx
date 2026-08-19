import React from 'react';
import { cn } from '@/utils/styles';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number; // 0 to 100
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
  indeterminate?: boolean;
}

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

const variantClasses = {
  primary: 'bg-[#7c3aed] dark:bg-[#8b5cf6]',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-rose-500',
};

export const Progress: React.FC<ProgressProps> = ({
  className,
  value = 0,
  max = 100,
  size = 'md',
  variant = 'primary',
  showLabel = false,
  indeterminate = false,
  ...props
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="w-full flex flex-col gap-1">
      {showLabel && (
        <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : Math.round(percentage)}
        aria-valuemin={0}
        aria-valuemax={max}
        className={cn(
          'w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        <div
          className={cn(
            'h-full transition-all duration-300 ease-in-out rounded-full',
            variantClasses[variant],
            indeterminate && 'w-full animate-pulse'
          )}
          style={{ width: indeterminate ? '100%' : `${percentage}%` }}
        />
      </div>
    </div>
  );
};
