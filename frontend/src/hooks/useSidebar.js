import { useState, useEffect, useCallback } from 'react';

const SIDEBAR_KEY = 'rcorp_sidebar_state';

export function useSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem(SIDEBAR_KEY);
      return saved === 'collapsed';
    } catch {
      return false;
    }
  });

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_KEY, isCollapsed ? 'collapsed' : 'expanded');
    } catch { /* noop */ }
  }, [isCollapsed]);

  // Close mobile drawer on route change or resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  const toggle = useCallback(() => setIsCollapsed(prev => !prev), []);
  const openMobile = useCallback(() => setIsMobileOpen(true), []);
  const closeMobile = useCallback(() => setIsMobileOpen(false), []);

  return {
    isCollapsed,
    isMobileOpen,
    toggle,
    openMobile,
    closeMobile,
    setIsCollapsed,
  };
}
