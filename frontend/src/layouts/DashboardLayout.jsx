import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { MobileHeader } from '../components/MobileHeader';
import { useSidebar } from '../hooks/useSidebar';

export const DashboardLayout = ({ children }) => {
  const {
    isCollapsed,
    isMobileOpen,
    toggle: toggleSidebar,
    openMobile: openMobileSidebar,
    closeMobile: closeMobileSidebar,
  } = useSidebar();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 flex w-full transition-colors duration-200">
      {/* Left Sidebar Navigation (Desktop Fixed, Mobile Slide-In Drawer) */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleSidebar}
        isMobileOpen={isMobileOpen}
        onCloseMobile={closeMobileSidebar}
      />

      {/* Main Content Area: Shifts completely upward, utilizes full viewport height */}
      <div className="flex-1 flex flex-col min-w-0 w-full overflow-x-hidden">
        {/* Compact header for mobile/tablet to toggle sidebar */}
        <MobileHeader onOpenSidebar={openMobileSidebar} />

        {/* Dashboard Page View (Full Screen Height, No Top Nav on Desktop) */}
        <main className="flex-1 w-full min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
