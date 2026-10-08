import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';

/**
 * `Textarea` allows multiline text input.
 */
const meta: Meta<typeof Textarea> = {
  title: 'UI/Form/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    error: { control: 'text' },
    helperText: { control: 'text' },
    disabled: { control: 'boolean' },
    rows: { control: 'number' },
  },
  args: {
    label: 'Description',
    placeholder: 'Write a short description...',
    rows: 4,
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {};

export const DisabledState: Story = {
  args: {
    disabled: true,
    value: 'This input is currently disabled and cannot be edited.',
  },
};

export const ErrorState: Story = {
  args: {
    value: 'Too short',
    error: 'Description must be at least 20 characters long.',
  },
};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
  render: () => (
    <div className="dark bg-slate-900 p-6 rounded-xl space-y-4 max-w-md">
      <Textarea label="Feedback" placeholder="Provide feedback..." />
      <Textarea label="With Error" error="Validation error message" />
    </div>
  ),
};

export const ResponsiveBehavior: Story = {
  render: () => (
    <div className="w-full max-w-xl border p-4 rounded-xl">
      <Textarea
        label="Project Requirements"
        placeholder="Enter detailed project scope..."
        fullWidth
      />
    </div>
  ),
};
