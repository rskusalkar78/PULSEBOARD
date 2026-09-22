import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { Notification, NotificationInsert, NotificationType, UserPreferences } from '@/types';
import { notificationService } from '@/services/notification.service';
import { profileService } from '@/services/profile.service';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { isSupabaseConfigured } from '@/lib/supabaseConfig';

export interface CategoryCount {
  all: number;
  unread: number;
  mention: number;
  assignment: number;
  comment: number;
  status_change: number;
  due_date: number;
  team_invite: number;
  system: number;
}

export interface NotificationCategoryPreferences {
  assignment: boolean;
  mention: boolean;
  comment: boolean;
  status_change: boolean;
  due_date: boolean;
  team_invite: boolean;
  system: boolean;
}

export type NotificationPreferencesState = UserPreferences['notifications'] & {
  categories: NotificationCategoryPreferences;
};

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  categoryCounts: CategoryCount;
  isLoading: boolean;
  error: string | null;
  preferences: NotificationPreferencesState;

  // Actions
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAsUnread: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
  clearReadNotifications: () => Promise<void>;
  createNotification: (data: Omit<NotificationInsert, 'user_id'>) => Promise<Notification | null>;
  updatePreferences: (newPreferences: Partial<NotificationPreferencesState>) => Promise<void>;
}

const INITIAL_PREFERENCES: NotificationPreferencesState = {
  email: true,
  push: true,
  inApp: true,
  categories: {
    assignment: true,
    mention: true,
    comment: true,
    status_change: true,
    due_date: true,
    team_invite: true,
    system: true,
  },
};

const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-seed-1',
    user_id: 'current-user',
    type: 'assignment',
    title: 'New Task Assigned: Database Migration Audit',
    message: 'Sarah Chen assigned you to task "Database Migration Audit" in PulseBoard Redesign.',
    action_url: '/tasks',
    read: false,
    read_at: null,
    entity_type: 'task',
    entity_id: 'task-101',
    metadata: { priority: 'high', author: 'Sarah Chen' },
    created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 mins ago
  },
  {
    id: 'notif-seed-2',
    user_id: 'current-user',
    type: 'mention',
    title: 'Mentioned in comment by Alex Morgan',
    message: '@you Please review the updated UI design tokens and brand guidelines before EOD.',
    action_url: '/projects',
    read: false,
    read_at: null,
    entity_type: 'comment',
    entity_id: 'comment-204',
    metadata: { author: 'Alex Morgan' },
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 mins ago
  },
  {
    id: 'notif-seed-3',
    user_id: 'current-user',
    type: 'status_change',
    title: 'Project Status Updated: Analytics Pipeline',
    message: 'Status changed from "Planning" to "In Progress" by Marcus Vance.',
    action_url: '/projects',
    read: true,
    read_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    entity_type: 'project',
    entity_id: 'proj-55',
    metadata: { previousStatus: 'Planning', newStatus: 'In Progress' },
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: 'notif-seed-4',
    user_id: 'current-user',
    type: 'due_date',
    title: 'Task Due Soon: Security Compliance Audit',
    message: 'Task is due tomorrow at 5:00 PM.',
    action_url: '/tasks',
    read: false,
    read_at: null,
    entity_type: 'task',
    entity_id: 'task-88',
    metadata: { dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() },
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
  },
  {
    id: 'notif-seed-5',
    user_id: 'current-user',
    type: 'team_invite',
    title: 'Team Invitation Accepted',
    message: 'Elena Rostova joined the Executive Engineering team.',
    action_url: '/team',
    read: true,
    read_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    entity_type: 'team',
    entity_id: 'team-1',
    metadata: { memberName: 'Elena Rostova' },
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: 'notif-seed-6',
    user_id: 'current-user',
    type: 'system',
    title: 'System Alert: Database Backup Completed',
    message: 'Automated snapshot pb-db-20260922-0400 saved successfully to primary vault.',
    action_url: '/settings',
    read: true,
    read_at: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    entity_type: null,
    entity_id: null,
    metadata: { status: 'success', snapshotId: 'pb-db-20260922-0400' },
    created_at: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), // 36 hours ago
  },
];

const LOCAL_NOTIFS_KEY = 'pulseboard_persisted_notifications_v1';
const LOCAL_PREFS_KEY = 'pulseboard_notification_preferences_v1';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<NotificationPreferencesState>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_PREFS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_PREFERENCES;
  });

  const currentUserId = user?.id || 'demo-user-1';

  // Load notifications
  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (isSupabaseConfigured() && user?.id) {
        const res = await notificationService.getUserNotifications(user.id);
        if (res.data && res.data.length > 0) {
          setNotifications(res.data);
          setIsLoading(false);
          return;
        }
      }

      // Local storage / seed fallback for offline & initial state
      const saved = localStorage.getItem(`${LOCAL_NOTIFS_KEY}_${currentUserId}`);
      if (saved) {
        setNotifications(JSON.parse(saved));
      } else {
        const userSeeds = SEED_NOTIFICATIONS.map((n) => ({ ...n, user_id: currentUserId }));
        setNotifications(userSeeds);
        localStorage.setItem(`${LOCAL_NOTIFS_KEY}_${currentUserId}`, JSON.stringify(userSeeds));
      }
    } catch (err: unknown) {
      console.error('Failed to load notifications:', err);
      const msg = err instanceof Error ? err.message : 'Failed to fetch notifications';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, currentUserId]);

  // Persist local notifications whenever they change
  const persistLocal = useCallback(
    (newNotifs: Notification[]) => {
      setNotifications(newNotifs);
      try {
        localStorage.setItem(`${LOCAL_NOTIFS_KEY}_${currentUserId}`, JSON.stringify(newNotifs));
      } catch (err) {
        console.error('Failed to save to localStorage', err);
      }
    },
    [currentUserId]
  );

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Supabase Realtime subscription
  useEffect(() => {
    if (!isSupabaseConfigured() || !user?.id || !supabase) return;

    const channel = supabase
      .channel(`notifications:user=${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, fetchNotifications]);

  // Mark as read
  const markAsRead = useCallback(
    async (id: string) => {
      const now = new Date().toISOString();
      const updated = notifications.map((n) =>
        n.id === id ? { ...n, read: true, read_at: now } : n
      );
      persistLocal(updated);

      if (isSupabaseConfigured() && user?.id) {
        try {
          await notificationService.markAsRead(id);
        } catch (err) {
          console.error('Error marking as read in Supabase:', err);
        }
      }
    },
    [notifications, persistLocal, user?.id]
  );

  // Mark as unread
  const markAsUnread = useCallback(
    async (id: string) => {
      const updated = notifications.map((n) =>
        n.id === id ? { ...n, read: false, read_at: null } : n
      );
      persistLocal(updated);

      if (isSupabaseConfigured() && user?.id) {
        try {
          await notificationService.markAsUnread(id);
        } catch (err) {
          console.error('Error marking as unread in Supabase:', err);
        }
      }
    },
    [notifications, persistLocal, user?.id]
  );

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    const now = new Date().toISOString();
    const updated = notifications.map((n) => ({ ...n, read: true, read_at: n.read_at || now }));
    persistLocal(updated);

    if (isSupabaseConfigured() && user?.id) {
      try {
        await notificationService.markAllAsRead(user.id);
      } catch (err) {
        console.error('Error marking all as read in Supabase:', err);
      }
    }
  }, [notifications, persistLocal, user?.id]);

  // Delete single notification
  const deleteNotification = useCallback(
    async (id: string) => {
      const updated = notifications.filter((n) => n.id !== id);
      persistLocal(updated);

      if (isSupabaseConfigured() && user?.id) {
        try {
          await notificationService.delete(id);
        } catch (err) {
          console.error('Error deleting notification in Supabase:', err);
        }
      }
    },
    [notifications, persistLocal, user?.id]
  );

  // Clear all notifications
  const clearAllNotifications = useCallback(async () => {
    persistLocal([]);
  }, [persistLocal]);

  // Clear read notifications
  const clearReadNotifications = useCallback(async () => {
    const unreadOnly = notifications.filter((n) => !n.read);
    persistLocal(unreadOnly);

    if (isSupabaseConfigured() && user?.id) {
      try {
        await notificationService.deleteOldRead(user.id, 0);
      } catch (err) {
        console.error('Error deleting read notifications:', err);
      }
    }
  }, [notifications, persistLocal, user?.id]);

  // Create notification
  const createNotification = useCallback(
    async (data: Omit<NotificationInsert, 'user_id'>): Promise<Notification | null> => {
      const newNotif: Notification = {
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        user_id: currentUserId,
        type: data.type,
        title: data.title,
        message: data.message || null,
        action_url: data.action_url || null,
        read: false,
        read_at: null,
        entity_type: data.entity_type || null,
        entity_id: data.entity_id || null,
        metadata: data.metadata || {},
        created_at: new Date().toISOString(),
      };

      const updated = [newNotif, ...notifications];
      persistLocal(updated);

      if (isSupabaseConfigured() && user?.id) {
        try {
          const res = await notificationService.notify(
            user.id,
            data.type,
            data.title,
            data.message || undefined,
            data.action_url || undefined,
            data.entity_type || undefined,
            data.entity_id || undefined,
            data.metadata || undefined
          );
          if (res.data) return res.data;
        } catch (err) {
          console.error('Error creating notification on Supabase:', err);
        }
      }

      return newNotif;
    },
    [currentUserId, notifications, persistLocal, user?.id]
  );

  // Update preferences
  const updatePreferences = useCallback(
    async (newPreferences: Partial<NotificationPreferencesState>) => {
      setPreferences((prev) => {
        const updated: NotificationPreferencesState = {
          ...prev,
          ...newPreferences,
          categories: {
            ...prev.categories,
            ...(newPreferences.categories || {}),
          },
        };
        try {
          localStorage.setItem(LOCAL_PREFS_KEY, JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });

      if (isSupabaseConfigured() && user?.id) {
        try {
          await profileService.updatePreferences(user.id, {
            notifications: {
              email: newPreferences.email ?? preferences.email,
              push: newPreferences.push ?? preferences.push,
              inApp: newPreferences.inApp ?? preferences.inApp,
            },
          });
        } catch (err) {
          console.error('Error updating notification preferences on profile:', err);
        }
      }
    },
    [preferences, user?.id]
  );

  // Derived counts
  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const categoryCounts = useMemo<CategoryCount>(() => {
    const counts: CategoryCount = {
      all: notifications.length,
      unread: 0,
      mention: 0,
      assignment: 0,
      comment: 0,
      status_change: 0,
      due_date: 0,
      team_invite: 0,
      system: 0,
    };

    notifications.forEach((n) => {
      if (!n.read) counts.unread++;
      const cat = n.type as NotificationType;
      if (cat in counts) {
        counts[cat] = (counts[cat] || 0) + 1;
      }
    });

    return counts;
  }, [notifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        categoryCounts,
        isLoading,
        error,
        preferences,
        fetchNotifications,
        markAsRead,
        markAsUnread,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications,
        clearReadNotifications,
        createNotification,
        updatePreferences,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export function useNotifications(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
