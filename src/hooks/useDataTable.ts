/**
 * useDataTable.ts — Core table state machine hook
 *
 * Manages all DataTable state (sorting, filtering, pagination, selection,
 * column visibility) and applies client-side transformations to the dataset.
 * In server-side mode the transformations are skipped — the consumer drives data.
 */

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import type {
  ColumnDef,
  TableState,
  SortState,
  ActiveFilter,
  PaginationState,
  RowSelectionState,
  ColumnVisibilityState,
  FilterValue,
  TableInstance,
  DataTableProps,
} from '@/types/table';

// ─── Default values ───────────────────────────────────────────────────────────

const DEFAULT_PAGE_SIZE = 10;

function buildInitialState(
  props: Pick<DataTableProps<unknown>, 'initialState' | 'defaultPageSize'>
): TableState {
  return {
    sort: null,
    globalFilter: '',
    activeFilters: [],
    pagination: {
      pageIndex: 0,
      pageSize: props.defaultPageSize ?? DEFAULT_PAGE_SIZE,
    },
    rowSelection: {},
    columnVisibility: {},
    ...props.initialState,
  };
}

// ─── Cell value accessor ──────────────────────────────────────────────────────

function getCellValue<TData>(row: TData, column: ColumnDef<TData>): unknown {
  if (column.accessorFn) return column.accessorFn(row);
  if (column.accessorKey != null)
    return (row as Record<string, unknown>)[column.accessorKey as string];
  return undefined;
}

// ─── Default sort comparator ──────────────────────────────────────────────────

function defaultSortComparator<TData>(a: TData, b: TData, column: ColumnDef<TData>): number {
  const va = getCellValue(a, column);
  const vb = getCellValue(b, column);
  if (va == null && vb == null) return 0;
  if (va == null) return -1;
  if (vb == null) return 1;
  if (typeof va === 'number' && typeof vb === 'number') return va - vb;
  return String(va).localeCompare(String(vb), undefined, { numeric: true, sensitivity: 'base' });
}

// ─── Default filter matcher ───────────────────────────────────────────────────

function defaultFilterMatcher<TData>(
  row: TData,
  column: ColumnDef<TData>,
  filter: FilterValue
): boolean {
  const rawValue = getCellValue(row, column);
  const cellStr = String(rawValue ?? '').toLowerCase();
  const filterStr = String(filter.value ?? '').toLowerCase();

  switch (filter.operator) {
    case 'contains':
      return cellStr.includes(filterStr);
    case 'equals':
      return cellStr === filterStr;
    case 'startsWith':
      return cellStr.startsWith(filterStr);
    case 'endsWith':
      return cellStr.endsWith(filterStr);
    case 'isEmpty':
      return rawValue == null || cellStr === '';
    case 'isNotEmpty':
      return rawValue != null && cellStr !== '';
    case 'gt':
      return Number(rawValue) > Number(filter.value);
    case 'gte':
      return Number(rawValue) >= Number(filter.value);
    case 'lt':
      return Number(rawValue) < Number(filter.value);
    case 'lte':
      return Number(rawValue) <= Number(filter.value);
    case 'between': {
      const n = Number(rawValue);
      return n >= Number(filter.value) && n <= Number(filter.valueTo);
    }
    case 'in':
      return Array.isArray(filter.value) && (filter.value as unknown[]).includes(rawValue);
    case 'notIn':
      return Array.isArray(filter.value) && !(filter.value as unknown[]).includes(rawValue);
    default:
      return true;
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDataTable<TData>(props: DataTableProps<TData>): TableInstance<TData> {
  const {
    data,
    columns,
    getRowId,
    manualSorting = false,
    manualFiltering = false,
    manualPagination = false,
    rowCount,
    onStateChange,
    onRowSelectionChange,
    enablePagination = true,
  } = props;

  // ── State ──────────────────────────────────────────────────────────────────
  const [state, setState] = useState<TableState>(() =>
    buildInitialState(
      props as unknown as Pick<DataTableProps<unknown>, 'initialState' | 'defaultPageSize'>
    )
  );

  // ── Derived helpers ────────────────────────────────────────────────────────
  const colMap = useMemo<Map<string, ColumnDef<TData>>>(
    () => new Map(columns.map((c) => [c.id, c])),
    [columns]
  );

  const resolveRowId = useCallback(
    (row: TData, index: number) => (getRowId ? getRowId(row, index) : String(index)),
    [getRowId]
  );

  // ── Notify parent of state changes ─────────────────────────────────────────
  const onStateChangeRef = useRef(onStateChange);
  onStateChangeRef.current = onStateChange;
  useEffect(() => {
    onStateChangeRef.current?.(state);
  }, [state]);

  // ── State setters (stable references) ─────────────────────────────────────
  const setSortState = useCallback((sort: SortState | null) => {
    setState((prev) => ({ ...prev, sort, pagination: { ...prev.pagination, pageIndex: 0 } }));
  }, []);

  const setGlobalFilter = useCallback((globalFilter: string) => {
    setState((prev) => ({
      ...prev,
      globalFilter,
      pagination: { ...prev.pagination, pageIndex: 0 },
    }));
  }, []);

  const setActiveFilters = useCallback((activeFilters: ActiveFilter[]) => {
    setState((prev) => ({
      ...prev,
      activeFilters,
      pagination: { ...prev.pagination, pageIndex: 0 },
    }));
  }, []);

  const setPagination = useCallback((pagination: PaginationState) => {
    setState((prev) => ({ ...prev, pagination }));
  }, []);

  const setRowSelection = useCallback((rowSelection: RowSelectionState) => {
    setState((prev) => ({ ...prev, rowSelection }));
  }, []);

  const setColumnVisibility = useCallback((columnVisibility: ColumnVisibilityState) => {
    setState((prev) => ({ ...prev, columnVisibility }));
  }, []);

  const toggleRowSelected = useCallback((id: string) => {
    setState((prev) => {
      const next = { ...prev.rowSelection };
      if (next[id]) {
        delete next[id];
      } else {
        next[id] = true;
      }
      return { ...prev, rowSelection: next };
    });
  }, []);

  const toggleAllRowsSelected = useCallback(
    (selected: boolean) => {
      if (!selected) {
        setState((prev) => ({ ...prev, rowSelection: {} }));
        return;
      }
      setState((prev) => {
        const next: RowSelectionState = {};
        data.forEach((row, idx) => {
          next[resolveRowId(row, idx)] = true;
        });
        return { ...prev, rowSelection: next };
      });
    },
    [data, resolveRowId]
  );

  // ── Client-side transformations ────────────────────────────────────────────

  const filteredRows = useMemo<TData[]>(() => {
    if (manualFiltering) return data;

    let rows = data;

    // Global filter
    if (state.globalFilter.trim()) {
      const q = state.globalFilter.toLowerCase();
      rows = rows.filter((row) =>
        columns.some((col) => {
          const v = getCellValue(row, col);
          return String(v ?? '')
            .toLowerCase()
            .includes(q);
        })
      );
    }

    // Per-column active filters
    if (state.activeFilters.length > 0) {
      rows = rows.filter((row) =>
        state.activeFilters.every(({ columnId, filter }) => {
          const col = colMap.get(columnId);
          if (!col) return true;
          return col.filterFn
            ? col.filterFn(row, columnId, filter)
            : defaultFilterMatcher(row, col, filter);
        })
      );
    }

    return rows;
  }, [data, state.globalFilter, state.activeFilters, columns, colMap, manualFiltering]);

  const sortedRows = useMemo<TData[]>(() => {
    if (manualSorting || !state.sort) return filteredRows;
    const { columnId, direction } = state.sort;
    const col = colMap.get(columnId);
    if (!col) return filteredRows;

    const multiplier = direction === 'asc' ? 1 : -1;
    return [...filteredRows].sort((a, b) => {
      const result = col.sortingFn
        ? col.sortingFn(a, b, columnId)
        : defaultSortComparator(a, b, col);
      return result * multiplier;
    });
  }, [filteredRows, state.sort, colMap, manualSorting]);

  const { pageRows, pageCount } = useMemo(() => {
    if (!enablePagination) {
      return { pageRows: sortedRows, pageCount: 1 };
    }
    if (manualPagination) {
      const total = rowCount ?? sortedRows.length;
      return {
        pageRows: sortedRows,
        pageCount: Math.max(1, Math.ceil(total / state.pagination.pageSize)),
      };
    }
    const { pageIndex, pageSize } = state.pagination;
    const start = pageIndex * pageSize;
    return {
      pageRows: sortedRows.slice(start, start + pageSize),
      pageCount: Math.max(1, Math.ceil(sortedRows.length / pageSize)),
    };
  }, [sortedRows, state.pagination, manualPagination, enablePagination, rowCount]);

  const selectedRows = useMemo<TData[]>(() => {
    return data.filter((row, idx) => state.rowSelection[resolveRowId(row, idx)]);
  }, [data, state.rowSelection, resolveRowId]);

  // Notify parent of selection changes
  const onRowSelectionChangeRef = useRef(onRowSelectionChange);
  onRowSelectionChangeRef.current = onRowSelectionChange;
  useEffect(() => {
    onRowSelectionChangeRef.current?.(selectedRows);
  }, [selectedRows]);

  // ── Build instance ─────────────────────────────────────────────────────────

  const instance: TableInstance<TData> = useMemo(
    () => ({
      state,
      rows: sortedRows,
      pageRows,
      pageCount,
      totalRows: sortedRows.length,
      selectedRows,
      setSortState,
      setGlobalFilter,
      setActiveFilters,
      setPagination,
      setRowSelection,
      setColumnVisibility,
      toggleRowSelected,
      toggleAllRowsSelected,
    }),
    [
      state,
      sortedRows,
      pageRows,
      pageCount,
      selectedRows,
      setSortState,
      setGlobalFilter,
      setActiveFilters,
      setPagination,
      setRowSelection,
      setColumnVisibility,
      toggleRowSelected,
      toggleAllRowsSelected,
    ]
  );

  return instance;
}
