import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/utils/styles';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showHomeIcon?: boolean;
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  showHomeIcon = true,
  className,
}) => {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center', className)}>
      <ol className="flex flex-wrap items-center gap-1 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isFirst = index === 0;

          return (
            <li key={index} className="flex items-center gap-1">
              {/* Separator */}
              {!isFirst && (
                <ChevronRight
                  className="h-4 w-4 text-slate-400 dark:text-slate-600 flex-shrink-0"
                  aria-hidden="true"
                />
              )}

              {/* Breadcrumb Item */}
              {isLast ? (
                <span
                  className="flex items-center gap-1.5 font-medium text-slate-900 dark:text-white"
                  aria-current="page"
                >
                  {isFirst && showHomeIcon && item.icon}
                  <span className="truncate max-w-[200px] sm:max-w-none">{item.label}</span>
                </span>
              ) : item.href ? (
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center gap-1.5 text-slate-600 dark:text-slate-400',
                    'hover:text-slate-900 dark:hover:text-white',
                    'transition-colors duration-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6] focus-visible:ring-offset-2 rounded',
                    'truncate max-w-[150px] sm:max-w-none'
                  )}
                >
                  {isFirst &&
                    showHomeIcon &&
                    (item.icon || <Home className="h-4 w-4 flex-shrink-0" />)}
                  <span className="truncate">{item.label}</span>
                </Link>
              ) : (
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  {isFirst && showHomeIcon && item.icon}
                  <span className="truncate max-w-[150px] sm:max-w-none">{item.label}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
