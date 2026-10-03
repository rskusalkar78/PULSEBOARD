import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';

/**
 * `Tabs` organizes content into multiple tab views with accessible tab controls.
 */
const meta: Meta<typeof Tabs> = {
  title: 'UI/Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: {
    defaultValue: { control: 'text' },
  },
  args: {
    defaultValue: 'overview',
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: (args) => (
    <Tabs {...args}>
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <p className="text-sm p-4 border rounded-lg">Overview panel content.</p>
      </TabsContent>
      <TabsContent value="analytics">
        <p className="text-sm p-4 border rounded-lg">Analytics metrics & charts panel content.</p>
      </TabsContent>
      <TabsContent value="settings">
        <p className="text-sm p-4 border rounded-lg">Workspace configuration settings panel.</p>
      </TabsContent>
    </Tabs>
  ),
};

const ControlledTabsDemo: React.FC = () => {
  const [selected, setSelected] = useState('tasks');
  return (
    <Tabs value={selected} onValueChange={setSelected}>
      <TabsList>
        <TabsTrigger value="tasks">Tasks (12)</TabsTrigger>
        <TabsTrigger value="activity">Activity Log</TabsTrigger>
        <TabsTrigger value="files">Files (4)</TabsTrigger>
      </TabsList>
      <TabsContent value="tasks" className="p-4 border rounded-lg text-sm">
        Active task list table content.
      </TabsContent>
      <TabsContent value="activity" className="p-4 border rounded-lg text-sm">
        Recent workspace timeline events.
      </TabsContent>
      <TabsContent value="files" className="p-4 border rounded-lg text-sm">
        Uploaded project attachments.
      </TabsContent>
    </Tabs>
  );
};

export const Controlled: Story = {
  render: () => <ControlledTabsDemo />,
};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
  render: () => (
    <div className="dark bg-slate-900 p-6 rounded-xl space-y-4">
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Active Tab</TabsTrigger>
          <TabsTrigger value="tab2">Secondary Tab</TabsTrigger>
        </TabsList>
        <TabsContent
          value="tab1"
          className="p-4 border border-slate-800 rounded-lg text-sm text-slate-200"
        >
          Dark mode tab content panel.
        </TabsContent>
      </Tabs>
    </div>
  ),
};

export const ResponsiveBehavior: Story = {
  render: () => (
    <div className="w-full max-w-sm border p-4 rounded-xl space-y-4">
      <p className="text-xs text-slate-500">Scrollable or wrap responsive tabs:</p>
      <Tabs defaultValue="all">
        <TabsList className="w-full justify-between">
          <TabsTrigger value="all" className="flex-1">
            All
          </TabsTrigger>
          <TabsTrigger value="unread" className="flex-1">
            Unread
          </TabsTrigger>
          <TabsTrigger value="archived" className="flex-1">
            Archived
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  ),
};
