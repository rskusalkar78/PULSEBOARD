import React from 'react';
import { Plus, FileText, Users, Settings, BarChart3, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Display/Card';
import { cn } from '@/utils/styles';

export interface QuickAction {
  id: string;
  label: string;
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
  // Default actions if not provided
  const defaultActions: QuickAction[] = [
    {
      id: 'new-project',
      label: 'New Project',
      icon: <Plus className="h-4 w-4" />,
      onClick: onCreateProject || (() => {}),
      variant: 'primary',
    },
    {
      id: 'new-task',
      label: 'New Task',
      icon: <FileText className="h-4 w-4" />,
      onClick: onCreateTask || (() => {}),
      variant: 'secondary',
    },
    {
      id: 'invite-team',
      label: 'Invite Team',
      icon: <Users className="h-4 w-4" />,
      onClick: onInviteTeam || (() => {}),
      variant: 'secondary',
    },
    {
      id: 'view-reports',
      label: 'View Reports',
      icon: <BarChart3 className="h-4 w-4" />,
      onClick: onViewReports || (() => {}),
      variant: 'secondary',
    },
    {
      id: 'generate-insights',
      label: 'AI Insights',
      icon: <MessageSquare className="h-4 w-4" />,
      onClick: onGenerateInsights || (() => {}),
      variant: 'secondary',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="h-4 w-4" />,
      onClick: onOpenSettings || (() => {}),
      variant: 'tertiary',
    },
  ];

  const displayActions = actions || defaultActions;

  return (
    <Card className="border border-slate-200 dark:border-slate-800">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {displayActions.map((action) => (
            <button
              key={action.id}
              onClick={action.onClick}
              disabled={action.disabled}
              className={cn(
                'flex flex-col items-center justify-center gap-2 p-4 rounded-lg transition-all duration-200',
                'border border-slate-200 dark:border-slate-800',
                'hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700',
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
                  'text-slate-700 dark:text-slate-300',
                  'hover:bg-slate-100 dark:hover:bg-slate-700/50',
                ],
                action.variant === 'tertiary' && [
                  'bg-transparent',
                  'text-slate-600 dark:text-slate-400',
                  'hover:bg-slate-50 dark:hover:bg-slate-800/30',
                ]
              )}
              title={action.label}
            >
              <div className="text-lg">{action.icon}</div>
              <span className="text-xs font-medium text-center line-clamp-2">{action.label}</span>
            </button>
          ))}
        </div>

        {displayActions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-slate-500 dark:text-slate-400">No quick actions available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
