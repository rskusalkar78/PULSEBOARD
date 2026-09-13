import React from 'react';
import {
  MoreVertical,
  Edit2,
  Trash2,
  Clock,
  CheckCircle2,
  PauseCircle,
  Archive,
  Calendar,
  FolderKanban,
} from 'lucide-react';
import { Card, Badge, Avatar, Progress, Dropdown, Table } from '@/components';
import type { ProjectWithDetails, ProjectStatus } from '@/types';

export interface ProjectTableProps {
  projects: ProjectWithDetails[];
  onEdit: (project: ProjectWithDetails) => void;
  onDelete: (project: ProjectWithDetails) => void;
  onStatusChange: (project: ProjectWithDetails, newStatus: ProjectStatus) => void;
}

const statusConfig: Record<
  ProjectStatus,
  { label: string; variant: 'primary' | 'success' | 'warning' | 'neutral' }
> = {
  active: { label: 'Active', variant: 'primary' },
  completed: { label: 'Completed', variant: 'success' },
  on_hold: { label: 'On Hold', variant: 'warning' },
  archived: { label: 'Archived', variant: 'neutral' },
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

export const ProjectTable: React.FC<ProjectTableProps> = ({
  projects,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const columns = [
    {
      key: 'name',
      header: 'Project',
      cell: (project: ProjectWithDetails) => {
        const accentColor = project.color || '#6366f1';
        return (
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0 text-white font-medium text-xs shadow-sm"
              style={{ backgroundColor: accentColor }}
            >
              <FolderKanban className="h-4 w-4" />
            </div>
            <div>
              <p
                className="text-sm font-semibold text-slate-900 dark:text-white hover:underline cursor-pointer"
                onClick={() => onEdit(project)}
              >
                {project.name}
              </p>
              {project.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 max-w-xs">
                  {project.description}
                </p>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      cell: (project: ProjectWithDetails) => {
        const info = statusConfig[project.status] || statusConfig.active;
        return (
          <Badge variant={info.variant} size="sm">
            {info.label}
          </Badge>
        );
      },
    },
    {
      key: 'priority',
      header: 'Priority',
      cell: (project: ProjectWithDetails) => {
        const priorityInfo = priorityConfig[project.priority || 'medium'] || priorityConfig.medium;
        return (
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityInfo.colorClass}`}
          >
            {priorityInfo.label}
          </span>
        );
      },
    },
    {
      key: 'progress',
      header: 'Progress',
      cell: (project: ProjectWithDetails) => {
        const pct = Math.min(100, Math.max(0, project.progress || 0));
        return (
          <div className="w-32 space-y-1">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-600 dark:text-slate-400">{pct}%</span>
            </div>
            <Progress value={pct} size="sm" color={pct === 100 ? 'success' : 'primary'} />
          </div>
        );
      },
    },
    {
      key: 'owner',
      header: 'Owner',
      cell: (project: ProjectWithDetails) => {
        const ownerName = project.owner?.full_name || project.owner?.email || 'Unassigned';
        const avatarUrl = project.owner?.avatar_url || undefined;
        return (
          <div className="flex items-center gap-2">
            <Avatar
              src={avatarUrl}
              alt={ownerName}
              size="xs"
              fallback={ownerName.charAt(0).toUpperCase()}
            />
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate max-w-[120px]">
              {ownerName}
            </span>
          </div>
        );
      },
    },
    {
      key: 'dates',
      header: 'Due Date',
      cell: (project: ProjectWithDetails) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Calendar className="h-3.5 w-3.5" />
          <span>
            {project.due_date ? new Date(project.due_date).toLocaleDateString() : 'No date'}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      cell: (project: ProjectWithDetails) => (
        <Dropdown
          trigger={
            <button
              type="button"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Actions"
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
              label: 'Mark Active',
              icon: <Clock className="h-4 w-4 text-violet-500" />,
              onClick: () => onStatusChange(project, 'active'),
              disabled: project.status === 'active',
            },
            {
              id: 'status-completed',
              label: 'Mark Completed',
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
      ),
    },
  ];

  return (
    <Card className="p-0 overflow-hidden">
      <Table columns={columns} data={projects} keyExtractor={(p) => p.id} />
    </Card>
  );
};
