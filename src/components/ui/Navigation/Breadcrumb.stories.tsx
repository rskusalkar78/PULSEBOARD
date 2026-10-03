import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from './Breadcrumb';
import { Home, Slash } from 'lucide-react';

/**
 * `Breadcrumb` provides secondary navigation displaying the current page location path.
 */
const meta: Meta<typeof Breadcrumb> = {
  title: 'UI/Navigation/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Projects</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink href="#">PulseBoard Redesign</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink isCurrentPage>Milestone 24</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  ),
};

export const WithIconsAndCustomSeparator: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbItem>
        <BreadcrumbLink href="#" className="flex items-center gap-1">
          <Home className="w-4 h-4" />
          Home
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator>
        <Slash className="w-3.5 h-3.5" />
      </BreadcrumbSeparator>
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Settings</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator>
        <Slash className="w-3.5 h-3.5" />
      </BreadcrumbSeparator>
      <BreadcrumbItem>
        <BreadcrumbLink isCurrentPage>Integrations</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  ),
};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
  render: () => (
    <div className="dark bg-slate-900 p-6 rounded-xl">
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink isCurrentPage>Analytics Report</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
    </div>
  ),
};
