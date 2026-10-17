import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle = ({
  isCollapsed = false,
  className = '',
  showLabel = true,
}) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`w-full flex items-center ${
        isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3.5 py-2'
      } rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer border ${
        isDark
          ? 'bg-slate-900/80 hover:bg-slate-800 text-amber-300 border-slate-800 hover:border-amber-500/30'
          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-indigo-300 shadow-sm'
      } ${className}`}
      title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className={`w-6 h-6 rounded-lg flex items-center justify-center transition-transform duration-300 shrink-0 ${
            isDark ? 'bg-amber-400/10 text-amber-300' : 'bg-indigo-50 text-indigo-600'
          }`}
        >
          {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </div>
        {!isCollapsed && showLabel && (
          <span className="truncate">
            {isDark ? 'Light Theme' : 'Dark Theme'}
          </span>
        )}
      </div>

      {!isCollapsed && (
        <span
          className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded shrink-0 ${
            isDark
              ? 'bg-amber-400/15 text-amber-300 border border-amber-400/20'
              : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
          }`}
        >
          {isDark ? 'DARK' : 'LIGHT'}
        </span>
      )}
    </button>
  );
};
