import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, HelpCircle, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/ui';
import { cn } from '@/utils/styles';

export const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuItemClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="relative">
      {/* User Menu Button */}
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className={cn(
          'flex items-center gap-2 rounded-lg px-2 py-1.5',
          'transition-colors duration-200',
          'hover:bg-slate-100 dark:hover:bg-slate-800',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6] focus-visible:ring-offset-2',
          'text-slate-700 dark:text-slate-300'
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User menu"
      >
        <Avatar
          {...(user.avatarUrl && { src: user.avatarUrl })}
          name={user.name}
          size="sm"
          className="ring-2 ring-white dark:ring-slate-900"
        />
        <span className="hidden sm:block text-sm font-medium max-w-[120px] truncate">
          {user.name}
        </span>
        <ChevronDown
          className={cn(
            'hidden sm:block h-4 w-4 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className={cn(
            'absolute right-0 top-full mt-2 w-64',
            'bg-white dark:bg-slate-900',
            'border border-slate-200 dark:border-slate-800',
            'rounded-lg shadow-lg',
            'py-2',
            'z-[1350]',
            'animate-in fade-in-0 slide-in-from-top-2 duration-200'
          )}
          role="menu"
          aria-orientation="vertical"
        >
          {/* User Info */}
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <Avatar {...(user.avatarUrl && { src: user.avatarUrl })} name={user.name} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
            <div className="mt-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-400">
                {user.role}
              </span>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              onClick={() => handleMenuItemClick(() => navigate('/profile'))}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-2 text-sm',
                'text-slate-700 dark:text-slate-300',
                'hover:bg-slate-100 dark:hover:bg-slate-800',
                'transition-colors duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#8b5cf6]'
              )}
              role="menuitem"
            >
              <User className="h-4 w-4" />
              <span>View Profile</span>
            </button>

            <button
              onClick={() => handleMenuItemClick(() => navigate('/settings'))}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-2 text-sm',
                'text-slate-700 dark:text-slate-300',
                'hover:bg-slate-100 dark:hover:bg-slate-800',
                'transition-colors duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#8b5cf6]'
              )}
              role="menuitem"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>

            <button
              onClick={() => handleMenuItemClick(() => navigate('/help'))}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-2 text-sm',
                'text-slate-700 dark:text-slate-300',
                'hover:bg-slate-100 dark:hover:bg-slate-800',
                'transition-colors duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#8b5cf6]'
              )}
              role="menuitem"
            >
              <HelpCircle className="h-4 w-4" />
              <span>Help & Support</span>
            </button>
          </div>

          {/* Logout */}
          <div className="border-t border-slate-200 dark:border-slate-800 py-1">
            <button
              onClick={() => handleMenuItemClick(handleLogout)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-2 text-sm',
                'text-rose-600 dark:text-rose-400',
                'hover:bg-rose-50 dark:hover:bg-rose-950/20',
                'transition-colors duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#8b5cf6]'
              )}
              role="menuitem"
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
