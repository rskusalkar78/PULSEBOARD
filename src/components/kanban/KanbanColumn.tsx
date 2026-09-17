import { memo } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import { cn } from '@/utils/styles';
import { KanbanCard } from './KanbanCard';
import type { Task, TaskStatus } from '@/types';

export interface ColumnDefinition {
  id: string;
  title: string;
  status: TaskStatus;
  color: string;
  badgeBg: string;
  badgeText: string;
  dotColor: string;
}

export interface KanbanColumnProps {
  column: ColumnDefinition;
  tasks: Task[];
  onAddTask?: ((status: TaskStatus) => void) | undefined;
  onEditTask?: ((task: Task) => void) | undefined;
  onDeleteTask?: ((taskId: string) => void) | undefined;
  onSelectTask?: ((task: Task) => void) | undefined;
}

export const KanbanColumn = memo(function KanbanColumn({
  column,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onSelectTask,
}: KanbanColumnProps) {
  return (
    <div className="flex flex-col flex-shrink-0 w-80 md:w-80 lg:w-84 max-h-full rounded-2xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 p-3 shadow-xs transition-colors">
      {/* Column Header */}
      <div className="flex items-center justify-between px-1 py-1 mb-3">
        <div className="flex items-center gap-2">
          <span className={cn('h-2.5 w-2.5 rounded-full', column.dotColor)} />
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm tracking-tight">
            {column.title}
          </h3>
          <span
            className={cn(
              'px-2 py-0.5 text-xs font-bold rounded-full',
              column.badgeBg,
              column.badgeText
            )}
          >
            {tasks.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {onAddTask && (
            <button
              type="button"
              onClick={() => onAddTask(column.status)}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors"
              title={`Add task to ${column.title}`}
              aria-label={`Add task to ${column.title}`}
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              'flex-1 min-h-[150px] overflow-y-auto pr-1 transition-colors rounded-xl p-1',
              snapshot.isDraggingOver &&
                'bg-violet-50/50 dark:bg-violet-950/20 ring-2 ring-violet-500/30 ring-dashed'
            )}
          >
            {tasks.map((task, index) => (
              <KanbanCard
                key={task.id}
                task={task}
                index={index}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onSelect={onSelectTask}
              />
            ))}
            {provided.placeholder}

            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="h-28 border-2 border-dashed border-slate-200 dark:border-slate-800/80 rounded-xl flex flex-col items-center justify-center text-slate-400 text-xs gap-1.5 my-1">
                <span>No tasks in {column.title}</span>
                {onAddTask && (
                  <button
                    type="button"
                    onClick={() => onAddTask(column.status)}
                    className="text-violet-600 dark:text-violet-400 font-medium hover:underline text-[11px]"
                  >
                    + Add Task
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
});
