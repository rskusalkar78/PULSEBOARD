/**
 * Mock Service Worker Handlers
 * Request handlers for API mocking in tests
 */

import { http, HttpResponse } from 'msw';
import {
  createMockProject,
  createMockTask,
  createMockNotification,
  createMockItems,
} from '../factories';

const API_BASE_URL = import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321';

/**
 * Default API Handlers
 */
export const handlers = [
  // Projects
  http.get(`${API_BASE_URL}/rest/v1/projects`, () => {
    const projects = createMockItems(createMockProject, 5);
    return HttpResponse.json(projects);
  }),

  http.get(`${API_BASE_URL}/rest/v1/projects/:id`, ({ params }) => {
    const project = createMockProject({ id: params.id as string });
    return HttpResponse.json(project);
  }),

  http.post(`${API_BASE_URL}/rest/v1/projects`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const project = createMockProject(body);
    return HttpResponse.json(project, { status: 201 });
  }),

  http.patch(`${API_BASE_URL}/rest/v1/projects/:id`, async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const project = createMockProject({ id: params.id as string, ...body });
    return HttpResponse.json(project);
  }),

  http.delete(`${API_BASE_URL}/rest/v1/projects/:id`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // Tasks
  http.get(`${API_BASE_URL}/rest/v1/tasks`, () => {
    const tasks = createMockItems(createMockTask, 10);
    return HttpResponse.json(tasks);
  }),

  http.get(`${API_BASE_URL}/rest/v1/tasks/:id`, ({ params }) => {
    const task = createMockTask({ id: params.id as string });
    return HttpResponse.json(task);
  }),

  http.post(`${API_BASE_URL}/rest/v1/tasks`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const task = createMockTask(body);
    return HttpResponse.json(task, { status: 201 });
  }),

  http.patch(`${API_BASE_URL}/rest/v1/tasks/:id`, async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const task = createMockTask({ id: params.id as string, ...body });
    return HttpResponse.json(task);
  }),

  http.delete(`${API_BASE_URL}/rest/v1/tasks/:id`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // Notifications
  http.get(`${API_BASE_URL}/rest/v1/notifications`, () => {
    const notifications = createMockItems(createMockNotification, 5);
    return HttpResponse.json(notifications);
  }),

  http.patch(`${API_BASE_URL}/rest/v1/notifications/:id`, async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const notification = createMockNotification({ id: params.id as string, ...body });
    return HttpResponse.json(notification);
  }),
];

/**
 * Error Handlers for Testing Error States
 */
export const errorHandlers = [
  http.get(`${API_BASE_URL}/rest/v1/projects`, () => {
    return HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }),

  http.post(`${API_BASE_URL}/rest/v1/projects`, () => {
    return HttpResponse.json(
      { message: 'Validation Error', details: 'Name is required' },
      { status: 400 }
    );
  }),
];
