import React from 'react';
import { BarChart3 } from 'lucide-react';
import { cn } from '@/utils/styles';

export interface EmptyChartStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

/**
 * Empty state component for charts when no data is available
 */
export const EmptyChartState: React.FC<EmptyChartStateProps> = ({
  title = 'No data available',
  description = 'There is no data to display for the selected period.',
  icon,
  className,
}) => {
  return (
    <div
      className={cn('flex flex-col items-center justify-center py-12', className)}
      role="status"
      aria-label="Empty chart state"
    >
      <div className="text-slate-400 dark:text-slate-600 mb-4">
        {icon || <BarChart3 className="w-12 h-12" />}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center max-w-xs">
        {description}
      </p>
    </div>
  );
};
