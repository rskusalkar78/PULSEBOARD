import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Alert } from './Alert';
import { Button } from '../Button/Button';

/**
 * `Alert` renders contextual feedback messages for user actions or system states.
 */
const meta: Meta<typeof Alert> = {
  title: 'UI/Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['info', 'success', 'warning', 'danger'] },
    title: { control: 'text' },
    dismissible: { control: 'boolean' },
  },
  args: {
    variant: 'info',
    title: 'Update Available',
    children: 'A new version of PulseBoard is ready to install.',
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="space-y-4 max-w-lg">
      <Alert variant="info" title="System Maintenance">
        Scheduled downtime on Sunday at 02:00 UTC.
      </Alert>
      <Alert variant="success" title="Changes Saved">
        Your project settings have been updated successfully.
      </Alert>
      <Alert variant="warning" title="Storage Limit Reached">
        You are currently using 95% of allocated cloud storage.
      </Alert>
      <Alert variant="danger" title="Authentication Error">
        Invalid session token. Please sign in again.
      </Alert>
    </div>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Alert
      variant="warning"
      title="Unsaved Changes"
      action={
        <Button variant="outline" size="sm">
          Save Now
        </Button>
      }
      dismissible
    >
      You have unsaved changes in this document.
    </Alert>
  ),
};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
  render: () => (
    <div className="dark bg-slate-900 p-6 rounded-xl space-y-4 max-w-lg">
      <Alert variant="info" title="Dark Info Alert">
        Dark theme styled notification panel.
      </Alert>
      <Alert variant="danger" title="Dark Error Alert">
        Action failed in dark environment.
      </Alert>
    </div>
  ),
};
