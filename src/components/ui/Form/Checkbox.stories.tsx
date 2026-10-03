import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Checkbox } from './Checkbox';

/**
 * `Checkbox` element for boolean selection or multi-select lists.
 */
const meta: Meta<typeof Checkbox> = {
  title: 'UI/Form/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    helperText: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    checked: { control: 'boolean' },
  },
  args: {
    label: 'Accept terms and conditions',
    helperText: 'You must agree before continuing.',
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {};

export const Checked: Story = {
  args: {
    checked: true,
    label: 'Notifications enabled',
  },
};

export const Indeterminate: Story = {
  args: {
    indeterminate: true,
    label: 'Select all tasks (3 of 7 selected)',
  },
};

export const DisabledState: Story = {
  args: {
    disabled: true,
    checked: true,
    label: 'Locked permission setting',
  },
};

export const ErrorState: Story = {
  args: {
    error: 'You must accept the terms of service to proceed.',
  },
};

const InteractiveGroupDemo: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState([true, false, false]);
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold">Email Preferences:</p>
      <Checkbox
        label="Weekly Digest"
        checked={checkedItems[0]}
        onChange={(e) => setCheckedItems([e.target.checked, checkedItems[1], checkedItems[2]])}
      />
      <Checkbox
        label="Product Updates"
        checked={checkedItems[1]}
        onChange={(e) => setCheckedItems([checkedItems[0], e.target.checked, checkedItems[2]])}
      />
      <Checkbox
        label="Security Alerts"
        checked={checkedItems[2]}
        onChange={(e) => setCheckedItems([checkedItems[0], checkedItems[1], e.target.checked])}
      />
    </div>
  );
};

export const InteractiveGroup: Story = {
  render: () => <InteractiveGroupDemo />,
};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
  render: () => (
    <div className="dark bg-slate-900 p-6 rounded-xl space-y-4">
      <Checkbox label="Dark mode checked" checked />
      <Checkbox label="Dark mode unchecked" />
      <Checkbox label="Dark mode error" error="Required field" />
      <Checkbox label="Dark mode disabled" disabled checked />
    </div>
  ),
};

export const ResponsiveBehavior: Story = {
  render: () => (
    <div className="w-full max-w-sm border p-4 rounded-xl">
      <Checkbox
        label="Enable automated weekly reports export to Slack channel"
        helperText="Reports will be generated every Monday at 9:00 AM UTC"
      />
    </div>
  ),
};
