import React from 'react';
import { Skeleton } from '@/components/ui/Feedback/Skeleton';
import { Card, CardContent } from '@/components/ui/Display/Card';

/**
 * Loading skeleton for KPI cards
 */
export const KPICardSkeleton: React.FC = () => (
  <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
    <CardContent className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          <Skeleton variant="text" width="60%" height={16} />
          <Skeleton variant="text" width="40%" height={32} />
          <Skeleton variant="text" width="50%" height={20} />
        </div>
        <Skeleton variant="circular" width={48} height={48} />
      </div>
    </CardContent>
  </Card>
);

/**
 * Loading skeleton for team activity section
 */
export const TeamActivitySkeleton: React.FC = () => (
  <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
    <CardContent className="p-6">
      <Skeleton variant="text" width="25%" height={20} className="mb-6" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton variant="circular" width={40} height={40} />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" width="60%" height={16} />
              <Skeleton variant="text" width="40%" height={12} />
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

/**
 * Loading skeleton for recent activity section
 */
export const RecentActivitySkeleton: React.FC = () => (
  <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
    <CardContent className="p-6">
      <Skeleton variant="text" width="25%" height={20} className="mb-6" />
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="pb-4 border-b border-slate-200 dark:border-slate-800 last:border-0 last:pb-0"
          >
            <div className="flex items-center gap-4">
              <Skeleton variant="circular" width={40} height={40} />
              <div className="flex-1 space-y-2">
                <Skeleton variant="text" width="70%" height={16} />
                <Skeleton variant="text" width="50%" height={12} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

/**
 * Loading skeleton for upcoming deadlines section
 */
export const UpcomingDeadlinesSkeleton: React.FC = () => (
  <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
    <CardContent className="p-6">
      <Skeleton variant="text" width="30%" height={20} className="mb-6" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="pb-4 border-b border-slate-200 dark:border-slate-800 last:border-0 last:pb-0"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <Skeleton variant="text" width="70%" height={16} />
                <Skeleton variant="text" width="50%" height={12} />
                <Skeleton variant="text" width="60%" height={12} />
              </div>
              <Skeleton variant="rectangular" width={60} height={24} />
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

/**
 * Loading skeleton for project progress section
 */
export const ProjectProgressSkeleton: React.FC = () => (
  <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
    <CardContent className="p-6">
      <Skeleton variant="text" width="25%" height={20} className="mb-6" />
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <div className="flex justify-between items-center mb-2">
              <Skeleton variant="text" width="50%" height={16} />
              <Skeleton variant="text" width="20%" height={14} />
            </div>
            <Skeleton variant="rectangular" width="100%" height={8} />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

/**
 * Loading skeleton for chart/visualization section
 */
export const ChartSkeleton: React.FC = () => (
  <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
    <CardContent className="p-6">
      <Skeleton variant="text" width="30%" height={20} className="mb-6" />
      <div className="h-64 flex items-end justify-between gap-2 px-2">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <Skeleton key={i} variant="rectangular" width="14%" height={Math.random() * 200 + 50} />
        ))}
      </div>
    </CardContent>
  </Card>
);

/**
 * Complete dashboard skeleton loader
 */
export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6">
    {/* KPI Cards */}
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <KPICardSkeleton key={i} />
      ))}
    </div>

    {/* Charts and Activity */}
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <ChartSkeleton />
      </div>
      <TeamActivitySkeleton />
    </div>

    {/* Recent Activity and Deadlines */}
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <RecentActivitySkeleton />
      <UpcomingDeadlinesSkeleton />
    </div>

    {/* Project Progress */}
    <ProjectProgressSkeleton />
  </div>
);
