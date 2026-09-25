/**
 * DataTableSkeleton.tsx — Loading skeleton for the table body
 * Animates placeholder rows while data is being fetched.
 */

import React from 'react';
import { cn } from '@/utils/styles';

interface DataTableSkeletonProps {
  columnCount: number;
  rowCount?: number;
  enableRowSelection?: boolean;
  compact?: boolean;
}

export function DataTableSkeleton({
  columnCount,
  rowCount = 8,
  enableRowSelection = false,
  compact = false,
}: DataTableSkeletonProps) {
  const totalCols = columnCount + (enableRowSelection ? 1 : 0);

  return (
    <tbody className="dt-tbody dt-tbody--skeleton">
      {Array.from({ length: rowCount }).map((_, rowIdx) => (
        <tr key={rowIdx} className={cn('dt-tr dt-tr--body', compact && 'dt-tr--compact')}>
          {Array.from({ length: totalCols }).map((_, colIdx) => (
            <td key={colIdx} className="dt-td">
              <div
                className={cn(
                  'dt-skeleton',
                  // Vary widths for a realistic look
                  colIdx === 0 && enableRowSelection ? 'dt-skeleton--check' : 'dt-skeleton--text',
                  colIdx % 3 === 0 && 'dt-skeleton--w60',
                  colIdx % 3 === 1 && 'dt-skeleton--w80',
                  colIdx % 3 === 2 && 'dt-skeleton--w40'
                )}
                style={{ animationDelay: `${(rowIdx * totalCols + colIdx) * 40}ms` }}
                aria-hidden="true"
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
