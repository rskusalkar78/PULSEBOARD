import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Spinner } from './Spinner';

/**
 * `Spinner` is an animated loading indicator for asynchronous operations.
 */
const meta: Meta<typeof Spinner> = {
  title: 'UI/Feedback/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
    variant: { control: 'select', options: ['primary', 'white', 'slate'] },
  },
  args: {
    size: 'md',
    variant: 'primary',
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Spinner size="xl" />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex gap-4 items-center bg-slate-800 p-4 rounded-lg">
      <Spinner variant="primary" />
      <Spinner variant="white" />
      <Spinner variant="slate" />
    </div>
  ),
};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
  render: () => (
    <div className="dark bg-slate-900 p-6 rounded-xl flex gap-4 items-center">
      <Spinner size="lg" variant="primary" />
    </div>
  ),
};
