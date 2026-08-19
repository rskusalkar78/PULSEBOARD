import React, { useEffect, useRef } from 'react';
import { cn } from '@/utils/styles';
import { X } from 'lucide-react';

export type DrawerSide = 'left' | 'right' | 'top' | 'bottom';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  side?: DrawerSide;
  children: React.ReactNode;
  className?: string;
  closeOnOutsideClick?: boolean;
}

const sidePositionMap: Record<DrawerSide, string> = {
  right: 'top-0 right-0 bottom-0 w-full max-w-md border-l animate-in slide-in-from-right-full',
  left: 'top-0 left-0 bottom-0 w-full max-w-md border-r animate-in slide-in-from-left-full',
  top: 'top-0 left-0 right-0 max-h-[80vh] border-b animate-in slide-in-from-top-full',
  bottom: 'bottom-0 left-0 right-0 max-h-[80vh] border-t animate-in slide-in-from-bottom-full',
};

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  side = 'right',
  children,
  className,
  closeOnOutsideClick = true,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      drawerRef.current?.focus();
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1400]">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in-0"
        onClick={closeOnOutsideClick ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div
        ref={drawerRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        className={cn(
          'fixed z-10 flex flex-col bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-6 shadow-2xl transition-transform focus:outline-none overflow-y-auto',
          sidePositionMap[side],
          className
        )}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] text-slate-500 dark:text-slate-400"
          aria-label="Close drawer"
        >
          <X className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>
  );
};
