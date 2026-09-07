import React from 'react';
import { cn } from '@/utils/styles';

export interface CustomChartTooltipProps {
  active?: boolean;
  payload?: Array<{ color?: string; name?: string; value?: number }>;
  label?: string | number;
  variant?: 'default' | 'compact';
  formatter?: (value: number, name: string) => string;
}

/**
 * Accessible custom tooltip for Recharts charts
 * Provides consistent styling and readable formatting
 */
export const ChartTooltip: React.FC<CustomChartTooltipProps> = ({
  active,
  payload,
  label,
  variant = 'default',
  formatter,
}) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const isCompact = variant === 'compact';

  return (
    <div
      className={cn(
        'rounded-lg border shadow-lg',
        'bg-white dark:bg-slate-900',
        'border-slate-200 dark:border-slate-800',
        isCompact ? 'p-2' : 'p-3'
      )}
      role="tooltip"
    >
      {label && (
        <p
          className={cn(
            'font-medium text-slate-900 dark:text-slate-100',
            isCompact ? 'text-xs' : 'text-sm'
          )}
        >
          {label}
        </p>
      )}

      <div className={cn('space-y-1', !isCompact && 'mt-2')}>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{
                backgroundColor: entry.color || '#64748b',
              }}
              aria-hidden="true"
            />
            <div className="flex items-center justify-between gap-3">
              <span
                className={cn(
                  'text-slate-600 dark:text-slate-400',
                  isCompact ? 'text-xs' : 'text-sm'
                )}
              >
                {entry.name}
              </span>
              <span
                className={cn(
                  'font-semibold text-slate-900 dark:text-slate-100',
                  isCompact ? 'text-xs' : 'text-sm'
                )}
              >
                {formatter ? formatter(entry.value as number, entry.name as string) : entry.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
