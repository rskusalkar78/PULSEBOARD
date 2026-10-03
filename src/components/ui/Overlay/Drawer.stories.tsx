import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import type { DrawerProps } from './Drawer';
import { Drawer } from './Drawer';
import { Button } from '../Button/Button';
import { Input } from '../Form/Input';

/**
 * `Drawer` slides out from screen edges for side panels or navigation menus.
 */
const meta: Meta<typeof Drawer> = {
  title: 'UI/Overlay/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean' },
    side: { control: 'select', options: ['left', 'right', 'top', 'bottom'] },
  },
  args: {
    isOpen: true,
    side: 'right',
  },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

const DefaultDrawerDemo: React.FC<DrawerProps> = (args) => {
  const [open, setOpen] = useState(args.isOpen);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Side Drawer</Button>
      <Drawer {...args} isOpen={open} onClose={() => setOpen(false)}>
        <h2 className="text-lg font-bold mb-2">Filter Options</h2>
        <p className="text-sm text-slate-500 mb-6">Refine displayed tasks and projects.</p>
        <div className="space-y-4 flex-1">
          <Input label="Filter by Keyword" placeholder="Search..." />
        </div>
        <div className="mt-auto flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Reset
          </Button>
          <Button variant="primary" onClick={() => setOpen(false)}>
            Apply Filters
          </Button>
        </div>
      </Drawer>
    </>
  );
};

export const Default: Story = {
  render: (args) => <DefaultDrawerDemo {...args} />,
};

export const LeftSideDrawer: Story = {
  render: () => (
    <Drawer isOpen side="left" onClose={() => {}}>
      <h2 className="text-lg font-bold mb-4">Navigation Menu</h2>
      <ul className="space-y-2 text-sm">
        <li className="p-2 bg-slate-100 dark:bg-slate-800 rounded font-medium">Dashboard</li>
        <li className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded">Projects</li>
        <li className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded">Tasks</li>
        <li className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded">Settings</li>
      </ul>
    </Drawer>
  ),
};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
  render: () => (
    <div className="dark bg-slate-900 min-h-[300px]">
      <Drawer isOpen side="right" onClose={() => {}}>
        <h2 className="text-lg font-bold mb-2 text-slate-100">Dark Panel</h2>
        <p className="text-sm text-slate-400">Drawer panel in dark theme mode.</p>
      </Drawer>
    </div>
  ),
};
