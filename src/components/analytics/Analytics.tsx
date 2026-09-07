import React, { useState, useMemo } from 'react';
import { Filter, RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ContentContainer } from '@/components/layout/ContentContainer';
import { Button } from '@/components/ui/Button/Button';
import {
  ProductivityTrends,
  ProjectCompletionTrends,
  TaskCompletionRate,
  TeamActivityComparison,
  WeeklyMonthlyComparison,
} from './index';
import { generateMockAnalyticsData } from './chartUtils';
import type { TimePeriod } from '@/types/dashboard';
import { cn } from '@/utils/styles';

export interface AnalyticsProps {
  className?: string;
}

/**
 * Main Analytics Dashboard page with time-based filtering and KPI comparison
 * Integrates all chart components with filtering controls
 */
export const Analytics: React.FC<AnalyticsProps> = ({ className }) => {
  const [period, setPeriod] = useState<TimePeriod>('month');
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([]);

  // Generate mock data (in real app, this would come from API)
  const analyticsData = useMemo(() => {
    const baseData = generateMockAnalyticsData();

    // Filter by period
    let filteredData = baseData;

    switch (period) {
      case 'week':
        filteredData = baseData.slice(-7);
        break;
      case 'month':
        filteredData = baseData.slice(-30);
        break;
      case 'quarter':
        filteredData = baseData.slice(-90);
        break;
      case 'year':
        filteredData = baseData;
        break;
    }

    return filteredData;
  }, [period]);

  // Generate comparison data for weekly/monthly
  const comparisonData = useMemo(() => {
    const weeks = Math.ceil(analyticsData.length / 7);
    const compData = [];

    for (let i = 1; i <= weeks; i++) {
      const weekStart = (i - 1) * 7;
      const weekEnd = Math.min(weekStart + 7, analyticsData.length);
      const weekData = analyticsData.slice(weekStart, weekEnd);

      const weeklyTasks = weekData.reduce((sum, d) => sum + d.tasksCompleted, 0);
      const monthlyAverage = Math.round(
        analyticsData.reduce((sum, d) => sum + d.tasksCompleted, 0) / analyticsData.length
      );
      const weeklyProjects = weekData.reduce((sum, d) => sum + (d.projectsCompleted || 0), 0);
      const monthlyProjectAverage = Math.round(
        analyticsData.reduce((sum, d) => sum + (d.projectsCompleted || 0), 0) / analyticsData.length
      );

      compData.push({
        week: i,
        month: analyticsData[0]?.period.split(' ')[0] || '',
        weeklyTasks,
        monthlyAverage,
        weeklyProjects,
        monthlyProjectAverage,
      });
    }

    return compData;
  }, [analyticsData]);

  // Calculate KPI comparison data
  const kpiData = useMemo(() => {
    if (analyticsData.length === 0) return [];

    const avgTasks = Math.round(
      analyticsData.reduce((sum, d) => sum + d.tasksCompleted, 0) / analyticsData.length
    );
    const avgEfficiency = Math.round(
      analyticsData.reduce((sum, d) => sum + d.efficiency, 0) / analyticsData.length
    );

    const prevAvgTasks = Math.round(
      analyticsData
        .slice(0, Math.ceil(analyticsData.length / 2))
        .reduce((sum, d) => sum + d.tasksCompleted, 0) / Math.ceil(analyticsData.length / 2)
    );
    const prevAvgEfficiency = Math.round(
      analyticsData
        .slice(0, Math.ceil(analyticsData.length / 2))
        .reduce((sum, d) => sum + d.efficiency, 0) / Math.ceil(analyticsData.length / 2)
    );

    return [
      {
        label: 'Avg Daily Tasks',
        current: avgTasks,
        previous: prevAvgTasks,
        target: 15,
        unit: 'tasks',
        trend: avgTasks > prevAvgTasks ? ('up' as const) : ('down' as const),
      },
      {
        label: 'Avg Efficiency',
        current: avgEfficiency,
        previous: prevAvgEfficiency,
        target: 85,
        unit: '%',
        trend: avgEfficiency > prevAvgEfficiency ? ('up' as const) : ('down' as const),
      },
    ];
  }, [analyticsData]);

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);
  };

  const handlePeriodChange = (newPeriod: TimePeriod) => {
    setPeriod(newPeriod);
  };

  return (
    <div className={className}>
      <PageHeader title="Analytics" />

      <ContentContainer>
        <div className="space-y-6">
          {/* Filter Controls */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  Time Period:
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {(['week', 'month', 'quarter', 'year'] as const).map((p) => (
                  <Button
                    key={p}
                    variant={period === p ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => handlePeriodChange(p)}
                    disabled={isLoading}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Button>
                ))}
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  disabled={isLoading}
                >
                  {showAdvancedFilters ? 'Hide' : 'Advanced'}
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className={cn(isLoading && 'opacity-50')}
                >
                  <RefreshCw className={cn('w-4 h-4', isLoading && 'animate-spin')} />
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-900 dark:text-slate-100 block mb-2">
                      Team Members
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {['Alice', 'Bob', 'Charlie'].map((member) => (
                        <button
                          key={member}
                          onClick={() => {
                            setSelectedTeamMembers((prev) =>
                              prev.includes(member)
                                ? prev.filter((m) => m !== member)
                                : [...prev, member]
                            );
                          }}
                          className={cn(
                            'px-3 py-1 text-sm rounded-full border transition-colors',
                            selectedTeamMembers.includes(member)
                              ? 'bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 border-violet-300 dark:border-violet-700'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                          )}
                        >
                          {member}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-900 dark:text-slate-100 block mb-2">
                      Projects
                    </label>
                    <select className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                      <option>All Projects</option>
                      <option>Project A</option>
                      <option>Project B</option>
                      <option>Project C</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* KPI Comparison */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              KPI Comparison
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {kpiData.map((kpi, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                        {kpi.label}
                      </p>
                      <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                        {kpi.current}
                        {kpi.unit && (
                          <span className="text-lg text-slate-600 dark:text-slate-400">
                            {' '}
                            {kpi.unit}
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">vs previous</p>
                      <p
                        className={cn(
                          'text-lg font-semibold',
                          kpi.trend === 'up'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        )}
                      >
                        {kpi.trend === 'up' ? '↑' : '↓'} {Math.abs(kpi.current - kpi.previous)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 dark:text-slate-400">Target:</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {kpi.target}
                        {kpi.unit}
                      </span>
                    </div>

                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-500',
                          kpi.current >= kpi.target
                            ? 'bg-emerald-500'
                            : kpi.current >= kpi.target * 0.75
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                        )}
                        style={{ width: `${Math.min((kpi.current / kpi.target) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Charts */}
          <div className="space-y-6">
            <ProductivityTrends data={analyticsData} loading={isLoading} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProjectCompletionTrends data={analyticsData} loading={isLoading} />
              <TaskCompletionRate data={analyticsData} loading={isLoading} />
            </div>

            <TeamActivityComparison data={analyticsData} loading={isLoading} />

            <WeeklyMonthlyComparison data={comparisonData} loading={isLoading} />
          </div>

          {/* Footer Info */}
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800 p-4 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Data last updated: <span className="font-medium">{new Date().toLocaleString()}</span>
            </p>
          </div>
        </div>
      </ContentContainer>
    </div>
  );
};
