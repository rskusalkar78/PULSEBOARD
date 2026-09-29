/**
 * Styles Utility Tests
 */

import { describe, it, expect } from 'vitest';
import { cn, cva } from '../styles';

describe('cn (className composition)', () => {
  it('combines string class names', () => {
    expect(cn('foo', 'bar', 'baz')).toBe('foo bar baz');
  });

  it('ignores falsy values', () => {
    expect(cn('foo', null, 'bar', undefined, 'baz', false, '')).toBe('foo bar baz');
  });

  it('handles number inputs', () => {
    expect(cn('class', 0, 'other')).toBe('class 0 other');
    expect(cn('class', 42, 'other')).toBe('class 42 other');
  });

  it('handles object with boolean values', () => {
    expect(
      cn({
        'class-a': true,
        'class-b': false,
        'class-c': true,
      })
    ).toBe('class-a class-c');
  });

  it('handles nested arrays', () => {
    expect(cn('base', ['foo', 'bar'], ['baz', ['nested']])).toBe('base foo bar baz nested');
  });

  it('handles arrays with falsy values', () => {
    expect(cn(['foo', false, 'bar', null, 'baz'])).toBe('foo bar baz');
  });

  it('handles mixed types', () => {
    expect(cn('base', { active: true, disabled: false }, ['nested', 'array'], null, 'final')).toBe(
      'base active nested array final'
    );
  });

  it('collapses multiple spaces into single space', () => {
    expect(cn('foo    bar', '  baz  ')).toBe('foo bar baz');
  });

  it('trims whitespace from result', () => {
    expect(cn('  foo  ', '  bar  ')).toBe('foo bar');
  });

  it('returns empty string for all falsy inputs', () => {
    expect(cn(null, undefined, false, '')).toBe('');
  });

  it('handles empty array', () => {
    expect(cn([])).toBe('');
  });

  it('handles complex real-world scenario', () => {
    const isActive = true;
    const isDisabled = false;
    const customClass = 'custom-override';

    const result = cn(
      'btn btn-base',
      {
        'btn-active': isActive,
        'btn-disabled': isDisabled,
      },
      isActive && 'active-state',
      !isDisabled && 'enabled',
      [customClass, 'additional']
    );

    expect(result).toBe('btn btn-base btn-active active-state enabled custom-override additional');
  });
});

describe('cva (Class Variance Authority)', () => {
  it('returns base classes with no variants', () => {
    const button = cva({ base: 'btn' });
    expect(button()).toBe('btn');
  });

  it('returns empty string for no base and no variants', () => {
    const component = cva({});
    expect(component()).toBe('');
  });

  it('applies variant classes', () => {
    const button = cva({
      base: 'btn',
      variants: {
        color: {
          primary: 'btn-primary',
          secondary: 'btn-secondary',
        },
      },
    });

    expect(button({ color: 'primary' })).toBe('btn btn-primary');
    expect(button({ color: 'secondary' })).toBe('btn btn-secondary');
  });

  it('applies multiple variants', () => {
    const button = cva({
      base: 'btn',
      variants: {
        color: {
          primary: 'btn-primary',
          secondary: 'btn-secondary',
        },
        size: {
          sm: 'btn-sm',
          lg: 'btn-lg',
        },
      },
    });

    expect(button({ color: 'primary', size: 'sm' })).toBe('btn btn-primary btn-sm');
    expect(button({ color: 'secondary', size: 'lg' })).toBe('btn btn-secondary btn-lg');
  });

  it('applies default variants when no props provided', () => {
    const button = cva({
      base: 'btn',
      variants: {
        color: {
          primary: 'btn-primary',
          secondary: 'btn-secondary',
        },
        size: {
          md: 'btn-md',
          lg: 'btn-lg',
        },
      },
      defaultVariants: {
        color: 'primary',
        size: 'md',
      },
    });

    expect(button()).toBe('btn btn-primary btn-md');
  });

  it('props override default variants', () => {
    const button = cva({
      base: 'btn',
      variants: {
        color: {
          primary: 'btn-primary',
          secondary: 'btn-secondary',
        },
      },
      defaultVariants: {
        color: 'primary',
      },
    });

    expect(button({ color: 'secondary' })).toBe('btn btn-secondary');
  });

  it('appends custom className prop', () => {
    const button = cva({
      base: 'btn',
      variants: {
        color: {
          primary: 'btn-primary',
        },
      },
    });

    expect(button({ color: 'primary', className: 'custom-class' })).toBe(
      'btn btn-primary custom-class'
    );
  });

  it('ignores invalid variant values', () => {
    const button = cva({
      base: 'btn',
      variants: {
        color: {
          primary: 'btn-primary',
          secondary: 'btn-secondary',
        },
      },
    });

    // @ts-expect-error Testing runtime behavior with invalid value
    expect(button({ color: 'invalid' })).toBe('btn');
  });

  it('handles variant with undefined value', () => {
    const button = cva({
      base: 'btn',
      variants: {
        color: {
          primary: 'btn-primary',
        },
      },
    });

    expect(button({ color: undefined })).toBe('btn');
  });

  it('works without base classes', () => {
    const component = cva({
      variants: {
        type: {
          foo: 'type-foo',
          bar: 'type-bar',
        },
      },
    });

    expect(component({ type: 'foo' })).toBe('type-foo');
  });

  it('works without variants', () => {
    const component = cva({
      base: 'component-base extra-class',
    });

    expect(component()).toBe('component-base extra-class');
  });

  it('handles complex real-world button component', () => {
    const button = cva({
      base: 'inline-flex items-center justify-center rounded font-medium transition-colors',
      variants: {
        variant: {
          primary: 'bg-blue-600 text-white hover:bg-blue-700',
          secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
          ghost: 'hover:bg-gray-100',
        },
        size: {
          sm: 'h-8 px-3 text-sm',
          md: 'h-10 px-4 text-base',
          lg: 'h-12 px-6 text-lg',
        },
        fullWidth: {
          true: 'w-full',
          false: 'w-auto',
        },
      },
      defaultVariants: {
        variant: 'primary',
        size: 'md',
        fullWidth: false,
      },
    });

    const result = button({
      variant: 'secondary',
      size: 'lg',
      fullWidth: true,
      className: 'my-custom-class',
    });

    expect(result).toContain('inline-flex');
    expect(result).toContain('bg-gray-200');
    expect(result).toContain('h-12');
    expect(result).toContain('w-full');
    expect(result).toContain('my-custom-class');
  });

  it('combines with cn correctly', () => {
    const button = cva({
      base: 'btn',
      variants: {
        color: {
          primary: 'btn-primary',
        },
      },
    });

    const result = cn(button({ color: 'primary' }), 'additional-class', {
      active: true,
      disabled: false,
    });

    expect(result).toBe('btn btn-primary additional-class active');
  });
});
