import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  FileText,
  Users,
  Settings,
  BarChart3,
  MessageSquare,
  MoreVertical,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Dropdown } from '@/components';
import { cn } from '@/utils/styles';

export interface QuickAction {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary';
  disabled?: boolean;
}

export interface QuickActionsProps {
  actions?: QuickAction[];
  onCreateProject?: () => void;
  onCreateTask?: () => void;
  onInviteTeam?: () => void;
  onViewReports?: () => void;
  onGenerateInsights?: () => void;
  onOpenSettings?: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  actions,
  onCreateProject,
  onCreateTask,
  onInviteTeam,
  onViewReports,
  onGenerateInsights,
  onOpenSettings,
}) => {
  const navigate = useNavigate();

  const defaultActions: QuickAction[] = [
    {
      id: 'new-project',
      label: 'New Project',
      description: 'Create a new project workspace',
      icon: <Plus className="h-5 w-5" />,
      onClick: onCreateProject || (() => navigate('/projects')),
      variant: 'primary',
    },
    {
      id: 'new-task',
      label: 'New Task',
      description: 'Add a new task to your board',
      icon: <FileText className="h-5 w-5" />,
      onClick: onCreateTask || (() => navigate('/projects')),
      variant: 'secondary',
    },
    {
      id: 'invite-team',
      label: 'Invite Team',
      description: 'Add members to your team',
      icon: <Users className="h-5 w-5" />,
      onClick: onInviteTeam || (() => navigate('/team')),
      variant: 'secondary',
    },
    {
      id: 'view-reports',
      label: 'View Reports',
      description: 'Inspect performance metrics',
      icon: <BarChart3 className="h-5 w-5" />,
      onClick: onViewReports || (() => navigate('/analytics')),
      variant: 'secondary',
    },
    {
      id: 'generate-insights',
      label: 'AI Insights',
      description: 'Automated workspace summaries',
      icon: <MessageSquare className="h-5 w-5" />,
      onClick: onGenerateInsights || (() => navigate('/analytics')),
      variant: 'secondary',
    },
    {
      id: 'settings',
      label: 'Settings',
      description: 'Manage preferences & workspace',
      icon: <Settings className="h-5 w-5" />,
      onClick: onOpenSettings || (() => navigate('/settings')),
      variant: 'tertiary',
    },
  ];

  const displayActions = actions || defaultActions;

  return (
    <Card className="border border-slate-200 dark:border-slate-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Quick Actions</CardTitle>

        {/* More Options Dropdown */}
        <Dropdown
          trigger={
            <button
              type="button"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="More quick options"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          }
          items={[
            {
              id: 'all-projects',
              label: 'View All Projects',
              icon: <Plus className="h-4 w-4 text-violet-500" />,
              onClick: () => navigate('/projects'),
            },
            {
              id: 'all-analytics',
              label: 'View Analytics',
              icon: <BarChart3 className="h-4 w-4 text-blue-500" />,
              onClick: () => navigate('/analytics'),
            },
            {
              id: 'team-manage',
              label: 'Manage Team',
              icon: <Users className="h-4 w-4 text-emerald-500" />,
              onClick: () => navigate('/team'),
            },
            {
              id: 'settings-link',
              label: 'Workspace Settings',
              icon: <Settings className="h-4 w-4 text-slate-500" />,
              onClick: () => navigate('/settings'),
            },
          ]}
        />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {displayActions.map((action) => (
            <button
              key={action.id}
              onClick={action.onClick}
              disabled={action.disabled}
              className={cn(
                'flex items-center gap-3 p-3.5 rounded-xl transition-all duration-200 text-left w-full',
                'border border-slate-200 dark:border-slate-800/80',
                'hover:shadow-sm hover:border-slate-300 dark:hover:border-slate-700',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 focus:ring-violet-500',
                action.variant === 'primary' && [
                  'bg-violet-50 dark:bg-violet-950/30',
                  'border-violet-200 dark:border-violet-900/50',
                  'text-violet-700 dark:text-violet-300',
                  'hover:bg-violet-100 dark:hover:bg-violet-950/50',
                ],
                action.variant === 'secondary' && [
                  'bg-slate-50 dark:bg-slate-800/50',
                  'text-slate-800 dark:text-slate-200',
                  'hover:bg-slate-100 dark:hover:bg-slate-700/50',
                ],
                action.variant === 'tertiary' && [
                  'bg-transparent',
                  'text-slate-700 dark:text-slate-300',
                  'hover:bg-slate-50 dark:hover:bg-slate-800/30',
                ]
              )}
            >
              <div className="p-2 rounded-lg bg-white dark:bg-slate-900/80 shadow-xs shrink-0 text-violet-600 dark:text-violet-400">
                {action.icon}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-sm font-semibold block truncate">{action.label}</span>
                {action.description && (
                  <span className="text-xs text-slate-500 dark:text-slate-400 block truncate font-normal">
                    {action.description}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
