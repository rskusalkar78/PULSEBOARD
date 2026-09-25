/**
 * DataTableToolbar.tsx — Search + filter controls + column visibility toggle
 * Sits above the table. Renders global filter input, active filter chips,
 * column visibility picker, and optional consumer-provided slots.
 */

import React, { useRef, useState, useEffect } from 'react';
import { Search, X, Columns3, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/utils/styles';
import { useDataTableContext } from './DataTableContext';
import type { ColumnDef } from '@/types/table';

// ─── Global Filter Input ──────────────────────────────────────────────────────

function GlobalFilterInput() {
  const { table } = useDataTableContext();
  const [localValue, setLocalValue] = useState(table.state.globalFilter);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalValue(table.state.globalFilter);
  }, [table.state.globalFilter]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalValue(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => table.setGlobalFilter(val), 250);
  };

  const handleClear = () => {
    setLocalValue('');
    table.setGlobalFilter('');
  };

  return (
    <div className="dt-search-wrapper">
      <Search className="dt-search-icon" aria-hidden="true" />
      <input
        type="search"
        placeholder="Search…"
        value={localValue}
        onChange={handleChange}
        aria-label="Global search"
        className="dt-search-input"
        id="dt-global-search"
      />
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="dt-search-clear"
        >
          <X className="dt-icon-xs" />
        </button>
      )}
    </div>
  );
}

// ─── Active Filter Chips ──────────────────────────────────────────────────────

function ActiveFilterChips() {
  const { table } = useDataTableContext();
  const { activeFilters } = table.state;

  if (activeFilters.length === 0) return null;

  return (
    <div className="dt-filter-chips" role="list" aria-label="Active filters">
      {activeFilters.map((af) => (
        <span key={`${af.columnId}-${af.label}`} className="dt-chip" role="listitem">
          <span className="dt-chip-label">
            {af.label}: <strong>{String(af.filter.value)}</strong>
          </span>
          <button
            type="button"
            aria-label={`Remove filter: ${af.label}`}
            className="dt-chip-remove"
            onClick={() =>
              table.setActiveFilters(activeFilters.filter((f) => f.columnId !== af.columnId))
            }
          >
            <X className="dt-icon-xs" />
          </button>
        </span>
      ))}
      {activeFilters.length > 1 && (
        <button
          type="button"
          className="dt-chip-clear-all"
          onClick={() => table.setActiveFilters([])}
        >
          Clear all
        </button>
      )}
    </div>
  );
}

// ─── Column Visibility Picker ─────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ColumnVisibilityPicker({ columns }: { columns: ColumnDef<any>[] }) {
  const { table } = useDataTableContext();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const hideable = columns.filter((c) => c.enableHiding !== false);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', keyHandler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', keyHandler);
    };
  }, [open]);

  const isVisible = (id: string) => table.state.columnVisibility[id] !== false;

  const toggle = (id: string) => {
    table.setColumnVisibility({
      ...table.state.columnVisibility,
      [id]: !isVisible(id),
    });
  };

  return (
    <div ref={ref} className="dt-col-vis-root">
      <button
        type="button"
        className="dt-col-vis-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        title="Toggle column visibility"
      >
        <Columns3 className="dt-icon-sm" />
        <span className="dt-col-vis-label">Columns</span>
        <ChevronDown
          className={cn('dt-icon-xs dt-col-vis-chevron', open && 'dt-col-vis-chevron--open')}
        />
      </button>

      {open && (
        <div className="dt-col-vis-panel" role="listbox" aria-label="Column visibility">
          <p className="dt-col-vis-heading">Toggle columns</p>
          {hideable.map((col) => {
            const visible = isVisible(col.id);
            return (
              <button
                key={col.id}
                type="button"
                role="option"
                aria-selected={visible}
                className={cn('dt-col-vis-item', visible && 'dt-col-vis-item--checked')}
                onClick={() => toggle(col.id)}
              >
                <span className={cn('dt-col-vis-check', visible && 'dt-col-vis-check--visible')}>
                  {visible && <Check className="dt-icon-xs" />}
                </span>
                <span>{typeof col.header === 'string' ? col.header : col.id}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Toolbar ──────────────────────────────────────────────────────────────────

export interface DataTableToolbarProps {
  toolbarLeft?: React.ReactNode;
  toolbarRight?: React.ReactNode;
  enableGlobalFilter?: boolean;
  enableColumnVisibility?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<any>[];
}

export function DataTableToolbar({
  toolbarLeft,
  toolbarRight,
  enableGlobalFilter = true,
  enableColumnVisibility = true,
  columns,
}: DataTableToolbarProps) {
  return (
    <div className="dt-toolbar">
      {/* Left slot */}
      <div className="dt-toolbar-left">
        {enableGlobalFilter && <GlobalFilterInput />}
        {toolbarLeft}
      </div>

      {/* Right slot */}
      <div className="dt-toolbar-right">
        {toolbarRight}
        {enableColumnVisibility && <ColumnVisibilityPicker columns={columns} />}
      </div>

      {/* Active filter chips — full-width row below */}
      <ActiveFilterChips />
    </div>
  );
}
