import React, { useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  Users,
  FolderKanban,
  Settings,
  HelpCircle,
  ChevronLeft,
} from 'lucide-react';
import { IconButton } from '@/components/ui';
import { cn } from '@/utils/styles';

export interface SidebarProps {
  isOpen: boolean;
  isCollapsible?: boolean;
  onClose?: () => void;
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

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, isCollapsible = false, onClose }) => {
  const sidebarRef = useRef<HTMLElement>(null);

  // Focus management for accessibility
  useEffect(() => {
    if (isOpen && sidebarRef.current) {
      const firstFocusable = sidebarRef.current.querySelector<HTMLElement>(
        'a, button, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && isCollapsible && onClose) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, isCollapsible, onClose]);

  return (
    <>
      {/* Backdrop for tablet collapsible mode */}
      {isCollapsible && isOpen && (
        <div
          className="fixed inset-0 z-[1200] bg-black/20 backdrop-blur-sm transition-opacity animate-in fade-in-0"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={cn(
          'fixed top-0 left-0 z-[1250] h-screen',
          'bg-white dark:bg-slate-900',
          'border-r border-slate-200 dark:border-slate-800',
          'transition-transform duration-300 ease-in-out',
          'flex flex-col',
          // Width
          'w-64',
          // Transform based on open state
          isOpen ? 'translate-x-0' : '-translate-x-full',
          // Desktop: static positioning
          !isCollapsible && 'lg:translate-x-0'
        )}
        aria-label="Main navigation"
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 text-white font-bold text-sm">
              P
            </div>
            <span className="text-lg font-semibold text-slate-900 dark:text-white">PulseBoard</span>
          </div>

          {/* Close button for collapsible mode */}
          {isCollapsible && (
            <IconButton
              icon={<ChevronLeft className="h-5 w-5" />}
              variant="ghost"
              size="sm"
              onClick={onClose}
              aria-label="Close sidebar"
              className="text-slate-500 dark:text-slate-400"
            />
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1" role="list">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium',
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
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-slate-200 dark:border-slate-800 px-4 py-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">© 2024 PulseBoard</p>
        </div>
      </aside>
    </>
  );
};
