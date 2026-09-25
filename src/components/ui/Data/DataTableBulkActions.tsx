/**
 * DataTableBulkActions.tsx — Floating action bar that appears when rows are selected.
 * Renders bulk-action buttons with optional danger styling.
 */

import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/styles';
import { useDataTableContext } from './DataTableContext';
import type { BulkAction } from '@/types/table';

export function DataTableBulkActions<TData>({ bulkActions }: { bulkActions: BulkAction<TData>[] }) {
  const { table } = useDataTableContext<TData>();
  const { selectedRows } = table;
  const count = selectedRows.length;

  if (count === 0) return null;

  const visibleActions = bulkActions.filter((a) => !a.isHidden?.(selectedRows));

  return (
    <div className="dt-bulk-bar" role="toolbar" aria-label="Bulk actions">
      {/* Count + clear */}
      <div className="dt-bulk-count">
        <span className="dt-bulk-count-badge">{count}</span>
        <span className="dt-bulk-count-label">{count === 1 ? 'row' : 'rows'} selected</span>
        <button
          type="button"
          className="dt-bulk-clear"
          onClick={() => table.toggleAllRowsSelected(false)}
          aria-label="Clear selection"
          title="Clear selection"
        >
          <X className="dt-icon-sm" />
        </button>
      </div>

      {/* Divider */}
      <div className="dt-bulk-divider" aria-hidden="true" />

      {/* Actions */}
      <div className="dt-bulk-actions">
        {visibleActions.map((action) => {
          const disabled = action.isDisabled?.(selectedRows) ?? false;
          return (
            <button
              key={action.id}
              type="button"
              className={cn(
                'dt-bulk-btn',
                action.variant === 'danger' && 'dt-bulk-btn--danger',
                disabled && 'dt-bulk-btn--disabled'
              )}
              disabled={disabled}
              onClick={() => action.onAction(selectedRows)}
              title={action.label}
            >
              {action.icon && (
                <span className="dt-bulk-btn-icon" aria-hidden="true">
                  {action.icon}
                </span>
              )}
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
