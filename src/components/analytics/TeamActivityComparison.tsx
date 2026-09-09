import React from 'react';
import { Users } from 'lucide-react';
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
import type { TeamActivityDataPoint } from '@/types/dashboard';
import { ChartContainer, ChartTooltip, ChartLegend, EmptyChartState } from './index';
import { formatChartValue, formatTime, formatChartDate, chartColors } from './chartUtils';
import { cn } from '@/utils/styles';

export interface TeamActivityComparisonProps {
  data: TeamActivityDataPoint[];
  loading?: boolean;
  error?: string;
}

/**
 * Team activity comparison chart showing completed tasks, active users, new projects, and avg task time
 * Multi-metric view of team engagement and productivity
 */
export const TeamActivityComparison: React.FC<TeamActivityComparisonProps> = ({
  data,
  loading = false,
  error,
}) => {
  if (error) {
    return (
      <ChartContainer
        title="Team Activity Comparison"
        icon={<Users className="w-5 h-5" />}
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
        title="Team Activity Comparison"
        icon={<Users className="w-5 h-5" />}
        loading={loading}
      >
        <EmptyChartState
          title="No team activity data"
          description="Select a different time period to view team activity trends."
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
  const totalTasksCompleted = data.reduce((sum, d) => sum + d.completedTasks, 0);
  const avgActiveUsers = Math.round(data.reduce((sum, d) => sum + d.activeUsers, 0) / data.length);
  const totalNewProjects = data.reduce((sum, d) => sum + d.newProjects, 0);
  const avgTaskTime = Math.round(data.reduce((sum, d) => sum + d.averageTaskTime, 0) / data.length);

  const maxActiveUsers = Math.max(...data.map((d) => d.activeUsers));
  const maxTasksCompleted = Math.max(...data.map((d) => d.completedTasks));

  return (
    <ChartContainer
      title="Team Activity Comparison"
      description="Monitor team engagement and productivity metrics"
      icon={<Users className="w-5 h-5" />}
      loading={loading}
    >
      <div className="space-y-6">
        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-violet-50 dark:bg-violet-950/30 rounded-lg p-4 border border-violet-200 dark:border-violet-900/50">
            <p className="text-sm font-medium text-violet-700 dark:text-violet-300 mb-1">
              Tasks Completed
            </p>
            <p className="text-2xl font-bold text-violet-900 dark:text-violet-100">
              {totalTasksCompleted}
            </p>
            <p className="text-xs text-violet-600 dark:text-violet-400 mt-1">this period</p>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-4 border border-emerald-200 dark:border-emerald-900/50">
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-1">
              Avg Active Users
            </p>
            <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
              {avgActiveUsers}
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">per day</p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-900/50">
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
              New Projects
            </p>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {totalNewProjects}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">this period</p>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-4 border border-amber-200 dark:border-amber-900/50">
            <p className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-1">
              Avg Task Time
            </p>
            <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
              {formatTime(avgTaskTime)}
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">per task</p>
          </div>
        </div>

        {/* Main Chart */}
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
              <defs>
                <linearGradient id="tasksGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0} />
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

              {/* Tasks Completed Bars */}
              <Bar
                yAxisId="left"
                dataKey="completedTasks"
                fill={chartColors.primary}
                name="Tasks Completed"
                opacity={0.8}
                radius={[8, 8, 0, 0]}
              />

              {/* Active Users Line */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="activeUsers"
                stroke={chartColors.success}
                name="Active Users"
                strokeWidth={2}
                dot={{
                  fill: chartColors.success,
                  r: 4,
                }}
                activeDot={{
                  r: 6,
                }}
              />

              {/* New Projects Line */}
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="newProjects"
                stroke={chartColors.info}
                name="New Projects"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{
                  fill: chartColors.info,
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

        {/* Engagement Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Peak Active Users</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{maxActiveUsers}</p>
          </div>

          <div className="text-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Peak Tasks in a Day</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {maxTasksCompleted}
            </p>
          </div>

          <div className="text-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Days with Activity</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{data.length}</p>
          </div>
        </div>

        {/* Team Engagement Summary */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Activity Distribution
          </h4>

          {/* Tasks breakdown */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">Team Efficiency</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {totalTasksCompleted > 0
                  ? ((totalTasksCompleted / (totalTasksCompleted + 10)) * 100).toFixed(0)
                  : 0}
                %
              </span>
            </div>
            <div className="w-full h-2 bg-slate-300 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-violet-400 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min((totalTasksCompleted / (totalTasksCompleted + 10)) * 100, 100)}%`,
                }}
              />
            </div>
          </div>

          {/* User engagement */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">Team Engagement</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {avgActiveUsers > 3 ? 'High' : avgActiveUsers > 1 ? 'Medium' : 'Low'}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-300 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  avgActiveUsers > 3
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                    : avgActiveUsers > 1
                      ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                      : 'bg-gradient-to-r from-rose-500 to-rose-400'
                )}
                style={{ width: `${Math.min((avgActiveUsers / 10) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Project velocity */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">Project Velocity</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {totalNewProjects > 0 ? (totalNewProjects / data.length).toFixed(1) : 0} per day
              </span>
            </div>
            <div className="w-full h-2 bg-slate-300 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((totalNewProjects / 5) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </ChartContainer>
  );
};
