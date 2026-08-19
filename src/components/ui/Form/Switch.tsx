import React, { forwardRef, useId } from 'react';
import { cn } from '@/utils/styles';

export type SwitchSize = 'sm' | 'md' | 'lg';

export interface SwitchProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size'
> {
  label?: React.ReactNode;
  description?: string;
  size?: SwitchSize;
}

const trackSizeMap: Record<SwitchSize, string> = {
  sm: 'h-4 w-7',
  md: 'h-6 w-11',
  lg: 'h-7 w-14',
};

const thumbSizeMap: Record<SwitchSize, string> = {
  sm: 'h-3 w-3 translate-x-0.5 peer-checked:translate-x-3.5',
  md: 'h-5 w-5 translate-x-0.5 peer-checked:translate-x-5.5',
  lg: 'h-6 w-6 translate-x-0.5 peer-checked:translate-x-7.5',
};

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      className,
      label,
      description,
      size = 'md',
      id: customId,
      disabled,
      checked,
      onChange,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const switchId = customId || generatedId;

    return (
      <label
        htmlFor={switchId}
        className={cn(
          'inline-flex items-start gap-3 cursor-pointer select-none text-sm text-slate-700 dark:text-slate-200',
          disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        <div className="relative flex items-center mt-0.5">
          <input
            ref={ref}
            type="checkbox"
            role="switch"
            id={switchId}
            disabled={disabled}
            checked={checked}
            onChange={onChange}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              'rounded-full transition-colors bg-slate-300 dark:bg-slate-700',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-[#8b5cf6] peer-focus-visible:ring-offset-2',
              'peer-checked:bg-[#7c3aed] dark:peer-checked:bg-[#8b5cf6]',
              trackSizeMap[size],
              className
            )}
          />
          <div
            className={cn(
              'absolute rounded-full bg-white transition-transform shadow-sm pointer-events-none',
              thumbSizeMap[size]
            )}
          />
        </div>
        {(label || description) && (
          <div className="flex flex-col">
            {label && <span className="font-medium">{label}</span>}
            {description && (
              <span className="text-xs text-slate-500 dark:text-slate-400">{description}</span>
            )}
          </div>
        )}
      </label>
    );
  }
);

Switch.displayName = 'Switch';
