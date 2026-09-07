import React from 'react';
import { cn } from '@/utils/styles';

export interface ChartSkeletonProps {
  className?: string;
  lines?: number;
}

/**
 * Loading skeleton for chart containers
 */
export const ChartSkeleton: React.FC<ChartSkeletonProps> = ({ className, lines = 5 }) => {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Title skeleton */}
      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3 animate-pulse" />

      {/* Chart area skeleton */}
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-8 bg-slate-200 dark:bg-slate-800 rounded animate-pulse',
              i % 3 === 0 ? 'w-full' : i % 2 === 0 ? 'w-5/6' : 'w-4/5'
            )}
          />
        ))}
      </div>

      {/* Legend skeleton */}
      <div className="flex gap-4 pt-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
};
