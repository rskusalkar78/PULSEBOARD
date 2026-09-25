/**
 * DataTable.tsx — Enterprise Data Table Component
 * Orchestrates toolbar, header, body, skeleton loading, empty state, pagination, and bulk actions.
 */

import React, { useMemo } from 'react';
import { TableProperties } from 'lucide-react';
import { cn } from '@/utils/styles';
import type { DataTableProps } from '@/types/table';
import { useDataTable } from '@/hooks/useDataTable';
import { DataTableContext } from './DataTableContext';
import { DataTableToolbar } from './DataTableToolbar';
import { DataTableHeader } from './DataTableHeader';
import { DataTableBody } from './DataTableBody';
import { DataTableSkeleton } from './DataTableSkeleton';
import { DataTablePagination } from './DataTablePagination';
import { DataTableBulkActions } from './DataTableBulkActions';
import './DataTable.css';

export function DataTable<TData>(props: DataTableProps<TData>) {
  const {
    columns,
    data: _data,
    getRowId = (_row: TData, index: number) => String(index),
    enableSorting = true,
    enableFiltering = true,
    enableGlobalFilter = true,
    enablePagination = true,
    enableRowSelection = false,
    enableColumnVisibility = true,
    bulkActions = [],
    isLoading = false,
    loadingSkeletonRows = 8,
    emptyStateTitle,
    emptyStateDescription,
    emptyStateIcon,
    emptyStateAction,
    className,
    tableClassName,
    stickyHeader = false,
    striped = false,
    compact = false,
    bordered = false,
    toolbarLeft,
    toolbarRight,
  } = props;

  const table = useDataTable(props);

  const contextValue = useMemo(
    () => ({
      table,
      columns,
      getRowId,
      enableSorting,
      enableRowSelection,
      enablePagination,
      enableColumnVisibility,
      stickyHeader,
      striped,
      compact,
      bordered,
      isLoading,
    }),
    [
      table,
      columns,
      getRowId,
      enableSorting,
      enableRowSelection,
      enablePagination,
      enableColumnVisibility,
      stickyHeader,
      striped,
      compact,
      bordered,
      isLoading,
    ]
  );

  const visibleColumnsCount = useMemo(() => {
    return columns.filter((col) => table.state.columnVisibility[col.id] !== false).length;
  }, [columns, table.state.columnVisibility]);

  const showToolbar =
    enableFiltering || enableGlobalFilter || enableColumnVisibility || toolbarLeft || toolbarRight;

  return (
    <DataTableContext.Provider value={contextValue}>
      <div className={cn('dt-container relative', className)}>
        {/* Bulk actions floating bar */}
        {enableRowSelection && bulkActions.length > 0 && (
          <DataTableBulkActions bulkActions={bulkActions} />
        )}

        {/* Toolbar */}
        {showToolbar && (
          <DataTableToolbar
            columns={columns}
            toolbarLeft={toolbarLeft}
            toolbarRight={toolbarRight}
            enableGlobalFilter={enableGlobalFilter}
            enableColumnVisibility={enableColumnVisibility}
          />
        )}

        {/* Responsive Table Wrapper */}
        <div className="dt-scroll-wrapper">
          <table className={cn('dt-table', bordered && 'dt-table--bordered', tableClassName)}>
            <DataTableHeader columns={columns} />
            {isLoading ? (
              DataTableSkeleton ? (
                <DataTableSkeleton
                  columnCount={visibleColumnsCount}
                  rowCount={loadingSkeletonRows}
                  enableRowSelection={enableRowSelection}
                  compact={compact}
                />
              ) : null
            ) : table.pageRows.length === 0 ? (
              <tbody className="dt-tbody">
                <tr>
                  <td
                    colSpan={visibleColumnsCount + (enableRowSelection ? 1 : 0)}
                    className="p-0 border-none"
                  >
                    <div className="py-12 px-4 flex flex-col items-center justify-center text-center">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        {emptyStateIcon || (
                          <TableProperties className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                        )}
                      </div>
                      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                        {emptyStateTitle ?? 'No data available'}
                      </h3>
                      {emptyStateDescription !== undefined ? (
                        emptyStateDescription && (
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                            {emptyStateDescription}
                          </p>
                        )
                      ) : (
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                          There are no records matching your request or filter criteria.
                        </p>
                      )}
                      {emptyStateAction && <div className="mt-5">{emptyStateAction}</div>}
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
              <DataTableBody columns={columns} getRowId={getRowId} />
            )}
          </table>
        </div>

        {/* Pagination Footer */}
        {enablePagination && <DataTablePagination />}
      </div>
    </DataTableContext.Provider>
  );
}

export default DataTable;
