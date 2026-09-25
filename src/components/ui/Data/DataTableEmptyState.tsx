/**
 * DataTableEmptyState.tsx — Customizable empty state for DataTable
 */

import React from 'react';
import { TableX } from 'lucide-react';
import { useDataTableContext } from './DataTableContext';

export interface DataTableEmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  columnCount: number;
}

export function DataTableEmptyState({
  title = 'No data available',
  description = 'There are no records matching your request or filter criteria.',
  icon,
  action,
  columnCount,
}: DataTableEmptyStateProps) {
  const { enableRowSelection } = useDataTableContext();
  const totalCols = columnCount + (enableRowSelection ? 1 : 0);
  const resolvedIcon = icon ?? <TableX className="h-8 w-8 text-slate-400 dark:text-slate-500" />;

  return (
    <tbody className="dt-tbody">
      <tr>
        <td colSpan={totalCols} className="p-0 border-none">
          <div className="py-12 px-4 flex flex-col items-center justify-center text-center">
            {resolvedIcon && (
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                {resolvedIcon}
              </div>
            )}
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
            {description && (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                {description}
              </p>
            )}
            {action && <div className="mt-5">{action}</div>}
          </div>
        </td>
      </tr>
    </tbody>
  );
}
