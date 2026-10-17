import React from 'react';
import { Menu } from 'lucide-react';
import { Bot } from 'lucide-react';

export const MobileHeader = ({ onOpenSidebar }) => {
  return (
    <header className="lg:hidden sticky top-0 z-30 h-14 w-full bg-white/95 dark:bg-[#0B0F19]/95 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md px-4 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          type="button"
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            <Bot className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-slate-900 dark:text-white tracking-tight">
            R Corporation
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>Online</span>
      </div>
    </header>
  );
};
