import type { Meta, StoryObj } from '@storybook/react';
import { PasswordInput } from './PasswordInput';

/**
 * `PasswordInput` is an input specifically designed for passwords with toggleable visibility.
 */
const meta: Meta<typeof PasswordInput> = {
  title: 'UI/Form/PasswordInput',
  component: PasswordInput,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    showLeftIcon: { control: 'boolean' },
  },
  args: {
    label: 'Password',
    placeholder: '••••••••',
  },
};

export default meta;
type Story = StoryObj<typeof PasswordInput>;

export const Default: Story = {};

export const DisabledState: Story = {
  args: {
    disabled: true,
    value: 'SecretPassword123',
  },
};

export const ErrorState: Story = {
  args: {
    value: '123',
    error: 'Password must be at least 8 characters long.',
  },
};

export const WithoutLeftIcon: Story = {
  args: {
    showLeftIcon: false,
    label: 'Confirm Password',
  },
};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
  render: () => (
    <div className="dark bg-slate-900 p-6 rounded-xl space-y-4 max-w-sm">
      <PasswordInput label="Account Password" value="SuperSecret123!" />
      <PasswordInput label="Password with Error" error="Password expired" />
    </div>
  ),
};

export const ResponsiveBehavior: Story = {
  render: () => (
    <div className="w-full max-w-md border p-4 rounded-xl">
      <PasswordInput label="New Password" placeholder="Enter new strong password" />
    </div>
  ),
};
