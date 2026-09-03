import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/utils/styles';
import { Card, CardContent } from '@/components/ui/Display/Card';

export interface KPICardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    label: string;
  };
  loading?: boolean;
}

const variantConfig = {
  primary: {
    bg: 'bg-violet-50 dark:bg-violet-950/30',
    border: 'border-violet-200 dark:border-violet-900/50',
    label: 'text-violet-700 dark:text-violet-300',
    value: 'text-violet-900 dark:text-violet-100',
    icon: 'text-violet-600 dark:text-violet-400',
    trend: {
      up: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30',
      down: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30',
      neutral: 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/30',
    },
  },
  success: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-200 dark:border-emerald-900/50',
    label: 'text-emerald-700 dark:text-emerald-300',
    value: 'text-emerald-900 dark:text-emerald-100',
    icon: 'text-emerald-600 dark:text-emerald-400',
    trend: {
      up: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30',
      down: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30',
      neutral: 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/30',
    },
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-900/50',
    label: 'text-amber-700 dark:text-amber-300',
    value: 'text-amber-900 dark:text-amber-100',
    icon: 'text-amber-600 dark:text-amber-400',
    trend: {
      up: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30',
      down: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30',
      neutral: 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/30',
    },
  },
  danger: {
    bg: 'bg-rose-50 dark:bg-rose-950/30',
    border: 'border-rose-200 dark:border-rose-900/50',
    label: 'text-rose-700 dark:text-rose-300',
    value: 'text-rose-900 dark:text-rose-100',
    icon: 'text-rose-600 dark:text-rose-400',
    trend: {
      up: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30',
      down: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30',
      neutral: 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/30',
    },
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-200 dark:border-blue-900/50',
    label: 'text-blue-700 dark:text-blue-300',
    value: 'text-blue-900 dark:text-blue-100',
    icon: 'text-blue-600 dark:text-blue-400',
    trend: {
      up: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30',
      down: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30',
      neutral: 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/30',
    },
  },
};

const getTrendIcon = (direction: 'up' | 'down' | 'neutral') => {
  switch (direction) {
    case 'up':
      return <TrendingUp className="h-4 w-4" />;
    case 'down':
      return <TrendingDown className="h-4 w-4" />;
    default:
      return <Minus className="h-4 w-4" />;
  }
};

export const KPICard: React.FC<KPICardProps> = ({
  className,
  label,
  value,
  icon,
  variant = 'primary',
  trend,
  loading = false,
  ...props
}) => {
  const config = variantConfig[variant];

  return (
    <Card
      className={cn(
        'border',
        config.bg,
        config.border,
        'hover:shadow-md transition-all duration-300',
        className
      )}
      {...props}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Label */}
            <p className={cn('text-sm font-medium mb-3', config.label)}>{label}</p>

            {/* Value */}
            {loading ? (
              <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg w-2/3 animate-pulse" />
            ) : (
              <p className={cn('text-3xl font-bold tracking-tight', config.value)}>{value}</p>
            )}

            {/* Trend */}
            {trend && !loading && (
              <div
                className={cn(
                  'flex items-center gap-1 mt-3 text-sm font-medium px-2 py-1 rounded-lg w-fit',
                  config.trend[trend.direction]
                )}
              >
                {getTrendIcon(trend.direction)}
                <span>
                  {trend.value > 0 ? '+' : ''}
                  {trend.value}%
                </span>
                <span className="text-xs opacity-75">{trend.label}</span>
              </div>
            )}
          </div>

          {/* Icon */}
          {icon && !loading && (
            <div
              className={cn(
                'flex-shrink-0 h-12 w-12 rounded-lg flex items-center justify-center',
                config.bg
              )}
            >
              <div className={cn('text-xl', config.icon)}>{icon}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
