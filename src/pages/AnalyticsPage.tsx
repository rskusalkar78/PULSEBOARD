import React from 'react';
import { PageHeader, Card } from '@/components';

export const AnalyticsPage: React.FC = () => {
  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Track your key metrics and performance indicators."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Analytics' }]}
      />

      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Performance Overview
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Analytics content will be displayed here.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
