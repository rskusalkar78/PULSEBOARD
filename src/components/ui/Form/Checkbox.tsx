import React, { forwardRef, useEffect, useRef, useId } from 'react';
import { cn } from '@/utils/styles';
import { Check, Minus } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  helperText?: string;
  error?: string;
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      indeterminate = false,
      id: customId,
      disabled,
      checked,
      onChange,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const checkboxId = customId || generatedId;
    const innerRef = useRef<HTMLInputElement | null>(null);

    const setRefs = (element: HTMLInputElement | null) => {
      innerRef.current = element;
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLInputElement | null>).current = element;
      }
    };

    useEffect(() => {
      if (innerRef.current) {
        innerRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    return (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={checkboxId}
          className={cn(
            'inline-flex items-start gap-2.5 cursor-pointer select-none text-sm font-medium text-slate-700 dark:text-slate-200',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          <div className="relative flex items-center justify-center mt-0.5">
            <input
              type="checkbox"
              ref={setRefs}
              id={checkboxId}
              disabled={disabled}
              checked={checked}
              onChange={onChange}
              className="peer sr-only"
              {...props}
            />
            <div
              className={cn(
                'h-4 w-4 rounded border transition-colors flex items-center justify-center bg-white dark:bg-slate-900',
                'peer-focus-visible:ring-2 peer-focus-visible:ring-[#8b5cf6] peer-focus-visible:ring-offset-2',
                error
                  ? 'border-rose-500'
                  : 'border-slate-300 dark:border-slate-700 peer-hover:border-slate-400 dark:peer-hover:border-slate-600',
                'peer-checked:bg-[#7c3aed] peer-checked:border-[#7c3aed] dark:peer-checked:bg-[#8b5cf6] dark:peer-checked:border-[#8b5cf6] peer-checked:text-white',
                indeterminate &&
                  'bg-[#7c3aed] border-[#7c3aed] dark:bg-[#8b5cf6] dark:border-[#8b5cf6] text-white',
                className
              )}
            >
              {indeterminate ? (
                <Minus className="h-3 w-3 stroke-[3]" />
              ) : (
                <Check className="h-3 w-3 stroke-[3] opacity-0 peer-checked:opacity-100 transition-opacity" />
              )}
            </div>
          </div>
          {label && <span>{label}</span>}
        </label>
        {error ? (
          <p className="text-xs font-medium text-rose-500 pl-6">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 pl-6">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
