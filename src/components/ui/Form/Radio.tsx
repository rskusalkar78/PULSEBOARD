import React, { createContext, useContext, useId } from 'react';
import { cn } from '@/utils/styles';

// RadioGroup Context
interface RadioGroupContextValue {
  name?: string | undefined;
  value?: string | number | undefined;
  onChange?: ((value: string) => void) | undefined;
  disabled?: boolean | undefined;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps {
  name?: string;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
  label?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name: customName,
  value,
  onChange,
  children,
  className,
  label,
  helperText,
  error,
  disabled = false,
  orientation = 'vertical',
}) => {
  const generatedName = useId();
  const name = customName || generatedName;

  return (
    <RadioGroupContext.Provider value={{ name, value, onChange, disabled }}>
      <div className="flex flex-col gap-1.5" role="radiogroup" aria-label={label}>
        {label && (
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
        )}
        <div
          className={cn(
            'flex gap-3',
            orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap items-center',
            className
          )}
        >
          {children}
        </div>
        {error ? (
          <p className="text-xs font-medium text-rose-500">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
        ) : null}
      </div>
    </RadioGroupContext.Provider>
  );
};

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  value: string;
  label?: React.ReactNode;
  description?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    { className, value, label, description, disabled: customDisabled, id: customId, ...props },
    ref
  ) => {
    const context = useContext(RadioGroupContext);
    const generatedId = useId();
    const radioId = customId || generatedId;

    const disabled = customDisabled || context?.disabled;
    const isChecked = context ? context.value === value : props.checked;
    const name = context ? context.name : props.name;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (props.onChange) props.onChange(e);
      if (context?.onChange) context.onChange(value);
    };

    return (
      <label
        htmlFor={radioId}
        className={cn(
          'inline-flex items-start gap-2.5 cursor-pointer select-none text-sm text-slate-700 dark:text-slate-200',
          disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            ref={ref}
            type="radio"
            id={radioId}
            name={name}
            value={value}
            checked={isChecked}
            disabled={disabled}
            onChange={handleChange}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              'h-4 w-4 rounded-full border transition-colors flex items-center justify-center bg-white dark:bg-slate-900',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-[#8b5cf6] peer-focus-visible:ring-offset-2',
              'border-slate-300 dark:border-slate-700 peer-hover:border-slate-400 dark:peer-hover:border-slate-600',
              'peer-checked:border-[#7c3aed] dark:peer-checked:border-[#8b5cf6]',
              className
            )}
          >
            <div
              className={cn(
                'h-2 w-2 rounded-full bg-[#7c3aed] dark:bg-[#8b5cf6] scale-0 peer-checked:scale-100 transition-transform'
              )}
            />
          </div>
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

Radio.displayName = 'Radio';
