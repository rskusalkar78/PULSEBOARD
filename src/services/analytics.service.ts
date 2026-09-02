/**
 * Analytics Service
 * Service for tracking analytics events
 */

import { BaseService } from './base.service';
import { config } from '@/lib/config';
import type {
  AnalyticsEvent,
  AnalyticsEventInsert,
  AnalyticsEventFilters,
  ApiResponse,
} from '@/types';

class AnalyticsService extends BaseService<
  AnalyticsEvent,
  AnalyticsEventInsert,
  never, // Analytics events are immutable
  AnalyticsEventFilters
> {
  protected tableName = 'analytics_events';

  /**
   * Check if analytics is enabled
   */
  private get isEnabled(): boolean {
    return config.features.analytics;
  }

  /**
   * Track an event
   */
  async track(
    eventName: string,
    eventCategory: AnalyticsEvent['event_category'],
    properties?: Record<string, unknown>,
    userId?: string
  ): Promise<ApiResponse<AnalyticsEvent | null>> {
    // Skip if analytics is disabled
    if (!this.isEnabled) {
      return this.handleSuccess(null);
    }

    try {
      // Generate session ID if not exists
      let sessionId = sessionStorage.getItem('analytics_session_id');
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        sessionStorage.setItem('analytics_session_id', sessionId);
      }

      // Get user agent and IP (IP will be null on client)
      const userAgent = navigator.userAgent;

      return this.create({
        user_id: userId,
        event_name: eventName,
        event_category: eventCategory,
        properties: properties || {},
        session_id: sessionId,
        user_agent: userAgent,
        ip_address: null, // Will be set on server if needed
      });
    } catch (error) {
      // Don't throw errors for analytics
      console.warn('Analytics tracking failed:', error);
      return this.handleSuccess(null);
    }
  }

  /**
   * Track page view
   */
  async trackPageView(
    pagePath: string,
    userId?: string
  ): Promise<ApiResponse<AnalyticsEvent | null>> {
    return this.track(
      'page_view',
      'user',
      {
        path: pagePath,
        referrer: document.referrer,
        title: document.title,
      },
      userId
    );
  }

  /**
   * Track user action
   */
  async trackUserAction(
    action: string,
    properties?: Record<string, unknown>,
    userId?: string
  ): Promise<ApiResponse<AnalyticsEvent | null>> {
    return this.track(action, 'user', properties, userId);
  }

  /**
   * Track project event
   */
  async trackProjectEvent(
    action: string,
    projectId: string,
    properties?: Record<string, unknown>,
    userId?: string
  ): Promise<ApiResponse<AnalyticsEvent | null>> {
    return this.track(
      action,
      'project',
      {
        ...properties,
        projectId,
      },
      userId
    );
  }

  /**
   * Track task event
   */
  async trackTaskEvent(
    action: string,
    taskId: string,
    properties?: Record<string, unknown>,
    userId?: string
  ): Promise<ApiResponse<AnalyticsEvent | null>> {
    return this.track(
      action,
      'task',
      {
        ...properties,
        taskId,
      },
      userId
    );
  }

  /**
   * Track team event
   */
  async trackTeamEvent(
    action: string,
    teamId: string,
    properties?: Record<string, unknown>,
    userId?: string
  ): Promise<ApiResponse<AnalyticsEvent | null>> {
    return this.track(
      action,
      'team',
      {
        ...properties,
        teamId,
      },
      userId
    );
  }

  /**
   * Get events for a user
   */
  async getUserEvents(userId: string, limit = 100): Promise<ApiResponse<AnalyticsEvent[]>> {
    try {
      const { data, error } = await this.table
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) return this.handleError(error);

      return this.handleSuccess(data as AnalyticsEvent[]);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get events by category
   */
  async getEventsByCategory(
    category: AnalyticsEvent['event_category'],
    limit = 100
  ): Promise<ApiResponse<AnalyticsEvent[]>> {
    try {
      const { data, error } = await this.table
        .select('*')
        .eq('event_category', category)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) return this.handleError(error);

      return this.handleSuccess(data as AnalyticsEvent[]);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get events by name
   */
  async getEventsByName(eventName: string, limit = 100): Promise<ApiResponse<AnalyticsEvent[]>> {
    try {
      const { data, error } = await this.table
        .select('*')
        .eq('event_name', eventName)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) return this.handleError(error);

      return this.handleSuccess(data as AnalyticsEvent[]);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get events by session
   */
  async getSessionEvents(sessionId: string): Promise<ApiResponse<AnalyticsEvent[]>> {
    try {
      const { data, error } = await this.table
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) return this.handleError(error);

      return this.handleSuccess(data as AnalyticsEvent[]);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get events in date range
   */
  async getEventsInRange(
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<AnalyticsEvent[]>> {
    try {
      const { data, error } = await this.table
        .select('*')
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .order('created_at', { ascending: false });

      if (error) return this.handleError(error);

      return this.handleSuccess(data as AnalyticsEvent[]);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get event count by name
   */
  async getEventCount(
    eventName: string,
    filters?: AnalyticsEventFilters
  ): Promise<ApiResponse<number>> {
    try {
      let query = this.table
        .select('*', { count: 'exact', head: true })
        .eq('event_name', eventName);

      query = this.applyFilters(query, filters);

      const { count, error } = await query;

      if (error) return this.handleError(error);

      return this.handleSuccess(count || 0);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Apply filters to query
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected applyFilters(query: any, filters?: AnalyticsEventFilters) {
    if (!filters) return query;

    if (filters.user_id) {
      query = query.eq('user_id', filters.user_id);
    }

    if (filters.event_name) {
      query = query.eq('event_name', filters.event_name);
    }

    if (filters.event_category) {
      query = query.eq('event_category', filters.event_category);
    }

    if (filters.session_id) {
      query = query.eq('session_id', filters.session_id);
    }

    if (filters.date_from) {
      query = query.gte('created_at', filters.date_from);
    }

    if (filters.date_to) {
      query = query.lte('created_at', filters.date_to);
    }

    return query;
  }

  // Override update to prevent modifications (analytics events are immutable)
  async update(): Promise<ApiResponse<AnalyticsEvent>> {
    return this.handleError(new Error('Analytics events cannot be updated'));
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;
