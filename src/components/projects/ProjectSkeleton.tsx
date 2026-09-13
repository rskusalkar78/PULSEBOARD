import React from 'react';
import { Card, Skeleton } from '@/components';

export interface ProjectSkeletonProps {
  viewMode?: 'grid' | 'table';
  count?: number;
}

export const ProjectSkeleton: React.FC<ProjectSkeletonProps> = ({
  viewMode = 'grid',
  count = 6,
}) => {
  if (viewMode === 'table') {
    return (
      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                <div className="space-y-1">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-4/5 mb-4" />
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-10" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
