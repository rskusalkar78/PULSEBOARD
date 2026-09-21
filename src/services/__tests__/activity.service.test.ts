import { describe, it, expect, beforeEach } from 'vitest';
import { activityService } from '../activity.service';

describe('ActivityService', () => {
  beforeEach(() => {
    activityService.resetLocalStore();
  });

  describe('Activity Logging for Consistent Event Types', () => {
    it('tracks project created events', async () => {
      const res = await activityService.logProjectCreated('usr-test', {
        id: 'prj-test-1',
        name: 'Alpha Project',
        description: 'Initial project release',
        team_id: 'team-test',
        priority: 'high',
      });

      expect(res.success).toBe(true);
      expect(res.data?.action).toBe('project_created');
      expect(res.data?.entity_type).toBe('project');
      expect(res.data?.entity_id).toBe('prj-test-1');
      expect(res.data?.metadata?.project_name).toBe('Alpha Project');
    });

    it('tracks project updated events with diffs', async () => {
      const res = await activityService.logProjectUpdated(
        'usr-test',
        {
          id: 'prj-test-1',
          name: 'Alpha Project',
          team_id: 'team-test',
        },
        {
          due_date: { from: '2026-09-01', to: '2026-10-01' },
          priority: { from: 'medium', to: 'urgent' },
        }
      );

      expect(res.success).toBe(true);
      expect(res.data?.action).toBe('project_updated');
      expect(res.data?.entity_type).toBe('project');
      expect(res.data?.metadata?.changes).toBeDefined();
    });

    it('tracks task created events', async () => {
      const res = await activityService.logTaskCreated('usr-test', {
        id: 'tsk-test-1',
        title: 'Build Authentication Flow',
        project_id: 'prj-test-1',
        priority: 'urgent',
        status: 'todo',
        assigned_to: 'usr-dev-1',
        projectName: 'Alpha Project',
      });

      expect(res.success).toBe(true);
      expect(res.data?.action).toBe('task_created');
      expect(res.data?.entity_type).toBe('task');
      expect(res.data?.metadata?.task_title).toBe('Build Authentication Flow');
    });

    it('tracks task completed events', async () => {
      const res = await activityService.logTaskCompleted('usr-test', {
        id: 'tsk-test-1',
        title: 'Build Authentication Flow',
        project_id: 'prj-test-1',
        priority: 'urgent',
        projectName: 'Alpha Project',
      });

      expect(res.success).toBe(true);
      expect(res.data?.action).toBe('task_completed');
      expect(res.data?.entity_type).toBe('task');
      expect(res.data?.metadata?.task_status).toBe('completed');
    });

    it('tracks task assigned events', async () => {
      const res = await activityService.logTaskAssigned(
        'usr-test',
        {
          id: 'tsk-test-1',
          title: 'Build Authentication Flow',
          project_id: 'prj-test-1',
          projectName: 'Alpha Project',
        },
        {
          id: 'usr-assignee',
          name: 'Jane Developer',
        }
      );

      expect(res.success).toBe(true);
      expect(res.data?.action).toBe('task_assigned');
      expect(res.data?.metadata?.assigned_to_name).toBe('Jane Developer');
    });

    it('tracks member joined events', async () => {
      const res = await activityService.logMemberJoined('usr-admin', 'team-alpha', {
        id: 'usr-newbie',
        name: 'Jordan Smith',
        role: 'Frontend Engineer',
        teamName: 'Core Platform',
      });

      expect(res.success).toBe(true);
      expect(res.data?.action).toBe('member_joined');
      expect(res.data?.entity_type).toBe('team');
      expect(res.data?.metadata?.team_name).toBe('Core Platform');
    });

    it('tracks settings changed events', async () => {
      const res = await activityService.logSettingsChanged('usr-admin', 'team', {
        requireApproval: { from: false, to: true },
      });

      expect(res.success).toBe(true);
      expect(res.data?.action).toBe('settings_changed');
      expect(res.data?.entity_type).toBe('settings');
      expect(res.data?.metadata?.setting_scope).toBe('team');
    });
  });

  describe('Feed Querying, Filtering & Pagination', () => {
    it('filters activities by action type', async () => {
      await activityService.logProjectCreated('usr-test', {
        id: 'prj-x',
        name: 'Special Project',
        team_id: 'team-x',
      });

      const response = await activityService.getFeed({ action: 'project_created' });
      expect(response.success).toBe(true);
      expect(response.data?.data.length).toBeGreaterThan(0);
      expect(response.data?.data.every((a) => a.action === 'project_created')).toBe(true);
    });

    it('filters activities by entity type', async () => {
      const response = await activityService.getFeed({ entity_type: 'task' });
      expect(response.success).toBe(true);
      expect(response.data?.data.every((a) => a.entity_type === 'task')).toBe(true);
    });

    it('searches activities by keyword', async () => {
      await activityService.logTaskCreated('usr-test', {
        id: 'tsk-unique',
        title: 'UniqKwdTargetTask',
        project_id: 'prj-1',
        priority: 'low',
        status: 'todo',
      });

      const response = await activityService.getFeed({ search: 'UniqKwdTargetTask' });
      expect(response.success).toBe(true);
      expect(response.data?.data.length).toBeGreaterThan(0);
      expect(response.data?.data[0]?.metadata?.task_title).toBe('UniqKwdTargetTask');
    });

    it('paginates results accurately', async () => {
      const limit = 2;
      const page1 = await activityService.getFeed(undefined, { page: 1, limit });
      const page2 = await activityService.getFeed(undefined, { page: 2, limit });

      expect(page1.data?.data.length).toBeLessThanOrEqual(limit);
      expect(page2.data?.data.length).toBeLessThanOrEqual(limit);
      expect(page1.data?.pagination.page).toBe(1);
      expect(page2.data?.pagination.page).toBe(2);
      expect(page1.data?.data[0]?.id).not.toBe(page2.data?.data[0]?.id);
    });

    it('calculates activity statistics', async () => {
      const statsRes = await activityService.getActivityStats();
      expect(statsRes.success).toBe(true);
      expect(statsRes.data?.totalToday).toBeGreaterThan(0);
      expect(typeof statsRes.data?.tasksCompleted).toBe('number');
      expect(typeof statsRes.data?.projectsUpdated).toBe('number');
    });
  });

  describe('Realtime Subscription', () => {
    it('notifies subscribers when new activity is logged', async () => {
      let notified = false;
      const unsubscribe = activityService.subscribe((activity) => {
        if (activity.action === 'settings_changed') {
          notified = true;
        }
      });

      await activityService.logSettingsChanged('usr-test', 'user', {
        theme: { from: 'light', to: 'dark' },
      });

      expect(notified).toBe(true);
      unsubscribe();
    });
  });
});
