import React from 'react';
import { PageHeader, Card } from '@/components';
import { FolderKanban } from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  return (
    <div>
      <PageHeader
        title="Projects"
        description="Manage your projects and track their progress."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Projects' }]}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-lg bg-violet-100 dark:bg-violet-950/50 flex items-center justify-center">
                <FolderKanban className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Project {i}</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Project description goes here with details about the work.
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
