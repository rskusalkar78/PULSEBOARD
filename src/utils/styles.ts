/**
 * Utility functions for class names composition and variant management.
 */

export type ClassValue =
  string | number | boolean | undefined | null | Record<string, boolean> | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === 'string' || typeof input === 'number') {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      const inner = cn(...input);
      if (inner) classes.push(inner);
    } else if (typeof input === 'object') {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key);
      }
    }
  }

  return classes.join(' ').replace(/\s+/g, ' ').trim();
}

/**
 * Lightweight CVA (Class Variance Authority) pattern implementation.
 */
export type VariantConfig<T extends Record<string, Record<string, string>>> = {
  base?: string;
  variants?: T;
  defaultVariants?: {
    [K in keyof T]?: keyof T[K];
  };
};

export function cva<T extends Record<string, Record<string, string>>>(config: VariantConfig<T>) {
  return (
    props?: { [K in keyof T]?: keyof T[K] | undefined } & { className?: string | undefined }
  ): string => {
    const { base = '', variants = {} as T, defaultVariants = {} } = config;
    const result: string[] = [base];

    const mergedProps = { ...defaultVariants, ...props };

    for (const [variantKey, variantOptions] of Object.entries(variants)) {
      const selectedValue = (mergedProps as Record<string, unknown>)[variantKey];
      if (selectedValue && typeof selectedValue === 'string' && variantOptions[selectedValue]) {
        result.push(variantOptions[selectedValue]);
      }
    }

    if (props?.className) {
      result.push(props.className);
    }

    return cn(...result);
  };
}
