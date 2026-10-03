import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Input } from './Input';
import { Mail, Search } from 'lucide-react';

/**
 * `Input` is a standard text input field supporting labels, helpers, error messages, and icon addons.
 */
const meta: Meta<typeof Input> = {
  title: 'UI/Form/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  args: {
    label: 'Email Address',
    placeholder: 'user@example.com',
    helperText: 'We will never share your email with third parties.',
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {};

export const WithAddons: Story = {
  render: () => (
    <div className="space-y-4 max-w-sm">
      <Input
        label="Search Tasks"
        placeholder="Type to search..."
        leftAddon={<Search className="w-4 h-4" />}
      />
      <Input
        label="User Email"
        placeholder="alex@company.com"
        leftAddon={<Mail className="w-4 h-4" />}
      />
    </div>
  ),
};

export const DisabledState: Story = {
  args: {
    label: 'Disabled Input',
    value: 'Read-only content',
    disabled: true,
  },
};

export const ErrorState: Story = {
  args: {
    label: 'Work Email',
    value: 'invalid-email-format',
    error: 'Please enter a valid email address.',
  },
};

export const LoadingOrProcessingState: Story = {
  render: () => (
    <div className="max-w-sm">
      <Input
        label="Validating Handle"
        value="pulse_user_12"
        helperText="Checking availability..."
        rightAddon={
          <span className="animate-spin rounded-full h-4 w-4 border-2 border-violet-500 border-t-transparent" />
        }
      />
    </div>
  ),
};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
  render: () => (
    <div className="dark bg-slate-900 p-6 rounded-xl space-y-4 max-w-sm">
      <Input label="Username" placeholder="Enter username" />
      <Input label="With Error" value="invalid" error="Username is already taken" />
      <Input label="Disabled" value="Disabled text" disabled />
    </div>
  ),
};

export const ResponsiveBehavior: Story = {
  render: () => (
    <div className="w-full max-w-lg border p-4 rounded-xl space-y-4">
      <p className="text-xs text-slate-500">Adapts seamlessly from mobile to desktop viewport:</p>
      <Input label="Project Title" placeholder="Enter project name..." fullWidth />
    </div>
  ),
};
