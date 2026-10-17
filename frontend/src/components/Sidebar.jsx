import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  MessageSquareText,
  Ticket,
  BookOpen,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  X,
  Bot
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { UserProfile } from './UserProfile';

export const Sidebar = ({
  isCollapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const { role, isAdmin } = useAuth();

  const navItems = [
    {
      name: 'Overview',
      path: isAdmin ? '/admin' : '/dashboard',
      icon: LayoutDashboard,
      roles: ['customer', 'support_agent', 'admin', 'super_admin'],
    },
    {
      name: 'AI Support Chat',
      path: '/chat',
      icon: MessageSquareText,
      roles: ['customer', 'support_agent', 'admin', 'super_admin'],
    },
    {
      name: 'Support Tickets',
      path: '/tickets',
      icon: Ticket,
      roles: ['customer', 'support_agent', 'admin', 'super_admin'],
    },
    {
      name: 'Knowledge Base',
      path: '/knowledge-base',
      icon: BookOpen,
      roles: ['customer', 'support_agent', 'admin', 'super_admin'],
    },
    {
      name: 'Analytics & KPIs',
      path: '/admin',
      icon: BarChart3,
      roles: ['support_agent', 'admin', 'super_admin'],
    },
  ];

  const filteredItems = navItems.filter((item) => item.roles.includes(role));

  const navContent = (
    <div className="flex flex-col justify-between h-full p-4 space-y-6 overflow-y-auto no-scrollbar">
      {/* Top Workspace Header & Logo */}
      <div className="space-y-4">
        <div
          className={`p-2.5 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center ${
            isCollapsed ? 'justify-center' : 'justify-between'
          } transition-all`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-md shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0 overflow-hidden">
                <p className="text-xs font-bold text-slate-800 dark:text-white tracking-tight truncate">
                  R Corporation
                </p>
                <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono truncate">
                  AI Support Hub
                </p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" title="System Online" />
          )}
        </div>

        {/* Navigation list */}
        <nav className="space-y-1.5" aria-label="Main Navigation">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                title={isCollapsed ? item.name : undefined}
                className={({ isActive }) =>
                  `flex items-center ${
                    isCollapsed ? 'justify-center px-2 py-3' : 'justify-between px-3.5 py-2.5'
                  } rounded-xl text-sm font-medium transition-all group relative ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`
                }
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" />
                  {!isCollapsed && <span className="truncate">{item.name}</span>}
                </div>
                {!isCollapsed && <ChevronRight className="w-3.5 h-3.5 opacity-30 shrink-0" />}

                {/* Tooltip for collapsed desktop mode */}
                {isCollapsed && (
                  <div className="hidden lg:group-hover:block absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl border border-slate-700 whitespace-nowrap z-50 pointer-events-none">
                    {item.name}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Theme Toggle, User Profile, Desktop Collapse Toggle */}
      <div className="space-y-2.5 pt-3 border-t border-slate-200 dark:border-slate-800/80">
        {/* 🌙 Theme Toggle Button */}
        <ThemeToggle isCollapsed={isCollapsed} />

        {/* 👤 User Profile + 🚪 Logout Button */}
        <UserProfile isCollapsed={isCollapsed} />

        {/* Desktop Collapse / Expand Button */}
        <button
          onClick={onToggleCollapse}
          type="button"
          className="hidden lg:flex w-full items-center justify-center p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors border border-slate-200 dark:border-slate-800 text-xs font-medium gap-2 cursor-pointer"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Permanent Desktop / Laptop Sidebar (Full screen height from top to bottom) */}
      <aside
        className={`hidden lg:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F19] transition-all duration-300 ease-in-out shrink-0 select-none sticky top-0 h-screen z-30 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {navContent}
      </aside>

      {/* 2. Mobile / Tablet Slide-In Drawer Navigation */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Slide-out drawer panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="relative w-72 max-w-[85vw] h-full bg-white dark:bg-[#0B0F19] border-r border-slate-200 dark:border-slate-800 shadow-2xl z-10 flex flex-col pt-4"
            >
              <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-200 dark:border-slate-800/60">
                <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                  Menu
                </span>
                <button
                  onClick={onCloseMobile}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  aria-label="Close drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {navContent}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
