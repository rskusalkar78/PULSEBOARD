import React from 'react';
import { cn } from '@/utils/styles';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ children, className, ...props }) => {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center text-sm', className)} {...props}>
      <ol className="flex items-center gap-1.5 flex-wrap">{children}</ol>
    </nav>
  );
};

export interface BreadcrumbItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  children: React.ReactNode;
}

export const BreadcrumbItem: React.FC<BreadcrumbItemProps> = ({
  children,
  className,
  ...props
}) => (
  <li className={cn('inline-flex items-center gap-1.5', className)} {...props}>
    {children}
  </li>
);

export interface BreadcrumbLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  isCurrentPage?: boolean;
}

export const BreadcrumbLink: React.FC<BreadcrumbLinkProps> = ({
  children,
  isCurrentPage = false,
  className,
  ...props
}) => {
  if (isCurrentPage) {
    return (
      <span
        aria-current="page"
        className={cn('font-semibold text-slate-900 dark:text-slate-100', className)}
      >
        {children}
      </span>
    );
  }

  return (
    <a
      className={cn(
        'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors',
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
};

export const BreadcrumbSeparator: React.FC<{ children?: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <span
    className={cn('text-slate-400 dark:text-slate-600 select-none', className)}
    aria-hidden="true"
  >
    {children || <ChevronRight className="h-3.5 w-3.5" />}
  </span>
);
