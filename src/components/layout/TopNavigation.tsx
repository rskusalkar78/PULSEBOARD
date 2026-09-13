import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  X,
  FolderKanban,
  BarChart3,
  Users,
  Settings,
  LayoutDashboard,
  FileText,
} from 'lucide-react';
import { IconButton } from '@/components/ui';
import { UserMenu } from './UserMenu';
import { NotificationButton } from './NotificationButton';
import { cn } from '@/utils/styles';

export interface TopNavigationProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  isMobile?: boolean;
}

interface SearchResult {
  id: string;
  title: string;
  category: string;
  href: string;
  icon: React.ReactNode;
}

const SEARCH_ITEMS: SearchResult[] = [
  {
    id: '1',
    title: 'PulseBoard Redesign',
    category: 'Project',
    href: '/projects',
    icon: <FolderKanban className="h-4 w-4 text-violet-500" />,
  },
  {
    id: '2',
    title: 'Analytics Pipeline',
    category: 'Project',
    href: '/projects',
    icon: <FolderKanban className="h-4 w-4 text-cyan-500" />,
  },
  {
    id: '3',
    title: 'Mobile App Support',
    category: 'Project',
    href: '/projects',
    icon: <FolderKanban className="h-4 w-4 text-amber-500" />,
  },
  {
    id: '4',
    title: 'Analytics Overview',
    category: 'Page',
    href: '/analytics',
    icon: <BarChart3 className="h-4 w-4 text-blue-500" />,
  },
  {
    id: '5',
    title: 'Team Members & Roles',
    category: 'Page',
    href: '/team',
    icon: <Users className="h-4 w-4 text-emerald-500" />,
  },
  {
    id: '6',
    title: 'Workspace Settings',
    category: 'Page',
    href: '/settings',
    icon: <Settings className="h-4 w-4 text-slate-500" />,
  },
  {
    id: '7',
    title: 'Dashboard Metrics',
    category: 'Page',
    href: '/dashboard',
    icon: <LayoutDashboard className="h-4 w-4 text-purple-500" />,
  },
  {
    id: '8',
    title: 'Database Schema Audit',
    category: 'Task',
    href: '/projects',
    icon: <FileText className="h-4 w-4 text-rose-500" />,
  },
];

export const TopNavigation: React.FC<TopNavigationProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredResults = searchQuery.trim()
    ? SEARCH_ITEMS.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : SEARCH_ITEMS.slice(0, 5);

  const handleSelectResult = (href: string) => {
    setIsOpen(false);
    setSearchQuery('');
    navigate(href);
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

        {/* Logo - Only shown when sidebar is closed/collapsed to avoid duplicate brand header */}
        {!isSidebarOpen && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 text-white font-bold text-sm">
              P
            </div>
            <span className="text-lg font-semibold text-slate-900 dark:text-white">PulseBoard</span>
          </div>
        )}

        {/* Desktop Global Search Bar */}
        <div ref={searchRef} className="relative hidden md:block w-72 lg:w-96 ml-2">
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search projects, tasks, pages... (Ctrl+K)"
              value={searchQuery}
              onFocus={() => setIsOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsOpen(true);
              }}
              className="w-full pl-9 pr-8 py-1.5 text-sm rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Search Dropdown Popup */}
          {isOpen && (
            <div className="absolute left-0 right-0 top-full mt-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden z-50 animate-in fade-in-0 slide-in-from-top-2">
              <div className="p-2 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-400 px-3 font-medium">
                <span>{searchQuery ? 'Search Results' : 'Suggested Searches'}</span>
                <span>ESC to close</span>
              </div>
              <div className="max-h-72 overflow-y-auto p-1 divide-y divide-slate-100 dark:divide-slate-800/50">
                {filteredResults.length > 0 ? (
                  filteredResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleSelectResult(result.href)}
                      className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors shrink-0">
                          {result.icon}
                        </div>
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                          {result.title}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded shrink-0">
                        {result.category}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-slate-500">
                    No results found for &quot;{searchQuery}&quot;
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Search Button */}
        <IconButton
          icon={<Search className="h-5 w-5" />}
          variant="ghost"
          size="md"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open search"
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
