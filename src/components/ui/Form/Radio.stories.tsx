import type { Meta, StoryObj } from '@storybook/react';
import { Radio, RadioGroup } from './Radio';

/**
 * `Radio` and `RadioGroup` for single selection among a set of mutually exclusive options.
 */
const meta: Meta<typeof RadioGroup> = {
  title: 'UI/Form/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    helperText: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    orientation: { control: 'select', options: ['vertical', 'horizontal'] },
  },
  args: {
    label: 'Select Plan',
    orientation: 'vertical',
  },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: (args) => (
    <RadioGroup {...args} value="pro">
      <Radio value="free" label="Free Plan" description="Basic access with limit of 3 projects" />
      <Radio value="pro" label="Pro Plan" description="Unlimited projects and advanced analytics" />
      <Radio value="enterprise" label="Enterprise" description="Dedicated infrastructure & SLA" />
    </RadioGroup>
  ),
};

export const HorizontalLayout: Story = {
  args: {
    orientation: 'horizontal',
    label: 'View Display',
  },
  render: (args) => (
    <RadioGroup {...args} value="kanban">
      <Radio value="list" label="List View" />
      <Radio value="kanban" label="Board View" />
      <Radio value="timeline" label="Timeline View" />
    </RadioGroup>
  ),
};

export const DisabledState: Story = {
  args: {
    disabled: true,
    label: 'Archived Options',
  },
  render: (args) => (
    <RadioGroup {...args} value="opt1">
      <Radio value="opt1" label="Option 1 (Selected)" />
      <Radio value="opt2" label="Option 2" />
    </RadioGroup>
  ),
};

export const ErrorState: Story = {
  args: {
    error: 'Please choose a plan to continue checkout.',
    label: 'Select Subscription Plan',
  },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="starter" label="Starter" />
      <Radio value="growth" label="Growth" />
    </RadioGroup>
  ),
};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
  render: () => (
    <div className="dark bg-slate-900 p-6 rounded-xl">
      <RadioGroup label="Dark Mode Selection" value="dark">
        <Radio value="light" label="Light Mode" />
        <Radio value="dark" label="Dark Mode" />
        <Radio value="system" label="System Theme" />
      </RadioGroup>
    </div>
  ),
};

export const ResponsiveBehavior: Story = {
  render: () => (
    <div className="w-full max-w-sm border p-4 rounded-xl">
      <RadioGroup label="Billing Frequency" orientation="vertical" value="annual">
        <Radio value="monthly" label="Monthly Billing" description="$29/month billed monthly" />
        <Radio
          value="annual"
          label="Annual Billing"
          description="$24/month billed annually (Save 20%)"
        />
      </RadioGroup>
    </div>
  ),
};
