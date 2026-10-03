import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Skeleton } from './Skeleton';

/**
 * `Skeleton` provides animated placeholder loading shapes before content is rendered.
 */
const meta: Meta<typeof Skeleton> = {
  title: 'UI/Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['text', 'circular', 'rectangular'] },
  },
  args: {
    variant: 'text',
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  args: {
    width: 250,
  },
};

export const Variants: Story = {
  render: () => (
    <div className="space-y-4 max-w-sm">
      <Skeleton variant="text" />
      <Skeleton variant="circular" width={48} height={48} />
      <Skeleton variant="rectangular" height={120} />
    </div>
  ),
};

export const CardSkeletonLayout: Story = {
  render: () => (
    <div className="w-full max-w-sm border p-4 rounded-xl space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-1">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      <Skeleton variant="rectangular" height={100} />
    </div>
  ),
};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
  render: () => (
    <div className="dark bg-slate-900 p-6 rounded-xl space-y-3 max-w-sm">
      <Skeleton variant="text" />
      <Skeleton variant="rectangular" height={80} />
    </div>
  ),
};
