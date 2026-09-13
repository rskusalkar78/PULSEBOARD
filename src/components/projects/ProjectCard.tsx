import React from 'react';
import {
  FolderKanban,
  Calendar,
  MoreVertical,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  PauseCircle,
  Archive,
} from 'lucide-react';
import { Card, Badge, Avatar, Progress, Dropdown } from '@/components';
import type { ProjectWithDetails, ProjectStatus } from '@/types';

export interface ProjectCardProps {
  project: ProjectWithDetails;
  onEdit: (project: ProjectWithDetails) => void;
  onDelete: (project: ProjectWithDetails) => void;
  onStatusChange: (project: ProjectWithDetails, newStatus: ProjectStatus) => void;
}

const statusConfig: Record<
  ProjectStatus,
  {
    label: string;
    variant: 'primary' | 'success' | 'warning' | 'neutral';
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  active: { label: 'Active', variant: 'primary', icon: Clock },
  completed: { label: 'Completed', variant: 'success', icon: CheckCircle2 },
  on_hold: { label: 'On Hold', variant: 'warning', icon: PauseCircle },
  archived: { label: 'Archived', variant: 'neutral', icon: Archive },
};

const priorityConfig: Record<string, { label: string; colorClass: string }> = {
  low: {
    label: 'Low',
    colorClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  },
  medium: {
    label: 'Medium',
    colorClass: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
  },
  high: {
    label: 'High',
    colorClass: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
  },
  urgent: {
    label: 'Urgent',
    colorClass: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
  },
};

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const statusInfo = statusConfig[project.status] || statusConfig.active;
  const priorityInfo = priorityConfig[project.priority || 'medium'] || priorityConfig.medium;
  const StatusIcon = statusInfo.icon;

  const ownerName = project.owner?.full_name || project.owner?.email || 'Unassigned';
  const ownerAvatar = project.owner?.avatar_url || undefined;
  const progressPercent = Math.min(100, Math.max(0, project.progress || 0));

  const accentColor = project.color || '#6366f1';

  return (
    <Card
      className="p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-200 border-t-4 relative group"
      style={{ borderTopColor: accentColor }}
    >
      <div className="space-y-4">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm text-white"
              style={{ backgroundColor: accentColor }}
            >
              <FolderKanban className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3
                className="text-base font-bold text-slate-900 dark:text-white truncate"
                title={project.name}
              >
                {project.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {project.team?.name
                  ? `Team: ${project.team.name}`
                  : `Visibility: ${project.visibility}`}
              </p>
            </div>
          </div>

          {/* Action Menu */}
          <Dropdown
            trigger={
              <button
                type="button"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Project actions"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            }
            items={[
              {
                id: 'edit',
                label: 'Edit Project',
                icon: <Edit2 className="h-4 w-4" />,
                onClick: () => onEdit(project),
              },
              {
                id: 'status-active',
                label: 'Mark as Active',
                icon: <Clock className="h-4 w-4 text-violet-500" />,
                onClick: () => onStatusChange(project, 'active'),
                disabled: project.status === 'active',
              },
              {
                id: 'status-completed',
                label: 'Mark as Completed',
                icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
                onClick: () => onStatusChange(project, 'completed'),
                disabled: project.status === 'completed',
              },
              {
                id: 'status-hold',
                label: 'Put On Hold',
                icon: <PauseCircle className="h-4 w-4 text-amber-500" />,
                onClick: () => onStatusChange(project, 'on_hold'),
                disabled: project.status === 'on_hold',
              },
              {
                id: 'status-archive',
                label: 'Archive Project',
                icon: <Archive className="h-4 w-4 text-slate-500" />,
                onClick: () => onStatusChange(project, 'archived'),
                disabled: project.status === 'archived',
              },
              {
                id: 'delete',
                label: 'Delete Project',
                icon: <Trash2 className="h-4 w-4 text-rose-500" />,
                onClick: () => onDelete(project),
                danger: true,
              },
            ]}
          />
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 min-h-[40px]">
          {project.description || 'No description provided for this project.'}
        </p>

        {/* Status & Priority Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={statusInfo.variant} size="sm" className="flex items-center gap-1">
            <StatusIcon className="h-3 w-3" />
            {statusInfo.label}
          </Badge>

          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityInfo.colorClass}`}
          >
            {priorityInfo.label} Priority
          </span>
        </div>
      </div>

      {/* Progress & Dates */}
      <div className="space-y-4 pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs font-medium">
            <span className="text-slate-500 dark:text-slate-400">Progress</span>
            <span className="text-slate-900 dark:text-white font-semibold">{progressPercent}%</span>
          </div>
          <Progress
            value={progressPercent}
            size="sm"
            color={progressPercent === 100 ? 'success' : 'primary'}
          />
        </div>

        {/* Footer info: Owner & Due date */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2 min-w-0">
            <Avatar
              src={ownerAvatar}
              alt={ownerName}
              size="xs"
              fallback={ownerName.charAt(0).toUpperCase()}
            />
            <span className="truncate font-medium text-slate-700 dark:text-slate-300">
              {ownerName}
            </span>
          </div>

          {project.due_date && (
            <div className="flex items-center gap-1 shrink-0 text-slate-500">
              <Calendar className="h-3.5 w-3.5" />
              <span>{new Date(project.due_date).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
