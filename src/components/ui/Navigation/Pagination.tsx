import React from 'react';
import { cn } from '@/utils/styles';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '../Button/Button';
import { IconButton } from '../Button/IconButton';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
  showPageDetails?: boolean;
  totalItems?: number;
  itemsPerPage?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
  showPageDetails = false,
  totalItems,
  itemsPerPage,
}) => {
  const generateRange = (start: number, end: number) => {
    const range: number[] = [];
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  };

  const getPageNumbers = () => {
    const totalNumbers = siblingCount * 2 + 3;
    const totalBlocks = totalNumbers + 2;

    if (totalPages <= totalBlocks) {
      return generateRange(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = generateRange(1, leftItemCount);
      return [...leftRange, 'DOTS', totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = generateRange(totalPages - rightItemCount + 1, totalPages);
      return [1, 'DOTS', ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = generateRange(leftSiblingIndex, rightSiblingIndex);
      return [1, 'DOTS', ...middleRange, 'DOTS', totalPages];
    }

    return generateRange(1, totalPages);
  };

  const pages = getPageNumbers();

  return (
    <nav
      role="navigation"
      aria-label="Pagination Navigation"
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-4 w-full',
        className
      )}
    >
      {showPageDetails && totalItems !== undefined && itemsPerPage !== undefined && (
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Showing{' '}
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}
          </span>{' '}
          to{' '}
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {Math.min(currentPage * itemsPerPage, totalItems)}
          </span>{' '}
          of <span className="font-medium text-slate-900 dark:text-slate-100">{totalItems}</span>{' '}
          results
        </p>
      )}

      <div className="flex items-center gap-1">
        <IconButton
          icon={<ChevronLeft className="h-4 w-4" />}
          aria-label="Previous Page"
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        />

        {pages.map((page, idx) => {
          if (page === 'DOTS') {
            return (
              <span key={`dots-${idx}`} className="px-2 py-1 text-slate-400 dark:text-slate-500">
                <MoreHorizontal className="h-4 w-4" />
              </span>
            );
          }

          const pageNum = page as number;
          const isSelected = pageNum === currentPage;

          return (
            <Button
              key={pageNum}
              size="sm"
              variant={isSelected ? 'primary' : 'ghost'}
              onClick={() => onPageChange(pageNum)}
              aria-current={isSelected ? 'page' : undefined}
              className="w-8 h-8 p-0"
            >
              {pageNum}
            </Button>
          );
        })}

        <IconButton
          icon={<ChevronRight className="h-4 w-4" />}
          aria-label="Next Page"
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        />
      </div>
    </nav>
  );
};
