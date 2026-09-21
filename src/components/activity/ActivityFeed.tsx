import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Inbox, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, Select, Skeleton } from '@/components';
import { ActivityItem } from './ActivityItem';
import { ActivityFilters } from './ActivityFilters';
import { ActivityStats } from './ActivityStats';
import { activityService } from '@/services';
import type { ActivityWithRelations, ActivityFilters as FilterParams } from '@/types';

export interface ActivityFeedProps {
  initialProjectId?: string;
  initialTeamId?: string;
  initialUserId?: string;
  showStats?: boolean;
  limit?: number;
  className?: string;
}

const PAGE_SIZE_OPTIONS = [
  { value: '10', label: '10 per page' },
  { value: '20', label: '20 per page' },
  { value: '50', label: '50 per page' },
];

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  initialProjectId,
  initialTeamId,
  initialUserId,
  showStats = true,
  limit: initialLimit = 10,
  className = '',
}) => {
  const [activities, setActivities] = useState<ActivityWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState<FilterParams>({
    project_id: initialProjectId,
    team_id: initialTeamId,
    actor_id: initialUserId,
  });
  const [timePeriod, setTimePeriod] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialLimit);
  const [paginationInfo, setPaginationInfo] = useState({
    total: 0,
    totalPages: 1,
    hasMore: false,
  });
  const [stats, setStats] = useState({
    totalToday: 0,
    tasksCompleted: 0,
    projectsUpdated: 0,
    activeMembers: 0,
  });

  // Calculate date boundaries for time period filter
  const getFilterWithDate = useCallback(
    (currentFilters: FilterParams, period: 'all' | 'today' | 'week' | 'month'): FilterParams => {
      const now = new Date();
      let date_from: string | undefined = undefined;

      if (period === 'today') {
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        date_from = start.toISOString();
      } else if (period === 'week') {
        const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        date_from = start.toISOString();
      } else if (period === 'month') {
        const start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        date_from = start.toISOString();
      }

      return {
        ...currentFilters,
        date_from,
      };
    },
    []
  );

  const loadActivities = useCallback(
    async (isManualRefresh = false) => {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);

      try {
        const activeFilters = getFilterWithDate(filters, timePeriod);
        const [feedRes, statsRes] = await Promise.all([
          activityService.getFeed(
            activeFilters,
            { page, limit: pageSize },
            { sortBy: 'created_at', sortOrder: 'desc' }
          ),
          activityService.getActivityStats(),
        ]);

        if (feedRes.success && feedRes.data) {
          setActivities(feedRes.data.data);
          setPaginationInfo({
            total: feedRes.data.pagination.total,
            totalPages: feedRes.data.pagination.totalPages,
            hasMore: feedRes.data.pagination.hasMore,
          });
        }

        if (statsRes.success && statsRes.data) {
          setStats(statsRes.data);
        }
      } catch (err) {
        console.error('Failed to load activity feed:', err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [filters, timePeriod, page, pageSize, getFilterWithDate]
  );

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  // Subscribe to real-time events
  useEffect(() => {
    const unsubscribe = activityService.subscribe((newActivity) => {
      setActivities((prev) => [newActivity, ...prev.filter((a) => a.id !== newActivity.id)]);
      setPaginationInfo((prev) => ({ ...prev, total: prev.total + 1 }));
    });
    return unsubscribe;
  }, []);

  const handleFilterChange = (newFilters: FilterParams) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page
  };

  const handleTimePeriodChange = (period: 'all' | 'today' | 'week' | 'month') => {
    setTimePeriod(period);
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      project_id: initialProjectId,
      team_id: initialTeamId,
      actor_id: initialUserId,
    });
    setTimePeriod('all');
    setPage(1);
  };

  const handlePageSizeChange = (val: string) => {
    setPageSize(Number(val));
    setPage(1);
  };

  // Group activities by date bucket
  const groupActivitiesByDate = (items: ActivityWithRelations[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const thisWeek = new Date(today);
    thisWeek.setDate(thisWeek.getDate() - 7);

    const groups: { [key: string]: ActivityWithRelations[] } = {
      Today: [],
      Yesterday: [],
      'This Week': [],
      Earlier: [],
    };

    items.forEach((item) => {
      const d = new Date(item.created_at);
      if (d >= today) {
        groups.Today.push(item);
      } else if (d >= yesterday) {
        groups.Yesterday.push(item);
      } else if (d >= thisWeek) {
        groups['This Week'].push(item);
      } else {
        groups.Earlier.push(item);
      }
    });

    return Object.entries(groups).filter(([_, list]) => list.length > 0);
  };

  const groupedActivities = groupActivitiesByDate(activities);

  return (
    <div className={`space-y-6 ${className}`} data-testid="activity-feed-container">
      {/* Top Level Summary Stats */}
      {showStats && <ActivityStats stats={stats} loading={loading} />}

      {/* Filter and Control Bar */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Feed
            </span>
            <span className="text-xs text-slate-400">Auto-syncing system events</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadActivities(true)}
              disabled={refreshing || loading}
              className="gap-1.5 text-xs h-8"
              aria-label="Refresh activity feed"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
          </div>
        </div>

        <ActivityFilters
          filters={filters}
          timePeriod={timePeriod}
          onFilterChange={handleFilterChange}
          onTimePeriodChange={handleTimePeriodChange}
          onReset={handleResetFilters}
          totalResults={paginationInfo.total}
        />
      </div>

      {/* Feed List */}
      <div className="space-y-6" aria-live="polite">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start gap-4"
              >
                <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-center">
                    <Skeleton className="w-32 h-4" />
                    <Skeleton className="w-16 h-3" />
                  </div>
                  <Skeleton className="w-3/4 h-3.5" />
                  <Skeleton className="w-1/2 h-3" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
            <div className="mx-auto w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-3">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
              No activities found
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              There are no recorded activities matching your current search or filter criteria.
            </p>
            <div className="mt-4">
              <Button variant="outline" size="sm" onClick={handleResetFilters}>
                Clear filters
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedActivities.map(([groupName, groupItems]) => (
              <div key={groupName} className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <Calendar className="w-3.5 h-3.5 text-purple-500" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {groupName}
                  </span>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800 ml-2" />
                </div>

                <div className="space-y-3">
                  {groupItems.map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {!loading && activities.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>
              Showing {Math.min((page - 1) * pageSize + 1, paginationInfo.total)} to{' '}
              {Math.min(page * pageSize, paginationInfo.total)} of {paginationInfo.total} results
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <div className="w-32">
              <Select
                options={PAGE_SIZE_OPTIONS}
                value={String(pageSize)}
                onChange={handlePageSizeChange}
                aria-label="Items per page"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="h-8 px-2.5 text-xs gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Previous
            </Button>

            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 px-2">
              Page {page} of {paginationInfo.totalPages || 1}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(paginationInfo.totalPages, p + 1))}
              disabled={page >= paginationInfo.totalPages}
              className="h-8 px-2.5 text-xs gap-1"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
export default ActivityFeed;
