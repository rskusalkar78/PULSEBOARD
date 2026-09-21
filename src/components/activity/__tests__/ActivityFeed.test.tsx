import { describe, it, expect } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ActivityFeed } from '../ActivityFeed';
import { ActivityItem } from '../ActivityItem';
import type { ActivityWithRelations } from '@/types';

const mockActivity: ActivityWithRelations = {
  id: 'act-test-ui',
  actor_id: 'usr-ui',
  action: 'project_created',
  entity_type: 'project',
  entity_id: 'prj-ui',
  project_id: 'prj-ui',
  team_id: 'team-ui',
  metadata: {
    title: 'Created Quantum Engine Project',
    description: 'Setup initial Quantum Engine repository and milestones.',
    project_name: 'Quantum Engine',
  },
  created_at: new Date().toISOString(),
  actor: {
    id: 'usr-ui',
    email: 'alex@example.com',
    full_name: 'Alex Tester',
    avatar_url: null,
    role: 'admin',
    bio: null,
    timezone: 'UTC',
    preferences: {
      theme: 'dark',
      notifications: { email: true, push: true, inApp: true },
      language: 'en',
    },
    onboarded: true,
    last_seen_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
};

describe('Activity UI Components', () => {
  describe('ActivityItem', () => {
    it('renders actor avatar, event badge, title, and timestamp', () => {
      render(
        <MemoryRouter>
          <ActivityItem activity={mockActivity} />
        </MemoryRouter>
      );

      expect(screen.getByText('Alex Tester')).toBeInTheDocument();
      expect(screen.getByText('Project Created')).toBeInTheDocument();
      expect(
        screen.getByText('Setup initial Quantum Engine repository and milestones.')
      ).toBeInTheDocument();
      expect(screen.getByText('Quantum Engine')).toBeInTheDocument();
    });

    it('renders diff changes when settings or attributes are modified', () => {
      const updateActivity: ActivityWithRelations = {
        ...mockActivity,
        id: 'act-diff',
        action: 'settings_changed',
        entity_type: 'settings',
        metadata: {
          title: 'Settings Updated',
          description: 'Modified security settings',
          changes: {
            mfaRequired: { from: false, to: true },
          },
        },
      };

      render(
        <MemoryRouter>
          <ActivityItem activity={updateActivity} />
        </MemoryRouter>
      );

      expect(screen.getByText('mfaRequired:')).toBeInTheDocument();
      expect(screen.getByText('false')).toBeInTheDocument();
      expect(screen.getByText('true')).toBeInTheDocument();
    });
  });

  describe('ActivityFeed', () => {
    it('renders loading skeleton and loads activities', async () => {
      render(
        <MemoryRouter>
          <ActivityFeed />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('activity-feed-container')).toBeInTheDocument();
        expect(screen.getByText(/Live Feed/i)).toBeInTheDocument();
      });
    });

    it('handles search filtering in the UI', async () => {
      render(
        <MemoryRouter>
          <ActivityFeed />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Search activities/i)).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText(/Search activities/i);
      fireEvent.change(input, { target: { value: 'Design System' } });

      await waitFor(() => {
        expect(input).toHaveValue('Design System');
      });
    });
  });
});
