import React, { useState } from 'react';
import { cn } from '@/utils/styles';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  fallback?: React.ReactNode;
}

const sizeClasses: Record<AvatarSize, string> = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
};

const statusSizeClasses: Record<AvatarSize, string> = {
  xs: 'h-1.5 w-1.5 ring-1',
  sm: 'h-2 w-2 ring-1.5',
  md: 'h-2.5 w-2.5 ring-2',
  lg: 'h-3 w-3 ring-2',
  xl: 'h-4 w-4 ring-2',
};

const statusColorClasses: Record<AvatarStatus, string> = {
  online: 'bg-emerald-500',
  offline: 'bg-slate-400',
  busy: 'bg-rose-500',
  away: 'bg-amber-500',
};

function getInitials(name?: string): string {
  if (!name) return '?';
  const parts = name.trim().split(' ').filter(Boolean);
  const firstPart = parts[0];
  if (!firstPart) return '?';
  if (parts.length === 1) return firstPart.charAt(0).toUpperCase();
  const lastPart = parts[parts.length - 1];
  const first = firstPart.charAt(0);
  const last = lastPart ? lastPart.charAt(0) : '';
  return (first + last).toUpperCase();
}

export const Avatar: React.FC<AvatarProps> = ({
  className,
  src,
  alt = '',
  name,
  size = 'md',
  status,
  fallback,
  ...props
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative inline-block select-none" {...props}>
      <div
        className={cn(
          'relative flex items-center justify-center overflow-hidden rounded-full font-semibold bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600',
          sizeClasses[size],
          className
        )}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover"
          />
        ) : fallback ? (
          fallback
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full ring-white dark:ring-slate-900',
            statusSizeClasses[size],
            statusColorClasses[status]
          )}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number;
  children: React.ReactNode;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({ children, max, className, ...props }) => {
  const childrenArray = React.Children.toArray(children);
  const visibleAvatars = max ? childrenArray.slice(0, max) : childrenArray;
  const remainingCount = max && childrenArray.length > max ? childrenArray.length - max : 0;

  return (
    <div className={cn('flex items-center -space-x-2 overflow-hidden', className)} {...props}>
      {visibleAvatars.map((child, idx) => (
        <div key={idx} className="inline-block ring-2 ring-white dark:ring-slate-900 rounded-full">
          {child}
        </div>
      ))}
      {remainingCount > 0 && (
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200 ring-2 ring-white dark:ring-slate-900 border border-slate-300 dark:border-slate-700">
          +{remainingCount}
        </div>
      )}
    </div>
  );
};
