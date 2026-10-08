import type { Meta, StoryObj } from '@storybook/react';
import { ToastProvider, useToast } from './Toast';
import { Button } from '../Button/Button';

/**
 * `Toast` notifies users with transient popup feedback messages.
 */
const meta: Meta<typeof ToastProvider> = {
  title: 'UI/Feedback/Toast',
  component: ToastProvider,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ToastProvider>;

const ToastDemo = () => {
  const { toast } = useToast();

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="primary"
        onClick={() =>
          toast({
            title: 'Task Created',
            message: 'New task "Storybook Documentation" was added.',
            variant: 'success',
          })
        }
      >
        Trigger Success Toast
      </Button>
      <Button
        variant="danger"
        onClick={() =>
          toast({
            title: 'Connection Failed',
            message: 'Unable to reach Supabase backend service.',
            variant: 'error',
          })
        }
      >
        Trigger Error Toast
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast({
            title: 'Warning',
            message: 'Your token expires in 5 minutes.',
            variant: 'warning',
          })
        }
      >
        Trigger Warning Toast
      </Button>
    </div>
  );
};

export const Default: Story = {
  render: () => (
    <ToastProvider>
      <div className="p-8">
        <ToastDemo />
      </div>
    </ToastProvider>
  ),
};

export const DarkMode: Story = {
  globals: { theme: 'dark' },
  render: () => (
    <div className="dark bg-slate-900 p-8 rounded-xl min-h-[200px]">
      <ToastProvider>
        <ToastDemo />
      </ToastProvider>
    </div>
  ),
};
