import type { Meta, StoryObj } from '@storybook/react';
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownHeader,
} from './Dropdown';
import { Button } from '../Button/Button';
import { User, Settings, LogOut, Shield, ChevronDown } from 'lucide-react';

/**
 * `Dropdown` reveals a list of options or actions upon triggering a button.
 */
const meta: Meta<typeof Dropdown> = {
  title: 'UI/Overlay/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  argTypes: {
    align: { control: 'select', options: ['left', 'right'] },
  },
  args: {
    align: 'left',
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {
  render: () => (
    <div className="p-12 flex justify-center">
      <Dropdown
        trigger={
          <Button variant="outline" rightIcon={<ChevronDown className="w-4 h-4" />}>
            Account Options
          </Button>
        }
        items={[
          { id: '1', label: 'View Profile', icon: <User className="w-4 h-4" /> },
          { id: '2', label: 'Account Settings', icon: <Settings className="w-4 h-4" /> },
          { id: '3', label: 'Security & Privacy', icon: <Shield className="w-4 h-4" /> },
          { id: '4', label: 'Log Out', icon: <LogOut className="w-4 h-4" />, danger: true },
        ]}
      />
    </div>
  ),
};

export const CompoundComponent: Story = {
  render: () => (
    <div className="p-12 flex justify-center">
      <Dropdown>
        <DropdownTrigger>
          <Button variant="primary" rightIcon={<ChevronDown className="w-4 h-4" />}>
            Actions Menu
          </Button>
        </DropdownTrigger>
        <DropdownContent align="left">
          <DropdownHeader>Quick Actions</DropdownHeader>
          <DropdownItem icon={<User className="w-4 h-4" />}>Assign Teammate</DropdownItem>
          <DropdownItem icon={<Settings className="w-4 h-4" />}>Change Status</DropdownItem>
          <DropdownSeparator />
          <DropdownItem danger icon={<LogOut className="w-4 h-4" />}>
            Delete Task
          </DropdownItem>
        </DropdownContent>
      </Dropdown>
    </div>
  ),
};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
  render: () => (
    <div className="dark bg-slate-900 p-12 flex justify-center rounded-xl">
      <Dropdown
        trigger={
          <Button variant="outline" rightIcon={<ChevronDown className="w-4 h-4" />}>
            Dark Theme Options
          </Button>
        }
        items={[
          { id: '1', label: 'Option 1', icon: <Settings className="w-4 h-4" /> },
          { id: '2', label: 'Danger Option', icon: <LogOut className="w-4 h-4" />, danger: true },
        ]}
      />
    </div>
  ),
};
