import React from 'react';
import { Briefcase, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Display/Card';
import { Progress } from '@/components/ui/Display/Progress';
import { Badge } from '@/components/ui/Display/Badge';
import type { ProjectMetrics } from '@/types/dashboard';
import { cn } from '@/utils/styles';

export interface ProjectProgressProps {
  projects: ProjectMetrics[];
  maxProjects?: number;
}

const getStatusColor = (status: ProjectMetrics['status']) => {
  switch (status) {
    case 'active':
      return 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30';
    case 'completed':
      return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30';
    case 'planning':
      return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30';
    case 'on_hold':
      return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30';
  }
};

const getStatusLabel = (status: ProjectMetrics['status']) => {
  switch (status) {
    case 'active':
      return 'Active';
    case 'completed':
      return 'Completed';
    case 'planning':
      return 'Planning';
    case 'on_hold':
      return 'On Hold';
  }
};

const getProgressVariant = (completion: number) => {
  if (completion >= 80) return 'success';
  if (completion >= 50) return 'primary';
  if (completion >= 25) return 'warning';
  return 'danger';
};

export const ProjectProgress: React.FC<ProjectProgressProps> = ({ projects, maxProjects = 5 }) => {
  const displayProjects = projects.slice(0, maxProjects);
  const totalCompletion =
    projects.length > 0
      ? Math.round(projects.reduce((sum, p) => sum + p.completion, 0) / projects.length)
      : 0;

  return (
    <Card className="border border-slate-200 dark:border-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            Project Progress
          </CardTitle>
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            Avg: {totalCompletion}%
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {displayProjects.map((project) => (
            <div key={project.id}>
              {/* Project Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 line-clamp-1">
                    {project.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Badge
                      variant="default"
                      size="sm"
                      className={cn(getStatusColor(project.status))}
                    >
                      {getStatusLabel(project.status)}
                    </Badge>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {project.completedTasks}/{project.taskCount} tasks
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <Users className="h-3 w-3" />
                      <span>{project.teamSize} members</span>
                    </div>
                  </div>
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100 ml-2">
                  {project.completion}%
                </span>
              </div>

              {/* Progress Bar */}
              <Progress
                value={project.completion}
                max={100}
                size="md"
                variant={getProgressVariant(project.completion)}
              />

              {/* Due Date */}
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Due{' '}
                {new Date(project.dueDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-8">
            <Briefcase className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400">No projects</p>
          </div>
        )}

        {projects.length > maxProjects && (
          <button className="w-full mt-6 py-2 text-sm font-medium text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/30 rounded-lg transition-colors border border-violet-200 dark:border-violet-900/50">
            View all {projects.length} projects
          </button>
        )}
      </CardContent>
    </Card>
  );
};
