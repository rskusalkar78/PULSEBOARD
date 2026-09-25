/**
 * DataTablePagination.tsx — Page navigation + page-size selector
 * Integrates with the existing Pagination primitive for page buttons.
 */

import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/utils/styles';
import { useDataTableContext } from './DataTableContext';
import { PAGE_SIZE_OPTIONS } from '@/types/table';
import type { PageSizeOption } from '@/types/table';

// ─── Page size selector ────────────────────────────────────────────────────────

function PageSizeSelect() {
  const { table } = useDataTableContext();
  const { pageSize } = table.state.pagination;

  return (
    <div className="dt-page-size">
      <label htmlFor="dt-page-size" className="dt-page-size-label">
        Rows per page
      </label>
      <select
        id="dt-page-size"
        className="dt-page-size-select"
        value={pageSize}
        onChange={(e) =>
          table.setPagination({ pageIndex: 0, pageSize: Number(e.target.value) as PageSizeOption })
        }
      >
        {PAGE_SIZE_OPTIONS.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── Page buttons ─────────────────────────────────────────────────────────────

function generatePageRange(current: number, total: number, siblings = 1): (number | 'DOTS')[] {
  const totalNumbers = siblings * 2 + 3;
  const totalBlocks = totalNumbers + 2;
  const range = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

  if (total <= totalBlocks) return range(1, total);

  const leftIdx = Math.max(current - siblings, 1);
  const rightIdx = Math.min(current + siblings, total);
  const showLeft = leftIdx > 2;
  const showRight = rightIdx < total - 2;

  if (!showLeft && showRight) return [...range(1, 3 + 2 * siblings), 'DOTS', total];
  if (showLeft && !showRight) return [1, 'DOTS', ...range(total - (3 + 2 * siblings) + 1, total)];
  if (showLeft && showRight) return [1, 'DOTS', ...range(leftIdx, rightIdx), 'DOTS', total];
  return range(1, total);
}

function PageButtons() {
  const { table } = useDataTableContext();
  const { pageIndex, pageSize } = table.state.pagination;
  const currentPage = pageIndex + 1;
  const pages = generatePageRange(currentPage, table.pageCount);

  return (
    <div className="dt-page-btns" role="navigation" aria-label="Pagination">
      {/* Previous */}
      <button
        type="button"
        className="dt-page-btn dt-page-btn--nav"
        disabled={pageIndex === 0}
        onClick={() => table.setPagination({ pageIndex: pageIndex - 1, pageSize })}
        aria-label="Previous page"
      >
        <ChevronLeft className="dt-icon-sm" />
      </button>

      {pages.map((page, idx) => {
        if (page === 'DOTS') {
          return (
            <span key={`dots-${idx}`} className="dt-page-btn dt-page-dots">
              <MoreHorizontal className="dt-icon-sm" />
            </span>
          );
        }
        const isActive = page === currentPage;
        return (
          <button
            key={page}
            type="button"
            className={cn('dt-page-btn', isActive && 'dt-page-btn--active')}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => table.setPagination({ pageIndex: (page as number) - 1, pageSize })}
          >
            {page}
          </button>
        );
      })}

      {/* Next */}
      <button
        type="button"
        className="dt-page-btn dt-page-btn--nav"
        disabled={pageIndex >= table.pageCount - 1}
        onClick={() => table.setPagination({ pageIndex: pageIndex + 1, pageSize })}
        aria-label="Next page"
      >
        <ChevronRight className="dt-icon-sm" />
      </button>
    </div>
  );
}

// ─── Pagination bar ───────────────────────────────────────────────────────────

export function DataTablePagination() {
  const { table, enableRowSelection } = useDataTableContext();
  const { pageIndex, pageSize } = table.state.pagination;
  const total = table.totalRows;
  const start = Math.min(pageIndex * pageSize + 1, total);
  const end = Math.min((pageIndex + 1) * pageSize, total);
  const selectedCount = Object.keys(table.state.rowSelection).length;

  return (
    <div className="dt-pagination">
      {/* Left — results summary */}
      <div className="dt-pagination-info">
        {total > 0 ? (
          <span>
            <strong>{start}</strong>–<strong>{end}</strong> of <strong>{total}</strong> results
          </span>
        ) : (
          <span>No results</span>
        )}
        {enableRowSelection && selectedCount > 0 && (
          <span className="dt-pagination-selected">{selectedCount} selected</span>
        )}
      </div>

      {/* Right — page size + buttons */}
      <div className="dt-pagination-controls">
        <PageSizeSelect />
        <PageButtons />
      </div>
    </div>
  );
}
