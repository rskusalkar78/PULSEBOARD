import { memo } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Calendar, Edit3, Trash2, AlertTriangle, User as UserIcon } from 'lucide-react';
import { cn } from '@/utils/styles';
import type { Task, TaskPriority } from '@/types';

export interface KanbanCardProps {
  task: Task;
  index: number;
  onEdit?: ((task: Task) => void) | undefined;
  onDelete?: ((taskId: string) => void) | undefined;
  onSelect?: ((task: Task) => void) | undefined;
}

const PRIORITY_CONFIG: Record<
  TaskPriority,
  { label: string; color: string; border: string; bg: string }
> = {
  low: {
    label: 'Low',
    color: 'text-slate-600 dark:text-slate-400',
    border: 'border-l-slate-400 dark:border-l-slate-600',
    bg: 'bg-slate-100 dark:bg-slate-800/60',
  },
  medium: {
    label: 'Medium',
    color: 'text-blue-600 dark:text-blue-400',
    border: 'border-l-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
  },
  high: {
    label: 'High',
    color: 'text-amber-600 dark:text-amber-400',
    border: 'border-l-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
  },
  urgent: {
    label: 'Urgent',
    color: 'text-rose-600 dark:text-rose-400',
    border: 'border-l-rose-500',
    bg: 'bg-rose-50 dark:bg-rose-950/40',
  },
};

export const KanbanCard = memo(function KanbanCard({
  task,
  index,
  onEdit,
  onDelete,
  onSelect,
}: KanbanCardProps) {
  const priorityInfo = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const isOverdue =
    task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed';

  const formattedDueDate = task.due_date
    ? new Date(task.due_date).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onSelect?.(task)}
          tabIndex={0}
          role="button"
          aria-label={`Task: ${task.title}. Priority: ${task.priority}. Press spacebar to lift.`}
          className={cn(
            'group relative p-3.5 mb-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all duration-200 border-l-4 select-none cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-violet-500/50',
            priorityInfo.border,
            snapshot.isDragging &&
              'shadow-xl ring-2 ring-violet-500/60 rotate-[1deg] scale-[1.02] z-50 bg-white dark:bg-slate-900',
            'hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700'
          )}
        >
          {/* Header row with tags & actions */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span
                className={cn(
                  'text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md tracking-wider',
                  priorityInfo.bg,
                  priorityInfo.color
                )}
              >
                {priorityInfo.label}
              </span>
              {task.tags?.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 truncate max-w-[80px]"
                >
                  #{tag}
                </span>
              ))}
              {task.tags && task.tags.length > 2 && (
                <span className="text-[10px] text-slate-400">+{task.tags.length - 2}</span>
              )}
            </div>

            {/* Actions Menu Trigger */}
            <div className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex items-center gap-1">
              {onEdit && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(task);
                  }}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Edit task"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(task.id);
                  }}
                  className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Delete task"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Task Title */}
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug mb-1.5">
            {task.title}
          </h4>

          {/* Task Description snippet if available */}
          {task.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Footer Metadata */}
          <div className="flex items-center justify-between pt-2.5 mt-1 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
            {/* Due date */}
            <div className="flex items-center gap-1">
              {formattedDueDate ? (
                <span
                  className={cn(
                    'inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded',
                    isOverdue
                      ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-semibold'
                      : 'text-slate-500 dark:text-slate-400'
                  )}
                >
                  {isOverdue ? (
                    <AlertTriangle className="h-3 w-3 text-rose-500" />
                  ) : (
                    <Calendar className="h-3 w-3" />
                  )}
                  {formattedDueDate}
                </span>
              ) : (
                <span className="text-[11px] text-slate-400">No due date</span>
              )}
            </div>

            {/* Assignee Avatar */}
            <div className="flex items-center gap-1">
              {task.assigned_to ? (
                <div
                  className="h-6 w-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-[10px] font-bold shadow-xs"
                  title={`Assigned to ${task.assigned_to}`}
                >
                  {task.assigned_to.substring(0, 2).toUpperCase()}
                </div>
              ) : (
                <div
                  className="h-6 w-6 rounded-full border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400"
                  title="Unassigned"
                >
                  <UserIcon className="h-3 w-3" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
});
