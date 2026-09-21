import React from 'react';
import { DownloadCloud } from 'lucide-react';
import { PageHeader, Button } from '@/components';
import { ActivityFeed } from '@/components/activity';
import { activityService } from '@/services';

export const ActivityPage: React.FC = () => {
  const handleExport = async () => {
    try {
      const response = await activityService.getFeed(undefined, { page: 1, limit: 500 });
      if (response.success && response.data) {
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
          JSON.stringify(response.data.data, null, 2)
        )}`;
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', jsonString);
        downloadAnchor.setAttribute(
          'download',
          `pulseboard-activity-export-${new Date().toISOString().slice(0, 10)}.json`
        );
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
      }
    } catch (err) {
      console.error('Failed to export activity feed:', err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <PageHeader
        title="Activity Feed"
        description="Real-time centralized log of projects, tasks, team memberships, and system configuration changes."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Activity Feed' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="gap-1.5"
              aria-label="Export activity log"
            >
              <DownloadCloud className="w-4 h-4" />
              <span>Export Log</span>
            </Button>
          </div>
        }
      />

      {/* Centralized Activity Feed Component */}
      <ActivityFeed />
    </div>
  );
};

export default ActivityPage;
