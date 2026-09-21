import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderPlus,
  RefreshCw,
  CheckCircle2,
  UserCheck,
  UserPlus,
  Settings,
  FileText,
  Clock,
  ExternalLink,
  PlusCircle,
  Shield,
  Layers,
} from 'lucide-react';
import { Avatar, Badge, Tooltip } from '@/components';
import type { ActivityWithRelations, ActivityActionType } from '@/types';
import { cn } from '@/utils/styles';

export interface ActivityItemProps {
  activity: ActivityWithRelations;
  compact?: boolean;
}

export const getActivityConfig = (action: ActivityActionType | string) => {
  switch (action) {
    case 'project_created':
      return {
        label: 'Project Created',
        icon: FolderPlus,
        badgeVariant: 'primary' as const,
        colorClasses:
          'text-violet-500 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-800/60',
        ringColor: 'ring-violet-500/20',
      };
    case 'project_updated':
      return {
        label: 'Project Updated',
        icon: RefreshCw,
        badgeVariant: 'warning' as const,
        colorClasses:
          'text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60',
        ringColor: 'ring-amber-500/20',
      };
    case 'task_created':
      return {
        label: 'Task Created',
        icon: PlusCircle,
        badgeVariant: 'info' as const,
        colorClasses:
          'text-sky-500 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/60',
        ringColor: 'ring-sky-500/20',
      };
    case 'task_completed':
      return {
        label: 'Task Completed',
        icon: CheckCircle2,
        badgeVariant: 'success' as const,
        colorClasses:
          'text-emerald-500 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60',
        ringColor: 'ring-emerald-500/20',
      };
    case 'task_assigned':
      return {
        label: 'Task Assigned',
        icon: UserCheck,
        badgeVariant: 'info' as const,
        colorClasses:
          'text-cyan-500 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800/60',
        ringColor: 'ring-cyan-500/20',
      };
    case 'member_joined':
      return {
        label: 'Member Joined',
        icon: UserPlus,
        badgeVariant: 'danger' as const,
        colorClasses:
          'text-pink-500 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/40 border-pink-200 dark:border-pink-800/60',
        ringColor: 'ring-pink-500/20',
      };
    case 'settings_changed':
      return {
        label: 'Settings Changed',
        icon: Settings,
        badgeVariant: 'default' as const,
        colorClasses:
          'text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/60',
        ringColor: 'ring-indigo-500/20',
      };
    default:
      return {
        label: 'System Activity',
        icon: FileText,
        badgeVariant: 'default' as const,
        colorClasses:
          'text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800',
        ringColor: 'ring-slate-500/20',
      };
  }
};

export const formatRelativeTime = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSec < 45) return 'Just now';
    if (diffSec < 90) return '1 min ago';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} mins ago`;
    if (diffSec < 7200) return '1 hour ago';
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} hours ago`;
    if (diffSec < 172800) return 'Yesterday';
    if (diffSec < 604800) return `${Math.floor(diffSec / 86400)} days ago`;

    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  } catch {
    return 'Recent';
  }
};

export const formatExactTimestamp = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'medium',
    });
  } catch {
    return isoString;
  }
};

export const ActivityItem: React.FC<ActivityItemProps> = ({ activity, compact = false }) => {
  const navigate = useNavigate();
  const config = getActivityConfig(activity.action);
  const IconComponent = config.icon;

  const actorName =
    activity.actor?.full_name || activity.actor?.email?.split('@')[0] || 'System User';
  const meta = activity.metadata || {};
  const title = (meta.title as string) || config.label;
  const description = (meta.description as string) || '';
  const changes = meta.changes as Record<string, { from: unknown; to: unknown }> | undefined;
  const projectName = (meta.project_name as string) || activity.project?.name;

  const handleEntityClick = () => {
    if (activity.entity_type === 'project' || activity.project_id) {
      navigate('/projects');
    } else if (activity.entity_type === 'task') {
      navigate('/tasks');
    } else if (activity.entity_type === 'team' || activity.action === 'member_joined') {
      navigate('/team');
    } else if (activity.entity_type === 'settings' || activity.action === 'settings_changed') {
      navigate('/settings');
    }
  };

  return (
    <div
      className={cn(
        'group relative flex items-start gap-3.5 sm:gap-4 p-4 rounded-xl transition-all duration-200',
        'bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700/80',
        'hover:shadow-sm dark:hover:bg-slate-900/90'
      )}
      data-testid={`activity-item-${activity.id}`}
    >
      {/* Actor Avatar with Event Icon Badge */}
      <div className="relative shrink-0 mt-0.5">
        <Avatar
          name={actorName}
          size={compact ? 'sm' : 'md'}
          className="border-2 border-white dark:border-slate-900 ring-2 ring-slate-100 dark:ring-slate-800"
        />
        <div
          className={cn(
            'absolute -bottom-1 -right-1 p-1 rounded-full border border-white dark:border-slate-900 shadow-xs flex items-center justify-center',
            config.colorClasses
          )}
          title={config.label}
        >
          <IconComponent className="w-3 h-3" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Header & Title */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {actorName}
            </span>
            <Badge
              variant={config.badgeVariant}
              size="sm"
              className="font-normal text-[11px] py-0 px-2"
            >
              {config.label}
            </Badge>
            {projectName && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md font-medium">
                <Layers className="w-3 h-3 text-slate-400" />
                {projectName}
              </span>
            )}
          </div>

          {/* Timestamp */}
          <Tooltip content={formatExactTimestamp(activity.created_at)}>
            <time
              dateTime={activity.created_at}
              className="inline-flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 font-mono shrink-0 cursor-help"
            >
              <Clock className="w-3 h-3" />
              {formatRelativeTime(activity.created_at)}
            </time>
          </Tooltip>
        </div>

        {/* Action Title / Description */}
        <p className="text-sm text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
          {description || title}
        </p>

        {/* Changes Diff Table or Extra Tags if available */}
        {changes && Object.keys(changes).length > 0 && (
          <div className="mt-2.5 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60 text-xs font-mono space-y-1">
            {Object.entries(changes).map(([key, change]) => (
              <div key={key} className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-slate-800 dark:text-slate-200">{key}:</span>
                <span className="line-through text-red-500/80 dark:text-red-400/80">
                  {String(change.from ?? 'none')}
                </span>
                <span>→</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  {String(change.to ?? 'none')}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Action Link Footer */}
        <div className="mt-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
            {meta.task_priority && (
              <span className="capitalize font-medium text-amber-600 dark:text-amber-400">
                Priority: {String(meta.task_priority)}
              </span>
            )}
            {meta.member_role && (
              <span className="capitalize text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Role: {String(meta.member_role)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleEntityClick}
            className="inline-flex items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
          >
            <span>View {activity.entity_type || 'details'}</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default ActivityItem;
