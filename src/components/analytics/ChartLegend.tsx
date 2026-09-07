import React from 'react';
import { cn } from '@/utils/styles';

export interface CustomChartLegendProps {
  payload?: Array<{ color?: string; value?: string | number }>;
  variant?: 'horizontal' | 'vertical';
  compact?: boolean;
}

/**
 * Accessible custom legend for Recharts charts
 * Supports horizontal and vertical layouts
 */
export const ChartLegend: React.FC<CustomChartLegendProps> = ({
  payload,
  variant = 'horizontal',
  compact = false,
}) => {
  if (!payload || !payload.length) {
    return null;
  }

  const isVertical = variant === 'vertical';

  return (
    <div
      className={cn(
        'flex items-center justify-center',
        isVertical ? 'flex-col items-start gap-3' : 'flex-wrap gap-4'
      )}
      role="group"
      aria-label="Chart legend"
    >
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className={cn('rounded flex-shrink-0', compact ? 'w-2 h-2' : 'w-3 h-3')}
            style={{
              backgroundColor: entry.color || '#64748b',
            }}
            aria-hidden="true"
          />
          <span
            className={cn(
              'text-slate-700 dark:text-slate-300',
              compact ? 'text-xs' : 'text-sm font-medium'
            )}
          >
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};
