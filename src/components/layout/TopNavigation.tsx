import React from 'react';
import { Menu, Search } from 'lucide-react';
import { IconButton } from '@/components/ui';
import { UserMenu } from './UserMenu';
import { NotificationButton } from './NotificationButton';
import { cn } from '@/utils/styles';

export interface TopNavigationProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  isMobile: boolean;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  onToggleSidebar,
  isSidebarOpen,
  isMobile,
}) => {
  const handleSearchClick = () => {
    // In a real app, this would open a search modal/command palette
    console.log('Open global search');
  };

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

        {/* Logo - Hidden on mobile to save space */}
        {!isMobile && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 text-white font-bold text-sm">
              P
            </div>
            <span className="hidden lg:block text-lg font-semibold text-slate-900 dark:text-white">
              PulseBoard
            </span>
          </div>
        )}

        {/* Mobile Logo - Only brand initial */}
        {isMobile && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 text-white font-bold text-sm">
            P
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Search Trigger */}
        <IconButton
          icon={<Search className="h-5 w-5" />}
          variant="ghost"
          size="md"
          onClick={handleSearchClick}
          aria-label="Open search"
          className="text-slate-700 dark:text-slate-300"
        />

        {/* Notification Button */}
        <NotificationButton />

        {/* User Menu */}
        <UserMenu />
      </div>
    </header>
  );
};
