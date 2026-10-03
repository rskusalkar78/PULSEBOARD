import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Switch } from './Switch';

/**
 * `Switch` toggles between binary states (on/off).
 */
const meta: Meta<typeof Switch> = {
  title: 'UI/Form/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    checked: { control: 'boolean' },
  },
  args: {
    label: 'Push Notifications',
    description: 'Receive real-time alerts when tasks are assigned to you',
    size: 'md',
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Switch size="sm" label="Small Switch (sm)" checked />
      <Switch size="md" label="Medium Switch (md)" checked />
      <Switch size="lg" label="Large Switch (lg)" checked />
    </div>
  ),
};

export const DisabledState: Story = {
  render: () => (
    <div className="space-y-4">
      <Switch label="Disabled Off" disabled />
      <Switch label="Disabled On" disabled checked />
    </div>
  ),
};

const InteractiveSwitchDemo: React.FC = () => {
  const [enabled, setEnabled] = useState(true);
  return (
    <Switch
      label="Enable 2-Factor Authentication"
      description="Requires an authenticator app code on login"
      checked={enabled}
      onCheckedChange={setEnabled}
    />
  );
};

export const Interactive: Story = {
  render: () => <InteractiveSwitchDemo />,
};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
  render: () => (
    <div className="dark bg-slate-900 p-6 rounded-xl space-y-4">
      <Switch label="Dark Mode Switch On" checked description="Active setting in dark background" />
      <Switch label="Dark Mode Switch Off" checked={false} description="Inactive setting" />
      <Switch label="Dark Mode Disabled" disabled checked />
    </div>
  ),
};

export const ResponsiveBehavior: Story = {
  render: () => (
    <div className="w-full max-w-sm border p-4 rounded-xl flex items-center justify-between">
      <Switch
        label="Auto-save drafts"
        description="Save progress automatically every 30 seconds"
        checked
      />
    </div>
  ),
};
