/**
 * Tasks Page
 * Main page for viewing and managing tasks
 */

import { Suspense } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { PageLoader } from '@/components/common/PageLoader';
import { TaskList } from '@/components/tasks';

export default function TasksPage() {
  const { fetchTasks, filters } = useTaskContext();

  // Fetch tasks on mount
  const handleRefresh = async () => {
    await fetchTasks(filters);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Tasks</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage and track all your project tasks
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 font-medium hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Task List */}
      <Suspense fallback={<PageLoader />}>
        <TaskList showFilters showSearch />
      </Suspense>
    </div>
  );
}
