/**
 * Notification Service
 * Service for managing user notifications
 */

import { BaseService } from './base.service';
import type {
  Notification,
  NotificationInsert,
  NotificationUpdate,
  NotificationFilters,
  ApiResponse,
} from '@/types';

class NotificationService extends BaseService<
  Notification,
  NotificationInsert,
  NotificationUpdate,
  NotificationFilters
> {
  protected tableName = 'notifications';

  /**
   * Get notifications for current user
   */
  async getUserNotifications(userId: string, limit = 50): Promise<ApiResponse<Notification[]>> {
    try {
      const { data, error } = await this.table
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) return this.handleError(error);

      return this.handleSuccess(data as Notification[]);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get unread notifications
   */
  async getUnreadNotifications(userId: string): Promise<ApiResponse<Notification[]>> {
    try {
      const { data, error } = await this.table
        .select('*')
        .eq('user_id', userId)
        .eq('read', false)
        .order('created_at', { ascending: false });

      if (error) return this.handleError(error);

      return this.handleSuccess(data as Notification[]);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(userId: string): Promise<ApiResponse<number>> {
    try {
      const { count, error } = await this.table
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) return this.handleError(error);

      return this.handleSuccess(count || 0);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(id: string): Promise<ApiResponse<Notification>> {
    return this.update(id, { read: true });
  }

  /**
   * Mark notification as unread
   */
  async markAsUnread(id: string): Promise<ApiResponse<Notification>> {
    return this.update(id, { read: false });
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<ApiResponse<boolean>> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (this.table.update as any)({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) return this.handleError(error);

      return this.handleSuccess(true);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Create notification for user
   */
  async notify(
    userId: string,
    type: Notification['type'],
    title: string,
    message?: string,
    actionUrl?: string,
    entityType?: Notification['entity_type'],
    entityId?: string,
    metadata?: Record<string, unknown>
  ): Promise<ApiResponse<Notification>> {
    return this.create({
      user_id: userId,
      type,
      title,
      message: message || null,
      action_url: actionUrl || null,
      entity_type: entityType || null,
      entity_id: entityId || null,
      metadata: metadata || {},
    });
  }

  /**
   * Create notifications for multiple users
   */
  async notifyMany(
    userIds: string[],
    type: Notification['type'],
    title: string,
    message?: string,
    actionUrl?: string,
    entityType?: Notification['entity_type'],
    entityId?: string,
    metadata?: Record<string, unknown>
  ): Promise<ApiResponse<Notification[]>> {
    const notifications = userIds.map((userId) => ({
      user_id: userId,
      type,
      title,
      message: message || null,
      action_url: actionUrl || null,
      entity_type: entityType || null,
      entity_id: entityId || null,
      metadata: metadata || {},
    }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.createMany(notifications as any);
  }

  /**
   * Delete old read notifications
   */
  async deleteOldRead(userId: string, olderThanDays = 30): Promise<ApiResponse<boolean>> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

      const { error } = await this.table
        .delete()
        .eq('user_id', userId)
        .eq('read', true)
        .lt('created_at', cutoffDate.toISOString());

      if (error) return this.handleError(error);

      return this.handleSuccess(true);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get notifications by type
   */
  async getByType(
    userId: string,
    type: Notification['type']
  ): Promise<ApiResponse<Notification[]>> {
    try {
      const { data, error } = await this.table
        .select('*')
        .eq('user_id', userId)
        .eq('type', type)
        .order('created_at', { ascending: false });

      if (error) return this.handleError(error);

      return this.handleSuccess(data as Notification[]);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get notifications for an entity
   */
  async getEntityNotifications(
    userId: string,
    entityType: Notification['entity_type'],
    entityId: string
  ): Promise<ApiResponse<Notification[]>> {
    try {
      const { data, error } = await this.table
        .select('*')
        .eq('user_id', userId)
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .order('created_at', { ascending: false });

      if (error) return this.handleError(error);

      return this.handleSuccess(data as Notification[]);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Apply filters to query
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected override applyFilters(query: any, filters?: NotificationFilters) {
    if (!filters) return query;

    if (filters.user_id) {
      query = query.eq('user_id', filters.user_id);
    }

    if (filters.type) {
      query = query.eq('type', filters.type);
    }

    if (filters.read !== undefined) {
      query = query.eq('read', filters.read);
    }

    if (filters.entity_type) {
      query = query.eq('entity_type', filters.entity_type);
    }

    return query;
  }
}

export const notificationService = new NotificationService();
export default notificationService;
