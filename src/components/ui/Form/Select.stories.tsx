import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

/**
 * `Select` component for picking options from a dropdown list.
 */
const meta: Meta<typeof Select> = {
  title: 'UI/Form/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: {
    label: 'Priority',
    placeholder: 'Select a priority level',
    options: [
      { value: 'low', label: 'Low Priority' },
      { value: 'medium', label: 'Medium Priority' },
      { value: 'high', label: 'High Priority' },
      { value: 'urgent', label: 'Urgent' },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {};

export const DisabledState: Story = {
  args: {
    disabled: true,
    value: 'medium',
  },
};

export const ErrorState: Story = {
  args: {
    error: 'Please select a valid option',
  },
};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
  render: () => (
    <div className="dark bg-slate-900 p-6 rounded-xl space-y-4 max-w-sm">
      <Select
        label="Status"
        options={[
          { value: 'todo', label: 'To Do' },
          { value: 'in_progress', label: 'In Progress' },
          { value: 'done', label: 'Done' },
        ]}
      />
      <Select
        label="Status with Error"
        error="Field required"
        options={[{ value: '1', label: 'Option 1' }]}
      />
    </div>
  ),
};

export const ResponsiveBehavior: Story = {
  render: () => (
    <div className="w-full max-w-md border p-4 rounded-xl">
      <Select
        label="Assignee"
        options={[
          { value: 'alex', label: 'Alex Rivera' },
          { value: 'sam', label: 'Sam Chen' },
          { value: 'taylor', label: 'Taylor Swift' },
        ]}
      />
    </div>
  ),
};
