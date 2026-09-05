import React from 'react';
import { Users, CheckCircle2, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Display/Card';
import { Avatar } from '@/components/ui/Display/Avatar';
import { Badge } from '@/components/ui/Display/Badge';
import type { TeamMember, TeamActivity as TeamActivityType } from '@/types/dashboard';
import { cn } from '@/utils/styles';

export interface TeamActivityProps {
  teamMembers: TeamMember[];
  activityTrend?: TeamActivityType[];
}

const getStatusColor = (status: TeamMember['status']) => {
  switch (status) {
    case 'active':
      return 'bg-emerald-500';
    case 'idle':
      return 'bg-amber-500';
    case 'offline':
      return 'bg-slate-500';
  }
};

const getStatusLabel = (status: TeamMember['status']) => {
  switch (status) {
    case 'active':
      return 'Active';
    case 'idle':
      return 'Idle';
    case 'offline':
      return 'Offline';
  }
};

export const TeamActivity: React.FC<TeamActivityProps> = ({ teamMembers, activityTrend }) => {
  const activeCount = teamMembers.filter((m) => m.status === 'active').length;
  const idleCount = teamMembers.filter((m) => m.status === 'idle').length;

  // Get latest activity if available
  const latestActivity = activityTrend?.[activityTrend.length - 1];
  return (
    <Card className="h-full border border-slate-200 dark:border-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          Team Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Team Status Overview */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 p-3 text-center">
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {activeCount}
            </p>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">Active</p>
          </div>
          <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 p-3 text-center">
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{idleCount}</p>
            <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">Idle</p>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-center">
            <p className="text-2xl font-bold text-slate-600 dark:text-slate-400">
              {teamMembers.length}
            </p>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">Total</p>
          </div>
        </div>

        {/* Team Members List */}
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
            Team Members
          </h4>
          <div className="space-y-2">
            {teamMembers.slice(0, 5).map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="relative flex-shrink-0">
                    <Avatar name={member.name} size="md" className="h-8 w-8 text-xs" />
                    <div
                      className={cn(
                        'absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-slate-900',
                        getStatusColor(member.status)
                      )}
                      aria-label={`Status: ${getStatusLabel(member.status)}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                      {member.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {member.role}
                    </p>
                  </div>
                </div>
                <Badge variant="default" size="sm" className="flex-shrink-0 ml-2">
                  {getStatusLabel(member.status)}
                </Badge>
              </div>
            ))}
          </div>
          {teamMembers.length > 5 && (
            <button className="w-full mt-3 py-2 text-sm font-medium text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/30 rounded-lg transition-colors">
              View all {teamMembers.length} members
            </button>
          )}
        </div>

        {/* Activity Summary */}
        {latestActivity && (
          <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {latestActivity.completedTasks}
                </span>{' '}
                tasks completed today
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span className="text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {latestActivity.activeUsers}
                </span>{' '}
                team members active
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
