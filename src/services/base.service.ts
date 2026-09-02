/**
 * Base Service
 * Abstract base class for all database services
 * Provides common CRUD operations with type safety
 */

import { supabase } from '@/lib/supabase';
import type { ApiResponse, PaginatedResponse, ServiceOptions, ListOptions } from '@/types';
import type { PostgrestError, PostgrestFilterBuilder } from '@supabase/supabase-js';

export abstract class BaseService<
  TRow,
  TInsert = Partial<TRow>,
  TUpdate = Partial<TRow>,
  TFilters = Record<string, unknown>,
> {
  protected abstract tableName: string;

  /**
   * Get table reference
   */
  protected get table() {
    if (!supabase) {
      throw new Error('Database operations require configured Supabase credentials.');
    }
    return supabase.from(this.tableName);
  }

  /**
   * Transform error to API response format
   */
  protected handleError<T = unknown>(error: PostgrestError | Error | unknown): ApiResponse<T> {
    const errorObj = error as PostgrestError & Error;

    return {
      data: null,
      error: {
        message: errorObj.message || 'An unexpected error occurred',
        code: errorObj.code,
        status: errorObj.status,
        details: errorObj.details ? { details: errorObj.details } : undefined,
      },
      success: false,
    };
  }

  /**
   * Transform successful data to API response format
   */
  protected handleSuccess<T>(data: T): ApiResponse<T> {
    return {
      data,
      error: null,
      success: true,
    };
  }

  /**
   * Apply filters to query
   */
  protected applyFilters(
    query: PostgrestFilterBuilder<unknown, unknown, unknown[]>,
    filters?: TFilters
  ): PostgrestFilterBuilder<unknown, unknown, unknown[]> {
    if (!filters) return query;

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          query = query.in(key, value);
        } else if (typeof value === 'string' && key === 'search') {
          // Handle search separately in child classes
        } else {
          query = query.eq(key, value);
        }
      }
    });

    return query;
  }

  /**
   * Get single record by ID
   */
  async getById(
    id: string,
    options?: { select?: string } & ServiceOptions
  ): Promise<ApiResponse<TRow>> {
    try {
      const query = this.table
        .select(options?.select || '*')
        .eq('id', id)
        .single();

      const { data, error } = await query;

      if (error) return this.handleError(error);

      return this.handleSuccess(data as TRow);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get all records with optional filters
   */
  async getAll(
    filters?: TFilters,
    options?: { select?: string } & ServiceOptions
  ): Promise<ApiResponse<TRow[]>> {
    try {
      let query = this.table.select(options?.select || '*');

      query = this.applyFilters(query, filters);

      const { data, error } = await query;

      if (error) return this.handleError(error);

      return this.handleSuccess(data as TRow[]);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get paginated records
   */
  async list(options: ListOptions = {}): Promise<ApiResponse<PaginatedResponse<TRow>>> {
    try {
      const page = options.page || 1;
      const limit = options.limit || 10;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      let query = this.table.select('*', { count: 'exact' });

      // Apply filters
      query = this.applyFilters(query, options.filters as TFilters);

      // Apply sorting
      if (options.sortBy) {
        query = query.order(options.sortBy, {
          ascending: options.sortOrder === 'asc',
        });
      }

      // Apply pagination
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) return this.handleError(error);

      const total = count || 0;
      const totalPages = Math.ceil(total / limit);

      return this.handleSuccess({
        data: data as TRow[],
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasMore: page < totalPages,
        },
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Create new record
   */
  async create(
    data: TInsert,
    options?: { select?: string } & ServiceOptions
  ): Promise<ApiResponse<TRow>> {
    try {
      const query = this.table
        .insert(data as unknown as Record<string, unknown>)
        .select(options?.select || '*')
        .single();

      const { data: result, error } = await query;

      if (error) return this.handleError(error);

      return this.handleSuccess(result as TRow);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Create multiple records
   */
  async createMany(
    data: TInsert[],
    options?: { select?: string } & ServiceOptions
  ): Promise<ApiResponse<TRow[]>> {
    try {
      const query = this.table
        .insert(data as unknown as Record<string, unknown>[])
        .select(options?.select || '*');

      const { data: result, error } = await query;

      if (error) return this.handleError(error);

      return this.handleSuccess(result as TRow[]);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Update record by ID
   */
  async update(
    id: string,
    data: TUpdate,
    options?: { select?: string } & ServiceOptions
  ): Promise<ApiResponse<TRow>> {
    try {
      const query = this.table
        .update(data as unknown as Record<string, unknown>)
        .eq('id', id)
        .select(options?.select || '*')
        .single();

      const { data: result, error } = await query;

      if (error) return this.handleError(error);

      return this.handleSuccess(result as TRow);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Delete record by ID
   */
  async delete(id: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await this.table.delete().eq('id', id);

      if (error) return this.handleError(error);

      return this.handleSuccess(true);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Delete multiple records by IDs
   */
  async deleteMany(ids: string[]): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await this.table.delete().in('id', ids);

      if (error) return this.handleError(error);

      return this.handleSuccess(true);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Count records with optional filters
   */
  async count(filters?: TFilters): Promise<ApiResponse<number>> {
    try {
      let query = this.table.select('*', { count: 'exact', head: true });

      query = this.applyFilters(query, filters);

      const { count, error } = await query;

      if (error) return this.handleError(error);

      return this.handleSuccess(count || 0);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Check if record exists
   */
  async exists(id: string): Promise<ApiResponse<boolean>> {
    try {
      const { count, error } = await this.table
        .select('id', { count: 'exact', head: true })
        .eq('id', id);

      if (error) return this.handleError(error);

      return this.handleSuccess((count || 0) > 0);
    } catch (error) {
      return this.handleError(error);
    }
  }
}
