import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { EmptyState } from './EmptyState';
import { FolderOpen, Search, Inbox, AlertTriangle } from 'lucide-react';
import { Button } from '../Button/Button';

/**
 * `EmptyState` displays helpful graphics, titles, descriptions and actions when content is missing.
 */
const meta: Meta<typeof EmptyState> = {
  title: 'UI/Display/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
  },
  args: {
    title: 'No tasks found',
    description: 'Get started by creating your first task for this project.',
    icon: <FolderOpen className="w-6 h-6" />,
    action: (
      <Button variant="primary" size="sm">
        Create Task
      </Button>
    ),
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {};

export const NoSearchResults: Story = {
  args: {
    title: 'No results matched your filter',
    description: 'Try adjusting your search keywords or clearing filter parameters.',
    icon: <Search className="w-6 h-6" />,
    action: (
      <Button variant="outline" size="sm">
        Clear Filters
      </Button>
    ),
  },
};

export const ErrorState: Story = {
  args: {
    title: 'Failed to load notifications',
    description: 'We encountered an error retrieving your feed. Please try again.',
    icon: <AlertTriangle className="w-6 h-6 text-rose-500" />,
    action: (
      <Button variant="danger" size="sm">
        Retry Connection
      </Button>
    ),
  },
};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
  render: () => (
    <div className="dark bg-slate-900 p-6 rounded-xl max-w-md">
      <EmptyState
        title="Inbox zero"
        description="You're all caught up! No unread notifications."
        icon={<Inbox className="w-6 h-6" />}
      />
    </div>
  ),
};

export const ResponsiveBehavior: Story = {
  render: () => (
    <div className="w-full max-w-lg border p-4 rounded-xl">
      <EmptyState
        title="Empty Board Column"
        description="Drag tasks here to change state or click below to add a new card."
        action={
          <Button variant="secondary" size="sm">
            Add Card
          </Button>
        }
      />
    </div>
  ),
};
