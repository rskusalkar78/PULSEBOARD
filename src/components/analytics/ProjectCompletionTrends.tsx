import React from 'react';
import { BarChart3 } from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Area,
} from 'recharts';
import type { ProjectCompletionDataPoint } from '@/types/dashboard';
import { ChartContainer, ChartTooltip, ChartLegend, EmptyChartState } from './index';
import { formatChartValue, formatChartDate, chartColors } from './chartUtils';

export interface ProjectCompletionTrendsProps {
  data: ProjectCompletionDataPoint[];
  loading?: boolean;
  error?: string;
}

/**
 * Project completion trends chart showing projects completed/started and completion rates
 * Displays project lifecycle metrics with completion rate trend line
 */
export const ProjectCompletionTrends: React.FC<ProjectCompletionTrendsProps> = ({
  data,
  loading = false,
  error,
}) => {
  if (error) {
    return (
      <ChartContainer
        title="Project Completion Trends"
        icon={<BarChart3 className="w-5 h-5" />}
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
        title="Project Completion Trends"
        icon={<BarChart3 className="w-5 h-5" />}
        loading={loading}
      >
        <EmptyChartState
          title="No project data"
          description="Select a different time period to view project completion trends."
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
  const completedProjects = data.reduce((sum, d) => sum + d.projectsCompleted, 0);
  const startedProjects = data.reduce((sum, d) => sum + d.projectsStarted, 0);
  const completionRates = data.map((d) => d.completionRate);
  const avgCompletionRate = Math.round(
    completionRates.reduce((a, b) => a + b, 0) / completionRates.length
  );

  const completionTimes = data.map((d) => d.averageCompletionTime);
  const avgCompletionTime = Math.round(
    completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length
  );

  return (
    <ChartContainer
      title="Project Completion Trends"
      description="Monitor project lifecycle and completion metrics"
      icon={<BarChart3 className="w-5 h-5" />}
      loading={loading}
    >
      <div className="space-y-6">
        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-900/50">
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
              Projects Completed
            </p>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {completedProjects}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">this period</p>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-4 border border-emerald-200 dark:border-emerald-900/50">
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-1">
              Avg Completion Rate
            </p>
            <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
              {avgCompletionRate}%
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">overall</p>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-4 border border-amber-200 dark:border-amber-900/50">
            <p className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-1">
              Avg Completion Time
            </p>
            <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
              {avgCompletionTime}d
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">per project</p>
          </div>
        </div>

        {/* Main Chart */}
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
              <defs>
                <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColors.success} stopOpacity={0.3} />
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

              {/* Completed Projects */}
              <Bar
                yAxisId="left"
                dataKey="projectsCompleted"
                fill={chartColors.success}
                name="Projects Completed"
                opacity={0.8}
                radius={[8, 8, 0, 0]}
              />

              {/* Started Projects */}
              <Bar
                yAxisId="left"
                dataKey="projectsStarted"
                fill={chartColors.info}
                name="Projects Started"
                opacity={0.6}
                radius={[8, 8, 0, 0]}
              />

              {/* Completion Rate as Area */}
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="completionRate"
                fill={chartColors.warning}
                stroke={chartColors.warning}
                name="Completion Rate %"
                opacity={0.3}
              />

              <Legend
                content={<ChartLegend variant="horizontal" />}
                wrapperStyle={{ paddingTop: '20px' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Projects Started</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {startedProjects}
            </p>
          </div>

          <div className="text-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Completion Ratio</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {startedProjects > 0 ? ((completedProjects / startedProjects) * 100).toFixed(0) : 0}%
            </p>
          </div>

          <div className="text-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">In Progress</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {Math.max(0, startedProjects - completedProjects)}
            </p>
          </div>
        </div>
      </div>
    </ChartContainer>
  );
};
