/**
 * table.ts — Enterprise DataTable Type Definitions
 * Strongly typed column definitions and table state contracts.
 */

import type React from 'react';

// ─── Sorting ─────────────────────────────────────────────────────────────────

export type SortDirection = 'asc' | 'desc';

export interface SortState {
  columnId: string;
  direction: SortDirection;
}

// ─── Filtering ────────────────────────────────────────────────────────────────

export type FilterOperator =
  | 'equals'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'between'
  | 'in'
  | 'notIn'
  | 'isEmpty'
  | 'isNotEmpty';

export interface FilterValue {
  operator: FilterOperator;
  value: unknown;
  valueTo?: unknown; // for 'between'
}

export interface ActiveFilter {
  columnId: string;
  label: string;
  filter: FilterValue;
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginationState {
  pageIndex: number; // 0-based
  pageSize: number;
}

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;
export type PageSizeOption = (typeof PAGE_SIZE_OPTIONS)[number];

// ─── Row Selection ────────────────────────────────────────────────────────────

/** Map of row id → selected (true). Sparse — only selected rows are present. */
export type RowSelectionState = Record<string, boolean>;

// ─── Column Visibility ────────────────────────────────────────────────────────

/** Map of column id → visible. Columns absent from the map are visible by default. */
export type ColumnVisibilityState = Record<string, boolean>;

// ─── Column Definition ────────────────────────────────────────────────────────

export type ColumnAlignment = 'left' | 'center' | 'right';
export type ColumnPinPosition = 'left' | 'right' | false;

/**
 * Accessor function overload — called with the row data to extract the cell value.
 * The generic TData is the row type, TValue is the resolved cell value.
 */
export type AccessorFn<TData, TValue = unknown> = (row: TData) => TValue;

export interface ColumnDef<TData, TValue = unknown> {
  /** Unique identifier for this column. Also used as object-key accessor when no accessorFn is provided. */
  id: string;

  /** Human-readable column header label. */
  header: string | React.ReactNode | ((ctx: HeaderContext<TData, TValue>) => React.ReactNode);

  /**
   * How to derive the cell value.
   * Pass a string key (keyof TData) or a custom accessor function.
   */
  accessorKey?: keyof TData;
  accessorFn?: AccessorFn<TData, TValue>;

  /** Custom cell renderer. Receives the raw value + row data. */
  cell?: (ctx: CellContext<TData, TValue>) => React.ReactNode;

  /** Footer cell renderer. */
  footer?: (ctx: FooterContext<TData, TValue>) => React.ReactNode;

  // ── Sorting ──
  enableSorting?: boolean;
  sortingFn?: (a: TData, b: TData, columnId: string) => number;
  sortDescFirst?: boolean;

  // ── Filtering ──
  enableFiltering?: boolean;
  filterFn?: (row: TData, columnId: string, filterValue: FilterValue) => boolean;

  // ── Visibility ──
  enableHiding?: boolean;
  defaultVisible?: boolean;

  // ── Layout ──
  align?: ColumnAlignment;
  size?: number; // px width hint
  minSize?: number;
  maxSize?: number;
  pin?: ColumnPinPosition;

  // ── Misc ──
  className?: string;
  headerClassName?: string;
  cellClassName?: string;
  meta?: Record<string, unknown>;
}

// ─── Context objects passed into render functions ─────────────────────────────

export interface HeaderContext<TData, TValue = unknown> {
  column: ColumnDef<TData, TValue>;
  table: TableInstance<TData>;
}

export interface CellContext<TData, TValue = unknown> {
  value: TValue;
  row: TData;
  rowIndex: number;
  column: ColumnDef<TData, TValue>;
  table: TableInstance<TData>;
}

export interface FooterContext<TData, TValue = unknown> {
  column: ColumnDef<TData, TValue>;
  table: TableInstance<TData>;
  rows: TData[];
}

// ─── Bulk Actions ─────────────────────────────────────────────────────────────

export interface BulkAction<TData> {
  id: string;
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'danger';
  /** Called with the array of currently selected rows. */
  onAction: (selectedRows: TData[]) => void;
  /** Return true to hide this action for the given selection. */
  isHidden?: (selectedRows: TData[]) => boolean;
  /** Return true to disable (but still show) this action. */
  isDisabled?: (selectedRows: TData[]) => boolean;
}

// ─── Table State ──────────────────────────────────────────────────────────────

export interface TableState {
  sort: SortState | null;
  globalFilter: string;
  activeFilters: ActiveFilter[];
  pagination: PaginationState;
  rowSelection: RowSelectionState;
  columnVisibility: ColumnVisibilityState;
}

// ─── Table Instance (passed into render callbacks) ────────────────────────────

export interface TableInstance<TData> {
  state: TableState;
  rows: TData[]; // all rows (pre-pagination)
  pageRows: TData[]; // rows for the current page
  pageCount: number;
  totalRows: number;
  selectedRows: TData[];
  // Actions
  setSortState: (sort: SortState | null) => void;
  setGlobalFilter: (q: string) => void;
  setActiveFilters: (filters: ActiveFilter[]) => void;
  setPagination: (p: PaginationState) => void;
  setRowSelection: (sel: RowSelectionState) => void;
  setColumnVisibility: (vis: ColumnVisibilityState) => void;
  toggleRowSelected: (id: string) => void;
  toggleAllRowsSelected: (selected: boolean) => void;
}

// ─── DataTable Props ──────────────────────────────────────────────────────────

export interface DataTableProps<TData> {
  /** The column definitions. */
  columns: ColumnDef<TData>[];

  /** The full dataset. Sorting / filtering / pagination are applied client-side. */
  data: TData[];

  /** Function to derive a stable string ID from a row. Defaults to row index. */
  getRowId?: (row: TData, index: number) => string;

  // ── Features ──
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enableGlobalFilter?: boolean;
  enablePagination?: boolean;
  enableRowSelection?: boolean;
  enableColumnVisibility?: boolean;

  // ── Initial State ──
  initialState?: Partial<TableState>;

  // ── Server-side mode ──
  /**
   * When true, sorting / filtering / pagination are NOT applied internally.
   * The consumer controls `data` and must respond to `onStateChange`.
   */
  manualSorting?: boolean;
  manualFiltering?: boolean;
  manualPagination?: boolean;
  /** Total row count — required in server-side pagination mode. */
  rowCount?: number;

  // ── Callbacks ──
  onStateChange?: (state: TableState) => void;
  onRowSelectionChange?: (selectedRows: TData[]) => void;

  // ── Bulk Actions ──
  bulkActions?: BulkAction<TData>[];

  // ── Loading / Empty States ──
  isLoading?: boolean;
  loadingSkeletonRows?: number;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  emptyStateIcon?: React.ReactNode;
  emptyStateAction?: React.ReactNode;

  // ── Layout ──
  className?: string;
  tableClassName?: string;
  stickyHeader?: boolean;
  striped?: boolean;
  compact?: boolean;
  bordered?: boolean;

  // ── Toolbar extras ──
  toolbarLeft?: React.ReactNode;
  toolbarRight?: React.ReactNode;

  // ── Pagination defaults ──
  defaultPageSize?: PageSizeOption;
}
