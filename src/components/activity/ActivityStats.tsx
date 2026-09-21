import React from 'react';
import { Activity, CheckCircle2, FolderGit2, Users } from 'lucide-react';
import { Card } from '@/components';

export interface ActivityStatsProps {
  stats: {
    totalToday: number;
    tasksCompleted: number;
    projectsUpdated: number;
    activeMembers: number;
  };
  loading?: boolean;
}

export const ActivityStats: React.FC<ActivityStatsProps> = ({ stats, loading = false }) => {
  const cards = [
    {
      title: 'Events Today',
      value: stats.totalToday,
      icon: Activity,
      color:
        'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/60',
      description: 'System actions recorded',
    },
    {
      title: 'Tasks Completed',
      value: stats.tasksCompleted,
      icon: CheckCircle2,
      color:
        'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60',
      description: 'Successfully finished',
    },
    {
      title: 'Projects Touched',
      value: stats.projectsUpdated,
      icon: FolderGit2,
      color:
        'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-800/60',
      description: 'Created or modified',
    },
    {
      title: 'Active Contributors',
      value: stats.activeMembers,
      icon: Users,
      color:
        'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/60',
      description: 'Team members involved',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <Card
            key={idx}
            className="p-4 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {card.title}
              </span>
              <div className={`p-2 rounded-lg border ${card.color}`}>
                <IconComponent className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {loading ? '—' : card.value}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
              {card.description}
            </p>
          </Card>
        );
      })}
    </div>
  );
};
export default ActivityStats;
