import React, { createContext, useContext, useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
}

const SIDEBAR_STATE_KEY = 'sidebar-state';

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isMobile = useIsMobile();
  
  // Initialize sidebar state from localStorage, default to closed (false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    // Try to get saved state from localStorage
    const savedState = localStorage.getItem(SIDEBAR_STATE_KEY);
    // If we have a saved state, use it; otherwise use false (collapsed) as default
    // On mobile, always default to closed regardless of saved state
    if (isMobile) return false;
    return savedState !== null ? savedState === 'true' : false;
  });
  
  // Removed the useEffect that forced sidebar closed on mobile resize.
  // The initial state now handles defaulting to closed on mobile load.

  // Save sidebar state to localStorage whenever it changes, but maybe not on mobile?
  // Let's keep saving it for now, user might want persistence even on mobile if they expand it.
  useEffect(() => {
    localStorage.setItem(SIDEBAR_STATE_KEY, isSidebarOpen.toString());
  }, [isSidebarOpen]);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <LayoutContext.Provider value={{ isSidebarOpen, toggleSidebar, openSidebar, closeSidebar }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = (): LayoutContextType => {
  const context = useContext(LayoutContext);
  
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  
  return context;
};
