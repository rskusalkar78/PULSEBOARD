import React, { useState, useRef, useEffect, createContext, useContext, useCallback } from 'react';
import { cn } from '@/utils/styles';

interface DropdownContextValue {
  isOpen: boolean;
  close: () => void;
  toggle: () => void;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

export interface DropdownItemConfig {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
}

export interface DropdownProps {
  children?: React.ReactNode;
  className?: string;
  /** Shorthand: render a trigger button + items list without compound components */
  trigger?: React.ReactNode;
  items?: DropdownItemConfig[];
  align?: 'left' | 'right';
}

export const Dropdown: React.FC<DropdownProps> = ({
  children,
  className,
  trigger,
  items,
  align = 'right',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <DropdownContext.Provider value={{ isOpen, close, toggle }}>
      <div ref={dropdownRef} className={cn('relative inline-block text-left', className)}>
        {children ? (
          children
        ) : (
          <>
            {/*
             * Shorthand API: <Dropdown trigger={<button>} items={[...]} />
             * We render the trigger element cloned with onClick/aria props injected
             * directly onto the element itself — avoiding an extra wrapper div that
             * would create a double-click handler problem when the trigger is already
             * a button with its own onClick.
             */}
            {trigger && (
              <ShorthandTrigger toggle={toggle} isOpen={isOpen}>
                {trigger}
              </ShorthandTrigger>
            )}
            {items && (
              <DropdownContent align={align}>
                {items.map((item) => (
                  <DropdownItem
                    key={item.id}
                    icon={item.icon}
                    danger={item.danger}
                    disabled={item.disabled}
                    onClick={item.onClick}
                  >
                    {item.label}
                  </DropdownItem>
                ))}
              </DropdownContent>
            )}
          </>
        )}
      </div>
    </DropdownContext.Provider>
  );
};

/**
 * Internal helper that clones the trigger element and injects toggle/aria props.
 * This avoids wrapping a <button> inside a <div role="button">, which would
 * create accessibility violations and double event firing.
 */
const ShorthandTrigger: React.FC<{
  children: React.ReactNode;
  toggle: () => void;
  isOpen: boolean;
}> = ({ children, toggle, isOpen }) => {
  const child = React.Children.only(children) as React.ReactElement<
    React.HTMLAttributes<HTMLElement> & { 'aria-expanded'?: boolean; 'aria-haspopup'?: boolean }
  >;

  return React.cloneElement(child, {
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation();
      // Preserve original onClick if present
      if (child.props.onClick) {
        (child.props.onClick as React.MouseEventHandler)(e as React.MouseEvent<HTMLElement>);
      }
      toggle();
    },
    'aria-expanded': isOpen,
    'aria-haspopup': true,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
      // Preserve original onKeyDown if present
      if (child.props.onKeyDown) {
        (child.props.onKeyDown as React.KeyboardEventHandler)(
          e as React.KeyboardEvent<HTMLElement>
        );
      }
    },
  });
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
        // Use absolute positioning within the relative parent, z-index high enough
        // to escape any stacking context but not relying on overflow-visible on ancestors.
        // The parent <Dropdown> div is position:relative so this anchors correctly.
        'absolute z-[1500] mt-2 w-56 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 shadow-lg shadow-black/20 focus:outline-none',
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
      type="button"
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
      {icon && <span className="h-4 w-4 shrink-0 flex items-center justify-center">{icon}</span>}
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
