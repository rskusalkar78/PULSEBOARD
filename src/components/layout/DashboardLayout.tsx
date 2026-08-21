import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { TopNavigation } from './TopNavigation';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { cn } from '@/utils/styles';

export interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Detect viewport size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);

      // Auto-open sidebar on desktop, close on mobile/tablet initially
      if (width >= 1024) {
        setIsSidebarOpen(true);
        setIsMobileNavOpen(false);
      } else if (width < 768) {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggleSidebar = () => {
    if (isMobile) {
      setIsMobileNavOpen(!isMobileNavOpen);
    } else {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const handleCloseMobileNav = () => {
    setIsMobileNavOpen(false);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Desktop & Tablet Sidebar */}
      {!isMobile && (
        <Sidebar
          isOpen={isSidebarOpen}
          isCollapsible={isTablet}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Navigation Drawer */}
      {isMobile && <MobileNav isOpen={isMobileNavOpen} onClose={handleCloseMobileNav} />}

      {/* Main Content Area */}
      <div
        className={cn(
          'flex flex-1 flex-col overflow-hidden',
          'transition-all duration-300 ease-in-out',
          // Add left margin on desktop when sidebar is open and persistent
          !isMobile && !isTablet && isSidebarOpen && 'ml-64',
          // Full width when sidebar is closed or on tablet/mobile
          (!isSidebarOpen || isTablet || isMobile) && 'ml-0'
        )}
      >
        {/* Top Navigation */}
        <TopNavigation
          onToggleSidebar={handleToggleSidebar}
          isSidebarOpen={isSidebarOpen}
          isMobile={isMobile}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-slate-950">
          <div className="w-full px-4 py-6 sm:px-6 lg:px-8 max-w-[1920px] mx-auto">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
};
