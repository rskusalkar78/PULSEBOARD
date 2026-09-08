import React from 'react';
import { Calendar } from 'lucide-react';
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
import type { WeeklyMonthlyComparisonPoint } from '@/types/dashboard';
import { ChartContainer, ChartTooltip, ChartLegend, EmptyChartState } from './index';
import { formatChartValue, chartColors } from './chartUtils';
import { cn } from '@/utils/styles';

export interface WeeklyMonthlyComparisonProps {
  data: WeeklyMonthlyComparisonPoint[];
  loading?: boolean;
  error?: string;
}

/**
 * Weekly vs monthly comparison chart showing task and project trends
 * Compares weekly performance against monthly averages
 */
export const WeeklyMonthlyComparison: React.FC<WeeklyMonthlyComparisonProps> = ({
  data,
  loading = false,
  error,
}) => {
  if (error) {
    return (
      <ChartContainer
        title="Weekly vs Monthly Comparison"
        icon={<Calendar className="w-5 h-5" />}
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
        title="Weekly vs Monthly Comparison"
        icon={<Calendar className="w-5 h-5" />}
        loading={loading}
      >
        <EmptyChartState
          title="No comparison data"
          description="Select a different time period to view weekly vs monthly trends."
        />
      </ChartContainer>
    );
  }

  // Calculate statistics
  const totalWeeklyTasks = data.reduce((sum, d) => sum + d.weeklyTasks, 0);
  const totalMonthlyTasks = data.reduce((sum, d) => sum + d.monthlyAverage, 0);
  const totalWeeklyProjects = data.reduce((sum, d) => sum + d.weeklyProjects, 0);
  const totalMonthlyProjects = data.reduce((sum, d) => sum + d.monthlyProjectAverage, 0);

  const avgWeeklyTasks = Math.round(totalWeeklyTasks / data.length);
  const avgMonthlyTasks = Math.round(totalMonthlyTasks / data.length);
  const avgWeeklyProjects = Math.round(totalWeeklyProjects / data.length);
  const avgMonthlyProjects = Math.round(totalMonthlyProjects / data.length);

  // Calculate performance vs average
  const taskPerformance = avgMonthlyTasks > 0 ? (avgWeeklyTasks / avgMonthlyTasks) * 100 - 100 : 0;
  const projectPerformance =
    avgMonthlyProjects > 0 ? (avgWeeklyProjects / avgMonthlyProjects) * 100 - 100 : 0;

  const isTasksAboveAverage = taskPerformance > 0;
  const isProjectsAboveAverage = projectPerformance > 0;

  return (
    <ChartContainer
      title="Weekly vs Monthly Comparison"
      description="Compare weekly performance against monthly averages"
      icon={<Calendar className="w-5 h-5" />}
      loading={loading}
    >
      <div className="space-y-6">
        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Tasks Comparison
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-violet-50 dark:bg-violet-950/30 rounded-lg p-3 border border-violet-200 dark:border-violet-900/50">
                <p className="text-xs font-medium text-violet-700 dark:text-violet-300 mb-1">
                  Weekly Avg
                </p>
                <p className="text-xl font-bold text-violet-900 dark:text-violet-100">
                  {avgWeeklyTasks}
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3 border border-blue-200 dark:border-blue-900/50">
                <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">
                  Monthly Avg
                </p>
                <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                  {avgMonthlyTasks}
                </p>
              </div>
            </div>

            <div
              className={cn(
                'p-3 rounded-lg border-l-4',
                isTasksAboveAverage
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500'
                  : 'bg-rose-50 dark:bg-rose-950/30 border-rose-500'
              )}
            >
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Performance</p>
              <p
                className={cn(
                  'text-sm font-bold',
                  isTasksAboveAverage
                    ? 'text-emerald-700 dark:text-emerald-300'
                    : 'text-rose-700 dark:text-rose-300'
                )}
              >
                {taskPerformance}% {isTasksAboveAverage ? 'above' : 'below'} monthly average
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Projects Comparison
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-3 border border-emerald-200 dark:border-emerald-900/50">
                <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300 mb-1">
                  Weekly Avg
                </p>
                <p className="text-xl font-bold text-emerald-900 dark:text-emerald-100">
                  {avgWeeklyProjects}
                </p>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-3 border border-amber-200 dark:border-amber-900/50">
                <p className="text-xs font-medium text-amber-700 dark:text-amber-300 mb-1">
                  Monthly Avg
                </p>
                <p className="text-xl font-bold text-amber-900 dark:text-amber-100">
                  {avgMonthlyProjects}
                </p>
              </div>
            </div>

            <div
              className={cn(
                'p-3 rounded-lg border-l-4',
                isProjectsAboveAverage
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500'
                  : 'bg-rose-50 dark:bg-rose-950/30 border-rose-500'
              )}
            >
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Performance</p>
              <p
                className={cn(
                  'text-sm font-bold',
                  isProjectsAboveAverage
                    ? 'text-emerald-700 dark:text-emerald-300'
                    : 'text-rose-700 dark:text-rose-300'
                )}
              >
                {projectPerformance}% {isProjectsAboveAverage ? 'above' : 'below'} monthly average
              </p>
            </div>
          </div>
        </div>

        {/* Tasks Comparison Chart */}
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
            Tasks: Weekly vs Monthly
          </h4>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                <defs>
                  <linearGradient id="weeklyTaskGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />

                <XAxis
                  dataKey="week"
                  stroke="#94a3b8"
                  style={{ fontSize: '12px' }}
                  tick={{ fill: '#64748b' }}
                  label={{ value: 'Week #', position: 'insideBottomRight', offset: -5 }}
                />

                <YAxis
                  stroke="#94a3b8"
                  style={{ fontSize: '12px' }}
                  tick={{ fill: '#64748b' }}
                  label={{ value: 'Tasks', angle: -90, position: 'insideLeft' }}
                />

                <Tooltip
                  content={<ChartTooltip formatter={(val) => formatChartValue(val)} />}
                  cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                />

                <Bar
                  dataKey="weeklyTasks"
                  fill={chartColors.primary}
                  name="Weekly Tasks"
                  opacity={0.8}
                  radius={[8, 8, 0, 0]}
                />

                <Line
                  type="monotone"
                  dataKey="monthlyAverage"
                  stroke={chartColors.info}
                  name="Monthly Average"
                  strokeWidth={2}
                  dot={{ fill: chartColors.info, r: 4 }}
                  activeDot={{ r: 6 }}
                />

                <Legend
                  content={<ChartLegend variant="horizontal" />}
                  wrapperStyle={{ paddingTop: '20px' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Projects Comparison Chart */}
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
            Projects: Weekly vs Monthly
          </h4>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />

                <XAxis
                  dataKey="week"
                  stroke="#94a3b8"
                  style={{ fontSize: '12px' }}
                  tick={{ fill: '#64748b' }}
                  label={{ value: 'Week #', position: 'insideBottomRight', offset: -5 }}
                />

                <YAxis
                  stroke="#94a3b8"
                  style={{ fontSize: '12px' }}
                  tick={{ fill: '#64748b' }}
                  label={{ value: 'Projects', angle: -90, position: 'insideLeft' }}
                />

                <Tooltip
                  content={<ChartTooltip formatter={(val) => formatChartValue(val)} />}
                  cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                />

                <Bar
                  dataKey="weeklyProjects"
                  fill={chartColors.success}
                  name="Weekly Projects"
                  opacity={0.8}
                  radius={[8, 8, 0, 0]}
                />

                <Line
                  type="monotone"
                  dataKey="monthlyProjectAverage"
                  stroke={chartColors.warning}
                  name="Monthly Average"
                  strokeWidth={2}
                  dot={{ fill: chartColors.warning, r: 4 }}
                  activeDot={{ r: 6 }}
                />

                <Legend
                  content={<ChartLegend variant="horizontal" />}
                  wrapperStyle={{ paddingTop: '20px' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-800">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Consistency Score
            </h4>
            <div className="space-y-2">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    Task Consistency
                  </span>
                  <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {Math.min(100, Math.abs(100 - Math.abs(taskPerformance)))}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-300 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-violet-500 rounded-full"
                    style={{
                      width: `${Math.min(100, Math.abs(100 - Math.abs(taskPerformance)))}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    Project Consistency
                  </span>
                  <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {Math.min(100, Math.abs(100 - Math.abs(projectPerformance)))}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-300 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{
                      width: `${Math.min(100, Math.abs(100 - Math.abs(projectPerformance)))}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-800">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Summary
            </h4>
            <div className="space-y-2 text-sm">
              <p className="text-slate-600 dark:text-slate-400">
                <span className="font-medium text-slate-900 dark:text-slate-100">Total Weeks:</span>{' '}
                {data.length}
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  Period Covered:
                </span>{' '}
                {data[0]?.month || 'N/A'}
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  Variance (Tasks):
                </span>{' '}
                {taskPerformance.toFixed(1)}%
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  Variance (Projects):
                </span>{' '}
                {projectPerformance.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </ChartContainer>
  );
};
