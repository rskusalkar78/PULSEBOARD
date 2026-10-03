import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import type { DialogProps } from './Dialog';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
} from './Dialog';
import { Button } from '../Button/Button';
import { Input } from '../Form/Input';

/**
 * `Dialog` displays modal content requiring user focus or interaction.
 */
const meta: Meta<typeof Dialog> = {
  title: 'UI/Overlay/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean' },
    closeOnOutsideClick: { control: 'boolean' },
  },
  args: {
    isOpen: true,
    closeOnOutsideClick: true,
  },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

const DefaultDialogDemo: React.FC<DialogProps> = (args) => {
  const [open, setOpen] = useState(args.isOpen);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Modal Dialog</Button>
      <Dialog {...args} isOpen={open} onClose={() => setOpen(false)}>
        <DialogHeader>
          <DialogTitle>Edit Profile Settings</DialogTitle>
          <DialogDescription>Make changes to your user account profile here.</DialogDescription>
        </DialogHeader>
        <DialogContent className="space-y-4">
          <Input label="Full Name" defaultValue="Alex Rivera" />
          <Input label="Job Title" defaultValue="Lead Engineer" />
        </DialogContent>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => setOpen(false)}>
            Save Changes
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export const Default: Story = {
  render: (args) => <DefaultDialogDemo {...args} />,
};

const ConfirmationDialogDemo: React.FC = () => {
  const [open, setOpen] = useState(true);
  return (
    <Dialog isOpen={open} onClose={() => setOpen(false)}>
      <DialogHeader>
        <DialogTitle className="text-rose-600">Delete Project</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this project? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={() => setOpen(false)}>
          Keep Project
        </Button>
        <Button variant="danger" onClick={() => setOpen(false)}>
          Delete Permanently
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export const ConfirmationDialog: Story = {
  render: () => <ConfirmationDialogDemo />,
};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
  render: () => (
    <div className="dark bg-slate-900 p-6 min-h-[300px]">
      <Dialog isOpen onClose={() => {}}>
        <DialogHeader>
          <DialogTitle>Dark Theme Dialog</DialogTitle>
          <DialogDescription>Styled with dark slate surface colors.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="primary">Confirm Action</Button>
        </DialogFooter>
      </Dialog>
    </div>
  ),
};
