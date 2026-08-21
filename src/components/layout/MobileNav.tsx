import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  Users,
  FolderKanban,
  Settings,
  HelpCircle,
  X,
} from 'lucide-react';
import { IconButton } from '@/components/ui';
import { cn } from '@/utils/styles';

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: string;
}

const navigationItems: NavItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, href: '/dashboard' },
  { label: 'Analytics', icon: <BarChart3 className="h-5 w-5" />, href: '/analytics' },
  { label: 'Projects', icon: <FolderKanban className="h-5 w-5" />, href: '/projects', badge: '3' },
  { label: 'Team', icon: <Users className="h-5 w-5" />, href: '/team' },
  { label: 'Settings', icon: <Settings className="h-5 w-5" />, href: '/settings' },
  { label: 'Help', icon: <HelpCircle className="h-5 w-5" />, href: '/help' },
];

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const navRef = useRef<HTMLElement>(null);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen && navRef.current) {
      const firstFocusable = navRef.current.querySelector<HTMLElement>(
        'a, button, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1400]">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Mobile Navigation Drawer */}
      <nav
        ref={navRef}
        className={cn(
          'fixed top-0 left-0 bottom-0 z-10',
          'w-[280px] max-w-[85vw]',
          'bg-white dark:bg-slate-900',
          'border-r border-slate-200 dark:border-slate-800',
          'flex flex-col',
          'shadow-2xl',
          'transition-transform duration-300 ease-in-out',
          'animate-in slide-in-from-left-full'
        )}
        aria-label="Mobile navigation"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 text-white font-bold text-sm">
              P
            </div>
            <span className="text-lg font-semibold text-slate-900 dark:text-white">PulseBoard</span>
          </div>

          <IconButton
            icon={<X className="h-5 w-5" />}
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close navigation"
            className="text-slate-500 dark:text-slate-400"
          />
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1" role="list">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <NavLink
                  to={item.href}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium',
                      'transition-colors duration-200',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6] focus-visible:ring-offset-2',
                      isActive
                        ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-400'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                    )
                  }
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span
                      className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-violet-600 px-1.5 text-xs font-semibold text-white"
                      aria-label={`${item.badge} notifications`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 dark:border-slate-800 px-4 py-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">© 2024 PulseBoard</p>
        </div>
      </nav>
    </div>
  );
};
