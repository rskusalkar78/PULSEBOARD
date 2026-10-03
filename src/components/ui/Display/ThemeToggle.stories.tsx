import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ThemeToggle } from './ThemeToggle';

/**
 * `ThemeToggle` is a 3-way toggle control for switching between Light, System, and Dark modes.
 */
const meta: Meta<typeof ThemeToggle> = {
  title: 'UI/Display/ThemeToggle',
  component: ThemeToggle,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md'] },
  },
  args: {
    size: 'md',
  },
};

export default meta;
type Story = StoryObj<typeof ThemeToggle>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <ThemeToggle size="sm" />
      <ThemeToggle size="md" />
    </div>
  ),
};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
  render: () => (
    <div className="dark bg-slate-900 p-6 rounded-xl">
      <ThemeToggle size="md" />
    </div>
  ),
};
