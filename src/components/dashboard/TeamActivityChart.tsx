import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Display/Card';
import type { TeamActivity } from '@/types/dashboard';
import { cn } from '@/utils/styles';

export interface TeamActivityChartProps {
  data: TeamActivity[];
}

/**
 * Simple bar chart showing team activity trends over time
 * Displays completed tasks, active users, and new projects
 */
export const TeamActivityChart: React.FC<TeamActivityChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="border border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            Activity Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-sm text-slate-500 dark:text-slate-400">No data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Find max value for scaling
  const maxTasks = Math.max(...data.map((d) => d.completedTasks));
  const maxUsers = Math.max(...data.map((d) => d.activeUsers));

  // Normalize the data for visualization
  const normalizedData = data.map((item) => ({
    ...item,
    tasksHeight: (item.completedTasks / maxTasks) * 100,
    usersHeight: (item.activeUsers / maxUsers) * 100,
  }));

  return (
    <Card className="border border-slate-200 dark:border-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            Activity Trends
          </CardTitle>
          <div className="text-xs text-slate-500 dark:text-slate-400">Last {data.length} days</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Tasks Completed */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Tasks Completed
              </h4>
              <span className="text-sm font-bold text-violet-600 dark:text-violet-400">
                {data[data.length - 1]?.completedTasks || 0}
              </span>
            </div>
            <div className="flex items-end justify-between gap-1 h-32 px-1">
              {normalizedData.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                  <div
                    className={cn(
                      'w-full rounded-t-lg transition-all duration-200 hover:opacity-75 cursor-pointer relative group/bar',
                      'bg-gradient-to-t from-violet-500 to-violet-400 dark:from-violet-600 dark:to-violet-500',
                      'shadow-sm'
                    )}
                    style={{
                      height: `${Math.max(item.tasksHeight, 5)}%`,
                      minHeight: '4px',
                    }}
                    title={`${item.completedTasks} tasks on ${new Date(
                      item.date
                    ).toLocaleDateString()}`}
                  >
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover/bar:block z-10 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs px-2 py-1 rounded whitespace-nowrap">
                      {item.completedTasks}
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 text-center hidden sm:block">
                    {new Date(item.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Users */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Active Users
              </h4>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {data[data.length - 1]?.activeUsers || 0}
              </span>
            </div>
            <div className="flex items-end justify-between gap-1 h-24 px-1">
              {normalizedData.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                  <div
                    className={cn(
                      'w-full rounded-t-lg transition-all duration-200 hover:opacity-75 cursor-pointer relative group/bar',
                      'bg-gradient-to-t from-emerald-500 to-emerald-400 dark:from-emerald-600 dark:to-emerald-500',
                      'shadow-sm'
                    )}
                    style={{
                      height: `${Math.max(item.usersHeight, 5)}%`,
                      minHeight: '4px',
                    }}
                    title={`${item.activeUsers} active users on ${new Date(
                      item.date
                    ).toLocaleDateString()}`}
                  >
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover/bar:block z-10 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs px-2 py-1 rounded whitespace-nowrap">
                      {item.activeUsers}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* New Projects */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                New Projects
              </h4>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                {data.reduce((sum, item) => sum + item.newProjects, 0)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <span>
                {data.filter((item) => item.newProjects > 0).length} days with new projects
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
