import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Tooltip } from './Tooltip';
import { Button } from '../Button/Button';
import { HelpCircle, Info } from 'lucide-react';

/**
 * `Tooltip` displays informative popover text when hovering over or focusing on an element.
 */
const meta: Meta<typeof Tooltip> = {
  title: 'UI/Overlay/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    position: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
    content: { control: 'text' },
  },
  args: {
    content: 'Helpful tooltip information',
    position: 'top',
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: (args) => (
    <div className="p-16 flex justify-center">
      <Tooltip {...args}>
        <Button variant="outline" leftIcon={<HelpCircle className="w-4 h-4" />}>
          Hover Me
        </Button>
      </Tooltip>
    </div>
  ),
};

export const Positions: Story = {
  render: () => (
    <div className="p-20 flex flex-wrap gap-8 justify-center items-center">
      <Tooltip content="Top tooltip position" position="top">
        <Button variant="secondary">Top</Button>
      </Tooltip>
      <Tooltip content="Bottom tooltip position" position="bottom">
        <Button variant="secondary">Bottom</Button>
      </Tooltip>
      <Tooltip content="Left tooltip position" position="left">
        <Button variant="secondary">Left</Button>
      </Tooltip>
      <Tooltip content="Right tooltip position" position="right">
        <Button variant="secondary">Right</Button>
      </Tooltip>
    </div>
  ),
};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
  render: () => (
    <div className="dark bg-slate-900 p-16 flex justify-center rounded-xl">
      <Tooltip content="Dark mode tooltip contrast" position="top">
        <Button variant="primary" leftIcon={<Info className="w-4 h-4" />}>
          Dark Tooltip
        </Button>
      </Tooltip>
    </div>
  ),
};
