/**
 * Tasks Page
 * Main page for viewing and managing tasks with List & Kanban views
 */

import { useState, Suspense } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { PageLoader } from '@/components/common/PageLoader';
import { TaskList } from '@/components/tasks';
import { KanbanBoard } from '@/components/kanban';
import { LayoutGrid, ListFilter, RefreshCw } from 'lucide-react';
import { cn } from '@/utils/styles';

export default function TasksPage() {
  const { fetchTasks, filters, loading } = useTaskContext();
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>(() => {
    return (localStorage.getItem('pulseboard_tasks_view') as 'kanban' | 'list') || 'kanban';
  });

  const handleViewChange = (mode: 'kanban' | 'list') => {
    setViewMode(mode);
    localStorage.setItem('pulseboard_tasks_view', mode);
  };

  const handleRefresh = async () => {
    await fetchTasks(filters);
  };

  return (
    <div className="space-y-6 flex flex-col h-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Tasks
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">
            Manage and track all your project tasks on interactive Kanban board or list view
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
            <button
              type="button"
              onClick={() => handleViewChange('kanban')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              )}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Kanban</span>
            </button>
            <button
              type="button"
              onClick={() => handleViewChange('list')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              )}
            >
              <ListFilter className="h-3.5 w-3.5" />
              <span>List</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3.5 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin text-violet-600')} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Main Content View */}
      <Suspense fallback={<PageLoader />}>
        {viewMode === 'kanban' ? <KanbanBoard /> : <TaskList showFilters showSearch />}
      </Suspense>
    </div>
  );
}
