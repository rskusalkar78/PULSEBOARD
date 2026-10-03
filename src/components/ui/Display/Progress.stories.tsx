import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Progress } from './Progress';

/**
 * `Progress` communicates completion status for a task, file upload, or loading process.
 */
const meta: Meta<typeof Progress> = {
  title: 'UI/Display/Progress',
  component: Progress,
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['primary', 'success', 'warning', 'danger'] },
    showLabel: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
  },
  args: {
    value: 65,
    size: 'md',
    variant: 'primary',
    showLabel: true,
    indeterminate: false,
  },
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <Progress value={80} variant="primary" showLabel />
      <Progress value={100} variant="success" showLabel />
      <Progress value={45} variant="warning" showLabel />
      <Progress value={20} variant="danger" showLabel />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <Progress value={50} size="sm" />
      <Progress value={50} size="md" />
      <Progress value={50} size="lg" />
    </div>
  ),
};

export const LoadingIndeterminate: Story = {
  args: {
    indeterminate: true,
    showLabel: false,
  },
};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
  render: () => (
    <div className="dark bg-slate-900 p-6 rounded-xl space-y-4 max-w-md">
      <Progress value={75} variant="primary" showLabel />
      <Progress value={30} variant="danger" showLabel />
      <Progress indeterminate variant="success" />
    </div>
  ),
};

export const ResponsiveBehavior: Story = {
  render: () => (
    <div className="w-full max-w-xl border p-4 rounded-xl space-y-2">
      <p className="text-xs text-slate-500">Storage Usage (45GB / 50GB)</p>
      <Progress value={90} variant="warning" showLabel />
    </div>
  ),
};
