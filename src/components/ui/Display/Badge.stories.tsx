import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Badge } from './Badge';

/**
 * `Badge` highlights status, labels, counts or categories.
 */
const meta: Meta<typeof Badge> = {
  title: 'UI/Display/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'danger', 'outline'],
    },
    size: { control: 'select', options: ['sm', 'md'] },
    dot: { control: 'boolean' },
  },
  args: {
    children: 'Badge',
    variant: 'primary',
    size: 'sm',
    dot: true,
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Badge variant="default">Default</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="danger">Danger</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};

export const WithDotIndicator: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Badge variant="success" dot>
        Active
      </Badge>
      <Badge variant="warning" dot>
        Pending
      </Badge>
      <Badge variant="danger" dot>
        Failed
      </Badge>
      <Badge variant="primary" dot>
        In Progress
      </Badge>
    </div>
  ),
};

export const Dismissible: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Badge variant="primary" onDismiss={() => alert('Dismissed')}>
        React
      </Badge>
      <Badge variant="success" onDismiss={() => alert('Dismissed')}>
        TypeScript
      </Badge>
    </div>
  ),
};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
  render: () => (
    <div className="dark bg-slate-900 p-6 rounded-xl flex flex-wrap gap-3 items-center">
      <Badge variant="default" dot>
        Default
      </Badge>
      <Badge variant="primary" dot>
        Primary
      </Badge>
      <Badge variant="success" dot>
        Success
      </Badge>
      <Badge variant="warning" dot>
        Warning
      </Badge>
      <Badge variant="danger" dot>
        Danger
      </Badge>
    </div>
  ),
};

export const ResponsiveBehavior: Story = {
  render: () => (
    <div className="w-full max-w-sm border p-4 rounded-xl flex items-center justify-between">
      <span className="text-sm font-medium">Task Status</span>
      <Badge variant="success" dot size="md">
        Completed
      </Badge>
    </div>
  ),
};
