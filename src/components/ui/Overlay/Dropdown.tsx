import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { cn } from '@/utils/styles';

interface DropdownContextValue {
  isOpen: boolean;
  close: () => void;
  toggle: () => void;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

export interface DropdownProps {
  children: React.ReactNode;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({ children, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <DropdownContext.Provider value={{ isOpen, close, toggle }}>
      <div ref={dropdownRef} className={cn('relative inline-block text-left', className)}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

export const DropdownTrigger: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  const context = useContext(DropdownContext);
  if (!context) throw new Error('DropdownTrigger must be used within a Dropdown');

  return (
    <div
      onClick={context.toggle}
      role="button"
      tabIndex={0}
      aria-haspopup="true"
      aria-expanded={context.isOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          context.toggle();
        }
      }}
      className={cn('inline-flex cursor-pointer', className)}
    >
      {children}
    </div>
  );
};

export interface DropdownContentProps {
  children: React.ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

export const DropdownContent: React.FC<DropdownContentProps> = ({
  children,
  align = 'left',
  className,
}) => {
  const context = useContext(DropdownContext);
  if (!context) throw new Error('DropdownContent must be used within a Dropdown');

  if (!context.isOpen) return null;

  return (
    <div
      role="menu"
      className={cn(
        'absolute z-[1500] mt-2 w-56 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 shadow-lg focus:outline-none animate-in fade-in-80 zoom-in-95',
        align === 'right' ? 'right-0' : 'left-0',
        className
      )}
    >
      {children}
    </div>
  );
};

export interface DropdownItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  danger?: boolean;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({
  children,
  icon,
  danger = false,
  className,
  onClick,
  disabled,
  ...props
}) => {
  const context = useContext(DropdownContext);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (onClick) onClick(e);
    context?.close();
  };

  return (
    <button
      role="menuitem"
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        'group flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm transition-colors text-left font-medium cursor-pointer',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
        danger
          ? 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50'
          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800',
        className
      )}
      {...props}
    >
      {icon && <span className="h-4 w-4 shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
    </button>
  );
};

export const DropdownSeparator: React.FC<{ className?: string }> = ({ className }) => (
  <div
    className={cn('-mx-1 my-1 h-[1px] bg-slate-100 dark:bg-slate-800', className)}
    role="separator"
  />
);

export const DropdownHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div
    className={cn(
      'px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500',
      className
    )}
  >
    {children}
  </div>
);
