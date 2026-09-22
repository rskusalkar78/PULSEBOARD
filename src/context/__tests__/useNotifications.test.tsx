import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { NotificationProvider, useNotifications } from '@/context/NotificationContext';
import { AuthProvider } from '@/context/AuthContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    <NotificationProvider>{children}</NotificationProvider>
  </AuthProvider>
);

describe('useNotifications hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('provides initial seed notifications and counts', () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });

    expect(result.current.notifications.length).toBeGreaterThan(0);
    expect(result.current.unreadCount).toBeGreaterThanOrEqual(0);
    expect(result.current.categoryCounts.all).toEqual(result.current.notifications.length);
  });

  it('allows marking a notification as read and unread', async () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });

    const firstNotif = result.current.notifications[0];

    await act(async () => {
      await result.current.markAsRead(firstNotif.id);
    });

    const updatedFirst = result.current.notifications.find((n) => n.id === firstNotif.id);
    expect(updatedFirst?.read).toBe(true);

    await act(async () => {
      await result.current.markAsUnread(firstNotif.id);
    });

    const unreadFirst = result.current.notifications.find((n) => n.id === firstNotif.id);
    expect(unreadFirst?.read).toBe(false);
  });

  it('allows marking all notifications as read', async () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });

    await act(async () => {
      await result.current.markAllAsRead();
    });

    expect(result.current.unreadCount).toBe(0);
    expect(result.current.notifications.every((n) => n.read)).toBe(true);
  });

  it('allows creating and deleting a notification', async () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });

    let createdId = '';
    await act(async () => {
      const created = await result.current.createNotification({
        type: 'assignment',
        title: 'Test Created Notification',
        message: 'This is a test notification message',
      });
      if (created) createdId = created.id;
    });

    expect(createdId).not.toBe('');
    expect(result.current.notifications.some((n) => n.id === createdId)).toBe(true);

    await act(async () => {
      await result.current.deleteNotification(createdId);
    });

    expect(result.current.notifications.some((n) => n.id === createdId)).toBe(false);
  });

  it('allows updating notification preferences', async () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });

    await act(async () => {
      await result.current.updatePreferences({
        email: false,
        categories: {
          assignment: false,
          mention: true,
          comment: true,
          status_change: true,
          due_date: true,
          team_invite: true,
          system: true,
        },
      });
    });

    expect(result.current.preferences.email).toBe(false);
    expect(result.current.preferences.categories.assignment).toBe(false);
  });
});
