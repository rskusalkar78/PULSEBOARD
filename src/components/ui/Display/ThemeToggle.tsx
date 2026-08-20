/**
 * ThemeToggle — PulseBoard
 *
 * A polished 3-way toggle for Light / System / Dark themes.
 * Accessible, animated, and wired to ThemeContext.
 */

import { type JSX } from 'react';
import { Sun, Monitor, Moon } from 'lucide-react';
import { useTheme, type ThemeMode } from '@/context/ThemeContext';
import { cn } from '@/utils/styles';

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface ThemeToggleProps {
  /** Visual size of the control. */
  size?: 'sm' | 'md';
  /** Additional CSS classes on the wrapper. */
  className?: string;
}

interface Option {
  mode: ThemeMode;
  Icon: typeof Sun;
  label: string;
  title: string;
}

/* -------------------------------------------------------------------------- */
/*  Data                                                                       */
/* -------------------------------------------------------------------------- */

const OPTIONS: Option[] = [
  { mode: 'light', Icon: Sun, label: 'Light', title: 'Switch to light theme' },
  { mode: 'system', Icon: Monitor, label: 'System', title: 'Follow system theme' },
  { mode: 'dark', Icon: Moon, label: 'Dark', title: 'Switch to dark theme' },
];

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export function ThemeToggle({ size = 'md', className }: ThemeToggleProps): JSX.Element {
  const { mode, setMode } = useTheme();

  const isSmall = size === 'sm';

  return (
    <div
      role="group"
      aria-label="Theme selector"
      className={cn(
        'inline-flex items-center rounded-full p-[3px]',
        'bg-[var(--pb-bg-muted)] border border-[var(--pb-border)]',
        'shadow-[var(--pb-shadow-sm)]',
        className
      )}
    >
      {OPTIONS.map(({ mode: optionMode, Icon, label, title }) => {
        const isActive = mode === optionMode;

        return (
          <button
            key={optionMode}
            type="button"
            title={title}
            aria-label={title}
            aria-pressed={isActive}
            onClick={() => setMode(optionMode)}
            style={{
              transition:
                'background-color var(--pb-duration-normal) var(--pb-ease-out),' +
                'color var(--pb-duration-normal) var(--pb-ease-out),' +
                'box-shadow var(--pb-duration-normal) var(--pb-ease-out)',
            }}
            className={cn(
              'relative flex items-center gap-1.5 rounded-full font-medium',
              'focus-visible:outline-none focus-visible:ring-2',
              'focus-visible:ring-[var(--pb-ring-color)]',
              'focus-visible:ring-offset-1',
              'focus-visible:ring-offset-[var(--pb-bg-muted)]',
              'cursor-pointer select-none',
              /* Size variants */
              isSmall ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs',
              /* Active vs inactive */
              isActive
                ? [
                    'bg-[var(--pb-bg-surface)]',
                    'text-[var(--pb-primary-text)]',
                    'shadow-[var(--pb-shadow-sm)]',
                    'border border-[var(--pb-border-hover)]',
                  ]
                : [
                    'bg-transparent',
                    'text-[var(--pb-text-muted)]',
                    'border border-transparent',
                    'hover:text-[var(--pb-text-secondary)]',
                    'hover:bg-[var(--pb-bg-surface)]/50',
                  ]
            )}
          >
            <Icon
              aria-hidden="true"
              className={cn(
                isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5',
                isActive && 'text-[var(--pb-primary)]'
              )}
            />
            <span className={cn('leading-none', isSmall && 'sr-only')}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default ThemeToggle;
