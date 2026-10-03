import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Button } from './Button';
import { Plus, Trash2, ArrowRight } from 'lucide-react';

/**
 * The `Button` component triggers an action or event when clicked.
 * Supports multiple visual variants, sizes, loading indicator, disabled state, and left/right icons.
 */
const meta: Meta<typeof Button> = {
  title: 'UI/Button/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger', 'link'],
      description: 'Visual appearance variant of the button',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the button',
    },
    isLoading: {
      control: 'boolean',
      description: 'Displays loading spinner and disables interaction',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables button interactions',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Expands button to fill parent width',
    },
    onClick: { action: 'clicked' },
  },
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'md',
    isLoading: false,
    disabled: false,
    fullWidth: false,
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

/** Default button state */
export const Default: Story = {
  args: {
    children: 'Click me',
  },
};

/** All button variants */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

/** Button sizes */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <Button size="sm">Small (sm)</Button>
      <Button size="md">Medium (md)</Button>
      <Button size="lg">Large (lg)</Button>
    </div>
  ),
};

/** Loading state showing spinner */
export const LoadingState: Story = {
  args: {
    children: 'Saving Changes',
    isLoading: true,
  },
};

/** Disabled state preventing click actions */
export const DisabledState: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
};

/** Error or Danger state */
export const ErrorState: Story = {
  args: {
    variant: 'danger',
    children: 'Delete Resource',
    leftIcon: <Trash2 className="w-4 h-4" />,
  },
};

/** Buttons with left or right icons */
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <Button leftIcon={<Plus className="w-4 h-4" />}>Add Item</Button>
      <Button rightIcon={<ArrowRight className="w-4 h-4" />}>Continue</Button>
    </div>
  ),
};

/** Dark mode demonstration */
export const DarkMode: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  globals: {
    theme: 'dark',
  },
  render: () => (
    <div className="dark bg-slate-900 p-6 rounded-xl flex flex-wrap gap-4 items-center">
      <Button variant="primary">Primary Dark</Button>
      <Button variant="secondary">Secondary Dark</Button>
      <Button variant="outline">Outline Dark</Button>
      <Button variant="ghost">Ghost Dark</Button>
      <Button variant="danger">Danger Dark</Button>
    </div>
  ),
};

/** Responsive behavior demonstrating full width toggle */
export const ResponsiveBehavior: Story = {
  render: () => (
    <div className="w-full max-w-md border p-4 rounded-lg space-y-4">
      <p className="text-xs text-slate-500">
        Adapts to parent container when fullWidth is enabled:
      </p>
      <Button fullWidth variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
        Full Width Action
      </Button>
    </div>
  ),
};
