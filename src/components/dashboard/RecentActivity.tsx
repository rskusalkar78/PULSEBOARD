import React from 'react';
import {
  FileText,
  CheckCircle2,
  MessageSquare,
  RefreshCw,
  UserPlus,
  FolderPlus,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Display/Card';
import { Avatar } from '@/components/ui/Display/Avatar';
import { Badge } from '@/components/ui/Display/Badge';
import type { ActivityLog } from '@/types/dashboard';
import { cn } from '@/utils/styles';

export interface RecentActivityProps {
  activities: ActivityLog[];
}

const getActivityIcon = (type: ActivityLog['type']) => {
  switch (type) {
    case 'task_completed':
      return <CheckCircle2 className="h-5 w-5" />;
    case 'project_created':
      return <FolderPlus className="h-5 w-5" />;
    case 'comment_added':
      return <MessageSquare className="h-5 w-5" />;
    case 'project_updated':
      return <RefreshCw className="h-5 w-5" />;
    case 'team_member_joined':
      return <UserPlus className="h-5 w-5" />;
    default:
      return <FileText className="h-5 w-5" />;
  }
};

const getActivityColor = (type: ActivityLog['type']) => {
  switch (type) {
    case 'task_completed':
      return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30';
    case 'project_created':
      return 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30';
    case 'comment_added':
      return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30';
    case 'project_updated':
      return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30';
    case 'team_member_joined':
      return 'text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/30';
    default:
      return 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/30';
  }
};

const getActivityLabel = (type: ActivityLog['type']) => {
  switch (type) {
    case 'task_completed':
      return 'Completed';
    case 'project_created':
      return 'Created';
    case 'comment_added':
      return 'Commented';
    case 'project_updated':
      return 'Updated';
    case 'team_member_joined':
      return 'Joined';
    default:
      return 'Activity';
  }
};

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';

  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';

  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';

  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';

  return 'Just now';
};

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  return (
    <Card className="border border-slate-200 dark:border-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 last:border-0 last:pb-0 group"
            >
              {/* Icon */}
              <div
                className={cn(
                  'flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center',
                  getActivityColor(activity.type)
                )}
              >
                {getActivityIcon(activity.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 line-clamp-2">
                      {activity.title}
                    </p>
                    {activity.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-1">
                        {activity.description}
                      </p>
                    )}
                  </div>
                  <Badge variant="default" size="sm" className="flex-shrink-0 ml-2">
                    {getActivityLabel(activity.type)}
                  </Badge>
                </div>

                {/* User and Time */}
                <div className="flex items-center gap-2 mt-2">
                  <Avatar name={activity.user.name} size="sm" className="h-5 w-5 text-[10px]" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {activity.user.name}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {formatTimeAgo(activity.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {activities.length === 0 && (
          <div className="text-center py-8">
            <FileText className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400">No recent activity</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
