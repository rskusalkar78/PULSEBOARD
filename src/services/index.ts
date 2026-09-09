/**
 * Services Index
 * Central export point for all database services
 */

import { profileService } from './profile.service';
import { teamService } from './team.service';
import { projectService } from './project.service';
import { taskService } from './task.service';
import { activityService } from './activity.service';
import { notificationService } from './notification.service';
import { analyticsService } from './analytics.service';

export { BaseService } from './base.service';

export {
  profileService,
  teamService,
  projectService,
  taskService,
  activityService,
  notificationService,
  analyticsService,
};

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
