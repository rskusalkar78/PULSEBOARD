import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Separator } from './Separator';

/**
 * `Separator` visually divides content sections either horizontally or vertically.
 */
const meta: Meta<typeof Separator> = {
  title: 'UI/Display/Separator',
  component: Separator,
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    label: { control: 'text' },
  },
  args: {
    orientation: 'horizontal',
  },
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <p className="text-sm font-medium">Section 1 Header</p>
      <Separator orientation="horizontal" />
      <p className="text-sm font-medium">Section 2 Content</p>
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <Separator label="OR CONTINUE WITH" />
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex items-center h-8 text-sm font-medium">
      <span>Dashboard</span>
      <Separator orientation="vertical" />
      <span>Analytics</span>
      <Separator orientation="vertical" />
      <span>Settings</span>
    </div>
  ),
};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
  render: () => (
    <div className="dark bg-slate-900 p-6 rounded-xl space-y-4 max-w-md">
      <p className="text-sm text-slate-200">Dark Mode Top Content</p>
      <Separator label="DIVIDER" />
      <p className="text-sm text-slate-200">Dark Mode Bottom Content</p>
    </div>
  ),
};
