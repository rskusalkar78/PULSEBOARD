/**
 * Services Index
 * Central export point for all database services
 */

export { BaseService } from './base.service';

export { profileService } from './profile.service';
export { teamService } from './team.service';
export { projectService } from './project.service';
export { taskService } from './task.service';
export { activityService } from './activity.service';
export { notificationService } from './notification.service';
export { analyticsService } from './analytics.service';

// Default export with all services
export default {
  profile: profileService,
  team: teamService,
  project: projectService,
  task: taskService,
  activity: activityService,
  notification: notificationService,
  analytics: analyticsService,
};
