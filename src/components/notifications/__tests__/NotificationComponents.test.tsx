import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { NotificationItem } from '../NotificationItem';
import { NotificationBell } from '../NotificationBell';
import type { Notification } from '@/types';

const mockNotification: Notification = {
  id: 'test-1',
  user_id: 'usr-1',
  type: 'assignment',
  title: 'Test Assignment Title',
  message: 'This is the message body for test notification.',
  action_url: '/tasks',
  read: false,
  read_at: null,
  entity_type: 'task',
  entity_id: 'task-1',
  metadata: {},
  created_at: new Date().toISOString(),
};

describe('Notification Components', () => {
  it('renders NotificationItem with title, message and badges', () => {
    render(
      <MemoryRouter>
        <NotificationItem notification={mockNotification} />
      </MemoryRouter>
    );

    expect(screen.getByText('Test Assignment Title')).toBeInTheDocument();
    expect(screen.getByText('This is the message body for test notification.')).toBeInTheDocument();
    expect(screen.getByText('Assignment')).toBeInTheDocument();
  });

  it('triggers markAsRead callback when clicked', () => {
    const handleMarkAsRead = vi.fn();
    render(
      <MemoryRouter>
        <NotificationItem notification={mockNotification} onMarkAsRead={handleMarkAsRead} />
      </MemoryRouter>
    );

    const markReadBtn = screen.getByLabelText('Mark notification as read');
    fireEvent.click(markReadBtn);
    expect(handleMarkAsRead).toHaveBeenCalledWith('test-1');
  });

  it('renders NotificationBell with unread badge count', () => {
    render(<NotificationBell unreadCount={5} isOpen={false} onToggle={() => {}} />);

    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
