import React from 'react';
import { cn } from '@/utils/styles';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  containerClassName?: string;
}

export const Table: React.FC<TableProps> = ({
  className,
  containerClassName,
  children,
  ...props
}) => (
  <div
    className={cn(
      'relative w-full overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800',
      containerClassName
    )}
  >
    <table className={cn('w-full caption-bottom text-sm text-left', className)} {...props}>
      {children}
    </table>
  </div>
);

export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className,
  children,
  ...props
}) => (
  <thead
    className={cn(
      'bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold',
      className
    )}
    {...props}
  >
    {children}
  </thead>
);

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className,
  children,
  ...props
}) => (
  <tbody
    className={cn(
      'divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900',
      className
    )}
    {...props}
  >
    {children}
  </tbody>
);

export const TableFooter: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className,
  children,
  ...props
}) => (
  <tfoot
    className={cn(
      'bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 font-medium text-slate-700 dark:text-slate-300',
      className
    )}
    {...props}
  >
    {children}
  </tfoot>
);

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({
  className,
  children,
  ...props
}) => (
  <tr
    className={cn(
      'transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50 data-[state=selected]:bg-slate-100 dark:data-[state=selected]:bg-slate-800',
      className
    )}
    {...props}
  >
    {children}
  </tr>
);

export const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({
  className,
  children,
  ...props
}) => (
  <th
    className={cn(
      'h-11 px-4 text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 align-middle',
      className
    )}
    {...props}
  >
    {children}
  </th>
);

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({
  className,
  children,
  ...props
}) => (
  <td className={cn('p-4 align-middle text-slate-900 dark:text-slate-100', className)} {...props}>
    {children}
  </td>
);

export const TableCaption: React.FC<React.HTMLAttributes<HTMLTableCaptionElement>> = ({
  className,
  children,
  ...props
}) => (
  <caption
    className={cn('mt-4 text-xs text-slate-500 dark:text-slate-400 italic', className)}
    {...props}
  >
    {children}
  </caption>
);
