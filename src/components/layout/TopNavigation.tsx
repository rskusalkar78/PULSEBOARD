import React from 'react';
import { Menu, Search } from 'lucide-react';
import { IconButton } from '@/components/ui';
import { UserMenu } from './UserMenu';
import { NotificationButton } from './NotificationButton';
import { useGlobalSearch } from '@/contexts';
import { cn } from '@/utils/styles';

export interface TopNavigationProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  isMobile?: boolean;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { openSearch } = useGlobalSearch();

  return (
    <header
      className={cn(
        'sticky top-0 z-[1300] flex h-16 items-center justify-between',
        'bg-white dark:bg-slate-900',
        'border-b border-slate-200 dark:border-slate-800',
        'px-4 sm:px-6 lg:px-8',
        'transition-all duration-300 ease-in-out'
      )}
    >
      {/* Left Section */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Sidebar Toggle */}
        <IconButton
          icon={<Menu className="h-5 w-5" />}
          variant="ghost"
          size="md"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          aria-expanded={isSidebarOpen}
          className="text-slate-700 dark:text-slate-300"
        />

        {/* Logo — only shown when sidebar is closed */}
        {!isSidebarOpen && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 text-white font-bold text-sm">
              P
            </div>
            <span className="text-lg font-semibold text-slate-900 dark:text-white">PulseBoard</span>
          </div>
        )}

        {/* Desktop Global Search Bar Trigger */}
        <div className="hidden md:block w-72 lg:w-96 ml-2">
          <button
            type="button"
            id="global-search-trigger"
            onClick={openSearch}
            aria-label="Open global search (Cmd+K)"
            className="w-full flex items-center justify-between pl-3 pr-2.5 py-1.5 text-sm rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-500 dark:text-slate-400 hover:border-violet-500/50 hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-all text-left shadow-xs group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Search className="h-4 w-4 text-slate-400 group-hover:text-violet-500 transition-colors shrink-0" />
              <span className="truncate">Search projects, tasks, users, activities...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-semibold text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded shadow-xs shrink-0">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Search Button */}
        <IconButton
          icon={<Search className="h-5 w-5" />}
          variant="ghost"
          size="md"
          onClick={openSearch}
          aria-label="Open global search"
          className="md:hidden text-slate-700 dark:text-slate-300"
        />

        {/* Notification Button */}
        <NotificationButton />

        {/* User Menu */}
        <UserMenu />
      </div>
    </header>
  );
};
