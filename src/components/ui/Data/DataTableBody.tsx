/**
 * DataTableBody.tsx — Renders data rows with row-selection, striping, and
 * per-cell custom renderers.  Uses memoised row components for large datasets.
 */

import React, { memo } from 'react';
import { cn } from '@/utils/styles';
import { useDataTableContext } from './DataTableContext';
import type { ColumnDef, TableInstance } from '@/types/table';

// ─── Cell value accessor ──────────────────────────────────────────────────────

function getCellValue<TData>(row: TData, column: ColumnDef<TData>): unknown {
  if (column.accessorFn) return column.accessorFn(row);
  if (column.accessorKey != null)
    return (row as Record<string, unknown>)[column.accessorKey as string];
  return undefined;
}

// ─── Single Cell ──────────────────────────────────────────────────────────────

function DataCell<TData>({
  column,
  row,
  rowIndex,
  table,
}: {
  column: ColumnDef<TData>;
  row: TData;
  rowIndex: number;
  table: TableInstance<TData>;
}) {
  const isVisible = table.state.columnVisibility[column.id] !== false;
  if (!isVisible) return null;

  const value = getCellValue(row, column) as never;

  const content = column.cell ? (
    column.cell({ value, row, rowIndex, column, table })
  ) : value == null ? (
    <span className="dt-cell-null">—</span>
  ) : (
    String(value)
  );

  const alignClass =
    column.align === 'center'
      ? 'dt-td--center'
      : column.align === 'right'
        ? 'dt-td--right'
        : 'dt-td--left';

  return (
    <td className={cn('dt-td', alignClass, column.cellClassName, column.className)}>{content}</td>
  );
}

// ─── Row Checkbox ─────────────────────────────────────────────────────────────

function RowCheckbox({ rowId, label }: { rowId: string; label: string }) {
  const { table } = useDataTableContext();
  const checked = !!table.state.rowSelection[rowId];
  return (
    <td className="dt-td dt-td-check">
      <div className="dt-check-cell">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => table.toggleRowSelected(rowId)}
          aria-label={label}
          className="dt-checkbox"
          id={`dt-row-select-${rowId}`}
        />
      </div>
    </td>
  );
}

// ─── Single Row (memoised) ────────────────────────────────────────────────────

interface RowProps<TData> {
  row: TData;
  rowIndex: number;
  rowId: string;
  columns: ColumnDef<TData>[];
  table: TableInstance<TData>;
  enableRowSelection: boolean;
  striped: boolean;
  compact: boolean;
  bordered: boolean;
}

// Using a generic memo via cast — React.memo doesn't accept generic components directly
// so we cast to preserve the TData type through the component.
const DataRow = memo(function DataRow<TData>({
  row,
  rowIndex,
  rowId,
  columns,
  table,
  enableRowSelection,
  striped,
  compact,
  bordered,
}: RowProps<TData>) {
  const isSelected = !!table.state.rowSelection[rowId];

  return (
    <tr
      className={cn(
        'dt-tr dt-tr--body',
        isSelected && 'dt-tr--selected',
        striped && rowIndex % 2 === 1 && 'dt-tr--stripe',
        compact && 'dt-tr--compact',
        bordered && 'dt-tr--bordered'
      )}
      data-state={isSelected ? 'selected' : undefined}
      aria-selected={enableRowSelection ? isSelected : undefined}
    >
      {enableRowSelection && <RowCheckbox rowId={rowId} label={`Select row ${rowIndex + 1}`} />}
      {columns.map((col) => (
        <DataCell key={col.id} column={col} row={row} rowIndex={rowIndex} table={table} />
      ))}
    </tr>
  );
}) as <TData>(props: RowProps<TData>) => React.ReactElement;

// ─── Body ─────────────────────────────────────────────────────────────────────

export function DataTableBody<TData>({
  columns,
  getRowId,
}: {
  columns: ColumnDef<TData>[];
  getRowId: (row: TData, index: number) => string;
}) {
  const { table, enableRowSelection, striped, compact, bordered } = useDataTableContext<TData>();
  const { pageRows } = table;

  return (
    <tbody className="dt-tbody">
      {pageRows.map((row, idx) => {
        const rowId = getRowId(row, idx);
        return (
          <DataRow
            key={rowId}
            row={row}
            rowIndex={idx}
            rowId={rowId}
            columns={columns}
            table={table}
            enableRowSelection={enableRowSelection}
            striped={striped}
            compact={compact}
            bordered={bordered}
          />
        );
      })}
    </tbody>
  );
}
