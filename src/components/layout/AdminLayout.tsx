
import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { useLayout } from '@/contexts/LayoutContext';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const AdminLayout = () => {
  const { isSidebarOpen, closeSidebar } = useLayout();
  const isMobile = useIsMobile();
  const location = useLocation();

  // Close sidebar on route change when on mobile
  useEffect(() => {
    if (isMobile) {
      closeSidebar();
    }
  }, [location.pathname, isMobile, closeSidebar]);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop/Tablet Sidebar */}
      <Sidebar />
      
      <div className={cn(
        "flex flex-col flex-1 overflow-hidden",
        isMobile ? "w-full" : (isSidebarOpen ? "ml-64" : "ml-16")
      )}>
        <Header />
        <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6">
          <div className="max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
