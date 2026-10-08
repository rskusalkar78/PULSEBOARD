import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from './IconButton';
import { Settings, Trash2, Plus, Bell, Search } from 'lucide-react';

/**
 * `IconButton` provides icon-only triggers with accessible labels.
 */
const meta: Meta<typeof IconButton> = {
  title: 'UI/Button/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    isLoading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    'aria-label': 'Settings',
    icon: <Settings className="w-5 h-5" />,
    variant: 'ghost',
    size: 'md',
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <IconButton variant="primary" aria-label="Add" icon={<Plus className="w-5 h-5" />} />
      <IconButton
        variant="secondary"
        aria-label="Settings"
        icon={<Settings className="w-5 h-5" />}
      />
      <IconButton variant="outline" aria-label="Search" icon={<Search className="w-5 h-5" />} />
      <IconButton variant="ghost" aria-label="Notifications" icon={<Bell className="w-5 h-5" />} />
      <IconButton variant="danger" aria-label="Delete" icon={<Trash2 className="w-5 h-5" />} />
    </div>
  ),
};

export const LoadingState: Story = {
  args: {
    isLoading: true,
    variant: 'primary',
  },
};

export const DisabledState: Story = {
  args: {
    disabled: true,
  },
};

export const ErrorState: Story = {
  args: {
    variant: 'danger',
    'aria-label': 'Delete item',
    icon: <Trash2 className="w-5 h-5" />,
  },
};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
  render: () => (
    <div className="dark bg-slate-900 p-6 rounded-xl flex gap-4 items-center">
      <IconButton variant="primary" aria-label="Add" icon={<Plus className="w-5 h-5" />} />
      <IconButton
        variant="secondary"
        aria-label="Settings"
        icon={<Settings className="w-5 h-5" />}
      />
      <IconButton variant="outline" aria-label="Search" icon={<Search className="w-5 h-5" />} />
      <IconButton variant="ghost" aria-label="Notifications" icon={<Bell className="w-5 h-5" />} />
      <IconButton variant="danger" aria-label="Delete" icon={<Trash2 className="w-5 h-5" />} />
    </div>
  ),
};

export const ResponsiveBehavior: Story = {
  render: () => (
    <div className="w-full sm:w-64 border p-4 rounded-xl flex items-center justify-between">
      <span className="text-sm font-medium">Header Title</span>
      <IconButton variant="ghost" aria-label="Settings" icon={<Settings className="w-5 h-5" />} />
    </div>
  ),
};
