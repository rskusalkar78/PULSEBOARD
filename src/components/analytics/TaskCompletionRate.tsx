import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
} from 'recharts';
import type { TaskCompletionDataPoint } from '@/types/dashboard';
import { ChartContainer, ChartTooltip, ChartLegend, EmptyChartState } from './index';
import { formatChartValue, formatChartDate, chartColors } from './chartUtils';
import { cn } from '@/utils/styles';

export interface TaskCompletionRateProps {
  data: TaskCompletionDataPoint[];
  loading?: boolean;
  error?: string;
}

/**
 * Task completion rate chart showing completed, pending, and overdue tasks
 * Displays overall completion percentage trend with status breakdown
 */
export const TaskCompletionRate: React.FC<TaskCompletionRateProps> = ({
  data,
  loading = false,
  error,
}) => {
  if (error) {
    return (
      <ChartContainer
        title="Task Completion Rate"
        icon={<CheckCircle2 className="w-5 h-5" />}
        error={error}
        loading={false}
      >
        <div />
      </ChartContainer>
    );
  }

  if (!data || data.length === 0) {
    return (
      <ChartContainer
        title="Task Completion Rate"
        icon={<CheckCircle2 className="w-5 h-5" />}
        loading={loading}
      >
        <EmptyChartState
          title="No task data"
          description="Select a different time period to view task completion rates."
        />
      </ChartContainer>
    );
  }

  // Format data for chart
  const chartData = data.map((item) => ({
    ...item,
    displayDate: formatChartDate(item.date, 'short'),
  }));

  // Calculate statistics
  const totalCompleted = data.reduce((sum, d) => sum + d.tasksCompleted, 0);
  const totalPending = data.reduce((sum, d) => sum + d.tasksPending, 0);
  const totalOverdue = data.reduce((sum, d) => sum + d.tasksOverdue, 0);
  const totalTasks = totalCompleted + totalPending + totalOverdue;

  const completionRates = data.map((d) => d.completionRate);
  const avgCompletionRate = Math.round(
    completionRates.reduce((a, b) => a + b, 0) / completionRates.length
  );

  const maxCompletionRate = Math.max(...completionRates);
  const minCompletionRate = Math.min(...completionRates);

  return (
    <ChartContainer
      title="Task Completion Rate"
      description="Track task completion, pending, and overdue status"
      icon={<CheckCircle2 className="w-5 h-5" />}
      loading={loading}
    >
      <div className="space-y-6">
        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-4 border border-emerald-200 dark:border-emerald-900/50">
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-1">
              Completed
            </p>
            <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
              {totalCompleted}
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
              {totalTasks > 0 ? ((totalCompleted / totalTasks) * 100).toFixed(0) : 0}% of total
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-900/50">
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Pending</p>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{totalPending}</p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              {totalTasks > 0 ? ((totalPending / totalTasks) * 100).toFixed(0) : 0}% of total
            </p>
          </div>

          <div className="bg-rose-50 dark:bg-rose-950/30 rounded-lg p-4 border border-rose-200 dark:border-rose-900/50">
            <p className="text-sm font-medium text-rose-700 dark:text-rose-300 mb-1">Overdue</p>
            <p className="text-2xl font-bold text-rose-900 dark:text-rose-100">{totalOverdue}</p>
            <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">
              {totalTasks > 0 ? ((totalOverdue / totalTasks) * 100).toFixed(0) : 0}% of total
            </p>
          </div>

          <div className="bg-violet-50 dark:bg-violet-950/30 rounded-lg p-4 border border-violet-200 dark:border-violet-900/50">
            <p className="text-sm font-medium text-violet-700 dark:text-violet-300 mb-1">
              Avg Rate
            </p>
            <p className="text-2xl font-bold text-violet-900 dark:text-violet-100">
              {avgCompletionRate}%
            </p>
            <p className="text-xs text-violet-600 dark:text-violet-400 mt-1">overall</p>
          </div>
        </div>

        {/* Main Chart */}
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />

              <XAxis
                dataKey="displayDate"
                stroke="#94a3b8"
                style={{ fontSize: '12px' }}
                tick={{ fill: '#64748b' }}
              />

              <YAxis
                yAxisId="left"
                stroke="#94a3b8"
                style={{ fontSize: '12px' }}
                tick={{ fill: '#64748b' }}
              />

              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#94a3b8"
                style={{ fontSize: '12px' }}
                tick={{ fill: '#64748b' }}
              />

              <Tooltip
                content={<ChartTooltip formatter={(val) => formatChartValue(val)} />}
                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
              />

              {/* Stacked Bars for Task Status */}
              <Bar
                yAxisId="left"
                dataKey="tasksCompleted"
                fill={chartColors.success}
                name="Completed"
                stackId="tasks"
                radius={[8, 0, 0, 8]}
              />
              <Bar
                yAxisId="left"
                dataKey="tasksPending"
                fill={chartColors.info}
                name="Pending"
                stackId="tasks"
              />
              <Bar
                yAxisId="left"
                dataKey="tasksOverdue"
                fill={chartColors.danger}
                name="Overdue"
                stackId="tasks"
                radius={[0, 8, 8, 0]}
              />

              {/* Completion Rate Line */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="completionRate"
                stroke={chartColors.primary}
                name="Completion Rate %"
                strokeWidth={3}
                dot={{
                  fill: chartColors.primary,
                  r: 5,
                }}
                activeDot={{
                  r: 7,
                }}
              />

              <Legend
                content={<ChartLegend variant="horizontal" />}
                wrapperStyle={{ paddingTop: '20px' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Insights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Best Performance</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {maxCompletionRate}%
            </p>
          </div>

          <div className="text-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total Tasks</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{totalTasks}</p>
          </div>

          <div className="text-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Lowest Performance</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {minCompletionRate}%
            </p>
          </div>
        </div>

        {/* Health Indicator */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Task Health Score
            </h4>
            <span
              className={cn(
                'text-lg font-bold',
                avgCompletionRate >= 80
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : avgCompletionRate >= 60
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-rose-600 dark:text-rose-400'
              )}
            >
              {avgCompletionRate}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-slate-300 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                avgCompletionRate >= 80
                  ? 'bg-emerald-500'
                  : avgCompletionRate >= 60
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
              )}
              style={{ width: `${avgCompletionRate}%` }}
            />
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
            {avgCompletionRate >= 80
              ? '✓ Excellent completion rate'
              : avgCompletionRate >= 60
                ? '⚠ Good completion rate, room for improvement'
                : '✗ Low completion rate, needs attention'}
          </p>
        </div>
      </div>
    </ChartContainer>
  );
};
