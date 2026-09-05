import React from 'react';
import { Calendar, AlertCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Display/Card';
import { Avatar } from '@/components/ui/Display/Avatar';
import { Badge } from '@/components/ui/Display/Badge';
import type { Deadline } from '@/types/dashboard';
import { cn } from '@/utils/styles';

export interface UpcomingDeadlinesProps {
  deadlines: Deadline[];
}

const getStatusLabel = (status: Deadline['status']) => {
  switch (status) {
    case 'completed':
      return 'Completed';
    case 'in_progress':
      return 'In Progress';
    case 'overdue':
      return 'Overdue';
    case 'not_started':
      return 'Not Started';
  }
};

const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
};

const getDaysUntilDeadline = (dueDate: Date): number => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);
  return Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};

const getDeadlineStatus = (daysUntil: number, status: Deadline['status']): string => {
  if (status === 'completed') return 'Completed';
  if (status === 'overdue') return `${Math.abs(daysUntil)} days overdue`;
  if (daysUntil === 0) return 'Due today';
  if (daysUntil === 1) return 'Due tomorrow';
  return `${daysUntil} days left`;
};

const getPriorityColor = (priority: Deadline['priority']) => {
  switch (priority) {
    case 'urgent':
      return 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300';
    case 'high':
      return 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-300';
    case 'medium':
      return 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50 text-blue-700 dark:text-blue-300';
    case 'low':
      return 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300';
  }
};

export const UpcomingDeadlines: React.FC<UpcomingDeadlinesProps> = ({ deadlines }) => {
  // Sort by due date
  const sortedDeadlines = [...deadlines].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

  return (
    <Card className="border border-slate-200 dark:border-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          Upcoming Deadlines
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedDeadlines.map((deadline) => {
            const daysUntil = getDaysUntilDeadline(deadline.dueDate);
            const isUrgent = deadline.priority === 'urgent' || daysUntil <= 1;

            return (
              <div
                key={deadline.id}
                className={cn(
                  'flex items-start gap-3 p-3 rounded-lg border transition-colors',
                  getPriorityColor(deadline.priority),
                  isUrgent && 'ring-2 ring-offset-2 dark:ring-offset-slate-900 ring-rose-500/50'
                )}
              >
                {/* Deadline Icon */}
                <div className="flex-shrink-0 mt-0.5">
                  {isUrgent ? <AlertCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{deadline.title}</p>
                      <p className="text-xs opacity-75 line-clamp-1 mt-0.5">
                        {deadline.projectName}
                      </p>
                    </div>
                    <Badge variant="default" size="sm" className="flex-shrink-0 ml-1">
                      {getStatusLabel(deadline.status)}
                    </Badge>
                  </div>

                  {/* Details */}
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-xs font-medium">{formatDate(deadline.dueDate)}</span>
                    <span className="text-xs opacity-60">•</span>
                    <span className="text-xs font-medium">
                      {getDeadlineStatus(daysUntil, deadline.status)}
                    </span>
                    <span className="text-xs opacity-60">•</span>
                    <div className="flex items-center gap-1">
                      <Avatar
                        name={deadline.assignee.name}
                        size="sm"
                        className="h-4 w-4 text-[8px]"
                      />
                      <span className="text-xs">{deadline.assignee.name.split(' ')[0]}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {deadlines.length === 0 && (
          <div className="text-center py-8">
            <Calendar className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400">No upcoming deadlines</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
