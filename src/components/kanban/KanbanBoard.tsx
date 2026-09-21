import React, { useState, useEffect, useMemo } from 'react';
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import { useTaskContext } from '@/contexts/TaskContext';
import { useToastContext } from '@/contexts/ToastContext';
import { KanbanColumn, type ColumnDefinition } from './KanbanColumn';
import type { Task, TaskStatus } from '@/types';
import { Plus, Search, RefreshCw } from 'lucide-react';
import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskDetail } from '@/components/tasks/TaskDetail';
import { Dialog } from '@/components/ui/Overlay/Dialog';
export interface KanbanBoardProps {
  projectId?: string;
}

export const KANBAN_COLUMNS: ColumnDefinition[] = [
  {
    id: 'backlog',
    title: 'Backlog',
    status: 'cancelled', // Mapped cleanly to cancelled/backlog
    color: 'slate',
    badgeBg: 'bg-slate-200 dark:bg-slate-800',
    badgeText: 'text-slate-700 dark:text-slate-300',
    dotColor: 'bg-slate-400',
  },
  {
    id: 'todo',
    title: 'Todo',
    status: 'todo',
    color: 'sky',
    badgeBg: 'bg-sky-100 dark:bg-sky-950/60',
    badgeText: 'text-sky-700 dark:text-sky-300',
    dotColor: 'bg-sky-500',
  },
  {
    id: 'in_progress',
    title: 'In Progress',
    status: 'in_progress',
    color: 'blue',
    badgeBg: 'bg-blue-100 dark:bg-blue-950/60',
    badgeText: 'text-blue-700 dark:text-blue-300',
    dotColor: 'bg-blue-500',
  },
  {
    id: 'in_review',
    title: 'Review',
    status: 'in_review',
    color: 'amber',
    badgeBg: 'bg-amber-100 dark:bg-amber-950/60',
    badgeText: 'text-amber-700 dark:text-amber-300',
    dotColor: 'bg-amber-500',
  },
  {
    id: 'completed',
    title: 'Done',
    status: 'completed',
    color: 'emerald',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-950/60',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    dotColor: 'bg-emerald-500',
  },
];

export function KanbanBoard({ projectId }: KanbanBoardProps) {
  const { tasks, fetchTasks, updateTask, deleteTask, loading, filters } = useTaskContext();
  const toast = useToastContext();

  // Local state for optimistic updates
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<Task | null>(null);

  // Sync local tasks when global tasks update
  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  // Initial fetch
  useEffect(() => {
    fetchTasks(projectId ? { ...filters, projectId } : filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  // Filter tasks based on search & priority
  const filteredTasks = useMemo(() => {
    return localTasks.filter((task) => {
      const matchesSearch =
        !searchQuery ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;

      const matchesProject = !projectId || task.project_id === projectId;

      return matchesSearch && matchesPriority && matchesProject;
    });
  }, [localTasks, searchQuery, selectedPriority, projectId]);

  // Group tasks by column status
  const columnsData = useMemo(() => {
    const grouped: Record<string, Task[]> = {
      backlog: [],
      todo: [],
      in_progress: [],
      in_review: [],
      completed: [],
    };

    filteredTasks.forEach((task) => {
      const col = KANBAN_COLUMNS.find((c) => c.status === task.status);
      if (col && grouped[col.id]) {
        grouped[col.id]?.push(task);
      } else if (grouped['todo']) {
        grouped['todo']?.push(task);
      }
    });

    return grouped;
  }, [filteredTasks]);

  // Drag and Drop Handler with Optimistic Update
  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const destCol = KANBAN_COLUMNS.find((c) => c.id === destination.droppableId);

    if (!destCol) return;

    const targetTask = localTasks.find((t) => t.id === draggableId);
    if (!targetTask) return;

    const newStatus = destCol.status;
    const previousTasks = [...localTasks];

    // Optimistically update local state immediately
    setLocalTasks((prev) =>
      prev.map((t) => (t.id === draggableId ? { ...t, status: newStatus } : t))
    );

    // Call update API
    const updated = await updateTask(draggableId, { status: newStatus });

    if (!updated) {
      // Revert state if failed
      setLocalTasks(previousTasks);
      toast.error('Failed to update task status. Changes reverted.');
    } else {
      toast.success(`Task moved to ${destCol.title}`);
    }
  };

  const handleOpenAddTask = (_status: TaskStatus) => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleOpenEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const prev = [...localTasks];
      setLocalTasks((current) => current.filter((t) => t.id !== taskId));
      const ok = await deleteTask(taskId);
      if (!ok) {
        setLocalTasks(prev);
      }
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Filter and Control Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search Kanban tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
            />
          </div>

          <div className="relative">
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="pl-3 pr-8 py-1.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 text-slate-700 dark:text-slate-300 font-medium cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 justify-end">
          <button
            type="button"
            onClick={() => fetchTasks(projectId ? { ...filters, projectId } : filters)}
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors"
            title="Refresh tasks"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-violet-600' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => handleOpenAddTask('todo')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold text-sm shadow-xs transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Kanban Drag and Drop Context */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex-1 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
          <div className="flex gap-4 min-w-max items-start">
            {KANBAN_COLUMNS.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={columnsData[column.id] || []}
                onAddTask={handleOpenAddTask}
                onEditTask={handleOpenEditTask}
                onDeleteTask={handleDeleteTask}
                onSelectTask={setSelectedTaskDetail}
              />
            ))}
          </div>
        </div>
      </DragDropContext>

      {/* Task Form Modal */}
      <Dialog
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTask(null);
        }}
      >
        <TaskForm
          task={editingTask || undefined}
          onClose={() => {
            setIsFormOpen(false);
            setEditingTask(null);
          }}
        />
      </Dialog>

      {/* Task Detail Modal */}
      <Dialog isOpen={!!selectedTaskDetail} onClose={() => setSelectedTaskDetail(null)}>
        {selectedTaskDetail && (
          <TaskDetail
            taskId={selectedTaskDetail.id}
            onEdit={(task) => {
              setSelectedTaskDetail(null);
              handleOpenEditTask(task);
            }}
          />
        )}
      </Dialog>
    </div>
  );
}
