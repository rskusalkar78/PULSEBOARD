import { forwardRef, useState, useId } from 'react';

import { Eye, EyeOff, Lock } from 'lucide-react';
import { cn } from '@/utils/styles';
import type { InputProps } from './Input';

export interface PasswordInputProps extends Omit<InputProps, 'type'> {
  showLeftIcon?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      showLeftIcon = true,
      fullWidth = true,
      id: customId,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = customId || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth ? 'w-full' : 'w-auto')}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1"
          >
            {label}
            {required && (
              <span className="text-rose-500" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {showLeftIcon && (
            <div className="absolute left-3 text-slate-400 dark:text-slate-500 pointer-events-none flex items-center">
              <Lock className="h-4 w-4" />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={showPassword ? 'text' : 'password'}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={cn(
              'h-10 w-full rounded-md border bg-white dark:bg-slate-900 px-3 text-sm transition-colors text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6] focus-visible:border-transparent',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-slate-800',
              error
                ? 'border-rose-500 focus-visible:ring-rose-500'
                : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600',
              showLeftIcon ? 'pl-10' : '',
              'pr-10',
              className
            )}
            {...props}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            disabled={disabled}
            tabIndex={0}
            className="absolute right-3 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6] rounded p-0.5 transition-colors disabled:opacity-50"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {error ? (
          <p
            id={errorId}
            role="alert"
            className="text-xs font-medium text-rose-500 animate-in fade-in-50"
          >
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-xs text-slate-500 dark:text-slate-400">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
