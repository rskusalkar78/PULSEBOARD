import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card';
import { Button } from '../Button/Button';
import { Badge } from './Badge';

/**
 * `Card` is a surface container for grouping related content and actions.
 */
const meta: Meta<typeof Card> = {
  title: 'UI/Display/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'ghost', 'glass'],
    },
  },
  args: {
    variant: 'default',
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: (args) => (
    <Card {...args} className="max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Project Dashboard</CardTitle>
          <Badge variant="success">Active</Badge>
        </div>
        <CardDescription>Manage and monitor workspace activity.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          PulseBoard provides real-time team synchronization and performance insights.
        </p>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline" size="sm">
          Cancel
        </Button>
        <Button variant="primary" size="sm">
          View Project
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
      <Card variant="default">
        <CardHeader>
          <CardTitle>Default Variant</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Standard elevated surface.</p>
        </CardContent>
      </Card>
      <Card variant="outline">
        <CardHeader>
          <CardTitle>Outline Variant</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Subtle bordered container.</p>
        </CardContent>
      </Card>
      <Card variant="ghost">
        <CardHeader>
          <CardTitle>Ghost Variant</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Flat background surface.</p>
        </CardContent>
      </Card>
      <Card variant="glass">
        <CardHeader>
          <CardTitle>Glass Variant</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Translucent frosted backdrop.</p>
        </CardContent>
      </Card>
    </div>
  ),
};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
  render: () => (
    <div className="dark bg-slate-900 p-6 rounded-xl max-w-md">
      <Card variant="default">
        <CardHeader>
          <CardTitle>Dark Mode Card</CardTitle>
          <CardDescription>Sleek dark aesthetics</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-300">High contrast design token styling.</p>
        </CardContent>
        <CardFooter className="justify-end">
          <Button variant="primary" size="sm">
            Action
          </Button>
        </CardFooter>
      </Card>
    </div>
  ),
};

export const ResponsiveBehavior: Story = {
  render: () => (
    <div className="w-full max-w-2xl border p-4 rounded-xl">
      <Card variant="default" className="w-full">
        <CardHeader>
          <CardTitle>Responsive Card Layout</CardTitle>
          <CardDescription>Resizes fluidly to parent width</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Adapts grid columns and padding automatically.
          </p>
        </CardContent>
      </Card>
    </div>
  ),
};
