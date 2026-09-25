/**
 * DataTableHeader.tsx — Sortable, typed column headers with select-all checkbox
 */

import React from 'react';
import { ArrowUp, ArrowDown, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/utils/styles';
import { useDataTableContext } from './DataTableContext';
import type { ColumnDef, SortState } from '@/types/table';

// ─── Sort indicator icon ───────────────────────────────────────────────────────

function SortIcon({ sort, columnId }: { sort: SortState | null; columnId: string }) {
  if (sort?.columnId !== columnId) {
    return <ChevronsUpDown className="dt-sort-icon dt-sort-icon--idle" aria-hidden="true" />;
  }
  return sort.direction === 'asc' ? (
    <ArrowUp className="dt-sort-icon dt-sort-icon--active" aria-hidden="true" />
  ) : (
    <ArrowDown className="dt-sort-icon dt-sort-icon--active" aria-hidden="true" />
  );
}

// ─── Single header cell ────────────────────────────────────────────────────────

function HeaderCell<TData>({ column }: { column: ColumnDef<TData> }) {
  const { table, enableSorting } = useDataTableContext<TData>();
  const { sort } = table.state;

  const canSort = enableSorting && column.enableSorting !== false;
  const isVisible = table.state.columnVisibility[column.id] !== false;
  if (!isVisible) return null;

  const handleSort = () => {
    if (!canSort) return;
    if (sort?.columnId !== column.id) {
      table.setSortState({ columnId: column.id, direction: column.sortDescFirst ? 'desc' : 'asc' });
    } else if (sort.direction === 'asc') {
      table.setSortState({ columnId: column.id, direction: 'desc' });
    } else {
      table.setSortState(null);
    }
  };

  const resolvedHeader =
    typeof column.header === 'function' ? column.header({ column, table }) : column.header;

  const alignClass =
    column.align === 'center'
      ? 'dt-th--center'
      : column.align === 'right'
        ? 'dt-th--right'
        : 'dt-th--left';

  return (
    <th
      className={cn('dt-th', alignClass, canSort && 'dt-th--sortable', column.headerClassName)}
      style={{ width: column.size ? `${column.size}px` : undefined }}
      aria-sort={
        sort?.columnId === column.id
          ? sort.direction === 'asc'
            ? 'ascending'
            : 'descending'
          : canSort
            ? 'none'
            : undefined
      }
      scope="col"
    >
      {canSort ? (
        <button
          type="button"
          className="dt-th-sort-btn"
          onClick={handleSort}
          title={`Sort by ${typeof column.header === 'string' ? column.header : column.id}`}
        >
          <span>{resolvedHeader}</span>
          <SortIcon sort={sort} columnId={column.id} />
        </button>
      ) : (
        resolvedHeader
      )}
    </th>
  );
}

// ─── Select-all checkbox cell ─────────────────────────────────────────────────

function SelectAllCell() {
  const { table } = useDataTableContext();
  const totalRows = table.rows.length;
  const selectedCount = Object.keys(table.state.rowSelection).length;
  const allSelected = totalRows > 0 && selectedCount === totalRows;
  const someSelected = selectedCount > 0 && selectedCount < totalRows;

  const checkRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (checkRef.current) {
      checkRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  return (
    <th className="dt-th dt-th-check" aria-label="Select all rows" scope="col">
      <div className="dt-check-cell">
        <input
          ref={checkRef}
          type="checkbox"
          checked={allSelected}
          onChange={(e) => table.toggleAllRowsSelected(e.target.checked)}
          aria-label="Select all rows"
          className="dt-checkbox"
          id="dt-select-all"
        />
      </div>
    </th>
  );
}

// ─── Header row ───────────────────────────────────────────────────────────────

export function DataTableHeader<TData>({ columns }: { columns: ColumnDef<TData>[] }) {
  const { enableRowSelection, stickyHeader } = useDataTableContext<TData>();

  return (
    <thead className={cn('dt-thead', stickyHeader && 'dt-thead--sticky')}>
      <tr className="dt-tr">
        {enableRowSelection && <SelectAllCell />}
        {columns.map((col) => (
          <HeaderCell key={col.id} column={col} />
        ))}
      </tr>
    </thead>
  );
}
