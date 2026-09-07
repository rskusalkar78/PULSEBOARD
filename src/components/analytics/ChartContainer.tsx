import React from 'react';
import { Spinner } from '@/components/ui/Feedback/Spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Display/Card';
import { cn } from '@/utils/styles';

export interface ChartContainerProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

/**
 * Wrapper component for chart cards with loading and error states
 * Provides consistent styling and accessibility
 */
export const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  description,
  icon,
  loading = false,
  error,
  children,
  className,
  contentClassName,
}) => {
  return (
    <Card className={cn('border border-slate-200 dark:border-slate-800', className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 flex-1">
            {icon && <div className="text-slate-600 dark:text-slate-400">{icon}</div>}
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              {description && (
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{description}</p>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        )}

        {error && !loading && (
          <div className="flex items-center justify-center py-12 bg-rose-50 dark:bg-rose-950/30 rounded-lg border border-rose-200 dark:border-rose-900/50">
            <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className={cn('overflow-x-auto', contentClassName)}>{children}</div>
        )}
      </CardContent>
    </Card>
  );
};
