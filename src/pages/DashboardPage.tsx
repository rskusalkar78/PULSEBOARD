import React from 'react';
import { Plus } from 'lucide-react';
import { PageHeader, Button, Card } from '@/components';

export const DashboardPage: React.FC = () => {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's an overview of your workspace."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Dashboard' }]}
        actions={
          <>
            <Button variant="outline" size="md">
              Export
            </Button>
            <Button variant="primary" size="md" leftIcon={<Plus className="h-4 w-4" />}>
              New Project
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            Active Projects
          </h3>
          <p className="text-3xl font-bold text-violet-600 dark:text-violet-400">12</p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">+2 from last month</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            Team Members
          </h3>
          <p className="text-3xl font-bold text-violet-600 dark:text-violet-400">24</p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Across 3 departments</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            Tasks Completed
          </h3>
          <p className="text-3xl font-bold text-violet-600 dark:text-violet-400">156</p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">This week</p>
        </Card>
      </div>

      <div className="mt-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 last:border-0 last:pb-0"
              >
                <div className="h-10 w-10 rounded-full bg-violet-100 dark:bg-violet-950/50 flex items-center justify-center">
                  <span className="text-sm font-semibold text-violet-600 dark:text-violet-400">
                    A{i}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Activity {i}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Updated {i} hour ago</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
