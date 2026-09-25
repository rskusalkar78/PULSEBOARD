/**
 * DataTableContext.tsx — React context that threads the table instance
 * and column definitions through the component tree without prop drilling.
 */

import { createContext, useContext } from 'react';
import type { ColumnDef, TableInstance } from '@/types/table';

export interface DataTableContextValue<TData = unknown> {
  table: TableInstance<TData>;
  columns: ColumnDef<TData>[];
  getRowId: (row: TData, index: number) => string;
  enableSorting: boolean;
  enableRowSelection: boolean;
  enablePagination: boolean;
  enableColumnVisibility: boolean;
  stickyHeader: boolean;
  striped: boolean;
  compact: boolean;
  bordered: boolean;
  isLoading: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DataTableContext = createContext<DataTableContextValue<any> | null>(null);

export function useDataTableContext<TData>(): DataTableContextValue<TData> {
  const ctx = useContext(DataTableContext) as DataTableContextValue<TData> | null;
  if (!ctx) throw new Error('DataTable sub-components must be used within <DataTable>');
  return ctx;
}
