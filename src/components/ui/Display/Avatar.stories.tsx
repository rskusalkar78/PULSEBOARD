import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarGroup } from './Avatar';

/**
 * `Avatar` presents user profile images, fallback initials, status indicators, or group overlays.
 */
const meta: Meta<typeof Avatar> = {
  title: 'UI/Display/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    status: { control: 'select', options: ['online', 'offline', 'busy', 'away'] },
    name: { control: 'text' },
    src: { control: 'text' },
  },
  args: {
    name: 'Sarah Connor',
    size: 'md',
    status: 'online',
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {};

export const WithImage: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    name: 'Sarah Connor',
    status: 'online',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-4 items-end">
      <Avatar size="xs" name="Alex Rivera" status="online" />
      <Avatar size="sm" name="Alex Rivera" status="online" />
      <Avatar size="md" name="Alex Rivera" status="online" />
      <Avatar size="lg" name="Alex Rivera" status="online" />
      <Avatar size="xl" name="Alex Rivera" status="online" />
    </div>
  ),
};

export const Statuses: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <Avatar name="Online User" status="online" />
      <Avatar name="Away User" status="away" />
      <Avatar name="Busy User" status="busy" />
      <Avatar name="Offline User" status="offline" />
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <AvatarGroup max={3}>
      <Avatar name="Alex Rivera" />
      <Avatar name="Sam Chen" />
      <Avatar name="Jordan Lee" />
      <Avatar name="Taylor Swift" />
      <Avatar name="Morgan Freeman" />
    </AvatarGroup>
  ),
};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
  render: () => (
    <div className="dark bg-slate-900 p-6 rounded-xl flex gap-4 items-center">
      <Avatar name="Alex Rivera" status="online" size="lg" />
      <Avatar name="Sam Chen" status="busy" size="lg" />
    </div>
  ),
};

export const ResponsiveBehavior: Story = {
  render: () => (
    <div className="w-full max-w-sm border p-4 rounded-xl flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar name="Marcus Vance" status="online" size="md" />
        <div>
          <p className="text-sm font-semibold">Marcus Vance</p>
          <p className="text-xs text-slate-500">Lead Designer</p>
        </div>
      </div>
    </div>
  ),
};
