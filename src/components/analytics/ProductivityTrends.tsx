import React from 'react';
import { TrendingUp } from 'lucide-react';
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
import type { ProductivityTrendDataPoint } from '@/types/dashboard';
import { ChartContainer, ChartTooltip, ChartLegend, EmptyChartState } from './index';
import { formatChartValue, formatChartDate, chartColors } from './chartUtils';

export interface ProductivityTrendsProps {
  data: ProductivityTrendDataPoint[];
  loading?: boolean;
  error?: string;
}

/**
 * Productivity trends chart showing tasks completed and efficiency over time
 * Combines line chart for productivity score with bar chart for tasks completed
 */
export const ProductivityTrends: React.FC<ProductivityTrendsProps> = ({
  data,
  loading = false,
  error,
}) => {
  if (error) {
    return (
      <ChartContainer
        title="Productivity Trends"
        icon={<TrendingUp className="w-5 h-5" />}
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
        title="Productivity Trends"
        icon={<TrendingUp className="w-5 h-5" />}
        loading={loading}
      >
        <EmptyChartState
          title="No productivity data"
          description="Select a different time period to view productivity trends."
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
  const tasksCompletedValues = data.map((d) => d.tasksCompleted);
  const avgTasksCompleted = Math.round(
    tasksCompletedValues.reduce((a, b) => a + b, 0) / tasksCompletedValues.length
  );

  const efficiencyValues = data.map((d) => d.efficiency);
  const avgEfficiency = Math.round(
    efficiencyValues.reduce((a, b) => a + b, 0) / efficiencyValues.length
  );

  return (
    <ChartContainer
      title="Productivity Trends"
      description="Track tasks completed and efficiency over time"
      icon={<TrendingUp className="w-5 h-5" />}
      loading={loading}
    >
      <div className="space-y-6">
        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-violet-50 dark:bg-violet-950/30 rounded-lg p-4 border border-violet-200 dark:border-violet-900/50">
            <p className="text-sm font-medium text-violet-700 dark:text-violet-300 mb-1">
              Avg Tasks Completed
            </p>
            <p className="text-2xl font-bold text-violet-900 dark:text-violet-100">
              {avgTasksCompleted}
            </p>
            <p className="text-xs text-violet-600 dark:text-violet-400 mt-1">per day</p>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-4 border border-emerald-200 dark:border-emerald-900/50">
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-1">
              Avg Efficiency
            </p>
            <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
              {avgEfficiency}%
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">overall</p>
          </div>
        </div>

        {/* Main Chart */}
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
              <defs>
                <linearGradient id="taskGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.1} />
                  <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="efficiencyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColors.success} stopOpacity={0.1} />
                  <stop offset="95%" stopColor={chartColors.success} stopOpacity={0} />
                </linearGradient>
              </defs>

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

              {/* Tasks Completed as Bar Chart */}
              <Bar
                yAxisId="left"
                dataKey="tasksCompleted"
                fill={chartColors.primary}
                name="Tasks Completed"
                opacity={0.8}
                radius={[8, 8, 0, 0]}
              />

              {/* Efficiency as Line Chart */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="efficiency"
                stroke={chartColors.success}
                name="Efficiency %"
                strokeWidth={2}
                dot={{
                  fill: chartColors.success,
                  r: 4,
                }}
                activeDot={{
                  r: 6,
                }}
              />

              <Legend
                content={<ChartLegend variant="horizontal" />}
                wrapperStyle={{ paddingTop: '20px' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Additional metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total Tasks</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {tasksCompletedValues.reduce((a, b) => a + b, 0)}
            </p>
          </div>

          <div className="text-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Peak Day</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {Math.max(...tasksCompletedValues)}
            </p>
          </div>

          <div className="text-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Lowest Day</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {Math.min(...tasksCompletedValues)}
            </p>
          </div>
        </div>
      </div>
    </ChartContainer>
  );
};
