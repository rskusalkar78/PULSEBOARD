import React from 'react';
import { cn } from '@/utils/styles';

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
  label?: React.ReactNode;
}

export const Separator: React.FC<SeparatorProps> = ({
  className,
  orientation = 'horizontal',
  decorative = true,
  label,
  ...props
}) => {
  if (label && orientation === 'horizontal') {
    return (
      <div className={cn('relative flex items-center w-full my-2', className)} {...props}>
        <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
        <span className="px-3 text-xs text-slate-500 dark:text-slate-400 font-medium">{label}</span>
        <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
      </div>
    );
  }

  return (
    <div
      role={decorative ? 'none' : 'separator'}
      aria-orientation={decorative ? undefined : orientation}
      className={cn(
        'shrink-0 bg-slate-200 dark:bg-slate-800',
        orientation === 'horizontal'
          ? 'h-[1px] w-full my-2'
          : 'h-full w-[1px] mx-2 self-stretch inline-block',
        className
      )}
      {...props}
    />
  );
};
